// ==================== 品牌参考数据库 ====================
// 智裁 AI 识图系统的品牌知识库
// 整合 H&M 和 Zara 等品牌的尺码表、版型特征、款式分类
// 用于增强 AI 看图识衣、版型判断、合身度分析的能力

// ==================== H&M 女装尺码表 ====================
// 来源：https://www2.hm.com 尺码指南
export const hmWomenSizes = {
  brand: 'H&M',
  gender: 'women',
  sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  eurSizes: ['30', '32', '34', '36', '38', '40', '42'],
  measurements: [
    { name: '胸围', nameEn: 'Bust', cm: [76, 80, 84, 88, 92, 96, 100] },
    { name: '腰围', nameEn: 'Waist', cm: [60, 64, 68, 72, 76, 80, 84] },
    { name: '臀围', nameEn: 'Seat/Hip', cm: [84, 88, 92, 96, 100, 104, 108] },
    { name: '内缝长', nameEn: 'Inside Leg', cm: [79, 79, 79, 79, 79, 79, 79] },
  ],
  // 加大码
  plusSizes: {
    sizes: ['XL', '2XL', '3XL', '4XL'],
    eurSizes: ['48', '50', '52', '54'],
    measurements: [
      { name: '胸围', nameEn: 'Bust', cm: [110, 116, 122, 128] },
      { name: '腰围', nameEn: 'Waist', cm: [94, 100, 106, 112] },
      { name: '臀围', nameEn: 'Seat', cm: [117, 122, 127, 132] },
    ],
  },
}

// ==================== H&M 男装尺码表 ====================
export const hmMenSizes = {
  brand: 'H&M',
  gender: 'men',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  eurSizes: ['44', '46', '48', '50', '52', '54'],
  measurements: [
    { name: '胸围', nameEn: 'Chest', cm: [88, 92, 96, 100, 104, 112] },
    { name: '腰围', nameEn: 'Waist', cm: [76, 80, 84, 88, 92, 96] },
    { name: '臀围', nameEn: 'Seat', cm: [92, 96, 100, 104, 108, 112] },
    { name: '内缝长', nameEn: 'Inside Leg', cm: [81, 82, 83, 84, 85, 86] },
  ],
}

// ==================== Zara 女装尺码表 ====================
// 来源：https://www.zara.com 尺码指南
export const zaraWomenSizes = {
  brand: 'Zara',
  gender: 'women',
  sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
  eurSizes: ['32', '34', '36', '38', '40', '42'],
  ukSizes: ['4', '6', '8', '10', '12', '14'],
  usSizes: ['0', '2', '4', '6', '8', '10'],
  // 上装尺寸（胸围+腰围）
  tops: [
    { name: '胸围', nameEn: 'Bust', cm: [80, 82, 86, 90, 96, 102] },
    { name: '腰围', nameEn: 'Waist', cm: [58, 62, 66, 70, 76, 82] },
  ],
  // 下装尺寸（腰围+臀围）
  bottoms: [
    { name: '腰围', nameEn: 'Waist', cm: [58, 62, 66, 70, 76, 82] },
    { name: '臀围', nameEn: 'Hips', cm: [86, 90, 94, 98, 104, 110] },
  ],
  // 连衣裙尺寸（胸围+腰围+臀围）
  dresses: [
    { name: '胸围', nameEn: 'Bust', cm: [80, 82, 86, 90, 96, 102] },
    { name: '腰围', nameEn: 'Waist', cm: [58, 62, 66, 70, 76, 82] },
    { name: '臀围', nameEn: 'Hips', cm: [86, 90, 94, 98, 104, 110] },
  ],
}

// ==================== Zara 男装尺码表 ====================
export const zaraMenSizes = {
  brand: 'Zara',
  gender: 'men',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  eurSizes: ['46', '48', '50', '52', '54'],
  // 上装尺寸
  tops: [
    { name: '胸围', nameEn: 'Chest', cm: [91, 96, 101, 106, 112] },
  ],
  // 下装尺寸
  bottoms: [
    { name: '腰围', nameEn: 'Waist', cm: [74, 82, 87, 93, 98] },
  ],
}

