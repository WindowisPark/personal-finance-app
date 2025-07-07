# Personal Finance App

개인 가계부 웹 애플리케이션 - 수입과 지출을 체계적으로 관리할 수 있는 풀스택 웹 애플리케이션

## 기술 스택
- **Frontend**: React, TypeScript, React Router, Axios
- **Backend**: Node.js, Express, JWT 인증
- **Database**: MongoDB, Mongoose
- **Authentication**: bcryptjs, jsonwebtoken

## 주요 기능
- 🔐 **사용자 인증**: JWT 기반 회원가입/로그인
- 💰 **수입/지출 관리**: 카테고리별 거래 내역 추가/삭제
- 📊 **대시보드**: 총 수입, 지출, 잔액 통계
- 📱 **반응형 디자인**: 모바일 친화적 UI

## 프로젝트 구조
```
personal-finance-app/
├── backend/                    # Express 서버
│   ├── config/
│   │   └── database.js         # MongoDB 연결 설정
│   ├── middleware/
│   │   └── auth.js            # JWT 인증 미들웨어
│   ├── models/
│   │   ├── User.js            # 사용자 모델
│   │   └── Transaction.js     # 거래 내역 모델
│   ├── routes/
│   │   ├── auth.js            # 인증 라우트
│   │   └── transactions.js    # 거래 내역 라우트
│   ├── .env                   # 환경변수 설정
│   ├── index.js               # 서버 진입점
│   └── package.json
├── frontend/                   # React 애플리케이션
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # 네비게이션 바
│   │   │   └── Navbar.css
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # 인증 컨텍스트
│   │   ├── pages/
│   │   │   ├── Login.tsx      # 로그인 페이지
│   │   │   ├── Register.tsx   # 회원가입 페이지
│   │   │   ├── Dashboard.tsx  # 대시보드
│   │   │   ├── Transactions.tsx # 거래 내역 페이지
│   │   │   ├── Auth.css       # 인증 페이지 스타일
│   │   │   ├── Dashboard.css  # 대시보드 스타일
│   │   │   └── Transactions.css # 거래 내역 스타일
│   │   ├── App.tsx            # 메인 컴포넌트
│   │   └── index.tsx
│   └── package.json
└── README.md
```

## 설치 및 실행 방법

### 1. 사전 준비사항
- Node.js (v14 이상)
- MongoDB (로컬 또는 클라우드)
- npm 또는 yarn

### 2. 프로젝트 클론
```bash
git clone <repository-url>
cd personal-finance-app
```

### 3. 백엔드 설정 및 실행
```bash
cd personal-finance-app/backend
npm install

# 환경변수 설정 (.env 파일 수정)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/personal-finance-app
# JWT_SECRET=your-jwt-secret-key

# 개발 서버 실행
npm run dev

# 또는 프로덕션 실행
npm start
```

### 4. 프론트엔드 설정 및 실행
```bash
cd personal-finance-app/frontend
npm install

# 개발 서버 실행
npm start
```

## API 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 거래 내역 (Transactions)
- `GET /api/transactions` - 모든 거래 내역 조회 (필터링 지원)
  - 쿼리 파라미터: `type`, `category`, `startDate`, `endDate`
- `GET /api/transactions/:id` - 특정 거래 내역 조회
- `POST /api/transactions` - 새 거래 내역 추가
- `PUT /api/transactions/:id` - 거래 내역 수정
- `DELETE /api/transactions/:id` - 거래 내역 삭제
- `GET /api/transactions/stats/summary` - 통계 정보 조회

### 카테고리 (Categories)
- `GET /api/categories` - 모든 카테고리 조회 (기본 + 사용자 정의)
  - 쿼리 파라미터: `type` (income/expense)
- `POST /api/categories` - 새 카테고리 추가 (사용자 정의)
- `PUT /api/categories/:id` - 카테고리 수정 (사용자 정의만)
- `DELETE /api/categories/:id` - 카테고리 삭제 (사용자 정의만)

## 사용법

1. **회원가입/로그인**: 애플리케이션 접속 후 계정 생성 또는 로그인
2. **대시보드**: 총 수입, 지출, 잔액을 한눈에 확인
3. **거래 추가**: '새 거래 추가' 버튼으로 수입/지출 내역 등록
4. **거래 관리**: 거래 내역 페이지에서 모든 거래 조회, 수정, 삭제
5. **필터링 및 검색**: 
   - 날짜 범위, 카테고리별 필터링
   - 설명이나 카테고리로 실시간 검색
   - 빠른 필터: 이번달, 올해
6. **카테고리 관리**: 기본 카테고리 외에 사용자 정의 카테고리 생성

