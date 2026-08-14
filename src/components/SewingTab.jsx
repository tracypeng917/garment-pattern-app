import { sewingSteps } from '../data/mockData.js'

export default function SewingTab() {
  const totalTime = sewingSteps.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">✂️</span>
          缝制工序流程
        </div>
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 8,
        }}>
          <div style={{
            flex: 1,
            background: 'var(--bg)',
            borderRadius: 10,
            padding: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{sewingSteps.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>工序数</div>
          </div>
          <div style={{
            flex: 1,
            background: 'var(--bg)',
            borderRadius: 10,
            padding: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{totalTime}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>总工时(min)</div>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          {sewingSteps.map((step) => (
            <div key={step.step} className="sewing-step">
              <div className="sewing-step-num">{step.step}</div>
              <div className="sewing-step-content">
                <div className="sewing-step-name">{step.name} / {step.nameEn}</div>
                <div className="sewing-step-desc">{step.desc} / {step.descEn}</div>
                <span className="sewing-step-time">⏱ {step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">💡</span>
          工艺要点
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p><strong>1.</strong> 收省时注意省尖收自然，不留窝势</p>
          <p><strong>2.</strong> 上袖时对准袖山标记点，保证左右对称</p>
          <p><strong>3.</strong> 领面拔开处理，使领角自然服帖</p>
          <p><strong>4.</strong> 门筒压明线需等距整齐，宽窄一致</p>
          <p><strong>5.</strong> 锁眼位置间距均匀，钉扣牢固</p>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">📋</span>
          质检标准
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p>✅ 各部位尺寸偏差 ≤ ±0.5cm</p>
          <p>✅ 线迹整齐，无跳针断线</p>
          <p>✅ 省道平服，无起涟</p>
          <p>✅ 领型对称，领角圆顺</p>
          <p>✅ 纽位准确，扣眼干净</p>
          <p>✅ 整烫平整，无极光烫黄</p>
        </div>
      </div>
    </div>
  )
}
