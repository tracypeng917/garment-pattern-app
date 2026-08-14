import { useState, useMemo } from 'react'
import { learningManual, manualReferences } from '../data/learningManual.js'

// 语言模式
const LANG = {
  ZH: 'zh',   // 仅中文
  EN: 'en',   // 仅英文
  BI: 'bi',   // 双语
}

const LANG_LABEL = { zh: '中文', en: 'EN', bi: '双语' }

// 仅注入一次响应式样式（窄屏将左侧目录变为顶部下拉列表）
const STYLE_ID = 'learning-manual-responsive'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement('style')
  styleEl.id = STYLE_ID
  styleEl.textContent = `
/* 默认（宽屏）：左侧目录 + 右侧内容 */
.lm-mobile-toc { display: none; }
.lm-sidebar { display: flex; }
.lm-body { flex-direction: row; }

/* 窄屏：目录变为顶部下拉 */
@media (max-width: 760px) {
  .lm-mobile-toc { display: flex; }
  .lm-sidebar { display: none; }
  .lm-sidebar.lm-open { display: block; }
  .lm-body { flex-direction: column; }
  .lm-sidebar.lm-open {
    position: relative;
    width: 100%;
    flex: none;
    top: 0;
  }
}
`
  document.head.appendChild(styleEl)
}

