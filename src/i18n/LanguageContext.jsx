import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, LANGUAGES } from './translations.js'

const LanguageContext = createContext()

const STORAGE_KEY = 'patternai_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'zh-CN'
    } catch {
      return 'zh-CN'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  const t = useCallback((key, params) => {
    const dict = translations[lang] || translations['zh-CN'] || {}
    let str = dict[key] ?? key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      })
    }
    return str
  }, [lang])

  const changeLang = useCallback((newLang) => {
    setLang(newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback if not wrapped in provider
    return {
      lang: 'zh-CN',
      t: (key) => key,
      changeLang: () => {},
      languages: [],
    }
  }
  return ctx
}
