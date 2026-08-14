import { gradingRules, gradingPoints } from '../data/mockData.js'

export default function GradingTab() {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🔢</span>
          放码规则表（单位：cm）
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          以 <strong style={{ color: 'var(--primary)' }}>S 码</strong> 为基准码，各码号相对于 S 码的尺寸增减量。正值表示增大，0 为基准。
        </p>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="row-name">部位</th>
                {gradingRules.sizes.map((s) => (
                  <th key={s} className={s === gradingRules.baseSize ? 'base-size' : ''}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradingRules.rows.map((row, i) => (
                <tr key={i}>
                  <td className="row-name">
                    {row.name}
                    <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>
                      {row.nameEn}
                    </div>
                  </td>
                  {row.diffs.map((diff, j) => (
                    <td
                      key={j}
                      className={gradingRules.sizes[j] === gradingRules.baseSize ? 'base-size' : ''}
                      style={diff > 0 ? { color: 'var(--success)' } : {}}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📐</span>
          放码基准点
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          {gradingPoints.map((gp, i) => (
            <p key={i}><strong>{gp.piece} / {gp.pieceEn}：</strong>以{gp.point} / {gp.pointEn}为基准</p>
          ))}
        </div>
        <div style={{
          marginTop: 12,
          padding: 12,
          background: 'rgba(108, 92, 231, 0.06)',
          borderRadius: 10,
          fontSize: 12,
          color: 'var(--primary)',
          fontWeight: 600,
        }}>
          💡 放码采用推板法，以 S 码为基准向大码方向推放，各部位按比例同步调整，保证款式结构不变。
        </div>
      </div>
    </div>
  )
}