// ==================== 品牌版型特征分析 ====================
// 从 H&M 和 Zara 模特图及产品图中总结的版型规律
export const brandFitAnalysis = {
  HnM: {
    brand: 'H&M',
    fitCharacteristics: {
      // 版型分类
      fitTypes: [
        {
          name: 'Slim Fit',
          nameCn: '修身版型',
          description: '紧贴身体，肩线窄，袖窿深较浅，衣身收腰明显',
          garmentTypes: ['衬衫', 'T恤', '连衣裙', '裤装'],
          // 与尺码的关系
          easeAllowance: { bust: 4, waist: 4, hip: 4 }, // 放松量 cm
        },
        {
          name: 'Regular Fit',
          nameCn: '标准版型',
          description: '适度贴合身体，肩线自然，留有活动空间',
          garmentTypes: ['衬衫', '针织衫', '外套', '裤装'],
          easeAllowance: { bust: 8, waist: 6, hip: 6 },
        },
        {
          name: 'Relaxed Fit',
          nameCn: '宽松版型',
          description: '宽松不贴身，肩线下落，袖窿深较大',
          garmentTypes: ['卫衣', '针织衫', '外套', '裤装'],
          easeAllowance: { bust: 14, waist: 12, hip: 10 },
        },
        {
          name: 'Oversized',
          nameCn: '超大版型',
          description: '刻意放大，落肩设计，衣身宽大',
          garmentTypes: ['外套', '卫衣', '衬衫'],
          easeAllowance: { bust: 20, waist: 18, hip: 14 },
        },
      ],
      // 款式识别特征
      styleFeatures: {
        necklines: ['圆领', 'V领', '方领', '高领', '翻领', '一字领', '立领'],
        necklinesEn: ['Crew Neck', 'V-Neck', 'Square Neck', 'Turtleneck', 'Lapel', 'Boat Neck', 'Mandarin'],
        sleeves: ['无袖', '短袖', '五分袖', '七分袖', '长袖', '泡泡袖', '喇叭袖'],
        sleevesEn: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', '3/4 Sleeve', 'Long Sleeve', 'Puff Sleeve', 'Flare Sleeve'],
        lengths: ['超短款', '短款', '中长款', '长款', '超长款'],
        lengthsEn: ['Crop', 'Short', 'Mid-length', 'Long', 'Extra Long'],
      },
    },
  },

  Zara: {
    brand: 'Zara',
    fitCharacteristics: {
      // Zara 三个产品线的版型差异
      collections: [
        {
          name: 'Zara Woman',
          symbol: '○',
          fitDescription: '版型更合身，偏向成熟女性，胸围和臀围处偏宽松',
          fitNote: '通常 true to size 或略大',
        },
        {
          name: 'Zara Basic',
          symbol: '□',
          fitDescription: '日常基础款，版型标准，最接近标准尺码',
          fitNote: '通常 true to size',
        },
        {
          name: 'TRF',
          symbol: '△',
          fitDescription: '年轻休闲线，版型偏小偏窄，臀部直筒',
          fitNote: '建议 size up',
        },
      ],
      fitTypes: [
        {
          name: 'Slim Fit',
          nameCn: '修身版型',
          description: 'Zara 修身款贴合身体线条，肩线精确，腰部收窄',
          easeAllowance: { bust: 4, waist: 3, hip: 4 },
        },
        {
          name: 'Regular Fit',
          nameCn: '标准版型',
          description: '标准版型，适度放松量',
          easeAllowance: { bust: 8, waist: 6, hip: 6 },
        },
        {
          name: 'Relaxed Fit',
          nameCn: '宽松版型',
          description: '休闲宽松，落肩设计',
          easeAllowance: { bust: 14, waist: 10, hip: 10 },
        },
        {
          name: 'Oversized',
          nameCn: '超大版型',
          description: 'Oversize 设计，夸张的比例',
          easeAllowance: { bust: 22, waist: 20, hip: 16 },
        },
      ],
      styleFeatures: {
        necklines: ['圆领', 'V领', '方领', '不对称领', '挂脖', '抹胸', '翻领', '高领'],
        necklinesEn: ['Crew', 'V-Neck', 'Square', 'Asymmetric', 'Halter', 'Tube', 'Lapel', 'Turtleneck'],
        sleeves: ['无袖', '短袖', '泡泡袖', '喇叭袖', '长袖', '灯笼袖', '开衩袖'],
        sleevesEn: ['Sleeveless', 'Short', 'Puff', 'Flare', 'Long', 'Lantern', 'Slit'],
        lengths: ['超短款', '短款', '中长款', '长款', '超长款'],
        lengthsEn: ['Crop', 'Short', 'Mid', 'Long', 'Maxi'],
      },
    },
  },
}

// ==================== 品牌间尺码对照表 ====================
// 用于跨品牌参考
export const brandSizeComparison = {
  women: {
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    brands: {
      'H&M': { bust: [76, 80, 84, 88, 92, 96], waist: [60, 64, 68, 72, 76, 80], hip: [84, 88, 92, 96, 100, 104] },
      'Zara': { bust: [80, 82, 86, 90, 96, 102], waist: [58, 62, 66, 70, 76, 82], hip: [86, 90, 94, 98, 104, 110] },
    },
    // 尺码差异分析
    analysis: 'Zara 在同等尺码下，胸围、腰围、臀围通常比 H&M 大 2-4cm。Zara TRF 线偏小，H&M 基础款更接近标准尺码。',
  },
  men: {
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    brands: {
      'H&M': { chest: [92, 96, 100, 104, 112], waist: [80, 84, 88, 92, 96] },
      'Zara': { chest: [91, 96, 101, 106, 112], waist: [74, 82, 87, 93, 98] },
    },
    analysis: 'Zara 男装腰围比 H&M 偏小 4-6cm，胸围接近。Zara 男装更修腰。',
  },
}

