import { useState, useRef } from 'react'

export default function UploadScreen({ onUpload }) {
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImages = [...images]
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        newImages.push(ev.target.result)
        setImages([...newImages])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (idx) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleStart = () => {
    onUpload(images)
  }

  return (
    <div className="page-content fade-in">
      <div className="upload-screen">
        <div className="upload-hero">
          <div className="upload-hero-icon">✂️</div>
          <h1>智裁 PatternAI</h1>
          <p>上传多张服装图片（正面、背面、细节等）<br/>AI 自动识别款式，生成纸样图纸与新手教程</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Upload zone */}
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">📷</div>
          <div className="upload-zone-text">点击上传服装图片</div>
          <div className="upload-zone-hint">支持多张 · 拍照或相册选择 · JPG/PNG</div>
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="image-preview-grid slide-up">
            {images.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img} alt={`预览 ${i + 1}`} className="image-preview-img" />
                <div className="image-preview-badge">{i === 0 ? '正面' : i === 1 ? '背面' : `细节${i - 1}`}</div>
                <button
                  className="image-preview-remove"
                  onClick={(e) => { e.stopPropagation(); handleRemove(i) }}
                >
                  ✕
                </button>
              </div>
            ))}
            {/* Add more button */}
            {images.length < 6 && (
              <div className="image-preview-add" onClick={() => fileInputRef.current?.click()}>
                <span className="image-preview-add-icon">+</span>
                <span className="image-preview-add-text">添加</span>
              </div>
            )}
          </div>
        )}

        {images.length > 0 && (
          <button className="btn btn-primary slide-up" onClick={handleStart} style={{ marginTop: 16 }}>
            🔍 开始 AI 识别（{images.length} 张图片）
          </button>
        )}

        <div className="upload-features">
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(108,92,231,0.1)' }}>📐</div>
            <div className="upload-feature-text">
              <h4>自动纸样生成</h4>
              <p>识别款式结构，生成各裁片纸样图纸</p>
            </div>
          </div>
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(0,206,201,0.1)' }}>📚</div>
            <div className="upload-feature-text">
              <h4>新手教程</h4>
              <p>图解纸样符号、缝制步骤，小白也能做</p>
            </div>
          </div>
          <div className="upload-feature">
            <div className="upload-feature-icon" style={{ background: 'rgba(253,203,110,0.15)' }}>📄</div>
            <div className="upload-feature-text">
              <h4>中英双语 PDF</h4>
              <p>纸样标注中英双语，支持自定义尺寸导出</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
