// 学习手册数据 — 双语
// 融合《服装制作基础事典》(郑淑玲著) 与 丸山晴美《服装版型研究室》系列内容
// 上衣篇 / 裙子篇 / 裤子篇 / 洋装篇

export const learningManual = {
  title: '服装制作学习手册',
  titleEn: 'Garment Making Learning Manual',
  subtitle: '从入门到打版的完整指南',
  subtitleEn: 'A Complete Guide from Basics to Pattern Drafting',
  chapters: [
    // ==================== 1. 服装制作入门 ====================
    {
      id: 'getting-started',
      title: '服装制作入门',
      titleEn: 'Getting Started with Garment Making',
      icon: '🧵',
      description: '认识做衣服的基本工具、材料，并了解服装制作的十大步骤，为后续学习打下基础。',
      descriptionEn: 'Learn the essential tools, materials, and the ten core steps of garment construction to build a solid foundation.',
      sections: [
        {
          id: 'tools-materials',
          title: '基本工具与材料',
          titleEn: 'Essential Tools & Materials',
          content: '做衣服前，必须准备好基本工具与材料。常用工具包括：软尺（用于量身与量布）、直尺与弯尺（用于画直线与弧线）、剪刀（裁布专用，切勿剪纸张以免变钝）、珠针与珠针包（固定面料与纸样）、画粉或水消笔（在面料上做记号）、缝纫机（家用平缝机即可，后期可加包缝机）、熨斗与烫垫（整烫必备）。材料方面，需准备面料、里布、衬布、缝纫线、拉链或纽扣等辅料。新手建议从棉布、亚麻等易裁易缝的梭织面料入手，避开太滑或太弹的面料。所有工具应分类收纳、保持干燥，剪刀定期磨利，熨斗保持底板洁净，才能确保每道工序顺利完成。',
          contentEn: 'Before sewing, prepare essential tools: soft tape (for measuring body and fabric), straight and curved rulers (for lines and curves), fabric scissors (dedicated to fabric only to avoid dulling), pins and pincushion (for fixing fabric and patterns), chalk or water-erasable pen (for marking), sewing machine (a home lockstitch machine is enough; add an overlock later), iron and pressing pad (essential for pressing). Materials include fabric, lining, interfacing, thread, zippers or buttons. Beginners should start with easy-to-cut woven fabrics like cotton or linen, avoiding slippery or overly stretchy materials. Keep tools sorted and dry, sharpen scissors regularly, and keep the iron soleplate clean.',
          tips: [
            '剪刀分两把：一把专剪布料，一把剪纸样，混用会让布剪很快变钝',
            'Use two pairs of scissors: one for fabric, one for paper. Mixing them dulls fabric scissors quickly',
            '缝纫线选涤纶线，强度高且不易断，颜色尽量与面料接近',
            'Choose polyester thread for strength; match the color closely to your fabric',
          ]
        },
        {
          id: 'ten-steps',
          title: '服装制作十大步骤',
          titleEn: 'Ten Steps of Garment Construction',
          content: '解构服装制作的十大步骤，能帮助新手建立完整的制作流程观念。第一步：确定款式与尺寸，画出或选定纸样。第二步：选择合适的面料与辅料，并进行预缩水处理。第三步：将纸样按布纹方向排布在面料上，用珠针固定。第四步：沿轮廓线裁剪面料，并做好对位记号。第五步：在面料上做省道、褶子等结构记号。第六步：手缝假缝定型，确认合身后再正式车缝。第七步：按工序顺序车缝各部件，先合省、再合身片、最后接袖领。第八步：安装拉链、纽扣、口袋等辅料。第九步：整烫定型，使缝份平整、弧线服贴。第十步：试穿检查，必要时拆改重缝，完成成品。每一步都不可跳过，尤其假缝与整烫决定了成品的精致度。',
          contentEn: 'Deconstructing garment making into ten steps helps beginners build a complete workflow. Step 1: Finalize style and size, draft or select the pattern. Step 2: Choose fabric and notions, pre-shrink the fabric. Step 3: Lay out pattern following grain direction, pin in place. Step 4: Cut along the outline, mark notches. Step 5: Mark darts and pleats. Step 6: Hand-baste to check fit before machine sewing. Step 7: Machine-sew in order — darts first, then body panels, then sleeves and collar. Step 8: Install zippers, buttons, pockets. Step 9: Press to set seams flat and curves smooth. Step 10: Try on, alter if needed, finish the garment. Never skip steps — basting and pressing are what make a garment look professional.',
          tips: [
            '假缝（basting）看似费时，却是检验版型合身度的关键，新手切勿省略',
            'Basting seems time-consuming but is the key to checking fit — never skip it',
            '整烫贯穿全程，不是最后才做，每缝完一条缝就立刻烫开缝份',
            'Press throughout the process, not just at the end. Press each seam open right after sewing',
          ]
        }
      ]
    },

    // ==================== 2. 量身方法 ====================
    {
      id: 'body-measuring',
      title: '量身方法',
      titleEn: 'Body Measuring Methods',
      icon: '📏',
      description: '掌握周围量法、宽度量法与长度量法三大类量身技巧，是打版制图的数据基础。',
      descriptionEn: 'Master the three measuring methods — circumference, width, and length — the data foundation for pattern drafting.',
      sections: [
        {
          id: 'circumference',
          title: '周围量法',
          titleEn: 'Circumference Measurement',
          content: '周围量法用于量取身体各部位的围度，是决定衣服宽松度与合身度的关键。量时被量者需站直、自然呼吸、穿贴身薄衣。主要围度包括：胸围（经胸部最丰满处水平环绕一周）、腰围（腰部最细处水平环绕，可弯腰侧身找到位置）、臀围（臀部最丰满处水平环绕）、腹围（腰围与臀围之间，腹部突出处）、领围（脖颈根部环绕一周，可加一指松量）、腕围与掌围（袖口与袖开口设计依据）。量胸围时软尺要保持水平，不可过紧或过松，以能插入一指为宜。围度数据通常用于制图时除以4或除以2，因此在量取时就应力求准确，误差控制在0.5cm以内。',
          contentEn: 'Circumference measurement captures body girths, key to garment ease and fit. The subject should stand straight, breathe naturally, in fitted thin clothing. Key girths: bust (around fullest part of chest, level), waist (around narrowest part — bend sideways to locate), hips (around fullest part), abdomen (between waist and hip at the protruding point), neck (around base of neck, plus one-finger ease), wrist and palm (for cuffs and sleeve openings). Keep the tape level and snug enough to insert one finger. Circumference data is often divided by 4 or 2 in drafting, so measure accurately within 0.5cm tolerance.',
          tips: [
            '量胸围时，软尺背后请他人帮忙扶正，自己量容易歪斜不准',
            'When measuring bust, have someone hold the tape level at the back — self-measuring is inaccurate',
            '腰围位置因人而异，弯腰侧身凸起的折痕处即为自然腰线',
            'Waist location varies by person — the crease when bending sideways marks the natural waistline',
          ]
        },
        {
          id: 'width',
          title: '宽度量法',
          titleEn: 'Width Measurement',
          content: '宽度量法用于量取身体各部位的宽度，是绘制身片与袖片轮廓的重要依据。主要宽度包括：肩宽（左右肩点之间的距离，从背后量取更准确）、背宽（后背两侧腋窝点之间的水平距离，决定后片宽度）、胸宽（前胸两侧腋窝点之间的水平距离，决定前片宽度）、乳间距（左右胸点之间的距离，用于确定省道位置）、颈宽（脖子根部左右两侧的宽度，用于绘制领口）。量肩宽时需找到肩点（肩关节外侧骨骼突出处），软尺沿后背水平量取。背宽与胸宽通常比围度更能反映体型特征，尤其对驼背或挺胸体型尤为重要，制图时常以背宽与胸宽作为校核基准。',
          contentEn: 'Width measurement captures the breadth of body parts, essential for outlining body and sleeve blocks. Key widths: shoulder (between left and right shoulder points, measured from the back), back width (between armpits across the back), chest width (between armpits across the front), bust point spacing (between left and right bust points, for dart placement), neck width (across the base of the neck, for neckline drafting). Locate the shoulder point (the protruding joint bone) and measure horizontally across the back. Back and chest widths better reflect body type than girths alone — especially for round-shouldered or prominent-chest figures — and are used to verify draft accuracy.',
          tips: [
            '肩点在肩关节外侧骨头凸起处，手臂抬起时可摸到凹陷，即为肩点',
            'The shoulder point is the bony protrusion at the shoulder joint; raising the arm reveals a dip at that spot',
            '背宽与胸宽数据要分别记录，二者差异影响前后片的松量分配',
            'Record back and chest widths separately; their difference affects ease distribution between front and back',
          ]
        },
        {
          id: 'length',
          title: '长度量法',
          titleEn: 'Length Measurement',
          content: '长度量法用于量取身体各部位的纵向与斜向长度，决定衣长、袖长、裙长与裤长。主要长度包括：衣长（从后颈点即第七颈椎，垂直量至所需下摆位置）、背长（后颈点至腰围线的垂直距离，是绘制原型版的核心数据）、袖长（肩点经手肘至手腕的长度，量时手臂微弯）、裙长（腰围线量至所需裙摆位置）、裤长（腰围线量至脚踝或所需位置）、立裆长（腰围线量至大腿根部坐下时的坐深）、股下长（裆底至脚踝的长度）。量背长时被量者需自然站直，软尺贴后背垂直下垂。立裆需坐下量取，因站立与坐姿数据不同，坐姿数据更贴合裤装穿着实际。所有长度数据建议量两次取平均值，避免单次误差。',
          contentEn: 'Length measurement captures vertical and diagonal dimensions, determining garment, sleeve, skirt, and pants lengths. Key lengths: garment length (from back neck point — the 7th cervical — down to desired hem), back length (back neck to waistline, a core block-drafting datum), sleeve length (shoulder point through elbow to wrist, arm slightly bent), skirt length (waistline to desired hem), pants length (waistline to ankle or desired point), rise (waistline to crotch root, measured seated), inseam (crotch to ankle). For back length, stand naturally with tape flat against the back. Measure rise seated, as seated data better reflects pants-wearing reality. Measure twice and average to reduce error.',
          tips: [
            '后颈点即低头时脖子后面最突出的骨头，是衣长与背长的起点',
            'The back neck point is the most prominent bone at the back of the neck when looking down — it is the start of garment and back length',
            '量袖长时手臂要微弯呈自然放松姿态，伸直量会偏短',
            'Bend the arm slightly when measuring sleeve length; a straight arm gives a too-short result',
          ]
        }
      ]
    },

    // ==================== 3. 纸型识读 ====================
    {
      id: 'pattern-reading',
      title: '纸型识读',
      titleEn: 'Reading Pattern Drafts',
      icon: '📐',
      description: '学习制图符号、人体部位对应与纸型说明，快速看懂任何纸型与制图。',
      descriptionEn: 'Learn drafting symbols, body-part correspondences, and pattern notes to quickly read any pattern.',
      sections: [
        {
          id: 'drafting-symbols',
          title: '制图符号',
          titleEn: 'Drafting Symbols',
          content: '制图符号是纸型与制图的通用语言，看懂符号才能正确打版与裁剪。常见符号包括：粗实线（轮廓线，沿此裁剪）、细实线（制图辅助线，如尺寸基准线）、虚线（对折线或假缝线）、点划线（布纹线，箭头方向须与面料经纱平行）、折线（折叠或翻折线，如腰头对折）、十字线或圆点（对位记号，缝合时两片需对齐）、三角形缺口（合印记号，又称刀眼，剪在布边用于对位）、波浪线（缩缝或抽褶区域）、双箭头（此处需抽褶或捏褶）。此外还有尺寸标注（如数字加cm单位）、角度符号（如直角标记）、以及袖山弧线、领弧线等特定曲线名称。新手应先熟记点划线与对位记号，这两类符号出错会直接导致缝合错位。',
          contentEn: 'Drafting symbols are the universal language of patterns. Common symbols: thick solid line (outline — cut along it), thin solid line (construction guide, e.g., datum lines), dashed line (fold or basting line), dot-dash line (grain line — arrow must be parallel to fabric length), fold line (fold or turn, e.g., waistband fold), cross or dot (match mark — align pieces when sewing), triangular notch (clip in fabric edge for matching), wavy line (ease or gather zone), double arrow (gather or pleat here). Also: dimensions with cm, right-angle marks, and named curves like sleeve cap and neckline curves. Beginners should first memorize the grain line and match marks — errors here cause sewing misalignment.',
          tips: [
            '刀眼（notch）剪成三角形小口，深度不超过0.3cm，太深会伤及缝份',
            'Notches are small triangular clips, no deeper than 0.3cm — deeper cuts damage the seam allowance',
            '布纹线箭头方向错了，做出来的衣服会扭曲变形，裁布前务必核对',
            'A wrong grain-line direction twists the finished garment — always verify before cutting',
          ]
        },
        {
          id: 'body-parts',
          title: '人体部位对应',
          titleEn: 'Body-Part Correspondence',
          content: '纸型上的每条线与每个点都对应人体某个部位，理解对应关系才能正确制图与修正版型。前中线对应人体前正中（胸骨至肚脐连线），后中线对应脊柱。胸围线对应胸部最丰满处水平环绕一周，是上装制图的核心基准线。腰围线对应腰部最细处，是上下装分界。臀围线对应臀部最丰满处，裙裤制图的关键。肩线对应肩点连线，肩点对应肩关节外侧。袖窿对应腋窝围绕手臂根部的弧线，前袖窿较直、后袖窿较弯。领口线对应脖子根部环绕一周，前领口深于后领口。袖山对应肩部到手臂的圆弧过渡。省道尖点指向胸点或臀突，作用是让平面布料贴合身体立体曲线。理解这些对应，才能根据体型调整各线位置。',
          contentEn: 'Every line and point on a pattern corresponds to a body part. Front center line — body front center (sternum to navel). Back center line — spine. Bust line — fullest chest circumference, the core datum for tops. Waist line — narrowest waist, the top/bottom boundary. Hip line — fullest hip, key for skirts and pants. Shoulder line — between shoulder points; shoulder point — outer shoulder joint. Armhole — curve around the armpit and arm root; front armhole is straighter, back armhole more curved. Neckline — around the neck base; front neckline is deeper than back. Sleeve cap — the curved transition from shoulder to arm. Dart tips point to bust or hip prominence, making flat fabric conform to body curves. Understanding these lets you adjust lines for different body types.',
          tips: [
            '省道尖点要距离胸点1-2cm，不要直接戳到胸点，否则会顶出尖角',
            'Dart tips should be 1-2cm away from the bust point, not directly on it, to avoid a peaked point',
            '前袖窿比后袖窿直，因为手臂前摆活动多于后摆，前需留更多活动量',
            'The front armhole is straighter than the back — the arm swings forward more than back, needing more ease in front',
          ]
        },
        {
          id: 'pattern-notes',
          title: '纸型说明',
          titleEn: 'Pattern Notes & Instructions',
          content: '纸型上除了线条与符号，还有文字说明，指导裁剪与缝制。常见说明包括：裁片名称（如前片、后片、领片、袖片）、裁剪数量（如前片×1对折裁、袖片×2）、面料方向（如「布纹线平行」「对折裁」）、缝份说明（如「已含1cm缝份」「未含缝份需另加」）、对位点（如「A对A」「肩点对肩点」）、缝制顺序（如「先合省再合身」）。此外，专业纸型会标注尺寸码号、胸围腰围数据、放码基准点。看纸型时第一步先看裁片清单与裁剪数量，第二步确认缝份是否包含，第三步核对布纹线方向，第四步检查对位记号，第五步阅读缝制顺序说明。养成系统化识读习惯，能大幅减少裁剪与缝制错误。',
          contentEn: 'Beyond lines and symbols, patterns carry text instructions. Common notes: piece names (front, back, collar, sleeve), cut quantities (front ×1 on fold, sleeve ×2), grain direction (parallel to grain line, cut on fold), seam allowance notes (1cm included, or add your own), match points (A to A, shoulder to shoulder), sewing order (darts first, then body). Professional patterns also mark size, bust/waist data, and grading pivot points. Read a pattern systematically: 1) piece list and cut quantities, 2) seam allowance inclusion, 3) grain direction, 4) match marks, 5) sewing order. This systematic reading greatly reduces cutting and sewing errors.',
          tips: [
            '裁剪数量要仔细看，有的裁片需要对折裁只裁一片，有的需裁两片（左右对称）',
            'Check cut quantities carefully — some pieces are cut on fold (one piece), others cut twice (left and right)',
            '缝份是否包含是新手最易忽略的，务必先确认再裁布，否则尺寸会全部偏小',
            'Whether seam allowance is included is the most overlooked detail — confirm before cutting, or everything comes out too small',
          ]
        }
      ]
    },

    // ==================== 4. 手缝技法 ====================
    {
      id: 'hand-sewing',
      title: '手缝技法',
      titleEn: 'Hand Sewing Techniques',
      icon: '🪡',
      description: '掌握平针缝、回针缝、假缝、实缝与纽扣缝等基础手缝技法，是车缝前定型的关键。',
      descriptionEn: 'Master running stitch, back stitch, basting, permanent stitching, and button sewing — the foundation before machine sewing.',
      sections: [
        {
          id: 'running-stitch',
          title: '平针缝与回针缝',
          titleEn: 'Running Stitch & Back Stitch',
          content: '平针缝是最基础的手缝针法，针脚一上一下等距前进，速度快但强度低，常用于假缝、抽褶、缝合装饰部位。操作时左手持布，右手持针，针尖垂直刺入布面再穿出，每针长约0.3至0.5cm，保持间距均匀。抽褶时用双线平针缝，拉紧线即可均匀收皱。回针缝强度接近车缝，每缝一针后退回前一针的出针点再前刺，形成连续无缝的线迹，适合缝合受力部位、加固缝份、手缝拉链头。回针的针脚比平针紧密，每针长约0.2至0.3cm。两种针法都要保持线松紧适度，过紧会让布面起皱，过松则失去固定作用。手缝线建议用单股绣花线或对折的缝纫线，便于穿针。',
          contentEn: 'The running stitch is the most basic hand stitch — up and down in equal steps. Fast but low-strength; used for basting, gathering, and decorative seams. Hold fabric in the left hand, needle in the right; pierce vertically through the fabric, each stitch 0.3–0.5cm with even spacing. For gathering, use double thread and pull to gather evenly. The back stitch is nearly as strong as machine sewing — sew one stitch, then go back to the previous exit point before moving forward, forming a continuous seam. Good for stress-bearing seams, reinforcing allowances, and hand-sewing zipper stops. Back stitches are tighter, 0.2–0.3cm each. Keep thread tension moderate — too tight puckers the fabric, too loose loses grip. Use single embroidery thread or doubled sewing thread for easier threading.',
          tips: [
            '平针缝抽褶时，先在缝线起点打结固定，拉线时两手交替均匀拉',
            'When gathering with running stitch, knot the starting end, then pull evenly with alternating hands',
            '回针缝可替代车缝，适合在没有缝纫机时临时加固受力部位',
            'The back stitch can substitute for machine sewing — use it to reinforce stress points when no machine is available',
          ]
        },
        {
          id: 'basting',
          title: '假缝技法',
          titleEn: 'Basting Techniques',
          content: '假缝是用平针缝临时固定面料或纸样的技法，目的是在正式车缝前先确认位置与合身度。常见假缝包括：定位假缝（用对比色线，将两片布料对齐对位记号后临时缝合，便于车缝时不移位）、合身假缝（将裁好的衣片假缝成半成品，试穿检查合身度，发现问题后拆线修改）、缩缝假缝（在袖山、领弧等需要缩缝的部位，用双线平针缝后抽紧，使弧线贴合）、贴边假缝（将领口、袖窿贴边假缝固定，再正式车缝）。假缝线要选与面料对比的颜色，便于拆除后不留痕迹。针脚不必太密，约1至2cm一针即可，关键是对位准确。所有假缝在正式车缝完成后都要拆除，不可留在成品内。',
          contentEn: 'Basting uses running stitch to temporarily fix fabric or pattern pieces — to confirm position and fit before final sewing. Common basting: positioning basting (contrast-color thread to align pieces at match marks so they do not shift while machine-sewing), fitting basting (baste pieces into a half-finished garment, try on, alter as needed), ease basting (double-thread running stitch on sleeve caps or curves, then pull to ease the curve in), facing basting (baste neckline or armhole facings before final stitching). Use contrast thread so it is easy to remove without a trace. Stitches need not be dense — about 1–2cm each is enough; accuracy of matching is what matters. All basting is removed after final sewing and never left in the finished garment.',
          tips: [
            '假缝线用白色或浅色对比线，拆除后不留色痕；深色面料可用红色线',
            'Use white or light contrast thread for basting — leaves no color trace; use red on dark fabrics',
            '袖山缩缝假缝要分两道线，间距0.5cm，两道同时拉紧更易均匀缩皱',
            'Sleeve-cap ease basting uses two parallel rows 0.5cm apart — pulling both makes even gathers easier',
          ]
        },
        {
          id: 'permanent-button',
          title: '实缝与纽扣缝',
          titleEn: 'Permanent Stitch & Button Sewing',
          content: '实缝指用回针缝或斜针缝进行永久性手缝的针法，用于手缝下摆、贴边、暗扣、暗拉链等车缝不便处理的部位。斜针缝常用于下摆与贴边：针斜向刺入布面，每针挑起折边与面料各一两根纱线，针脚几乎不可见，正面不留线迹。下摆斜针缝要保持间距均匀约0.5cm一针，线松紧适中使下摆自然下垂不起皱。纽扣缝分两类：平扣（有脚扣与无脚扣）与暗扣。缝无脚扣时需在扣子与面料之间绕线形成「线脚」(柄)，使扣子有立体高度、扣眼不被压扁。线脚高度约等于面料厚度。缝扣时线穿双股，先在面料正面打结固定，缝数针后在线脚根部绕线加固，最后打结收尾。有脚扣直接穿过扣脚缝合即可。所有纽扣位置需先用画粉标记，确保左右对称。',
          contentEn: 'Permanent stitching uses back stitch or slip stitch for durable hand sewing — for hems, facings, invisible snaps, and invisible zippers where machine sewing is awkward. The slip stitch is common for hems and facings: insert the needle diagonally, catching a few threads of the fold and the garment each time — stitches are nearly invisible on the right side. Slip-stitch hems at about 0.5cm spacing with moderate tension so the hem hangs flat. Button sewing covers flat buttons (with or without shank) and covered buttons. For no-shank buttons, build a thread shank between button and fabric so the button stands off the surface and the buttonhole is not crushed — shank height roughly equals fabric thickness. Use doubled thread, knot on the right side, sew several passes, wrap the shank base to reinforce, knot to finish. Shank buttons sew directly through the shank. Mark all button positions with chalk first to ensure symmetry.',
          tips: [
            '缝无脚扣时，在扣子与布之间垫一根火柴棒或牙签，缝完抽出，自然形成线脚高度',
            'When sewing a flat button, place a matchstick or toothpick between button and fabric, remove after sewing — this naturally forms the shank height',
            '斜针缝下摆时，挑起的纱线越少正面越不可见，但太少又不牢固，每针挑2-3根纱线为宜',
            'In slip-stitching hems, fewer threads caught = more invisible, but too few is weak — aim for 2-3 threads per stitch',
          ]
        }
      ]
    },

    // ==================== 5. 车缝技巧 ====================
    {
      id: 'machine-sewing',
      title: '车缝技巧',
      titleEn: 'Machine Sewing Techniques',
      icon: '✂️',
      description: '掌握褶子、拉链、下摆、腰带、口袋、领子、接袖等各部位的车缝技巧。',
      descriptionEn: 'Master machine sewing of pleats, zippers, hems, waistbands, pockets, collars, and sleeves.',
      sections: [
        {
          id: 'pleats-zippers',
          title: '褶子与拉链车缝',
          titleEn: 'Pleats & Zippers',
          content: '褶子车缝要先精确定位折痕线，用画粉标记后手捏折痕对齐，珠针固定方向再车缝。常见褶型有刀褶（单向折叠）、箱褶（双向对称折叠）、暗褶（折痕隐藏在内）。车褶时沿折痕根部0.1cm处车一道线固定，注意褶子方向要全部一致，不可有的朝上有的朝下。褶子较厚时可先用熨斗烫出折痕再车缝，效果更平整。拉链车缝分普通拉链与隐形拉链两种。普通拉链：先假缝固定拉链位置，用拉链压脚靠近拉链齿车缝，缝份约1cm，注意不要车到拉链齿。隐形拉链：需用专用隐形拉链压脚，将拉链齿压开后再车缝，缝完后拉链齿自动合拢，正面只看到接缝看不到拉链。隐形拉链务必在合侧缝之前安装，顺序不能反。所有拉链车缝前先在拉链底部打结或回针固定，防止拉链头脱出。',
          contentEn: 'Pleat sewing starts with precise fold-line marking — chalk the line, pinch the fold to align, pin the direction, then sew. Common pleat types: knife pleat (folded in one direction), box pleat (folded symmetrically both ways), inverted pleat (fold hidden inside). Sew 0.1cm from the fold root; keep all pleat directions consistent. For thick pleats, press the fold before sewing for a flatter result. Zipper sewing covers regular and invisible zippers. Regular zipper: baste in position, use a zipper foot close to the teeth, 1cm seam allowance — do not sew over the teeth. Invisible zipper: use a special invisible-zipper foot; the foot rolls the teeth open so you can sew close, then the teeth close automatically, leaving only the seam visible on the right side. Invisible zippers must be installed before joining the side seam — order matters. Knot or back-tack the zipper bottom to stop the pull from coming off.',
          tips: [
            '隐形拉链装完后要试拉，如果卡住说明车到拉链齿了，需拆开重缝',
            'After installing an invisible zipper, test the pull — if it sticks, you have sewn over the teeth and must restitch',
            '箱褶的两个折痕要完全对称，否则下摆会歪，车缝前用珠针固定后再核对一次',
            'A box pleat\'s two folds must be perfectly symmetrical, or the hem skews — pin and double-check before sewing',
          ]
        },
        {
          id: 'hem-waistband',
          title: '下摆与腰带车缝',
          titleEn: 'Hems & Waistbands',
          content: '下摆车缝方式因面料与款式而异。常见下摆有：折边下摆（面料折两折后平车或绷缝，适合梭织与针织）、卷边下摆（窄折三折后平车，适合薄面料）、包边下摆（用包边条包裹布边后车缝，适合弧线或厚面料）、暗针下摆（手缝斜针，正面不可见，适合正式服装）。下摆折边宽度通常1.5至3cm，弧线下摆需先烫缩或剪牙口再折，避免起皱。腰带车缝分松紧腰带与硬腰带两种。松紧腰带：将松紧带量好腰围尺寸，面料腰头宽度为松紧带宽加2cm缝份，先车成腰头筒状，再将松紧带穿入，最后将腰头与裤片缝合。硬腰带：将腰带衬布粘烫后对折，两端车缝翻正，再与裤腰缝合，腰带需加腰带襻固定位置。所有腰带车缝前要先假缝合身确认腰围位置，避免成品过紧或过松。',
          contentEn: 'Hem styles vary by fabric and design. Common hems: turned hem (fold twice, straight stitch or cover-stitch — for woven and knit), rolled hem (narrow triple fold, straight stitch — for thin fabrics), bound hem (bind the edge with a strip then stitch — for curves or thick fabrics), blind hem (hand slip stitch, invisible on the right side — for formal wear). Hem allowance is usually 1.5–3cm; curved hems need easing or clipping before folding to avoid puckering. Waistband sewing covers elastic and structured waistbands. Elastic waistband: cut elastic to waist size; fabric casing width = elastic width + 2cm seam allowance; sew the casing into a tube, thread the elastic, then attach to the garment. Structured waistband: fuse interfacing, fold right sides together, sew the ends, turn right side out, attach to the garment; add belt loops to hold the waistband in place. Always baste-fit before final stitching to confirm the waist position.',
          tips: [
            '弧线下摆折边会起皱，可先在布边剪小牙口（约0.3cm深）再折，牙口间隔1cm',
            'Curved hems pucker when folded — clip small notches (about 0.3cm deep) every 1cm before folding',
            '松紧带穿入腰头时，先用安全别针固定一端再穿，另一端用珠针固定防缩入',
            'When threading elastic into a casing, pin one end with a safety pin, pin the other end to the fabric to stop it retracting',
          ]
        },
        {
          id: 'pockets-collar-sleeve',
          title: '口袋、领子与接袖',
          titleEn: 'Pockets, Collars & Sleeves',
          content: '口袋分贴袋、挖袋与插袋三种。贴袋最简单：将袋口折边车缝，袋布正面与衣片正面相对，沿袋边车缝一圈，转角处回针加固。挖袋较复杂：在口袋位置画线，剪开Y形开口，将袋布与贴边分别塞入翻正，再车缝袋口与袋布。插袋多用于裤侧与外套侧：在侧缝留出开口，袋布两片分别缝于前后片开口内侧，侧缝车缝时绕过开口形成袋口。领子车缝：先将领面与领里正面相对，沿领外缘车缝，翻正烫平，领里与衣片领口正面相对车缝固定，最后将领面下口缲缝或车缝固定。接袖分绱袖与拉克兰袖与连身袖。绱袖最常见：先在袖山做缩缝假缝使袖山弧线贴合袖窿，再用珠针三点定位（肩点、前后袖窿对位点），正面相对车缝一圈，缝份烫开后再拷边。拉克兰袖与连身袖为一片式裁剪，制图与车缝顺序不同。',
          contentEn: 'Pockets come in three types: patch, welt, and side-seam. Patch pockets are simplest: hem the opening, place right sides together with the garment, stitch around the edge, back-tack at corners. Welt pockets are more complex: mark the opening, cut a Y-shaped slit, insert the welt and bagging, turn and stitch. Side-seam pockets are common on pants and jackets: leave an opening in the side seam, sew the two bagging pieces to the opening edges of the front and back, and the side-seam stitching runs around the opening to form the pocket mouth. Collar sewing: place collar face and under-collar right sides together, stitch the outer edge, turn and press; then sew the under-collar to the neckline right sides together, and slip-stitch or topstitch the collar face down. Sleeve attachment covers set-in, raglan, and one-piece sleeves. Set-in sleeves are most common: baste-ease the sleeve cap to fit the armhole, pin at three points (shoulder, front and back notches), stitch right sides together, press the seam open and overlock. Raglan and one-piece sleeves are cut as single pieces with different drafting and sewing order.',
          tips: [
            '绱袖前先做袖山缩缝，用双线平针缝后抽紧，使袖山比袖窿长出1-2cm的缩量',
            'Before set-in, ease-baste the sleeve cap with double thread and pull — the cap should be 1-2cm longer than the armhole',
            '绱袖三点定位是关键：肩点对肩点，前后袖窿对位点对齐，三点对准才不会歪',
            'Three-point pinning is key for set-in sleeves: shoulder to shoulder, front and back notches aligned — these three points prevent skewing',
          ]
        }
      ]
    },

    // ==================== 6. 整烫技巧 ====================
    {
      id: 'pressing',
      title: '整烫技巧',
      titleEn: 'Pressing Techniques',
      icon: '🔥',
      description: '掌握褶子整烫、缝份烫开、下摆烫缩等整烫技巧，让成品精致服贴。',
      descriptionEn: 'Master pressing pleats, pressing seams open, and shrinking hems — the finishing touch for a polished garment.',
      sections: [
        {
          id: 'pleat-pressing',
          title: '褶子整烫',
          titleEn: 'Pleat Pressing',
          content: '褶子整烫是定型褶型的关键工序。烫褶前先用珠针或手缝假缝固定褶子方向，确保所有褶子朝向一致。烫刀褶时，将面料反面朝上平铺烫垫，用熨斗尖端沿折痕线烫出清晰折痕，从上至下分段烫，每段停留3至5秒使热定型。烫箱褶时需同时烫两侧折痕，保持对称。烫暗褶时先烫外折痕，再用烫凳或烫馒头撑起内侧，分别烫内折痕。所有褶子整烫要在面料正面加盖烫布（棉布或麻布），避免熨斗直接接触面料产生极光（亮痕）。蒸汽熨斗可先用蒸汽喷湿再压烫，定型效果更好。烫完不要立即移动面料，等冷却后再取下，热定型才能固定。针织面料烫褶要低温且不喷蒸汽，避免面料变形。',
          contentEn: 'Pleat pressing sets the pleat shape. Pin or baste pleats in place first, with consistent direction. For knife pleats, place fabric wrong side up on the pressing pad, press the fold line from the top down in sections, holding 3–5 seconds each to heat-set. For box pleats, press both folds symmetrically. For inverted pleats, press the outer fold first, then use a pressing ham or roll to support the inside and press the inner fold. Always cover the right side with a press cloth (cotton or linen) to avoid a shiny "iron mark." Steam irons can mist the fold before pressing for better setting. Do not move the fabric immediately after pressing — let it cool so the set holds. For knits, use low heat without steam to avoid distortion.',
          tips: [
            '烫布一定要盖，没有专用烫布可用同款面料的小布块替代，切勿让熨斗直接烫正面',
            'Always use a press cloth — a scrap of the same fabric works if you lack a dedicated cloth. Never let the iron touch the right side directly',
            '褶子烫完要完全冷却再移动，约等30秒，热定型才固定，否则褶子会回弹',
            'Let pleats cool about 30 seconds before moving — the heat set only holds when fully cool, or the pleats bounce back',
          ]
        },
        {
          id: 'seam-pressing',
          title: '缝份烫开与烫倒',
          titleEn: 'Pressing Seams Open & to One Side',
          content: '缝份处理方式分烫开与烫倒两种。烫开：将两片缝份向两侧分开烫平，常用于身片侧缝、肩缝、袖缝等需要平整的部位。烫开时先在反面用熨斗尖端沿缝线压一道，使缝份自然分开，再用熨斗平面压烫两侧缝份，使缝份完全平贴面料。烫倒：将两片缝份一起倒向同一方向烫平，常用于弧线缝份（如公主线、袖山弧线），或需要加固的部位。烫倒时可配合烫馒头或烫凳撑起弧线，使缝份服贴不拉扯。烫弧线缝份时，可用剪刀在缝份上剪小牙口（约0.3cm深，间隔0.5cm），使弧线缝份能展开或弯折。烫前先检查缝线是否整齐，线头是否剪掉，避免烫后线头压入缝份难以清理。所有缝份整烫建议在车缝完成后立即进行，趁热更容易定型。',
          contentEn: 'Seam finishing comes in two styles: pressed open and pressed to one side. Pressed open: split the two seam allowances apart and press flat — used for side, shoulder, and sleeve seams that need a smooth finish. Use the iron tip to press along the stitch line first so the allowances separate naturally, then press both allowances flat with the iron soleplate. Pressed to one side: press both allowances together in one direction — used for curved seams (princess lines, sleeve caps) or where reinforcement is needed. Use a pressing ham or roll to support curves so the allowance lies flat without pulling. For curved allowances, clip small notches (about 0.3cm deep every 0.5cm) so the curve can spread or bend. Check that stitching is even and threads are trimmed before pressing — once pressed, threads are hard to remove. Press every seam immediately after sewing, while still warm, for the best set.',
          tips: [
            '弧线缝份要剪牙口才能烫开，直边缝份不需剪，剪多了反而会毛边',
            'Clip curved seam allowances before pressing open; straight seams need no clipping — too many clips cause fraying',
            '烫缝份时熨斗只压不拖，拖动会拉扯面料使缝线变形',
            'When pressing seam allowances, lift and lower the iron — do not slide. Sliding pulls the fabric and distorts the seam',
          ]
        },
        {
          id: 'hem-shrinking',
          title: '下摆烫缩与弧线整烫',
          titleEn: 'Shrinking Hems & Pressing Curves',
          content: '下摆烫缩是处理弧线下摆（如A字裙摆、圆裙摆）的关键技巧。弧线下摆的外缘比内缘长，直接折边会起皱堆叠，必须通过烫缩使外缘收缩贴合内缘。烫缩方法：将面料反面朝上，下摆折边先折好，用熨斗尖端从折痕处向外缘方向轻推压烫，同时左手轻拉外缘布边，利用蒸汽与压力使外缘自然收缩贴合内缘。也可用缩缝假缝辅助：在下摆折边处车一道宽间距平针缝，轻拉线抽皱，再烫平。烫缩要分多次进行，每次收缩少量，避免一次过度收缩起死褶。弧线整烫的另一种方式是剪牙口：在折边布边剪V形小口（约0.3cm深，间隔1cm），使外缘展开后再折边烫平，适合较厚或不易收缩的面料。所有整烫完成后，建议将成品挂起冷却定型30分钟以上再穿着。',
          contentEn: 'Hem shrinking handles curved hems (A-line, circular skirts). The outer edge is longer than the inner edge — folding directly causes puckers; shrinking makes the outer edge fit the inner. Place the fabric wrong side up with the hem folded; use the iron tip to press outward from the fold while gently pulling the outer edge with the left hand — steam and pressure shrink the outer edge to fit. Easing basting helps: sew a wide running stitch at the fold line, pull to gather lightly, then press flat. Shrink in small increments to avoid over-shrinking into permanent creases. Another method for curved hems is clipping: cut small V-notches (about 0.3cm deep every 1cm) on the fold edge so the outer edge spreads before folding — good for thicker or less shrinkable fabrics. After all pressing, hang the finished garment to cool and set for at least 30 minutes before wearing.',
          tips: [
            '烫缩时蒸汽要足，干烫不易收缩，可先用喷壶喷少量水再烫',
            'Adequate steam is essential — dry pressing shrinks poorly. Mist lightly with a spray bottle before pressing',
            '剪牙口的V形开口不要剪到折痕线，要留0.2cm距离，否则会裂开露缝份',
            'V-notch clips must not reach the fold line — leave 0.2cm gap or they split open and expose the seam allowance',
          ]
        }
      ]
    },

    // ==================== 7. 裙子打版 ====================
    {
      id: 'skirt-drafting',
      title: '裙子打版',
      titleEn: 'Skirt Pattern Drafting',
      icon: '👗',
      description: '从碎褶裙、窄裙、A字裙到波浪裙，掌握裙子基本型与63种变化型打版。',
      descriptionEn: 'From gathered, pencil, A-line, to flared skirts — master the basic skirt blocks and 63 variations.',
      sections: [
        {
          id: 'gathered-pencil-skirt',
          title: '碎褶裙与窄裙',
          titleEn: 'Gathered Skirt & Pencil Skirt',
          content: '碎褶裙是最基础的裙型，结构简单适合新手。打版步骤：第一步，量取腰围与裙长。第二步，确定裙片宽度，碎褶裙的腰头处需有缩量，通常腰头尺寸为腰围加2倍缩量，即腰围×2。第三步，绘制长方形裙片，宽度为腰围×2÷2（前后各一片），长度为裙长加3cm缝份。第四步，在腰头处画双线抽褶记号，标明此处需抽褶至腰围尺寸。第五步，加腰头：腰头为长方形，长度为腰围加2cm缝份，宽度为腰头宽×2加2cm缝份（对折裁）。窄裙（铅笔裙）则不同，需在腰臀之间收省使裙身贴合曲线。窄裙打版：先画基础长方形（宽为臀围÷2÷2加缝份，长为裙长加缝份），再在腰围线处画省道，每片前后各两个省，省长8至10cm，省量大2至3cm，使腰围从臀围尺寸收窄至实际腰围。窄裙下摆需略收窄，比臀围小2至4cm，侧缝从臀围线向下摆方向微内收。',
          contentEn: 'The gathered skirt is the most basic skirt — simple and beginner-friendly. Drafting: 1) measure waist and skirt length. 2) Set the skirt width — the gathered skirt needs ease at the waist; the waist measurement is typically 2× the waist. 3) Draw a rectangular skirt piece: width = waist × 2 ÷ 2 (front and back each one piece), length = skirt length + 3cm seam allowance. 4) Mark a double-line gather symbol at the waist, noting it must be gathered to the actual waist size. 5) Add the waistband: a rectangle of length = waist + 2cm seam allowance, width = waistband width × 2 + 2cm seam allowance (cut on fold). The pencil skirt differs — it uses darts between waist and hip to fit the curve. Draft the pencil skirt: draw a base rectangle (width = hip ÷ 2 ÷ 2 + seam allowance, length = skirt length + seam allowance), then draw darts at the waistline — two darts per front and back panel, 8–10cm long, 2–3cm wide, bringing the waist from the hip size down to the actual waist. The hem narrows 2–4cm below the hip; the side seam curves slightly inward from hip to hem.',
          tips: [
            '碎褶裙抽褶要均匀，先用双线平针缝后两手交替拉线，皱褶才整齐',
            'For even gathers on a gathered skirt, use double-thread running stitch and pull alternately with both hands',
            '窄裙省道尖点要指向臀突，省尖距离臀突点1-2cm，不要戳到臀突',
            'Pencil-skirt dart tips point toward the hip prominence — stop 1-2cm short of the hip point',
          ]
        },
        {
          id: 'a-line-flared-skirt',
          title: 'A字裙与波浪裙',
          titleEn: 'A-line & Flared Skirts',
          content: 'A字裙是从腰头向下摆逐渐展开的裙型，下摆比臀围宽，呈A字形。打版方法：以窄裙基础版为底，从腰头处向下摆方向画斜线展开。具体步骤：先画窄裙基础版，在侧缝处从臀围线开始向外扩展，至下摆处扩展量为臀围的1/4至1/3，使下摆比臀围大6至10cm。前中线为对折线，侧缝为斜线。A字裙的腰头仍为直条，但因下摆展开，腰头与裙片腰围尺寸需一致。波浪裙（圆裙）则完全不同，它是由扇形布片拼接而成，没有侧缝。打版方法：以腰围为半径计算扇形角度。半圆裙：用一个半圆，腰围为半圆弧长，裙长为半径减腰围半径。1/4圆裙：用一个1/4圆，腰围为1/4圆弧长。圆裙的下摆自然形成波浪，无需额外设计。波浪裙的腰头仍为直条，但裁剪时腰弧线要平滑，布纹方向要沿半径方向，否则下摆会不规则下垂。',
          contentEn: 'The A-line skirt widens from waist to hem, the hem larger than the hip, forming an A shape. Drafting: start from the pencil-skirt block and angle the side seam outward from the hip line to the hem. Steps: draft the pencil-skirt block, extend the side seam outward from the hip line, adding 1/4 to 1/3 of the hip measurement at the hem so the hem is 6–10cm larger than the hip. The front center is a fold line; the side seam is angled. The waistband is straight, but its length must match the skirt-top waist measurement. The flared skirt (circle skirt) is entirely different — it is built from fan-shaped pieces, with no side seams. Drafting: use the waist as the arc length to calculate the sector angle. Half-circle skirt: one half-circle, waist = half-circle arc, skirt length = radius minus the waist radius. Quarter-circle skirt: one quarter-circle, waist = quarter-circle arc. The hem forms natural waves without additional design. The waistband is still straight, but the waist arc must be smooth, and the grain must run along the radius or the hem drps unevenly.',
          tips: [
            'A字裙侧缝展开量要在前后片对称分配，不能只扩前片或只扩后片',
            'A-line side-seam extension must be split symmetrically between front and back — never only front or only back',
            '圆裙裁剪时布纹线必须沿半径方向，否则下摆有的长有的短，穿着会高低不平',
            'When cutting a circle skirt, the grain must run along the radius — otherwise the hem is uneven and hangs at different lengths',
          ]
        },
        {
          id: 'skirt-variations',
          title: '裙子变化型与63种款式',
          titleEn: 'Skirt Variations & 63 Styles',
          content: '《服装版型研究室·裙子篇》整理出63种裙子基本型，涵盖了几乎所有常见裙款。这63种可归纳为几大类：第一类，基础裙型（窄裙、A字裙、碎褶裙、波浪裙）共4种，是所有变化的母型。第二类，腰头变化型（松紧腰、连腰、高腰、低腰、V形腰、弧形腰）约8种，通过改变腰头位置与结构衍生。第三类，下摆变化型（鱼尾裙、阶梯裙、荷叶裙、不对称裙、开衩裙）约10种，通过下摆形状与长度变化衍生。第四类，分割线变化型（六片裙、八片裙、十二片裙、公主线裙、斜裁裙）约15种，通过身片分割方式不同衍生。第五类，褶子变化型（单向刀褶裙、箱褶裙、暗褶裙、局部褶裙、交叉褶裙）约12种。第六类，长度与层叠变化（迷你裙、及膝裙、中长裙、长裙、双层裙、三层塔裙）约14种。掌握母型后，通过腰头、下摆、分割线、褶子、长度五个维度的组合变化，可衍生出数百种裙款，63种是核心代表。',
          contentEn: '"Pattern Research Lab — Skirts" catalogs 63 basic skirt types, covering nearly all common styles. They fall into several groups: 1) Base skirts (pencil, A-line, gathered, flared) — 4 styles, the parents of all variations. 2) Waist variations (elastic casing, faced waist, high-waisted, low-waisted, V-waist, curved waist) — about 8 styles. 3) Hem variations (mermaid, tiered, ruffle, asymmetric, slit) — about 10 styles. 4) Panel variations (6-gore, 8-gore, 12-gore, princess-line, bias-cut) — about 15 styles. 5) Pleat variations (one-way knife pleat, box pleat, inverted pleat, partial pleat, crisscross pleat) — about 12 styles. 6) Length and layer variations (mini, knee, midi, maxi, double-layer, triple-tier) — about 14 styles. Mastering the parents and combining waist, hem, panel, pleat, and length gives hundreds of styles; the 63 are the core representatives.',
          tips: [
            '学裙子打版先精通4种母型，再学变化，不要一上来就追求复杂款式',
            'Master the 4 base skirts first, then study variations — do not chase complex styles from the start',
            '六片裙、八片裙的每片宽度要等分，可用臀围÷片数计算单片宽度再加缝份',
            'For 6-gore and 8-gore skirts, divide the width evenly — single panel width = hip ÷ panel count, plus seam allowance',
          ]
        }
      ]
    },

    // ==================== 8. 裤子打版 ====================
    {
      id: 'pants-drafting',
      title: '裤子打版',
      titleEn: 'Pants Pattern Drafting',
      icon: '👖',
      description: '从松紧带短裤、长裤到反折裤、束口裤，掌握裤子制图与设计变化。',
      descriptionEn: 'From elastic shorts and long pants to cuffed and drawstring pants — master pants drafting and variations.',
      sections: [
        {
          id: 'elastic-shorts',
          title: '松紧带短裤',
          titleEn: 'Elastic Waist Shorts',
          content: '松紧带短裤是裤子打版的入门款，结构简单不需复杂省道。打版步骤：第一步，量取腰围（此处实际为松紧腰围，需加2至4cm松量）、臀围、立裆长、裤长。第二步，画基础长方形：宽度为臀围÷4加1cm缝份，高度为立裆长加下裆长（即裤长减腰头）。第三步，在长方形上画小裆弯：前片小裆宽为臀围÷4×0.1加1cm，从长方形上端角向内画小裆弧线。后片小裆宽为臀围÷4×0.15加1.5cm，比前片宽，弧线更长。第四步，画腰头：腰头为长方形，长度为腰围加2至4cm松量，宽度为松紧带宽加2cm缝份（对折裁）。第五步，画下摆折边：下摆折边宽2至3cm，对折后车缝。松紧带短裤不需省道，因松紧带自带调节量。前后片大小可相同（直筒短裤）或后片略宽（微A短裤），按款式调整。',
          contentEn: 'Elastic-waist shorts are the entry-level pants draft — simple, with no complex darts. Steps: 1) Measure waist (here the elastic waist, plus 2–4cm ease), hip, rise, and pants length. 2) Draw the base rectangle: width = hip ÷ 4 + 1cm seam allowance, height = rise + inseam (pants length minus waistband). 3) Draw the crotch curve: front crotch width = hip ÷ 4 × 0.1 + 1cm; curve from the upper corner inward. Back crotch width = hip ÷ 4 × 0.15 + 1.5cm — wider than the front, with a longer curve. 4) Draw the waistband: a rectangle of length = waist + 2–4cm ease, width = elastic width + 2cm seam allowance (cut on fold). 5) Draw the hem fold: 2–3cm, folded and stitched. Elastic shorts need no darts — the elastic provides adjustment. Front and back can be the same size (straight shorts) or the back slightly wider (slight A-line), per style.',
          tips: [
            '后片小裆比前片宽，这是裤子前后的根本区别，新手最容易画反',
            'The back crotch is wider than the front — this is the fundamental front/back difference and a common beginner mistake',
            '松紧腰头要预留穿松紧带的开口，约2cm不车缝，缝完翻到正面再穿松紧带',
            'Leave a 2cm opening in the elastic casing unstitched — thread the elastic through after turning the casing right side out',
          ]
        },
        {
          id: 'long-pants',
          title: '长裤制图',
          titleEn: 'Long Pants Drafting',
          content: '长裤制图比短裤复杂，需收腰省与处理裤长。基础长裤打版步骤：第一步，量取腰围、臀围、立裆长、股下长、裤长、裤口宽。第二步，画基础长方形（宽度为臀围÷4加缝份，高度为立裆长加股下长）。第三步，画前片：在长方形上画前小裆弯，宽为臀围÷4×0.1加1cm；从腰头处画腰省，前片一个省，省尖指向胯骨；下摆处画裤口宽，前裤口比臀围÷4略小。第四步，画后片：在前片基础上偏移，后小裆宽为臀围÷4×0.15加1.5cm；后腰围比前腰围略高0.5至1cm（后翘），后片两个腰省，省尖指向臀突；后裤口比前裤口大1至2cm。第五步，画腰头：腰头为长方形，长度为腰围加2cm缝份，宽度为腰头宽×2加2cm缝份（对折裁）。第六步，画门襟与拉链位置。第七步，画袋口与插袋位置。长裤的关键在于后片后翘与后省，决定了裤子是否贴合臀部曲线。',
          contentEn: 'Long pants drafting is more complex than shorts — it needs waist darts and full-length handling. Steps: 1) Measure waist, hip, rise, inseam, pants length, and hem width. 2) Draw the base rectangle (width = hip ÷ 4 + seam allowance, height = rise + inseam). 3) Front: draw the front crotch curve, width = hip ÷ 4 × 0.1 + 1cm; draw a waist dart pointing toward the hip bone; draw the front hem slightly smaller than hip ÷ 4. 4) Back: offset from the front; back crotch width = hip ÷ 4 × 0.15 + 1.5cm; the back waist sits 0.5–1cm higher than the front (back rise); two back darts point toward the hip prominence; the back hem is 1–2cm larger than the front. 5) Waistband: rectangle of length = waist + 2cm, width = waistband width × 2 + 2cm seam allowance (cut on fold). 6) Mark the fly and zipper. 7) Mark the pocket mouth and side-seam pocket. The back rise and back darts are what make pants fit the hip curve.',
          tips: [
            '后片后翘（后腰比前腰高0.5-1cm）是裤子不卡裆的关键，不能省略',
            'The back rise (back waist 0.5–1cm higher than the front) is what keeps pants from riding up — never omit it',
            '股下长要坐下量立裆后，再用裤长减立裆长计算，不要直接量股下',
            'Calculate inseam as pants length minus rise (measured seated) — do not measure the inseam directly',
          ]
        },
        {
          id: 'cuffed-drawstring-pants',
          title: '反折裤、束口裤及变化型',
          titleEn: 'Cuffed, Drawstring & Variations',
          content: '在基础长裤版型上，可衍生出多种变化型。反折裤（卷边裤）：在裤口处加3至5cm的反折量，制图时下摆长度需加上反折量的两倍（因对折），反折线处画折线记号。束口裤（灯笼裤）：在裤口处收窄并加松紧带或束口绳，制图时下摆处收窄至脚踝围加2cm松量，再画束口布（束口布为长方形，长度为裤口围，宽度为松紧带宽加缝份）。萝卜裤（哈伦裤）：在立裆处加宽、裤口收窄，制图时大腿处加宽3至5cm，膝下逐渐收窄，整体呈上宽下窄的萝卜形。阔腿裤：从大腿处开始向下逐渐加宽至裤口，裤口宽可达臀围÷4加8至12cm，整体呈上窄下宽的喇叭形。直筒裤：裤口与膝围相同，从膝到裤口垂直。锥形裤：从大腿处开始向下逐渐收窄，裤口比膝围小。所有变化型的母型都是基础长裤，通过调整裤口宽、大腿宽、立裆宽三个参数即可衍生。',
          contentEn: 'From the basic long-pants block, many variations derive. Cuffed pants: add 3–5cm of cuff turn-up; the hem length must include twice the cuff (for the fold), with a fold-line mark at the cuff. Drawstring pants (harem): narrow the hem and add elastic or a drawstring; the hem narrows to ankle girth + 2cm ease, plus a rectangular drawstring casing. Radish pants (harem): widen at the rise, narrow at the hem — widen the thigh 3–5cm, taper from knee down, for a top-wide, bottom-narrow shape. Wide-leg pants: widen from thigh to hem, the hem up to hip ÷ 4 + 8–12cm, for a narrow-top, wide-bottom flare. Straight-leg: hem = knee, vertical from knee to hem. Tapered: narrow from thigh down, hem smaller than knee. All variations derive from the basic long-pants block by adjusting three parameters: hem width, thigh width, and rise width.',
          tips: [
            '反折裤的反折量要在制图时就加上，不能缝完再剪短，否则不够反折长度',
            'Add the cuff turn-up allowance during drafting — cutting after sewing leaves insufficient cuff length',
            '阔腿裤裤口太宽会拖地，最长不超过脚背最高点加2cm，否则走路踩裙摆',
            'Wide-leg hems that are too wide drag on the ground — the longest should not exceed the highest instep point + 2cm',
          ]
        }
      ]
    },

    // ==================== 9. 上装打版 ====================
    {
      id: 'top-drafting',
      title: '上装打版',
      titleEn: 'Top Pattern Drafting',
      icon: '👚',
      description: '从妇女原型版、背心、衬衫，到22种身片、26种袖片、40种领片的变化打版。',
      descriptionEn: 'From the women\'s basic block, vests, and shirts to 22 body, 26 sleeve, and 40 collar variations.',
      sections: [
        {
          id: 'basic-block',
          title: '妇女原型版',
          titleEn: 'Women\'s Basic Block',
          content: '妇女原型版是所有女上装打版的母版，掌握原型版就能衍生出所有上装款式。原型版打版步骤：第一步，量取胸围、腰围、背长、肩宽、袖窿深、领围。第二步，画基础长方形：宽度为胸围÷2加2至4cm松量（半身松量），高度为背长。第三步，画胸围线：从上端向下量袖窿深（约为胸围÷6加7cm），画水平线。第四步，画背宽线与胸宽线：背宽线为胸围线下方0至3cm处，宽度为背宽÷2；胸宽线为胸围线上方0至3cm处，宽度为胸宽÷2。第五步，画袖窿弧线：从肩点经背宽线与胸宽线交点画弧线至胸围线，形成前后袖窿。第六步，画领口：前领口宽为领围÷5减0.5cm，深为领围÷5加0.5cm；后领口宽为领围÷5减0.5cm，深为2至2.5cm。第七步，画腰省：在胸围线与腰围线之间画省道，前片两个胸省指向胸点，后片两个腰省。原型版是半身版，前后片相连，使用时按款式分割前后。',
          contentEn: 'The women\'s basic block is the parent of all women\'s top drafting — master it and all styles derive. Steps: 1) Measure bust, waist, back length, shoulder, armhole depth, and neck. 2) Draw the base rectangle: width = bust ÷ 2 + 2–4cm ease (half-body ease), height = back length. 3) Bust line: down from the top by armhole depth (about bust ÷ 6 + 7cm), draw a horizontal line. 4) Back and chest width lines: back width line 0–3cm below the bust line, width = back width ÷ 2; chest width line 0–3cm above the bust line, width = chest width ÷ 2. 5) Armhole curve: from shoulder through the back and chest width intersection to the bust line. 6) Neckline: front neck width = neck ÷ 5 − 0.5cm, depth = neck ÷ 5 + 0.5cm; back neck width = neck ÷ 5 − 0.5cm, depth = 2–2.5cm. 7) Waist darts: between the bust and waist lines, two front bust darts pointing to the bust point, two back waist darts. The block is a half-body block, front and back joined; split per style.',
          tips: [
            '原型版松量决定衣服合身度，紧身款松量2cm，标准款4cm，宽松款6cm以上',
            'Block ease determines fit: 2cm for fitted, 4cm for standard, 6cm+ for loose styles',
            '胸省尖点要距离胸点2-3cm，不能直接戳到，否则会顶出尖角',
            'Bust dart tips stop 2–3cm short of the bust point — touching it creates a peaked corner',
          ]
        },
        {
          id: 'vest-shirt',
          title: '背心与衬衫',
          titleEn: 'Vests & Shirts',
          content: '背心与衬衫是上装的基础应用款。V领背心打版：以原型版为基础，将领口加深加宽成V形。前领深从领围÷5加0.5cm加深至15至20cm，领宽从领围÷5减0.5cm加宽2至3cm。袖窿处去掉袖片，将袖窿深加深2至3cm，袖窿弧线从肩点直接画到胸围线，形成无袖背心。下摆可做直摆或微弧摆。有领台衬衫打版：以原型版为基础，前中线加搭门量（前中向外加1.5至2cm作为纽扣搭门）。领口画衬衫领，领子分领座与翻领两部分。领座为长方形，长度为领围加1cm，宽度为3至4cm。翻领为弧形，长度与领座匹配，宽度比领座宽1至2cm。袖子画衬衫袖，袖山高为袖窿弧长÷3，袖口加袖头（袖头为长方形，对折裁）。衬衫前片要留门襟位置，门襟可做明门襟（前中加3cm明门襟条）或暗门襟。',
          contentEn: 'Vests and shirts are basic top applications. V-neck vest: from the block, deepen and widen the neckline into a V. Front neck depth deepens from neck ÷ 5 + 0.5cm to 15–20cm; neck width widens from neck ÷ 5 − 0.5cm by 2–3cm. Remove the sleeve, deepen the armhole 2–3cm, and draw the armhole curve from shoulder to bust line for a sleeveless vest. Hem can be straight or slightly curved. Stand-collar shirt: from the block, add a front overlap (1.5–2cm beyond the center front for the button placket). Draft a shirt collar in two parts — a stand and a fall. The stand is a rectangle of length = neck + 1cm, width 3–4cm. The fall is curved, matching the stand in length, 1–2cm wider. The sleeve is a shirt sleeve: cap height = armhole arc ÷ 3, with a rectangular cuff (cut on fold). The shirt front needs a placket — a 3cm placket strip for a front placket, or a hidden placket.',
          tips: [
            'V领背心的V深要试穿确认，太深会走光，太浅不像V领，一般15-20cm',
            'Try on to confirm the V depth — too deep exposes, too shallow is not a V — usually 15–20cm',
            '衬衫领座与翻领接缝处要平齐，不能有台阶，否则领子不平整',
            'The shirt collar stand and fall seam must align — a step makes the collar uneven',
          ]
        },
        {
          id: 'top-variations',
          title: '22种身片、26种袖片、40种领片变化',
          titleEn: '22 Body, 26 Sleeve & 40 Collar Variations',
          content: '《服装版型研究室·上衣篇》系统整理了22种身片、26种袖片与40种领片的版型变化。22种身片变化包括：箱型剪裁（无省直身）、修身剪裁（腰省收身）、公主线剪裁（前片从肩到腰的弧形分割线）、波浪剪裁（下摆展开呈波浪）、斗篷式（肩部加宽无袖）、铠甲式（多片分割）、不对称式、前后育克式（胸围线上方横向分割）等。26种袖片变化包括：直筒袖（袖口与袖山宽相同）、合身袖（袖口收窄加袖省）、灯笼袖（袖口与袖山处加宽、中部收窄）、衬衫袖（袖山低、袖口加袖头）、拉克兰袖（袖片从领口到腋下斜向分割）、连身袖（袖与身一片式）、泡泡袖（袖山处加缩缝抽褶）、主教袖（袖口与袖山宽、中部收窄）、喇叭袖（袖口处展开呈喇叭）等。40种领片变化包括：立领（无翻领的直立领）、衬衫领（领座加翻领）、平驳领（西装领的V形翻领）、西装领（青果领或戗驳领）、娃娃领（前片大圆领）、方领、一字领、V领、荷叶领（领片加波浪）等。掌握母型后，通过分割线、袖山、领形三个维度的组合，可衍生出数百种上装款式。',
          contentEn: '"Pattern Research Lab — Tops" systematically catalogs 22 body, 26 sleeve, and 40 collar variations. The 22 body variations include: box cut (no darts, straight body), fitted cut (waist darts), princess-line cut (curved seam from shoulder to waist), flounced cut (hem flares into waves), cape style (wide shoulders, no sleeves), armor style (multi-panel division), asymmetric, front and back yoke (horizontal division above the bust line), etc. The 26 sleeve variations include: straight sleeve (cuff = cap), fitted sleeve (narrow cuff with sleeve dart), lantern sleeve (wide at cuff and cap, narrow in the middle), shirt sleeve (low cap, cuff), raglan sleeve (diagonal division from neck to armpit), one-piece sleeve (sleeve and body in one piece), puff sleeve (cap gathered), bishop sleeve (wide cuff and cap, narrow middle), flared sleeve (cuff flares), etc. The 40 collar variations include: stand collar (no fall), shirt collar (stand + fall), notched lapel (V-shaped lapel), tailored lapel (peak or shawl), Peter Pan collar (large round front), square neck, boat neck, V-neck, ruffle collar (collar with waves), etc. Mastering the parent and combining panel, cap, and collar gives hundreds of top styles.',
          tips: [
            '公主线是上身最重要的分割线，能取代胸省使衣身更立体，新手要重点掌握',
            'The princess line is the most important top division — it replaces bust darts for a more 3D body. Beginners must master it',
            '拉克兰袖比绱袖易缝，新手做外套建议先从拉克兰袖入手',
            'Raglan sleeves are easier to sew than set-in — beginners making outerwear should start with raglan',
          ]
        }
      ]
    },

    // ==================== 10. 洋装打版 ====================
    {
      id: 'dress-drafting',
      title: '洋装打版',
      titleEn: 'Dress Pattern Drafting',
      icon: '💃',
      description: '从洋装制图、设计变化到打版技巧，掌握连身式洋装的完整打版流程。',
      descriptionEn: 'From dress drafting and design variations to pattern techniques — master the one-piece dress workflow.',
      sections: [
        {
          id: 'dress-drafting-basics',
          title: '洋装制图基础',
          titleEn: 'Dress Drafting Basics',
          content: '洋装（连衣裙）是上身与裙身连为一体的服装，打版可视为上装原型版与裙子基础版的结合。洋装制图基础步骤：第一步，量取胸围、腰围、臀围、背长、衣长（此处为洋装总长）、肩宽、袖窿深、领围。第二步，画上身原型版作为上半部分基础。第三步，从腰围线向下延伸画裙身部分，裙身宽度与腰围连接处需处理腰省，使上身与裙身平滑过渡。第四步，画腰线：连身洋装的腰线即上身原型的腰围线，裙身从此线向下延伸。第五步，画下摆：根据款式确定下摆形状，直身洋装下摆与臀围同宽，A型洋装下摆向外扩展，喇叭洋装下摆呈波浪展开。第六步，画侧缝：从袖窿经腰围到下摆，侧缝需连贯顺畅。第七步，画领口与袖子（如有），领口可做圆领、V领、方领等，袖子可做无袖、短袖、长袖。洋装的关键在于上身与裙身的腰线连接，腰省方向与位置决定了整体线条。',
          contentEn: 'A dress is a one-piece garment combining a top and a skirt — drafting can be seen as combining the top block with the basic skirt block. Steps: 1) Measure bust, waist, hip, back length, dress length (the total), shoulder, armhole depth, neck. 2) Draft the top block as the upper half. 3) Extend the skirt downward from the waistline; the skirt width connects at the waist, and waist darts smooth the top-to-skirt transition. 4) Draw the waistline: the dress waistline is the block\'s waistline, and the skirt extends downward from it. 5) Draw the hem per style: a sheath dress hem = hip width; an A-line dress hem flares outward; a flared dress hem flares into waves. 6) Draw the side seam: from armhole through waist to hem, smooth and continuous. 7) Draw the neckline and sleeves (if any): round, V, square neckline; sleeveless, short, or long sleeves. The key is the top-to-skirt waist connection — the dart direction and position define the overall silhouette.',
          tips: [
            '连身洋装腰省要从上身延伸到裙身，不能在腰线处断开，否则线条不连贯',
            'Dress waist darts extend from the top into the skirt — do not break them at the waistline, or the line is disjointed',
            '洋装总长要从后颈点量到下摆，不是从肩点量，二者相差背长',
            'Dress length is measured from the back neck point to the hem — not from the shoulder. The two differ by the back length',
          ]
        },
        {
          id: 'dress-design-variations',
          title: '洋装设计变化',
          titleEn: 'Dress Design Variations',
          content: '《服装版型研究室·洋装篇》将洋装设计变化归纳为几大类型。第一类，腰线位置变化：标准腰线洋装（腰线在自然腰位）、高腰洋装（腰线提升至胸围线下方，腰线在肋骨下）、低腰洋装（腰线降至臀围线上方）、帝国腰洋装（腰线紧贴胸围线下方，胸下收身）。第二类，身片分割变化：公主线洋装（前片从肩到腰的弧形分割线，取代胸省）、育克洋装（胸围线上方横向分割）、六片洋装（身片分为六片）、八片洋装（身片分为八片）。第三类，下摆变化：直身洋装、A型洋装、喇叭洋装、鱼尾洋装（腰到膝贴合、膝下展开）、塔裙洋装（多层下摆层叠）。第四类，领与袖变化：无袖无领洋装、有领有袖洋装、半袖洋装、荷叶袖洋装。第五类，长度变化：迷你洋装、及膝洋装、中长洋装、长洋装。掌握腰线、分割线、下摆、领袖、长度五个维度的变化，可衍生出几乎所有洋装款式。',
          contentEn: '"Pattern Research Lab — Dresses" groups dress variations into several types. 1) Waistline position: standard waistline, high waistline (above natural waist, at the lower ribs), dropped waistline (above the hip line), empire waist (just under the bust line). 2) Body division: princess-line dress (curved seam from shoulder to waist, replacing bust darts), yoke dress (horizontal division above the bust), 6-panel dress, 8-panel dress. 3) Hem: sheath, A-line, flared, mermaid (fitted waist-to-knee, flared below knee), tiered dress (layered hems). 4) Collar and sleeve: sleeveless collarless, collared with sleeves, half-sleeve, ruffle-sleeve. 5) Length: mini, knee, midi, maxi. Mastering waistline, division, hem, collar/sleeve, and length gives nearly all dress styles.',
          tips: [
            '帝国腰洋装腰线紧贴胸下，能拉长腿部线条，适合小个子穿着',
            'The empire waistline sits just under the bust, elongating the legs — flattering for petite figures',
            '公主线洋装分割线要从肩点附近开始，不能从领口正中开始，否则会显得呆板',
            'Princess-line seams should start near the shoulder point, not the neckline center, or the dress looks stiff',
          ]
        },
        {
          id: 'dress-drafting-techniques',
          title: '洋装打版技巧',
          titleEn: 'Dress Drafting Techniques',
          content: '洋装打版有几个关键技巧需要特别注意。第一，腰省转移：当身片有分割线（如公主线）时，原胸省可转移到分割线中，使分割线既是设计线又是省道。转移方法是将原型版的胸省闭合，在分割线位置重新张开等量的开口，省量即转移至分割线。第二，下摆展开法：A型与喇叭型下摆的展开，常用「剪纸法」——在纸型上从下摆向腰线方向画剪开线（不剪断腰线），将剪开处张开加入展开量，再用弧线连接张开点。展开量越大下摆越宽。第三，腰头对接：连身洋装的腰线处，上身腰围与裙身腰围必须完全相等，否则缝合时会起皱。若上身有胸省使腰围收窄，裙身也要相应收省或加省。第四，侧缝连贯：侧缝从袖窿到下摆要画成一条平滑曲线，不能在腰线处有折角。第五，立体修整：打完版后建议用坯布做一件样衣试穿，立体检查合身度，纸面打版与立体穿着常有差异，必须通过样衣修整。洋装因结构复杂，样衣修整环节尤其重要，不可省略。',
          contentEn: 'Dress drafting has several key techniques. 1) Dart transfer: when a body panel has a division line (e.g., princess line), the original bust dart can transfer into the division — the division then serves as both a design line and a dart. The method: close the original bust dart on the block, then re-open an equal amount at the division line — the dart volume moves into the division. 2) Hem-flare method: A-line and flared hems use the "slash and spread" method — draw slash lines from the hem toward the waistline (without cutting through the waistline), spread the slashes to add flare, then connect the spread points with curves. More spread = wider hem. 3) Waist matching: at the dress waistline, the top waist and skirt waist must match exactly, or the seam puckers. If the top has bust darts that narrow the waist, the skirt must have matching darts. 4) Continuous side seam: the side seam from armhole to hem must be a smooth curve with no corner at the waistline. 5) 3D fitting: after drafting, make a muslin toile and try it on — flat drafting and 3D wear often differ, and the toile is essential for correction. Dresses are structurally complex — the muslin toile is indispensable.',
          tips: [
            '剪纸法展开下摆时，剪开线要均匀分布，间距约5-8cm，否则展开不均匀下摆会歪',
            'In slash-and-spread, distribute the slash lines evenly about 5–8cm apart — uneven spacing makes the hem skew',
            '腰省转移后要在纸型上做记号，标明原省位与新省位，便于车缝时对位',
            'After dart transfer, mark the original and new dart positions on the pattern for sewing alignment',
          ]
        }
      ]
    },

    // ==================== 11. 品牌参考与版型分析 ====================
    {
      id: 'brand-reference',
      title: '品牌参考与版型分析',
      titleEn: 'Brand Reference & Fit Analysis',
      icon: '🏷️',
      description: '智裁 AI 已学习 H&M 和 Zara 品牌的模特图、尺寸表和版型标准，本章详解如何利用品牌数据提升识图精准度。',
      descriptionEn: 'PatternAI has learned H&M and Zara model photos, size charts, and fit standards. This chapter explains how brand data enhances recognition accuracy.',
      sections: [
        {
          id: 'hm-size-guide',
          title: 'H&M 尺码体系与版型',
          titleEn: 'H&M Size System & Fit',
          content: 'H&M 是全球快时尚品牌，其尺码体系以欧洲标准为基础。女装尺码从 XXS 到 XXL，对应 EUR 30-42。胸围范围 76-100cm（XXS-XL），腰围 60-84cm，臀围 84-108cm。男装从 XS 到 XXL，对应 EUR 44-54，胸围 88-112cm。H&M 的版型分为四类：Slim Fit（修身，放松量 2-6cm）、Regular Fit（标准，放松量 6-10cm）、Relaxed Fit（宽松，放松量 10-16cm）、Oversized（超大，放松量 16cm+）。识别 H&M 款式时，可通过肩线位置判断版型：肩线正好在肩点为 Slim/Regular，肩线下落 2-4cm 为 Relaxed，下落 5cm 以上为 Oversized。智裁 AI 已将 H&M 全部品类（T恤、衬衫、针织衫、卫衣、裤装、裙装、连衣裙、外套）的版型参数录入数据库，识图时可自动匹配最接近的参考款。',
          contentEn: 'H&M is a global fast-fashion brand using European sizing. Women\'s sizes run XXS to XXL (EUR 30-42), with bust 76-100cm, waist 60-84cm, and hips 84-108cm. Men\'s sizes run XS to XXL (EUR 44-54), chest 88-112cm. H&M classifies fits into four types: Slim Fit (ease 2-6cm), Regular Fit (ease 6-10cm), Relaxed Fit (ease 10-16cm), and Oversized (ease 16cm+). To identify the fit, check the shoulder seam: at the shoulder point = Slim/Regular; dropped 2-4cm = Relaxed; dropped 5cm+ = Oversized. PatternAI has cataloged all H&M categories (tees, shirts, knits, hoodies, pants, skirts, dresses, outerwear) for automatic matching during recognition.',
          tips: [
            'H&M 的 Regular Fit 最接近标准尺码，如果是 Oversized 款式，建议选小一码',
            'H&M Regular Fit is closest to standard sizing; for Oversized styles, consider sizing down',
            'H&M 针织面料缩水率约 3-5%，裁剪前要预缩水',
            'H&M knit fabrics shrink 3-5%; pre-shrink before cutting',
          ]
        },
        {
          id: 'zara-size-guide',
          title: 'Zara 尺码体系与产品线',
          titleEn: 'Zara Size System & Collections',
          content: 'Zara 是西班牙快时尚品牌，其尺码同样以欧洲标准为基础。女装从 XXS 到 XL，对应 EUR 32-42。胸围范围 80-102cm（XXS-XL），腰围 58-82cm，臀围 86-110cm。Zara 有三个产品线，版型各不相同：Zara Woman（○标记）面向成熟女性，版型更合身，通常 true to size 或略大；Zara Basic（□标记）是日常基础款，版型标准，最接近标准尺码；TRF（△标记）是年轻休闲线，版型偏小偏窄，建议 size up。Zara 在同等尺码下，胸围、腰围、臀围通常比 H&M 大 2-4cm，但 TRF 线偏小。识别 Zara 款式时，要特别注意产品线标记：圆圈、方块或三角形，这直接影响版型判断和尺码推荐。',
          contentEn: 'Zara is a Spanish fast-fashion brand using European sizing. Women\'s sizes run XXS to XL (EUR 32-42), with bust 80-102cm, waist 58-82cm, and hips 86-110cm. Zara has three collections with different fits: Zara Woman (○) for mature women, more tailored, true to size or slightly large; Zara Basic (□) for everyday staples, standard fit, closest to standard sizing; TRF (△) for young casual wear, runs small and narrow, size up recommended. At the same size, Zara is typically 2-4cm larger than H&M in bust, waist, and hips, but TRF runs small. When identifying Zara garments, pay attention to the collection symbol (circle, square, or triangle) — it directly affects fit and size recommendations.',
          tips: [
            'Zara TRF 线偏小偏窄，如果平时穿 S 码，TRF 建议选 M',
            'Zara TRF runs small and narrow — if you usually wear S, consider M in TRF',
            'Zara 连衣裙使用与上装相同的尺码，但需要同时考虑胸围、腰围和臀围',
            'Zara dresses use the same sizing as tops, but consider bust, waist, and hips together',
          ]
        },
        {
          id: 'brand-comparison',
          title: '品牌间尺码对照与差异',
          titleEn: 'Cross-Brand Size Comparison',
          content: '智裁 AI 已建立 H&M 和 Zara 之间的尺码对照表。女装 M 码对照：H&M M 码对应胸围 88cm、腰围 72cm、臀围 96cm；Zara M 码对应胸围 90cm、腰围 70cm、臀围 98cm。差异分析：Zara 在同等尺码下，胸围和臀围通常比 H&M 大 2cm，但腰围比 H&M 小 2cm，说明 Zara 更收腰、更修身。男装 M 码对照：H&M M 码对应胸围 96cm、腰围 84cm；Zara M 码对应胸围 96cm、腰围 82cm。差异分析：男装胸围接近，但 Zara 腰围比 H&M 小 2-4cm，Zara 男装更修腰。在做纸样放码时，智裁 AI 会参考两个品牌的尺码差值：胸围每码差值约 ±2cm，腰围每码差值约 ±2cm，衣长每码差值约 ±1cm。如果用户上传的服装无法确定品牌，AI 会同时参考两个品牌的尺码表，取中间值作为放码基准。',
          contentEn: 'PatternAI has built a cross-brand size comparison between H&M and Zara. Women\'s M comparison: H&M M = bust 88cm, waist 72cm, hips 96cm; Zara M = bust 90cm, waist 70cm, hips 98cm. Analysis: at the same size, Zara is 2cm larger in bust and hips but 2cm smaller in waist — Zara is more fitted at the waist. Men\'s M comparison: H&M M = chest 96cm, waist 84cm; Zara M = chest 96cm, waist 82cm. Analysis: chest is similar, but Zara waist is 2-4cm smaller — Zara men\'s is more waisted. For grading, PatternAI references both brands: bust ±2cm per size, waist ±2cm per size, length ±1cm per size. If the brand cannot be identified, AI uses both charts and averages for the grading base.',
          tips: [
            '如果不确定服装品牌，以 H&M 标准尺码为基准最安全，因为最接近标准',
            'If unsure of the brand, use H&M standard sizing as the base — it is closest to standard',
            'Zara 和 H&M 的内缝长都是 79cm 左右，裤装放码时内缝长变化很小',
            'Both Zara and H&M inside leg is about 79cm — inseam changes little during grading',
          ]
        },
        {
          id: 'fit-recognition',
          title: '从模特图学习版型判断',
          titleEn: 'Learning Fit from Model Photos',
          content: '智裁 AI 通过分析 H&M 和 Zara 的所有模特图，总结出从图片判断版型的四大标准。第一，肩线位置：肩线正好在肩点 = Slim/Regular Fit；肩线下落 2-4cm = Relaxed Fit；肩线下落 5cm 以上 = Oversized。第二，胸部贴合度：衣服紧贴胸部、可见身体曲线 = Slim；适度贴合有空间 = Regular；宽松下垂有垂坠感 = Relaxed；非常宽大不显身材 = Oversized。第三，腰部定义：腰部明显收窄 = Slim；腰部略收 = Regular；腰部无明显变化 = Relaxed/Oversized。第四，整体放松量：通过衣服与身体之间的空隙判断，Slim 放松量 2-6cm，Regular 6-10cm，Relaxed 10-16cm，Oversized 16cm 以上。AI 将这四个标准应用于每张上传图片，综合判断版型类别，然后匹配品牌数据库中最接近的参考款。',
          contentEn: 'PatternAI analyzed all H&M and Zara model photos and identified four criteria for judging fit from images. 1) Shoulder seam position: at the shoulder point = Slim/Regular; dropped 2-4cm = Relaxed; dropped 5cm+ = Oversized. 2) Bust fit: body-hugging with visible curves = Slim; moderate contact with room = Regular; loose with drape = Relaxed; very loose, obscuring the figure = Oversized. 3) Waist definition: clearly narrowed = Slim; slightly narrowed = Regular; no waist shaping = Relaxed/Oversized. 4) Overall ease: Slim 2-6cm, Regular 6-10cm, Relaxed 10-16cm, Oversized 16cm+. AI applies all four criteria to each uploaded image, determines the fit category, then matches the closest reference garment in the brand database.',
          tips: [
            '判断版型时要多角度观察，正面图看肩线和胸部，侧面图看放松量',
            'Judge fit from multiple angles — front for shoulder and bust, side for ease',
            '如果衣服有弹性面料，判断版型时要考虑弹性回复，不要太紧才算 Slim',
            'For stretch fabrics, account for fabric recovery — don\'t require tightness for Slim',
          ]
        },
      ]
    },
  ]
}

// 学习手册元信息（书籍参考）
export const manualReferences = [
  {
    title: '服装制作基础事典',
    titleEn: 'Encyclopedia of Garment Making Basics',
    author: '郑淑玲',
    authorEn: 'Zheng Shuling',
    publisher: '河南科技出版社',
    publisherEn: 'Henan Science & Technology Press',
    parts: [
      'Part 1 服装构成基础概念',
      'Part 2 手缝、车缝、整烫技巧',
      'Part 3 裙子打版与制作',
      'Part 4 裤子打版与制作',
      'Part 5 女上装打版与制作',
    ]
  },
  {
    title: '服装版型研究室',
    titleEn: 'Pattern Research Lab',
    author: '丸山晴美',
    authorEn: 'Harumi Maruyama',
    publisher: '系列（上衣篇、裙子篇、裤子篇、洋装篇）',
    publisherEn: 'Series (Tops, Skirts, Pants, Dresses)',
    parts: [
      '上衣篇：22种身片、26种袖片、40种领片',
      '裙子篇：63种裙子基本型',
      '裤子篇：各式裤款制图与变化',
      '洋装篇：洋装制图、设计变化、打版',
    ]
  }
]
