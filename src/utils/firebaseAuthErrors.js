const messages = {
  'auth/email-already-in-use': '이미 사용 중인 이메일이에요.',
  'auth/invalid-email': '이메일 형식이 올바르지 않아요.',
  'auth/operation-not-allowed': '이 로그인 방식이 비활성화되어 있어요.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 해요.',
  'auth/user-disabled': '비활성화된 계정이에요.',
  'auth/user-not-found': '가입되지 않은 이메일이에요.',
  'auth/wrong-password': '비밀번호가 일치하지 않아요.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않아요.',
  'auth/too-many-requests': '시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
  'auth/popup-closed-by-user': 'Google 로그인 창이 닫혔어요.',
  'auth/popup-blocked': '팝업이 차단되었어요. 브라우저 설정을 확인해 주세요.',
  'auth/network-request-failed': '네트워크 연결을 확인해 주세요.',
}

export function getFirebaseAuthErrorMessage(error) {
  if (!error) return '로그인에 실패했어요. 다시 시도해 주세요.'
  if (error.code && messages[error.code]) return messages[error.code]
  if (error.message) return error.message
  return '로그인에 실패했어요. 다시 시도해 주세요.'
}
