import { jsPDF } from 'jspdf'
import { garmentInfo, patternPieces, sizeMeasurements, materialUsage, sewingSteps } from '../data/mockData.js'

/**
 * 生成纸样 PDF 文档（中英双语）
 * @param {Object} options - 导出选项
 * @param {string} options.sizeLabel - 码号标签
 * @param {Object} options.customSizes - 自定义尺寸
 */
export function generatePatternPDF(options = {}) {
  const { sizeLabel = 'S', customSizes = null } = options

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
  doc.text('PatternAI | 智裁 - 纸样报告', margin, 18)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'normal')
  doc.text(`${garmentInfo.name}  /  ${garmentInfo.nameEn}`, margin, 28)

  doc.setFontSize(11)
  doc.text(`Size / 码号: ${sizeLabel}  |  Generated / 生成日期: ${new Date().toLocaleDateString('en-US')}`, margin, 36)
  doc.text(`Base Size / 放码基准: S  |  Confidence / 识别置信度: ${garmentInfo.confidence}%`, margin, 42)

  y = 54
  doc.setTextColor(45, 52, 54)

  // Garment info - bilingual
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Garment Information / 款式信息', margin, y)
  y += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const infoLines = [
    `Category / 类别: ${garmentInfo.category} / ${garmentInfo.categoryEn}`,
    `Style / 版型: ${garmentInfo.style} / ${garmentInfo.styleEn}`,
    `Season / 季节: ${garmentInfo.season} / ${garmentInfo.seasonEn}`,
    `Fabric / 面料: ${garmentInfo.fabric} / ${garmentInfo.fabricEn}`,
    `Difficulty / 难度: ${garmentInfo.difficulty} / ${garmentInfo.difficultyEn}`,
    `Pattern Pieces / 裁片: ${patternPieces.length} types / ${patternPieces.length} 类, ${patternPieces.reduce((s, p) => s + p.count, 0)} total / 共 ${patternPieces.reduce((s, p) => s + p.count, 0)} 片`,
    `Base Size / 放码基准: S`,
  ]
  infoLines.forEach(line => {
    doc.text(line, margin, y)
    y += 5.5
  })

  y += 3
  doc.setFontSize(9)
  doc.setTextColor(99, 110, 114)
  const descLines = doc.splitTextToSize(`${garmentInfo.description}`, pageWidth - margin * 2)
  doc.text(descLines, margin, y)
  y += descLines.length * 4.5

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
  doc.text(sizeTableTitle, margin, y)
  y += 7

  const sizes = customSizes ? ['Custom'] : sizeMeasurements.sizes
  const colWidth = customSizes ? 40 : 22
  const nameColWidth = 42

  doc.setFillColor(240, 240, 250)
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F')
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.text('Part / 部位', margin + 2, y)
  sizes.forEach((s, i) => {
    const x = margin + nameColWidth + i * colWidth
    doc.text(s, x, y)
  })
  y += 8

  doc.setFont('helvetica', 'normal')
  sizeMeasurements.rows.forEach((row, ri) => {
    if (ri % 2 === 0) {
      doc.setFillColor(248, 248, 252)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 6.5, 'F')
    }
    doc.text(`${row.name} / ${row.nameEn}`, margin + 2, y)
    if (customSizes) {
      const val = customSizes[row.name]
      doc.text(val != null ? String(val) : '-', margin + nameColWidth, y)
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
        doc.text(String(val), x, y)
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
    doc.text(`Piece ${idx + 1}: ${piece.name} / ${piece.nameEn}  x${piece.count}`, margin, 9)

    y = 22
    doc.setTextColor(45, 52, 54)

    // Draw pattern piece
    drawPatternPieceInPDF(doc, piece, margin, y, pageWidth - margin * 2, 125)

    y += 135

    // Measurements - bilingual
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`Measurements / 尺寸标注 (${sizeLabel} - cm)`, margin, y)
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

      doc.text(`${key}:`, x, yPos)
      doc.setFont('helvetica', 'bold')
      doc.text(`${displayVal} cm`, x + 50, yPos)
      doc.setFont('helvetica', 'normal')
    })

    y += half * 6 + 8

    // Points - bilingual
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Key Points / 关键点位:', margin, y)
    y += 5

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    piece.points.forEach((pt, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const label = `${pt.label} / ${pt.labelEn}`
      doc.text(label, margin + col * 60, y + row * 5)
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
  doc.text('Material Usage & Accessories / 用料与辅料', margin, 9)

  y = 24
  doc.setTextColor(45, 52, 54)

  // Fabric - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`${materialUsage.fabric.name} / ${materialUsage.fabric.nameEn}`, margin, y)
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
  fabricLines.forEach(line => { doc.text(line, margin, y); y += 5 })

  y += 4

  // Binding - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`${materialUsage.lining.name} / ${materialUsage.lining.nameEn}`, margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Type / 类型: ${materialUsage.lining.type} / ${materialUsage.lining.typeEn}`, margin, y); y += 5
  doc.text(`Width / 门幅: ${materialUsage.lining.width}`, margin, y); y += 5
  doc.text(`Unit Length / 单件用量: ${materialUsage.lining.unitLength}m`, margin, y); y += 8

  // Accessories - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Accessories / 辅料清单`, margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  doc.setFillColor(240, 240, 250)
  doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('Name / 名称', margin + 2, y)
  doc.text('Spec / 规格', margin + 65, y)
  doc.text('Qty / 数量', margin + 140, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  materialUsage.accessories.forEach((acc, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 252)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 6, 'F')
    }
    doc.text(`${acc.name} / ${acc.nameEn}`, margin + 2, y)
    doc.text(`${acc.spec} / ${acc.specEn}`, margin + 65, y)
    doc.text(`${acc.quantity} ${acc.unit}`, margin + 140, y)
    y += 6
  })

  y += 8

  // Sewing steps - bilingual
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Sewing Steps / 缝制工序`, margin, y)
  y += 6
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  sewingSteps.forEach(step => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${step.step}.`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(`${step.name} / ${step.nameEn}`, margin + 8, y)
    doc.setTextColor(0, 206, 201)
    doc.text(`(${step.time})`, margin + 80, y)
    doc.setTextColor(45, 52, 54)
    y += 4.5
    const descLines = doc.splitTextToSize(`${step.desc} / ${step.descEn}`, pageWidth - margin * 2 - 8)
    doc.setTextColor(99, 110, 114)
    doc.text(descLines, margin + 8, y)
    doc.setTextColor(45, 52, 54)
    y += descLines.length * 4 + 3
  })

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(
      `PatternAI | ${garmentInfo.name} / ${garmentInfo.nameEn} | Size: ${sizeLabel} | Page ${i}/${pageCount}`,
      margin,
      pageHeight - 5
    )
  }

  const fileName = `PatternAI_${garmentInfo.nameEn.replace(/\s+/g, '_')}_${sizeLabel}_${Date.now()}.pdf`
  doc.save(fileName)
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 108, g: 92, b: 231 }
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
    doc.text(label, px + 2, py - 1)
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
  doc.text('Grain / 布纹向', grainX + 2, offsetY + 105 * scale)
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
  const sBust = 84
  const sWaist = 76
  const sLength = 56
  const sShoulder = 32

  if (key.includes('胸围') || key.includes('Bust')) {
    return (customSizes['胸围'] || sBust) / sBust
  }
  if (key.includes('腰围') || key.includes('Waist')) {
    return (customSizes['腰围'] || sWaist) / sWaist
  }
  if (key.includes('衣长') || key.includes('Length')) {
    return (customSizes['衣长'] || sLength) / sLength
  }
  if (key.includes('肩宽') || key.includes('Shoulder')) {
    return (customSizes['肩宽'] || sShoulder) / sShoulder
  }
  if (key.includes('领') || key.includes('Neck')) {
    return (customSizes['领宽'] || 16) / 16
  }
  if (key.includes('袖窿') || key.includes('Armhole')) {
    return (customSizes['袖窿深'] || 22) / 22
  }
  return 1
}
