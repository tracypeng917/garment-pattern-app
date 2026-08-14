import { useState, useEffect } from 'react'

const STEPS = [
  { label: '多图预处理与特征提取', labelEn: 'Multi-image preprocessing', duration: 500 },
  { label: '服装款式识别（多角度融合）', labelEn: 'Style recognition (multi-angle fusion)', duration: 700 },
  { label: '面料类型分析（针织/梭织）', labelEn: 'Fabric type analysis (knit/woven)', duration: 500 },
  { label: '结构分解与裁片提取', labelEn: 'Structure decomposition & piece extraction', duration: 600 },
  { label: '纸样图纸生成（中英双语）', labelEn: 'Pattern generation (bilingual)', duration: 500 },
  { label: '尺寸放码计算', labelEn: 'Size grading calculation', duration: 400 },
  { label: '新手教程生成', labelEn: 'Beginner tutorial generation', duration: 300 },
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

  return (
    <div className="page-content fade-in">
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
        </div>
        <div className="loading-text">AI 正在分析中...</div>
        <div className="loading-subtext">
          正在分析 {imageCount} 张图片，识别服装款式并生成纸样<br/>
          Analyzing {imageCount} images...
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
      </div>
    </div>
  )
}
