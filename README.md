# Node.js + Express 게시판 API (JWT 인증 포함)

## 프로젝트 소개
Express와 MySQL을 사용해 게시판 REST API를 구현했습니다.  
JWT 기반 인증(Authentication)과 작성자 기반 권한 처리(Authorization)를 적용했고,  
Validation 및 에러 처리 패턴을 통일해 안정적인 구조로 설계했습니다.

---

## 기술 스택
- Node.js
- Express
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt

---

## 폴더 구조
```
controllers/     # 요청/응답 처리
middleware/      # 인증, 에러 처리
model/           # DB 연결
router/          # 라우터
services/        # 비즈니스 로직
utils/           # 공통 유틸
app.js           # 서버 진입점
.env             # 환경 변수
```

---

## 주요 기능
### 인증 (JWT)
- 회원가입 (bcrypt 비밀번호 해싱)
- 로그인 (JWT 발급)
- Authorization Bearer 토큰 검증

### 권한 처리
- 게시글 생성 시 작성자(userId) 저장
- 작성자 본인만 수정/삭제 가능

### 게시글 기능
- 게시글 CRUD
- Pagination (limit / offset)
- 최신순 정렬
- 응답 구조 통일 (meta + posts)

---

## 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (.env)
루트에 `.env` 파일 생성:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=데이터베이스명

JWT_SECRET=아무문자열
JWT_EXPIRES_IN=1h
```

### 3. 서버 실행
```bash
npm run dev
# 또는
npm start
```

---

# API 명세

## Auth

### 회원가입
**POST /auth/signup**

#### Request
```json
{
  "email": "test@test.com",
  "password": "12345678"
}
```

#### Response (201)
```json
{
  "message": "회원가입 완료"
}
```

---

### 로그인
**POST /auth/login**

#### Request
```json
{
  "email": "test@test.com",
  "password": "12345678"
}
```

#### Response (200)
```json
{
  "token": "JWT_TOKEN"
}
```

---

## Posts

### 게시글 목록 조회
**GET /posts?limit=10&offset=0**

#### Response (200)
```json
{
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  },
  "posts": [
    {
      "id": 1,
      "title": "제목",
      "content": "내용",
      "createdAt": "2026-02-07T10:00:00.000Z",
      "updatedAt": "2026-02-07T10:00:00.000Z"
    }
  ]
}
```

---

### 게시글 상세 조회
**GET /posts/:id**

#### Response (200)
```json
{
  "id": 1,
  "title": "제목",
  "content": "내용",
  "createdAt": "2026-02-07T10:00:00.000Z",
  "updatedAt": "2026-02-07T10:00:00.000Z"
}
```

---

### 게시글 생성 (인증 필요)
**POST /posts**

#### Header
```
Authorization: Bearer {JWT_TOKEN}
```

#### Request
```json
{
  "title": "제목",
  "content": "내용"
}
```

#### Response (201)
```json
{
  "id": 1,
  "title": "제목",
  "content": "내용"
}
```

---

### 게시글 수정 (작성자만 가능)
**PATCH /posts/:id**

#### Header
```
Authorization: Bearer {JWT_TOKEN}
```

#### Request
```json
{
  "title": "수정된 제목"
}
```

#### Response (200)
```json
{
  "message": "게시글이 수정되었습니다"
}
```

---

### 게시글 삭제 (작성자만 가능)
**DELETE /posts/:id**

#### Header
```
Authorization: Bearer {JWT_TOKEN}
```

#### Response (200)
```json
{
  "message": "게시글이 삭제되었습니다"
}
```

---

## 인증 방식
모든 인증이 필요한 요청은 헤더에 토큰을 포함합니다.

```
Authorization: Bearer {JWT_TOKEN}
```

---

## 개선 예정 기능
- Refresh Token 적용# Node.js 게시판 API 서버

JWT 인증 기반 게시판 백엔드 API 프로젝트입니다.
회원가입/로그인, 게시글 CRUD, 권한 처리, 좋아요, 조회수, 페이징 등
실제 서비스에서 사용되는 기능을 중심으로 구현했습니다.

---

## 기술 스택

* Node.js
* Express
* MySQL
* JWT (jsonwebtoken)
* bcrypt
* dotenv

---

## 프로젝트 구조

```
controllers/   → 요청 처리 (req, res)
services/      → 비즈니스 로직
router/        → 라우팅 정의
middleware/    → 인증 및 공통 처리
utils/         → 에러, validation 등 공통 유틸
model/         → DB 연결
```

### 구조 분리 이유

* controller: HTTP 요청/응답 처리
* service: 실제 비즈니스 로직 처리
* router: URL 관리

→ **역할을 분리하여 유지보수성과 확장성을 고려한 구조**

---

## 핵심 설계 개념

### 1. 인증 (Authentication)

* JWT 기반 인증 구조
* 로그인 시 토큰 발급
* 요청 헤더의 Authorization 토큰 검증
* 인증 성공 시 `req.user`에 사용자 정보 저장

### 2. 권한 처리 (Authorization)

* 게시글 작성자만 수정/삭제 가능
* 서비스 레이어에서 작성자 확인 로직 수행

### 3. Soft Delete

* 게시글 삭제 시 실제 삭제하지 않고
* `deletedAt` 컬럼에 시간 기록
* 조회 시 `deletedAt IS NULL` 조건 적용

→ 데이터 복구 가능성과 안정성 고려

### 4. 좋아요 토글 구조

* `post_likes` 테이블 별도 분리
* `(postId, userId)` UNIQUE 제약
* 존재하면 삭제, 없으면 생성하는 토글 방식

---

## 주요 기능

### 인증

* 회원가입 (bcrypt 해싱)
* 로그인 (JWT 발급)
* 인증 미들웨어
* 토큰 기반 사용자 식별

### 게시글 기능

* 게시글 생성
* 게시글 조회 (목록/단건)
* 게시글 수정 (작성자만 가능)
* 게시글 삭제 (soft delete)

### 추가 기능

* Pagination (limit / offset)
* 제목 검색
* 정렬 (최신순 / 오래된순)
* 조회수 증가
* 좋아요 토글 기능
* 좋아요 수 집계

---

## API 예시

### 회원가입

```
POST /auth/signup
```

### 로그인

```
POST /auth/login
```

### 게시글 목록 조회

```
GET /posts?limit=10&offset=0&search=키워드&sort=newest
```

### 게시글 좋아요 토글

```
POST /posts/:id/like
Authorization: Bearer {token}
```

---

## 실행 방법

### 1. 프로젝트 설치

```
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일 생성

예시:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=데이터베이스명
JWT_SECRET=시크릿키
```

### 3. DB 스키마 적용

```
schema.sql 실행
```

### 4. 서버 실행

```
node app.js
```

---

## 데이터베이스 구조

### users

* id (PK)
* email (unique)
* password
* createdAt

### posts

* id (PK)
* title
* content
* userId (FK)
* views
* deletedAt
* createdAt
* updatedAt

### post_likes

* id (PK)
* postId (FK)
* userId (FK)
* UNIQUE(postId, userId)

---

## 프로젝트 목적

* Node.js 기반 REST API 설계 경험
* 인증/권한 처리 구조 이해
* 서비스 레이어 분리 구조 학습
* 실무형 게시판 기능 구현

- 게시글 검색 기능
- 배포 (클라우드 + DB)
- Swagger 문서화