export default function LearningManual() {
  const [activeChapterId, setActiveChapterId] = useState(learningManual.chapters[0].id)
  const [activeSectionId, setActiveSectionId] = useState(learningManual.chapters[0].sections[0].id)
  const [lang, setLang] = useState(LANG.BI)
  const [mobileListOpen, setMobileListOpen] = useState(false)

  const activeChapter = useMemo(
    () => learningManual.chapters.find(c => c.id === activeChapterId) || learningManual.chapters[0],
    [activeChapterId]
  )

  const activeSection = useMemo(
    () => activeChapter.sections.find(s => s.id === activeSectionId) || activeChapter.sections[0],
    [activeChapter, activeSectionId]
  )

  // 切换章节：同时重置 section 至首节
  const handleSelectChapter = (chapterId) => {
    const ch = learningManual.chapters.find(c => c.id === chapterId)
    setActiveChapterId(chapterId)
    setActiveSectionId(ch ? ch.sections[0].id : null)
    setMobileListOpen(false)
  }

  // 是否显示中文 / 英文
  const showZh = lang === LANG.ZH || lang === LANG.BI
  const showEn = lang === LANG.EN || lang === LANG.BI

  return (
    <div className="fade-in" style={styles.wrapper}>
      {/* 顶部标题区 */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>📚</div>
        <h2 style={styles.heroTitle}>
          {showZh && learningManual.title}
          {showEn && (showZh ? <span style={styles.heroTitleEn}> / {learningManual.titleEn}</span> : learningManual.titleEn)}
        </h2>
        <p style={styles.heroSub}>
          {showZh && learningManual.subtitle}
          {showEn && (showZh ? <br /> : '')}
          {showEn && learningManual.subtitleEn}
        </p>

        {/* 语言切换 */}
        <div style={styles.langSwitch}>
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
      </div>

      {/* 移动端目录触发条（窄屏显示，宽屏隐藏由 CSS 控制） */}
      <div
        className="lm-mobile-toc"
        style={styles.mobileTocBar}
        onClick={() => setMobileListOpen(o => !o)}
      >
        <span style={styles.mobileTocIcon}>{activeChapter.icon}</span>
        <span style={styles.mobileTocText}>
          {showZh ? activeChapter.title : activeChapter.titleEn}
        </span>
        <span style={{ ...styles.mobileTocArrow, transform: mobileListOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      <div className="lm-body" style={styles.body}>
        {/* 左侧目录（桌面侧边栏 / 移动端下拉列表，显示由 CSS 控制） */}
        <aside
          className={`lm-sidebar ${mobileListOpen ? 'lm-open' : ''}`}
          style={styles.sidebar}
        >
          <div style={styles.sidebarHeader}>
            {showZh ? '章节目录' : 'Contents'}
            {showEn && showZh && <span style={styles.sidebarHeaderEn}> / Contents</span>}
          </div>
          <ol style={styles.chapterList}>
            {learningManual.chapters.map((ch, i) => (
              <li
                key={ch.id}
                style={{
                  ...styles.chapterItem,
                  ...(ch.id === activeChapterId ? styles.chapterItemActive : {}),
                }}
                onClick={() => handleSelectChapter(ch.id)}
              >
                <span style={styles.chapterIcon}>{ch.icon}</span>
                <span style={styles.chapterText}>
                  <span style={styles.chapterIdx}>{i + 1}. </span>
                  {showZh && ch.title}
                  {showEn && (showZh ? <span style={styles.chapterTitleEn}> {ch.titleEn}</span> : ch.titleEn)}
                </span>
              </li>
            ))}
          </ol>
        </aside>

        {/* 右侧内容区 */}
        <section style={styles.content}>
          {/* 章节标题卡 */}
          <div style={styles.chapterCard}>
            <div style={styles.chapterCardHead}>
              <span style={styles.chapterCardIcon}>{activeChapter.icon}</span>
              <div>
                <h3 style={styles.chapterCardTitle}>
                  {showZh && activeChapter.title}
                  {showEn && (showZh ? <span style={styles.titleEnInline}> / {activeChapter.titleEn}</span> : activeChapter.titleEn)}
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
          <div style={styles.sectionBar}>
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
          <div key={activeSection.id} className="slide-up" style={styles.sectionContent}>
            <h4 style={styles.sectionTitle}>
              {showZh && activeSection.title}
              {showEn && (showZh ? <span style={styles.titleEnInline}> / {activeSection.titleEn}</span> : activeSection.titleEn)}
            </h4>

            {showZh && (
              <p style={styles.sectionText}>{activeSection.content}</p>
            )}
            {showEn && (
              <p style={showZh ? styles.sectionTextEn : styles.sectionText}>{activeSection.contentEn}</p>
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

          {/* 翻页：上一节 / 下一节 */}
          <div style={styles.pager}>
            {getPrevSection(activeChapter, activeSectionId) ? (
              <span style={styles.pagerBtn} onClick={() => {
                const p = getPrevSection(activeChapter, activeSectionId)
                if (p) setActiveSectionId(p.id)
              }}>
                ‹ {showZh ? '上一节' : 'Prev'}
              </span>
            ) : <span style={styles.pagerBtnDisabled}>‹ {showZh ? '上一节' : 'Prev'}</span>}
            {getNextSection(activeChapter, activeSectionId) ? (
              <span style={{ ...styles.pagerBtn, ...styles.pagerBtnRight }} onClick={() => {
                const n = getNextSection(activeChapter, activeSectionId)
                if (n) setActiveSectionId(n.id)
              }}>
                {showZh ? '下一节' : 'Next'} ›
              </span>
            ) : <span style={{ ...styles.pagerBtnDisabled, ...styles.pagerBtnRight }}>{showZh ? '下一节' : 'Next'} ›</span>}
          </div>
        </section>
      </div>

      {/* 参考书目 */}
      <div style={styles.refCard}>
        <div style={styles.refHeader}>
          📖 {showZh ? '参考书目' : 'References'}
          {showEn && showZh && <span style={styles.tipsHeaderEn}> / References</span>}
        </div>
        {manualReferences.map((ref, i) => (
          <div key={i} style={styles.refItem}>
            <div style={styles.refTitle}>
              《{ref.title}》
              <span style={styles.refTitleEn}> / {ref.titleEn}</span>
            </div>
            <div style={styles.refAuthor}>
              {showZh ? `著者：${ref.author}` : `Author: ${ref.authorEn}`}
              {showEn && showZh && <span style={styles.refTitleEn}> / {ref.authorEn}</span>}
            </div>
            <div style={styles.refPublisher}>
              {showZh ? ref.publisher : ref.publisherEn}
            </div>
            <ul style={styles.refParts}>
              {ref.parts.map((p, j) => (
                <li key={j} style={styles.refPart}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// 辅助：获取当前章节内上一节
function getPrevSection(chapter, sectionId) {
  const idx = chapter.sections.findIndex(s => s.id === sectionId)
  return idx > 0 ? chapter.sections[idx - 1] : null
}

// 辅助：获取当前章节内下一节
function getNextSection(chapter, sectionId) {
  const idx = chapter.sections.findIndex(s => s.id === sectionId)
  return idx >= 0 && idx < chapter.sections.length - 1 ? chapter.sections[idx + 1] : null
}

// ==================== 内联样式 ====================
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
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
  langSwitch: {
    display: 'inline-flex',
    marginTop: 12,
    background: 'var(--card-bg)',
    borderRadius: 20,
    padding: 3,
    boxShadow: 'var(--shadow)',
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

  // 移动端目录触发条（display 由 CSS 控制）
  mobileTocBar: {
    margin: '0 16px',
    padding: '12px 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  mobileTocIcon: {
    fontSize: 20,
  },
  mobileTocText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
  },
  mobileTocArrow: {
    fontSize: 14,
    color: 'var(--text-light)',
    transition: 'transform 0.2s',
  },

  body: {
    display: 'flex',
    gap: 12,
    margin: '0 16px',
    alignItems: 'flex-start',
  },
  sidebar: {
    flex: '0 0 220px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: '14px 12px',
    position: 'sticky',
    top: 12,
    flexDirection: 'column',
  },
  sidebarHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--text-light)',
    letterSpacing: 1,
    padding: '0 6px 10px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 8,
  },
  sidebarHeaderEn: {
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  chapterList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  chapterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  chapterItemActive: {
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.10), rgba(108, 92, 231, 0.04))',
    border: '1px solid rgba(108, 92, 231, 0.25)',
  },
  chapterIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  chapterText: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    lineHeight: 1.35,
  },
  chapterIdx: {
    color: 'var(--primary)',
    fontWeight: 800,
  },
  chapterTitleEn: {
    display: 'block',
    fontSize: 10,
    color: 'var(--text-light)',
    fontWeight: 400,
  },

  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  chapterCard: {
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
    fontSize: 28,
    flexShrink: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.12), rgba(0, 206, 201, 0.08))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  sectionBar: {
    display: 'flex',
    gap: 0,
    overflowX: 'auto',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    padding: '4px 4px',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
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

  sectionContent: {
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
  },

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

  pager: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
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

  refCard: {
    margin: '0 16px 20px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: 16,
  },
  refHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: '1px solid var(--border)',
  },
  refItem: {
    padding: '10px 0',
    borderBottom: '1px dashed var(--border)',
  },
  refTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--primary)',
    marginBottom: 4,
  },
  refTitleEn: {
    fontSize: 11,
    fontWeight: 400,
    color: 'var(--text-light)',
  },
  refAuthor: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginBottom: 2,
  },
  refPublisher: {
    fontSize: 11,
    color: 'var(--text-light)',
    marginBottom: 6,
  },
  refParts: {
    margin: 0,
    paddingLeft: 18,
    color: 'var(--text-secondary)',
  },
  refPart: {
    fontSize: 11.5,
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
  },
}
