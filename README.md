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
- `GET /api/transactions` - 모든 거래 내역 조회
- `GET /api/transactions/:id` - 특정 거래 내역 조회
- `POST /api/transactions` - 새 거래 내역 추가
- `PUT /api/transactions/:id` - 거래 내역 수정
- `DELETE /api/transactions/:id` - 거래 내역 삭제
- `GET /api/transactions/stats/summary` - 통계 정보 조회

## 사용법

1. **회원가입/로그인**: 애플리케이션 접속 후 계정 생성 또는 로그인
2. **대시보드**: 총 수입, 지출, 잔액을 한눈에 확인
3. **거래 추가**: '새 거래 추가' 버튼으로 수입/지출 내역 등록
4. **거래 관리**: 거래 내역 페이지에서 모든 거래 조회 및 삭제

## 주요 특징
- JWT 토큰 기반 보안 인증
- 실시간 잔액 계산 및 통계
- 카테고리별 거래 분류
- 반응형 웹 디자인
- RESTful API 설계

## 브라우저 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 개발 환경
- React 18 with TypeScript
- Express.js 5
- MongoDB with Mongoose
- JWT Authentication
- Axios for HTTP requests