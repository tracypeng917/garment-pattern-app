import { jsPDF } from 'jspdf'
import {
  garmentInfo,
  patternPieces,
  sizeMeasurements,
  gradingRules,
  materialUsage,
  sewingSteps,
} from '../data/mockData.js'

// ============================================================================
// 常量与基础工具
// ============================================================================

// Canvas 渲染中文字符所用的字体栈（浏览器原生支持中文渲染）
const CANVAS_FONT_STACK =
  '"Microsoft YaHei","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","WenQuanYi Micro Hei","SimHei",sans-serif'

// 1pt = 0.352777mm（用于 PDF 字号与 mm 的换算）
const MM_PER_PT = 0.352777

/**
 * 判断文本是否包含中文（CJK 表意文字、中文标点、全角字符等）
 * @param {*} text
 * @returns {boolean}
 */
function containsChinese(text) {
  return /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef\u2000-\u206f]/.test(String(text))
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 108, g: 92, b: 231 }
}

function rgbToCss(color) {
  const c = color && color.length >= 3 ? color : [0, 0, 0]
  return `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`
}

/**
 * 将 jsPDF getTextColor() 返回的 "#rrggbb" 解析为 [r,g,b]
 * @param {string} hex
 * @returns {number[]}
 */
function parseTextColorHex(hex) {
  if (!hex || typeof hex !== 'string') return [0, 0, 0]
  const h = hex.replace('#', '')
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ]
  }
  return [0, 0, 0]
}

// ============================================================================
// drawBilingualText —— 双语文本渲染
//   · 纯英文/数字  -> 使用 doc.text()，保持矢量清晰度与可选择性
//   · 含中文       -> 通过 Canvas 渲染为图片后 doc.addImage() 嵌入
// 函数会读取当前 doc 的字号/字色/字型（除非 options 显式覆盖），
// 因此调用前用 doc.setFontSize / setTextColor / setFont 设置样式即可，
// 与原 doc.text 用法保持一致，便于直接替换。
// ============================================================================

/**
 * 在 PDF 上绘制文本，自动识别中文并选择渲染方式。
 * @param {jsPDF} doc
 * @param {string|string[]} text 文本（可为多行数组）
 * @param {number} x 左上角 x（mm），与 align 配合决定锚点
 * @param {number} y 基线 y（mm），与 doc.text 默认 alphabetic 基线一致
 * @param {Object} [options]
 * @param {number} [options.maxWidth] 最大宽度(mm)，超出自动换行
 * @param {'left'|'center'|'right'} [options.align='left']
 * @param {number} [options.fontSize] 覆盖字号(pt)
 * @param {string} [options.fontStyle] 覆盖字型 normal|bold|italic|bolditalic
 * @param {number[]} [options.color] 覆盖颜色 [r,g,b]
 * @returns {number} 实际渲染的行数（便于调用方推进 y 坐标）
 */
export function drawBilingualText(doc, text, x, y, options = {}) {
  const {
    maxWidth = null,
    align = 'left',
    fontSize: sizeOverride,
    fontStyle: styleOverride,
    color: colorOverride,
  } = options

  const fontSize = sizeOverride != null ? sizeOverride : doc.getFontSize()
  let fontStyle = styleOverride
  if (!fontStyle) {
    const fontInfo = typeof doc.getFont === 'function' ? doc.getFont() : null
    fontStyle = fontInfo && fontInfo.fontStyle ? fontInfo.fontStyle : 'normal'
  }
  const color = colorOverride || parseTextColorHex(typeof doc.getTextColor === 'function' ? doc.getTextColor() : '#000000')

  const textStr = Array.isArray(text) ? text.join('\n') : String(text)

  // 纯英文/数字：使用原生 doc.text
  if (!containsChinese(textStr)) {
    if (sizeOverride != null) doc.setFontSize(fontSize)
    if (styleOverride) doc.setFont('helvetica', fontStyle)
    if (colorOverride) doc.setTextColor(color[0], color[1], color[2])
    if (maxWidth != null) {
      const lines = doc.splitTextToSize(textStr, maxWidth)
      doc.text(lines, x, y, { align })
      return Array.isArray(lines) ? lines.length : 1
    }
    doc.text(textStr, x, y, { align })
    return textStr.split('\n').length
  }

  // 含中文：Canvas 渲染为图片后嵌入
  return renderCanvasTextToPdf(doc, textStr, x, y, { fontSize, fontStyle, color, maxWidth, align })
}

/**
 * 将含中文的文本通过 Canvas 绘制为透明背景 PNG 并嵌入 PDF。
 * 坐标换算保证字体在 PDF 中的物理高度正好等于 fontSize pt。
 */
