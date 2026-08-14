import { useState, useMemo, useEffect, useRef } from 'react'
import { learningManual } from '../data/learningManual.js'

// 语言模式
const LANG = {
  ZH: 'zh',   // 仅中文
  EN: 'en',   // 仅英文
  BI: 'bi',   // 双语
}

const LANG_LABEL = { zh: '中文', en: 'EN', bi: '双语' }

// localStorage 持久化阅读位置的 key
const POSITION_KEY = 'patternai_manual_position'

// 仅注入一次响应式样式（目录网格 + 详情页吸顶条 + 移动端 430px 适配）
const STYLE_ID = 'learning-manual-responsive'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement('style')
  styleEl.id = STYLE_ID
  styleEl.textContent = `
/* 目录网格：默认单列，窄屏更紧凑 */
.lm-toc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
/* 目录章节卡片交互 */
.lm-toc-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.lm-toc-card:active {
  transform: scale(0.985);
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.18);
}
/* 详情页顶部条吸顶 */
.lm-detail-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
}
/* 小节切换条隐藏滚动条 */
.lm-section-bar {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.lm-section-bar::-webkit-scrollbar { display: none; }

/* 移动端适配（max-width: 430px） */
@media (max-width: 430px) {
  .lm-hero { padding: 16px 14px !important; }
  .lm-toc-grid { gap: 10px; }
  .lm-toc-card { padding: 12px 13px !important; }
  .lm-detail-topbar { padding: 8px 12px !important; }
  .lm-chapter-card { padding: 14px !important; }
  .lm-section-content { padding: 14px !important; }
  .lm-pager-btn { padding: 10px 0 !important; font-size: 12.5px !important; }
}
`
  document.head.appendChild(styleEl)
}

// 读取已保存的阅读位置（{ chapterId, sectionId }），无效时返回 null
function loadPosition() {
  try {
    const raw = localStorage.getItem(POSITION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data.chapterId) return null
    const ch = learningManual.chapters.find(c => c.id === data.chapterId)
    if (!ch) return null
    const sectionId = ch.sections.find(s => s.id === data.sectionId)
      ? data.sectionId
      : ch.sections[0].id
    return { chapterId: ch.id, sectionId }
  } catch {
    return null
  }
}

// 语言切换器
function LangSwitch({ lang, setLang, compact }) {
  return (
    <div style={{ ...styles.langSwitch, ...(compact ? styles.langSwitchCompact : {}) }}>
      {[LANG.ZH, LANG.EN, LANG.BI].map(l => (
        <span
          key={l}
          style={{
            ...styles.langBtn,
            ...(lang === l ? styles.langBtnActive : {}),
          }}
          onClick={() => setLang(l)}
        >
          {LANG_LABEL[l]}
        </span>
      ))}
    </div>
  )
}

