import { useState, useMemo, useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { bodyMeasurements, sizeMeasurements, recommendSize, calculateCustomGarmentSize, gradingRules } from '../data/mockData.js'
import { generatePatternPDF } from '../utils/pdfExport.js'
import { getBodyMeasurements, saveBodyMeasurements } from '../utils/storage.js'

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

export default function CustomSizeTab({ onRegenerate, currentCustomSizes, version = 1, userPurpose }) {
  const { t } = useLang()
  const isPersonal = userPurpose === 'personal'

  // 从 localStorage 加载已保存的身材数据
  const savedBody = getBodyMeasurements()

  // 用户输入的身材数据
  const [userBody, setUserBody] = useState(() => {
    const init = {}
    PERSONAL_FIELDS.forEach(f => {
      init[f.name] = savedBody?.[f.name] || savedBody?.bodyMeasurements?.[f.name] || ''
    })
    return init
  })

  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [calculated, setCalculated] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // 如果从历史记录恢复且有自定义尺寸，标记为已计算
  useEffect(() => {
    if (currentCustomSizes && Object.keys(currentCustomSizes).length > 0) {
      setCalculated(true)
    }
  }, [currentCustomSizes])

  const handleChange = (name, value) => {
    setUserBody(prev => ({ ...prev, [name]: value }))
    setCalculated(false)
    if (error) setError('')
  }

  // 收集有效数据
  const collectValid = () => {
    const data = {}
    PERSONAL_FIELDS.forEach(f => {
      const v = userBody[f.name]
      if (v !== '' && v != null && !isNaN(Number(v))) {
        data[f.name] = Number(v)
      }
    })
    return data
  }

  // 保存身材数据
  const handleSave = () => {
    const data = collectValid()
    if (Object.keys(data).length === 0) {
      setError(t('bodyMeasurementsHint'))
      return
    }
    saveBodyMeasurements(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 计算并生成纸样
  const handleCalculate = () => {
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
      setError(`${t('bodyMeasurementsHint')}：${labels.join('、')}`)
      return
    }

    setError('')
    const data = collectValid()
    saveBodyMeasurements(data)
    setCalculated(true)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    // 传回给 ResultScreen
    if (onRegenerate) {
      onRegenerate(data, isPersonal ? 'Custom' : `Custom V${version + 1}`)
    }
  }

  return (
    <div className="fade-in">
      {/* 说明卡片 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📏</span>
          {t('bodyMeasurements')}
          <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400, marginLeft: 6 }}>
            / cm
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
          {t('bodyMeasurementsDesc')}
        </p>
        <div style={{ fontSize: 11, color: 'var(--text-light)', lineHeight: 1.5 }}>
          {t('bodyMeasurementsHint')}
        </div>
      </div>

      {/* 身材数据输入 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📝</span>
          {t('bodyMeasurements')}
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
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                  <span className="custom-input-unit">cm</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            marginTop: 12, fontSize: 12, color: 'var(--danger)',
            background: 'rgba(255, 118, 117, 0.08)',
            padding: '8px 12px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* 保存按钮 */}
        <button
          className="btn btn-secondary"
          style={{ marginTop: 16 }}
          onClick={handleSave}
        >
          💾 {t('save')}
        </button>
        {saved && (
          <div style={{
            marginTop: 8, fontSize: 12, color: 'var(--success)',
            textAlign: 'center', fontWeight: 600,
          }}>
            ✅ {t('saved')}
          </div>
        )}

        {/* 生成/计算按钮 */}
        <button
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={handleCalculate}
        >
          ✂️ {t('startAI')}
        </button>
      </div>
    </div>
  )
}
