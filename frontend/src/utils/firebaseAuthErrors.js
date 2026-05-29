const FIREBASE_CODE_TO_KEY = {
  'auth/email-already-in-use': 'authErrorEmailInUse',
  'auth/invalid-email': 'authErrorInvalidEmail',
  'auth/operation-not-allowed': 'authErrorOperationNotAllowed',
  'auth/weak-password': 'authErrorWeakPassword',
  'auth/user-disabled': 'authErrorUserDisabled',
  'auth/user-not-found': 'authErrorUserNotFound',
  'auth/wrong-password': 'authErrorWrongPassword',
  'auth/invalid-credential': 'authErrorInvalidCredential',
  'auth/too-many-requests': 'authErrorTooManyRequests',
  'auth/popup-closed-by-user': 'authErrorPopupClosed',
  'auth/popup-blocked': 'authErrorPopupBlocked',
  'auth/network-request-failed': 'authErrorNetwork',
  'auth/requires-recent-login': 'authErrorReauthRequired',
}

export function createAppError(key) {
  const err = new Error(key)
  err.key = key
  return err
}

export function getFirebaseAuthErrorMessage(error, t) {
  if (!error) return t('authErrorGeneric')

  if (error.key) return t(error.key)

  const mappedKey = error.code && FIREBASE_CODE_TO_KEY[error.code]
  if (mappedKey) return t(mappedKey)

  if (error.message && !error.code) return error.message

  return t('authErrorGeneric')
}
