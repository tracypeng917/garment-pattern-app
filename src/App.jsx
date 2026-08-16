import { useState, useCallback, useRef } from 'react'
import { useLang } from './i18n/LanguageContext.jsx'
import { isLoggedIn, getUser, setUser, logout, addHistoryRecord, addVersionToRecord, getHistoryRecord, getAvatar, setAvatar, removeAvatar, switchUserMode } from './utils/storage.js'
import AuthScreen from './components/AuthScreen.jsx'
import UploadScreen from './components/UploadScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import PersonalCustom from './components/PersonalCustom.jsx'
import LearningManual from './components/LearningManual.jsx'
import HistoryView from './components/HistoryView.jsx'
import { garmentInfo, gradingRules } from './data/mockData.js'

function ScissorsAvatar({ size = 40, fontSize = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: fontSize, flexShrink: 0,
      boxShadow: '0 2px 8px rgba(108, 92, 231, 0.3)',
    }}>
      ✂️
    </div>
  )
}

export default function App() {
  const { t, lang, changeLang, languages } = useLang()
  const [authed, setAuthed] = useState(isLoggedIn())
  const [view, setView] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(true) // 默认展开
  const [screen, setScreen] = useState('upload')
  const [images, setImages] = useState([])
  const [avatarVersion, setAvatarVersion] = useState(0)
  const [currentRecordId, setCurrentRecordId] = useState(null)
  const [currentVersion, setCurrentVersion] = useState(1)
  const [currentCustomSizes, setCurrentCustomSizes] = useState(null)
  const [currentSizeLabel, setCurrentSizeLabel] = useState(`${gradingRules.baseSize} (base)`)
  const [uploadMetadata, setUploadMetadata] = useState(null)
  const [userPurpose, setUserPurpose] = useState(getUser()?.purpose || 'personal')

  const isPersonal = userPurpose === 'personal'

  const handleUpload = useCallback((imgs, metadata) => {
    setImages(imgs)
    setUploadMetadata(metadata)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    const record = addHistoryRecord({
      garmentName: garmentInfo.name,
      garmentNameEn: garmentInfo.nameEn,
      thumbnail: images && images.length > 0 ? images[0] : '',
      images: images || [],
      sizeLabel: `${gradingRules.baseSize} (base)`,
      customSizes: null,
      metadata: uploadMetadata,
    })
    setCurrentRecordId(record.id)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel(`${gradingRules.baseSize} (base)`)
    setScreen('result')
  }, [images, uploadMetadata])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
    setCurrentRecordId(null)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel(`${gradingRules.baseSize} (base)`)
    setUploadMetadata(null)
  }, [])

  const handleRestoreFromHistory = useCallback((record) => {
    setImages(record.images || [])
    setCurrentRecordId(record.id)
    const versions = Array.isArray(record.versions) ? record.versions : []
    const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null
    setCurrentVersion(latestVersion ? latestVersion.version : 1)
    setCurrentCustomSizes(record.customSizes || null)
    setCurrentSizeLabel(record.sizeLabel || `${gradingRules.baseSize} (base)`)
    setUploadMetadata(record.metadata || null)
    setView('home')
    setScreen('result')
  }, [])

  const handleRegenerate = useCallback((newCustomSizes, newSizeLabel) => {
    if (currentRecordId) {
      addVersionToRecord(currentRecordId, {
        sizeLabel: newSizeLabel || t('customSize'),
        customSizes: newCustomSizes,
      })
      setCurrentVersion(v => v + 1)
      setCurrentCustomSizes(newCustomSizes)
      setCurrentSizeLabel(newSizeLabel || t('customSize'))
    }
  }, [currentRecordId, t])

  // 切换用户模式（个人 ↔ 商业）
  const handleSwitchMode = (newPurpose) => {
    switchUserMode(newPurpose)
    setUserPurpose(newPurpose)
    setView('home')
    setScreen('upload')
    setImages([])
    setCurrentRecordId(null)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel(`${gradingRules.baseSize} (base)`)
  }

  const handleNavigate = (v) => {
    setView(v)
  }

  const handleAvatarUpdate = () => {
    setAvatarVersion(v => v + 1)
  }

  if (!authed) {
    return (
      <div className="app-shell">
        <div className="main-content">
          <div className="top-bar">
            <div style={{ width: 32 }} />
            <div className="top-bar-title">{t('appName')}</div>
            <div style={{ width: 32 }} />
          </div>
          <div className="page-content">
            <AuthScreen onRegister={() => {
              setAuthed(true)
              const u = getUser()
              setUser(u)
              setUserPurpose(u?.purpose || 'personal')
            }} />
          </div>
        </div>
      </div>
    )
  }

  const user = getUser()
  const currentAvatar = getAvatar()

  return (
    <div className="app-shell">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">P</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-title">{t('appName')}</div>
            <div className="sidebar-subtitle">{t('appSubtitle')}</div>
          </div>
          {/* 收起按钮 */}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarOpen(false)}
            title={t('collapseSidebar')}
          >
            ‹
          </button>
        </div>

        <div className="sidebar-user" onClick={() => handleNavigate('account')}>
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="avatar"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
              }}
            />
          ) : (
            <ScissorsAvatar size={40} fontSize={20} />
          )}
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.account || ''}</div>
            <div className="sidebar-user-purpose">
              {isPersonal ? t('personalModeText') : t('commercialModeText')}
            </div>
          </div>
        </div>

        {/* 语言切换器 */}
        <div className="sidebar-lang-section">
          <div className="sidebar-lang-label">{t('language')}</div>
          <div className="lang-switcher">
            {languages.map((l) => (
              <button
                key={l.code}
                className={`lang-switcher-item ${lang === l.code ? 'active' : ''}`}
                onClick={() => changeLang(l.code)}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-nav">
          <div
            className={`sidebar-nav-item ${view === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            <span className="sidebar-nav-icon">{isPersonal ? '🏠' : '🏭'}</span>
            <span className="sidebar-nav-label">{isPersonal ? t('personalCustom') : t('ecommerceGrading')}</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'manual' ? 'active' : ''}`}
            onClick={() => handleNavigate('manual')}
          >
            <span className="sidebar-nav-icon">📚</span>
            <span className="sidebar-nav-label">{t('learningManual')}</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigate('history')}
          >
            <span className="sidebar-nav-icon">🕐</span>
            <span className="sidebar-nav-label">{t('history')}</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'account' ? 'active' : ''}`}
            onClick={() => handleNavigate('account')}
          >
            <span className="sidebar-nav-icon">👤</span>
            <span className="sidebar-nav-label">{t('account')}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-version">{t('version')}</div>
          <div
            className="sidebar-logout"
            onClick={() => { logout(); setAuthed(false) }}
          >
            {t('logout')}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          {!sidebarOpen && (
            <div className="top-bar-menu" onClick={() => setSidebarOpen(true)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {sidebarOpen && <div style={{ width: 32 }} />}
          <div className="top-bar-title">
            {view === 'home' && (isPersonal ? t('personalCustom') : t('ecommerceGrading'))}
            {view === 'manual' && t('learningManual')}
            {view === 'history' && t('history')}
            {view === 'account' && t('account')}
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* View Content */}
        <div className="page-content">
          {view === 'home' && (
            isPersonal ? (
              <PersonalCustom key="personal" userPurpose="personal" />
            ) : (
              <>
                {screen === 'upload' && <UploadScreen onUpload={handleUpload} />}
                {screen === 'loading' && (
                  <LoadingScreen
                    imageCount={images.length}
                    onComplete={handleAnalysisComplete}
                  />
                )}
                {screen === 'result' && (
                  <ResultScreen
                    images={images}
                    onReset={handleReset}
                    userPurpose={userPurpose}
                    recordId={currentRecordId}
                    currentVersion={currentVersion}
                    customSizes={currentCustomSizes}
                    sizeLabel={currentSizeLabel}
                    onRegenerate={handleRegenerate}
                    uploadMetadata={uploadMetadata}
                  />
                )}
              </>
            )
          )}
          {view === 'manual' && <LearningManual />}
          {view === 'history' && (
            <HistoryView
              onBack={() => handleNavigate('home')}
              onRestore={handleRestoreFromHistory}
            />
          )}
          {view === 'account' && (
            <AccountView
              user={user}
              avatarVersion={avatarVersion}
              onAvatarChange={handleAvatarUpdate}
              onLogout={() => { logout(); setAuthed(false) }}
              onSwitchMode={handleSwitchMode}
              currentMode={userPurpose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function AccountView({ user, avatarVersion, onAvatarChange, onLogout, onSwitchMode, currentMode }) {
  const { t } = useLang()
  const fileInputRef = useRef(null)
  const currentAvatar = getAvatar()
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false)
  const [pendingMode, setPendingMode] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('图片不能超过 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, 128, 128)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setAvatar(dataUrl)
        onAvatarChange()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    removeAvatar()
    onAvatarChange()
  }

  const handleModeSwitch = (newMode) => {
    if (newMode === currentMode) return
    setPendingMode(newMode)
    setShowSwitchConfirm(true)
  }

  const confirmModeSwitch = () => {
    if (onSwitchMode && pendingMode) {
      onSwitchMode(pendingMode)
    }
    setShowSwitchConfirm(false)
    setPendingMode(null)
  }

  if (!user) return null

  return (
    <div className="fade-in" style={{ paddingBottom: 20 }}>
      {/* Avatar section */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 24 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="avatar"
              style={{
                width: 80, height: 80, borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            />
          ) : (
            <ScissorsAvatar size={80} fontSize={40} />
          )}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            📷
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{user.account}</div>
        <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
          {currentMode === 'personal' ? t('personalModeText') : t('commercialModeText')}
        </div>
        {currentAvatar && (
          <button
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '6px 14px', marginTop: 10 }}
            onClick={handleRemoveAvatar}
          >
            {t('resetBtn')}
          </button>
        )}
      </div>

      {/* 模式切换 */}
      <div className="card">
        <div className="card-title">
          <span className="card-title-icon">🔄</span>
          {t('switchMode')}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button
            className={`btn ${currentMode === 'personal' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => handleModeSwitch('personal')}
          >
            🏠 {t('switchToPersonal')}
          </button>
          <button
            className={`btn ${currentMode === 'commercial' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => handleModeSwitch('commercial')}
          >
            🏭 {t('switchToCommercial')}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card">
        <div className="card-title"><span className="card-title-icon">📋</span>{t('account')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('phoneOrEmail')}</span>
            <strong>{user.account}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('age')}</span>
            <strong>{user.age || '-'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('purpose')}</span>
            <strong>{user.purpose === 'personal' ? t('purposePersonal') : t('purposeCommercial')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('registeredAt')}</span>
            <strong>{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('zh-CN') : '-'}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <button className="btn btn-secondary" onClick={onLogout}>
          {t('logout')}
        </button>
      </div>

      {/* 模式切换确认弹窗 */}
      {showSwitchConfirm && (
        <div className="export-modal-overlay" onClick={() => setShowSwitchConfirm(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340 }}>
            <div className="export-modal-header">
              <div className="export-modal-title">🔄 {t('switchMode')}</div>
              <div className="export-modal-close" onClick={() => setShowSwitchConfirm(false)}>✕</div>
            </div>
            <div style={{ padding: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('switchModeConfirm')}
            </div>
            <div className="export-actions">
              <button className="btn btn-secondary" onClick={() => setShowSwitchConfirm(false)}>
                {t('cancel')}
              </button>
              <button className="btn btn-primary" onClick={confirmModeSwitch}>
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
