const fs = require('fs');
const path = require('path');

// .env 파일이 존재하면 읽어서 환경 변수로 처리
let env = {};
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
          env[key] = val;
        }
      }
    });
    console.log('.env 파일 설정 로드 완료');
  }
} catch (e) {
  console.log('.env 파일 읽기 실패 또는 파일 없음');
}

// 환경 변수 또는 .env 파일 값 적용
const config = {
  apiKey: process.env.FIREBASE_API_KEY || env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID || ''
};

// 필수 값들이 설정되어 있는지 검증
const hasConfig = config.apiKey && config.projectId && config.appId;

let fileContent = '';
if (hasConfig) {
  fileContent = `// 환경 변수 또는 .env 설정을 기반으로 자동 생성되었습니다.
window.FIREBASE_BUILD_CONFIG = ${JSON.stringify(config, null, 2)};
`;
  console.log('Firebase 빌드 설정을 감지하여 js/firebase-config.js 에 주입했습니다.');
} else {
  fileContent = `// Firebase 설정을 이곳에 직접 입력하면 프로그램에 저장되어 실행됩니다.
window.FIREBASE_BUILD_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 설정값 입력 여부 자동 검증 (값이 비어있으면 데모 모드로 작동합니다)
if (window.FIREBASE_BUILD_CONFIG.apiKey === "" || !window.FIREBASE_BUILD_CONFIG.apiKey) {
  window.FIREBASE_BUILD_CONFIG = null;
}
`;
  console.log('Firebase 환경 변수 설정을 감지하지 못했습니다. 직접 입력할 수 있는 템플릿을 생성했습니다.');
}

const targetPath = path.join(__dirname, 'js', 'firebase-config.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Firebase 설정 컴파일 완료:', targetPath);

// Vercel 배포를 위해 public 폴더 구성 (Vercel 기본 출력 디렉토리인 public에 맞춤)
try {
  const publicDir = path.join(__dirname, 'public');
  
  // 기존 public 폴더가 있다면 삭제 후 재생성 (클린 빌드)
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
  fs.mkdirSync(publicDir, { recursive: true });

  // HTML 및 SVG 파일 복사
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(publicDir, 'index.html'));
  if (fs.existsSync(path.join(__dirname, 'world-map.min.svg'))) {
    fs.copyFileSync(path.join(__dirname, 'world-map.min.svg'), path.join(publicDir, 'world-map.min.svg'));
  }

  // 주요 에셋 폴더 복사 (css, images, js)
  const dirsToCopy = ['css', 'images', 'js'];
  dirsToCopy.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(publicDir, dir);
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true });
    }
  });

  // public/js/firebase-config.js 에도 동일하게 환경 변수 설정 반영
  const publicConfigPath = path.join(publicDir, 'js', 'firebase-config.js');
  fs.writeFileSync(publicConfigPath, fileContent, 'utf8');

  console.log('Vercel 배포용 public 폴더 빌드 완료');
} catch (e) {
  console.error('public 폴더 빌드 중 에러 발생:', e);
}


