import { useState } from 'react'
import { garmentInfo, patternPieces } from '../data/mockData.js'
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
  sizeLabel: initialSizeLabel = 'S (base)',
  onRegenerate,
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [thumbIndex, setThumbIndex] = useState(0)
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [version, setVersion] = useState(currentVersion)
  const [customSizes, setCustomSizes] = useState(initialCustomSizes)
  const [sizeLabel, setSizeLabel] = useState(initialSizeLabel)
  const [regenFlash, setRegenFlash] = useState(false)

  // 根据用户用途决定显示哪些标签
  const isCommercial = userPurpose === 'commercial'

  const TABS = isCommercial
    ? [
        { id: 'overview', label: '概览', icon: '📋' },
        { id: 'pattern', label: '纸样图纸', icon: '📐' },
        { id: 'measure', label: '尺寸表', icon: '📏' },
        { id: 'grading', label: '放码', icon: '🔢' },
        { id: 'custom', label: '自定义', icon: '🎯' },
        { id: 'material', label: '用料', icon: '🧵' },
        { id: 'sewing', label: '工序', icon: '✂️' },
        { id: 'tutorial', label: '学习手册', icon: '📚' },
      ]
    : [
        { id: 'overview', label: '概览', icon: '📋' },
        { id: 'pattern', label: '纸样图纸', icon: '📐' },
        { id: 'measure', label: '尺寸表', icon: '📏' },
        { id: 'custom', label: '我的尺寸', icon: '🎯' },
        { id: 'material', label: '用料', icon: '🧵' },
        { id: 'sewing', label: '工序', icon: '✂️' },
        { id: 'tutorial', label: '学习手册', icon: '📚' },
      ]

  const handleOpenExport = () => {
    setExportModalVisible(true)
  }

  // 修改尺寸后重新生成纸样
  const handleRegeneratePattern = (newCustomSizes, newSizeLabel) => {
    if (onRegenerate) {
      onRegenerate(newCustomSizes, newSizeLabel)
    }
    setCustomSizes(newCustomSizes)
    setSizeLabel(newSizeLabel || '自定义 / Custom')
    setVersion(v => v + 1)
    setRegenFlash(true)
    setTimeout(() => setRegenFlash(false), 2000)
    // 自动切换到纸样图纸页查看新版本
    setActiveTab('pattern')
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-back" onClick={onReset}>‹</div>
        <div className="top-bar-title">识别结果</div>
        <div className="top-bar-action" onClick={handleOpenExport}>导出纸样</div>
      </div>

      <div className="page-content">
        {/* Version Badge */}
        {version > 0 && (
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
              {customSizes && <span style={{ fontWeight: 400, marginLeft: 4 }}>· 自定义尺寸</span>}
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
              <div className="result-stat-label">裁片 / Pieces</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">5</div>
              <div className="result-stat-label">码号 / Sizes</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">{garmentInfo.confidence}%</div>
              <div className="result-stat-label">置信度 / Conf.</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">{version}</div>
              <div className="result-stat-label">版本 / Ver.</div>
            </div>
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
            {isCommercial ? '🏭 商业模式 / Commercial Mode' : '🏠 个人模式 / Personal Mode'}
          </div>
        </div>

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
          {activeTab === 'overview' && <OverviewTab onExportPDF={handleOpenExport} />}
          {activeTab === 'pattern' && <PatternView customSizes={customSizes} sizeLabel={sizeLabel} version={version} />}
          {activeTab === 'measure' && <MeasurementsTab customSizes={customSizes} />}
          {isCommercial && activeTab === 'grading' && <GradingTab />}
          {activeTab === 'custom' && (
            <CustomSizeTab
              onRegenerate={handleRegeneratePattern}
              currentCustomSizes={customSizes}
              version={version}
            />
          )}
          {activeTab === 'material' && <MaterialTab />}
          {activeTab === 'sewing' && <SewingTab />}
          {activeTab === 'tutorial' && <TutorialTab />}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <span className="nav-item-icon">📋</span>
          <span className="nav-item-label">概览</span>
        </div>
        <div className={`nav-item ${activeTab === 'pattern' ? 'active' : ''}`} onClick={() => setActiveTab('pattern')}>
          <span className="nav-item-icon">📐</span>
          <span className="nav-item-label">纸样</span>
        </div>
        <div className={`nav-item ${activeTab === 'tutorial' ? 'active' : ''}`} onClick={() => setActiveTab('tutorial')}>
          <span className="nav-item-icon">📚</span>
          <span className="nav-item-label">学习手册</span>
        </div>
        <div className={`nav-item ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>
          <span className="nav-item-icon">🎯</span>
          <span className="nav-item-label">{isCommercial ? '定制' : '我的尺寸'}</span>
        </div>
        <div className={`nav-item ${activeTab === 'material' ? 'active' : ''}`} onClick={() => setActiveTab('material')}>
          <span className="nav-item-icon">🧵</span>
          <span className="nav-item-label">用料</span>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        customSizes={customSizes}
        sizeLabel={sizeLabel}
      />
    </>
  )
}
