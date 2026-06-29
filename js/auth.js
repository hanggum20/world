// Firebase 연동 및 데모 모드 지원 인증/데이터 관리 시스템
(function() {
  const CONFIG_KEY = 'fb_custom_config';
  const MOCK_USERS_KEY = 'mock_users_db';
  const MOCK_SESSION_KEY = 'mock_session_uid';
  const ADMIN_CONFIG_KEY = 'app_admin_config';

  let isDemo = true;
  let authInstance = null;
  let dbInstance = null;
  let currentUser = null;
  let authStateCallback = null;

  // 관리자 설정 헬퍼
  function getAdminConfig() {
    const saved = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { email: 'hg@g.cnees.kr', password: '123456' };
      }
    }
    return { email: 'hg@g.cnees.kr', password: '123456' };
  }

  // 1. Firebase 설정 로드 및 초기화
  function initFirebase() {
    let config = null;

    // Vercel 빌드 시점의 환경 변수가 주입된 전역 설정이 있으면 우선 사용
    if (window.FIREBASE_BUILD_CONFIG) {
      config = window.FIREBASE_BUILD_CONFIG;
      console.log("Vercel 빌드 환경 변수 Firebase 설정 로드");
    } else {
      const savedConfig = localStorage.getItem(CONFIG_KEY);
      if (savedConfig) {
        try {
          config = JSON.parse(savedConfig);
          console.log("로컬 저장소 Firebase 설정 로드");
        } catch (e) {
          console.error("로컬 저장소 Firebase 설정 파싱 실패:", e);
        }
      }
    }

    if (config) {
      try {
        // Firebase가 정의되어 있는지 확인
        if (typeof firebase !== 'undefined') {
          firebase.initializeApp(config);
          authInstance = firebase.auth();
          dbInstance = firebase.firestore();
          isDemo = false;
          console.log("실제 Firebase 연동 성공!");
          
          // 실시간 인증 상태 변경 감지 리스너 설정
          authInstance.onAuthStateChanged(function(user) {
            if (user) {
              currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0]
              };
              
              // Firestore에서 사용자 정보(역할 등) 조회
              dbInstance.collection('users').doc(user.uid).get().then(doc => {
                let role = 'student';
                if (doc.exists) {
                  role = doc.data().role || 'student';
                }
                
                // hg@g.cnees.kr의 경우 강제로 admin 역할 부여 및 Firestore 동기화
                if (user.email === 'hg@g.cnees.kr') {
                  role = 'admin';
                  if (!doc.exists || doc.data().role !== 'admin') {
                    dbInstance.collection('users').doc(user.uid).set({
                      role: 'admin',
                      displayName: '최고관리자',
                      points: 1000
                    }, { merge: true });
                  }
                }
                
                currentUser.role = role;
                if (authStateCallback) authStateCallback(currentUser);
              }).catch(err => {
                console.error("Firestore user data load error:", err);
                currentUser.role = (user.email === 'hg@g.cnees.kr') ? 'admin' : 'student';
                if (authStateCallback) authStateCallback(currentUser);
              });
            } else {
              currentUser = null;
              if (authStateCallback) authStateCallback(currentUser);
            }
          });
          return;
        }
      } catch (e) {
        console.error("Firebase 초기화 에러. 데모 모드로 전환합니다.", e);
      }
    }
    
    // 기본값: 데모/로컬 시뮬레이션 모드
    isDemo = true;
    console.log("오프라인 데모(로컬) 모드로 실행 중...");
    setupMockSession();
  }

  // 2. 데모 모드 세션 및 초기 사용자 DB 구축
  function setupMockSession() {
    const adminConfig = getAdminConfig();
    
    // 로컬 모드에서 가상 DB가 없으면 기본값으로 생성
    if (!localStorage.getItem(MOCK_USERS_KEY)) {
      const defaultUsers = [
        {
          uid: 'admin_uid',
          email: adminConfig.email,
          password: adminConfig.password,
          displayName: '전체관리자',
          role: 'admin',
          school: '한빛초등학교',
          grade: null,
          classNum: null,
          studentNum: null,
          teacherId: null,
          points: 0,
          completedQuizzes: [],
          completedFlashcards: [],
          badges: ['welcome'],
          flashcardStats: {},
          quizHistory: [],
          createdAt: new Date().toISOString()
        },
        {
          uid: 'teacher_uid',
          email: 'teacher@school.kr',
          password: 'teacher1234',
          displayName: '김선생',
          role: 'teacher',
          school: '한빛초등학교',
          grade: 6,
          classNum: 1,
          studentNum: null,
          teacherId: null,
          points: 0,
          completedQuizzes: [],
          completedFlashcards: [],
          badges: ['welcome'],
          flashcardStats: {},
          quizHistory: [],
          createdAt: new Date().toISOString()
        },
        {
          uid: 'guest_uid',
          email: 'guest@world.net',
          password: 'guest',
          displayName: '체험학생',
          role: 'student',
          school: '한빛초등학교',
          grade: 6,
          classNum: 1,
          studentNum: 1,
          teacherId: 'teacher_uid',
          points: 100,
          completedQuizzes: [],
          completedFlashcards: [],
          badges: ['welcome'],
          flashcardStats: {},
          quizHistory: [],
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
    } else {
      // 기존 DB가 있을 경우, 관리자 계정 없으면 삽입
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY));
      let changed = false;

      let adminUser = users.find(u => u.uid === 'admin_uid');
      if (!adminUser) {
        users.unshift({
          uid: 'admin_uid',
          email: adminConfig.email,
          password: adminConfig.password,
          displayName: '전체관리자',
          role: 'admin',
          school: '한빛초등학교',
          grade: null,
          classNum: null,
          studentNum: null,
          teacherId: null,
          points: 0,
          completedQuizzes: [],
          completedFlashcards: [],
          badges: ['welcome'],
          flashcardStats: {},
          quizHistory: [],
          createdAt: new Date().toISOString()
        });
        changed = true;
      } else {
        // 이미 관리자 유저가 존재하면 config와 동기화
        if (adminUser.email !== adminConfig.email || adminUser.password !== adminConfig.password) {
          adminUser.email = adminConfig.email;
          adminUser.password = adminConfig.password;
          changed = true;
        }
      }

      // 기존 사용자에 role 필드 없으면 기본값 부여
      users.forEach(u => {
        if (!u.role) {
          u.role = (u.uid === 'guest_uid') ? 'student' : 'student';
          changed = true;
        }
        if (u.quizHistory === undefined) { u.quizHistory = []; changed = true; }
        if (u.completedFlashcards === undefined) { u.completedFlashcards = []; changed = true; }
        if (u.flashcardStats === undefined) { u.flashcardStats = {}; changed = true; }
      });

      if (changed) localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    }

    // 세션 유지 확인
    const activeUid = localStorage.getItem(MOCK_SESSION_KEY);
    if (activeUid) {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY));
      const found = users.find(u => u.uid === activeUid);
      if (found) {
        currentUser = {
          uid: found.uid,
          email: found.email,
          displayName: found.displayName,
          role: found.role || 'student',
          school: found.school || '',
          grade: found.grade || null,
          classNum: found.classNum || null,
          studentNum: found.studentNum || null,
          teacherId: found.teacherId || null
        };
      } else {
        localStorage.removeItem(MOCK_SESSION_KEY);
        currentUser = null;
      }
    } else {
      currentUser = null;
    }

    // 비동기 인증 상태 이벤트 방출
    setTimeout(() => {
      if (authStateCallback) authStateCallback(currentUser);
    }, 100);
  }

  // 3. API 외부 노출 객체 정의
  window.AppAuth = {
    // 초기화 및 인증 리스너 등록
    init: function(onAuthStateChanged) {
      authStateCallback = onAuthStateChanged;
      initFirebase();
    },

    // 로그인 기능
    login: function(email, password) {
      if (!isDemo) {
        return authInstance.signInWithEmailAndPassword(email, password)
          .then(result => {
            const user = result.user;
            currentUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              role: (user.email === 'hg@g.cnees.kr') ? 'admin' : 'student'
            };
            return currentUser;
          });
      } else {
        return new Promise((resolve, reject) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          const found = users.find(u => u.email === email && u.password === password);
          if (found) {
            localStorage.setItem(MOCK_SESSION_KEY, found.uid);
            currentUser = {
              uid: found.uid,
              email: found.email,
              displayName: found.displayName,
              role: found.role || 'student',
              school: found.school || '',
              grade: found.grade || null,
              classNum: found.classNum || null,
              studentNum: found.studentNum || null,
              teacherId: found.teacherId || null
            };
            authStateCallback(currentUser);
            resolve(currentUser);
          } else {
            reject(new Error("이메일 또는 비밀번호가 틀렸습니다.\n\n[기본 계정 안내]\n관리자: hg@g.cnees.kr / 123456\n선생님: teacher@school.kr / teacher1234\n학생체험: guest@world.net / guest"));
          }
        });
      }
    },

    // 게스트 간편 로그인
    loginAsGuest: function() {
      if (!isDemo) {
        return authInstance.signInAnonymously()
          .then(result => {
            const user = result.user;
            currentUser = {
              uid: user.uid,
              email: 'guest@firebase.net',
              displayName: '익명탐험가',
              role: 'student'
            };
            return currentUser;
          });
      } else {
        return this.login('guest@world.net', 'guest');
      }
    },

    // 회원가입 기능
    signup: function(email, password, displayName, extraData) {
      if (!isDemo) {
        return authInstance.createUserWithEmailAndPassword(email, password)
          .then(result => {
            const user = result.user;
            return user.updateProfile({
              displayName: displayName
            }).then(() => {
              currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                role: 'student'
              };
              // Firestore 초기 사용자 도큐먼트 생성
              return dbInstance.collection('users').doc(user.uid).set({
                email: email,
                displayName: displayName || email.split('@')[0],
                points: 0,
                completedQuizzes: [],
                completedFlashcards: [],
                badges: ['welcome'],
                role: 'student',
                createdAt: new Date().toISOString(),
                ...(extraData || {})
              }).then(() => currentUser);
            });
          });
      } else {
        return new Promise((resolve, reject) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          if (users.some(u => u.email === email)) {
            reject(new Error("이미 사용 중인 이메일 주소입니다."));
            return;
          }

          const newUid = 'mock_' + Date.now();
          const newUser = {
            uid: newUid,
            email: email,
            password: password,
            displayName: displayName || email.split('@')[0],
            role: (extraData && extraData.role) || 'student',
            school: (extraData && extraData.school) || '',
            grade: (extraData && extraData.grade) || null,
            classNum: (extraData && extraData.classNum) || null,
            studentNum: (extraData && extraData.studentNum) || null,
            teacherId: (extraData && extraData.teacherId) || null,
            points: 0,
            completedQuizzes: [],
            completedFlashcards: [],
            badges: ['welcome'],
            flashcardStats: {},
            quizHistory: [],
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
          
          localStorage.setItem(MOCK_SESSION_KEY, newUid);
          currentUser = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            role: newUser.role,
            school: newUser.school,
            grade: newUser.grade,
            classNum: newUser.classNum,
            studentNum: newUser.studentNum,
            teacherId: newUser.teacherId
          };
          
          authStateCallback(currentUser);
          resolve(currentUser);
        });
      }
    },

    // 로그아웃 기능
    logout: function() {
      if (!isDemo) {
        return authInstance.signOut().then(() => {
          currentUser = null;
          if (authStateCallback) authStateCallback(null);
        });
      } else {
        return new Promise((resolve) => {
          localStorage.removeItem(MOCK_SESSION_KEY);
          currentUser = null;
          if (authStateCallback) authStateCallback(null);
          resolve();
        });
      }
    },

    // 현재 유저 정보 획득
    getCurrentUser: function() {
      return currentUser;
    },

    // 유저의 세부 학습 정보(포인트, 배지 등) 획득
    getUserData: function() {
      if (!currentUser) return Promise.resolve(null);

      if (!isDemo) {
        return dbInstance.collection('users').doc(currentUser.uid).get()
          .then(doc => {
            if (doc.exists) {
              return doc.data();
            } else {
              const initialData = {
                points: 0,
                completedQuizzes: [],
                completedFlashcards: [],
                flashcardStats: {},
                quizHistory: [],
                visitedCountries: [],
                visitedSigungus: [],
                worksheetHistory: [],
                badges: ['welcome'],
                role: 'student'
              };
              return dbInstance.collection('users').doc(currentUser.uid).set(initialData)
                .then(() => initialData);
            }
          });
      } else {
        return new Promise((resolve) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          const found = users.find(u => u.uid === currentUser.uid);
          if (found) {
            resolve({
              points: found.points || 0,
              completedQuizzes: found.completedQuizzes || [],
              completedFlashcards: found.completedFlashcards || [],
              badges: found.badges || ['welcome'],
              flashcardStats: found.flashcardStats || {},
              quizHistory: found.quizHistory || [],
              visitedCountries: found.visitedCountries || [],
              visitedSigungus: found.visitedSigungus || [],
              worksheetHistory: found.worksheetHistory || [],
              role: found.role || 'student',
              school: found.school || '',
              grade: found.grade || null,
              classNum: found.classNum || null,
              studentNum: found.studentNum || null,
              teacherId: found.teacherId || null,
              displayName: found.displayName || ''
            });
          } else {
            resolve({
              points: 0,
              completedQuizzes: [],
              completedFlashcards: [],
              badges: ['welcome'],
              flashcardStats: {},
              quizHistory: [],
              visitedCountries: [],
              visitedSigungus: [],
              worksheetHistory: [],
              role: 'student'
            });
          }
        });
      }
    },

    // 유저 학습 정보 갱신
    updateUserData: function(newData) {
      if (!currentUser) return Promise.resolve(false);

      if (!isDemo) {
        return dbInstance.collection('users').doc(currentUser.uid).update(newData)
          .then(() => true)
          .catch(err => {
            console.error("Firestore 데이터 갱신 실패:", err);
            return false;
          });
      } else {
        return new Promise((resolve) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          const idx = users.findIndex(u => u.uid === currentUser.uid);
          if (idx !== -1) {
            users[idx] = Object.assign({}, users[idx], newData);
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    },

    // ── 관리자/교사 전용 API ──────────────────────────────────

    // 전체 사용자 목록 조회 (관리자 전용)
    getAllUsers: function() {
      if (!isDemo) {
        return dbInstance.collection('users').get()
          .then(querySnapshot => {
            const users = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              users.push({
                uid: doc.id,
                email: data.email || '',
                password: data.password || '********',
                displayName: data.displayName || '',
                role: data.role || 'student',
                school: data.school || '',
                grade: data.grade || null,
                classNum: data.classNum || null,
                studentNum: data.studentNum || null,
                teacherId: data.teacherId || null,
                points: data.points || 0,
                badges: data.badges || [],
                quizHistory: data.quizHistory || [],
                createdAt: data.createdAt || ''
              });
            });
            return users;
          });
      } else {
        return new Promise((resolve) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          resolve(users.map(u => ({
            uid: u.uid,
            email: u.email,
            password: u.password,
            displayName: u.displayName,
            role: u.role || 'student',
            school: u.school || '',
            grade: u.grade || null,
            classNum: u.classNum || null,
            studentNum: u.studentNum || null,
            teacherId: u.teacherId || null,
            points: u.points || 0,
            badges: u.badges || [],
            quizHistory: u.quizHistory || [],
            createdAt: u.createdAt || ''
          })));
        });
      }
    },

    // 반별 학생 목록 조회 (교사 전용)
    getUsersByClass: function(school, grade, classNum) {
      return new Promise((resolve) => {
        const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
        const result = users.filter(u =>
          u.role === 'student' &&
          u.school === school &&
          u.grade === grade &&
          u.classNum === classNum
        ).map(u => ({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          studentNum: u.studentNum || 0,
          points: u.points || 0,
          badges: u.badges || [],
          quizHistory: u.quizHistory || [],
          completedFlashcards: u.completedFlashcards || [],
          flashcardStats: u.flashcardStats || {}
        })).sort((a, b) => (a.studentNum || 0) - (b.studentNum || 0));
        resolve(result);
      });
    },

    // 특정 학생 학습 데이터 조회
    getStudentData: function(uid) {
      return new Promise((resolve) => {
        const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
        const found = users.find(u => u.uid === uid);
        if (found) {
          resolve({
            uid: found.uid,
            email: found.email,
            displayName: found.displayName,
            role: found.role || 'student',
            school: found.school || '',
            grade: found.grade || null,
            classNum: found.classNum || null,
            studentNum: found.studentNum || null,
            points: found.points || 0,
            badges: found.badges || [],
            quizHistory: found.quizHistory || [],
            completedFlashcards: found.completedFlashcards || [],
            flashcardStats: found.flashcardStats || {}
          });
        } else {
          resolve(null);
        }
      });
    },

    // 계정 생성 (관리자 전용)
    createUser: function(data) {
      if (!isDemo) {
        const config = window.FIREBASE_BUILD_CONFIG || JSON.parse(localStorage.getItem(CONFIG_KEY));
        
        // 보조 Firebase 앱 생성하여 현재 관리자 세션(쿠키/인증)을 가로채지 않고 가입 처리
        const secondaryApp = firebase.initializeApp(config, "SecondaryTempApp");
        
        return secondaryApp.auth().createUserWithEmailAndPassword(data.email, data.password)
          .then(result => {
            const user = result.user;
            return user.updateProfile({
              displayName: data.displayName
            }).then(() => {
              const userData = {
                email: data.email,
                password: data.password, // 복구용/열람용 비밀번호 저장
                displayName: data.displayName,
                role: data.role || 'student',
                school: data.school || '',
                grade: data.grade || null,
                classNum: data.classNum || null,
                studentNum: data.studentNum || null,
                teacherId: data.teacherId || null,
                points: 0,
                completedQuizzes: [],
                completedFlashcards: [],
                badges: ['welcome'],
                flashcardStats: {},
                quizHistory: [],
                createdAt: new Date().toISOString()
              };
              
              return dbInstance.collection('users').doc(user.uid).set(userData)
                .then(() => {
                  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
                  const localUser = Object.assign({ uid: user.uid }, userData);
                  users.push(localUser);
                  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
                  
                  secondaryApp.delete();
                  return localUser;
                });
            });
          })
          .catch(err => {
            secondaryApp.delete();
            throw err;
          });
      } else {
        return new Promise((resolve, reject) => {
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          if (users.some(u => u.email === data.email)) {
            reject(new Error("이미 사용 중인 이메일 주소입니다."));
            return;
          }
          const newUser = {
            uid: 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            email: data.email,
            password: data.password,
            displayName: data.displayName,
            role: data.role || 'student',
            school: data.school || '',
            grade: data.grade || null,
            classNum: data.classNum || null,
            studentNum: data.studentNum || null,
            teacherId: data.teacherId || null,
            points: 0,
            completedQuizzes: [],
            completedFlashcards: [],
            badges: ['welcome'],
            flashcardStats: {},
            quizHistory: [],
            createdAt: new Date().toISOString()
          };
          users.push(newUser);
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
          resolve(newUser);
        });
      }
    },

    // 계정 정보 수정 (관리자 전용)
    updateUserById: function(uid, data) {
      return new Promise((resolve, reject) => {
        const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
        const idx = users.findIndex(u => u.uid === uid);
        if (idx === -1) { reject(new Error("해당 사용자를 찾을 수 없습니다.")); return; }
        users[idx] = Object.assign({}, users[idx], data);
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
        resolve(users[idx]);
      });
    },

    // 계정 삭제 (관리자 전용)
    deleteUser: function(uid) {
      if (!isDemo) {
        if (uid === 'admin_uid') return Promise.reject(new Error("기본 관리자 계정은 삭제할 수 없습니다."));
        
        // Firestore 도큐먼트 삭제 및 로컬 캐시 삭제
        return dbInstance.collection('users').doc(uid).delete()
          .then(() => {
            const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const idx = users.findIndex(u => u.uid === uid);
            if (idx !== -1) {
              users.splice(idx, 1);
              localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
            }
            return true;
          });
      } else {
        return new Promise((resolve, reject) => {
          if (uid === 'admin_uid') { reject(new Error("기본 관리자 계정은 삭제할 수 없습니다.")); return; }
          const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
          const idx = users.findIndex(u => u.uid === uid);
          if (idx === -1) { reject(new Error("해당 사용자를 찾을 수 없습니다.")); return; }
          users.splice(idx, 1);
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
          resolve(true);
        });
      }
    },

    // 파이어베이스 커스텀 설정 보관
    saveFirebaseConfig: function(config) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      location.reload();
    },

    // 파이어베이스 커스텀 설정 삭제 (데모 모드 복원)
    resetFirebaseConfig: function() {
      localStorage.removeItem(CONFIG_KEY);
      localStorage.removeItem(MOCK_SESSION_KEY);
      location.reload();
    },

    // 현재 설정 로드
    getFirebaseConfig: function() {
      const config = localStorage.getItem(CONFIG_KEY);
      return config ? JSON.parse(config) : null;
    },

    // 현재 데모 모드 여부 반환
    isDemoMode: function() {
      return isDemo;
    },

    // 관리자 계정 설정 로드
    getAdminConfig: function() {
      return getAdminConfig();
    },

    // 관리자 계정 설정 저장
    saveAdminConfig: function(email, password) {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify({ email, password }));
      // mock DB의 관리자 계정 동기화를 바로 실행하기 위해 세션 데이터와 DB 업데이트
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      const adminUser = users.find(u => u.uid === 'admin_uid');
      if (adminUser) {
        adminUser.email = email;
        adminUser.password = password;
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      }
    }
  };
})();

