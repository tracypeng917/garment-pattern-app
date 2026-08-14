import { useState } from 'react'
import { tutorialSections } from '../data/mockData.js'

export default function TutorialTab() {
  const [expanded, setExpanded] = useState('intro')

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="fade-in">
      {/* 教程引导 */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.05))' }}>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            新手纸样阅读教程
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Beginner's Guide to Reading Patterns
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
            从零开始，学会看懂纸样、裁剪面料、缝制成衣<br/>
            即使完全没有基础，也能做出自己的背心
          </p>
        </div>
      </div>

      {/* 教程章节 */}
      {tutorialSections.map((section) => (
        <div key={section.id} className="pattern-piece-card slide-up">
          <div
            className="pattern-piece-header"
            onClick={() => toggle(section.id)}
          >
            <div className="pattern-piece-name">
              <span style={{ fontSize: 20 }}>{section.icon}</span>
              <span>{section.title}</span>
              <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400 }}>
                {section.titleEn}
              </span>
            </div>
            <span className={`pattern-piece-toggle ${expanded === section.id ? 'open' : ''}`}>▼</span>
          </div>

          {expanded === section.id && (
            <div className="pattern-piece-body">
              {/* Intro section */}
              {section.id === 'intro' && (
                <div className="tutorial-content">
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8 }}>
                    {section.content}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8, fontStyle: 'italic' }}>
                    {section.contentEn}
                  </p>
                  {section.tips && (
                    <div style={{ marginTop: 12 }}>
                      {section.tips.map((tip, i) => (
                        <div key={i} style={{
                          padding: '8px 12px',
                          background: 'rgba(108, 92, 231, 0.06)',
                          borderRadius: 8,
                          fontSize: 12,
                          color: 'var(--primary)',
                          marginBottom: 6,
                          fontWeight: 500,
                        }}>
                          💡 {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Lines section */}
              {section.id === 'lines' && (
                <div className="tutorial-content">
                  <div className="pattern-svg-wrapper" style={{ marginBottom: 12 }}>
                    <svg viewBox="0 0 150 110" className="tutorial-svg" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid */}
                      <defs>
                        <pattern id="tut-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" stroke="#E8E8F0" strokeWidth="0.3" />
                        </pattern>
                      </defs>
                      <rect width="150" height="110" fill="url(#tut-grid)" />

                      {/* Piece outline (thick) */}
                      <path d="M 30 20 L 120 20 L 120 90 L 30 90 Z"
                        fill="none" stroke="#E8804A" strokeWidth="2" />

                      {/* Seam allowance (lighter area outside) */}
                      <path d="M 25 15 L 125 15 L 125 95 L 25 95 Z"
                        fill="rgba(253,203,110,0.2)" stroke="#FDCB6E" strokeWidth="0.5" strokeDasharray="2,1" />

                      {/* Grain line */}
                      <line x1="75" y1="25" x2="75" y2="85"
                        stroke="#6C5CE7" strokeWidth="1" strokeDasharray="4,2,1,2" />
                      <polygon points="75,22 73,27 77,27" fill="#6C5CE7" />
                      <polygon points="75,88 73,83 77,83" fill="#6C5CE7" />

                      {/* Reference lines */}
                      <line x1="30" y1="55" x2="120" y2="55"
                        stroke="#B2BEC3" strokeWidth="0.4" strokeDasharray="3,2" />

                      {/* Labels */}
                      <text x="125" y="18" fontSize="3" fill="#E8804A" fontWeight="bold">轮廓线 Outline</text>
                      <text x="80" y="50" fontSize="3" fill="#6C5CE7" fontWeight="bold">布纹线 Grain</text>
                      <text x="5" y="55" fontSize="2.5" fill="#B2BEC3">参考线 Ref.</text>
                      <text x="125" y="10" fontSize="2.5" fill="#FDCB6E">缝份 Seam Allow.</text>
                    </svg>
                  </div>
                  {section.lines.map((line, i) => (
                    <div key={i} className="tutorial-line-item">
                      <span className="tutorial-line-color" style={{ background: line.color }} />
                      <div>
                        <div className="tutorial-line-name">{line.name}</div>
                        <div className="tutorial-line-desc">{line.desc}</div>
                        <div className="tutorial-line-desc-en">{line.descEn}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Points section */}
              {section.id === 'points' && (
                <div className="tutorial-content">
                  <div className="pattern-svg-wrapper" style={{ marginBottom: 12 }}>
                    <svg viewBox="0 0 150 110" className="tutorial-svg" xmlns="http://www.w3.org/2000/svg">
                      <rect width="150" height="110" fill="#FAFAFC" />
                      {/* Simplified vest front */}
                      <path d="M 40 15 L 110 15 L 115 25 Q 118 30 116 40 L 116 80 L 110 90 L 40 90 L 34 80 L 34 40 Q 32 30 35 25 Z"
                        fill="rgba(232,128,74,0.1)" stroke="#E8804A" strokeWidth="1.5" />
                      {/* Points */}
                      {[
                        { x: 40, y: 15, l: 'A' },
                        { x: 110, y: 15, l: 'B' },
                        { x: 116, y: 40, l: 'D' },
                        { x: 34, y: 40, l: 'H' },
                        { x: 116, y: 80, l: 'E' },
                        { x: 34, y: 80, l: 'G' },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="3" fill="white" stroke="#E8804A" strokeWidth="1.5" />
                          <text x={pt.x + 4} y={pt.y - 3} fontSize="4" fill="#333" fontWeight="bold">{pt.l}</text>
                        </g>
                      ))}
                      {/* Grain line */}
                      <line x1="75" y1="20" x2="75" y2="85" stroke="#6C5CE7" strokeWidth="0.5" strokeDasharray="3,1,1,1" />
                    </svg>
                  </div>
                  {section.points.map((pt, i) => (
                    <div key={i} className="tutorial-point-item">
                      <div className="tutorial-point-label">{pt.label}</div>
                      <div className="tutorial-point-label-en">{pt.labelEn}</div>
                      <div className="tutorial-point-desc">{pt.desc}</div>
                      <div className="tutorial-point-desc-en">{pt.descEn}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Symbols section */}
              {section.id === 'symbols' && (
                <div className="tutorial-content">
                  <div className="tutorial-symbol-grid">
                    {section.symbols.map((sym, i) => (
                      <div key={i} className="tutorial-symbol-card">
                        <div className="tutorial-symbol-icon">{sym.symbol}</div>
                        <div className="tutorial-symbol-name">{sym.name}</div>
                        <div className="tutorial-symbol-desc">{sym.desc}</div>
                        <div className="tutorial-symbol-desc-en">{sym.descEn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps section */}
              {section.id === 'steps' && (
                <div className="tutorial-content">
                  {section.steps.map((step, i) => (
                    <div key={i} className="tutorial-step-item">
                      <div className="tutorial-step-num">{step.step}</div>
                      <div className="tutorial-step-content">
                        <div className="tutorial-step-title">
                          {step.title} <span className="tutorial-step-title-en">/ {step.titleEn}</span>
                        </div>
                        <div className="tutorial-step-desc">{step.desc}</div>
                        <div className="tutorial-step-desc-en">{step.descEn}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips section */}
              {section.id === 'tips' && (
                <div className="tutorial-content">
                  {section.tips.map((tip, i) => (
                    <div key={i} className="tutorial-tip-card">
                      <div className="tutorial-tip-title">
                        {tip.title} <span className="tutorial-tip-title-en">/ {tip.titleEn}</span>
                      </div>
                      <div className="tutorial-tip-desc">{tip.desc}</div>
                      <div className="tutorial-tip-desc-en">{tip.descEn}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 底部鼓励 */}
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,206,201,0.06), rgba(108,92,231,0.04))' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          你已经学会了！
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          You've learned the basics!<br/>
          现在去「纸样图纸」页面查看你的裁片，开始制作吧
        </p>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-light)' }}>
          📄 导出 PDF 后按 1:1 比例打印即可使用
        </div>
      </div>
    </div>
  )
}
