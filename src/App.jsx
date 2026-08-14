import { useState, useCallback } from 'react'
import UploadScreen from './components/UploadScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('upload') // upload | loading | result
  const [images, setImages] = useState([])

  const handleUpload = useCallback((imgs) => {
    setImages(imgs)
    setScreen('loading')
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    setScreen('result')
  }, [])

  const handleReset = useCallback(() => {
    setImages([])
    setScreen('upload')
  }, [])

  return (
    <div className="app-shell">
      {screen === 'upload' && <UploadScreen onUpload={handleUpload} />}
      {screen === 'loading' && <LoadingScreen imageCount={images.length} onComplete={handleAnalysisComplete} />}
      {screen === 'result' && <ResultScreen images={images} onReset={handleReset} />}
    </div>
  )
}
