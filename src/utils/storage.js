// ==================== localStorage 存储工具 ====================
// 管理用户信息、身材尺寸数据、历史识别记录
// Storage utility for user data, body measurements and history records

// 存储键名 / Storage keys
const USER_KEY = 'patternai_user'
const MEASUREMENTS_KEY = 'patternai_measurements'
const HISTORY_KEY = 'patternai_history'
const AVATAR_KEY = 'patternai_avatar'

// 身材尺寸字段定义 / Body measurement field keys
export const BODY_MEASUREMENT_FIELDS = [
  '身高',
  '胸围',
  '腰围',
  '臀围',
  '肩宽',
  '袖长',
  '颈围',
]

// 私人定制（个人模式）必填身材尺寸字段 / Personal custom required body fields
// 个人模式不使用 S/M/L 放码，仅以用户净尺寸为准，身高/胸围/腰围/臀围为必填项。
export const PERSONAL_REQUIRED_FIELDS = [
  '身高',
  '胸围',
  '腰围',
  '臀围',
]

/**
 * 生成唯一 ID
 * Generate a unique ID (timestamp + random + counter)
 * @returns {string}
 */
let __idCounter = 0
export function generateId() {
  __idCounter = (__idCounter + 1) % 100000
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  const counter = __idCounter.toString(36).padStart(3, '0')
  return `${ts}-${rand}-${counter}`
}

// ==================== 内部工具 / Internal helpers ====================

function safeParse(raw, fallback) {
  if (raw == null) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed == null ? fallback : parsed
  } catch (e) {
    return fallback
  }
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    return false
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

// ==================== 用户信息 / User ====================
//
// 存储结构 / Stored structure:
// {
//   isLoggedIn: boolean,
//   user: {
//     account: string,        // 手机号或邮箱
//     age: string,            // 年龄
//     purpose: string,        // 'personal' | 'commercial'
//     purposeText: string,    // 使用原因详细说明
//     registeredAt: string,   // 注册时间 ISO 字符串
//   }
// }

/**
 * 获取已注册用户信息（不含登录状态）
 * Get the registered user details (without login state).
 * @returns {object|null} user object or null if never registered
 */
export function getUser() {
  const data = safeParse(safeGetItem(USER_KEY), null)
  if (!data) return null
  return data.user || null
}

/**
 * 保存用户信息并标记为已登录
 * Save user details and mark as logged in.
 * @param {object} user - { account, age, purpose, purposeText, registeredAt }
 */
export function setUser(user) {
  const payload = {
    isLoggedIn: true,
    user: {
      account: user?.account ?? '',
      age: user?.age ?? '',
      purpose: user?.purpose ?? 'personal',
      purposeText: user?.purposeText ?? '',
      registeredAt: user?.registeredAt ?? new Date().toISOString(),
    },
  }
  safeSetItem(USER_KEY, JSON.stringify(payload))
  return payload.user
}

/**
 * 判断当前是否已登录
 * Check whether the user is currently logged in.
 * @returns {boolean}
 */
export function isLoggedIn() {
  const data = safeParse(safeGetItem(USER_KEY), null)
  return !!(data && data.isLoggedIn === true && data.user)
}

/**
 * 退出登录（保留账号信息，便于下次快速登录）
 * Log out: keep the account record for quick re-login, only clear login state.
 */
export function logout() {
  const data = safeParse(safeGetItem(USER_KEY), null)
  if (!data) return
  safeSetItem(USER_KEY, JSON.stringify({ isLoggedIn: false, user: data.user }))
}

/**
 * Switch user purpose mode (personal ↔ commercial)
 */
export function switchUserMode(newPurpose) {
  try {
    const data = JSON.parse(localStorage.getItem('patternai_user') || '{}')
    if (!data || !data.user) return null
    data.user.purpose = newPurpose
    localStorage.setItem('patternai_user', JSON.stringify(data))
    return data.user
  } catch {
    return null
  }
}

// ==================== 用户头像 / User Avatar ====================
//
// 头像存储为 base64 字符串（dataURL）或 null（使用默认剪刀头像）
//

/**
 * 获取用户头像 dataURL
 * Get user avatar as dataURL. Returns null if not set (use default scissors).
 * @returns {string|null}
 */
export function getAvatar() {
  return safeGetItem(AVATAR_KEY) || null
}

/**
 * 保存用户头像
 * Save user avatar (base64 dataURL).
 * @param {string} dataUrl - base64 image data URL
 * @returns {boolean}
 */
export function setAvatar(dataUrl) {
  return safeSetItem(AVATAR_KEY, dataUrl)
}

/**
 * 删除用户头像（恢复默认）
 * Remove user avatar (revert to default scissors).
 */
export function removeAvatar() {
  return safeRemoveItem(AVATAR_KEY)
}

// ==================== 身材尺寸数据 / Body Measurements ====================
//
// 存储结构 / Stored structure:
// {
//   bodyMeasurements: { '身高': number, '胸围': number, ... },
//   savedAt: string,
// }

/**
 * 保存身材尺寸数据
 * Save body measurements (overwrites previous data).
 * @param {object} data - { 身高, 胸围, 腰围, 臀围, 肩宽, 袖长, 颈围 }
 * @returns {object} saved payload
 */
