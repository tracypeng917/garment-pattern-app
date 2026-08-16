// 模拟服装识别与纸样数据
// 款式：夏季无袖针织背心
// 放码基准码：M
// 所有标注支持中英双语

export const garmentInfo = {
  name: '夏季无袖针织背心',
  nameEn: 'Summer Sleeveless Knit Vest',
  category: '上装 / 背心',
  categoryEn: 'Tops / Vest',
  style: 'Relaxed Fit',
  styleEn: '宽松版型',
  season: '夏季',
  seasonEn: 'Summer',
  difficulty: '简单',
  difficultyEn: 'Easy',
  fabric: '针织面料',
  fabricEn: 'Knit Fabric',
  recognitionTime: '1.8s',
  confidence: 97.2,
  description: 'AI 已学习 H&M 和 Zara 品牌数据，识别为夏季无袖针织背心，圆领、无袖、宽松版型（参考 H&M Relaxed Fit 标准）。含前片、后片及三处包边条（领口、袖窿、下摆），共5个裁片。适合针织面料，四线包缝工艺。M码对应 H&M M码(88/72/96) 和 Zara M码(90/70/98)。',
  descriptionEn: 'AI trained on H&M & Zara brand data. Identified as a summer sleeveless knit vest with round neckline, sleeveless design, and relaxed fit (H&M Relaxed Fit reference). Includes front, back, and three binding strips (neckline, armhole, hem), 5 pattern pieces total. Size M corresponds to H&M M (88/72/96) and Zara M (90/70/98).',
  images: [], // 用户上传的多张图片
}

// 纸样裁片定义（SVG路径 + 尺寸标注）— 双语
// 所有尺寸基于 M 码基准
export const patternPieces = [
  {
    id: 'front',
    name: '前片',
    nameEn: 'Front Block',
    count: 1,
    color: '#E8804A',
    svgPath: 'M 40 10 L 110 10 L 115 20 L 115 25 Q 120 30 118 40 L 118 175 L 112 185 L 38 185 L 32 175 L 32 40 Q 30 30 35 25 L 35 20 Z',
    points: [
      { x: 40, y: 10, label: '肩点A', labelEn: 'Shoulder A' },
      { x: 110, y: 10, label: '肩点B', labelEn: 'Shoulder B' },
      { x: 115, y: 25, label: '袖窿上C', labelEn: 'Armhole top C' },
      { x: 118, y: 40, label: '袖窿下D', labelEn: 'Armhole bot D' },
      { x: 118, y: 175, label: '侧缝E', labelEn: 'Side seam E' },
      { x: 38, y: 185, label: '下摆F', labelEn: 'Hem F' },
      { x: 32, y: 175, label: '侧缝G', labelEn: 'Side seam G' },
      { x: 32, y: 40, label: '袖窿下H', labelEn: 'Armhole bot H' },
    ],
    measurements: {
      '衣长 / Length': 56,
      '胸围/4 / Bust÷4': 21,
      '腰围/4 / Waist÷4': 19,
      '肩宽 / Shoulder': 8,
      '领宽 / Neck width': 16,
      '领深 / Neck depth': 7,
      '袖窿深 / Armhole depth': 22,
    }
  },
  {
    id: 'back',
    name: '后片',
    nameEn: 'Back Block',
    count: 1,
    color: '#5B9BD5',
    svgPath: 'M 35 10 L 115 10 L 120 20 L 120 25 Q 125 30 123 40 L 123 175 L 117 185 L 33 185 L 27 175 L 27 40 Q 25 30 30 25 L 30 20 Z',
    points: [
      { x: 35, y: 10, label: '肩点I', labelEn: 'Shoulder I' },
      { x: 115, y: 10, label: '肩点J', labelEn: 'Shoulder J' },
      { x: 120, y: 25, label: '袖窿上K', labelEn: 'Armhole top K' },
      { x: 123, y: 40, label: '袖窿下L', labelEn: 'Armhole bot L' },
      { x: 123, y: 175, label: '侧缝M', labelEn: 'Side seam M' },
      { x: 33, y: 185, label: '下摆N', labelEn: 'Hem N' },
      { x: 27, y: 175, label: '侧缝O', labelEn: 'Side seam O' },
      { x: 27, y: 40, label: '袖窿下P', labelEn: 'Armhole bot P' },
    ],
    measurements: {
      '衣长 / Length': 57,
      '胸围/4 / Bust÷4': 21.5,
      '腰围/4 / Waist÷4': 19.5,
      '肩宽 / Shoulder': 8.5,
      '领宽 / Neck width': 16,
      '领深 / Neck depth': 4,
      '袖窿深 / Armhole depth': 22.5,
    }
  },
  {
    id: 'neck-binding',
    name: '领口包边条',
    nameEn: 'Neckline Binding',
    count: 1,
    color: '#9B59B6',
    svgPath: 'M 10 15 L 130 15 L 130 35 L 10 35 Z',
    points: [
      { x: 10, y: 15, label: '起点Q', labelEn: 'Start Q' },
      { x: 130, y: 15, label: '终点R', labelEn: 'End R' },
    ],
    measurements: {
      '长度 / Length': 42,
      '宽度 / Width': 3.5,
      '对折宽 / Folded width': 1.75,
    }
  },
  {
    id: 'armhole-binding',
    name: '袖窿包边条',
    nameEn: 'Armhole Binding',
    count: 2,
    color: '#70AD47',
    svgPath: 'M 10 15 L 90 15 L 90 35 L 10 35 Z',
    points: [
      { x: 10, y: 15, label: '左起点S', labelEn: 'L-start S' },
      { x: 90, y: 15, label: '左终点T', labelEn: 'L-end T' },
    ],
    measurements: {
      '长度 / Length': 26,
      '宽度 / Width': 3.5,
      '对折宽 / Folded width': 1.75,
    }
  },
  {
    id: 'hem-binding',
    name: '下摆包边条',
    nameEn: 'Hem Binding',
    count: 1,
    color: '#F39C12',
    svgPath: 'M 10 15 L 130 15 L 130 35 L 10 35 Z',
    points: [
      { x: 10, y: 15, label: '起点U', labelEn: 'Start U' },
      { x: 130, y: 15, label: '终点V', labelEn: 'End V' },
    ],
    measurements: {
      '长度 / Length': 42,
      '宽度 / Width': 3.5,
      '对折宽 / Folded width': 1.75,
    }
  },
]

