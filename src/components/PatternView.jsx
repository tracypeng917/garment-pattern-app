import { useState } from 'react'
import { patternPieces } from '../data/mockData.js'

function PatternSVG({ piece }) {
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
        布纹向 / Grain
      </text>
    </svg>
  )
}

export default function PatternView() {
  const [expanded, setExpanded] = useState(patternPieces[0]?.id || null)

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="pattern-container fade-in">
      {/* Info banner */}
      <div className="card" style={{ paddingBottom: 12 }}>
        <div className="card-title">
          <span className="card-title-icon">📐</span>
          纸样图纸（S 码基准）
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
                尺寸标注 / Measurements（S 码 · cm）
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
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '10px 16px' }}
                >
                  📏 查看放码
                </button>
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
    </div>
  )
}
