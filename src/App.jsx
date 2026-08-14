import { useState, useCallback } from 'react'
import { isLoggedIn, getUser, logout, addHistoryRecord } from './utils/storage.js'
import AuthScreen from './components/AuthScreen.jsx'
import UploadScreen from './components/UploadScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import LearningManual from './components/LearningManual.jsx'
import HistoryView from './components/HistoryView.jsx'
import { garmentInfo } from './data/mockData.js'

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [view, setView] = useState('home') // home | manual | history | account
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [screen, setScreen] = useState('upload') // upload | loading | result
  const [images, setImages] = useState([])

  const handleUpload = useCallback((imgs) => {
    setImages(imgs)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    // 保存到历史记录
    addHistoryRecord({
      garmentName: garmentInfo.name,
      garmentNameEn: garmentInfo.nameEn,
      thumbnail: images && images.length > 0 ? images[0] : '',
      images: images || [],
      sizeLabel: 'S (base)',
    })
    setScreen('result')
  }, [images])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
  }, [])

  const handleNavigate = (v) => {
    setView(v)
    setSidebarOpen(false)
  }

  if (!authed) {
    return <AuthScreen onRegister={() => setAuthed(true)} />
  }

  const user = getUser()

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
          <div className="sidebar-user-avatar">
            {user?.account ? user.account[0].toUpperCase() : 'U'}
          </div>
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
                <ResultScreen images={images} onReset={handleReset} userPurpose={user?.purpose} />
              )}
            </>
          )}
          {view === 'manual' && <LearningManual />}
          {view === 'history' && <HistoryView onBack={() => handleNavigate('home')} />}
          {view === 'account' && <AccountView user={user} onLogout={() => { logout(); setAuthed(false) }} />}
        </div>
      </div>
    </div>
  )
}

function AccountView({ user, onLogout }) {
  if (!user) return null
  return (
    <div className="fade-in" style={{ paddingBottom: 20 }}>
      <div className="card" style={{ textAlign: 'center', paddingTop: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 800, margin: '0 auto 16px',
        }}>
          {user.account ? user.account[0].toUpperCase() : 'U'}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{user.account}</div>
        <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
          {user.purpose === 'personal' ? '个人使用 / Personal Use' : '商业用途 / Commercial Use'}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-title-icon">📋</span>账户信息</div>
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
            <strong>{user.registeredAt || '-'}</strong>
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
