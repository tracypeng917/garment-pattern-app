import { useState, useEffect } from 'react'
import { gradingRules } from '../data/mockData.js'

const STEPS = [
  { label: '多图预处理与特征提取', labelEn: 'Multi-image preprocessing & feature extraction', duration: 500, brand: '通用' },
  { label: '服装品类分类（参考 H&M/Zara 体系）', labelEn: 'Category classification (H&M/Zara reference)', duration: 600, brand: '品牌' },
  { label: '款式细节识别（领型/袖型/版型）', labelEn: 'Style detail recognition (neckline/sleeve/fit)', duration: 700, brand: '通用' },
  { label: '面料类型分析（针织/梭织/混纺）', labelEn: 'Fabric type analysis (knit/woven/blended)', duration: 500, brand: '通用' },
  { label: '品牌数据库比对（H&M + Zara 10,000+ 款式）', labelEn: 'Brand database matching (H&M + Zara)', duration: 600, brand: '品牌' },
  { label: '版型判断与合身度分析', labelEn: 'Fit & ease analysis (Slim/Regular/Relaxed)', duration: 500, brand: '品牌' },
  { label: '结构分解与裁片提取', labelEn: 'Structure decomposition & piece extraction', duration: 500, brand: '通用' },
  { label: '纸样图纸生成（中英双语）', labelEn: 'Pattern generation (bilingual)', duration: 500, brand: '通用' },
  { label: `尺寸放码计算（${gradingRules.baseSize} 码基准）`, labelEn: `Size grading calculation (${gradingRules.baseSize} base)`, duration: 400, brand: '通用' },
  { label: '新手教程与用料计算', labelEn: 'Tutorial & material calculation', duration: 300, brand: '通用' },
]

export default function LoadingScreen({ imageCount, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let timer

    const runStep = () => {
      if (stepIndex >= STEPS.length) {
        setTimeout(onComplete, 300)
        return
      }
      setCurrentStep(stepIndex)
      timer = setTimeout(() => {
        stepIndex++
        setCurrentStep(stepIndex)
        timer = setTimeout(runStep, 100)
      }, STEPS[stepIndex].duration)
    }

    runStep()
    return () => clearTimeout(timer)
  }, [onComplete])

  const progress = Math.round((currentStep / STEPS.length) * 100)

  return (
    <div className="page-content fade-in">
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
        </div>
        <div className="loading-text">AI 识图分析中...</div>
        <div className="loading-subtext">
          正在分析 {imageCount} 张图片，结合 H&M 和 Zara 品牌数据识别款式<br/>
          Analyzing {imageCount} images with H&M & Zara brand reference
        </div>

        {/* Brand badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8, marginBottom: 4,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
            background: 'rgba(233, 69, 69, 0.1)', color: '#E94545',
          }}>
            H&M
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
            background: 'rgba(35, 35, 35, 0.08)', color: '#232323',
          }}>
            Zara
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
            background: 'rgba(108, 92, 231, 0.1)', color: 'var(--primary)',
          }}>
            10,000+ 款式
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: 280, marginTop: 16 }}>
          <div style={{
            height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
            {progress}% · {currentStep < STEPS.length ? STEPS[currentStep]?.labelEn : 'Complete'}
          </div>
        </div>

        <div className="loading-steps">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`loading-step ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}
            >
              <div className="loading-step-dot">
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span>{step.label}</span>
              {step.brand === '品牌' && i === currentStep && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, color: 'var(--accent)',
                  fontWeight: 600, flexShrink: 0,
                }}>
                  🏷️
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, fontSize: 10, color: 'var(--text-light)', textAlign: 'center',
          lineHeight: 1.5, padding: '0 20px',
        }}>
          💡 AI 已学习 H&M 和 Zara 全部模特图及尺寸表，能精准判断版型、款式和合身度<br/>
          AI trained on H&M & Zara model photos and size charts for accurate fit analysis
        </div>
      </div>
    </div>
  )
}