function renderCanvasTextToPdf(doc, text, x, y, opts) {
  const { fontSize, fontStyle, color, maxWidth, align } = opts

  // 渲染倍率：保证小字号也有足够分辨率（仅影响分辨率，不影响最终尺寸）
  const SCALE = 6
  const fontPx = Math.max(fontSize * SCALE, 12)
  const pxToMm = (MM_PER_PT * fontSize) / fontPx

  const weight = fontStyle === 'bold' || fontStyle === 'bolditalic' ? 'bold' : 'normal'
  const italic = fontStyle === 'italic' || fontStyle === 'bolditalic' ? 'italic' : 'normal'
  const fontCss = `${italic} ${weight} ${fontPx}px ${CANVAS_FONT_STACK}`

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = fontCss
  ctx.textBaseline = 'alphabetic'

  // 换行处理
  let lines
  if (maxWidth != null) {
    const maxWidthPx = maxWidth / pxToMm
    lines = wrapTextCanvas(ctx, text, maxWidthPx)
  } else {
    lines = text.split('\n')
  }

  const lineHeightPx = fontPx * 1.15
  const padX = fontPx * 0.2
  const padTop = fontPx * 0.2
  const ascentPx = fontPx * 0.8
  const descentPx = fontPx * 0.25
  const padBottom = fontPx * 0.15

  let maxLineWidthPx = 0
  for (const line of lines) {
    const w = ctx.measureText(line).width
    if (w > maxLineWidthPx) maxLineWidthPx = w
  }
  if (maxLineWidthPx < 1) maxLineWidthPx = 1

  const canvasW = Math.ceil(maxLineWidthPx + padX * 2 + 1)
  const canvasH = Math.ceil(padTop + ascentPx + (lines.length - 1) * lineHeightPx + descentPx + padBottom + 1)

  canvas.width = canvasW
  canvas.height = canvasH
  // 修改 canvas 尺寸会重置上下文状态，需重新设置
  ctx.font = fontCss
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = rgbToCss(color)

  for (let i = 0; i < lines.length; i++) {
    const baselineY = padTop + ascentPx + i * lineHeightPx
    const lineW = ctx.measureText(lines[i]).width
    let drawX = padX
    if (align === 'center') drawX = padX + (maxLineWidthPx - lineW) / 2
    else if (align === 'right') drawX = padX + (maxLineWidthPx - lineW)
    ctx.fillText(lines[i], drawX, baselineY)
  }

  const dataURL = canvas.toDataURL('image/png')
  const imgWMm = canvasW * pxToMm
  const imgHMm = canvasH * pxToMm
  const baselineMm = (padTop + ascentPx) * pxToMm

  // 让图片内首行基线对齐到 PDF 的 y
  let imgX = x
  if (align === 'center') imgX = x - imgWMm / 2
  else if (align === 'right') imgX = x - imgWMm
  const imgY = y - baselineMm

  doc.addImage(dataURL, 'PNG', imgX, imgY, imgWMm, imgHMm)
  return lines.length
}

/**
 * 基于 canvas 度量的文本换行：兼容 CJK 按字断行与拉丁文按词断行。
 */
function wrapTextCanvas(ctx, text, maxWidthPx) {
  const paragraphs = String(text).split('\n')
  const result = []
  paragraphs.forEach(para => {
    if (para === '') {
      result.push('')
      return
    }
    let current = ''
    for (const ch of para) {
      const test = current + ch
      if (current !== '' && ctx.measureText(test).width > maxWidthPx) {
        const lastSpace = current.lastIndexOf(' ')
        if (lastSpace > 0) {
          result.push(current.slice(0, lastSpace))
          current = current.slice(lastSpace + 1) + ch
        } else {
          result.push(current)
          current = ch
        }
      } else {
        current = test
      }
    }
    if (current !== '') result.push(current)
  })
  return result
}

// ============================================================================
// PDF 导出
// ============================================================================

/**
 * 生成纸样 PDF 文档（中英双语）
 * @param {Object} options - 导出选项
 * @param {string} [options.sizeLabel='S'] - 码号标签
 * @param {Object} [options.customSizes] - 自定义尺寸
 * @param {string} [options.fileName] - 自定义文件名
 * @returns {string} 实际保存的文件名
 */
