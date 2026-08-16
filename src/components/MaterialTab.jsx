import { materialUsage, gradingRules } from '../data/mockData.js'

function CuttingLayoutSVG() {
  const { fabricWidth, fabricLength, pieces } = materialUsage.cuttingLayout
  const svgWidth = 150
  const svgHeight = 165

  return (
    <svg
      className="cutting-layout-svg"
      viewBox={`0 0 ${svgWidth + 20} ${svgHeight + 30}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fabric background */}
      <rect x="5" y="5" width={svgWidth} height={svgHeight} fill="#FAFAFC" stroke="#D0D0D8" strokeWidth="0.8" rx="2" />

      {/* Grid */}
      <defs>
        <pattern id="cutting-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" stroke="#E8E8F0" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect x="5" y="5" width={svgWidth} height={svgHeight} fill="url(#cutting-grid)" />

      {/* Pieces */}
      {pieces.map((p, i) => {
        const scaleX = svgWidth / fabricWidth
        const scaleY = svgHeight / fabricLength
        return (
          <g key={i}>
            <rect
              x={5 + p.x * scaleX}
              y={5 + p.y * scaleY}
              width={p.w * scaleX}
              height={p.h * scaleY}
              fill={p.color}
              fillOpacity="0.5"
              stroke={p.color}
              strokeWidth="0.8"
              rx="1"
            />
            <text
              x={5 + p.x * scaleX + (p.w * scaleX) / 2}
              y={5 + p.y * scaleY + (p.h * scaleY) / 2 + 2}
              textAnchor="middle"
              fontSize="3"
              fill="#333"
              fontWeight="600"
            >
              {p.name}
            </text>
          </g>
        )
      })}

      {/* Labels */}
      <text x={5 + svgWidth / 2} y={svgHeight + 18} textAnchor="middle" fontSize="5" fill="#999">
        门幅 {fabricWidth}cm
      </text>
      <text x={svgWidth + 15} y={5 + svgHeight / 2} textAnchor="middle" fontSize="5" fill="#999" transform={`rotate(90, ${svgWidth + 15}, ${5 + svgHeight / 2})`}>
        用料 {fabricLength}cm
      </text>
    </svg>
  )
}

export default function MaterialTab({ userPurpose = 'commercial' }) {
  const isPersonal = userPurpose === 'personal'

  // 私人定制模式下只显示当前尺寸的用量
  const currentSizeLabel = isPersonal ? '自定义尺寸' : `${gradingRules.baseSize} 码`
  const currentUsage = materialUsage.fabric.usageBySize[gradingRules.baseSize] || materialUsage.fabric.usageBySize['M'] || 1.2
  const currentWithWaste = (currentUsage * 1.05).toFixed(2)

  return (
    <div className="fade-in">
      {/* Main fabric */}
      <div className="material-card">
        <div className="card-title">
          <span className="card-title-icon">🧵</span>
          主面料
        </div>
        <div className="material-item">
          <div className="material-item-left">
            <div className="material-item-name">{materialUsage.fabric.name} / {materialUsage.fabric.nameEn}</div>
            <div className="material-item-spec">{materialUsage.fabric.type} / {materialUsage.fabric.typeEn} · 门幅 {materialUsage.fabric.width}</div>
          </div>
          <div className="material-item-right">
            <div className="material-item-value">{isPersonal ? currentUsage.toFixed(2) : materialUsage.fabric.unitLength}m</div>
            <div className="material-item-unit">单件用量</div>
          </div>
        </div>
        <div className="material-item">
          <div className="material-item-left">
            <div className="material-item-name">缩率</div>
            <div className="material-item-spec">面料缩水率</div>
          </div>
          <div className="material-item-right">
            <div className="material-item-value">{materialUsage.fabric.shrinkage}</div>
            <div className="material-item-unit">缩水率</div>
          </div>
        </div>
        <div className="material-item">
          <div className="material-item-left">
            <div className="material-item-name">损耗</div>
            <div className="material-item-spec">裁剪损耗率</div>
          </div>
          <div className="material-item-right">
            <div className="material-item-value">{materialUsage.fabric.wasteRate}</div>
            <div className="material-item-unit">损耗率</div>
          </div>
        </div>
      </div>

      {/* Usage — 私人定制只显示当前尺寸，电商模式显示各码 */}
      <div className="material-card">
        <div className="card-title">
          <span className="card-title-icon">📊</span>
          {isPersonal ? '当前尺寸用量' : '各码面料用量'}
        </div>

        {isPersonal ? (
          <div className="material-item">
            <div className="material-item-left">
              <div className="material-item-name">{currentSizeLabel}</div>
              <div className="material-item-spec">含 {materialUsage.fabric.wasteRate} 损耗</div>
            </div>
            <div className="material-item-right">
              <div className="material-item-value">{currentWithWaste}m</div>
              <div className="material-item-unit">用料（含损耗）</div>
            </div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="row-name">码号</th>
                  <th>用料(m)</th>
                  <th>含损耗(m)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(materialUsage.fabric.usageBySize).map(([size, length]) => {
                  const withWaste = (length * 1.05).toFixed(2)
                  return (
                    <tr key={size}>
                      <td className="row-name" style={size === gradingRules.baseSize ? { color: 'var(--primary)', fontWeight: 700 } : {}}>
                        {size}{size === gradingRules.baseSize ? ' (基准)' : ''}
                      </td>
                      <td>{length.toFixed(2)}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{withWaste}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cutting Layout */}
      <div className="material-card">
        <div className="card-title">
          <span className="card-title-icon">✂️</span>
          裁剪排料图 / Cutting Layout{isPersonal ? '' : `（${gradingRules.baseSize} 码）`}
        </div>
        <div className="cutting-layout-wrapper">
          <CuttingLayoutSVG />
        </div>
        <div className="cutting-legend">
          {materialUsage.cuttingLayout.pieces.map((p, i) => (
            <div key={i} className="cutting-legend-item">
              <span className="cutting-legend-color" style={{ background: p.color }} />
              {p.name}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 10,
          padding: 10,
          background: 'rgba(0, 206, 201, 0.06)',
          borderRadius: 8,
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>
          排料利用率：<strong style={{ color: 'var(--accent)' }}>87.3%</strong> · 建议顺毛向排料，注意面料方向一致性
        </div>
      </div>

      {/* Lining */}
      <div className="material-card">
        <div className="card-title">
          <span className="card-title-icon">📄</span>
          里布/粘合衬
        </div>
        <div className="material-item">
          <div className="material-item-left">
            <div className="material-item-name">{materialUsage.lining.name} / {materialUsage.lining.nameEn}</div>
            <div className="material-item-spec">{materialUsage.lining.type} / {materialUsage.lining.typeEn} · 门幅 {materialUsage.lining.width}</div>
          </div>
          <div className="material-item-right">
            <div className="material-item-value">{materialUsage.lining.unitLength}m</div>
            <div className="material-item-unit">单件用量</div>
          </div>
        </div>
      </div>

      {/* Accessories */}
      <div className="material-card">
        <div className="card-title">
          <span className="card-title-icon">🔧</span>
          辅料清单
        </div>
        {materialUsage.accessories.map((acc, i) => (
          <div key={i} className="material-item">
            <div className="material-item-left">
              <div className="material-item-name">{acc.name} / {acc.nameEn}</div>
              <div className="material-item-spec">{acc.spec} / {acc.specEn}</div>
            </div>
            <div className="material-item-right">
              <div className="material-item-value">{acc.quantity}</div>
              <div className="material-item-unit">{acc.unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
