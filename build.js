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

