import { useState, useCallback, useRef } from 'react'
import { isLoggedIn, getUser, logout, addHistoryRecord, addVersionToRecord, getHistoryRecord, getAvatar, setAvatar, removeAvatar } from './utils/storage.js'
import AuthScreen from './components/AuthScreen.jsx'
import UploadScreen from './components/UploadScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import LearningManual from './components/LearningManual.jsx'
import HistoryView from './components/HistoryView.jsx'
import { garmentInfo } from './data/mockData.js'

// 默认剪刀头像 SVG（智裁 logo 风格）
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

// 用户头像组件（支持自定义图片或默认剪刀）
function UserAvatar({ size = 40, fontSize = 22, onClick, style }) {
  const [avatar, setAvatarState] = useState(getAvatar())

  const handleAvatarChange = (newAvatar) => {
    setAvatarState(newAvatar)
  }

  // 暴露更新方法给父组件
  if (window.__updateUserAvatar) {
    window.__updateUserAvatar = handleAvatarChange
  }

  if (avatar) {
    return (
      <img
        src={avatar}
        alt="头像"
        onClick={onClick}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', cursor: onClick ? 'pointer' : 'default',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...style,
        }}
      />
    )
  }
  return <ScissorsAvatar size={size} fontSize={fontSize} />
}

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [view, setView] = useState('home') // home | manual | history | account
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [screen, setScreen] = useState('upload') // upload | loading | result
  const [images, setImages] = useState([])
  const [avatarVersion, setAvatarVersion] = useState(0) // 用于强制刷新头像
  const [currentRecordId, setCurrentRecordId] = useState(null) // 当前纸样对应的历史记录 ID
  const [currentVersion, setCurrentVersion] = useState(1) // 当前版本号
  const [currentCustomSizes, setCurrentCustomSizes] = useState(null) // 当前自定义尺寸
  const [currentSizeLabel, setCurrentSizeLabel] = useState('S (base)') // 当前尺寸标签

  const handleUpload = useCallback((imgs) => {
    setImages(imgs)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    const record = addHistoryRecord({
      garmentName: garmentInfo.name,
      garmentNameEn: garmentInfo.nameEn,
      thumbnail: images && images.length > 0 ? images[0] : '',
      images: images || [],
      sizeLabel: 'S (base)',
      customSizes: null,
    })
    setCurrentRecordId(record.id)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel('S (base)')
    setScreen('result')
  }, [images])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
    setCurrentRecordId(null)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel('S (base)')
  }, [])

  // 从历史记录恢复到纸样结果页
  const handleRestoreFromHistory = useCallback((record) => {
    setImages(record.images || [])
    setCurrentRecordId(record.id)
    const versions = Array.isArray(record.versions) ? record.versions : []
    const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null
    setCurrentVersion(latestVersion ? latestVersion.version : 1)
    setCurrentCustomSizes(record.customSizes || null)
    setCurrentSizeLabel(record.sizeLabel || 'S (base)')
    setView('home')
    setScreen('result')
  }, [])

  // 修改尺寸后重新生成纸样（版本递增）
  const handleRegenerate = useCallback((newCustomSizes, newSizeLabel) => {
    if (currentRecordId) {
      addVersionToRecord(currentRecordId, {
        sizeLabel: newSizeLabel || '自定义 / Custom',
        customSizes: newCustomSizes,
      })
      setCurrentVersion(v => v + 1)
      setCurrentCustomSizes(newCustomSizes)
      setCurrentSizeLabel(newSizeLabel || '自定义 / Custom')
    }
  }, [currentRecordId])

  const handleNavigate = (v) => {
    setView(v)
    setSidebarOpen(false)
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
            <div className="top-bar-title">智裁 PatternAI</div>
            <div style={{ width: 32 }} />
          </div>
          <div className="page-content">
            <AuthScreen onRegister={() => setAuthed(true)} />
          </div>
        </div>
      </div>
    )
  }

  const user = getUser()
  const currentAvatar = getAvatar()

  return (
    <div className="app-shell">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">P</div>
          <div>
            <div className="sidebar-title">智裁 PatternAI</div>
            <div className="sidebar-subtitle">AI 服装纸样生成工具</div>
          </div>
        </div>

        <div className="sidebar-user" onClick={() => handleNavigate('account')}>
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="头像"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
              }}
            />
          ) : (
            <ScissorsAvatar size={40} fontSize={20} />
          )}
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.account || '未登录'}</div>
            <div className="sidebar-user-purpose">
              {user?.purpose === 'personal' ? '个人使用' : user?.purpose === 'commercial' ? '商业用途' : ''}
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div
            className={`sidebar-nav-item ${view === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            <span className="sidebar-nav-icon">🏠</span>
            <span className="sidebar-nav-label">主页</span>
            <span className="sidebar-nav-en">Home</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'manual' ? 'active' : ''}`}
            onClick={() => handleNavigate('manual')}
          >
            <span className="sidebar-nav-icon">📚</span>
            <span className="sidebar-nav-label">学习手册</span>
            <span className="sidebar-nav-en">Learning</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigate('history')}
          >
            <span className="sidebar-nav-icon">🕐</span>
            <span className="sidebar-nav-label">历史记录</span>
            <span className="sidebar-nav-en">History</span>
          </div>
          <div
            className={`sidebar-nav-item ${view === 'account' ? 'active' : ''}`}
            onClick={() => handleNavigate('account')}
          >
            <span className="sidebar-nav-icon">👤</span>
            <span className="sidebar-nav-label">个人账户</span>
            <span className="sidebar-nav-en">Account</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-version">PatternAI v2.0</div>
          <div
            className="sidebar-logout"
            onClick={() => {
              logout()
              setAuthed(false)
            }}
          >
            退出登录 / Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar with Menu Button */}
        <div className="top-bar">
          <div className="top-bar-menu" onClick={() => setSidebarOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="top-bar-title">
            {view === 'home' && '智裁 PatternAI'}
            {view === 'manual' && '学习手册'}
            {view === 'history' && '历史记录'}
            {view === 'account' && '个人账户'}
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* View Content */}
        <div className="page-content">
          {view === 'home' && (
            <>
              {screen === 'upload' && <UploadScreen onUpload={handleUpload} />}
              {screen === 'loading' && (
                <LoadingScreen imageCount={images.length} onComplete={handleAnalysisComplete} />
              )}
              {screen === 'result' && (
                <ResultScreen
                  images={images}
                  onReset={handleReset}
                  userPurpose={user?.purpose}
                  recordId={currentRecordId}
                  currentVersion={currentVersion}
                  customSizes={currentCustomSizes}
                  sizeLabel={currentSizeLabel}
                  onRegenerate={handleRegenerate}
                />
              )}
            </>
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
            />
          )}
        </div>
      </div>
    </div>
  )
}

