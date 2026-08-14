# 智裁 PatternAI — 中国大陆部署指南

## 方案一：EdgeOne Pages（腾讯云）— 推荐，大陆最快

### 前置条件
- 腾讯云账号（需实名认证）
- GitHub 或 Gitee 账号

### 步骤

1. **推送代码到 GitHub/Gitee**
   ```bash
   git init
   git add .
   git commit -m "PatternAI - 服装纸样生成工具"
   # 创建仓库后执行：
   git remote add origin https://github.com/你的用户名/garment-pattern-app.git
   git push -u origin main
   ```

2. **开通 EdgeOne Pages**
   - 访问 https://console.cloud.tencent.com/edgeone
   - 左侧导航选择「Pages 服务」→「立即开通」

3. **创建项目**
   - 点击「从 Git 仓库导入」
   - 授权并选择你的 GitHub/Gitee 仓库
   - 填写构建设置：
     ```
     构建命令: npm run build
     输出目录: dist
     ```

4. **部署完成**
   - 等待 1-2 分钟自动构建
   - 获得 `*.eo.edgeone.app` 域名，大陆可直接访问
   - 可在「项目设置」中绑定自定义域名

---

## 方案二：Cloudflare Pages — 备选，免费无限带宽

### 步骤

1. **推送代码到 GitHub**（同上）

2. **连接 Cloudflare Pages**
   - 访问 https://dash.cloudflare.com → Workers & Pages
   - 点击「Create application」→「Pages」→「Connect to Git」
   - 选择 GitHub 仓库

3. **构建设置**
   ```
   框架预设: Vite
   构建命令: npm run build
   输出目录: dist
   ```

4. **部署完成**
   - 获得 `*.pages.dev` 域名
   - 大陆大部分地区可访问，偶有波动

---

## 方案三：Vercel — 备选

### 步骤

1. 推送代码到 GitHub
2. 访问 https://vercel.com/new
3. 导入 GitHub 仓库（自动识别 Vite 框架）
4. 点击 Deploy
5. 获得 `*.vercel.app` 域名

---

## 方案四：Netlify 拖拽部署 — 最简单

### 步骤

1. 本地执行 `npm run build`
2. 访问 https://app.netlify.com/drop
3. 将 `dist` 文件夹拖到页面上
4. 10 秒内上线，获得 `*.netlify.app` 域名

---

## 注意事项

- 以上平台的默认域名均**无需 ICP 备案**
- 如需绑定自定义域名（如 `pattern.example.com`），则需完成 ICP 备案
- **大陆访问稳定性排序**：EdgeOne Pages > Cloudflare Pages > Vercel > Netlify > GitHub Pages
- GitHub Pages 不推荐面向大陆用户使用