// 尺寸表（各码号尺寸，单位 cm）— 双语
export const sizeMeasurements = {
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  rows: [
    { name: '衣长', nameEn: 'Length', values: [56, 58, 60, 62, 64] },
    { name: '胸围', nameEn: 'Bust', values: [84, 88, 92, 96, 100] },
    { name: '腰围', nameEn: 'Waist', values: [76, 80, 84, 88, 92] },
    { name: '肩宽', nameEn: 'Shoulder', values: [32, 33, 34, 35, 36] },
    { name: '领宽', nameEn: 'Neck Width', values: [16, 16.5, 17, 17.5, 18] },
    { name: '领深(前)', nameEn: 'Front Neck Depth', values: [7, 7.5, 8, 8.5, 9] },
    { name: '袖窿深', nameEn: 'Armhole Depth', values: [22, 23, 24, 25, 26] },
  ]
}

// 放码规则（以 M 码为基准）— 双语
export const gradingRules = {
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  baseSize: 'M',
  rows: [
    { name: '衣长', nameEn: 'Length', diffs: [0, 2, 4, 6, 8] },
    { name: '胸围', nameEn: 'Bust', diffs: [0, 4, 8, 12, 16] },
    { name: '腰围', nameEn: 'Waist', diffs: [0, 4, 8, 12, 16] },
    { name: '肩宽', nameEn: 'Shoulder', diffs: [0, 1, 2, 3, 4] },
    { name: '领宽', nameEn: 'Neck Width', diffs: [0, 0.5, 1, 1.5, 2] },
    { name: '领深(前)', nameEn: 'Front Neck Depth', diffs: [0, 0.5, 1, 1.5, 2] },
    { name: '袖窿深', nameEn: 'Armhole Depth', diffs: [0, 1, 2, 3, 4] },
  ]
}