## 주요 특징
- **JWT 토큰 기반 보안 인증**
- **실시간 잔액 계산 및 통계**
- **카테고리별 거래 분류** (기본 + 사용자 정의)
- **고급 필터링 및 검색**
  - 날짜 범위 필터링 (월별, 연도별)
  - 카테고리별 필터링
  - 실시간 텍스트 검색
- **페이지네이션**으로 대용량 데이터 처리
- **거래 수정 기능**
- **반응형 웹 디자인**
- **RESTful API 설계**

## 브라우저 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 개발 환경
- React 18 with TypeScript
- Express.js 5
- MongoDB with Mongoose
- JWT Authentication
- Axios for HTTP requests

## 📈 개발 로드맵

### 1단계: 기본 기능 완성 ✅
- [x] **거래 수정 기능** 추가 - 프론트엔드에서 수정 버튼으로 기존 데이터 수정
- [x] **카테고리 관리** (기본 카테고리 + 사용자 정의)
  - 기본 카테고리: 수입 4개, 지출 9개 자동 제공
  - 사용자 정의 카테고리: 추가/수정/삭제 가능
  - 카테고리별 색상 및 아이콘 지원
- [x] **날짜 범위 필터링** (월별, 연도별 조회)
  - 시작일/종료일 직접 입력
  - 빠른 필터: "이번달", "올해" 버튼
- [x] **페이지네이션** (거래 내역이 많을 때)
  - 페이지당 10개 항목 표시
  - 이전/다음 버튼 및 페이지 번호 표시
- [x] **검색 기능** (설명, 카테고리로 검색)
  - 실시간 검색으로 즉시 결과 반영

### 2단계: 데이터 시각화 & 분석 강화 🚧
- [ ] **차트 라이브러리** 도입 (Recharts)
  - React 친화적이고 반응형 지원
  - 커스터마이징 용이
- [ ] **월별/연도별 지출·수입 그래프**
  - 바차트로 월별 수입/지출 비교
  - 연도별 트렌드 분석
- [ ] **카테고리별 지출 비중 시각화** (파이차트)
  - 지출 카테고리별 비중 표시
  - 색상 구분으로 직관적 이해
- [ ] **트렌드 분석** (수입/지출 라인차트)
  - 시간별 수입/지출 패턴 분석
  - 증감률 표시
- [ ] **예산 설정 및 초과 추적** 기능
  - 카테고리별 예산 설정
  - 예산 대비 지출 비율 표시
  - 예산 초과 시 알림

### 3단계: UX/UI 개선
- [ ] **다크모드** 지원
- [ ] **반응형 디자인** 개선 (모바일 최적화)
- [ ] **로딩 상태** 및 **에러 핸들링** 개선
- [ ] **알림/토스트** 시스템
- [ ] **UI 컴포넌트 라이브러리** 도입 (Material-UI, Ant Design)

### 4단계: 고급 기능
- [ ] **파일 업로드** (영수증 이미지)
- [ ] **반복 거래** 설정 (월급, 고정비)
- [ ] **목표 설정** (저축 목표, 지출 목표)
- [ ] **데이터 내보내기** (CSV, PDF)
- [ ] **백업/복원** 기능

### 5단계: 성능 & 보안
- [ ] **이메일 인증** 시스템
- [ ] **비밀번호 재설정** 기능
- [ ] **API 캐싱** (Redis)
- [ ] **로그 시스템** 구축
- [ ] **데이터 유효성 검증** 강화

### 6단계: 배포 & 운영
- [ ] **Docker 컨테이너화**
- [ ] **CI/CD 파이프라인** (GitHub Actions)
- [ ] **클라우드 배포** (Vercel, Heroku, AWS)
- [ ] **모니터링** 시스템
- [ ] **사용자 피드백** 수집

## 🛠️ 고도화를 위한 기술 스택

### 프론트엔드
- **Recharts**: React에 최적화된 차트 라이브러리, 반응형 지원 (2단계 도입 예정)
- **Material-UI (MUI)**: 구글 디자인 시스템, 접근성 우수
- **Zustand**: 경량 상태 관리, Redux보다 간단한 설정
- **React Query**: 서버 상태 관리, 캐싱 및 동기화 자동화

### 백엔드
- **Redis**: 세션 관리 및 캐싱, 성능 향상
- **Joi**: 데이터 유효성 검증, 강력한 스키마 시스템
- **Winston**: 로그 관리, 다양한 전송 옵션
- **Multer**: 파일 업로드 처리, 이미지 영수증 기능

### 배포 & 인프라
- **Docker**: 컨테이너화, 환경 일관성 보장
- **Vercel**: 프론트엔드 배포, 자동 빌드 및 CDN
- **Railway**: 백엔드 배포, MongoDB Atlas 연동 용이
- **GitHub Actions**: CI/CD 파이프라인, 자동 테스트 및 배포