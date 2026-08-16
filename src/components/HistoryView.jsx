import { useState, useEffect, useCallback } from 'react'
import {
  getHistoryRecords,
  deleteHistoryRecord,
  clearHistory,
} from '../utils/storage.js'

// 格式化日期时间（双语）/ Format date & time (bilingual)
function formatDateTime(isoStr) {
  if (!isoStr) return { date: '', time: '' }
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return { date: isoStr, time: '' }
  const pad = (n) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return { date, time }
}

// 相对时间描述 / Relative time description
function relativeTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return ''
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚 / Just now'
  if (min < 60) return `${min} 分钟前 / ${min}m ago`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour} 小时前 / ${hour}h ago`
  const day = Math.floor(hour / 24)
  if (day < 30) return `${day} 天前 / ${day}d ago`
  return formatDateTime(isoStr).date
}

export default function HistoryView({ onBack, onRestore, userPurpose = 'commercial' }) {
  const isPersonal = userPurpose === 'personal'
  const [records, setRecords] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  // 格式化尺寸标签 — 私人定制模式下不显示基码
  const formatSizeLabel = (sizeLabel, customSizes) => {
    if (isPersonal) {
      if (customSizes && Object.keys(customSizes).length > 0) {
        return '自定义尺寸'
      }
      if (sizeLabel && sizeLabel.includes('base')) {
        return '自定义尺寸'
      }
      return sizeLabel || '自定义尺寸'
    }
    return sizeLabel || 'S (base)'
  }

  // 加载历史记录
  const loadRecords = useCallback(() => {
    setRecords(getHistoryRecords())
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleDelete = (id) => {
    const remaining = deleteHistoryRecord(id)
    setRecords(remaining)
    if (expandedId === id) setExpandedId(null)
  }

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearHistory()
    setRecords([])
    setExpandedId(null)
    setConfirmClear(false)
  }

  const handleRestore = (record) => {
    if (onRestore) {
      onRestore(record)
    }
  }

  return (
    <>
      {/* 顶部栏 */}
      <div className="top-bar">
        <div className="top-bar-back" onClick={onBack}>‹</div>
        <div className="top-bar-title">历史记录 History</div>
        {records.length > 0 ? (
          <div
            className="top-bar-action"
            style={{ color: 'var(--danger)' }}
            onClick={handleClearAll}
          >
            {confirmClear ? '确认清空' : '清空'}
          </div>
        ) : (
          <div style={{ width: 44 }} />
        )}
      </div>

      <div className="page-content fade-in">
        {/* 空状态 */}
        {records.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 56,
              marginBottom: 16,
              opacity: 0.5,
            }}>
              📭
            </div>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}>
              暂无历史记录
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--text-light)',
            }}>
              No history yet · 完成识别后将显示在此
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 24, width: 'auto', padding: '12px 28px' }}
              onClick={onBack}
            >
              去识别服装 / Start
            </button>
          </div>
        ) : (
          <>
            {/* 记录统计 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px 4px',
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                共 {records.length} 条记录 / {records.length} records
              </span>
              {confirmClear && (
                <span style={{ fontSize: 11, color: 'var(--danger)' }}>
                  再次点击「确认清空」
                </span>
              )}
            </div>

            {/* 历史记录列表 */}
            {records.map((record) => {
              const { date, time } = formatDateTime(record.timestamp)
              const expanded = expandedId === record.id
              const images = Array.isArray(record.images) ? record.images : []
              const thumb = record.thumbnail || images[0] || ''
              const versions = Array.isArray(record.versions) ? record.versions : []
              const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null
              const versionCount = versions.length || 1

              return (
                <div
                  key={record.id}
                  className="card"
                  style={{ margin: '8px 16px', padding: 0, overflow: 'hidden' }}
                >
                  {/* 记录头部（可点击展开） */}
                  <div
                    onClick={() => handleToggle(record.id)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      padding: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {/* 缩略图（点击恢复） */}
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 'var(--radius-sm)',
                        background: thumb
                          ? 'transparent'
                          : 'linear-gradient(135deg, #f0f0f5, #e8e8f0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestore(record)
                      }}
                    >
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={record.garmentName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        '👗'
                      )}
                      {/* 恢复提示 */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(108, 92, 231, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        borderRadius: 'var(--radius-sm)',
                      }}
                        className="restore-overlay">
                        <span style={{ fontSize: 20 }}>📐</span>
                      </div>
                      {images.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: 3,
                          right: 3,
                          fontSize: 9,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          fontWeight: 600,
                        }}>
                          {images.length}
                        </div>
                      )}
                    </div>

                    {/* 信息 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {record.garmentName}
                      </div>
                      {record.garmentNameEn && (
                        <div style={{
                          fontSize: 11,
                          color: 'var(--text-light)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 1,
                        }}>
                          {record.garmentNameEn}
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 6,
                        flexWrap: 'wrap',
                      }}>
                        {/* 版本徽章 */}
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: versionCount > 1
                            ? 'rgba(0, 184, 148, 0.1)'
                            : 'rgba(108, 92, 231, 0.1)',
                          color: versionCount > 1 ? 'var(--success)' : 'var(--primary)',
                          fontWeight: 700,
                        }}>
                          V{latestVersion?.version || 1}
                          {versionCount > 1 && ` (${versionCount}版本)`}
                        </span>
                        {formatSizeLabel(record.sizeLabel, record.customSizes) && (
                          <span style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: isPersonal
                              ? 'rgba(0, 184, 148, 0.08)'
                              : 'rgba(108, 92, 231, 0.08)',
                            color: isPersonal ? 'var(--success)' : 'var(--primary)',
                            fontWeight: 600,
                          }}>
                            {formatSizeLabel(record.sizeLabel, record.customSizes)}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--text-light)' }}>
                          {relativeTime(record.timestamp)}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>
                        {date}{time ? ` ${time}` : ''}
                      </div>
                    </div>

                    {/* 展开箭头 */}
                    <span style={{
                      fontSize: 14,
                      color: 'var(--text-light)',
                      transition: 'transform 0.2s',
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      flexShrink: 0,
                    }}>
                      ⌄
                    </span>
                  </div>

                  {/* 展开内容：更多图片 + 版本列表 + 操作 */}
                  {expanded && (
                    <div
                      className="fade-in"
                      style={{
                        padding: '0 12px 12px',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      {/* 版本历史 */}
                      {versions.length > 1 && (
                        <div style={{ marginTop: 12, marginBottom: 12 }}>
                          <div style={{
                            fontSize: 12, fontWeight: 600,
                            color: 'var(--text-secondary)', marginBottom: 8,
                          }}>
                            版本历史 / Version History
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {versions.map((v, i) => (
                              <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 11,
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: i === versions.length - 1
                                  ? 'rgba(0, 184, 148, 0.08)'
                                  : 'var(--bg)',
                              }}>
                                <span style={{
                                  fontWeight: 700,
                                  color: i === versions.length - 1 ? 'var(--success)' : 'var(--text-secondary)',
                                }}>
                                  {v.label}
                                </span>
                                <span style={{ color: 'var(--text-light)' }}>
                                  {formatSizeLabel(v.sizeLabel, v.customSizes)}
                                </span>
                                <span style={{ color: 'var(--text-light)', marginLeft: 'auto' }}>
                                  {formatDateTime(v.createdAt).date} {formatDateTime(v.createdAt).time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 图片网格 */}
                      {images.length > 0 ? (
                        <div
                          className="image-preview-grid"
                          style={{ marginTop: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}
                        >
                          {images.map((img, i) => (
                            <div
                              key={i}
                              className="image-preview-item"
                              onClick={() => setPreviewImage(img)}
                              style={{ cursor: 'pointer' }}
                            >
                              <img
                                src={img}
                                alt={`图片 ${i + 1}`}
                                className="image-preview-img"
                              />
                              <div className="image-preview-badge">
                                {i === 0 ? '正面' : i === 1 ? '背面' : `细节${i - 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: 12,
                          color: 'var(--text-light)',
                          textAlign: 'center',
                          padding: '16px 0',
                        }}>
                          该记录无图片 / No images
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: 'auto', flex: 1, fontSize: 13, padding: '10px 16px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRestore(record)
                          }}
                        >
                          📐 恢复纸样 / Restore Pattern
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ width: 'auto', fontSize: 13, padding: '10px 16px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(record.id)
                          }}
                        >
                          🗑 删除 / Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 底部留白 */}
            <div style={{ height: 24 }} />
          </>
        )}
      </div>

      {/* 图片预览弹层 / Image preview overlay */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <img
            src={previewImage}
            alt="预览"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'absolute',
              top: 'calc(var(--safe-top) + 16px)',
              right: 20,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ✕
          </div>
        </div>
      )}
    </>
  )
}