// 人体净尺寸参考表 — 双语
export const bodyMeasurements = {
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  rows: [
    { name: '身高', nameEn: 'Height', values: [155, 160, 165, 170, 175] },
    { name: '胸围', nameEn: 'Bust', values: [80, 84, 88, 92, 96] },
    { name: '腰围', nameEn: 'Waist', values: [64, 68, 72, 76, 80] },
    { name: '臀围', nameEn: 'Hip', values: [88, 92, 96, 100, 104] },
    { name: '肩宽', nameEn: 'Shoulder', values: [35, 36, 37, 38, 39] },
    { name: '袖长', nameEn: 'Sleeve Length', values: [55, 56, 57, 58, 59] },
    { name: '领围', nameEn: 'Neck', values: [32, 33, 34, 35, 36] },
  ]
}

// 放码基准点说明 — 双语
export const gradingPoints = [
  { piece: '前片', pieceEn: 'Front', point: '前中心线与胸围线交点', pointEn: 'Front center line × Bust line' },
  { piece: '后片', pieceEn: 'Back', point: '后中心线与胸围线交点', pointEn: 'Back center line × Bust line' },
  { piece: '包边条', pieceEn: 'Binding', point: '以长度方向中心为基准', pointEn: 'Center of length direction' },
]

// 用料计算（M 码为基准）— 双语
export const materialUsage = {
  fabric: {
    name: '主面料',
    nameEn: 'Main Fabric',
    type: '棉氨纶平纹针织布 95/5',
    typeEn: 'Cotton-Spandex Single Jersey 95/5',
    width: '160cm',
    unitLength: 0.85,
    shrinkage: '5%',
    wasteRate: '5%',
    usageBySize: {
      'S': 0.85,
      'M': 0.90,
      'L': 0.95,
      'XL': 1.00,
      'XXL': 1.05,
    }
  },
  lining: {
    name: '包边条用料',
    nameEn: 'Binding Strip',
    type: '同面料或撞色针织布',
    typeEn: 'Same or contrast knit',
    width: '160cm',
    unitLength: 0.15,
  },
  accessories: [
    { name: '缝纫线', nameEn: 'Sewing Thread', spec: '60S/2 涤纶', specEn: '60S/2 Polyester', quantity: 80, unit: '米' },
    { name: '包缝线', nameEn: 'Overlock Thread', spec: '40S/2 涤纶', specEn: '40S/2 Polyester', quantity: 60, unit: '米' },
    { name: '尺码标', nameEn: 'Size Label', spec: 'woven 标', specEn: 'woven label', quantity: 1, unit: '枚' },
    { name: '洗水标', nameEn: 'Care Label', spec: '成分+保养', specEn: 'Composition + care', quantity: 1, unit: '枚' },
  ],
  cuttingLayout: {
    fabricWidth: 160,
    fabricLength: 85,
    pieces: [
      { name: '前片×1', nameEn: 'Front×1', x: 5, y: 5, w: 60, h: 55, color: '#E8804A' },
      { name: '后片×1', nameEn: 'Back×1', x: 70, y: 5, w: 62, h: 56, color: '#5B9BD5' },
      { name: '领口包边×1', nameEn: 'Neck bind×1', x: 5, y: 65, w: 45, h: 8, color: '#9B59B6' },
      { name: '袖窿包边×2', nameEn: 'Armhole bind×2', x: 55, y: 65, w: 30, h: 8, color: '#70AD47' },
      { name: '下摆包边×1', nameEn: 'Hem bind×1', x: 90, y: 65, w: 45, h: 8, color: '#F39C12' },
    ]
  }
}

// 缝制工序 — 双语
export const sewingSteps = [
  { step: 1, name: '合肩缝', nameEn: 'Join Shoulder Seams', desc: '前后片肩线四线包缝缝合', descEn: 'Overlock front and back shoulder seams', time: '3min' },
  { step: 2, name: '领口包边', nameEn: 'Bind Neckline', desc: '领口包边条对折，绷缝固定，注意拉伸均匀', descEn: 'Fold binding, cover-stitch neckline evenly', time: '5min' },
  { step: 3, name: '袖窿包边', nameEn: 'Bind Armholes', desc: '左右袖窿包边条对折，绷缝固定', descEn: 'Fold and cover-stitch both armhole bindings', time: '6min' },
  { step: 4, name: '合侧缝', nameEn: 'Join Side Seams', desc: '前后片侧缝四线包缝缝合', descEn: 'Overlock side seams of front and back', time: '4min' },
  { step: 5, name: '下摆包边', nameEn: 'Bind Hem', desc: '下摆包边条对折，绷缝固定', descEn: 'Fold binding, cover-stitch hem evenly', time: '4min' },
  { step: 6, name: '整烫', nameEn: 'Press & Finish', desc: '成品整体熨烫整理，注意针织面料低温熨烫', descEn: 'Press finished vest, use low heat for knit', time: '3min' },
]