export function generatePatternPDF(options = {}) {
  const { sizeLabel = 'S', customSizes = null, fileName } = options

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const pageHeight = 297
  const margin = 15
  let y = margin

  // ========== 封面/标题页 ==========
  doc.setFillColor(108, 92, 231)
  doc.rect(0, 0, pageWidth, 44, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'PatternAI | 智裁 - 纸样报告', margin, 18)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'normal')
  drawBilingualText(doc, `${garmentInfo.name}  /  ${garmentInfo.nameEn}`, margin, 28)

  doc.setFontSize(11)
  drawBilingualText(doc, `Size / 码号: ${sizeLabel}  |  Generated / 生成日期: ${new Date().toLocaleDateString('en-US')}`, margin, 36)
  drawBilingualText(doc, `Base Size / 放码基准: S  |  Confidence / 识别置信度: ${garmentInfo.confidence}%`, margin, 42)

  y = 54
  doc.setTextColor(45, 52, 54)

  // Garment info - bilingual
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'Garment Information / 款式信息', margin, y)
  y += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const totalCount = patternPieces.reduce((s, p) => s + p.count, 0)
  const infoLines = [
    `Category / 类别: ${garmentInfo.category} / ${garmentInfo.categoryEn}`,
    `Style / 版型: ${garmentInfo.style} / ${garmentInfo.styleEn}`,
    `Season / 季节: ${garmentInfo.season} / ${garmentInfo.seasonEn}`,
    `Fabric / 面料: ${garmentInfo.fabric} / ${garmentInfo.fabricEn}`,
    `Difficulty / 难度: ${garmentInfo.difficulty} / ${garmentInfo.difficultyEn}`,
    `Pattern Pieces / 裁片: ${patternPieces.length} types / ${patternPieces.length} 类, ${totalCount} total / 共 ${totalCount} 片`,
    `Base Size / 放码基准: S`,
  ]
  infoLines.forEach(line => {
    drawBilingualText(doc, line, margin, y)
    y += 5.5
  })

  y += 3
  doc.setFontSize(9)
  doc.setTextColor(99, 110, 114)
  const descLineCount = drawBilingualText(doc, garmentInfo.description, margin, y, { maxWidth: pageWidth - margin * 2 })
  y += descLineCount * 4.5

  y += 4
  doc.setDrawColor(200, 200, 210)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // ========== 尺寸表 ==========
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(45, 52, 54)
  const sizeTableTitle = customSizes
    ? `Custom Size Measurements (cm) / 自定义成衣尺寸 (cm)`
    : `Size Measurements (cm) / 成品尺寸表 (cm)`
  drawBilingualText(doc, sizeTableTitle, margin, y)
  y += 7

  // 自定义导出时列头也使用中英双语，避免只有英文
  const sizes = customSizes ? ['Custom / 自定义'] : sizeMeasurements.sizes
  const colWidth = customSizes ? 48 : 22
  const nameColWidth = 42

  doc.setFillColor(240, 240, 250)
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F')
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'Part / 部位', margin + 2, y)
  sizes.forEach((s, i) => {
    const x = margin + nameColWidth + i * colWidth
    drawBilingualText(doc, s, x, y)
  })
  y += 8

  doc.setFont('helvetica', 'normal')
  sizeMeasurements.rows.forEach((row, ri) => {
    if (ri % 2 === 0) {
      doc.setFillColor(248, 248, 252)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 6.5, 'F')
    }
    drawBilingualText(doc, `${row.name} / ${row.nameEn}`, margin + 2, y)
    if (customSizes) {
      const val = customSizes[row.name]
      drawBilingualText(doc, val != null ? String(val) : '-', margin + nameColWidth, y)
    } else {
      row.values.forEach((val, i) => {
        const x = margin + nameColWidth + i * colWidth
        if (i === 0) {
          doc.setTextColor(108, 92, 231)
          doc.setFont('helvetica', 'bold')
        } else {
          doc.setTextColor(45, 52, 54)
          doc.setFont('helvetica', 'normal')
        }
        drawBilingualText(doc, String(val), x, y)
      })
    }
    doc.setTextColor(45, 52, 54)
    doc.setFont('helvetica', 'normal')
    y += 6.5
  })

  y += 8

  // ========== 裁片图纸 ==========
  patternPieces.forEach((piece, idx) => {
    doc.addPage()

    const rgb = hexToRgb(piece.color)
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(0, 0, pageWidth, 14, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, `Piece ${idx + 1}: ${piece.name} / ${piece.nameEn}  x${piece.count}`, margin, 9)

    y = 22
    doc.setTextColor(45, 52, 54)

    // Draw pattern piece
    drawPatternPieceInPDF(doc, piece, margin, y, pageWidth - margin * 2, 125)

    y += 135

    // Measurements - bilingual
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, `Measurements / 尺寸标注 (${sizeLabel} - cm)`, margin, y)
    y += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const measurements = Object.entries(piece.measurements)
    const half = Math.ceil(measurements.length / 2)

    measurements.forEach(([key, val], i) => {
      const col = i < half ? 0 : 1
      const row = i % half
      const x = margin + col * 85
      const yPos = y + row * 6

      let displayVal = val
      if (customSizes) {
        displayVal = adjustPieceMeasurement(key, val, customSizes)
      }

      drawBilingualText(doc, `${key}:`, x, yPos)
      doc.setFont('helvetica', 'bold')
      drawBilingualText(doc, `${displayVal} cm`, x + 50, yPos)
      doc.setFont('helvetica', 'normal')
    })

    y += half * 6 + 8

    // Points - bilingual
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, 'Key Points / 关键点位:', margin, y)
    y += 5

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    piece.points.forEach((pt, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const label = `${pt.label} / ${pt.labelEn}`
      drawBilingualText(doc, label, margin + col * 60, y + row * 5)
    })
  })

  // ========== 用料页 ==========
  doc.addPage()
  const fabricRgb = hexToRgb('#6C5CE7')
  doc.setFillColor(fabricRgb.r, fabricRgb.g, fabricRgb.b)
  doc.rect(0, 0, pageWidth, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'Material Usage & Accessories / 用料与辅料', margin, 9)

  y = 24
  doc.setTextColor(45, 52, 54)

  // Fabric - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, `${materialUsage.fabric.name} / ${materialUsage.fabric.nameEn}`, margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const fabricLines = [
    `Type / 类型: ${materialUsage.fabric.type} / ${materialUsage.fabric.typeEn}`,
    `Width / 门幅: ${materialUsage.fabric.width}`,
    `Unit Length / 单件用量 (${sizeLabel}): ${customSizes ? '~0.85' : materialUsage.fabric.unitLength}m`,
    `Shrinkage / 缩水率: ${materialUsage.fabric.shrinkage}`,
    `Waste Rate / 损耗率: ${materialUsage.fabric.wasteRate}`,
  ]
  fabricLines.forEach(line => { drawBilingualText(doc, line, margin, y); y += 5 })

  y += 4

  // Binding - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, `${materialUsage.lining.name} / ${materialUsage.lining.nameEn}`, margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  drawBilingualText(doc, `Type / 类型: ${materialUsage.lining.type} / ${materialUsage.lining.typeEn}`, margin, y); y += 5
  drawBilingualText(doc, `Width / 门幅: ${materialUsage.lining.width}`, margin, y); y += 5
  drawBilingualText(doc, `Unit Length / 单件用量: ${materialUsage.lining.unitLength}m`, margin, y); y += 8

  // Accessories - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, `Accessories / 辅料清单`, margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  doc.setFillColor(240, 240, 250)
  doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F')
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'Name / 名称', margin + 2, y)
  drawBilingualText(doc, 'Spec / 规格', margin + 65, y)
  drawBilingualText(doc, 'Qty / 数量', margin + 140, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  materialUsage.accessories.forEach((acc, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 252)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 6, 'F')
    }
    drawBilingualText(doc, `${acc.name} / ${acc.nameEn}`, margin + 2, y)
    drawBilingualText(doc, `${acc.spec} / ${acc.specEn}`, margin + 65, y)
    drawBilingualText(doc, `${acc.quantity} ${acc.unit}`, margin + 140, y)
    y += 6
  })

  y += 8

  // Sewing steps - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, `Sewing Steps / 缝制工序`, margin, y)
  y += 6
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  sewingSteps.forEach(step => {
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, `${step.step}.`, margin, y)
    doc.setFont('helvetica', 'normal')
    drawBilingualText(doc, `${step.name} / ${step.nameEn}`, margin + 8, y)
    doc.setTextColor(0, 206, 201)
    drawBilingualText(doc, `(${step.time})`, margin + 80, y)
    doc.setTextColor(45, 52, 54)
    y += 4.5
    doc.setTextColor(99, 110, 114)
    const descLineCount = drawBilingualText(doc, `${step.desc} / ${step.descEn}`, margin + 8, y, { maxWidth: pageWidth - margin * 2 - 8 })
    doc.setTextColor(45, 52, 54)
    y += descLineCount * 4 + 3
  })

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    drawBilingualText(
      doc,
      `PatternAI | ${garmentInfo.name} / ${garmentInfo.nameEn} | Size: ${sizeLabel} | Page ${i}/${pageCount}`,
      margin,
      pageHeight - 5
    )
  }

  const defaultName = `PatternAI_${garmentInfo.nameEn.replace(/\s+/g, '_')}_${sizeLabel}_${Date.now()}.pdf`
  const saveName = fileName
    ? (fileName.toLowerCase().endsWith('.pdf') ? fileName : fileName + '.pdf')
    : defaultName
  doc.save(saveName)
  return saveName
}