export default function LearningManual() {
  // 首次渲染：尝试恢复上次阅读位置
  const saved = useMemo(() => loadPosition(), [])
  const [view, setView] = useState(saved ? 'detail' : 'toc') // 'toc' | 'detail'
  const [activeChapterId, setActiveChapterId] = useState(
    saved?.chapterId || learningManual.chapters[0].id
  )
  const [activeSectionId, setActiveSectionId] = useState(
    saved?.sectionId || learningManual.chapters[0].sections[0].id
  )
  const [lang, setLang] = useState(LANG.BI)
  const topRef = useRef(null)

  const activeChapter = useMemo(
    () => learningManual.chapters.find(c => c.id === activeChapterId) || learningManual.chapters[0],
    [activeChapterId]
  )

  const activeSection = useMemo(
    () => activeChapter.sections.find(s => s.id === activeSectionId) || activeChapter.sections[0],
    [activeChapter, activeSectionId]
  )

  // 当前章节在全书中的序号
  const chapterIndex = learningManual.chapters.findIndex(c => c.id === activeChapterId)

  // 持久化阅读位置：章节 / 小节变化时写入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        POSITION_KEY,
        JSON.stringify({ chapterId: activeChapterId, sectionId: activeSectionId })
      )
    } catch {
      /* 忽略写入失败（隐私模式等） */
    }
  }, [activeChapterId, activeSectionId])

  // 视图或小节切换时，滚动回顶部（滚动容器为最近的 .page-content）
  useEffect(() => {
    const el = topRef.current
    if (!el) return
    const scroller = el.closest('.page-content') || el.parentElement
    if (scroller && typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [view, activeChapterId, activeSectionId])

  // 是否显示中文 / 英文
  const showZh = lang === LANG.ZH || lang === LANG.BI
  const showEn = lang === LANG.EN || lang === LANG.BI

  // 从目录点击某章节卡片 -> 进入该章节（首节）
  const handleOpenChapter = (chapterId) => {
    const ch = learningManual.chapters.find(c => c.id === chapterId)
    if (!ch) return
    setActiveChapterId(chapterId)
    setActiveSectionId(ch.sections[0].id)
    setView('detail')
  }

  // 返回目录
  const handleBackToToc = () => setView('toc')

  // 全书范围内的扁平小节序列，用于跨章节翻页
  const flatSections = useMemo(() => {
    const arr = []
    learningManual.chapters.forEach(ch => {
      ch.sections.forEach(sec => arr.push({ chapterId: ch.id, sectionId: sec.id }))
    })
    return arr
  }, [])

  const currentFlatIdx = flatSections.findIndex(
    f => f.chapterId === activeChapterId && f.sectionId === activeSectionId
  )
  const hasPrev = currentFlatIdx > 0
  const hasNext = currentFlatIdx >= 0 && currentFlatIdx < flatSections.length - 1

  const handlePrev = () => {
    if (!hasPrev) return
    const prev = flatSections[currentFlatIdx - 1]
    setActiveChapterId(prev.chapterId)
    setActiveSectionId(prev.sectionId)
  }

  const handleNext = () => {
    if (!hasNext) return
    const next = flatSections[currentFlatIdx + 1]
    setActiveChapterId(next.chapterId)
    setActiveSectionId(next.sectionId)
  }

  return (
    <div className="fade-in" style={styles.wrapper} ref={topRef}>
      {view === 'toc' ? (
        /* ==================== 目录页 ==================== */
        <>
          {/* 顶部标题区 */}
          <div className="lm-hero" style={styles.hero}>
            <div style={styles.heroIcon}>📚</div>
            <h2 style={styles.heroTitle}>
              {showZh && learningManual.title}
              {showEn && (showZh
                ? <span style={styles.heroTitleEn}> / {learningManual.titleEn}</span>
                : learningManual.titleEn)}
            </h2>
            <p style={styles.heroSub}>
              {showZh && learningManual.subtitle}
              {showEn && (showZh ? <br /> : '')}
              {showEn && learningManual.subtitleEn}
            </p>

            <LangSwitch lang={lang} setLang={setLang} />
          </div>

          {/* 目录章节卡片列表 */}
          <div className="lm-toc-grid" style={styles.tocGrid}>
            {learningManual.chapters.map((ch, i) => (
              <div
                key={ch.id}
                className="lm-toc-card"
                style={styles.tocCard}
                onClick={() => handleOpenChapter(ch.id)}
              >
                <div style={styles.tocCardIcon}>{ch.icon}</div>
                <div style={styles.tocCardBody}>
                  <div style={styles.tocCardNum}>
                    {showZh && `第 ${i + 1} 章`}
                    {showEn && (showZh
                      ? <span style={styles.tocCardNumEn}> · Chapter {i + 1}</span>
                      : `Chapter ${i + 1}`)}
                  </div>
                  <div style={styles.tocCardTitle}>
                    {showZh && ch.title}
                    {showEn && (showZh
                      ? <span style={styles.tocCardTitleEn}> · {ch.titleEn}</span>
                      : ch.titleEn)}
                  </div>
                  <div style={styles.tocCardDesc}>
                    {showZh && ch.description}
                    {showEn && (showZh
                      ? <span style={styles.tocCardDescEn}>{ch.descriptionEn}</span>
                      : ch.descriptionEn)}
                  </div>
                </div>
                <div style={styles.tocCardArrow}>›</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ==================== 章节内容页 ==================== */
        <>
          {/* 顶部条：返回目录 + 语言切换 */}
          <div className="lm-detail-topbar" style={styles.detailTopBar}>
            <span style={styles.backBtn} onClick={handleBackToToc}>
              <span style={styles.backArrow}>‹</span>
              {showZh ? '返回目录' : 'Contents'}
              {showEn && showZh && <span style={styles.backBtnEn}> / Contents</span>}
            </span>
            <LangSwitch lang={lang} setLang={setLang} compact />
          </div>

          {/* 章节标题卡 */}
          <div className="lm-chapter-card" style={styles.chapterCard}>
            <div style={styles.chapterCardHead}>
              <span style={styles.chapterCardIcon}>{activeChapter.icon}</span>
              <div style={styles.chapterCardInfo}>
                <div style={styles.chapterCardBadge}>
                  {showZh && `第 ${chapterIndex + 1} 章`}
                  {showEn && (showZh
                    ? <span style={styles.badgeEn}> · Chapter {chapterIndex + 1}</span>
                    : `Chapter ${chapterIndex + 1}`)}
                  <span style={styles.badgeTotal}> / {learningManual.chapters.length}</span>
                </div>
                <h3 style={styles.chapterCardTitle}>
                  {showZh && activeChapter.title}
                  {showEn && (showZh
                    ? <span style={styles.titleEnInline}> / {activeChapter.titleEn}</span>
                    : activeChapter.titleEn)}
                </h3>
                <p style={styles.chapterCardDesc}>
                  {showZh && activeChapter.description}
                  {showEn && (showZh ? <br /> : '')}
                  {showEn && activeChapter.descriptionEn}
                </p>
              </div>
            </div>
          </div>

          {/* 当前章节的 section 切换条 */}
          <div className="lm-section-bar" style={styles.sectionBar}>
            {activeChapter.sections.map(sec => (
              <span
                key={sec.id}
                style={{
                  ...styles.sectionTab,
                  ...(sec.id === activeSectionId ? styles.sectionTabActive : {}),
                }}
                onClick={() => setActiveSectionId(sec.id)}
              >
                {showZh ? sec.title : sec.titleEn}
              </span>
            ))}
          </div>

          {/* Section 详细内容 */}
          <div
            key={activeSection.id}
            className="slide-up lm-section-content"
            style={styles.sectionContent}
          >
            <h4 style={styles.sectionTitle}>
              {showZh && activeSection.title}
              {showEn && (showZh
                ? <span style={styles.titleEnInline}> / {activeSection.titleEn}</span>
                : activeSection.titleEn)}
            </h4>

            {showZh && (
              <p style={styles.sectionText}>{activeSection.content}</p>
            )}
            {showEn && (
              <p style={showZh ? styles.sectionTextEn : styles.sectionText}>
                {activeSection.contentEn}
              </p>
            )}

            {/* 技巧提示 */}
            {activeSection.tips && activeSection.tips.length > 0 && (
              <div style={styles.tipsBox}>
                <div style={styles.tipsHeader}>
                  💡 {showZh ? '技巧提示' : 'Tips'}
                  {showEn && showZh && <span style={styles.tipsHeaderEn}> / Tips</span>}
                </div>
                {activeSection.tips.map((tip, i) => {
                  // tips 偶数下标为中文，奇数下标为英文（数据约定）
                  const isZhTip = i % 2 === 0
                  if (lang === LANG.ZH && !isZhTip) return null
                  if (lang === LANG.EN && isZhTip) return null
                  return (
                    <div
                      key={i}
                      style={{
                        ...styles.tipItem,
                        borderLeft: isZhTip ? '3px solid var(--primary)' : '3px solid var(--accent)',
                        background: isZhTip ? 'rgba(108, 92, 231, 0.06)' : 'rgba(0, 206, 201, 0.06)',
                        color: isZhTip ? 'var(--text)' : 'var(--text-secondary)',
                        fontStyle: isZhTip ? 'normal' : 'italic',
                      }}
                    >
                      {tip}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 翻页：上一节 / 下一节（跨章节连续阅读） */}
          <div style={styles.pager}>
            {hasPrev ? (
              <span className="lm-pager-btn" style={styles.pagerBtn} onClick={handlePrev}>
                ‹ {showZh ? '上一节' : 'Prev'}
              </span>
            ) : (
              <span className="lm-pager-btn" style={styles.pagerBtnDisabled}>
                ‹ {showZh ? '上一节' : 'Prev'}
              </span>
            )}
            {hasNext ? (
              <span
                className="lm-pager-btn"
                style={{ ...styles.pagerBtn, ...styles.pagerBtnRight }}
                onClick={handleNext}
              >
                {showZh ? '下一节' : 'Next'} ›
              </span>
            ) : (
              <span
                className="lm-pager-btn"
                style={{ ...styles.pagerBtnDisabled, ...styles.pagerBtnRight }}
              >
                {showZh ? '下一节' : 'Next'} ›
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ==================== 内联样式 ====================
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 8,
  },

  // ---------- 顶部标题区（目录页） ----------
  hero: {
    margin: '0 16px',
    padding: '20px 18px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.10), rgba(0, 206, 201, 0.06))',
    textAlign: 'center',
  },
  heroIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  heroTitleEn: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--text-secondary)',
  },
  heroSub: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginTop: 4,
  },

  // ---------- 语言切换 ----------
  langSwitch: {
    display: 'inline-flex',
    marginTop: 12,
    background: 'var(--card-bg)',
    borderRadius: 20,
    padding: 3,
    boxShadow: 'var(--shadow)',
  },
  langSwitchCompact: {
    marginTop: 0,
    padding: 2,
  },
  langBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-light)',
    padding: '5px 14px',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    color: '#fff',
  },

  // ---------- 目录章节卡片 ----------
  tocGrid: {
    margin: '0 16px',
  },
  tocCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid transparent',
    cursor: 'pointer',
  },
  tocCardIcon: {
    fontSize: 26,
    flexShrink: 0,
    width: 46,
    height: 46,
    borderRadius: 13,
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.12), rgba(0, 206, 201, 0.08))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tocCardBody: {
    flex: 1,
    minWidth: 0,
  },
  tocCardNum: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--primary)',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  tocCardNumEn: {
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  tocCardTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--text)',
    lineHeight: 1.35,
    marginBottom: 3,
  },
  tocCardTitleEn: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  tocCardDesc: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.55,
  },
  tocCardDescEn: {
    display: 'block',
    fontSize: 11,
    color: 'var(--text-light)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  tocCardArrow: {
    flexShrink: 0,
    fontSize: 22,
    fontWeight: 300,
    color: 'var(--text-light)',
    lineHeight: 1,
  },

  // ---------- 详情页顶部条 ----------
  detailTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    margin: '0 16px',
    padding: '10px 14px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--primary)',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  backArrow: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1,
    marginTop: -1,
  },
  backBtnEn: {
    fontSize: 11,
    fontWeight: 400,
    color: 'var(--text-light)',
  },

  // ---------- 章节标题卡 ----------
  chapterCard: {
    margin: '0 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: 16,
  },
  chapterCardHead: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  chapterCardIcon: {
    fontSize: 26,
    flexShrink: 0,
    width: 46,
    height: 46,
    borderRadius: 13,
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.12), rgba(0, 206, 201, 0.08))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterCardInfo: {
    flex: 1,
    minWidth: 0,
  },
  chapterCardBadge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--primary)',
    background: 'rgba(108, 92, 231, 0.10)',
    padding: '2px 9px',
    borderRadius: 20,
    marginBottom: 6,
  },
  badgeEn: {
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  badgeTotal: {
    color: 'var(--text-light)',
    fontWeight: 400,
  },
  chapterCardTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 4,
    lineHeight: 1.3,
  },
  titleEnInline: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  chapterCardDesc: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },

  // ---------- section 切换条 ----------
  sectionBar: {
    display: 'flex',
    gap: 0,
    overflowX: 'auto',
    margin: '0 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    padding: '4px',
  },
  sectionTab: {
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-light)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    borderRadius: 8,
    transition: 'all 0.2s',
  },
  sectionTabActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    color: '#fff',
  },

  // ---------- section 内容 ----------
  sectionContent: {
    margin: '0 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--primary)',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: '2px solid rgba(108, 92, 231, 0.15)',
    lineHeight: 1.4,
  },
  sectionText: {
    fontSize: 13.5,
    color: 'var(--text)',
    lineHeight: 1.85,
    textAlign: 'justify',
    textIndent: '2em',
  },
  sectionTextEn: {
    fontSize: 12.5,
    color: 'var(--text-secondary)',
    lineHeight: 1.75,
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px dashed var(--border)',
    fontStyle: 'italic',
    textAlign: 'justify',
  },

  // ---------- 技巧提示 ----------
  tipsBox: {
    marginTop: 16,
  },
  tipsHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 8,
  },
  tipsHeaderEn: {
    fontSize: 11,
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  tipItem: {
    fontSize: 12.5,
    lineHeight: 1.6,
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 8,
  },

  // ---------- 翻页 ----------
  pager: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    margin: '0 16px 8px',
  },
  pagerBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '11px 0',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--primary)',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pagerBtnRight: {
    color: 'var(--accent)',
  },
  pagerBtnDisabled: {
    flex: 1,
    textAlign: 'center',
    padding: '11px 0',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-light)',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}
