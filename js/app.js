// 전체 어플리케이션 상태 컨트롤러 및 뷰 라우터
window.AppMode = 'world'; // 'world' 또는 'korea'

(function() {
  
  // 1. 문서 로드 완료 시 진입점
  document.addEventListener('DOMContentLoaded', () => {
    // 테마 설정 복원
    initTheme();

    // 인증 시스템 초기화 및 상태 관찰자 주입
    window.AppAuth.init(onAuthStateChanged);

    // 전반적인 전역 UI 이벤트 리스너 바인딩
    setupGlobalEventListeners();
  });

  // 2. 인증 상태가 변경될 때 작동하는 핵심 라우팅 콜백
  function onAuthStateChanged(user) {
    const navLinks = document.getElementById('nav-links');
    const userStatusText = document.getElementById('user-status-text');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
      // 1) 로그인 성공 상태
      console.log("인증 완료 사용자:", user.email, "역할:", user.role);
      
      // 헤더 메뉴 활성화
      navLinks.classList.remove('hidden');
      userStatusText.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');

      // 역할에 따른 표시 이름
      const roleLabel = user.role === 'admin' ? '관리자' : user.role === 'teacher' ? '선생님' : '학생';
      userStatusText.textContent = `${user.displayName} ${roleLabel}`;
      document.getElementById('dashboard-user-name').textContent = user.displayName;

      // 사용자 세부 데이터(포인트, 획득 뱃지) 조회 및 동기화
      syncUserProfile();

      // 관리자 패널 네비게이션 링크 분기
      const navAdminLink = document.getElementById('nav-admin-panel');
      if (navAdminLink) {
        if (user.role === 'admin') {
          navAdminLink.classList.remove('hidden');
        } else {
          navAdminLink.classList.add('hidden');
        }
      }

      // 내 진도 메뉴 교사/학생별 변경
      const navProgress = document.getElementById('nav-progress');
      if (navProgress) {
        if (user.role === 'teacher' || user.role === 'admin') {
          navProgress.innerHTML = '📊 학급 학습 현황';
          navProgress.setAttribute('data-target', 'teacher-students-view');
        } else {
          navProgress.innerHTML = '📊 내 진도';
          navProgress.setAttribute('data-target', 'progress-view');
        }
      }

      // 역할별 라우팅
      if (user.role === 'admin') {
        // 관리자: 관리자 패널로 바로 이동
        switchView('admin-view');
      } else {
        // 선생님/학생: 모드 선택 화면으로 이동
        switchView('mode-select-view');
      }
    } else {
      // 2) 로그아웃 또는 미인증 상태
      navLinks.classList.add('hidden');
      userStatusText.classList.add('hidden');
      logoutBtn.classList.remove('hidden'); // hidden 추가/제거는 원본 유지
      logoutBtn.classList.add('hidden');

      const navAdminLink = document.getElementById('nav-admin-panel');
      if (navAdminLink) navAdminLink.classList.add('hidden');

      // 로그아웃 시 내 진도 메뉴 기본 텍스트로 초기화
      const navProgress = document.getElementById('nav-progress');
      if (navProgress) {
        navProgress.innerHTML = '📊 내 진도';
        navProgress.setAttribute('data-target', 'progress-view');
      }

      // 로그인 폼 화면으로 이동
      switchView('auth-view');
    }
  }

  // 3. 사용자 프로필(포인트, 뱃지) 실시간 동기화
  function syncUserProfile() {
    window.AppAuth.getUserData().then(data => {
      if (!data) return;

      // 대시보드 포인트 노출
      document.getElementById('user-points').textContent = `${data.points} P`;

      // 획득한 뱃지 활성화
      const badges = data.badges || [];
      const badgeMap = {
        'welcome': 'badge-welcome',
        'quiz1': 'badge-quiz1',
        'asia': 'badge-asia',
        'europe': 'badge-europe',
        'korea': 'badge-korea',
        'world': 'badge-world'
      };
      Object.values(badgeMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = '0.35';
      });
      badges.forEach(badgeKey => {
        const elementId = badgeMap[badgeKey];
        const el = document.getElementById(elementId);
        if (el) {
          el.style.opacity = '1';
          el.style.filter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))';
        }
      });

      // 역할 기반 UI 분기
      const user = window.AppAuth.getCurrentUser();
      const teacherCard = document.getElementById('card-to-teacher-students');
      if (teacherCard) {
        // 선생님이면 학생 관리 카드 표시
        if (user && (user.role === 'teacher' || user.role === 'admin')) {
          teacherCard.classList.remove('hidden');
        } else {
          teacherCard.classList.add('hidden');
        }
      }
    }).catch(err => {
      console.error("사용자 프로필 동기화 에러:", err);
      document.getElementById('user-points').textContent = '0 P';
    });
  }

  // 4. 단일 페이지 내 뷰 스위칭 (라우터)
  function switchView(targetViewId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
      if (sec.id === targetViewId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // 헤더 네비게이션 액티브 바 갱신
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const target = item.getAttribute('data-target');
      if (target === targetViewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 특정 뷰 전환 시 추가 액션 수행
    if (targetViewId === 'study-view') {
      window.AppMap.clearSelection();
    } else if (targetViewId === 'worksheet-view') {
      window.AppWorksheet.init();
      window.AppWorksheet.generate();
    } else if (targetViewId === 'flashcard-view') {
      window.AppFlashcard.enter();
    } else if (targetViewId === 'progress-view') {
      renderProgressView();
    } else if (targetViewId === 'admin-view') {
      renderAdminView();
    } else if (targetViewId === 'teacher-students-view') {
      renderTeacherStudentsView();
    }

    // 로그인 화면(auth-view) 또는 모드 선택 화면(mode-select-view) 입장 시 브랜드 로고 텍스트를 '지도 학습기'로 원복
    if (targetViewId === 'auth-view' || targetViewId === 'mode-select-view') {
      const logoText = document.getElementById('go-home-logo')?.querySelector('span:nth-child(2)');
      if (logoText) {
        logoText.textContent = '지도 학습기';
      }
    }
  }

  // 5. 학습 진도 뷰 렌더링
  function renderProgressView() {
    window.AppAuth.getUserData().then(userData => {
      if (!userData) return;

      const points       = userData.points || 0;
      const badges       = userData.badges || [];
      const quizHistory  = userData.quizHistory || [];
      const fcCompleted  = userData.completedFlashcards || [];
      const fcStats      = userData.flashcardStats || {};
      const visitedCount = ((window.AppMode === 'world' ? userData.visitedCountries : userData.visitedSigungus) || []).length;

      // ① 요약 카드
      const el = id => document.getElementById(id);
      if (el('pg-total-points')) el('pg-total-points').textContent = points.toLocaleString() + ' P';
      if (el('pg-quiz-count'))   el('pg-quiz-count').textContent   = quizHistory.length;
      if (el('pg-fc-count'))     el('pg-fc-count').textContent     = fcCompleted.length;
      if (el('pg-badge-count'))  el('pg-badge-count').textContent  = badges.length;
      if (el('pg-map-count'))    el('pg-map-count').textContent    = visitedCount + (window.AppMode === 'world' ? '개국' : '개 지역');

      // ② 배지
      const badgeMap = {
        welcome: 'pg-badge-welcome',
        quiz1:   'pg-badge-quiz1',
        asia:    'pg-badge-asia',
        europe:  'pg-badge-europe',
        korea:   'pg-badge-korea',
        world:   'pg-badge-world'
      };
      Object.values(badgeMap).forEach(id => {
        const e = document.getElementById(id);
        if (e) { e.style.opacity = '0.25'; e.style.filter = ''; }
      });
      badges.forEach(key => {
        const e = document.getElementById(badgeMap[key]);
        if (e) {
          e.style.opacity = '1';
          e.style.filter  = 'drop-shadow(0 0 10px rgba(245,158,11,0.5))';
        }
      });

      // ③ 퀴즈 기록 테이블
      const histWrap = el('pg-quiz-history-wrap');
      if (histWrap) {
        if (quizHistory.length === 0) {
          histWrap.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">아직 퀴즈 기록이 없습니다.<br>온라인 퀴즈에 도전해 보세요! 🏆</p>';
        } else {
          const typeLabel = { flag: '국기 맞히기', capital: '수도 맞히기', map: '지도 위치', mixed: '혼합형' };
          const rows = quizHistory.slice(0, 20).map(h => {
            const d = new Date(h.date);
            const dateStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            const modeIcon = h.mode === 'world' ? '🌍' : '🇰🇷';
            const continentLabel = h.continent === 'all' ? '전체' : h.continent;
            const pct = h.maxScore > 0 ? Math.round(h.score / h.maxScore * 100) : 0;
            const scoreColor = h.isGameOver ? 'var(--danger)' : (pct >= 80 ? 'var(--secondary)' : pct >= 50 ? 'var(--accent)' : 'var(--danger)');
            const resultBadge = h.isGameOver
              ? '<span class="pg-result-badge game-over">게임오버</span>'
              : '<span class="pg-result-badge clear">완주</span>';
            return `<tr>
              <td>${dateStr}</td>
              <td>${modeIcon} ${continentLabel}</td>
              <td>${typeLabel[h.type] || h.type}</td>
              <td style="font-weight:700;color:${scoreColor};">${h.score}<span style="font-size:0.75rem;font-weight:400;color:var(--text-muted);">/${h.maxScore}</span></td>
              <td>${resultBadge}</td>
            </tr>`;
          }).join('');
          histWrap.innerHTML = `
            <table class="progress-quiz-table">
              <thead><tr><th>날짜</th><th>범위</th><th>유형</th><th>점수</th><th>결과</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>`;
        }
      }

      // ④ 플래시카드 진도
      const fcWrap = el('pg-flashcard-progress');
      if (fcWrap) {
        const worldContinents = ['아시아','유럽','북아메리카','남아메리카','아프리카','오세아니아'];
        const koreaContinents = ['서울특별시','경기도','강원특별자치도','충청권','전라권','경상권','제주도'];
        const modeData = window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
        const continents = window.AppMode === 'world' ? worldContinents : koreaContinents;

        if (!modeData || modeData.length === 0) {
          fcWrap.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">데이터 로딩 중...</p>';
        } else {
          const rows = continents.map(cont => {
            const countries = modeData.filter(c => {
              if (window.AppMode === 'world') return c.continent === cont;
              const kMap = {
                '충청권': ['충청북도','충청남도','세종특별자치시','대전광역시'],
                '전라권': ['전북특별자치도','전라남도','광주광역시'],
                '경상권': ['경상북도','경상남도','대구광역시','부산광역시','울산광역시'],
                '제주도': ['제주특별자치도']
              };
              if (kMap[cont]) return kMap[cont].includes(c.continent);
              return c.continent === cont;
            });
            const totalGroups = Math.ceil(countries.length / 5);
            const doneGroups  = fcCompleted.filter(k => k.startsWith(`${cont}_group_`)).length;
            const pct = totalGroups > 0 ? Math.round(doneGroups / totalGroups * 100) : 0;
            const barColor = pct >= 100 ? 'var(--secondary)' : pct >= 50 ? 'var(--primary)' : 'var(--accent)';
            return `<div class="progress-bar-wrap">
              <div class="pb-label-row">
                <span class="pb-name">${cont}</span>
                <span class="pb-stat">${doneGroups}/${totalGroups} 그룹 (${pct}%)</span>
              </div>
              <div class="pb-track">
                <div class="pb-fill" style="width:${pct}%;background:${barColor};"></div>
              </div>
            </div>`;
          }).join('');
          fcWrap.innerHTML = rows || '<p style="color:var(--text-muted);text-align:center;padding:1rem;">진도 정보가 없습니다.</p>';
        }
      }

      // ⑤ 약점 목록
      const weakWrap = el('pg-weakness-list');
      if (weakWrap) {
        const allData = (window.WORLD_DATA || []).concat(window.KOREA_DATA || []);
        const chips = [];
        Object.entries(fcStats).forEach(([groupKey, gStat]) => {
          const wrongList = gStat.wrongList || {};
          Object.keys(wrongList).forEach(code => {
            const country = allData.find(c => c.code === code);
            if (country) chips.push({ name: country.name, cont: country.continent, wrongCount: gStat.wrongCounts?.[code] || 1 });
          });
        });
        if (chips.length === 0) {
          weakWrap.innerHTML = '<p style="color:var(--secondary);text-align:center;padding:1.5rem;">🎉 약점이 없습니다! 모두 마스터했어요!</p>';
        } else {
          chips.sort((a, b) => b.wrongCount - a.wrongCount);
          weakWrap.innerHTML = '<div class="weakness-chip-area">' +
            chips.map(c => `<span class="weakness-chip" title="${c.cont} · 오답 ${c.wrongCount}회">${c.name} <span class="wc-count">${c.wrongCount}회</span></span>`).join('') +
            '</div>';
        }
      }
    }).catch(err => {
      console.error('학습 진도 뷰 로드 실패:', err);
    });
  }

  // 6. 관리자 뷰 렌더링
  function renderAdminView(filter) {
    window.AppAuth.getAllUsers().then(users => {
      // 전체 카운트 표시
      const countEl = document.getElementById('admin-total-count');
      if (countEl) countEl.textContent = `전체 ${users.length}명`;

      // 필터 적용
      const roleFilter  = (filter && filter.role)  || document.getElementById('admin-filter-role')?.value  || 'all';
      const gradeFilter = (filter && filter.grade) || document.getElementById('admin-filter-grade')?.value || 'all';
      const classFilter = (filter && filter.class) || document.getElementById('admin-filter-class')?.value || 'all';
      const searchFilter = (filter && filter.search) || document.getElementById('admin-filter-search')?.value || '';

      let filtered = users;
      if (roleFilter !== 'all')  filtered = filtered.filter(u => u.role === roleFilter);
      if (gradeFilter !== 'all') filtered = filtered.filter(u => String(u.grade) === gradeFilter);
      if (classFilter !== 'all') filtered = filtered.filter(u => String(u.classNum) === classFilter);
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        filtered = filtered.filter(u => u.displayName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
      }

      // 역할 배지 색상
      const roleBadgeHtml = (role) => {
        const map = { admin: ['admin', '관리자'], teacher: ['teacher', '선생님'], student: ['student', '학생'] };
        const [cls, label] = map[role] || ['student', '학생'];
        return `<span class="role-badge ${cls}">${label}</span>`;
      };

      const tbody = document.getElementById('admin-users-tbody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted);">검색 결과가 없습니다.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const gradeClass = [u.grade ? u.grade + '학년' : '', u.classNum ? u.classNum + '반' : '', u.studentNum ? u.studentNum + '번' : ''].filter(Boolean).join(' ');
        const badgeCount = (u.badges || []).length;
        return `<tr>
          <td>${roleBadgeHtml(u.role)}</td>
          <td><strong>${u.displayName}</strong></td>
          <td style="font-size:0.82rem;color:var(--text-muted);">${u.email}</td>
          <td><code style="font-size:0.8rem;background:rgba(255,255,255,0.06);padding:0.15rem 0.4rem;border-radius:4px;">${u.password || '-'}</code></td>
          <td style="font-size:0.85rem;">${u.school || '-'}</td>
          <td style="font-size:0.85rem;">${gradeClass || '-'}</td>
          <td style="font-weight:700;color:var(--secondary);">${(u.points || 0).toLocaleString()} P</td>
          <td>${badgeCount}개</td>
          <td>
            <div style="display:flex;gap:0.4rem;">
              <button class="btn-tbl-edit" onclick="window._adminEditUser('${u.uid}')">✏️</button>
              <button class="btn-tbl-del" onclick="window._adminDeleteUser('${u.uid}','${u.displayName}')">🗑️</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    }).catch(err => console.error('관리자 뷰 로드 실패:', err));
  }

  // 7. 선생님 학생 현황 뷰 렌더링
  function renderTeacherStudentsView() {
    const user = window.AppAuth.getCurrentUser();
    if (!user) return;

    const school   = user.school || '';
    const grade    = user.grade;
    const classNum = user.classNum;

    const labelEl = document.getElementById('teacher-class-label');
    if (labelEl) labelEl.textContent = `${school} ${grade ? grade + '학년' : ''} ${classNum ? classNum + '반' : ''} 학생 현황`;

    window.AppAuth.getUsersByClass(school, grade, classNum).then(students => {
      // 통계
      const stats = window.AppAdmin.calcClassStats(students);
      if (stats) {
        const el = id => document.getElementById(id);
        if (el('ts-total'))      el('ts-total').textContent      = stats.total;
        if (el('ts-avg-points')) el('ts-avg-points').textContent = stats.avgPoints.toLocaleString();
        if (el('ts-quiz-done'))  el('ts-quiz-done').textContent  = stats.quizDoneRate + '%';
        if (el('ts-badge-total')) el('ts-badge-total').textContent = Object.values(stats.badgeCounts).reduce((s, n) => s + n, 0);
      }

      // 학생 테이블
      const tbody = document.getElementById('teacher-students-tbody');
      if (!tbody) return;
      if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">이 반에 등록된 학생이 없습니다.<br>관리자 패널에서 학생을 추가하세요.</td></tr>';
        return;
      }

      tbody.innerHTML = students.map(s => {
        const lastQuiz = (s.quizHistory || []).length > 0 ? (() => {
          const d = new Date(s.quizHistory[0].date);
          return `${d.getMonth()+1}/${d.getDate()} ${s.quizHistory[0].score}점`;
        })() : '없음';
        const badgeEmojis = ['👶','💯','🐉','🏰','🇰🇷','👑'].slice(0, (s.badges || []).length).join('');
        return `<tr class="student-row" style="cursor:pointer;" onclick="window._openStudentDetail('${s.uid}')">
          <td style="font-weight:700;">${s.studentNum || '-'}</td>
          <td><strong>${s.displayName}</strong></td>
          <td style="font-size:0.82rem;color:var(--text-muted);">${s.email}</td>
          <td style="font-weight:700;color:var(--secondary);">${(s.points || 0).toLocaleString()} P</td>
          <td>${(s.quizHistory || []).length}회</td>
          <td>${badgeEmojis || '-'}</td>
          <td style="font-size:0.85rem;">${lastQuiz}</td>
        </tr>`;
      }).join('');

      // 과제별 학습 현황 렌더링
      renderClassTaskStats(students);
    });
  }

  // 학습 과제별 통계 렌더링
  function renderClassTaskStats(students) {
    window._taskDetailsCache = {};

    const worldFlashGrid = document.getElementById('ts-task-world-grid');
    const koreaFlashGrid = document.getElementById('ts-task-korea-grid');
    if (!worldFlashGrid || !koreaFlashGrid) return;

    // --- 1. 세계 지리 과제 목록 ---
    const worldTasks = [];
    
    // (A) 플래시카드 과제
    const worldContinents = ['아시아', '유럽', '북아메리카', '남아메리카', '아프리카', '오세아니아'];
    worldContinents.forEach(cont => {
      const completed = students.filter(s => (s.completedFlashcards || []).includes(cont));
      const uncompleted = students.filter(s => !(s.completedFlashcards || []).includes(cont));
      
      const taskId = 'task_fc_world_' + cont;
      window._taskDetailsCache[taskId] = {
        title: `🗂️ [플래시] ${cont}`,
        completed,
        uncompleted
      };
      
      worldTasks.push(createTaskCardHtml(taskId, `🗂️ [플래시] ${cont}`, completed.length, uncompleted.length));
    });

    // (B) 퀴즈 과제
    const quizTypes = [
      { key: 'flag', label: '국기 맞추기' },
      { key: 'capital', label: '수도 맞추기' },
      { key: 'write-name', label: '이름 쓰기(주관식)' },
      { key: 'map', label: '지도 위치 맞추기' }
    ];
    
    quizTypes.forEach(q => {
      const completed = students.filter(s => (s.quizHistory || []).some(h => h.type === q.key && h.mode === 'world'));
      const uncompleted = students.filter(s => !(s.quizHistory || []).some(h => h.type === q.key && h.mode === 'world'));
      
      let avgScore = 0;
      if (completed.length > 0) {
        const scores = completed.map(s => {
          const entry = s.quizHistory.find(h => h.type === q.key && h.mode === 'world');
          return entry ? (entry.score / entry.maxScore) * 100 : 0;
        });
        avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
      
      const taskId = 'task_qz_world_' + q.key;
      window._taskDetailsCache[taskId] = {
        title: `🏆 [퀴즈] ${q.label}`,
        completed,
        uncompleted
      };
      
      worldTasks.push(createTaskCardHtml(taskId, `🏆 [퀴즈] ${q.label}`, completed.length, uncompleted.length, completed.length > 0 ? `평균 ${avgScore}점` : ''));
    });

    worldFlashGrid.innerHTML = worldTasks.join('');

    // --- 2. 한국 지리 과제 목록 ---
    const koreaTasks = [];
    
    // (A) 플래시카드 과제
    const koreaRegions = ['서울특별시', '경기도', '강원특별자치도', '충청권', '전라권', '경상권', '제주도'];
    koreaRegions.forEach(reg => {
      const completed = students.filter(s => (s.completedFlashcards || []).includes(reg));
      const uncompleted = students.filter(s => !(s.completedFlashcards || []).includes(reg));
      
      const taskId = 'task_fc_korea_' + reg;
      window._taskDetailsCache[taskId] = {
        title: `🗂️ [플래시] ${reg}`,
        completed,
        uncompleted
      };
      
      koreaTasks.push(createTaskCardHtml(taskId, `🗂️ [플래시] ${reg}`, completed.length, uncompleted.length));
    });

    // (B) 퀴즈 과제
    const koreaQuizTypes = [
      { key: 'flag', label: '행정구역 마크' },
      { key: 'capital', label: '시군구청 소재지' },
      { key: 'write-name', label: '지역 이름 쓰기' },
      { key: 'map', label: '행정구역 위치' }
    ];
    
    koreaQuizTypes.forEach(q => {
      const completed = students.filter(s => (s.quizHistory || []).some(h => h.type === q.key && h.mode === 'korea'));
      const uncompleted = students.filter(s => !(s.quizHistory || []).some(h => h.type === q.key && h.mode === 'korea'));
      
      let avgScore = 0;
      if (completed.length > 0) {
        const scores = completed.map(s => {
          const entry = s.quizHistory.find(h => h.type === q.key && h.mode === 'korea');
          return entry ? (entry.score / entry.maxScore) * 100 : 0;
        });
        avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
      
      const taskId = 'task_qz_korea_' + q.key;
      window._taskDetailsCache[taskId] = {
        title: `🏆 [퀴즈] ${q.label}`,
        completed,
        uncompleted
      };
      
      koreaTasks.push(createTaskCardHtml(taskId, `🏆 [퀴즈] ${q.label}`, completed.length, uncompleted.length, completed.length > 0 ? `평균 ${avgScore}점` : ''));
    });

    koreaFlashGrid.innerHTML = koreaTasks.join('');
  }

  function createTaskCardHtml(taskId, title, completedCount, totalCount, extraInfo = '') {
    const total = completedCount + totalCount;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    
    return `
      <div class="progress-stat-card glass-panel" style="flex-direction: column; align-items: stretch; padding: 1.25rem; gap: 0.75rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(255,255,255,0.05);" onclick="window._openTaskDetail('${taskId}')" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='rgba(16,185,129,0.3)';" onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,255,255,0.05)';">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 0.92rem; color: var(--text);">${title}</span>
          <span class="role-badge ${pct === 100 ? 'admin' : pct > 0 ? 'teacher' : 'student'}" style="font-size: 0.75rem; padding: 0.15rem 0.4rem;">
            ${pct}% 완료
          </span>
        </div>
        
        <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>완료: <strong>${completedCount}</strong> / ${total}명</span>
          <span style="color: var(--secondary); font-weight: 500;">${extraInfo}</span>
        </div>
        
        <div style="background: rgba(255,255,255,0.08); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 0.2rem;">
          <div style="background: linear-gradient(90deg, var(--secondary), #10b981); width: ${pct}%; height: 100%; border-radius: 4px;"></div>
        </div>
      </div>
    `;
  }

  // 6. 전역 공통 이벤트 리스너 바인딩
  function setupGlobalEventListeners() {
    // 로고 클릭 시 모드 선택 화면으로 이동 (모드 변경 기능 겸용)
    document.getElementById('go-home-logo').addEventListener('click', () => {
      const user = window.AppAuth.getCurrentUser();
      if (user) switchView('mode-select-view');
    });

    // 최고관리자 -> 선생님/학생 대시보드 화면 전환 버튼
    const btnAdminGoTeacher = document.getElementById('btn-admin-go-teacher');
    if (btnAdminGoTeacher) {
      btnAdminGoTeacher.addEventListener('click', () => {
        switchView('mode-select-view');
      });
    }

    // --- 학습 모드 선택 버튼 ---
    document.getElementById('btn-mode-world').addEventListener('click', () => {
      window.AppMode = 'world';
      enterDashboard();
    });
    
    document.getElementById('btn-mode-korea').addEventListener('click', () => {
      window.AppMode = 'korea';
      enterDashboard();
    });

    function enterDashboard() {
      const dashboardDesc = document.querySelector('#dashboard-view p');
      const navLinks = document.getElementById('nav-links');
      
      if (window.AppMode === 'world') {
        dashboardDesc.textContent = '세계 여러 나라의 위치, 국기, 수도를 정복해 보세요!';
        document.getElementById('go-home-logo').querySelector('span:nth-child(2)').textContent = '세계 여러 나라 학습기';
      } else {
        dashboardDesc.textContent = '대한민국 각 도별 주요 시·군·구의 위치와 특성을 정복해 보세요!';
        document.getElementById('go-home-logo').querySelector('span:nth-child(2)').textContent = '우리나라 시·군·구 학습기';
      }
      
      switchView('dashboard-view');
      
      // 선택된 모드에 따라 데이터 및 화면 초기화
      window.AppMap.init();
      window.AppFlashcard.init();
      window.AppQuiz.init();
    }

    // 네비게이션 탭 클릭
    const navLinks = document.getElementById('nav-links');
    navLinks.addEventListener('click', (e) => {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      
      const target = item.getAttribute('data-target');
      switchView(target);
    });

    // 대시보드 카드 단축 링크
    document.getElementById('card-to-flashcard').addEventListener('click', () => switchView('flashcard-view'));
    document.getElementById('card-to-study').addEventListener('click', () => switchView('study-view'));
    document.getElementById('card-to-quiz').addEventListener('click', () => switchView('quiz-view'));
    document.getElementById('card-to-worksheet').addEventListener('click', () => switchView('worksheet-view'));
    document.getElementById('card-to-teacher-students').addEventListener('click', () => switchView('teacher-students-view'));

    // 관리자 패널 진입 버튼 (로그인 화면)
    document.getElementById('btn-go-admin-login').addEventListener('click', () => {
      const adminCred = window.AppAuth.getAdminConfig();
      document.getElementById('login-email').value = adminCred.email;
      document.getElementById('login-password').value = adminCred.password;
      document.getElementById('btn-login').click();
    });

    // 선생님 학생 현황 뷰 - 대시보드로 돌아가기
    document.getElementById('btn-back-dashboard').addEventListener('click', () => switchView('dashboard-view'));

    // 선생님 학생/과제 현황 탭 전환
    const teacherTabs = document.querySelectorAll('.teacher-tab');
    teacherTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        teacherTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.teacher-tab-content').forEach(c => {
          c.classList.remove('active');
          c.style.display = 'none';
        });
        
        tab.classList.add('active');
        const target = tab.getAttribute('data-ts-tab');
        const content = document.getElementById('ts-tab-' + target + '-content');
        if (content) {
          content.classList.add('active');
          content.style.display = 'block';
        }
      });
    });

    // 과제 상세 팝업 닫기
    const btnTdpClose = document.getElementById('btn-tdp-close');
    if (btnTdpClose) {
      btnTdpClose.addEventListener('click', () => {
        document.getElementById('task-detail-overlay').classList.remove('active');
      });
    }
    }

    // --- 선생님이 직접 학생 등록하는 이벤트 ---
    const btnTsCreateSubmit = document.getElementById('btn-ts-create-submit');
    if (btnTsCreateSubmit) {
      btnTsCreateSubmit.addEventListener('click', () => {
        const user = window.AppAuth.getCurrentUser();
        if (!user) return;

        const school   = user.school || '';
        const grade    = user.grade;
        const classNum = user.classNum;
        
        const snumEl = document.getElementById('ts-student-num');
        const nameEl = document.getElementById('ts-student-name');
        const emailEl = document.getElementById('ts-student-email');
        const pwEl = document.getElementById('ts-student-password');
        const msgEl = document.getElementById('ts-create-msg');

        const snum = snumEl.value.trim();
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const pw = pwEl.value.trim();

        if (!name || !email || !pw) {
          msgEl.innerHTML = '<span style="color:var(--danger);">⚠️ 이름, 이메일, 비밀번호는 필수 입력 항목입니다.</span>';
          return;
        }

        msgEl.innerHTML = '<span style="color:var(--text-muted);">⏳ 파이어베이스 서버에 계정 생성 중...</span>';

        window.AppAuth.createUser({
          role: 'student',
          school: school,
          grade: grade ? Number(grade) : null,
          classNum: classNum ? Number(classNum) : null,
          studentNum: snum ? Number(snum) : null,
          displayName: name,
          email: email,
          password: pw,
          teacherId: user.uid
        }).then(() => {
          msgEl.innerHTML = `<span style="color:var(--secondary);">✅ 학생 등록 성공: ${name} (${email})</span>`;
          snumEl.value = '';
          nameEl.value = '';
          emailEl.value = '';
          pwEl.value = 'student1234'; // 기본값으로 복구
          
          // 학생 목록 및 과제 현황 리로드
          renderTeacherStudentsView();
        }).catch(err => {
          msgEl.innerHTML = `<span style="color:var(--danger);">❌ 등록 실패: ${err.message}</span>`;
        });
      });
    }

    const btnTsCreateReset = document.getElementById('btn-ts-create-reset');
    if (btnTsCreateReset) {
      btnTsCreateReset.addEventListener('click', () => {
        document.getElementById('ts-student-num').value = '';
        document.getElementById('ts-student-name').value = '';
        document.getElementById('ts-student-email').value = '';
        document.getElementById('ts-student-password').value = 'student1234';
        document.getElementById('ts-create-msg').innerHTML = '';
      });
    }

    // ── 관리자 탭 전환 ──────────────────────────────────────
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-admin-tab');
        const content = document.getElementById('admin-tab-' + target);
        if (content) content.classList.add('active');
      });
    });

    // 관리자 패널의 "+ 계정 추가" 버튼 → 계정 등록 탭으로
    document.getElementById('btn-admin-show-create').addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector('[data-admin-tab="create"]').classList.add('active');
      document.getElementById('admin-tab-create').classList.add('active');
    });

    // ── 관리자 필터 ──────────────────────────────────────────
    document.getElementById('btn-admin-filter').addEventListener('click', () => renderAdminView());
    document.getElementById('admin-filter-search').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') renderAdminView();
    });

    // ── 계정 등록 폼 ─────────────────────────────────────────
    document.getElementById('btn-ac-submit').addEventListener('click', () => {
      const role   = document.getElementById('ac-role').value;
      const school = document.getElementById('ac-school').value.trim();
      const grade  = document.getElementById('ac-grade').value;
      const cls    = document.getElementById('ac-class').value;
      const snum   = document.getElementById('ac-studentnum').value;
      const name   = document.getElementById('ac-name').value.trim();
      const email  = document.getElementById('ac-email').value.trim();
      const pw     = document.getElementById('ac-password').value.trim();
      const msgEl  = document.getElementById('ac-result-msg');

      if (!school || !name || !email || !pw) {
        msgEl.innerHTML = '<span style="color:var(--danger);">⚠️ 학교명, 이름, 이메일, 비밀번호는 필수입니다.</span>';
        return;
      }

      window.AppAuth.createUser({
        role, school,
        grade: grade ? Number(grade) : null,
        classNum: cls ? Number(cls) : null,
        studentNum: snum ? Number(snum) : null,
        displayName: name, email, password: pw
      }).then(() => {
        msgEl.innerHTML = `<span style="color:var(--secondary);">✅ 계정 생성 완료: ${name} (${email})</span>`;
        document.getElementById('btn-ac-reset').click();
        renderAdminView();
      }).catch(err => {
        msgEl.innerHTML = `<span style="color:var(--danger);">❌ ${err.message}</span>`;
      });
    });

    document.getElementById('btn-ac-reset').addEventListener('click', () => {
      ['ac-role','ac-school','ac-grade','ac-class','ac-studentnum','ac-name','ac-email','ac-password'].forEach(id => {
        const el = document.getElementById(id);
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      document.getElementById('ac-result-msg').innerHTML = '';
    });

    // ── 일괄 등록 ────────────────────────────────────────────
    document.getElementById('btn-bk-preview').addEventListener('click', () => {
      const school = document.getElementById('bk-school').value.trim();
      const grade  = document.getElementById('bk-grade').value;
      const cls    = document.getElementById('bk-class').value;
      const count  = parseInt(document.getElementById('bk-count').value) || 0;
      const prev   = document.getElementById('bulk-preview');

      if (!school || !grade || !cls || count < 1) {
        prev.innerHTML = '<p style="color:var(--danger);font-size:0.85rem;">⚠️ 모든 항목을 입력해 주세요.</p>';
        return;
      }
      const rows = Array.from({length: Math.min(count, 5)}, (_, i) => {
        const n = String(i+1).padStart(2,'0');
        return `<tr><td>${i+1}번</td><td>${grade}학년${cls}반${i+1}번</td><td>${grade}-${cls}-${n}@school.kr</td><td>student${n}</td></tr>`;
      }).join('');
      const moreNote = count > 5 ? `<p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.5rem;">... 및 ${count - 5}명 더 생성됩니다.</p>` : '';
      prev.innerHTML = `<table class="admin-table" style="font-size:0.82rem;"><thead><tr><th>번호</th><th>이름</th><th>이메일</th><th>비밀번호</th></tr></thead><tbody>${rows}</tbody></table>${moreNote}`;
    });

    document.getElementById('btn-bk-submit').addEventListener('click', () => {
      const school = document.getElementById('bk-school').value.trim();
      const grade  = document.getElementById('bk-grade').value;
      const cls    = document.getElementById('bk-class').value;
      const count  = parseInt(document.getElementById('bk-count').value) || 0;
      const msgEl  = document.getElementById('bk-result-msg');

      if (!school || !grade || !cls || count < 1) {
        msgEl.innerHTML = '<span style="color:var(--danger);">⚠️ 모든 항목을 입력해 주세요.</span>';
        return;
      }
      if (!confirm(`${school} ${grade}학년 ${cls}반 학생 ${count}명을 일괄 생성하시겠습니까?`)) return;

      msgEl.innerHTML = '<span style="color:var(--text-muted);">⏳ 생성 중...</span>';
      window.AppAdmin.bulkCreateStudents(school, Number(grade), Number(cls), count, null).then(results => {
        msgEl.innerHTML = `<span style="color:var(--secondary);">✅ ${results.length}명 생성 완료! (중복 이메일은 건너뜀)</span>`;
        renderAdminView();
      });
    });

    // ── 편집 모달 전역 함수 ──────────────────────────────────
    window._adminEditUser = function(uid) {
      window.AppAuth.getAllUsers().then(users => {
        const u = users.find(u => u.uid === uid);
        if (!u) return;
        document.getElementById('edit-uid').value = u.uid;
        document.getElementById('edit-role').value = u.role || 'student';
        document.getElementById('edit-school').value = u.school || '';
        document.getElementById('edit-grade').value = u.grade || '';
        document.getElementById('edit-class').value = u.classNum || '';
        document.getElementById('edit-studentnum').value = u.studentNum || '';
        document.getElementById('edit-name').value = u.displayName || '';
        document.getElementById('edit-email').value = u.email || '';
        document.getElementById('edit-password').value = u.password || '';
        document.getElementById('admin-edit-modal').classList.add('active');
      });
    };

    window._adminDeleteUser = function(uid, name) {
      if (!confirm(`"${name}" 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;
      window.AppAuth.deleteUser(uid).then(() => {
        renderAdminView();
      }).catch(err => alert(err.message));
    };

    window._openStudentDetail = function(uid) {
      window.AppAuth.getStudentData(uid).then(s => {
        if (!s) return;
        document.getElementById('sdp-name').textContent = s.displayName;
        document.getElementById('sdp-info').textContent = `${s.school || ''} ${s.grade ? s.grade + '학년' : ''} ${s.classNum ? s.classNum + '반' : ''} ${s.studentNum ? s.studentNum + '번' : ''}`.trim();
        document.getElementById('sdp-points').textContent = (s.points || 0).toLocaleString();
        document.getElementById('sdp-quiz-count').textContent = (s.quizHistory || []).length;
        document.getElementById('sdp-badge-count').textContent = (s.badges || []).length;
        
        const mapExplored = ((window.AppMode === 'world' ? s.visitedCountries : s.visitedSigungus) || []).length;
        const sdpMapCount = document.getElementById('sdp-map-count');
        if (sdpMapCount) {
          sdpMapCount.textContent = mapExplored + (window.AppMode === 'world' ? '개국' : '개 지역');
        }

        const histEl = document.getElementById('sdp-quiz-history');
        const qh = (s.quizHistory || []).slice(0, 10);
        if (qh.length === 0) {
          histEl.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">퀴즈 기록이 없습니다.</p>';
        } else {
          const typeLabel = { flag: '국기', capital: '수도', map: '지도', mixed: '혼합' };
          const rows = qh.map(h => {
            const d = new Date(h.date);
            const dateStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            const badge = h.isGameOver ? '<span class="pg-result-badge game-over">게임오버</span>' : '<span class="pg-result-badge clear">완주</span>';
            return `<tr><td>${dateStr}</td><td>${h.continent === 'all' ? '전체' : h.continent}</td><td>${typeLabel[h.type]||h.type}</td><td style="font-weight:700;color:var(--secondary);">${h.score}점</td><td>${badge}</td></tr>`;
          }).join('');
          histEl.innerHTML = `<table class="progress-quiz-table"><thead><tr><th>날짜</th><th>범위</th><th>유형</th><th>점수</th><th>결과</th></tr></thead><tbody>${rows}</tbody></table>`;
        }

        document.getElementById('student-detail-overlay').classList.add('active');
      });
    };

    window._openTaskDetail = function(taskId) {
      const cache = window._taskDetailsCache[taskId];
      if (!cache) return;
      
      document.getElementById('tdp-name').textContent = cache.title;
      document.getElementById('tdp-info').textContent = `학급 완료 현황 (${cache.completed.length}명 완료 / ${cache.uncompleted.length}명 미완료)`;
      
      const compListEl = document.getElementById('tdp-completed-list');
      const uncompListEl = document.getElementById('tdp-uncompleted-list');
      const compTitleEl = document.getElementById('tdp-completed-title');
      const uncompTitleEl = document.getElementById('tdp-uncompleted-title');
      
      compTitleEl.textContent = `완료 학생 (${cache.completed.length}명)`;
      uncompTitleEl.textContent = `미완료 학생 (${cache.uncompleted.length}명)`;
      
      if (cache.completed.length === 0) {
        compListEl.innerHTML = '<li style="color:var(--text-muted); font-size:0.9rem; text-align:center; padding:1rem 0;">완료한 학생이 없습니다.</li>';
      } else {
        compListEl.innerHTML = cache.completed.map(s => `<li style="background:rgba(16,185,129,0.06); padding:0.4rem 0.75rem; border-radius:6px; font-size:0.9rem; display:flex; align-items:center; gap:0.5rem; border:1px solid rgba(16,185,129,0.15);"><span style="color:#10b981;">✓</span>${s.studentNum ? s.studentNum + '번 ' : ''}<strong>${s.displayName}</strong></li>`).join('');
      }
      
      if (cache.uncompleted.length === 0) {
        uncompListEl.innerHTML = '<li style="color:var(--text-muted); font-size:0.9rem; text-align:center; padding:1rem 0;">미완료 학생이 없습니다.</li>';
      } else {
        uncompListEl.innerHTML = cache.uncompleted.map(s => `<li style="background:rgba(239,68,68,0.06); padding:0.4rem 0.75rem; border-radius:6px; font-size:0.9rem; display:flex; align-items:center; gap:0.5rem; border:1px solid rgba(239,68,68,0.15);"><span style="color:#ef4444;">✕</span>${s.studentNum ? s.studentNum + '번 ' : ''}<strong>${s.displayName}</strong></li>`).join('');
      }
      
      document.getElementById('task-detail-overlay').classList.add('active');
    };

    // 편집 저장
    document.getElementById('btn-edit-save').addEventListener('click', () => {
      const uid = document.getElementById('edit-uid').value;
      const data = {
        role: document.getElementById('edit-role').value,
        school: document.getElementById('edit-school').value.trim(),
        grade: document.getElementById('edit-grade').value ? Number(document.getElementById('edit-grade').value) : null,
        classNum: document.getElementById('edit-class').value ? Number(document.getElementById('edit-class').value) : null,
        studentNum: document.getElementById('edit-studentnum').value ? Number(document.getElementById('edit-studentnum').value) : null,
        displayName: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        password: document.getElementById('edit-password').value.trim()
      };
      window.AppAuth.updateUserById(uid, data).then(() => {
        document.getElementById('admin-edit-modal').classList.remove('active');
        renderAdminView();
      }).catch(err => alert(err.message));
    });

    document.getElementById('btn-edit-cancel').addEventListener('click', () => {
      document.getElementById('admin-edit-modal').classList.remove('active');
    });

    // 학생 상세 패널 닫기
    document.getElementById('btn-sdp-close').addEventListener('click', () => {
      document.getElementById('student-detail-overlay').classList.remove('active');
    });
    document.getElementById('student-detail-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('student-detail-overlay')) {
        document.getElementById('student-detail-overlay').classList.remove('active');
      }
    });

    // 편집 모달 바깥 클릭 닫기
    document.getElementById('admin-edit-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('admin-edit-modal')) {
        document.getElementById('admin-edit-modal').classList.remove('active');
      }
    });

    // 인증 폼 토글 액션
    document.getElementById('go-to-signup').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form-area').classList.add('hidden');
      document.getElementById('signup-form-area').classList.remove('hidden');
    });

    document.getElementById('go-to-login').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-form-area').classList.add('hidden');
      document.getElementById('login-form-area').classList.remove('hidden');
    });

    // 테마 토글 버튼
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // 로그인 진행 버튼
    document.getElementById('btn-login').addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        alert("이메일과 비밀번호를 모두 입력해 주세요.");
        return;
      }

      window.AppAuth.login(email, password)
        .catch(err => alert(err.message));
    });

    // 가상 체험(게스트) 진행 버튼
    const btnGuest = document.getElementById('btn-guest');
    if (btnGuest) {
      btnGuest.addEventListener('click', () => {
        window.AppAuth.loginAsGuest()
          .catch(err => alert(err.message));
      });
    }

    // 가입 진행 버튼
    document.getElementById('btn-signup').addEventListener('click', () => {
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      if (!email || !password) {
        alert("필수 항목(이메일, 비밀번호)을 모두 입력해 주세요.");
        return;
      }
      if (password.length < 6) {
        alert("비밀번호는 보안을 위해 6자 이상으로 설정해 주세요.");
        return;
      }

      window.AppAuth.signup(email, password, name || null)
        .catch(err => alert(err.message));
    });

    // 로그아웃 진행 버튼
    document.getElementById('logout-btn').addEventListener('click', () => {
      if (confirm("로그아웃 하시겠습니까?")) {
        window.AppAuth.logout();
      }
    });

    // --- 퀴즈 이벤트 리스너 ---
    // 퀴즈 유형 단일 선택 제어
    const typeButtons = document.querySelectorAll('.quiz-type-select');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // 퀴즈 시작 버튼
    document.getElementById('btn-quiz-start').addEventListener('click', () => {
      // 선택한 대륙 값
      const activeContinentBtn = document.querySelector('#quiz-setup-continents .filter-chip.active');
      const continent = activeContinentBtn ? activeContinentBtn.getAttribute('data-continent') : 'all';

      // 선택한 유형 값
      const activeTypeBtn = document.querySelector('.quiz-type-select.active');
      const type = activeTypeBtn ? activeTypeBtn.getAttribute('data-type') : 'flag';

      window.AppQuiz.start(continent, type);
    });

    // 퀴즈 셋업 대륙 단일 선택 제어
    const quizContinentContainer = document.getElementById('quiz-setup-continents');
    quizContinentContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      quizContinentContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
    });

    // 다음 문제 클릭
    document.getElementById('btn-quiz-next').addEventListener('click', () => {
      window.AppQuiz.nextQuestion();
    });

    // 퀴즈 포기
    document.getElementById('btn-quiz-exit').addEventListener('click', () => {
      window.AppQuiz.exit();
    });

    // 결과화면 버튼 제어
    document.getElementById('btn-quiz-restart').addEventListener('click', () => {
      document.getElementById('quiz-result-area').classList.add('hidden');
      document.getElementById('quiz-setup-area').classList.remove('hidden');
    });
    
    document.getElementById('btn-quiz-finish-home').addEventListener('click', () => {
      document.getElementById('quiz-result-area').classList.add('hidden');
      document.getElementById('quiz-setup-area').classList.remove('hidden');
      syncUserProfile(); // 획득 포인트 반영을 위해 대시보드 리로딩
      switchView('dashboard-view');
    });

    // --- 학습지 이벤트 리스너 ---
    // 학습지 빌드/재생성 버튼
    document.getElementById('btn-generate-ws').addEventListener('click', () => {
      window.AppWorksheet.generate();
    });

    // 학습지 프린트/인쇄 버튼
    document.getElementById('btn-print-ws').addEventListener('click', () => {
      window.AppWorksheet.print();
    });

    // --- Firebase 설정창 팝업 모달 리스너 ---
    const settingsModal = document.getElementById('settings-modal');
    
    // 모달 오픈
    document.getElementById('settings-btn').addEventListener('click', () => {
      // 기존 저장된 Config가 있으면 인풋 필드에 표기
      const config = window.AppAuth.getFirebaseConfig();
      if (config) {
        document.getElementById('fb-apiKey').value = config.apiKey || '';
        document.getElementById('fb-authDomain').value = config.authDomain || '';
        document.getElementById('fb-projectId').value = config.projectId || '';
        document.getElementById('fb-storageBucket').value = config.storageBucket || '';
        document.getElementById('fb-messagingSenderId').value = config.messagingSenderId || '';
        document.getElementById('fb-appId').value = config.appId || '';
      }
      // 관리자 설정 필드 표기
      const adminCred = window.AppAuth.getAdminConfig();
      document.getElementById('fb-admin-email').value = adminCred.email || '';
      document.getElementById('fb-admin-password').value = adminCred.password || '';
      
      settingsModal.classList.add('active');
    });

    // 모달 닫기
    document.getElementById('btn-settings-close').addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });

    // 모달 영역 바깥 클릭 시 닫기
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });

    // 설정값 로컬 저장
    document.getElementById('btn-settings-save').addEventListener('click', () => {
      const adminEmail = document.getElementById('fb-admin-email').value.trim();
      const adminPassword = document.getElementById('fb-admin-password').value.trim();

      if (!adminEmail || !adminPassword) {
        alert("관리자 이메일과 비밀번호는 필수 입력 항목입니다.");
        return;
      }

      const apiKey = document.getElementById('fb-apiKey').value.trim();
      const authDomain = document.getElementById('fb-authDomain').value.trim();
      const projectId = document.getElementById('fb-projectId').value.trim();
      const storageBucket = document.getElementById('fb-storageBucket').value.trim();
      const messagingSenderId = document.getElementById('fb-messagingSenderId').value.trim();
      const appId = document.getElementById('fb-appId').value.trim();

      const hasFirebaseInput = apiKey || authDomain || projectId || storageBucket || messagingSenderId || appId;
      if (hasFirebaseInput) {
        if (!apiKey || !authDomain || !projectId || !appId) {
          alert("Firebase 연동 시 API Key, Auth Domain, Project ID, App ID는 필수입니다.");
          return;
        }
        const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
        if (confirm("설정을 저장하고 페이지를 새로고침하시겠습니까?")) {
          window.AppAuth.saveAdminConfig(adminEmail, adminPassword);
          window.AppAuth.saveFirebaseConfig(config);
        }
      } else {
        if (confirm("관리자 설정을 저장하고 페이지를 새로고침하시겠습니까?")) {
          window.AppAuth.saveAdminConfig(adminEmail, adminPassword);
          location.reload();
        }
      }
    });

    // 설정값 제거 후 로컬 가상DB 모드로 롤백
    document.getElementById('btn-settings-reset').addEventListener('click', () => {
      if (confirm("모든 설정을 해제하고 기본 데모 모드로 돌아가시겠습니까?\n관리자 계정도 기본값(admin@school.kr / admin1234)으로 리셋됩니다.")) {
        localStorage.removeItem('app_admin_config');
        window.AppAuth.resetFirebaseConfig();
      }
    });
  }

  // --- 테마 스위처 관리 ---
  const THEME_KEY = 'app_theme_dark_mode';

  function initTheme() {
    const isDark = localStorage.getItem(THEME_KEY) !== 'false'; // 기본값 다크테마
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (isDark) {
      document.body.removeAttribute('data-theme');
      if (toggleBtn) toggleBtn.textContent = '🌙';
    } else {
      document.body.setAttribute('data-theme', 'light');
      if (toggleBtn) toggleBtn.textContent = '☀️';
    }
  }

  function toggleTheme() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (isLight) {
      // 다크 테마 적용
      document.body.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'true');
      if (toggleBtn) toggleBtn.textContent = '🌙';
    } else {
      // 라이트 테마 적용
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'false');
      if (toggleBtn) toggleBtn.textContent = '☀️';
    }
  }

})();