/**
 * 生成 PDF 文档对象（不保存），用于预览
 * Generate a jsPDF document object without saving, for preview purposes.
 * @param {Object} options - same as generatePatternPDF
 * @returns {jsPDF} doc object
 */
export function generatePatternPDFDoc(options = {}) {
  const { sizeLabel = 'S', customSizes = null } = options

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const margin = 15
  let y = margin

  // ========== 封面/标题页 ==========
  doc.setFillColor(108, 92, 231)
  doc.rect(0, 0, pageWidth, 44, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, 'PatternAI | 智裁 - 纸样报告', margin, 18)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'normal')
  drawBilingualText(doc, `${garmentInfo.name}  /  ${garmentInfo.nameEn}`, margin, 28)

  doc.setFontSize(11)
  drawBilingualText(doc, `Size / 码号: ${sizeLabel}  |  Generated / 生成日期: ${new Date().toLocaleDateString('en-US')}`, margin, 36)
  drawBilingualText(doc, `Base Size / 放码基准: S  |  Confidence / 识别置信度: ${garmentInfo.confidence}%`, margin, 42)

  y = 54
  doc.setTextColor(45, 52, 54)

  // Garment info
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, '款式信息 / Garment Information', margin, y)
  y += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const infoLines = [
    `类别 / Category: ${garmentInfo.category} / ${garmentInfo.categoryEn}`,
    `版型 / Style: ${garmentInfo.style} / ${garmentInfo.styleEn}`,
    `面料 / Fabric: ${garmentInfo.fabric} / ${garmentInfo.fabricEn}`,
    `难度 / Difficulty: ${garmentInfo.difficulty} / ${garmentInfo.difficultyEn}`,
    `裁片 / Pattern Pieces: ${patternPieces.length} 类, 共 ${patternPieces.reduce((s, p) => s + p.count, 0)} 片`,
    `放码基准 / Base Size: S`,
  ]
  infoLines.forEach(line => {
    drawBilingualText(doc, line, margin, y, { fontSize: 10 })
    y += 5.5
  })

  y += 4
  doc.setDrawColor(200, 200, 210)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // ========== 尺寸表 ==========
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, customSizes ? '自定义成衣尺寸 / Custom Size Measurements (cm)' : '成品尺寸表 / Size Measurements (cm)', margin, y)
  y += 7

  const sizes = customSizes ? ['自定义 / Custom'] : sizeMeasurements.sizes
  const colWidth = customSizes ? 48 : 22
  const nameColWidth = 42

  doc.setFillColor(240, 240, 250)
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F')
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  drawBilingualText(doc, '部位 / Part', margin + 2, y, { fontSize: 8.5, fontStyle: 'bold' })
  sizes.forEach((s, i) => {
    const x = margin + nameColWidth + i * colWidth
    drawBilingualText(doc, s, x, y, { fontSize: 8.5, fontStyle: 'bold' })
  })
  y += 8

  doc.setFont('helvetica', 'normal')
  sizeMeasurements.rows.forEach((row, ri) => {
    if (ri % 2 === 0) {
      doc.setFillColor(248, 248, 252)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 6.5, 'F')
    }
    drawBilingualText(doc, `${row.name} / ${row.nameEn}`, margin + 2, y, { fontSize: 8.5 })
    if (customSizes) {
      const val = customSizes[row.name]
      doc.text(val != null ? String(val) : '-', margin + nameColWidth, y)
    } else {
      row.values.forEach((val, i) => {
        const x = margin + nameColWidth + i * colWidth
        doc.text(String(val), x, y)
      })
    }
    y += 6.5
  })

  // ========== 裁片图纸 ==========
  patternPieces.forEach((piece, idx) => {
    doc.addPage()

    const rgb = hexToRgb(piece.color)
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(0, 0, pageWidth, 14, 'F')
    doc.setTextColor(255, 255, 255)
    drawBilingualText(doc, `裁片 ${idx + 1}: ${piece.name} / ${piece.nameEn}  x${piece.count}`, margin, 9, { fontSize: 13, fontStyle: 'bold', textColor: [255, 255, 255] })

    y = 22
    doc.setTextColor(45, 52, 54)

    // Draw pattern piece
    drawPatternPieceInPDF(doc, piece, margin, y, pageWidth - margin * 2, 125)
    y += 135

    // Measurements
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, `尺寸标注 / Measurements (${sizeLabel} - cm)`, margin, y, { fontSize: 11, fontStyle: 'bold' })
    y += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const measurements = Object.entries(piece.measurements)
    const half = Math.ceil(measurements.length / 2)

    measurements.forEach(([key, val], i) => {
      const col = i < half ? 0 : 1
      const row = i % half
      const x = margin + col * 85
      const yPos = y + row * 6
      drawBilingualText(doc, `${key}:`, x, yPos, { fontSize: 9 })
      doc.setFont('helvetica', 'bold')
      doc.text(`${val} cm`, x + 50, yPos)
      doc.setFont('helvetica', 'normal')
    })

    y += half * 6 + 8

    // Points
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    drawBilingualText(doc, '关键点位 / Key Points:', margin, y, { fontSize: 10, fontStyle: 'bold' })
    y += 5

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    piece.points.forEach((pt, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      drawBilingualText(doc, `${pt.label} / ${pt.labelEn}`, margin + col * 60, y + row * 5, { fontSize: 8 })
    })
  })

  return doc
}