function AccountView({ user, avatarVersion, onAvatarChange, onLogout }) {
  const fileInputRef = useRef(null)
  const currentAvatar = getAvatar()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 限制文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片不能超过 2MB / Image must be under 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      // 压缩图片到 128x128
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

  if (!user) return null

  return (
    <div className="fade-in" style={{ paddingBottom: 20 }}>
      {/* Avatar section */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 24 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="头像"
              style={{
                width: 80, height: 80, borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            />
          ) : (
            <ScissorsAvatar size={80} fontSize={40} />
          )}
          {/* Camera button overlay */}
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
          {user.purpose === 'personal' ? '个人使用 / Personal Use' : '商业用途 / Commercial Use'}
        </div>
        {currentAvatar && (
          <button
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '6px 14px', marginTop: 10 }}
            onClick={handleRemoveAvatar}
          >
            恢复默认头像 / Reset Avatar
          </button>
        )}
      </div>

      {/* Account info */}
      <div className="card">
        <div className="card-title"><span className="card-title-icon">📋</span>账户信息 / Account Info</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>账号 / Account</span>
            <strong>{user.account}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>年龄 / Age</span>
            <strong>{user.age || '-'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>用途 / Purpose</span>
            <strong>{user.purpose === 'personal' ? '自己做衣服' : '服装制作/放码'}</strong>
          </div>
          {user.purposeText && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ marginBottom: 4 }}>说明 / Notes:</div>
              <div>{user.purposeText}</div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>注册时间 / Registered</span>
            <strong>{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('zh-CN') : '-'}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <button className="btn btn-secondary" onClick={onLogout}>
          退出登录 / Logout
        </button>
      </div>
    </div>
  )
}
