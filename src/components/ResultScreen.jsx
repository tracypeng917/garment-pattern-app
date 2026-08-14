import { useState } from 'react'
import { garmentInfo, patternPieces } from '../data/mockData.js'
import { generatePatternPDF } from '../utils/pdfExport.js'
import OverviewTab from './OverviewTab.jsx'
import PatternView from './PatternView.jsx'
import MeasurementsTab from './MeasurementsTab.jsx'
import GradingTab from './GradingTab.jsx'
import MaterialTab from './MaterialTab.jsx'
import SewingTab from './SewingTab.jsx'
import CustomSizeTab from './CustomSizeTab.jsx'
import TutorialTab from './TutorialTab.jsx'

const TABS = [
  { id: 'overview', label: '概览', icon: '📋' },
  { id: 'pattern', label: '纸样图纸', icon: '📐' },
  { id: 'measure', label: '尺寸表', icon: '📏' },
  { id: 'grading', label: '放码', icon: '🔢' },
  { id: 'custom', label: '自定义', icon: '🎯' },
  { id: 'material', label: '用料', icon: '🧵' },
  { id: 'sewing', label: '工序', icon: '✂️' },
  { id: 'tutorial', label: '教程', icon: '📚' },
]

export default function ResultScreen({ images, onReset }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [thumbIndex, setThumbIndex] = useState(0)

  const handleExportPDF = () => {
    generatePatternPDF({ sizeLabel: 'S (base)', customSizes: null })
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-back" onClick={onReset}>‹</div>
        <div className="top-bar-title">识别结果</div>
        <div className="top-bar-action" onClick={handleExportPDF}>导出 PDF</div>
      </div>

      <div className="page-content">
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
              <div className="result-stat-value">{images?.length || 0}</div>
              <div className="result-stat-label">图片 / Photos</div>
            </div>
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
        <div className="fade-in" key={activeTab}>
          {activeTab === 'overview' && <OverviewTab onExportPDF={handleExportPDF} />}
          {activeTab === 'pattern' && <PatternView />}
          {activeTab === 'measure' && <MeasurementsTab />}
          {activeTab === 'grading' && <GradingTab />}
          {activeTab === 'custom' && <CustomSizeTab />}
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
          <span className="nav-item-label">教程</span>
        </div>
        <div className={`nav-item ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>
          <span className="nav-item-icon">🎯</span>
          <span className="nav-item-label">定制</span>
        </div>
        <div className={`nav-item ${activeTab === 'material' ? 'active' : ''}`} onClick={() => setActiveTab('material')}>
          <span className="nav-item-icon">🧵</span>
          <span className="nav-item-label">用料</span>
        </div>
      </div>
    </>
  )
}
