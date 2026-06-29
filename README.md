# 🌐 초등 6학년 사회과 세계 지리 학습 & 학습지 생성 프로그램

대한민국 2022 개정 초등 사회 교육과정(6학년 세계 여러 나라의 자연과 문화 단원)에 최적화된 인터랙티브 세계 지리 학습 및 인쇄용 커스텀 학습지 생성기 웹 프로그램입니다.

---

## 🚀 주요 기능
1.  **세계 지도 탐색**: 대륙별 필터 및 검색이 포함된 인터랙티브 SVG 지도를 통해 34개 핵심 국가의 수도, 국기, 위치, 상세 상식 정보 학습.
2.  **온라인 퀴즈 게임**: 국기, 수도, 지도 위치 매칭 퀴즈를 하트(생명) 기반 게임으로 풀어보며 점수 획득 및 칭호 배지 수집.
3.  **학습지 자동 컴파일러 (인쇄/PDF)**: 교사가 문항 수, 문제 유형(객관식, 주관식, 선긋기형), 대륙 범위를 조절하여 A4 크기 정식 학습지 및 정답지를 브라우저 인쇄 창을 통해 즉시 출력.
4.  **효과음 합성**: Web Audio API 기술을 사용하여 외부 리소스 연결 없이 실시간 오디오 신디사이저음 구현.
5.  **Firebase 인증 연동**: 실제 파이어베이스 연동 및 로컬 가상DB(localStorage 기반)를 활용한 체험 모드 병행.

---

## 💻 로컬에서 즉시 실행하기
이 프로그램은 빌드 도구 없이 브라우저에서 실행 가능합니다.
1.  프로젝트 폴더 내 `index.html` 파일을 **더블 클릭**하여 크롬 또는 에지 브라우저로 엽니다.
2.  **"로그인 없이 체험하기 (데모 모드)"** 버튼을 클릭하여 즉시 모든 기능을 체험합니다.

---

## ☁️ Firebase 연동 설정 (두 가지 방법)

### 방법 1. 웹 화면 내 실시간 설정 (간편)
1.  로컬 체험 모드로 로그인한 뒤, 화면 우측 상단 톱니바퀴 아이콘(⚙️)을 누릅니다.
2.  선생님의 Firebase 프로젝트 설정(API Key, Project ID 등)을 입력하고 저장합니다.
3.  자동으로 페이지가 새로고침되며 입력하신 Firebase Firestore 및 Auth와 실시간 동기화됩니다.

### 방법 2. Vercel 배포 시 환경 변수 주입 (보안 권장)
Vercel에 배포할 때 아래 대목의 Vercel 환경 변수 설정을 완료하면 사용자가 별도로 입력하지 않아도 자동으로 Firebase 연동 상태로 배포됩니다.

---

## 🛠️ GitHub & Vercel 배포 방법

이 프로젝트는 Vercel 배포 시 빌드 과정을 거쳐 파이어베이스 설정을 안전하게 주입할 수 있도록 `package.json` 및 `build.js`가 미리 구성되어 있습니다.

### 1단계. GitHub에 코드 푸시하기
1.  본인의 GitHub에 새로운 Repository를 생성합니다.
2.  프로젝트 루트 폴더에서 깃을 초기화하고 원격 저장소에 업로드합니다.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <본인의_깃허브_주소>
    git push -u origin main
    ```
    *(참고: `.gitignore`가 설정되어 있으므로 프로덕션 파이어베이스 환경변수 데이터나 `node_modules`는 깃허브에 공유되지 않아 안전합니다.)*

### 2단계. Vercel에 프로젝트 임포트하기
1.  [Vercel Dashboard](https://vercel.com/dashboard)에 로그인합니다.
2.  **"Add New..."** ➡️ **"Project"**를 선택합니다.
3.  1단계에서 생성한 GitHub Repository를 찾아 **"Import"**를 누릅니다.

### 3단계. 빌드 명령어 및 환경 변수 설정
1.  **Configure Project** 화면의 **Build and Output Settings**를 펼칩니다.
2.  **Build Command**를 활성화(OVERRIDE)하고 `npm run build`를 기입합니다.
3.  **Environment Variables** 영역에 아래 6가지 환경 변수 키와 값을 차례로 추가합니다.
    *   `FIREBASE_API_KEY`: *(선생님의 Firebase API Key)*
    *   `FIREBASE_AUTH_DOMAIN`: *(프로젝트-아이디.firebaseapp.com)*
    *   `FIREBASE_PROJECT_ID`: *(프로젝트-아이디)*
    *   `FIREBASE_STORAGE_BUCKET`: *(프로젝트-아이디.appspot.com)*
    *   `FIREBASE_MESSAGING_SENDER_ID`: *(메시징 샌더 아이디)*
    *   `FIREBASE_APP_ID`: *(1:123456:web:abcd...)*
4.  하단의 **"Deploy"** 버튼을 클릭하여 배포를 시작합니다.
5.  배포 완료 시 배정된 Vercel URL 주소로 접속하면, 별도의 실시간 설정 입력 없이 즉시 로그인 및 회원가입 시 실제 파이어베이스 DB(Firestore)로 저장됩니다.

---

## 📂 프로젝트 구조
```
├── css/
│   ├── style.css       # 화면 시각화용 메인 스타일시트
│   └── print.css       # 학습지 인쇄(A4)용 스타일시트
├── js/
│   ├── map-svg.js      # SVG 지도 데이터를 보관하는 JS String
│   ├── data.js         # 34개 핵심 국가의 지리 및 설명 메타데이터
│   ├── auth.js         # Firebase Auth 및 로컬 가상DB 조율 모듈
│   ├── map.js          # 지도 렌더링 및 클릭/호버 감지 리스너
│   ├── quiz.js         # 퀴즈 로직 및 효과음 합성(Web Audio API) 모듈
│   ├── worksheet.js    # 인쇄용 학습지 컴파일/조판 모듈
│   ├── firebase-config.js # 빌드 시 환경변수가 최종 주입될 설정 파일
│   └── app.js          # 뷰 라우팅 및 테마 제어 메인 컨트롤러
├── index.html          # 메인 HTML 마크업
├── world-map.min.svg   # 원본 SVG 벡터 지도 리소스
├── build.js            # Vercel 빌드 타임 환경변수 주입 스크립트
├── package.json        # Vercel 배포 빌드 규격 정의
├── .gitignore          # 깃 유실 방지 및 보안 무시 규칙 설정
└── README.md           # 안내 문서
```
