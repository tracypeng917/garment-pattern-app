import { useState, useMemo } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { sizeMeasurements, gradingRules } from '../data/mockData.js'

export default function MeasurementsTab({ onRegenerate }) {
  const { t } = useLang()
  // 放码基准码（M），用于高亮基准列与回传基准列数值
  const baseSize = gradingRules.baseSize
  const baseIdx = sizeMeasurements.sizes.indexOf(baseSize)

  const [unit, setUnit] = useState('cm')
  const [isEditing, setIsEditing] = useState(false)
  const [editedValues, setEditedValues] = useState({})
  const [saved, setSaved] = useState(false)

  // cm -> 目标单位换算（inch = cm / 2.54）
  const convertValue = (cmValue, targetUnit) => {
    if (targetUnit === 'inch') return (cmValue / 2.54).toFixed(1)
    return cmValue
  }

  // 切换单位时，把已编辑的值一并换算到新单位，避免编辑值与显示单位错位
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return
    setEditedValues((prev) => {
      if (Object.keys(prev).length === 0) return prev
      const next = {}
      Object.entries(prev).forEach(([k, v]) => {
        if (v === '' || v == null) {
          next[k] = v
          return
        }
        const num = parseFloat(v)
        if (Number.isNaN(num)) {
          next[k] = v
          return
        }
        if (unit === 'cm' && newUnit === 'inch') {
          next[k] = (num / 2.54).toFixed(1)
        } else if (unit === 'inch' && newUnit === 'cm') {
          next[k] = String(Math.round(num * 2.54 * 10) / 10)
        } else {
          next[k] = v
        }
      })
      return next
    })
    setUnit(newUnit)
  }

  const handleCellEdit = (rowName, sizeIdx, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [`${rowName}-${sizeIdx}`]: value,
    }))
  }

  // baseM 文案形如「（M 码基准）」，去掉半角/全角括号后得到「M 码基准」
  const baseTag = t('baseM').replace(/[()（）]/g, '')

  const handleSave = () => {
    if (!onRegenerate) return
    // 取基准列(M)的编辑值，若当前为 inch 则换算回 cm 后回传
    const customSizesData = {}
    sizeMeasurements.rows.forEach((row) => {
      const key = `${row.name}-${baseIdx}`
      let val = editedValues[key] ?? row.values[baseIdx]
      if (val != null && val !== '') {
        val = parseFloat(val)
        if (Number.isNaN(val)) return
        if (unit === 'inch') val = val * 2.54
        customSizesData[row.name] = Math.round(val * 10) / 10
      }
    })
    onRegenerate(customSizesData, `${baseSize} (edited)`)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedValues({})
  }

  // 取单元格显示值（已编辑优先，否则按当前单位换算）
  const getCellValue = (row, sizeIdx) => {
    const key = `${row.name}-${sizeIdx}`
    if (editedValues[key] !== undefined) return editedValues[key]
    return convertValue(row.values[sizeIdx], unit)
  }

  const base = baseSize

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📏</span>
          {t('sizeTableTitle', { unit })}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
          {t('sizeTableDesc', { base })}
        </p>

        {/* 单位切换 + 编辑控制 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div className="size-unit-switcher">
            <button className={`size-unit-btn ${unit === 'cm' ? 'active' : ''}`} onClick={() => handleUnitChange('cm')}>cm</button>
            <button className={`size-unit-btn ${unit === 'inch' ? 'active' : ''}`} onClick={() => handleUnitChange('inch')}>inch</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isEditing ? (
              <>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '8px 14px' }} onClick={handleCancel}>{t('cancel')}</button>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px' }} onClick={handleSave}>{t('saveSizeTable')}</button>
              </>
            ) : (
              <button className="btn btn-secondary" style={{ fontSize: 12, padding: '8px 14px' }} onClick={() => setIsEditing(true)}>✏️ {t('editSizeTable')}</button>
            )}
          </div>
        </div>

        {/* 保存成功提示 */}
        {saved && (
          <div style={{ fontSize: 12, color: 'var(--success)', background: 'rgba(0, 184, 148, 0.1)', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
            ✓ {t('sizeSaved')}
          </div>
        )}

        {/* 编辑提示 */}
        {isEditing && (
          <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 8 }}>
            💡 {t('editSizeTable')}
          </div>
        )}

        {/* 尺寸表 */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>部位</th>
                {sizeMeasurements.sizes.map((sz, idx) => (
                  <th key={sz} style={{
                    padding: '8px 10px', textAlign: 'center', fontWeight: 600,
                    color: idx === baseIdx ? 'var(--primary)' : 'var(--text-secondary)',
                    borderBottom: '2px solid var(--border)',
                    background: idx === baseIdx ? 'rgba(108, 92, 231, 0.05)' : 'transparent',
                  }}>
                    {sz}{idx === baseIdx ? ` (${baseTag})` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeMeasurements.rows.map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 500, color: 'var(--text)' }}>
                    {row.name} / {row.nameEn}
                  </td>
                  {row.values.map((_, sizeIdx) => (
                    <td key={sizeIdx} style={{
                      padding: isEditing ? '2px' : '8px 10px',
                      textAlign: 'center',
                      background: sizeIdx === baseIdx ? 'rgba(108, 92, 231, 0.03)' : 'transparent',
                    }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={getCellValue(row, sizeIdx)}
                          onChange={(e) => handleCellEdit(row.name, sizeIdx, e.target.value)}
                          style={{
                            width: 50, padding: '4px 6px', textAlign: 'center',
                            border: '1px solid var(--border)', borderRadius: 4,
                            fontSize: 12, background: 'var(--card-bg)',
                          }}
                        />
                      ) : (
                        <span style={{ color: sizeIdx === baseIdx ? 'var(--primary)' : 'var(--text)', fontWeight: sizeIdx === baseIdx ? 600 : 400 }}>
                          {getCellValue(row, sizeIdx)}
                        </span>
                      )}
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
          测量方法说明
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p><strong>衣长：</strong>后颈点至下摆边缘的垂直距离</p>
          <p><strong>胸围：</strong>腋下 2cm 处水平围量一周</p>
          <p><strong>腰围：</strong>腰部最细处水平围量一周</p>
          <p><strong>肩宽：</strong>左右肩点之间的距离</p>
          <p><strong>袖长：</strong>肩点至袖口边缘的距离</p>
          <p><strong>领围：</strong>领口下沿围量一周</p>
        </div>
      </div>
    </div>
  )
}