export function saveBodyMeasurements(data) {
  const bodyMeasurements = {}
  BODY_MEASUREMENT_FIELDS.forEach((field) => {
    const val = data?.[field]
    if (val !== '' && val != null && !isNaN(Number(val))) {
      bodyMeasurements[field] = Number(val)
    }
  })
  const payload = {
    bodyMeasurements,
    savedAt: new Date().toISOString(),
  }
  safeSetItem(MEASUREMENTS_KEY, JSON.stringify(payload))
  return payload
}

/**
 * 获取已保存的身材尺寸数据
 * Get saved body measurements.
 * @returns {object|null} { bodyMeasurements, savedAt } or null
 */
export function getBodyMeasurements() {
  return safeParse(safeGetItem(MEASUREMENTS_KEY), null)
}

// ==================== 历史记录 / History Records ====================
//
// 存储结构 / Stored structure (数组，新记录插入到头部):
// [{
//   id: string,
//   timestamp: string,
//   garmentName: string,
//   garmentNameEn: string,
//   thumbnail: string,   // base64 图片或空字符串
//   images: string[],    // base64 图片数组
//   sizeLabel: string,
// }]

/**
 * 获取全部历史记录（按时间倒序，新记录在前）
 * Get all history records (newest first).
 * @returns {Array} history records
 */
export function getHistoryRecords() {
  const list = safeParse(safeGetItem(HISTORY_KEY), [])
  return Array.isArray(list) ? list : []
}

/**
 * 新增一条历史记录（插入到头部），初始版本为 V1
 * Add a history record to the front of the list with initial version V1.
 * @param {object} record - { garmentName, garmentNameEn, thumbnail, images, sizeLabel, customSizes }
 * @returns {object} the saved record (with id & timestamp & versions)
 */
export function addHistoryRecord(record) {
  const list = getHistoryRecords()
  const now = new Date().toISOString()
  const newRecord = {
    id: generateId(),
    timestamp: now,
    garmentName: record?.garmentName ?? '未命名款式',
    garmentNameEn: record?.garmentNameEn ?? 'Untitled Garment',
    thumbnail: record?.thumbnail ?? '',
    images: Array.isArray(record?.images) ? record.images : [],
    sizeLabel: record?.sizeLabel ?? '',
    customSizes: record?.customSizes ?? null,
    versions: [{
      version: 1,
      label: 'V1',
      sizeLabel: record?.sizeLabel ?? '',
      customSizes: record?.customSizes ?? null,
      createdAt: now,
    }],
  }
  const next = [newRecord, ...list]
  safeSetItem(HISTORY_KEY, JSON.stringify(next))
  return newRecord
}

/**
 * 根据 ID 获取单条历史记录
 * Get a single history record by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getHistoryRecord(id) {
  const list = getHistoryRecords()
  return list.find((item) => item.id === id) || null
}

/**
 * 为指定历史记录新增一个版本（V2, V3, ...）
 * Add a new version to an existing history record.
 * @param {string} recordId
 * @param {object} versionData - { sizeLabel, customSizes }
 * @returns {object|null} updated record, or null if not found
 */
export function addVersionToRecord(recordId, versionData) {
  const list = getHistoryRecords()
  const idx = list.findIndex((item) => item.id === recordId)
  if (idx === -1) return null

  const record = list[idx]
  const versions = Array.isArray(record.versions) ? record.versions : []
  const nextVersionNum = versions.length + 1
  const newVersion = {
    version: nextVersionNum,
    label: `V${nextVersionNum}`,
    sizeLabel: versionData?.sizeLabel ?? '',
    customSizes: versionData?.customSizes ?? null,
    createdAt: new Date().toISOString(),
  }
  versions.push(newVersion)

  // 更新记录的最新状态
  record.versions = versions
  record.sizeLabel = newVersion.sizeLabel
  record.customSizes = newVersion.customSizes
  record.timestamp = newVersion.createdAt

  list[idx] = record
  safeSetItem(HISTORY_KEY, JSON.stringify(list))
  return record
}

/**
 * 更新历史记录的当前尺寸状态（不新增版本，仅更新当前版本数据）
 * Update the current size state of a history record (no new version).
 * @param {string} recordId
 * @param {object} data - { sizeLabel, customSizes }
 * @returns {object|null} updated record
 */
export function updateHistoryRecord(recordId, data) {
  const list = getHistoryRecords()
  const idx = list.findIndex((item) => item.id === recordId)
  if (idx === -1) return null

  if (data?.sizeLabel !== undefined) list[idx].sizeLabel = data.sizeLabel
  if (data?.customSizes !== undefined) list[idx].customSizes = data.customSizes

  safeSetItem(HISTORY_KEY, JSON.stringify(list))
  return list[idx]
}

/**
 * 删除指定 ID 的历史记录
 * Delete a history record by id.
 * @param {string} id
 * @returns {Array} remaining records
 */
export function deleteHistoryRecord(id) {
  const list = getHistoryRecords()
  const next = list.filter((item) => item.id !== id)
  safeSetItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

/**
 * 清空全部历史记录
 * Clear all history records.
 */
export function clearHistory() {
  safeRemoveItem(HISTORY_KEY)
}
