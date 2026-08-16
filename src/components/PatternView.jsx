import { useState, useRef, useCallback } from 'react'
import { patternPieces, gradingRules } from '../data/mockData.js'
import { useLang } from '../i18n/LanguageContext.jsx'

function PatternSVG({ piece }) {
  const { t } = useLang()
  return (
    <svg
      className="pattern-svg"
      viewBox="0 0 150 210"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid */}
      <defs>
        <pattern id={`grid-${piece.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" className="svg-grid-line" />
        </pattern>
      </defs>
      <rect width="150" height="210" fill={`url(#grid-${piece.id})`} />

      {/* Axes */}
      <line x1="0" y1="105" x2="150" y2="105" className="svg-axis-line" strokeDasharray="3,2" />
      <line x1="75" y1="0" x2="75" y2="210" className="svg-axis-line" strokeDasharray="3,2" />

      {/* Piece path */}
      <path
        d={piece.svgPath}
        fill={piece.color}
        className="svg-piece-path"
        stroke={piece.color}
      />

      {/* Points */}
      {piece.points.map((pt, i) => (
        <g key={i}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r="2.5"
            className="svg-point-circle"
            stroke={piece.color}
          />
          <text
            x={pt.x + 3}
            y={pt.y - 3}
            className="svg-point-label"
          >
            {pt.label} / {pt.labelEn}
          </text>
        </g>
      ))}

      {/* Grain line */}
      <line
        x1={75}
        y1="20"
        x2={75}
        y2="190"
        stroke={piece.color}
        strokeWidth="0.4"
        strokeDasharray="4,2,1,2"
        opacity="0.5"
      />
      <text x={77} y={100} className="svg-point-label" style={{ fontSize: 3 }}>
        {t('grain')}
      </text>
    </svg>
  )
}

// 全屏预览组件：支持滚轮缩放 + 拖拽移动
function FullscreenPattern({ piece, onClose }) {
  const { t } = useLang()
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateRef = useRef({ x: 0, y: 0 })

  // 滚轮缩放
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setScale(prev => {
      const next = Math.min(Math.max(prev + delta, 0.5), 5)
      return next
    })
  }, [])

  // 拖拽开始
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX - translateRef.current.x, y: e.clientY - translateRef.current.y }
  }, [])

  // 拖拽移动
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.current.x
    const newY = e.clientY - dragStart.current.y
    translateRef.current = { x: newX, y: newY }
    setTranslate({ x: newX, y: newY })
  }, [])

  // 拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 重置
  const handleReset = () => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    translateRef.current = { x: 0, y: 0 }
  }

  // 触摸支持（移动端）
  const touchStart = useRef({ x: 0, y: 0 })
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      touchStart.current = {
        x: e.touches[0].clientX - translateRef.current.x,
        y: e.touches[0].clientY - translateRef.current.y,
      }
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return
    e.preventDefault()
    const newX = e.touches[0].clientX - touchStart.current.x
    const newY = e.touches[0].clientY - touchStart.current.y
    translateRef.current = { x: newX, y: newY }
    setTranslate({ x: newX, y: newY })
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div className="pattern-fullscreen-overlay" onClick={onClose}>
      <div
        className="pattern-fullscreen-container"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* 顶部工具栏 */}
        <div className="pattern-fullscreen-toolbar">
          <div className="pattern-fullscreen-title">
            <span className="pattern-piece-color" style={{ background: piece.color }} />
            {piece.name} / {piece.nameEn}
          </div>
          <div className="pattern-fullscreen-actions">
            <button
              className="pattern-fullscreen-btn"
              onClick={handleReset}
              title="重置"
            >
              🔄
            </button>
            <button
              className="pattern-fullscreen-btn"
              onClick={() => setScale(s => Math.min(s + 0.3, 5))}
              title="放大"
            >
              🔍+
            </button>
            <button
              className="pattern-fullscreen-btn"
              onClick={() => setScale(s => Math.max(s - 0.3, 0.5))}
              title="缩小"
            >
              🔍−
            </button>
            <button
              className="pattern-fullscreen-btn pattern-fullscreen-close"
              onClick={onClose}
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SVG 画布区域 */}
        <div className="pattern-fullscreen-canvas">
          {/* 拖拽提示 */}
          <div className="pattern-fullscreen-hint">
            <span className="pattern-fullscreen-hint-icon">🖐️</span>
            <span>拖动移动 · 滚轮缩放</span>
          </div>

          <div
            className="pattern-fullscreen-svg-wrapper"
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <PatternSVG piece={piece} />
          </div>
        </div>

        {/* 底部缩放指示 */}
        <div className="pattern-fullscreen-zoom-bar">
          <span>缩放</span>
          <div className="pattern-fullscreen-zoom-track">
            <div
              className="pattern-fullscreen-zoom-fill"
              style={{ width: `${((scale - 0.5) / 4.5) * 100}%` }}
            />
          </div>
          <span>{Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

export default function PatternView({ customSizes, sizeLabel, version, userPurpose = 'commercial' }) {
  const { t } = useLang()
  const isPersonal = userPurpose === 'personal'
  const [expanded, setExpanded] = useState(patternPieces[0]?.id || null)
  const [fullscreenPiece, setFullscreenPiece] = useState(null)

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="pattern-container fade-in">
      {/* Info banner */}
      <div className="card" style={{ paddingBottom: 12 }}>
        <div className="card-title">
          <span className="card-title-icon">📐</span>
          {t('patternTitle')}
          {!isPersonal && `（${gradingRules.baseSize} ${t('baseM').replace(/[()（）]/g, '')}）`}
          {isPersonal && customSizes && '（自定义尺寸）'}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          共 {patternPieces.length} 类裁片。点击各裁片查看详细尺寸标注。图纸含布纹方向、关键点位标注。支持 1:1 打印输出。
        </p>
      </div>

      {/* Pattern pieces */}
      {patternPieces.map((piece) => (
        <div key={piece.id} className="pattern-piece-card slide-up">
          <div
            className="pattern-piece-header"
            onClick={() => toggle(piece.id)}
          >
            <div className="pattern-piece-name">
              <span className="pattern-piece-color" style={{ background: piece.color }} />
              {piece.name} / {piece.nameEn}
              <span className="pattern-piece-count">×{piece.count} 片</span>
            </div>
            <span className={`pattern-piece-toggle ${expanded === piece.id ? 'open' : ''}`}>▼</span>
          </div>

          {expanded === piece.id && (
            <div className="pattern-piece-body">
              <div className="pattern-svg-wrapper">
                <PatternSVG piece={piece} />
              </div>

              {/* Measurements */}
              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('measurements')}
                {!isPersonal && `（${gradingRules.baseSize} · cm）`}
                {isPersonal && '（cm）'}
              </div>
              <div className="pattern-measurements">
                {Object.entries(piece.measurements).map(([key, val]) => (
                  <div key={key} className="pattern-measurement-item">
                    <span className="pattern-measurement-label">{key}</span>
                    <span className="pattern-measurement-value">
                      {val}<span className="pattern-measurement-unit">cm</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary pattern-fullscreen-trigger"
                  style={{ fontSize: 12, padding: '10px 16px' }}
                  onClick={() => setFullscreenPiece(piece)}
                >
                  ⛶ 全屏预览
                </button>
                {!isPersonal && (
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: 12, padding: '10px 16px' }}
                  >
                    📏 查看放码
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '10px 16px' }}
                >
                  🖨️ 打印此裁片
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Print all */}
      <div style={{ padding: '8px 16px 20px' }}>
        <button className="btn btn-primary">
          📄 打印全部纸样图纸（1:1）
        </button>
      </div>

      {/* 全屏预览 Modal */}
      {fullscreenPiece && (
        <FullscreenPattern
          piece={fullscreenPiece}
          onClose={() => setFullscreenPiece(null)}
        />
      )}
    </div>
  )
}
