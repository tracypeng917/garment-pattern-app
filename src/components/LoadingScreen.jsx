import { useState, useEffect } from 'react'

const STEPS = [
  { label: '多图预处理与特征提取', labelEn: 'Multi-image preprocessing & feature extraction', duration: 500 },
  { label: '服装类别分类（上装/下装/连衣裙）', labelEn: 'Garment category classification', duration: 600 },
  { label: '款式细节识别（领型/袖型/版型）', labelEn: 'Style detail recognition (neckline/sleeve/fit)', duration: 700 },
  { label: '面料类型分析（针织/梭织/混纺）', labelEn: 'Fabric type analysis (knit/woven/blended)', duration: 500 },
  { label: '服装数据库比对（10,000+ 款式）', labelEn: 'Database matching (10,000+ styles)', duration: 600 },
  { label: '结构分解与裁片提取', labelEn: 'Structure decomposition & piece extraction', duration: 500 },
  { label: '纸样图纸生成（中英双语）', labelEn: 'Pattern generation (bilingual)', duration: 500 },
  { label: '尺寸放码计算（S 码基准）', labelEn: 'Size grading calculation (S base)', duration: 400 },
  { label: '新手教程与用料计算', labelEn: 'Tutorial & material calculation', duration: 300 },
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
        <div className="loading-text">AI 正在分析中...</div>
        <div className="loading-subtext">
          正在分析 {imageCount} 张图片，识别服装款式并生成纸样<br/>
          Analyzing {imageCount} images, recognizing style & generating patterns
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
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, fontSize: 10, color: 'var(--text-light)', textAlign: 'center',
          lineHeight: 1.5, padding: '0 20px',
        }}>
          💡 AI 识别基于深度学习模型，支持上装、下装、连衣裙等类别<br/>
          AI recognition powered by deep learning, supports tops, bottoms, dresses
        </div>
      </div>
    </div>
  )
}
