import { translations } from '../config/locales'
import { useLanguageStore } from '../store/useLanguageStore'

export function translate(locale, key, vars) {
  let text = translations[locale]?.[key] ?? translations.ko[key] ?? key

  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, String(value))
    })
  }

  return text
}

/** 토스트 등 호출 시점의 locale 기준 (스토어 최신값) */
export function translateAtRuntime(key, vars) {
  const locale = useLanguageStore.getState().locale
  return translate(locale, key, vars)
}

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale)
  const t = (key, vars) => translate(locale, key, vars)

  return { t, locale, translate }
}
