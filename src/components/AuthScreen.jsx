import { useState, useEffect } from 'react'
import { getUser, setUser } from '../utils/storage.js'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function AuthScreen({ onRegister }) {
  const { t } = useLang()
  const [existingUser, setExistingUser] = useState(null)
  const [account, setAccount] = useState('')
  const [age, setAge] = useState('')
  const [purpose, setPurpose] = useState('')
  const [purposeText, setPurposeText] = useState('')
  const [error, setError] = useState('')

  // 使用原因选项 / Purpose options
  const PURPOSE_OPTIONS = [
    {
      value: 'personal',
      label: t('purposePersonal'),
      icon: '✂️',
    },
    {
      value: 'commercial',
      label: t('purposeCommercial'),
      icon: '🏭',
    },
  ]

  // 读取已注册用户，用于显示「直接登录」
  useEffect(() => {
    const user = getUser()
    if (user) setExistingUser(user)
  }, [])

  const validate = () => {
    if (!account.trim()) {
      setError(t('enterPhone'))
      return false
    }
    // 简单校验：手机号（11位数字）或邮箱（含 @）
    const acc = account.trim()
    const isPhone = /^1\d{10}$/.test(acc)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acc)
    if (!isPhone && !isEmail) {
      setError(t('invalidPhone'))
      return false
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError(t('enterAge'))
      return false
    }
    if (!purpose) {
      setError(t('selectPurpose'))
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
          {t('appName')}
        </h1>
        <p style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          {t('appSubtitle')}
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
                {t('welcomeBack')}
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
            {t('quickLogin')}
          </button>
        </div>
      )}

      {/* 注册表单 */}
      <div className="card fade-in">
        <div className="card-title">
          <span className="card-title-icon">📝</span>
          {existingUser ? t('registerNew') : t('createAccount')}
          <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
            / {t('register')}
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
            {t('phoneOrEmail')} <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            type="text"
            className="custom-input"
            style={{ paddingRight: 12 }}
            placeholder={t('phoneOrEmailPlaceholder')}
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
            {t('age')} <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <div className="custom-input-wrapper">
            <input
              type="number"
              inputMode="numeric"
              className="custom-input"
              placeholder={t('agePlaceholder')}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="120"
            />
            <span className="custom-input-unit">{t('ageUnit')}</span>
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
            {t('purpose')} <span style={{ color: 'var(--danger)' }}>*</span>
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
            {t('purposeDetails')}
            <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>
              {t('detailsOptional')}
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
            placeholder={t('purposeDetailsPlaceholder')}
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
          {existingUser ? t('switchAccount') : t('register')}
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
        {t('privacyNotice')}
      </div>
    </div>
  )
}
