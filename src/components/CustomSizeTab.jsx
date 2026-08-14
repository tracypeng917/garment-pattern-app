import { useState, useMemo, useEffect } from 'react'
import { bodyMeasurements, sizeMeasurements, recommendSize, calculateCustomGarmentSize } from '../data/mockData.js'
import { generatePatternPDF } from '../utils/pdfExport.js'
import { getBodyMeasurements, saveBodyMeasurements } from '../utils/storage.js'

export default function CustomSizeTab() {
  // 从 localStorage 加载已保存的身材数据
  const savedBody = getBodyMeasurements()

  // 用户输入的身材数据（优先使用已保存的数据）
  const [userBody, setUserBody] = useState({
    '身高': savedBody?.['身高'] || '',
    '胸围': savedBody?.['胸围'] || '',
    '腰围': savedBody?.['腰围'] || '',
    '臀围': savedBody?.['臀围'] || '',
    '肩宽': savedBody?.['肩宽'] || '',
    '袖长': savedBody?.['袖长'] || '',
    '颈围': savedBody?.['颈围'] || '',
  })

  // 手动微调的成衣尺寸
  const [manualAdjust, setManualAdjust] = useState({})

  // 是否已计算
  const [calculated, setCalculated] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (name, value) => {
    setUserBody(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }))
    setCalculated(false)
  }

  const handleCalculate = () => {
    // 过滤掉空值
    const filtered = {}
    Object.entries(userBody).forEach(([k, v]) => {
      if (v !== '' && v != null) filtered[k] = v
    })
    if (Object.keys(filtered).length < 3) {
      alert('请至少输入 3 项身材数据')
      return
    }
    setCalculated(true)
    // 自动保存到 localStorage
    saveBodyMeasurements(filtered)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSave = () => {
    const filtered = {}
    Object.entries(userBody).forEach(([k, v]) => {
      if (v !== '' && v != null) filtered[k] = v
    })
    if (Object.keys(filtered).length === 0) {
      alert('请先输入身材数据')
      return
    }
    saveBodyMeasurements(filtered)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const result = useMemo(() => {
    if (!calculated) return null
    const filtered = {}
    Object.entries(userBody).forEach(([k, v]) => {
      if (v !== '' && v != null) filtered[k] = v
    })
    return calculateCustomGarmentSize(filtered)
  }, [calculated, userBody])

  // 合并自动计算和手动微调
  const finalSizes = useMemo(() => {
    if (!result) return null
    const merged = { ...result.customSizes }
    Object.entries(manualAdjust).forEach(([k, v]) => {
      if (v !== '' && v != null) merged[k] = parseFloat(v)
    })
    return merged
  }, [result, manualAdjust])

  const handleManualChange = (name, value) => {
    setManualAdjust(prev => ({ ...prev, [name]: value }))
  }

  const handleExportPDF = () => {
    generatePatternPDF({
      sizeLabel: `Custom (${result?.bestSize || 'S'} base)`,
      customSizes: finalSizes,
    })
  }

  const inputFields = bodyMeasurements.rows

  return (
    <div className="fade-in">
      {/* 说明 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🎯</span>
          自定义尺寸调整
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          输入您的身材净尺寸数据，系统将自动推荐最接近的码号并计算成衣尺寸。您还可以手动微调各部位尺寸，生成专属定制纸样 PDF。
        </p>
      </div>

      {/* 身材输入 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📝</span>
          身材数据输入（cm）
        </div>

        <div className="custom-input-grid">
          {inputFields.map((field) => (
            <div key={field.name} className="custom-input-item">
              <label className="custom-input-label">
                {field.name}
                <span className="custom-input-en">{field.nameEn}</span>
              </label>
              <div className="custom-input-wrapper">
                <input
                  type="number"
                  className="custom-input"
                  placeholder={`S: ${field.values[0]}`}
                  value={userBody[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
                <span className="custom-input-unit">cm</span>
              </div>
              <div className="custom-input-hint">
                S:{field.values[0]} M:{field.values[1]} L:{field.values[2]} XL:{field.values[3]} XXL:{field.values[4]}
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: 16 }}
          onClick={handleCalculate}
        >
          🔍 计算推荐尺寸
        </button>
        <button
          className="btn btn-secondary"
          style={{ marginTop: 8 }}
          onClick={handleSave}
        >
          💾 保存我的尺寸数据
        </button>
        {saved && (
          <div style={{
            marginTop: 8, fontSize: 12, color: 'var(--success)', textAlign: 'center', fontWeight: 600,
          }}>
            ✅ 尺寸数据已保存，下次打开无需重新填写
          </div>
        )}
        {Object.values(userBody).some(v => v !== '') && (
          <div style={{
            marginTop: 8, fontSize: 11, color: 'var(--text-light)', textAlign: 'center',
          }}>
            📋 数据将保存在本地浏览器中 / Data saved locally in your browser
          </div>
        )}
      </div>

      {/* 计算结果 */}
      {result && (
        <>
          {/* 推荐码号 */}
          <div className="card slide-up">
            <div className="card-title">
              <span className="card-title-icon">✅</span>
              推荐结果
            </div>
            <div className="recommend-banner">
              <div className="recommend-size">
                <span className="recommend-size-label">推荐码号</span>
                <span className="recommend-size-value">{result.bestSize}</span>
              </div>
              <div className="recommend-info">
                <p>基于您的身材数据，系统推荐以 <strong>{result.bestSize}</strong> 码为基础进行定制。</p>
                <p>放码基准为 <strong>S 码</strong>，已自动计算各部位调整量。</p>
              </div>
            </div>

            {/* 身材差值对比 */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                身材与推荐码号对比
              </div>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="row-name">部位</th>
                      <th>您的尺寸</th>
                      <th>{result.bestSize}码标准</th>
                      <th>差值</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputFields.map((field) => {
                      const userVal = userBody[field.name]
                      if (userVal === '' || userVal == null) return null
                      const sizeIdx = bodyMeasurements.sizes.indexOf(result.bestSize)
                      const stdVal = field.values[sizeIdx]
                      const diff = parseFloat(userVal) - stdVal
                      return (
                        <tr key={field.name}>
                          <td className="row-name">{field.name}</td>
                          <td>{userVal}</td>
                          <td>{stdVal}</td>
                          <td style={{
                            color: diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--danger)' : 'var(--text)',
                            fontWeight: 600
                          }}>
                            {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 成衣尺寸调整 */}
          <div className="card slide-up">
            <div className="card-title">
              <span className="card-title-icon">🔧</span>
              成衣尺寸微调（cm）
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 12 }}>
              系统已自动计算推荐成衣尺寸，您可手动修改任意数值进行微调。
            </p>

            <div className="custom-input-grid">
              {sizeMeasurements.rows.map((row) => {
                const autoVal = result.customSizes[row.name]
                const manualVal = manualAdjust[row.name]
                const displayVal = manualVal !== undefined ? manualVal : autoVal
                const sVal = row.values[0]
                const changed = Math.abs(displayVal - sVal) > 0.1

                return (
                  <div key={row.name} className="custom-input-item">
                    <label className="custom-input-label">
                      {row.name}
                      <span className="custom-input-en">{row.nameEn}</span>
                    </label>
                    <div className="custom-input-wrapper">
                      <input
                        type="number"
                        step="0.5"
                        className={`custom-input ${changed ? 'adjusted' : ''}`}
                        value={displayVal}
                        onChange={(e) => handleManualChange(row.name, e.target.value)}
                      />
                      <span className="custom-input-unit">cm</span>
                    </div>
                    <div className="custom-input-hint">
                      S码: {sVal} → <strong style={{ color: changed ? 'var(--primary)' : 'var(--text-light)' }}>{displayVal}</strong>
                      {changed && (
                        <span style={{ marginLeft: 4, color: changed ? 'var(--primary)' : 'var(--text-light)' }}>
                          ({displayVal > sVal ? '+' : ''}{(displayVal - sVal).toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 导出 PDF */}
          <div className="card slide-up">
            <div className="card-title">
              <span className="card-title-icon">📄</span>
              导出定制纸样
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              将根据您调整后的尺寸生成专属纸样 PDF，包含：
            </p>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              <p>✅ 6 个裁片的纸样图纸（含尺寸标注）</p>
              <p>✅ 定制成衣尺寸表</p>
              <p>✅ 用料计算与辅料清单</p>
              <p>✅ 关键点位标注与布纹方向</p>
            </div>

            <div className="export-summary">
              <div className="export-summary-row">
                <span>基准码号</span>
                <strong>S 码（放码基准）</strong>
              </div>
              <div className="export-summary-row">
                <span>推荐码号</span>
                <strong>{result.bestSize}</strong>
              </div>
              <div className="export-summary-row">
                <span>定制状态</span>
                <strong style={{ color: 'var(--success)' }}>已调整</strong>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={handleExportPDF}
            >
              📄 生成定制纸样 PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}
