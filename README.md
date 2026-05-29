# mumu

무사시노 국제기숙사 중고거래 플랫폼

## 구조

```
mumu/
├── frontend/     # React + Vite
├── backend/      # Express — 이미지 업로드·무손실 최적화 API
└── README.md
```

## 로컬 실행

### 프론트만

```bash
cd frontend
cp .env.example .env   # Firebase 등 설정
npm install
npm run dev
```

### 프론트 + 백엔드 (이미지 업로드)

터미널 1 — API:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

터미널 2 — Vite (`frontend/.env`에 `UPLOAD_PROXY_TARGET=http://127.0.0.1:3000`):

```bash
cd frontend
npm run dev
```

또는 루트에서 한 번에:

```bash
npm install          # concurrently
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
npm run dev:all
```

## 이미지 업로드 연동

| 항목 | 값 |
|------|-----|
| 프론트 업로드 URL | `VITE_UPLOAD_API_URL=/api/upload` (기본) |
| Vite 프록시 | `/api`, `/uploads` → `http://127.0.0.1:3000` |
| API | `POST /api/upload` — `multipart/form-data`, 필드명 `file` |
| 응답 | `{ "url": "/uploads/<uuid>.webp", "imageUrl": "...", ... }` |
| 최적화 | Sharp 무손실(WebP/PNG/AVIF) + EXIF 회전·최대 2048px 리사이즈 |

프론트는 업로드 전 브라우저에서 1차 리사이즈(`prepareImageForUpload`), 서버에서 2차 무손실 압축을 수행합니다.

## Firestore (물품 등록)

물품은 `listings` 컬렉션에 저장됩니다. **`Missing or insufficient permissions`** 가 나오면 규칙이 아직 배포되지 않은 것입니다.

1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 `mumu-44493` (본인 프로젝트)
2. **Firestore Database** → **규칙(Rules)**
3. `frontend/firestore.rules` 내용 전체를 붙여넣기 → **게시(Publish)**

CLI 사용 시 (Firebase CLI 설치 후):

```bash
firebase deploy --only firestore:rules
```

(프로젝트 루트의 `firebase.json` 참고)

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 프론트 개발 서버 |
| `npm run dev:backend` | Express API |
| `npm run dev:all` | 프론트 + API 동시 실행 |
| `npm run build` | 프론트 프로덕션 빌드 |
