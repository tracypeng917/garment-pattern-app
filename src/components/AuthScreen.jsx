import { useState, useEffect } from 'react'
import { getUser, setUser } from '../utils/storage.js'

// 使用原因选项 / Purpose options
const PURPOSE_OPTIONS = [
  {
    value: 'personal',
    label: '自己做衣服（个人使用）',
    labelEn: 'Make my own clothes (Personal use)',
    icon: '✂️',
  },
  {
    value: 'commercial',
    label: '服装制作/放码（商业用途）',
    labelEn: 'Garment production / Grading (Commercial)',
    icon: '🏭',
  },
]

export default function AuthScreen({ onRegister }) {
  const [existingUser, setExistingUser] = useState(null)
  const [account, setAccount] = useState('')
  const [age, setAge] = useState('')
  const [purpose, setPurpose] = useState('')
  const [purposeText, setPurposeText] = useState('')
  const [error, setError] = useState('')

  // 读取已注册用户，用于显示「直接登录」
  useEffect(() => {
    const user = getUser()
    if (user) setExistingUser(user)
  }, [])

  const validate = () => {
    if (!account.trim()) {
      setError('请输入手机号或邮箱 / Please enter phone or email')
      return false
    }
    // 简单校验：手机号（11位数字）或邮箱（含 @）
    const acc = account.trim()
    const isPhone = /^1\d{10}$/.test(acc)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acc)
    if (!isPhone && !isEmail) {
      setError('请输入有效的手机号或邮箱 / Invalid phone or email')
      return false
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError('请输入有效的年龄 / Please enter a valid age')
      return false
    }
    if (!purpose) {
      setError('请选择使用原因 / Please select a purpose')
      return false
    }
    setError('')
    return true
  }

  const handleRegister = () => {
    if (!validate()) return
    const userData = {
      account: account.trim(),
      age: age.trim(),
      purpose,
      purposeText: purposeText.trim(),
      registeredAt: new Date().toISOString(),
    }
    setUser(userData)
    if (onRegister) onRegister(userData)
  }

  const handleQuickLogin = () => {
    if (!existingUser) return
    // 复用已有账号信息，重新标记为已登录
    setUser(existingUser)
    if (onRegister) onRegister(existingUser)
  }

  return (
    <div className="fade-in">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 24px 16px',
      }}>
        {/* Hero 标题区 */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: 10,
          boxShadow: '0 6px 18px rgba(108, 92, 231, 0.35)',
        }}>
          ✂️
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 4,
        }}>
          智裁 PatternAI
        </h1>
        <p style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          AI 服装纸样生成工具
          <span style={{ fontSize: 11, color: 'var(--text-light)', marginLeft: 6 }}>
            AI Garment Pattern Generator
          </span>
        </p>
      </div>

      {/* 已有账号 · 直接登录 */}
      {existingUser && (
        <div className="card slide-up" style={{ borderColor: 'var(--primary)', borderWidth: 1.5 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(108, 92, 231, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              👋
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                欢迎回来
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {existingUser.account}
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleQuickLogin}>
            直接登录 / Quick Login
          </button>
        </div>
      )}

      {/* 注册表单 */}
      <div className="card fade-in">
        <div className="card-title">
          <span className="card-title-icon">📝</span>
          {existingUser ? '注册新账号' : '创建账号'}
          <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
            / Register
          </span>
        </div>

        {/* 手机号或邮箱 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 6,
          }}>
            手机号或邮箱 <span style={{ color: 'var(--danger)' }}>*</span>
            <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
              Phone or Email
            </span>
          </label>
          <input
            type="text"
            className="custom-input"
            style={{ paddingRight: 12 }}
            placeholder="请输入手机号或邮箱"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            autoComplete="username"
          />
        </div>

        {/* 年龄 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 6,
          }}>
            年龄 <span style={{ color: 'var(--danger)' }}>*</span>
            <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
              Age
            </span>
          </label>
          <div className="custom-input-wrapper">
            <input
              type="number"
              inputMode="numeric"
              className="custom-input"
              placeholder="请输入年龄"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="120"
            />
            <span className="custom-input-unit">岁</span>
          </div>
        </div>

        {/* 使用原因（单选） */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 8,
          }}>
            使用原因 <span style={{ color: 'var(--danger)' }}>*</span>
            <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
              Purpose
            </span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PURPOSE_OPTIONS.map((opt) => {
              const selected = purpose === opt.value
              return (
                <div
                  key={opt.value}
                  onClick={() => setPurpose(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    background: selected ? 'rgba(108, 92, 231, 0.05)' : 'var(--card-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{opt.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: selected ? 'var(--primary)' : 'var(--text)',
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>
                      {opt.labelEn}
                    </div>
                  </div>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}>
                    {selected && (
                      <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--primary)',
                      }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 使用原因详细说明（可选） */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 6,
          }}>
            使用原因详细说明
            <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
              Details (optional)
            </span>
          </label>
          <textarea
            className="custom-input"
            style={{
              width: '100%',
              minHeight: 72,
              padding: '10px 12px',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
            placeholder="可填写您具体的使用场景，例如：为家人做日常服装 / 电商批量放码等"
            value={purposeText}
            onChange={(e) => setPurposeText(e.target.value)}
            maxLength={200}
          />
          <div style={{
            fontSize: 10,
            color: 'var(--text-light)',
            textAlign: 'right',
            marginTop: 4,
          }}>
            {purposeText.length}/200
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            fontSize: 12,
            color: 'var(--danger)',
            background: 'rgba(255, 118, 117, 0.1)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 12,
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* 注册按钮 */}
        <button className="btn btn-primary" onClick={handleRegister} style={{ width: '100%', marginTop: 4 }}>
          {existingUser ? '注册并切换账号 / Switch Account' : '注册 / Register'}
        </button>
      </div>

      {/* 隐私提示 */}
      <div style={{
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text-light)',
        padding: '16px 24px 32px',
        lineHeight: 1.6,
      }}>
        注册即表示同意您的信息仅保存在本地设备<br/>
        Your data is stored locally on this device only.
      </div>
    </div>
  )
}
