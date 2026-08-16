import { useState, useCallback, useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { garmentInfo } from '../data/mockData.js'
import { addHistoryRecord, getBodyMeasurements, saveBodyMeasurements } from '../utils/storage.js'
import UploadScreen from './UploadScreen.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import ResultScreen from './ResultScreen.jsx'

// 私人定制身材尺寸字段定义
const PERSONAL_FIELDS = [
  { name: '身高', tKey: 'height', nameEn: 'Height', required: true, placeholder: '165' },
  { name: '胸围', tKey: 'bust', nameEn: 'Bust', required: true, placeholder: '88' },
  { name: '腰围', tKey: 'waist', nameEn: 'Waist', required: true, placeholder: '68' },
  { name: '臀围', tKey: 'hip', nameEn: 'Hip', required: true, placeholder: '94' },
  { name: '肩宽', tKey: 'shoulder', nameEn: 'Shoulder', required: false, placeholder: '38' },
  { name: '袖长', tKey: 'sleeveLength', nameEn: 'Sleeve Length', required: false, placeholder: '58' },
  { name: '颈围', tKey: 'neckCircumference', nameEn: 'Neck Circumference', required: false, placeholder: '35' },
]

const REQUIRED_FIELDS = ['身高', '胸围', '腰围', '臀围']

export default function PersonalCustom({ userPurpose = 'personal' }) {
  const { t } = useLang()

  // 屏幕状态：measurements → upload → loading → result
  const [screen, setScreen] = useState('measurements')
  const [images, setImages] = useState([])
  const [uploadMetadata, setUploadMetadata] = useState(null)
  const [currentRecordId, setCurrentRecordId] = useState(null)
  const [currentVersion, setCurrentVersion] = useState(1)
  const [currentCustomSizes, setCurrentCustomSizes] = useState(null)
  const [currentSizeLabel, setCurrentSizeLabel] = useState('Custom')

  // 身材尺寸数据
  const [userBody, setUserBody] = useState(() => {
    const saved = getBodyMeasurements()
    const init = {}
    PERSONAL_FIELDS.forEach(f => {
      init[f.name] = saved?.[f.name] || saved?.bodyMeasurements?.[f.name] || ''
    })
    return init
  })
  const [bodyError, setBodyError] = useState('')
  const [bodySaved, setBodySaved] = useState(false)

  // 检查是否已有保存的身材数据，有则直接进入上传页
  useEffect(() => {
    const saved = getBodyMeasurements()
    const bodyData = saved?.bodyMeasurements || saved
    if (bodyData && bodyData['身高'] && bodyData['胸围'] && bodyData['腰围'] && bodyData['臀围']) {
      setScreen('upload')
    }
  }, [])

  // ===== 身材尺寸相关 =====
  const handleBodyChange = (name, value) => {
    setUserBody(prev => ({ ...prev, [name]: value }))
    if (bodyError) setBodyError('')
  }

  const collectValidBody = () => {
    const data = {}
    PERSONAL_FIELDS.forEach(f => {
      const v = userBody[f.name]
      if (v !== '' && v != null && !isNaN(Number(v))) {
        data[f.name] = Number(v)
      }
    })
    return data
  }

  const handleBodySave = () => {
    // 校验必填项
    const missing = REQUIRED_FIELDS.filter(name => {
      const v = userBody[name]
      return v === '' || v == null || isNaN(Number(v))
    })
    if (missing.length > 0) {
      const labels = missing
        .map(name => PERSONAL_FIELDS.find(f => f.name === name))
        .filter(Boolean)
        .map(f => t(f.tKey))
      setBodyError(`${t('bodyMeasurementsHint')}：${labels.join('、')}`)
      return
    }

    const data = collectValidBody()
    saveBodyMeasurements(data)
    setBodySaved(true)
    setBodyError('')
    setTimeout(() => setBodySaved(false), 1500)
  }

  const handleBodySaveAndContinue = () => {
    const missing = REQUIRED_FIELDS.filter(name => {
      const v = userBody[name]
      return v === '' || v == null || isNaN(Number(v))
    })
    if (missing.length > 0) {
      const labels = missing
        .map(name => PERSONAL_FIELDS.find(f => f.name === name))
        .filter(Boolean)
        .map(f => t(f.tKey))
      setBodyError(`${t('bodyMeasurementsHint')}：${labels.join('、')}`)
      return
    }

    const data = collectValidBody()
    saveBodyMeasurements(data)
    setCurrentCustomSizes(data)
    setScreen('upload')
  }

  // ===== 上传相关 =====
  const handleUpload = useCallback((imgs, metadata) => {
    setImages(imgs)
    setUploadMetadata(metadata)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    const bodyData = collectValidBody()
    const record = addHistoryRecord({
      garmentName: garmentInfo.name,
      garmentNameEn: garmentInfo.nameEn,
      thumbnail: images && images.length > 0 ? images[0] : '',
      images: images || [],
      sizeLabel: 'Custom',
      customSizes: bodyData,
      metadata: uploadMetadata,
    })
    setCurrentRecordId(record.id)
    setCurrentVersion(1)
    setCurrentCustomSizes(bodyData)
    setCurrentSizeLabel('Custom')
    setScreen('result')
  }, [images, uploadMetadata])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
    setCurrentRecordId(null)
    setCurrentVersion(1)
    setCurrentSizeLabel('Custom')
    setUploadMetadata(null)
  }, [])

  // 从结果页返回到尺寸编辑
  const handleBackToMeasurements = () => {
    setScreen('measurements')
  }

  // "我的尺寸" 标签里用户填了身材数据后重新生成
  const handleRegenerate = useCallback((newCustomSizes, newSizeLabel) => {
    setCurrentCustomSizes(newCustomSizes)
    setCurrentSizeLabel(newSizeLabel || 'Custom')
  }, [])

  // ===== 身材尺寸页 =====
  if (screen === 'measurements') {
    const hasSaved = getBodyMeasurements()
    const hasValidSaved = hasSaved?.bodyMeasurements &&
      hasSaved.bodyMeasurements['身高'] &&
      hasSaved.bodyMeasurements['胸围'] &&
      hasSaved.bodyMeasurements['腰围'] &&
      hasSaved.bodyMeasurements['臀围']

    return (
      <div className="page-content fade-in">
        <div className="upload-screen">
          <div className="upload-hero">
            <div className="upload-hero-icon">📏</div>
            <h1>{t('personalCustom')}</h1>
            <p style={{ whiteSpace: 'pre-line' }}>
              先填写您的身材数据，保存后即可上传服装图片生成专属纸样
            </p>
          </div>

          {/* 说明卡片 */}
          <div className="card" style={{ margin: '0 16px 12px', textAlign: 'left' }}>
            <div className="card-title">
              <span className="card-title-icon">📋</span>
              填写说明
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              请用软尺量取您的净体尺寸（贴着皮肤量，不要太紧也不要太松）。
              身高、胸围、腰围、臀围为必填项，填好后系统将根据您的身材生成专属纸样。
            </p>
          </div>

          {/* 身材数据输入 */}
          <div className="card" style={{ margin: '0 16px 12px', textAlign: 'left' }}>
            <div className="card-title">
              <span className="card-title-icon">📝</span>
              {t('bodyMeasurements')}
              <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400, marginLeft: 6 }}>
                / cm
              </span>
            </div>

            <div className="custom-input-grid">
              {PERSONAL_FIELDS.map((field) => {
                const isRequired = REQUIRED_FIELDS.includes(field.name)
                return (
                  <div key={field.name} className="custom-input-item">
                    <label className="custom-input-label">
                      {t(field.tKey)}
                      {isRequired && (
                        <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>
                      )}
                      <span className="custom-input-en">{field.nameEn}</span>
                    </label>
                    <div className="custom-input-wrapper">
                      <input
                        type="number"
                        inputMode="decimal"
                        className="custom-input"
                        placeholder={field.placeholder}
                        value={userBody[field.name]}
                        onChange={(e) => handleBodyChange(field.name, e.target.value)}
                      />
                      <span className="custom-input-unit">cm</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 错误提示 */}
            {bodyError && (
              <div style={{
                marginTop: 12, fontSize: 12, color: 'var(--danger)',
                background: 'rgba(255, 118, 117, 0.08)',
                padding: '8px 12px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5,
              }}>
                {bodyError}
              </div>
            )}

            {bodySaved && (
              <div style={{
                marginTop: 8, fontSize: 12, color: 'var(--success)',
                textAlign: 'center', fontWeight: 600,
              }}>
                ✅ {t('saved')}
              </div>
            )}

            {/* 保存并继续按钮 */}
            <button
              className="btn btn-primary"
              style={{ marginTop: 16, width: '100%' }}
              onClick={handleBodySaveAndContinue}
            >
              💾 保存并上传图片
            </button>

            {/* 仅保存按钮 */}
            <button
              className="btn btn-secondary"
              style={{ marginTop: 8, width: '100%' }}
              onClick={handleBodySave}
            >
              仅保存尺寸
            </button>

            {/* 已有数据时的快速入口 */}
            {hasValidSaved && (
              <button
                className="btn btn-secondary"
                style={{ marginTop: 8, width: '100%' }}
                onClick={() => setScreen('upload')}
              >
                跳过，直接上传图片 →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ===== 上传页 =====
  if (screen === 'upload') {
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {/* 返回尺寸编辑按钮 */}
        <div style={{
          position: 'absolute', top: 0, right: 16, zIndex: 10,
          fontSize: 12, color: 'var(--primary)', fontWeight: 600,
          cursor: 'pointer', padding: '8px 12px',
        }} onClick={handleBackToMeasurements}>
          📏 编辑尺寸
        </div>
        <UploadScreen onUpload={handleUpload} />
      </div>
    )
  }

  // ===== 生成中 =====
  if (screen === 'loading') {
    return (
      <LoadingScreen
        imageCount={images.length}
        onComplete={handleAnalysisComplete}
        userPurpose="personal"
      />
    )
  }

  // ===== 结果页 =====
  return (
    <ResultScreen
      images={images}
      onReset={handleReset}
      userPurpose="personal"
      recordId={currentRecordId}
      currentVersion={currentVersion}
      customSizes={currentCustomSizes}
      sizeLabel={currentSizeLabel}
      onRegenerate={handleRegenerate}
      uploadMetadata={uploadMetadata}
    />
  )
}
