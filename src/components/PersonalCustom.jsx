import { useState, useCallback } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { gradingRules, garmentInfo } from '../data/mockData.js'
import { addHistoryRecord } from '../utils/storage.js'
import UploadScreen from './UploadScreen.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import ResultScreen from './ResultScreen.jsx'

export default function PersonalCustom({ userPurpose = 'personal' }) {
  const { t } = useLang()
  const [screen, setScreen] = useState('upload') // upload → loading → result
  const [images, setImages] = useState([])
  const [uploadMetadata, setUploadMetadata] = useState(null)
  const [currentRecordId, setCurrentRecordId] = useState(null)
  const [currentVersion, setCurrentVersion] = useState(1)
  const [currentCustomSizes, setCurrentCustomSizes] = useState(null)
  const [currentSizeLabel, setCurrentSizeLabel] = useState('Custom')

  const handleUpload = useCallback((imgs, metadata) => {
    setImages(imgs)
    setUploadMetadata(metadata)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    const record = addHistoryRecord({
      garmentName: garmentInfo.name,
      garmentNameEn: garmentInfo.nameEn,
      thumbnail: images && images.length > 0 ? images[0] : '',
      images: images || [],
      sizeLabel: 'Custom',
      customSizes: null,
      metadata: uploadMetadata,
    })
    setCurrentRecordId(record.id)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel('Custom')
    setScreen('result')
  }, [images, uploadMetadata])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
    setCurrentRecordId(null)
    setCurrentVersion(1)
    setCurrentCustomSizes(null)
    setCurrentSizeLabel('Custom')
    setUploadMetadata(null)
  }, [])

  // "我的尺寸" 标签里用户填了身材数据后重新生成
  const handleRegenerate = useCallback((newCustomSizes, newSizeLabel) => {
    setCurrentCustomSizes(newCustomSizes)
    setCurrentSizeLabel(newSizeLabel || 'Custom')
  }, [])

  // ===== 上传页 =====
  if (screen === 'upload') {
    return <UploadScreen onUpload={handleUpload} />
  }

  // ===== 生成中 =====
  if (screen === 'loading') {
    return (
      <LoadingScreen
        imageCount={images.length}
        onComplete={handleAnalysisComplete}
      />
    )
  }

  // ===== 结果页 =====
  return (
    <ResultScreen
      images={images}
      onReset={handleReset}
      userPurpose="personal"
      recordId={currentRecordId}
      currentVersion={currentVersion}
      customSizes={currentCustomSizes}
      sizeLabel={currentSizeLabel}
      onRegenerate={handleRegenerate}
      uploadMetadata={uploadMetadata}
    />
  )
}
