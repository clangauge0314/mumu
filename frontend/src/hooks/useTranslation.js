import { translations } from '../config/locales'
import { useLanguageStore } from '../store/useLanguageStore'

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale)

  const t = (key, vars) => {
    let text =
      translations[locale]?.[key] ?? translations.ko[key] ?? key

    if (vars) {
      Object.entries(vars).forEach(([name, value]) => {
        text = text.replace(`{${name}}`, String(value))
      })
    }

    return text
  }

  return { t, locale }
}
