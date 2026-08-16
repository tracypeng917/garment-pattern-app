import { gradingRules, gradingPoints } from '../data/mockData.js'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function GradingTab() {
  const { t } = useLang()
  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🔢</span>
          {t('gradingRuleTable')}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          {t('gradingRuleDesc', { base: gradingRules.baseSize })}
        </p>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="row-name">{t('partLabel')}</th>
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
          {t('gradingBasePoint')}
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
          {t('gradingMethodTip', { base: gradingRules.baseSize })}
        </div>
      </div>
    </div>
  )
}