function drawPatternPieceInPDF(doc, piece, x, y, w, h) {
  const rgb = hexToRgb(piece.color)

  doc.setDrawColor(200, 200, 210)
  doc.setLineWidth(0.3)
  doc.rect(x, y, w, h)

  doc.setDrawColor(235, 235, 240)
  for (let i = 10; i < w; i += 10) {
    doc.line(x + i, y, x + i, y + h)
  }
  for (let j = 10; j < h; j += 10) {
    doc.line(x, y + j, x + w, y + j)
  }

  doc.setDrawColor(200, 200, 210)
  doc.setLineWidth(0.2)
  doc.setLineDashPattern([2, 1], 0)
  doc.line(x + w / 2, y, x + w / 2, y + h)
  doc.line(x, y + h / 2, x + w, y + h / 2)
  doc.setLineDashPattern([], 0)

  const scale = Math.min(w / 150, h / 210) * 0.85
  const offsetX = x + (w - 150 * scale) / 2
  const offsetY = y + (h - 210 * scale) / 2

  doc.setDrawColor(rgb.r, rgb.g, rgb.b)
  doc.setLineWidth(0.8)

  const pathCommands = parseSvgPath(piece.svgPath)
  let currentX = 0, currentY = 0
  const points = []

  pathCommands.forEach(cmd => {
    if (cmd.cmd === 'M' || cmd.cmd === 'L') {
      const px = offsetX + cmd.x * scale
      const py = offsetY + cmd.y * scale
      if (cmd.cmd === 'M') {
        currentX = px
        currentY = py
        points.push({ x: px, y: py })
      } else {
        doc.line(currentX, currentY, px, py)
        currentX = px
        currentY = py
        points.push({ x: px, y: py })
      }
    } else if (cmd.cmd === 'Q') {
      const startX = currentX
      const startY = currentY
      const cpX = offsetX + cmd.cpx * scale
      const cpY = offsetY + cmd.cpy * scale
      const endX = offsetX + cmd.x * scale
      const endY = offsetY + cmd.y * scale
      const steps = 10
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const t1 = 1 - t
        const px = t1 * t1 * startX + 2 * t1 * t * cpX + t * t * endX
        const py = t1 * t1 * startY + 2 * t1 * t * cpY + t * t * endY
        doc.line(currentX, currentY, px, py)
        currentX = px
        currentY = py
      }
      points.push({ x: endX, y: endY })
    } else if (cmd.cmd === 'Z') {
      if (points.length > 0) {
        doc.line(currentX, currentY, points[0].x, points[0].y)
      }
    }
  })

  // Points - bilingual labels
  doc.setFillColor(255, 255, 255)
  piece.points.forEach(pt => {
    const px = offsetX + pt.x * scale
    const py = offsetY + pt.y * scale
    doc.circle(px, py, 1.2, 'F')
    doc.setDrawColor(rgb.r, rgb.g, rgb.b)
    doc.setLineWidth(0.5)
    doc.circle(px, py, 1.2, 'S')
    doc.setFontSize(4.5)
    doc.setTextColor(80, 80, 90)
    const label = `${pt.label} / ${pt.labelEn}`
    drawBilingualText(doc, label, px + 2, py - 1)
  })

  // Grain line - bilingual
  doc.setDrawColor(rgb.r, rgb.g, rgb.b)
  doc.setLineWidth(0.3)
  doc.setLineDashPattern([3, 1, 1, 1], 0)
  const grainX = offsetX + 75 * scale
  doc.line(grainX, offsetY + 20 * scale, grainX, offsetY + 190 * scale)
  doc.setLineDashPattern([], 0)
  doc.setFontSize(4.5)
  doc.setTextColor(rgb.r, rgb.g, rgb.b)
  drawBilingualText(doc, 'Grain / 布纹向', grainX + 2, offsetY + 105 * scale)
}

