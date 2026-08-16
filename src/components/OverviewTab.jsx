import { garmentInfo, patternPieces, materialUsage, sewingSteps, gradingRules } from '../data/mockData.js'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function OverviewTab({ onExportPDF }) {
  const { t } = useLang()
  const totalPieces = patternPieces.reduce((sum, p) => sum + p.count, 0)
  const totalAccessories = materialUsage.accessories.reduce((sum, a) => sum + a.quantity, 0)
  const totalSewingTime = sewingSteps.reduce((sum, s) => {
    const min = parseInt(s.time)
    return sum + min
  }, 0)

  return (
    <div className="fade-in">
      {/* 基础信息 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🏷️</span>
          {t('garmentInfo')}
        </div>
        <div className="overview-grid">
          <div className="overview-item">
            <div className="overview-item-value">{garmentInfo.style} / {garmentInfo.styleEn}</div>
            <div className="overview-item-label">{t('style')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{garmentInfo.season} / {garmentInfo.seasonEn}</div>
            <div className="overview-item-label">{t('season')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{garmentInfo.difficulty} / {garmentInfo.difficultyEn}</div>
            <div className="overview-item-label">{t('difficulty')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{totalPieces}</div>
            <div className="overview-item-label">{t('totalPieces')}</div>
          </div>
        </div>
        <div className="overview-tags">
          <span className="overview-tag">圆领</span>
          <span className="overview-tag">无袖</span>
          <span className="overview-tag">宽松版型</span>
          <span className="overview-tag">针织面料</span>
          <span className="overview-tag">包边工艺</span>
        </div>
      </div>

      {/* 快速统计 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📊</span>
          {t('productionData')}
        </div>
        <div className="overview-grid">
          <div className="overview-item">
            <div className="overview-item-value">{materialUsage.fabric.unitLength}m</div>
            <div className="overview-item-label">{t('fabricUsage')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{totalAccessories}</div>
            <div className="overview-item-label">{t('accessoriesCount')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{totalSewingTime}min</div>
            <div className="overview-item-label">{t('sewingTime')}</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-value">{sewingSteps.length}</div>
            <div className="overview-item-label">{t('sewingSteps')}</div>
          </div>
        </div>
      </div>

      {/* 裁片清单 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">✂️</span>
          {t('pieceList')}
        </div>
        {patternPieces.map((piece) => (
          <div key={piece.id} className="material-item">
            <div className="material-item-left">
              <div className="material-item-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: piece.color, display: 'inline-block' }} />
                {piece.name}
              </div>
              <div className="material-item-spec">{piece.nameEn}</div>
            </div>
            <div className="material-item-right">
              <div className="material-item-value">×{piece.count}</div>
              <div className="material-item-unit">{t('piecesUnit')}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div style={{ padding: '0 16px 20px' }}>
        <button className="btn btn-primary" onClick={onExportPDF}>📄 {t('generateBilingual')}{t('baseSizeLabel', { base: gradingRules.baseSize })}</button>
        <div style={{ height: 10 }} />
        <button className="btn btn-secondary">🖨️ {t('connectPrinter')}</button>
      </div>
    </div>
  )
}