// 新手教程数据 — 双语
export const tutorialSections = [
  {
    id: 'intro',
    title: '什么是纸样？',
    titleEn: 'What is a Pattern?',
    icon: '📖',
    content: '纸样（Pattern）是服装裁剪的模板。把纸样铺在面料上，沿着边缘裁剪，就能得到衣服的各个部件。就像拼图的模板一样，照着裁、照着缝，就能做出一件完整的衣服。',
    contentEn: 'A pattern is the template for cutting fabric. Place it on fabric, cut along the edges, and you get all the pieces of a garment. Think of it as puzzle templates — cut and sew following them to create a complete garment.',
    tips: [
      '纸样上的每条线、每个点都有含义，不用怕，我们逐一讲解',
      'A beginner-friendly guide to every line and point on the pattern',
    ]
  },
  {
    id: 'lines',
    title: '认识纸样上的线',
    titleEn: 'Understanding Pattern Lines',
    icon: '📏',
    lines: [
      { name: '轮廓线 / Outline', desc: '最粗的线，沿着它裁剪面料', descEn: 'The thickest line — cut fabric along it', color: '#E8804A' },
      { name: '布纹线 / Grain Line', desc: '箭头线，表示面料的经向方向（与布边平行）', descEn: 'Arrow line showing fabric lengthwise direction (parallel to selvage)', color: '#6C5CE7' },
      { name: '对折线 / Fold Line', desc: '双线标记，表示此处对齐面料折叠边', descEn: 'Double line — align with folded edge of fabric', color: '#00CEC9' },
      { name: '缝份 / Seam Allowance', desc: '轮廓线外的留白区域，用于缝合（本款已含1cm缝份）', descEn: 'Area beyond outline for sewing (1cm included)', color: '#FDCB6E' },
      { name: '参考线 / Reference Lines', desc: '细虚线，标注胸围线、腰围线等关键位置', descEn: 'Fine dashed lines marking bust, waist, etc.', color: '#B2BEC3' },
    ]
  },
  {
    id: 'points',
    title: '认识关键点位',
    titleEn: 'Key Points on the Pattern',
    icon: '📍',
    points: [
      { label: 'A/B 肩点', labelEn: 'A/B Shoulder Points', desc: '前后片肩线缝合的对位点', descEn: 'Matching points for shoulder seam' },
      { label: 'C/D 袖窿点', labelEn: 'C/D Armhole Points', desc: '袖窿包边起止位置', descEn: 'Start/end points for armhole binding' },
      { label: 'E/G 侧缝点', labelEn: 'E/G Side Seam Points', desc: '前后片侧缝缝合的对位点', descEn: 'Matching points for side seam' },
      { label: 'Q/R 包边起止', labelEn: 'Q/R Binding Start/End', desc: '包边条的起点和终点标记', descEn: 'Start and end marks on binding strips' },
    ]
  },
  {
    id: 'symbols',
    title: '常见符号说明',
    titleEn: 'Common Symbols',
    icon: '🔤',
    symbols: [
      { symbol: '→', name: '布纹箭头 / Grain Arrow', desc: '箭头方向须与面料经纱方向一致', descEn: 'Arrow must align with fabric grain' },
      { symbol: '◆', name: '对位标记 / Notch', desc: '三角或菱形缺口，缝合时两片需对齐', descEn: 'Triangle/diamond mark for matching pieces' },
      { symbol: '×', name: '交叉点 / Intersection', desc: '两条线的交点，通常是关键尺寸位置', descEn: 'Where two lines meet — key measurement point' },
      { symbol: '═', name: '对折线 / Fold Line', desc: '此处放在面料折叠边上裁剪', descEn: 'Place on folded edge of fabric' },
    ]
  },
  {
    id: 'steps',
    title: '从纸样到成衣：6步流程',
    titleEn: 'From Pattern to Garment: 6 Steps',
    icon: '✂️',
    steps: [
      { step: 1, title: '准备面料', titleEn: 'Prepare Fabric', desc: '将针织面料平铺，预处理（预缩水），待完全干透', descEn: 'Lay flat, pre-shrink, let dry completely' },
      { step: 2, title: '排料裁剪', titleEn: 'Lay Out & Cut', desc: '打印纸样（1:1比例），按布纹方向铺在面料上，沿轮廓线裁剪', descEn: 'Print pattern at 1:1, align grain, cut along outline' },
      { step: 3, title: '合肩缝', titleEn: 'Join Shoulders', desc: '前后片正面相对，肩线四线包缝缝合', descEn: 'Right sides together, overlock shoulders' },
      { step: 4, title: '包边处理', titleEn: 'Apply Bindings', desc: '依次将领口、袖窿、下摆包边条绷缝固定', descEn: 'Cover-stitch neckline, armholes, hem bindings' },
      { step: 5, title: '合侧缝', titleEn: 'Join Sides', desc: '前后片侧缝四线包缝缝合', descEn: 'Overlock side seams' },
      { step: 6, title: '整烫完成', titleEn: 'Press & Done', desc: '低温熨烫整理，完成成衣', descEn: 'Press with low heat, finished!' },
    ]
  },
  {
    id: 'tips',
    title: '新手避坑指南',
    titleEn: 'Beginner Tips & Pitfalls',
    icon: '💡',
    tips: [
      { title: '打印比例要对', titleEn: 'Check Print Scale', desc: '打印时务必选择「实际大小 / 100%」，不要缩放。打印后用尺子量一下图纸上的标尺，确认1cm=1cm。', descEn: 'Always print at 100% scale. Measure the ruler on paper to confirm 1cm=1cm.' },
      { title: '布纹方向不能错', titleEn: 'Grain Direction Matters', desc: '纸样上的箭头必须与面料经纱方向（布边方向）平行。方向错了衣服会歪斜变形。', descEn: 'Pattern arrow must be parallel to fabric selvage. Wrong direction = twisted garment.' },
      { title: '针织面料要预缩', titleEn: 'Pre-shrink Knits', desc: '针织面料缩水率高（3-5%），裁剪前必须先洗涤预缩、晾干。', descEn: 'Knits shrink 3-5%. Always pre-wash and dry before cutting.' },
      { title: '包边拉伸要均匀', titleEn: 'Stretch Bindings Evenly', desc: '包边时不要过度拉伸，否则会起波浪。微微拉伸即可，让包边条自然贴合领口弧线。', descEn: 'Don\'t overstretch bindings or edges will wave. Stretch slightly to follow curves.' },
      { title: '缝纫机针选对', titleEn: 'Use the Right Needle', desc: '针织面料用「圆头针 / Jersey Needle」 size 70-80，不要用尖头针，否则会扎断针织线圈。', descEn: 'Use ballpoint/jersey needle size 70-80 for knits. Sharp needles break knit loops.' },
    ]
  },
]

