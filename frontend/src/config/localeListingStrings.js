/** 출품(물품 등록) 폼 번역 */

export const listingStrings = {
  ko: {
    listingFormTitle: '기숙사 물품 등록',
    listingTitlePlaceholder: '상품명',
    listingPricePlaceholder: '가격 (원)',
    listingDescriptionPlaceholder:
      '물품 상태, 픽업 장소(동·호실) 등을 적어 주세요',
    listingPhotoUpload: '사진 업로드 ({count}/6)',
    listingRemovePhoto: '사진 제거',
    listingCancel: '취소',
    listingSubmitDraft: '임시 등록',
    listingUploading: '사진 최적화·업로드 중…',
    listingUploadFailed: '사진 업로드에 실패했어요. 다시 시도해 주세요.',
    uploadApiNotConfigured:
      '업로드 API가 설정되지 않았어요. .env의 VITE_UPLOAD_API_URL을 확인해 주세요.',
    listingImageTypeError: 'JPEG, PNG, WebP, AVIF, GIF만 업로드할 수 있어요.',
    listingImageSizeError: '사진은 15MB 이하만 업로드할 수 있어요.',
  },
  en: {
    listingFormTitle: 'List item in dorm',
    listingTitlePlaceholder: 'Item title',
    listingPricePlaceholder: 'Price (KRW)',
    listingDescriptionPlaceholder:
      'Condition, pickup location (building & room), etc.',
    listingPhotoUpload: 'Upload photos ({count}/6)',
    listingRemovePhoto: 'Remove photo',
    listingCancel: 'Cancel',
    listingSubmitDraft: 'Submit (draft)',
    listingUploading: 'Optimizing and uploading photos…',
    listingUploadFailed: 'Photo upload failed. Please try again.',
    uploadApiNotConfigured:
      'Upload API is not configured. Set VITE_UPLOAD_API_URL in .env.',
    listingImageTypeError: 'Only JPEG, PNG, WebP, AVIF, and GIF are allowed.',
    listingImageSizeError: 'Each photo must be 15MB or smaller.',
  },
  'zh-CN': {
    listingFormTitle: '宿舍物品发布',
    listingTitlePlaceholder: '商品名称',
    listingPricePlaceholder: '价格（韩元）',
    listingDescriptionPlaceholder: '物品状况、取货地点（楼栋·房间）等',
    listingPhotoUpload: '上传照片 ({count}/6)',
    listingRemovePhoto: '删除照片',
    listingCancel: '取消',
    listingSubmitDraft: '临时提交',
    listingUploading: '正在优化并上传照片…',
    listingUploadFailed: '照片上传失败，请重试。',
    uploadApiNotConfigured: '未配置上传 API，请设置 VITE_UPLOAD_API_URL。',
    listingImageTypeError: '仅支持 JPEG、PNG、WebP、AVIF、GIF。',
    listingImageSizeError: '每张照片不得超过 15MB。',
  },
  'zh-TW': {
    listingFormTitle: '宿舍物品刊登',
    listingTitlePlaceholder: '商品名稱',
    listingPricePlaceholder: '價格（韓元）',
    listingDescriptionPlaceholder: '物品狀況、取貨地點（棟別·房號）等',
    listingPhotoUpload: '上傳照片 ({count}/6)',
    listingRemovePhoto: '刪除照片',
    listingCancel: '取消',
    listingSubmitDraft: '暫時提交',
    listingUploading: '正在最佳化並上傳照片…',
    listingUploadFailed: '照片上傳失敗，請再試一次。',
    uploadApiNotConfigured: '未設定上傳 API，請設定 VITE_UPLOAD_API_URL。',
    listingImageTypeError: '僅支援 JPEG、PNG、WebP、AVIF、GIF。',
    listingImageSizeError: '每張照片不得超過 15MB。',
  },
  ja: {
    listingFormTitle: '寮の出品登録',
    listingTitlePlaceholder: '商品名',
    listingPricePlaceholder: '価格（ウォン）',
    listingDescriptionPlaceholder:
      '状態、受け渡し場所（棟・部屋番号）などを記入',
    listingPhotoUpload: '写真をアップロード ({count}/6)',
    listingRemovePhoto: '写真を削除',
    listingCancel: 'キャンセル',
    listingSubmitDraft: '仮登録',
    listingUploading: '写真を最適化してアップロード中…',
    listingUploadFailed: '写真のアップロードに失敗しました。もう一度お試しください。',
    uploadApiNotConfigured:
      'アップロード API が未設定です。VITE_UPLOAD_API_URL を設定してください。',
    listingImageTypeError: 'JPEG、PNG、WebP、AVIF、GIFのみアップロードできます。',
    listingImageSizeError: '1枚15MB以下の写真のみアップロードできます。',
  },
  de: {
    listingFormTitle: 'Artikel im Wohnheim einstellen',
    listingTitlePlaceholder: 'Titel',
    listingPricePlaceholder: 'Preis (KRW)',
    listingDescriptionPlaceholder:
      'Zustand, Abholort (Gebäude & Zimmer) usw.',
    listingPhotoUpload: 'Fotos hochladen ({count}/6)',
    listingRemovePhoto: 'Foto entfernen',
    listingCancel: 'Abbrechen',
    listingSubmitDraft: 'Vorläufig einreichen',
    listingUploading: 'Fotos werden optimiert und hochgeladen…',
    listingUploadFailed:
      'Foto-Upload fehlgeschlagen. Bitte erneut versuchen.',
    uploadApiNotConfigured:
      'Upload-API nicht konfiguriert. VITE_UPLOAD_API_URL in .env setzen.',
    listingImageTypeError:
      'Nur JPEG, PNG, WebP, AVIF und GIF sind erlaubt.',
    listingImageSizeError: 'Jedes Foto darf höchstens 15 MB groß sein.',
  },
}
