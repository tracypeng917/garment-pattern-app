import { useState, useRef, useEffect, useCallback } from 'react'
import { generatePatternPDF, generatePatternPDFDoc, exportDXF, exportPRJ } from '../utils/pdfExport.js'
import { garmentInfo, gradingRules } from '../data/mockData.js'

const FORMATS = [
  {
    id: 'pdf',
    label: 'PDF',
    desc: '通用文档格式 / Universal document',
    icon: '📄',
    hint: '适合打印和预览，所有设备可打开',
  },
  {
    id: 'dxf',
    label: 'DXF',
    desc: 'CAD 交换格式 / CAD Exchange',
    icon: '📐',
    hint: '用于不同 CAD 软件间传递轮廓曲线数据，能否打开取决于导出规范和软件版本',
  },
  {
    id: 'prj',
    label: 'PRJ',
    desc: 'ET 工程文件 / ET Project',
    icon: '📦',
    hint: 'ET 服装 CAD 工程文件，适合保留项目数据在 ET 中继续修改',
  },
]

export default function ExportModal({ visible, onClose, customSizes, sizeLabel, userPurpose = 'commercial' }) {
  const isPersonal = userPurpose === 'personal'
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const defaultName = `PatternAI_${garmentInfo.nameEn.replace(/\s+/g, '_')}_${sizeLabel || (isPersonal ? 'Custom' : gradingRules.baseSize)}`
  const opts = { sizeLabel: sizeLabel || (isPersonal ? 'Custom' : `${gradingRules.baseSize} (base)`), customSizes: customSizes || null }

  // 生成 PDF 预览
  const generatePreview = useCallback(() => {
    setGenerating(true)
    try {
      const doc = generatePatternPDFDoc(opts)
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (e) {
      console.error('Preview generation failed:', e)
      setPreviewUrl(null)
    }
    setGenerating(false)
  }, [customSizes, sizeLabel])

  // 当弹窗显示时生成预览
  useEffect(() => {
    if (visible && !previewUrl) {
      generatePreview()
    }
    if (!visible) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setExportDone(false)
      setSelectedFormat('pdf')
      setFileName('')
    }
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps

  // 清理预览 URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleExport = () => {
    setExporting(true)
    setExportDone(false)
    const name = fileName.trim() || defaultName
    const fullOpts = { ...opts, fileName: name }

    try {
      if (selectedFormat === 'pdf') {
        generatePatternPDF(fullOpts)
      } else if (selectedFormat === 'dxf') {
        exportDXF(fullOpts)
      } else if (selectedFormat === 'prj') {
        exportPRJ(fullOpts)
      }
      setExportDone(true)
      setTimeout(() => setExportDone(false), 3000)
    } catch (e) {
      console.error('Export failed:', e)
      alert('导出失败，请重试 / Export failed, please try again')
    }
    setExporting(false)
  }

  if (!visible) return null

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="export-modal-header">
          <div className="export-modal-title">
            <span>📤</span>
            <span>导出纸样 / Export Pattern</span>
          </div>
          <div className="export-modal-close" onClick={onClose}>✕</div>
        </div>

        {/* Preview area */}
        <div className="export-preview-area">
          {generating && (
            <div className="export-preview-loading">
              <div className="export-spinner" />
              <span>生成预览中... / Generating preview...</span>
            </div>
          )}
          {!generating && previewUrl && (
            <iframe
              src={previewUrl}
              className="export-preview-iframe"
              title="PDF Preview"
            />
          )}
          {!generating && !previewUrl && (
            <div className="export-preview-error">
              <span>📄</span>
              <span>预览生成失败 / Preview failed</span>
            </div>
          )}
        </div>

        {/* Format selection */}
        <div className="export-format-section">
          <div className="export-section-label">选择格式 / Format</div>
          <div className="export-format-list">
            {FORMATS.map(fmt => (
              <div
                key={fmt.id}
                className={`export-format-item ${selectedFormat === fmt.id ? 'active' : ''}`}
                onClick={() => setSelectedFormat(fmt.id)}
              >
                <span className="export-format-icon">{fmt.icon}</span>
                <div className="export-format-info">
                  <div className="export-format-name">{fmt.label}</div>
                  <div className="export-format-desc">{fmt.desc}</div>
                </div>
                <div className={`export-format-radio ${selectedFormat === fmt.id ? 'checked' : ''}`}>
                  {selectedFormat === fmt.id && <span />}
                </div>
              </div>
            ))}
          </div>
          <div className="export-format-hint">
            {FORMATS.find(f => f.id === selectedFormat)?.hint}
          </div>
        </div>

        {/* File name */}
        <div className="export-filename-section">
          <div className="export-section-label">文件名 / File Name</div>
          <div className="export-filename-wrapper">
            <input
              type="text"
              className="export-filename-input"
              placeholder={defaultName}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              maxLength={60}
            />
            <span className="export-filename-ext">.{selectedFormat}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="export-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            取消 / Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? '导出中... / Exporting...' :
             exportDone ? '✓ 已下载 / Downloaded' :
             `⬇️ 下载 / Download`}
          </button>
        </div>
      </div>
    </div>
  )
}