// 尺寸调整工具函数（同前，略作调整以适配新数据结构）
export function recommendSize(userBody) {
  const { rows, sizes } = bodyMeasurements
  let bestSize = gradingRules.baseSize
  let minDiff = Infinity
  const diffs = {}

  for (let s = 0; s < sizes.length; s++) {
    let totalDiff = 0
    for (const row of rows) {
      const userVal = userBody[row.name]
      if (userVal != null) {
        totalDiff += Math.abs(userVal - row.values[s])
      }
    }
    if (totalDiff < minDiff) {
      minDiff = totalDiff
      bestSize = sizes[s]
    }
  }

  for (const row of rows) {
    const userVal = userBody[row.name]
    if (userVal != null) {
      const sizeIdx = sizes.indexOf(bestSize)
      diffs[row.name] = parseFloat((userVal - row.values[sizeIdx]).toFixed(1))
    }
  }

  return { bestSize, diffs }
}

export function calculateCustomGarmentSize(userBody) {
  const { bestSize, diffs } = recommendSize(userBody)
  const sizeIdx = sizeMeasurements.sizes.indexOf(bestSize)

  const customSizes = {}
  for (const row of sizeMeasurements.rows) {
    const baseVal = row.values[sizeIdx]
    const userDiff = diffs[row.name] || 0
    const adjustment = userDiff * 0.5
    customSizes[row.name] = parseFloat((baseVal + adjustment).toFixed(1))
  }

  return { bestSize, customSizes, diffs }
}