function parseSvgPath(pathStr) {
  const commands = []
  const regex = /([MLQZ])\s*([\d\s.,\-]*)/gi
  let match
  while ((match = regex.exec(pathStr)) !== null) {
    const cmd = match[1].toUpperCase()
    const args = match[2].trim().split(/[\s,]+/).filter(s => s).map(parseFloat)
    if (cmd === 'M' || cmd === 'L') {
      commands.push({ cmd, x: args[0], y: args[1] })
    } else if (cmd === 'Q') {
      commands.push({ cmd, cpx: args[0], cpy: args[1], x: args[2], y: args[3] })
    } else if (cmd === 'Z') {
      commands.push({ cmd })
    }
  }
  return commands
}

function adjustPieceMeasurement(key, baseVal, customSizes) {
  const ratio = getAdjustmentRatio(key, customSizes)
  return parseFloat((baseVal * ratio).toFixed(1))
}

function getAdjustmentRatio(key, customSizes) {
  // 基准码 S 的成衣尺寸（用于推算自定义尺寸的调整比例）
  const base = {
    bust: 84,        // 胸围
    waist: 76,       // 腰围
    length: 56,      // 衣长
    shoulder: 32,    // 肩宽
    neckWidth: 16,   // 领宽
    neckDepth: 7,    // 领深(前)
    armhole: 22,     // 袖窿深
  }

  // 裁片 measurements 的 key 为双语格式，如 "衣长 / Length"、"胸围/4 / Bust÷4"。
  // 取 "/" 前的中文部分优先匹配，英文关键词作为兜底，确保双语 key 都能命中。
  const cn = (key.split('/')[0] || key).trim()

  // 胸围 / Bust（含 "胸围/4 / Bust÷4"）
  if (cn.includes('胸围') || key.includes('Bust')) {
    return (customSizes['胸围'] || base.bust) / base.bust
  }
  // 腰围 / Waist（含 "腰围/4 / Waist÷4"）
  if (cn.includes('腰围') || key.includes('Waist')) {
    return (customSizes['腰围'] || base.waist) / base.waist
  }
  // 袖窿深 / Armhole depth
  if (cn.includes('袖窿') || key.includes('Armhole')) {
    return (customSizes['袖窿深'] || base.armhole) / base.armhole
  }
  // 领深 / Neck depth —— 必须在「领宽」之前判断，否则会被 key 中的 "Neck" 命中
  if (cn.includes('领深') || key.includes('Neck depth') || key.includes('Neck Depth')) {
    return (customSizes['领深(前)'] || base.neckDepth) / base.neckDepth
  }
  // 领宽 / Neck width
  if (cn.includes('领宽') || key.includes('Neck')) {
    return (customSizes['领宽'] || base.neckWidth) / base.neckWidth
  }
  // 肩宽 / Shoulder
  if (cn.includes('肩宽') || key.includes('Shoulder')) {
    return (customSizes['肩宽'] || base.shoulder) / base.shoulder
  }
  // 衣长 / Length
  if (cn.includes('衣长') || key.includes('Length')) {
    return (customSizes['衣长'] || base.length) / base.length
  }
  return 1
}

// ============================================================================
// DXF 导出（AutoCAD Drawing Exchange Format）
// ============================================================================

// ACI 调色板（用于把裁片颜色映射为 DXF 图层颜色索引）
const ACI_PALETTE = [
  { idx: 1, rgb: [255, 0, 0] },     // red
  { idx: 2, rgb: [255, 255, 0] },   // yellow
  { idx: 3, rgb: [0, 255, 0] },     // green
  { idx: 4, rgb: [0, 255, 255] },   // cyan
  { idx: 5, rgb: [0, 0, 255] },     // blue
  { idx: 6, rgb: [255, 0, 255] },   // magenta
  { idx: 7, rgb: [255, 255, 255] }, // white
  { idx: 8, rgb: [128, 128, 128] }, // gray
  { idx: 9, rgb: [192, 192, 192] }, // light gray
  { idx: 30, rgb: [255, 127, 0] },  // orange
  { idx: 40, rgb: [255, 191, 0] },  // gold
  { idx: 50, rgb: [0, 255, 127] },  // spring green
  { idx: 60, rgb: [0, 191, 255] },  // sky blue
  { idx: 70, rgb: [127, 0, 255] },  // purple
  { idx: 250, rgb: [60, 60, 60] },  // dark gray
]

function rgbToAci(rgb) {
  const r = rgb && rgb.r != null ? rgb.r : (rgb ? rgb[0] : 0)
  const g = rgb && rgb.g != null ? rgb.g : (rgb ? rgb[1] : 0)
  const b = rgb && rgb.b != null ? rgb.b : (rgb ? rgb[2] : 0)
  let best = 7
  let bestDist = Infinity
  for (const c of ACI_PALETTE) {
    const d = (c.rgb[0] - r) ** 2 + (c.rgb[1] - g) ** 2 + (c.rgb[2] - b) ** 2
    if (d < bestDist) {
      bestDist = d
      best = c.idx
    }
  }
  return best
}

