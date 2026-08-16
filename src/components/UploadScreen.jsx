import { useState, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function UploadScreen({ onUpload }) {
  const { t } = useLang()
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  // 附加信息（可选）
  const [showExtra, setShowExtra] = useState(false)
  const [description, setDescription] = useState('')
  const [sizeUnit, setSizeUnit] = useState('cm')
  const [sizeRows, setSizeRows] = useState([]) // [{ part: '', value: '' }]

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImages = [...images]
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        newImages.push(ev.target.result)
        setImages([...newImages])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (idx) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleStart = () => {
    // 组装附加信息
    const metadata = {}
    if (description.trim()) {
      metadata.description = description.trim()
    }
    // 过滤有效的尺寸行
    const validSizes = sizeRows.filter(r => r.part.trim() && r.value.trim())
    if (validSizes.length > 0) {
      metadata.sizes = validSizes.map(r => ({ part: r.part.trim(), value: parseFloat(r.value) }))
      metadata.sizeUnit = sizeUnit
    }
    onUpload(images, Object.keys(metadata).length > 0 ? metadata : null)
  }

  // 尺寸行操作
  const addSizeRow = () => {
    if (sizeRows.length >= 10) return
    setSizeRows([...sizeRows, { part: '', value: '' }])
  }

  const removeSizeRow = (idx) => {
    setSizeRows(sizeRows.filter((_, i) => i !== idx))
  }

  const updateSizeRow = (idx, field, value) => {
    setSizeRows(sizeRows.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  return (
    <div className="page-content fade-in">
      <div className="upload-screen">
        <div className="upload-hero">
          <div className="upload-hero-icon">✂️</div>
          <h1>{t('uploadTitle')}</h1>
          <p style={{ whiteSpace: 'pre-line' }}>{t('uploadDesc')}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Upload zone */}
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">📷</div>
          <div className="upload-zone-text">{t('clickUpload')}</div>
          <div className="upload-zone-hint">{t('uploadHint')}</div>
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="image-preview-grid slide-up">
            {images.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img} alt={`预览 ${i + 1}`} className="image-preview-img" />
                <div className="image-preview-badge">{i === 0 ? t('front') : i === 1 ? t('back') : `${t('detail')}${i - 1}`}</div>
                <button
                  className="image-preview-remove"
                  onClick={(e) => { e.stopPropagation(); handleRemove(i) }}
                >
                  ✕
                </button>
              </div>
            ))}
            {/* Add more button */}
            {images.length < 6 && (
              <div className="image-preview-add" onClick={() => fileInputRef.current?.click()}>
                <span className="image-preview-add-icon">+</span>
                <span className="image-preview-add-text">{t('add')}</span>
              </div>
            )}
          </div>
        )}

        {/* 附加信息（可选） */}
        <div className="extra-info-section">
          <div
            className="extra-info-toggle"
            onClick={() => setShowExtra(!showExtra)}
          >
            <span className="extra-info-toggle-icon">{showExtra ? '▾' : '▸'}</span>
            <span>{t('extraInfo')}</span>
            <span className="extra-info-toggle-hint">{t('extraInfoHint')}</span>
          </div>

          {showExtra && (
            <div className="extra-info-body fade-in">
              {/* 描述输入 */}
              <div style={{ marginBottom: 14 }}>
                <label className="extra-info-label">
                  {t('descriptionLabel')}
                </label>
                <textarea
                  className="custom-input extra-textarea"
                  placeholder={t('descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                />
                <div className="extra-char-count">{description.length}/300</div>
              </div>

              {/* 尺寸表 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="extra-info-label" style={{ marginBottom: 0 }}>
                    {t('sizeTable')}
                  </label>
                  {/* 单位选择（全局，只需选一次） */}
                  <div className="size-unit-switcher">
                    <button
                      className={`size-unit-btn ${sizeUnit === 'cm' ? 'active' : ''}`}
                      onClick={() => setSizeUnit('cm')}
                    >
                      {t('unitCm')}
                    </button>
                    <button
                      className={`size-unit-btn ${sizeUnit === 'inch' ? 'active' : ''}`}
                      onClick={() => setSizeUnit('inch')}
                    >
                      {t('unitInch')}
                    </button>
                  </div>
                </div>

                {/* 尺寸行 */}
                {sizeRows.length > 0 && (
                  <div className="size-rows-list">
                    {sizeRows.map((row, idx) => (
                      <div key={idx} className="size-row">
                        <input
                          type="text"
                          className="custom-input size-row-part"
                          placeholder={t('sizePartPlaceholder')}
                          value={row.part}
                          onChange={(e) => updateSizeRow(idx, 'part', e.target.value)}
                        />
                        <input
                          type="number"
                          className="custom-input size-row-value"
                          placeholder={t('sizeValuePlaceholder')}
                          value={row.value}
                          onChange={(e) => updateSizeRow(idx, 'value', e.target.value)}
                        />
                        <span className="size-row-unit">{sizeUnit}</span>
                        <button
                          className="size-row-remove"
                          onClick={() => removeSizeRow(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 添加尺寸行 */}
                {sizeRows.length < 10 && (
                  <button className="btn-size-add" onClick={addSizeRow}>
                    + {t('addSize')}{sizeRows.length > 0 ? `（${sizeRows.length}/10）` : ''}
                  </button>
                )}
                {sizeRows.length >= 10 && (
                  <div className="size-max-hint">{t('maxSizeReached')}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <button className="btn btn-primary slide-up" onClick={handleStart} style={{ marginTop: 16 }}>
            🔍 {t('startAI')}（{images.length} {t('imagesCount')}）
          </button>
        )}

        <div className="upload-features">
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(108,92,231,0.1)' }}>📐</div>
            <div className="upload-feature-text">
              <h4>{t('generateBilingual')}</h4>
              <p>{t('patternDesc', { count: 6 })}</p>
            </div>
          </div>
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(0,206,201,0.1)' }}>📚</div>
            <div className="upload-feature-text">
              <h4>{t('learningManual')}</h4>
              <p>{t('tutorialIntro')}</p>
            </div>
          </div>
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(253,203,110,0.15)' }}>📄</div>
            <div className="upload-feature-text">
              <h4>{t('generateBilingual')}</h4>
              <p>{t('patternDesc', { count: 6 })}</p>
            </div>
          </div>
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(255,118,117,0.1)' }}>🤖</div>
            <div className="upload-feature-text">
              <h4>AI</h4>
              <p>{t('uploadHint')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
