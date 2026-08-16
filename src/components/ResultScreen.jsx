import { useState } from 'react'
import { garmentInfo, patternPieces, gradingRules } from '../data/mockData.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import ExportModal from './ExportModal.jsx'
import OverviewTab from './OverviewTab.jsx'
import PatternView from './PatternView.jsx'
import MeasurementsTab from './MeasurementsTab.jsx'
import GradingTab from './GradingTab.jsx'
import MaterialTab from './MaterialTab.jsx'
import SewingTab from './SewingTab.jsx'
import CustomSizeTab from './CustomSizeTab.jsx'
import TutorialTab from './TutorialTab.jsx'

export default function ResultScreen({
  images,
  onReset,
  userPurpose,
  recordId,
  currentVersion = 1,
  customSizes: initialCustomSizes = null,
  sizeLabel: initialSizeLabel,
  onRegenerate,
  uploadMetadata,
}) {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('overview')
  const [thumbIndex, setThumbIndex] = useState(0)
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [version, setVersion] = useState(currentVersion)
  const [customSizes, setCustomSizes] = useState(initialCustomSizes)
  const [sizeLabel, setSizeLabel] = useState(initialSizeLabel)
  const [regenFlash, setRegenFlash] = useState(false)

  const isCommercial = userPurpose === 'commercial'
  const isPersonal = !isCommercial

  // 动态标签栏
  // 商业模式：概览、纸样、尺寸表、放码、用料、工序、学习手册（删除自定义）
  // 个人模式：概览、纸样、我的尺寸、用料、工序、学习手册（删除尺寸表、放码，保留我的尺寸）
  const TABS = isCommercial
    ? [
        { id: 'overview', icon: '📋', label: t('tabOverview') },
        { id: 'pattern', icon: '📐', label: t('tabPattern') },
        { id: 'measure', icon: '📏', label: t('tabMeasure') },
        { id: 'grading', icon: '🔢', label: t('tabGrading') },
        { id: 'material', icon: '🧵', label: t('tabMaterial') },
        { id: 'sewing', icon: '✂️', label: t('tabSewing') },
        { id: 'tutorial', icon: '📚', label: t('tabTutorial') },
      ]
    : [
        { id: 'overview', icon: '📋', label: t('tabOverview') },
        { id: 'pattern', icon: '📐', label: t('tabPattern') },
        { id: 'custom', icon: '🎯', label: t('tabCustom') },
        { id: 'material', icon: '🧵', label: t('tabMaterial') },
        { id: 'sewing', icon: '✂️', label: t('tabSewing') },
        { id: 'tutorial', icon: '📚', label: t('tabTutorial') },
      ]

  // 底部快捷导航
  const BOTTOM_NAV = isCommercial
    ? [
        { id: 'overview', icon: '📋', label: t('tabOverview') },
        { id: 'pattern', icon: '📐', label: t('tabPattern') },
        { id: 'measure', icon: '📏', label: t('tabMeasure') },
        { id: 'material', icon: '🧵', label: t('tabMaterial') },
        { id: 'tutorial', icon: '📚', label: t('tabTutorial') },
      ]
    : [
        { id: 'overview', icon: '📋', label: t('tabOverview') },
        { id: 'pattern', icon: '📐', label: t('tabPattern') },
        { id: 'custom', icon: '🎯', label: t('tabCustom') },
        { id: 'material', icon: '🧵', label: t('tabMaterial') },
        { id: 'tutorial', icon: '📚', label: t('tabTutorial') },
      ]

  const handleOpenExport = () => {
    setExportModalVisible(true)
  }

  // 修改尺寸后重新生成纸样（仅商业模式）
  const handleRegeneratePattern = (newCustomSizes, newSizeLabel) => {
    if (onRegenerate) {
      onRegenerate(newCustomSizes, newSizeLabel)
    }
    setCustomSizes(newCustomSizes)
    setSizeLabel(newSizeLabel || t('customSize'))
    setVersion(v => v + 1)
    setRegenFlash(true)
    setTimeout(() => setRegenFlash(false), 2000)
    setActiveTab('pattern')
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-back" onClick={onReset}>‹</div>
        <div className="top-bar-title">{t('resultTitle')}</div>
        <div className="top-bar-action" onClick={handleOpenExport}>{t('exportPattern')}</div>
      </div>

      <div className="page-content">
        {/* Version Badge - 仅商业模式显示版本号 */}
        {isCommercial && version > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px 4px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 20,
              background: regenFlash
                ? 'rgba(0, 184, 148, 0.15)'
                : 'rgba(108, 92, 231, 0.1)',
              color: regenFlash ? 'var(--success)' : 'var(--primary)',
              transition: 'all 0.3s',
            }}>
              {regenFlash ? '✓ ' : '📐 '}V{version}
              {customSizes && <span style={{ fontWeight: 400, marginLeft: 4 }}>· {t('customSize')}</span>}
            </span>
            {sizeLabel && (
              <span style={{
                fontSize: 11,
                color: 'var(--text-light)',
              }}>
                {sizeLabel}
              </span>
            )}
          </div>
        )}

        {/* Result Header */}
        <div className="result-header slide-up">
          <div className="result-header-top">
            <div className="result-thumbnail" style={{ position: 'relative' }}>
              {images && images.length > 0 ? (
                <img src={images[thumbIndex]} alt="服装" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              ) : (
                '👙'
              )}
              {images && images.length > 1 && (
                <div className="thumbnail-dots">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`thumbnail-dot ${i === thumbIndex ? 'active' : ''}`}
                      onClick={() => setThumbIndex(i)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="result-info" style={{ flex: 1 }}>
              <h2>{garmentInfo.name}</h2>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4 }}>{garmentInfo.nameEn}</div>
              <div className="result-info-badge">{garmentInfo.category} / {garmentInfo.categoryEn}</div>
              <p className="result-info-desc">{garmentInfo.description}</p>
            </div>
          </div>
          <div className="result-stats">
            <div className="result-stat">
              <div className="result-stat-value">{patternPieces.length}</div>
              <div className="result-stat-label">{t('pieces')}</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">{isCommercial ? '5' : '1'}</div>
              <div className="result-stat-label">{t('sizes')}</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">{garmentInfo.confidence}%</div>
              <div className="result-stat-label">{t('confidence')}</div>
            </div>
            {isCommercial && (
              <div className="result-stat">
                <div className="result-stat-value">{version}</div>
                <div className="result-stat-label">{t('verLabel')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Mode Badge */}
        <div style={{ padding: '0 16px', marginBottom: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            background: isCommercial ? 'rgba(0, 206, 201, 0.1)' : 'rgba(108, 92, 231, 0.1)',
            color: isCommercial ? 'var(--accent)' : 'var(--primary)',
          }}>
            {isCommercial ? t('commercialMode') : t('personalMode')}
          </div>
        </div>

        {/* Upload Metadata (description + sizes) */}
        {uploadMetadata && (uploadMetadata.description || (uploadMetadata.sizes && uploadMetadata.sizes.length > 0)) && (
          <div style={{ padding: '0 16px', marginBottom: 8 }}>
            <div className="card" style={{ padding: 12 }}>
              {uploadMetadata.description && (
                <div style={{ marginBottom: uploadMetadata.sizes && uploadMetadata.sizes.length > 0 ? 10 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {t('descriptionLabel')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {uploadMetadata.description}
                  </div>
                </div>
              )}
              {uploadMetadata.sizes && uploadMetadata.sizes.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    {t('sizeTable')}
                    <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400, marginLeft: 6 }}>
                      （单位：{uploadMetadata.sizeUnit || t('unitCm')}）
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {uploadMetadata.sizes.map((s, i) => (
                      <span key={i} style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 8,
                        background: 'var(--bg)', color: 'var(--text-secondary)', fontWeight: 500,
                      }}>
                        {s.part}: {s.value}{uploadMetadata.sizeUnit || t('unitCm')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* AI 调整提示 - 有附加信息时显示 */}
              {uploadMetadata && (
                <div style={{
                  marginTop: 8, padding: '6px 10px',
                  background: 'rgba(0, 184, 148, 0.06)', borderRadius: 8,
                  fontSize: 11, color: 'var(--success)', lineHeight: 1.5,
                }}>
                  🤖 AI 已根据附加信息调整纸样版型和尺寸
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Bar */}
        <div className="tab-bar">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="fade-in" key={`${activeTab}-${version}`}>
          {activeTab === 'overview' && <OverviewTab onExportPDF={handleOpenExport} userPurpose={userPurpose} />}
          {activeTab === 'pattern' && <PatternView customSizes={customSizes} sizeLabel={sizeLabel} version={version} userPurpose={userPurpose} />}
          {isCommercial && activeTab === 'measure' && <MeasurementsTab customSizes={customSizes} onRegenerate={handleRegeneratePattern} />}
          {isCommercial && activeTab === 'grading' && <GradingTab />}
          {isPersonal && activeTab === 'custom' && (
            <CustomSizeTab
              onRegenerate={handleRegeneratePattern}
              currentCustomSizes={customSizes}
              version={version}
              userPurpose={userPurpose}
            />
          )}
          {activeTab === 'material' && <MaterialTab userPurpose={userPurpose} />}
          {activeTab === 'sewing' && <SewingTab />}
          {activeTab === 'tutorial' && <TutorialTab />}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {BOTTOM_NAV.map((nav) => (
          <div
            key={nav.id}
            className={`nav-item ${activeTab === nav.id ? 'active' : ''}`}
            onClick={() => setActiveTab(nav.id)}
          >
            <span className="nav-item-icon">{nav.icon}</span>
            <span className="nav-item-label">{nav.label}</span>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        customSizes={customSizes}
        sizeLabel={sizeLabel}
        userPurpose={userPurpose}
      />
    </>
  )
}
