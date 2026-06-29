// 클래식 학습 및 퀴즈 핵심 비즈니스 로직
(function() {
  // 상태 관리 객체
  const st = {
    mode: null,                // 'study' 또는 'quiz'
    selectedStage: null,       // 1 ~ 10 스테이지
    
    // 학습 모드 관련
    studyIndex: 0,             // 현재 스테이지 내에서의 노래 인덱스 (0 ~ 9)
    studySongs: [],            // 현재 스테이지의 10곡 배열
    audio: null,               // 오디오 객체
    isPlaying: false,
    audioTimer: null,          // 30초 재생 감지 타이머
    playTimeElapsed: 0,        // 재생 경과 시간 (초)
    timeIndicatorTimer: null,  // 재생 프로그레스바 타이머

    // 퀴즈 모드 관련
    quizSongs: [],             // 퀴즈로 무작위 선별된 10곡
    quizIdx: 0,                // 현재 퀴즈 번호 (0 ~ 9)
    quizScore: 0,              // 퀴즈 맞힌 개수
    quizAnswered: false,       // 현재 문항 정답 제출 여부
    quizChoices: []            // 4지선다 보기 배열
  };

  // 스테이지 한글 명칭
  const STAGE_NAMES = {
    1: "바로크 시대 명곡",
    2: "고전주의 시대 명곡 I",
    3: "고전주의 시대 명곡 II",
    4: "낭만주의 시대 명곡 I",
    5: "낭만주의 시대 명곡 II",
    6: "낭만주의 시대 명곡 III",
    7: "국민악파 명곡선",
    8: "근현대 및 인상주의",
    9: "피아노 명곡선",
    10: "오페라 & 발레 명곡선"
  };

  // 작곡가 가상 매핑 (초상화나 대표 아이콘)
  const COMPOSER_EMOJIS = {
    "파헬벨": "🎻", "바흐": "🎹", "비발디": "🎼", "헨델": "🎺", "모차르트": "🐉",
    "하이든": "🏰", "보케리니": "🎻", "글루크": "🌾", "베토벤": "⚡", "클레멘티": "🎹",
    "슈베르트": "🐟", "멘델스존": "💍", "슈만": "❤️", "쇼팽": "☔", "리스트": "🔔",
    "브람스": "👶", "차이콥스키": "🦢", "생상스": "🦁", "베르디": "☄️", "그리그": "🌄",
    "시벨리우스": "❄️", "스메타나": "🌊", "드보르자크": "🚂", "무소르그스키": "🎨",
    "림스키코르사코프": "🐝", "드뷔시": "🌙", "라벨": "🥁", "에릭 사티": "🛋️",
    "엘가": "🎖️", "홀스트": "🪐", "스트라빈스키": "🔥", "거슈윈": "🎷", "바다르체프스카": "🙏",
    "랑게": "💐", "루빈스타인": "🎹", "오펜바흐": "💃", "요한 슈트라우스 2세": "🌊", "바그너": "🛡️"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 1. 하위 뷰 전환
  // ─────────────────────────────────────────────────────────────────────────
  function showSubView(subViewId) {
    // 오디오 중지 및 타이머 청소
    stopAudio();
    
    const subViews = ['cl-menu-area', 'cl-study-area', 'cl-quiz-area', 'cl-result-area'];
    subViews.forEach(vid => {
      const el = document.getElementById(vid);
      if (el) {
        if (vid === subViewId) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. 오디오 제어 로직 (30초 제한 규칙 포함)
  // ─────────────────────────────────────────────────────────────────────────
  function playAudio(url) {
    stopAudio();

    st.audio = new Audio(url);
    st.audio.volume = 0.8;
    st.playTimeElapsed = 0;
    st.isPlaying = true;
    updatePlayPauseBtnUI(true);

    st.audio.play().then(() => {
      // 30초 자동 중지 타이머 설정
      st.audioTimer = setTimeout(() => {
        stopAudio();
        alert("⏱️ 30초 미리듣기가 완료되어 재생을 종료합니다. 작곡가와 곡명을 맞혀보세요!");
      }, 30000);

      // 프로그레스바 타이머 가동
      const progBar = document.getElementById('cl-play-progress');
      const timeText = document.getElementById('cl-play-time');
      if (progBar) progBar.style.width = '0%';

      st.timeIndicatorTimer = setInterval(() => {
        if (!st.audio) return;
        st.playTimeElapsed = st.audio.currentTime;
        const pct = Math.min((st.playTimeElapsed / 30) * 100, 100);
        if (progBar) progBar.style.width = `${pct}%`;
        if (timeText) {
          const sec = Math.min(Math.floor(st.playTimeElapsed), 30);
          timeText.textContent = `00:${String(sec).padStart(2, '0')} / 00:30`;
        }
      }, 250);
    }).catch(err => {
      console.error("음원 재생 실패:", err);
      const timeText = document.getElementById('cl-play-time');
      if (timeText) timeText.textContent = "⚠️ 재생 불가 (네트워크 확인)";
      updatePlayPauseBtnUI(false);
    });
  }

  function pauseAudio() {
    if (st.audio && st.isPlaying) {
      st.audio.pause();
      st.isPlaying = false;
      updatePlayPauseBtnUI(false);
      
      // 타이머 일시정지
      if (st.audioTimer) clearTimeout(st.audioTimer);
      if (st.timeIndicatorTimer) clearInterval(st.timeIndicatorTimer);
    }
  }

  function resumeAudio() {
    if (st.audio && !st.isPlaying) {
      st.isPlaying = true;
      updatePlayPauseBtnUI(true);
      const remainingTime = 30000 - (st.audio.currentTime * 1000);
      
      st.audio.play().then(() => {
        if (remainingTime > 0) {
          st.audioTimer = setTimeout(() => {
            stopAudio();
            alert("⏱️ 30초 미리듣기가 완료되었습니다.");
          }, remainingTime);
        }
        
        const progBar = document.getElementById('cl-play-progress');
        const timeText = document.getElementById('cl-play-time');
        st.timeIndicatorTimer = setInterval(() => {
          if (!st.audio) return;
          st.playTimeElapsed = st.audio.currentTime;
          const pct = Math.min((st.playTimeElapsed / 30) * 100, 100);
          if (progBar) progBar.style.width = `${pct}%`;
          if (timeText) {
            const sec = Math.min(Math.floor(st.playTimeElapsed), 30);
            timeText.textContent = `00:${String(sec).padStart(2, '0')} / 00:30`;
          }
        }, 250);
      }).catch(err => {
        console.error("음원 재생 재개 실패:", err);
        updatePlayPauseBtnUI(false);
      });
    }
  }

  function stopAudio() {
    if (st.audioTimer) clearTimeout(st.audioTimer);
    if (st.timeIndicatorTimer) clearInterval(st.timeIndicatorTimer);
    st.audioTimer = null;
    st.timeIndicatorTimer = null;

    if (st.audio) {
      try {
        st.audio.pause();
      } catch(e) {}
      st.audio = null;
    }
    st.isPlaying = false;
    updatePlayPauseBtnUI(false);

    // 프로그레스바 초기화
    const progBar = document.getElementById('cl-play-progress');
    const timeText = document.getElementById('cl-play-time');
    if (progBar) progBar.style.width = '0%';
    if (timeText) timeText.textContent = '00:00 / 00:30';
  }

  function togglePlayPause() {
    if (!st.audio) {
      // 재생 중이 아닐 때 현재 곡 재생 시작
      if (st.mode === 'study') {
        const song = st.studySongs[st.studyIndex];
        if (song) playAudio(song.audioUrl);
      } else if (st.mode === 'quiz') {
        const song = st.quizSongs[st.quizIdx];
        if (song) playAudio(song.audioUrl);
      }
    } else {
      if (st.isPlaying) {
        pauseAudio();
      } else {
        resumeAudio();
      }
    }
  }

  function updatePlayPauseBtnUI(playing) {
    const playBtn = document.getElementById('cl-btn-play');
    if (playBtn) {
      if (playing) {
        playBtn.innerHTML = '⏸️ 일시정지';
        playBtn.className = 'btn btn-outline';
      } else {
        playBtn.innerHTML = '▶️ 음악 듣기 (30초)';
        playBtn.className = 'btn btn-primary';
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. 메인 선택 메뉴 렌더링
  // ─────────────────────────────────────────────────────────────────────────
  function renderMenu() {
    showSubView('cl-menu-area');
    
    // 스테이지 목록 타일 주입
    const stageGrid = document.getElementById('cl-stage-grid');
    if (!stageGrid) return;
    stageGrid.innerHTML = '';

    window.AppAuth.getUserData().then(userData => {
      const completed = userData ? (userData.completedClassics || []) : [];

      Object.keys(STAGE_NAMES).forEach(stageNum => {
        const stageId = parseInt(stageNum, 10);
        const stageSongs = window.CLASSIC_DATA.filter(s => s.stage === stageId);
        
        // 현재 스테이지 완료 곡 수 연산
        const stageCompletedCount = stageSongs.filter(s => completed.includes(s.id)).length;
        const color = getStageColor(stageId);

        const card = document.createElement('div');
        card.className = 'fc-continent-card';
        card.style.setProperty('--fc-color', color);
        card.innerHTML = `
          <div class="fc-continent-emoji">🎶</div>
          <h3 style="font-size:1.1rem; margin-top:0.4rem;">${STAGE_NAMES[stageId]}</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">Stage ${stageId}</p>
          <div class="fc-continent-stats" style="margin-top:0.6rem;">
            <span>🎵 10곡 수록</span>
            <span>✅ 완료 ${stageCompletedCount}/10</span>
          </div>
          <button class="btn btn-primary fc-start-btn" style="width:100%; margin-top:0.8rem; background: ${color}; border:none;">학습 시작</button>
        `;
        
        card.addEventListener('click', () => startStudyStage(stageId));
        card.querySelector('.fc-start-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          startStudyStage(stageId);
        });

        stageGrid.appendChild(card);
      });
    });
  }

  function getStageColor(stageId) {
    const colors = {
      1: '#6366f1', 2: '#8b5cf6', 3: '#3b82f6', 4: '#ec4899', 5: '#f43f5e',
      6: '#f97316', 7: '#10b981', 8: '#06b6d4', 9: '#14b8a6', 10: '#a855f7'
    };
    return colors[stageId] || '#6366f1';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. 감상 및 학습 모드 구현
  // ─────────────────────────────────────────────────────────────────────────
  function startStudyStage(stageId) {
    st.mode = 'study';
    st.selectedStage = stageId;
    st.studyIndex = 0;
    st.studySongs = window.CLASSIC_DATA.filter(s => s.stage === stageId);
    
    showSubView('cl-study-area');
    renderStudyCard();
  }

  function renderStudyCard() {
    stopAudio();

    const song = st.studySongs[st.studyIndex];
    if (!song) return;

    // 헤더 정보 갱신
    document.getElementById('cl-study-stage-title').textContent = `${STAGE_NAMES[st.selectedStage]} (Stage ${st.selectedStage})`;
    document.getElementById('cl-study-progress-text').textContent = `${st.studyIndex + 1} / 10`;

    // 곡 세부 정보 갱신
    const emoji = COMPOSER_EMOJIS[song.composer] || '🎼';
    document.getElementById('cl-composer-emoji').textContent = emoji;
    document.getElementById('cl-composer-name').textContent = song.composer;
    document.getElementById('cl-song-title').textContent = song.title;
    document.getElementById('cl-song-era').textContent = `${song.era} 음악`;
    document.getElementById('cl-song-trivia').textContent = song.trivia;

    // 완료 체크버튼 갱신
    window.AppAuth.getUserData().then(userData => {
      const completed = userData ? (userData.completedClassics || []) : [];
      const btnComplete = document.getElementById('cl-btn-complete-song');
      
      if (completed.includes(song.id)) {
        btnComplete.innerHTML = '✅ 학습 완료됨';
        btnComplete.className = 'btn btn-outline';
        btnComplete.disabled = true;
      } else {
        btnComplete.innerHTML = '🌟 들었다고 표시하기 (+5 P)';
        btnComplete.className = 'btn btn-primary';
        btnComplete.disabled = false;
      }
    });

    // 이전/다음 버튼 제어
    document.getElementById('cl-btn-prev-song').disabled = (st.studyIndex === 0);
    document.getElementById('cl-btn-next-song').disabled = (st.studyIndex === st.studySongs.length - 1);
  }

  function markSongAsCompleted() {
    const song = st.studySongs[st.studyIndex];
    if (!song) return;

    window.AppAuth.getUserData().then(userData => {
      if (!userData) return;
      const completed = userData.completedClassics || [];
      if (!completed.includes(song.id)) {
        completed.push(song.id);
        const newPoints = (userData.points || 0) + 5;
        
        window.AppAuth.updateUserData({
          completedClassics: completed,
          points: newPoints
        }).then(() => {
          // 포인트 노출 갱신
          const pointsEl = document.getElementById('user-points');
          if (pointsEl) pointsEl.textContent = `${newPoints} P`;
          
          renderStudyCard();
        });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. 퀴즈 평가 모드 구현 (무작위 10문항)
  // ─────────────────────────────────────────────────────────────────────────
  function startQuizMode() {
    st.mode = 'quiz';
    st.quizIdx = 0;
    st.quizScore = 0;
    
    // 전체 클래식 중 무작위 10곡 셔플 선별
    st.quizSongs = [...window.CLASSIC_DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    showSubView('cl-quiz-area');
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    stopAudio();
    st.quizAnswered = false;

    const song = st.quizSongs[st.quizIdx];
    if (!song) return;

    // 헤더 상태
    document.getElementById('cl-quiz-progress-text').textContent = `문제 ${st.quizIdx + 1} / 10`;
    document.getElementById('cl-quiz-score-text').textContent = `맞힌 개수: ${st.quizScore}개`;

    // 다음 버튼 숨기기
    document.getElementById('cl-quiz-next-container').style.display = 'none';

    // 4지선다 보기 리스트 빌드
    // 오답 보기용 다른 3곡 추출
    const pool = window.CLASSIC_DATA.filter(s => s.id !== song.id);
    const incorrect = [];
    while (incorrect.length < 3) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (!incorrect.some(x => x.id === candidate.id)) {
        incorrect.push(candidate);
      }
    }

    // 정답과 오답 병합 후 셔플
    st.quizChoices = [song, ...incorrect].sort(() => 0.5 - Math.random());

    // 보기 버튼 렌더링
    const optionsGrid = document.getElementById('cl-quiz-options');
    if (!optionsGrid) return;
    optionsGrid.innerHTML = '';

    st.quizChoices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline cl-quiz-option-btn';
      btn.style.width = '100%';
      btn.style.padding = '1rem';
      btn.style.fontSize = '1rem';
      btn.style.textAlign = 'left';
      btn.style.marginBottom = '0.5rem';
      btn.innerHTML = `🎵 <strong>${choice.composer}</strong> - ${choice.title}`;
      
      btn.addEventListener('click', () => submitQuizAnswer(choice, btn));
      optionsGrid.appendChild(btn);
    });
  }

  function submitQuizAnswer(choice, clickedBtn) {
    if (st.quizAnswered) return;
    st.quizAnswered = true;
    
    stopAudio(); // 정답 제출 시 사운드 스톱

    const correctAnswer = st.quizSongs[st.quizIdx];
    const isCorrect = (choice.id === correctAnswer.id);

    // 보기 버튼 스타일들 갱신
    const optionBtns = document.querySelectorAll('.cl-quiz-option-btn');
    optionBtns.forEach((btn, idx) => {
      const btnChoice = st.quizChoices[idx];
      if (btnChoice.id === correctAnswer.id) {
        // 정답 버튼 표시 (초록색)
        btn.style.borderColor = 'var(--secondary)';
        btn.style.background = 'rgba(16, 185, 129, 0.15)';
        btn.innerHTML = `✅ <strong>${btnChoice.composer}</strong> - ${btnChoice.title}`;
      } else if (btnChoice.id === choice.id && !isCorrect) {
        // 내가 선택한 오답 표시 (빨간색)
        btn.style.borderColor = 'var(--danger)';
        btn.style.background = 'rgba(239, 68, 68, 0.15)';
        btn.innerHTML = `❌ <strong>${btnChoice.composer}</strong> - ${btnChoice.title}`;
      }
      btn.disabled = true; // 전부 비활성화
    });

    if (isCorrect) {
      st.quizScore++;
      // 실시간 10P 지급
      window.AppAuth.getUserData().then(userData => {
        if (!userData) return;
        const newPoints = (userData.points || 0) + 10;
        window.AppAuth.updateUserData({ points: newPoints }).then(() => {
          const pointsEl = document.getElementById('user-points');
          if (pointsEl) pointsEl.textContent = `${newPoints} P`;
        });
      });
    }

    // 다음 문제로 패널 노출
    document.getElementById('cl-quiz-next-container').style.display = 'block';
  }

  function advanceQuiz() {
    st.quizIdx++;
    if (st.quizIdx < 10) {
      renderQuizQuestion();
    } else {
      renderQuizResult();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. 결과 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────
  function renderQuizResult() {
    showSubView('cl-result-area');
    
    document.getElementById('cl-result-score').textContent = `${st.quizScore} / 10`;
    
    const ptsEarned = st.quizScore * 10;
    document.getElementById('cl-result-points').textContent = `+${ptsEarned} P`;

    const msgEl = document.getElementById('cl-result-msg');
    if (st.quizScore === 10) {
      msgEl.innerHTML = '<span style="color:var(--secondary); font-weight:700;">🎉 완벽합니다! 클래식의 대가이시군요!</span>';
    } else if (st.quizScore >= 7) {
      msgEl.innerHTML = '<span style="color:var(--accent); font-weight:700;">👍 훌륭합니다! 클래식 소양이 풍부하시네요!</span>';
    } else if (st.quizScore >= 4) {
      msgEl.innerHTML = '<span style="color:var(--primary); font-weight:700;">🙂 조금 더 귀에 익혀 볼까요? 화이팅!</span>';
    } else {
      msgEl.innerHTML = '<span style="color:var(--text-muted);">🎵 클래식 학습 모드에서 음악들을 감상한 뒤 다시 도전해 보세요!</span>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. 외부 연동 API 바인딩
  // ─────────────────────────────────────────────────────────────────────────
  window.AppClassic = {
    init() {
      // 선택 화면 메뉴 버튼
      document.getElementById('cl-btn-start-quiz')
        ?.addEventListener('click', startQuizMode);

      // 재생 토글
      document.getElementById('cl-btn-play')
        ?.addEventListener('click', togglePlayPause);

      // 학습용 이전/다음
      document.getElementById('cl-btn-prev-song')?.addEventListener('click', () => {
        if (st.studyIndex > 0) {
          st.studyIndex--;
          renderStudyCard();
        }
      });
      document.getElementById('cl-btn-next-song')?.addEventListener('click', () => {
        if (st.studyIndex < st.studySongs.length - 1) {
          st.studyIndex++;
          renderStudyCard();
        }
      });

      // 학습완료 단추
      document.getElementById('cl-btn-complete-song')
        ?.addEventListener('click', markSongAsCompleted);

      // 뒤로 가기
      document.getElementById('cl-btn-study-back')?.addEventListener('click', () => {
        stopAudio();
        renderMenu();
      });
      document.getElementById('cl-btn-quiz-back')?.addEventListener('click', () => {
        stopAudio();
        renderMenu();
      });

      // 퀴즈 다음 문항
      document.getElementById('cl-btn-quiz-next')
        ?.addEventListener('click', advanceQuiz);

      // 결과 리트라이 및 메뉴
      document.getElementById('cl-btn-result-retry')
        ?.addEventListener('click', startQuizMode);
      document.getElementById('cl-btn-result-menu')
        ?.addEventListener('click', renderMenu);
    },

    enter() {
      showSubView('cl-menu-area');
      renderMenu();
    },

    stopAudio: stopAudio
  };

})();