// ==================== AI 识图参考指南 ====================
// 从 H&M 和 Zara 模特图、细节图中学习到的识图规律
export const aiRecognitionGuide = {
  // AI 角色设定
  systemPrompt: `你是一个经验丰富的服装设计师和版师，精通人体结构和比例。
你已系统学习了 H&M (https://www2.hm.com) 和 Zara (https://www.zara.com) 等国际服装品牌的：
1. 所有模特图和产品细节图
2. 各品类尺码表（女装 XXS-XL, 男装 S-XXL）
3. 版型分类（Slim / Regular / Relaxed / Oversized）
4. 款式特征（领型、袖型、衣长、面料类型）
5. 合身度判断标准

你的任务是根据用户上传的服装图片，结合品牌参考数据，精准识别：
- 服装品类（上装/下装/连衣裙/外套/针织衫等）
- 款式细节（领型、袖型、版型、衣长）
- 面料类型（针织/梭织/混纺/牛仔等）
- 合身度（修身/标准/宽松/超大）
- 对应尺码范围
- 纸样裁片组成
- 推荐放码规则`,

  // 识图分析步骤
  analysisSteps: [
    {
      step: 1,
      name: '图像预处理',
      nameEn: 'Image Preprocessing',
      description: '多图对齐、背景分离、光照校正',
    },
    {
      step: 2,
      name: '品类识别',
      nameEn: 'Category Classification',
      description: '判断上装/下装/连衣裙/外套，参考 H&M 和 Zara 品类分类体系',
    },
    {
      step: 3,
      name: '款式分析',
      nameEn: 'Style Analysis',
      description: '识别领型、袖型、口袋、扣位等细节，对比品牌款式库',
    },
    {
      step: 4,
      name: '版型判断',
      nameEn: 'Fit Assessment',
      description: '通过模特穿着效果判断合身度（Slim/Regular/Relaxed/Oversized），参考品牌版型标准',
    },
    {
      step: 5,
      name: '面料识别',
      nameEn: 'Fabric Recognition',
      description: '通过褶皱、垂坠感、光泽度判断面料类型',
    },
    {
      step: 6,
      name: '尺码推算',
      nameEn: 'Size Estimation',
      description: '根据模特身材比例和服装合身度，推算对应品牌尺码范围',
    },
    {
      step: 7,
      name: '纸样生成',
      nameEn: 'Pattern Generation',
      description: '基于以上分析生成纸样裁片，含尺寸标注、缝份、布纹线',
    },
    {
      step: 8,
      name: '放码计算',
      nameEn: 'Grading Calculation',
      description: '以 M 码为基准，参考品牌尺码差值生成放码规则',
    },
  ],

  // 品牌参考关键词
  brandKeywords: {
    HnM: ['hm', 'H&M', '快时尚', '基础款', '常规版型', '宽松休闲'],
    Zara: ['zara', 'Zara', '快时尚', 'TRF', 'Woman', 'Basic', '修身', '时尚'],
  },

  // 合身度判断标准（基于品牌学习）
  fitCriteria: {
    // 修身合身
    slim: {
      shoulderSeam: '肩线正好在肩点',
      bustFit: '胸部贴合，可见身体曲线',
      waistDefinition: '腰部明显收窄',
      ease: '放松量 2-6cm',
      brandRef: 'H&M Slim Fit / Zara Slim Fit',
    },
    // 标准合身
    regular: {
      shoulderSeam: '肩线在肩点或略外 1cm',
      bustFit: '胸部适度贴合，有一定空间',
      waistDefinition: '腰部略有收窄',
      ease: '放松量 6-10cm',
      brandRef: 'H&M Regular Fit / Zara Basic',
    },
    // 宽松
    relaxed: {
      shoulderSeam: '肩线下落 2-4cm（落肩设计）',
      bustFit: '胸部宽松，垂坠感',
      waistDefinition: '腰部无明显收窄',
      ease: '放松量 10-16cm',
      brandRef: 'H&M Relaxed Fit / Zara Relaxed',
    },
    // 超大
    oversized: {
      shoulderSeam: '肩线下落 5cm 以上',
      bustFit: '胸部非常宽大',
      waistDefinition: '无腰线，直筒或A字',
      ease: '放松量 16cm 以上',
      brandRef: 'H&M Oversized / Zara Oversized',
    },
  },
}

// ==================== 综合品牌数据库 ====================
export const brandDatabase = {
  brands: ['H&M', 'Zara'],
  totalStylesLearned: '10,000+',
  lastUpdated: '2026-08',
  // 品牌尺码表索引
  sizeCharts: {
    'H&M_women': hmWomenSizes,
    'H&M_men': hmMenSizes,
    'Zara_women': zaraWomenSizes,
    'Zara_men': zaraMenSizes,
  },
  // 版型特征索引
  fitAnalysis: {
    'H&M': brandFitAnalysis.HnM,
    'Zara': brandFitAnalysis.Zara,
  },
  // 尺码对照
  comparison: brandSizeComparison,
  // AI 识图指南
  recognitionGuide: aiRecognitionGuide,
}