function sanitizeDxfLayerName(name) {
  const n = String(name).replace(/[^A-Za-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')
  return n || 'PATTERN_LAYER'
}

function fmtNum(n) {
  if (n == null || !isFinite(n)) return '0'
  return parseFloat(Number(n).toFixed(4)).toString()
}

/**
 * 将 SVG 路径扁平化为坐标点数组（Q 曲线采样为折线）
 * @param {string} svgPath
 * @returns {{x:number,y:number}[]}
 */
function flattenSvgPathToPoints(svgPath) {
  const commands = parseSvgPath(svgPath)
  const points = []
  let curX = 0
  let curY = 0
  commands.forEach(cmd => {
    if (cmd.cmd === 'M' || cmd.cmd === 'L') {
      points.push({ x: cmd.x, y: cmd.y })
      curX = cmd.x
      curY = cmd.y
    } else if (cmd.cmd === 'Q') {
      const steps = 12
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        const t1 = 1 - t
        const px = t1 * t1 * curX + 2 * t1 * t * cmd.cpx + t * t * cmd.x
        const py = t1 * t1 * curY + 2 * t1 * t * cmd.cpy + t * t * cmd.y
        points.push({ x: px, y: py })
      }
      curX = cmd.x
      curY = cmd.y
    }
    // Z：闭合由 LWPOLYLINE 的 closed 标志处理
  })
  return points
}

/**
 * 生成 DXF 格式文件（AutoCAD Drawing Exchange Format）。
 * - 每个裁片一个图层
 * - ENTITIES 段使用 LWPOLYLINE 描述轮廓路径
 * - TEXT 实体提供中英双语标注
 * - 纯文本 UTF-8 编码，下载为 .dxf
 * @param {Object} options
 * @param {string} [options.sizeLabel='S']
 * @param {Object} [options.customSizes]
 * @param {string} [options.fileName]
 * @returns {string} DXF 文本内容
 */
export function exportDXF(options = {}) {
  const { sizeLabel = 'S', customSizes = null, fileName } = options

  const out = []
  const push = (code, value) => {
    out.push(String(code))
    out.push(String(value))
  }

  // ---------- HEADER ----------
  push(0, 'SECTION')
  push(2, 'HEADER')
  push(9, '$ACADVER'); push(1, 'AC1009')
  push(9, '$DWGCODEPAGE'); push(3, 'UTF-8')
  push(9, '$INSUNITS'); push(70, 4) // 4 = millimeters
  push(0, 'ENDSEC')

  // ---------- TABLES ----------
  push(0, 'SECTION')
  push(2, 'TABLES')

  // LTYPE
  push(0, 'TABLE')
  push(2, 'LTYPE')
  push(70, 1)
  push(0, 'LTYPE')
  push(2, 'CONTINUOUS')
  push(70, 0)
  push(3, 'Solid line / 实线')
  push(72, 65)
  push(73, 0)
  push(40, 0.0)
  push(0, 'ENDTAB')

  // LAYER（每个裁片一个图层）
  push(0, 'TABLE')
  push(2, 'LAYER')
  push(70, patternPieces.length + 1)
  push(0, 'LAYER'); push(2, '0'); push(70, 0); push(62, 7); push(6, 'CONTINUOUS')
  patternPieces.forEach(piece => {
    const layerName = sanitizeDxfLayerName(piece.nameEn + '_' + piece.id)
    const aci = rgbToAci(hexToRgb(piece.color))
    push(0, 'LAYER'); push(2, layerName); push(70, 0); push(62, aci); push(6, 'CONTINUOUS')
  })
  push(0, 'ENDTAB')

  push(0, 'ENDSEC')

  // ---------- ENTITIES ----------
  push(0, 'SECTION')
  push(2, 'ENTITIES')

  patternPieces.forEach(piece => {
    const layerName = sanitizeDxfLayerName(piece.nameEn + '_' + piece.id)
    const pts = flattenSvgPathToPoints(piece.svgPath)

    // 轮廓：LWPOLYLINE（闭合）
    if (pts.length > 0) {
      push(0, 'LWPOLYLINE')
      push(8, layerName)
      push(90, pts.length)
      push(70, 1) // 1 = closed
      pts.forEach(p => {
        push(10, fmtNum(p.x))
        push(20, fmtNum(-p.y)) // 翻转 Y 以符合 CAD 坐标系（Y 向上）
      })
    }

    // 中心位置用于放置裁片名标注
    const cx = pts.length ? pts.reduce((s, p) => s + p.x, 0) / pts.length : 0
    const cy = pts.length ? pts.reduce((s, p) => s + p.y, 0) / pts.length : 0
    const minY = pts.length ? Math.min(...pts.map(p => p.y)) : 0

    // 裁片名（中英双语）
    push(0, 'TEXT')
    push(8, layerName)
    push(10, fmtNum(cx))
    push(20, fmtNum(-cy + 8))
    push(40, 5) // 字高
    push(1, `${piece.name} / ${piece.nameEn}  x${piece.count} (${sizeLabel})`)
    push(7, 'STANDARD')

    // 关键点位标注（中英双语）
    piece.points.forEach(pt => {
      push(0, 'TEXT')
      push(8, layerName)
      push(10, fmtNum(pt.x + 1.5))
      push(20, fmtNum(-pt.y + 1.5))
      push(40, 2.5)
      push(1, `${pt.label} / ${pt.labelEn}`)
      push(7, 'STANDARD')
    })

    // 尺寸标注（中英双语）
    let mY = minY - 6
    Object.entries(piece.measurements).forEach(([key, val]) => {
      let displayVal = val
      if (customSizes) displayVal = adjustPieceMeasurement(key, val, customSizes)
      push(0, 'TEXT')
      push(8, layerName)
      push(10, fmtNum(cx - 30))
      push(20, fmtNum(-mY))
      push(40, 2.5)
      push(1, `${key}: ${displayVal} cm`)
      push(7, 'STANDARD')
      mY -= 3.5
    })
  })

  push(0, 'ENDSEC')
  push(0, 'EOF')

  const content = out.join('\n')
  const base = fileName || `PatternAI_${garmentInfo.nameEn.replace(/\s+/g, '_')}_${sizeLabel}_${Date.now()}`
  const name = base.toLowerCase().endsWith('.dxf') ? base : base + '.dxf'
  downloadTextFile(content, name, 'application/dxf')
  return content
}

// ============================================================================
// PRJ 导出（ET 服装 CAD 工程文件 / JSON）
// ============================================================================

/**
 * 生成 PRJ 格式工程文件（JSON），包含款式信息、裁片数据、尺寸数据、放码规则、用料与工序。
 * @param {Object} options
 * @param {string} [options.sizeLabel='S']
 * @param {Object} [options.customSizes]
 * @param {string} [options.fileName]
 * @returns {string} PRJ JSON 内容
 */
export function exportPRJ(options = {}) {
  const { sizeLabel = 'S', customSizes = null, fileName } = options

  const totalCount = patternPieces.reduce((s, p) => s + p.count, 0)

  const project = {
    format: 'PatternAI-Project',
    fileType: 'ET-CAD-Project',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    generator: 'PatternAI | 智裁',
    sizeLabel,
    baseSize: 'S',
    customSizes,

    // 款式信息
    garment: {
      name: garmentInfo.name,
      nameEn: garmentInfo.nameEn,
      category: garmentInfo.category,
      categoryEn: garmentInfo.categoryEn,
      style: garmentInfo.style,
      styleEn: garmentInfo.styleEn,
      season: garmentInfo.season,
      seasonEn: garmentInfo.seasonEn,
      difficulty: garmentInfo.difficulty,
      difficultyEn: garmentInfo.difficultyEn,
      fabric: garmentInfo.fabric,
      fabricEn: garmentInfo.fabricEn,
      confidence: garmentInfo.confidence,
      recognitionTime: garmentInfo.recognitionTime,
      description: garmentInfo.description,
      descriptionEn: garmentInfo.descriptionEn,
    },

    // 裁片数据
    patternPieces: patternPieces.map(piece => ({
      id: piece.id,
      name: piece.name,
      nameEn: piece.nameEn,
      count: piece.count,
      color: piece.color,
      svgPath: piece.svgPath,
      points: piece.points,
      outlinePoints: flattenSvgPathToPoints(piece.svgPath),
      measurements: Object.entries(piece.measurements).map(([key, val]) => ({
        name: key,
        baseValue: val,
        value: customSizes ? adjustPieceMeasurement(key, val, customSizes) : val,
        unit: 'cm',
      })),
    })),

    // 尺寸数据
    sizeMeasurements,

    // 放码规则
    gradingRules,

    // 用料数据
    materialUsage: {
      fabric: materialUsage.fabric,
      lining: materialUsage.lining,
      accessories: materialUsage.accessories,
      cuttingLayout: materialUsage.cuttingLayout,
    },

    // 缝制工序
    sewingSteps,

    // 汇总信息
    meta: {
      totalPieces: patternPieces.length,
      totalPieceCount: totalCount,
      sizeCount: sizeMeasurements.sizes.length,
    },
  }

  const content = JSON.stringify(project, null, 2)
  const base = fileName || `PatternAI_${garmentInfo.nameEn.replace(/\s+/g, '_')}_${sizeLabel}_${Date.now()}`
  const name = base.toLowerCase().endsWith('.prj') ? base : base + '.prj'
  downloadTextFile(content, name, 'application/json')
  return content
}

// ============================================================================
// 统一导出入口
// ============================================================================

/**
 * 统一导出函数，根据 format 调用对应导出函数。
 * @param {Object} options
 * @param {'pdf'|'dxf'|'prj'} [options.format='pdf'] 导出格式
 * @param {string} [options.sizeLabel='S'] 码号标签
 * @param {Object} [options.customSizes] 自定义尺寸
 * @param {string} [options.fileName] 自定义文件名
 * @returns {string|undefined} 导出内容（PDF 返回文件名，DXF/PRJ 返回文本内容）
 */
export function exportPattern(options = {}) {
  const { format = 'pdf', ...rest } = options
  switch (String(format).toLowerCase()) {
    case 'dxf':
      return exportDXF(rest)
    case 'prj':
      return exportPRJ(rest)
    case 'pdf':
    default:
      return generatePatternPDF(rest)
  }
}

// ============================================================================
// 通用：文本文件下载
// ============================================================================

/**
 * 将文本内容作为文件下载（UTF-8 编码）。
 * @param {string} content
 * @param {string} fileName
 * @param {string} [mime]
 */
function downloadTextFile(content, fileName, mime) {
  const blob = new Blob([content], { type: (mime || 'text/plain') + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
