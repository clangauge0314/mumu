import { toast } from 'sonner'
import { translations } from '../config/locales'
import { translate, translateAtRuntime } from '../hooks/useTranslation'
import { useLanguageStore } from '../store/useLanguageStore'
import { getFirebaseAuthErrorMessage } from './firebaseAuthErrors'

function resolveMessage(keyOrText, vars) {
  const locale = useLanguageStore.getState().locale
  const hasKey =
    translations[locale]?.[keyOrText] != null ||
    translations.ko[keyOrText] != null

  return hasKey ? translate(locale, keyOrText, vars) : keyOrText
}

export const i18nToast = {
  success: (key, vars) => toast.success(translateAtRuntime(key, vars)),
  error: (keyOrText, vars) => toast.error(resolveMessage(keyOrText, vars)),
  warning: (key, vars) => toast.warning(translateAtRuntime(key, vars)),
  info: (key, vars) => toast.info(translateAtRuntime(key, vars)),

  /** 언어 변경 직후 — 선택한 언어로 메시지 표시 */
  successForLocale: (locale, key, vars) =>
    toast.success(translate(locale, key, vars)),

  authError: (error) =>
    toast.error(getFirebaseAuthErrorMessage(error, translateAtRuntime)),
}
