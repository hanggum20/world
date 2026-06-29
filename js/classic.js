// 180곡 클래식 학습 (3곡씩 60그룹) 및 플래시/확인 퀴즈 로직
(function() {
  // 상태 관리 객체
  const st = {
    mode: null,                    // 'study' 또는 'quiz'
    selectedGroup: null,           // 1 ~ 60 그룹
    
    // 학습 모드 관련
    studyIndex: 0,                 // 0 ~ 2 (그룹 내 3곡)
    studySongs: [],                // 현재 그룹의 3곡
    audio: null,                   // 오디오 객체
    isPlaying: false,
    audioTimer: null,              // 30초 타이머
    playTimeElapsed: 0,
    timeIndicatorTimer: null,

    // 퀴즈 모드 관련
    quizSongs: [],                 // 현재 그룹의 3곡 (학습한 곡)
    quizIdx: 0,                    // 0 ~ 2 문항 번호
    quizScore: 0,                  // 맞힌 개수
    quizAnswered: false,
    quizChoices: []
  };

  // 작곡가 아이콘 매핑
  const COMPOSER_EMOJIS = {
    "파헬벨": "🎻", "바흐": "🎹", "비발디": "🎼", "헨델": "🎺", "모차르트": "🐉",
    "하이든": "🏰", "보케리니": "🎻", "글루크": "🌾", "베토벤": "⚡", "클레멘티": "🎹",
    "슈베르트": "🐟", "멘델스존": "💍", "슈만": "❤️", "쇼팽": "☔", "리스트": "🔔",
    "브람스": "👶", "차이콥스키": "🦢", "생상스": "🦁", "베르디": "☄️", "그리그": "🌄",
    "시벨리우스": "❄️", "스메타나": "🌊", "드보르자크": "🚂", "무소르그스키": "🎨",
    "림스키코르사코프": "🐝", "드뷔시": "🌙", "라벨": "🥁", "에릭 사티": "🛋️",
    "엘가": "🎖️", "홀스트": "🪐", "스트라빈스키": "🔥", "거슈윈": "🎷", "바다르체프스카": "🙏",
    "랑게": "💐", "루빈스타인": "🎹", "오펜바흐": "💃", "요한 슈트라우스 2세": "🌊", "바그너": "🛡️",
    "마스네": "🎻", "포레": "🌾", "크라이슬러": "🎻", "라흐마니노프": "🎹", "비제": "🐂", "로시니": "🏹"
  };

  // 하위 뷰 관리
  function showSubView(subViewId) {
    stopAudio();
    const subViews = ['cl-menu-area', 'cl-study-area', 'cl-quiz-area', 'cl-result-area'];
    subViews.forEach(vid => {
      const el = document.getElementById(vid);
      if (el) {
        el.style.display = (vid === subViewId) ? 'block' : 'none';
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. 오디오 제어
  // ─────────────────────────────────────────────────────────────────────────
  function playAudio(url) {
    stopAudio();

    st.audio = new Audio(url);
    st.audio.volume = 0.8;
    st.playTimeElapsed = 0;
    st.isPlaying = true;
    updatePlayPauseBtnUI(true);

    st.audio.play().then(() => {
      // 30초 자동 중지
      st.audioTimer = setTimeout(() => {
        stopAudio();
        alert("⏱️ 30초 미리듣기가 완료되었습니다.");
      }, 30000);

      // 프로그레스바 및 타이머 가동
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
      if (timeText) timeText.textContent = "⚠️ 재생 불가 (음원 주소 확인)";
      updatePlayPauseBtnUI(false);
    });
  }

  function pauseAudio() {
    if (st.audio && st.isPlaying) {
      st.audio.pause();
      st.isPlaying = false;
      updatePlayPauseBtnUI(false);
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
        console.error("재생 실패:", err);
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

    const progBar = document.getElementById('cl-play-progress');
    const timeText = document.getElementById('cl-play-time');
    if (progBar) progBar.style.width = '0%';
    if (timeText) timeText.textContent = '00:00 / 00:30';
  }

  function togglePlayPause() {
    if (!st.audio) {
      const song = (st.mode === 'study') ? st.studySongs[st.studyIndex] : st.quizSongs[st.quizIdx];
      if (song) playAudio(song.audioUrl);
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
    const quizPlayBtn = document.getElementById('cl-btn-play-quiz');
    const label = playing ? '⏸️ 일시정지' : '▶️ 음악 듣기 (30초)';
    const cls = playing ? 'btn btn-outline' : 'btn btn-primary';

    if (playBtn) {
      playBtn.innerHTML = label;
      playBtn.className = cls;
    }
    if (quizPlayBtn) {
      quizPlayBtn.innerHTML = label;
      quizPlayBtn.className = cls;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. 그룹 목록 화면
  // ─────────────────────────────────────────────────────────────────────────
  function renderMenu() {
    showSubView('cl-menu-area');
    const grid = document.getElementById('cl-stage-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const buildCards = (completedGroups) => {
      for (let groupId = 1; groupId <= 60; groupId++) {
        const isDone = completedGroups.includes(groupId);
        const groupSongs = window.CLASSIC_DATA.filter(s => s.group === groupId);
        
        // 해당 그룹 작곡가 3명 리스트 정리
        const composers = groupSongs.map(s => s.composer).join(', ');

        const card = document.createElement('div');
        card.className = `fc-continent-card ${isDone ? 'completed' : ''}`;
        card.style.setProperty('--fc-color', isDone ? 'var(--secondary)' : 'var(--primary)');
        card.style.cursor = 'pointer';
        
        card.innerHTML = `
          <div class="fc-continent-emoji">${isDone ? '✅' : '🎵'}</div>
          <h3 style="font-size:1.05rem; margin-top:0.4rem;">그룹 ${groupId} 학습</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem; line-height:1.4;">${composers}</p>
          <div class="fc-continent-stats" style="margin-top:0.6rem;">
            <span>3곡 수록</span>
            <span>${isDone ? '완료 🌟' : '미완료'}</span>
          </div>
          <button class="btn btn-primary fc-start-btn" style="width:100%; margin-top:0.8rem; border:none; background: ${isDone ? 'var(--secondary)' : 'var(--primary)'};">학습 시작</button>
        `;

        card.addEventListener('click', () => startStudyGroup(groupId));
        card.querySelector('.fc-start-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          startStudyGroup(groupId);
        });

        grid.appendChild(card);
      }
    };

    window.AppAuth.getUserData().then(userData => {
      const completedGroups = userData ? (userData.completedClassicGroups || []) : [];
      buildCards(completedGroups);
    }).catch(err => {
      console.warn("Using offline fallback for classic menu:", err);
      buildCards([]);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. 플래시카드 감상 학습
  // ─────────────────────────────────────────────────────────────────────────
  function startStudyGroup(groupId) {
    st.mode = 'study';
    st.selectedGroup = groupId;
    st.studyIndex = 0;
    st.studySongs = window.CLASSIC_DATA.filter(s => s.group === groupId);

    showSubView('cl-study-area');
    renderStudyCard();
  }

  function renderStudyCard() {
    stopAudio();
    const song = st.studySongs[st.studyIndex];
    if (!song) return;

    // 헤더 및 프로그레스바 갱신
    document.getElementById('cl-study-stage-title').textContent = `클래식 학습 그룹 ${st.selectedGroup}`;
    document.getElementById('cl-study-progress-text').textContent = `${st.studyIndex + 1} / 3`;

    // 곡 내용 주입
    const emoji = COMPOSER_EMOJIS[song.composer] || '🎼';
    document.getElementById('cl-composer-emoji').textContent = emoji;
    document.getElementById('cl-composer-name').textContent = song.composer;
    document.getElementById('cl-song-title').textContent = song.title;
    document.getElementById('cl-song-era').textContent = `${song.era} 음악`;
    document.getElementById('cl-song-trivia').textContent = song.trivia;

    // 완료 체크버튼 -> 3곡이므로 체크 필요없이 다음 곡으로 순회하며, 마지막 곡일 때 확인 퀴즈로 유도
    const btnComplete = document.getElementById('cl-btn-complete-song');
    if (btnComplete) btnComplete.style.display = 'none'; // 개별 완료 버튼 비활성 (그룹 퀴즈 완료 시 보상)

    // 버튼 라벨 조율
    document.getElementById('cl-btn-prev-song').disabled = (st.studyIndex === 0);
    
    const nextBtn = document.getElementById('cl-btn-next-song');
    if (st.studyIndex === 2) {
      nextBtn.innerHTML = '🏆 확인 퀴즈 풀기';
      nextBtn.className = 'btn btn-primary';
    } else {
      nextBtn.innerHTML = '다음 곡 →';
      nextBtn.className = 'btn btn-outline';
    }
  }

  function handleNextStudyStep() {
    if (st.studyIndex < 2) {
      st.studyIndex++;
      renderStudyCard();
    } else {
      // 3곡 모두 감상 완료 -> 퀴즈로 바로 진입!
      startGroupQuiz();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. 확인 퀴즈 (3문항)
  // ─────────────────────────────────────────────────────────────────────────
  function startGroupQuiz() {
    st.mode = 'quiz';
    st.quizIdx = 0;
    st.quizScore = 0;
    st.quizSongs = st.studySongs; // 감상한 3곡이 바로 출제 범위!

    showSubView('cl-quiz-area');
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    stopAudio();
    st.quizAnswered = false;

    const song = st.quizSongs[st.quizIdx];
    if (!song) return;

    // 헤더 상태
    document.getElementById('cl-quiz-progress-text').textContent = `문제 ${st.quizIdx + 1} / 3`;
    document.getElementById('cl-quiz-score-text').textContent = `맞힌 개수: ${st.quizScore}개`;

    // 다음 문항 가기 버튼 숨김
    document.getElementById('cl-quiz-next-container').style.display = 'none';

    // 4지선다 보기 구성
    // 오답은 현재 속한 그룹 이외의 전체 180곡 중에서 무작위 3곡 선택
    const pool = window.CLASSIC_DATA.filter(s => s.group !== st.selectedGroup);
    const incorrect = [];
    while (incorrect.length < 3) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (!incorrect.some(x => x.id === candidate.id)) {
        incorrect.push(candidate);
      }
    }

    // 정답 + 오답 병합 및 셔플
    st.quizChoices = [song, ...incorrect].sort(() => 0.5 - Math.random());

    // 보기 렌더링
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

    stopAudio(); // 클릭 시 오디오 멈춤

    const correctAnswer = st.quizSongs[st.quizIdx];
    const isCorrect = (choice.id === correctAnswer.id);

    const optionBtns = document.querySelectorAll('.cl-quiz-option-btn');
    optionBtns.forEach((btn, idx) => {
      const btnChoice = st.quizChoices[idx];
      if (btnChoice.id === correctAnswer.id) {
        btn.style.borderColor = 'var(--secondary)';
        btn.style.background = 'rgba(16, 185, 129, 0.15)';
        btn.innerHTML = `✅ <strong>${btnChoice.composer}</strong> - ${btnChoice.title}`;
      } else if (btnChoice.id === choice.id && !isCorrect) {
        btn.style.borderColor = 'var(--danger)';
        btn.style.background = 'rgba(239, 68, 68, 0.15)';
        btn.innerHTML = `❌ <strong>${btnChoice.composer}</strong> - ${btnChoice.title}`;
      }
      btn.disabled = true;
    });

    if (isCorrect) {
      st.quizScore++;
      // 한 문제당 10P 즉시 적립!
      window.AppAuth.getUserData().then(userData => {
        if (!userData) return;
        const newPoints = (userData.points || 0) + 10;
        window.AppAuth.updateUserData({ points: newPoints }).then(() => {
          const pointsEl = document.getElementById('user-points');
          if (pointsEl) pointsEl.textContent = `${newPoints} P`;
        });
      }).catch(err => {
        console.warn("Failed to update points offline:", err);
      });
    }

    // 다음 버튼 활성화 및 라벨 조정
    const nextBtn = document.getElementById('cl-btn-quiz-next');
    if (st.quizIdx === 2) {
      nextBtn.textContent = '결과 보기 →';
    } else {
      nextBtn.textContent = '다음 문제 →';
    }
    document.getElementById('cl-quiz-next-container').style.display = 'block';
  }

  function advanceQuiz() {
    st.quizIdx++;
    if (st.quizIdx < 3) {
      renderQuizQuestion();
    } else {
      renderQuizResult();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. 결과 화면 및 Firestore 동기화
  // ─────────────────────────────────────────────────────────────────────────
  function renderQuizResult() {
    showSubView('cl-result-area');

    document.getElementById('cl-result-score').textContent = `${st.quizScore} / 3`;
    const ptsEarned = st.quizScore * 10;
    document.getElementById('cl-result-points').textContent = `+${ptsEarned} P`;

    const msgEl = document.getElementById('cl-result-msg');
    if (st.quizScore === 3) {
      msgEl.innerHTML = '<span style="color:var(--secondary); font-weight:700;">🎉 완벽합니다! 3곡의 정보를 모두 정복하셨습니다!</span>';
    } else if (st.quizScore >= 1) {
      msgEl.innerHTML = '<span style="color:var(--accent); font-weight:700;">👍 대단합니다! 조금만 복습하면 완벽하게 마스터할 수 있어요!</span>';
    } else {
      msgEl.innerHTML = '<span style="color:var(--text-muted);">😢 한 번 더 복습하고 재도전하여 포인트를 획득해 보세요!</span>';
    }

    // 그룹 완료 처리 동기화
    window.AppAuth.getUserData().then(userData => {
      if (!userData) return;
      const completedGroups = userData.completedClassicGroups || [];
      if (!completedGroups.includes(st.selectedGroup)) {
        completedGroups.push(st.selectedGroup);
        window.AppAuth.updateUserData({
          completedClassicGroups: completedGroups
        });
      }
    }).catch(err => {
      console.warn("Failed to synchronize completed group offline:", err);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. 외부 연동 API 바인딩
  // ─────────────────────────────────────────────────────────────────────────
  window.AppClassic = {
    init() {
      // 퀴즈 재생 단추
      document.getElementById('cl-btn-play-quiz')
        ?.addEventListener('click', togglePlayPause);

      // 공용 재생 토글
      document.getElementById('cl-btn-play')
        ?.addEventListener('click', togglePlayPause);

      // 학습용 이전/다음
      document.getElementById('cl-btn-prev-song')?.addEventListener('click', () => {
        if (st.studyIndex > 0) {
          st.studyIndex--;
          renderStudyCard();
        }
      });
      document.getElementById('cl-btn-next-song')?.addEventListener('click', handleNextStudyStep);

      // 뒤로가기
      document.getElementById('cl-btn-study-back')?.addEventListener('click', () => {
        stopAudio();
        renderMenu();
      });
      document.getElementById('cl-btn-quiz-back')?.addEventListener('click', () => {
        stopAudio();
        renderMenu();
      });

      // 퀴즈 진행
      document.getElementById('cl-btn-quiz-next')
        ?.addEventListener('click', advanceQuiz);

      // 결과 리트라이 및 메뉴
      document.getElementById('cl-btn-result-retry')
        ?.addEventListener('click', startGroupQuiz);
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
