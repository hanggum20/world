// 온라인 퀴즈 게임 엔진 및 오디오 합성기 로직
(function() {
  // 퀴즈 엔진 상태 객체
  let state = {
    continent: 'all',
    type: 'flag', // 'flag', 'capital', 'map', 'mixed'
    questions: [],
    currentIndex: 0,
    score: 0,
    lives: 3,
    streak: 0,
    answered: false
  };

  function getCurrentData() {
    return window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
  }

  // --- Web Audio API 기반 효과음 합성기 (외부 오디오 파일 불필요) ---
  const AudioSynth = {
    ctx: null,

    init: function() {
      if (!this.ctx) {
        // 사용자 인터랙션 이후 오디오 컨텍스트 활성화
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
    },

    playTone: function(frequency, type, duration, startTimeOffset = 0) {
      if (!this.ctx) return;
      
      // 혹시 정지되어 있다면 재개
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime + startTimeOffset);
      
      // 부드러운 오디오 봉투(ADSR) 적용
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTimeOffset + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + startTimeOffset);
      osc.stop(this.ctx.currentTime + startTimeOffset + duration);
    },

    // 정답 시 효과음: 도-미-솔-도 빠른 아르페지오 (맑은 느낌)
    playCorrect: function() {
      this.init();
      const now = 0;
      this.playTone(523.25, 'sine', 0.1, now);     // C5
      this.playTone(659.25, 'sine', 0.1, now + 0.08); // E5
      this.playTone(783.99, 'sine', 0.1, now + 0.16); // G5
      this.playTone(1046.50, 'sine', 0.25, now + 0.24); // C6
    },

    // 오답 시 효과음: 낮은 도-파 디센딩 노이즈 성 효과음 (경고음)
    playWrong: function() {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.3); // A2 (슬라이드 다운)
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
    },

    // 퀴즈 성공(완료) 팡파르
    playFanfare: function() {
      this.init();
      const now = 0;
      // 도-솔-도-미-솔 빠른 아르페지오 이후 웅장한 화음
      this.playTone(523.25, 'triangle', 0.15, now);     // C5
      this.playTone(783.99, 'triangle', 0.15, now + 0.1); // G5
      this.playTone(1046.50, 'triangle', 0.15, now + 0.2); // C6
      this.playTone(1318.51, 'triangle', 0.15, now + 0.3); // E6
      
      // 화음 (C 메이저 코드)
      setTimeout(() => {
        this.playTone(523.25, 'sine', 0.8, 0);  // C5
        this.playTone(659.25, 'sine', 0.8, 0);  // E5
        this.playTone(783.99, 'sine', 0.8, 0);  // G5
        this.playTone(1046.50, 'sine', 0.8, 0); // C6
      }, 400);
    },

    // 게임 오버 슬픈 나팔소리
    playGameOver: function() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // 레-도#-도--- 디센딩 슬라이드
      [293.66, 277.18, 261.63].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.25));
        osc.frequency.linearRampToValueAtTime(freq - 20, now + (idx * 0.25) + 0.22);
        
        gain.gain.setValueAtTime(0.15, now + (idx * 0.25));
        gain.gain.linearRampToValueAtTime(0.001, now + (idx * 0.25) + 0.22);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + (idx * 0.25));
        osc.stop(now + (idx * 0.25) + 0.25);
      });
    }
  };

  // 1. 퀴즈 세팅 및 로딩
  function setupQuiz(continent, type) {
    state.continent = continent;
    state.type = type;
    state.score = 0;
    state.lives = 3;
    state.streak = 0;
    state.currentIndex = 0;
    state.answered = false;

    // 대륙에 해당하는 국가 목록 필터링
    let filteredList = getCurrentData();
    if (continent !== 'all') {
      filteredList = filteredList.filter(c => c.continent === continent);
    }

    // 출제 대상이 1개 이상이어야 함 (오답 보기는 전체 데이터에서 채움)
    if (filteredList.length < 1) {
      alert("출제 대상 지역이 없습니다. 대륙/권역을 다시 선택해 주세요!");
      return false;
    }

    // 10문제 무작위 셔플 후 선택 (국가 수가 10개 미만이면 전체 출제)
    const shuffled = [...filteredList].sort(() => 0.5 - Math.random());
    const count = Math.min(10, shuffled.length);
    state.questions = shuffled.slice(0, count);

    return true;
  }

  // 2. 현재 문항을 UI에 렌더링
  function renderQuestion() {
    state.answered = false;
    document.getElementById('btn-quiz-next').classList.add('hidden');

    const currentCountry = state.questions[state.currentIndex];
    
    // 문제 번호 갱신
    document.getElementById('quiz-question-number').textContent = `문제 ${state.currentIndex + 1}/${state.questions.length}`;
    
    // 점수 및 하트 동기화
    document.getElementById('quiz-score-display').textContent = state.score;
    updateHeartsUI();

    // 프로그레스 바 비율 조절
    const progressPercent = ((state.currentIndex) / state.questions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;

    // 퀴즈 유형별 뱃지 문구 설정
    const typeBadge = document.getElementById('quiz-title-badge');
    let currentQuestionType = state.type;
    
    // 믹스 모드인 경우 이번 문항의 퀴즈 종류를 랜덤으로 정의
    if (state.type === 'mixed') {
      const types = ['flag', 'capital', 'map'];
      currentQuestionType = types[Math.floor(Math.random() * types.length)];
    }

    // 모든 템플릿 영역 기본 숨김
    const flagImg = document.getElementById('quiz-flag-img');
    const textPrompt = document.getElementById('quiz-text-prompt');
    const mapQuizContainer = document.getElementById('quiz-map-container');
    flagImg.classList.add('hidden');
    textPrompt.classList.add('hidden');
    mapQuizContainer.classList.add('hidden');

    const promptText = document.getElementById('quiz-question-prompt');

    // 4지선다 보기 배열 생성 (정답 포함 4개 무작위 오답 배치)
    const options = generateOptions(currentCountry);

    // 각 유형별 UI 컴포넌트 셋업
    if (currentQuestionType === 'flag') {
      if (window.AppMode === 'world') {
        typeBadge.textContent = "국기 맞히기";
        promptText.textContent = "이 국기를 사용하는 나라는 어디일까요?";
        flagImg.src = `https://flagcdn.com/w160/${currentCountry.code}.png`;
      } else {
        typeBadge.textContent = "상징 맞히기";
        promptText.textContent = `[ ${currentCountry.capital} ] (이)가 유명한 곳은 어디일까요?`;
        const sym = currentCountry.symbol || '📍';
        const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${sym}</text></svg>`;
        if (currentCountry.logo) {
          flagImg.src = currentCountry.logo;
          flagImg.style.objectFit = 'contain';
          flagImg.style.background = '#fff';
          flagImg.style.padding = '12px';
          flagImg.style.borderRadius = '12px';
          flagImg.onerror = function() {
            this.src = fallbackSvg;
            this.style.objectFit = '';
            this.style.background = '';
            this.style.padding = '';
            this.style.borderRadius = '';
          };
        } else {
          flagImg.src = fallbackSvg;
          flagImg.style.objectFit = '';
          flagImg.style.background = '';
          flagImg.style.padding = '';
          flagImg.style.borderRadius = '';
          flagImg.onerror = null;
        }
      }
      flagImg.classList.remove('hidden');
      
      // 4지선다 보기 버튼에 텍스트 주입
      renderMultipleChoices(options, 'name');
      
    } else if (currentQuestionType === 'capital') {
      if (window.AppMode === 'world') {
        typeBadge.textContent = "수도 맞히기";
        promptText.textContent = `수도가 [ ${currentCountry.capital} ]인 나라는 어디일까요?`;
      } else {
        typeBadge.textContent = "소속 맞히기";
        promptText.textContent = `[ ${currentCountry.continent} ]에 속해 있는 곳은 어디일까요?`;
      }
      textPrompt.textContent = window.AppMode === 'world' ? currentCountry.capital : currentCountry.continent;
      textPrompt.classList.remove('hidden');
      
      renderMultipleChoices(options, 'name');

    } else if (currentQuestionType === 'map') {
      typeBadge.textContent = "지도 위치 찾기";
      promptText.textContent = window.AppMode === 'world' ? `아래 지도에 주황색으로 강조된 나라는 어디일까요?` : `아래 지도에 주황색으로 강조된 시·군·구는 어디일까요?`;
      mapQuizContainer.classList.remove('hidden');
      
      if (window.AppMode === 'world') {
        mapQuizContainer.innerHTML = window.WORLD_MAP_SVG || '';
        const svg = mapQuizContainer.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          
          svg.querySelectorAll('path').forEach(p => {
            p.style.fill = '';
            p.style.filter = '';
          });
          
          const targetPaths = svg.querySelectorAll(`path[id="${currentCountry.code}"], g[id="${currentCountry.code}"] path`);
          targetPaths.forEach(p => {
            p.style.fill = 'var(--accent)';
            p.style.filter = 'drop-shadow(0 0 6px var(--accent-glow))';
          });

          if (targetPaths.length > 0 && svg.getBBox) {
            try {
              const bbox = targetPaths[0].getBBox();
              const pad = Math.max(bbox.width, bbox.height) * 0.5;
              svg.setAttribute('viewBox', `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad*2} ${bbox.height + pad*2}`);
            } catch(e) { /* viewBox 설정 실패 시 무시 */ }
          }
        }
      } else {
        // Korea Mode: render the province map of the target district without labels
        const provKey = window.KOREA_PROVINCE_IDS && window.KOREA_PROVINCE_IDS[currentCountry.continent];
        if (provKey && window.KOREA_PROVINCE_MAPS && window.KOREA_PROVINCE_MAPS[provKey]) {
          const provMap = window.KOREA_PROVINCE_MAPS[provKey];
          const viewBox = provMap.viewBox || "0 0 600 400";
          let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
            <defs>
              <style>
                .kr-land {
                  fill: var(--map-country, #2a3550);
                  stroke: var(--map-stroke, #4a6090);
                  stroke-width: 0.8;
                }
              </style>
            </defs>
            <rect width="100%" height="100%" fill="none" class="kr-sea"/>
            <g>`;
          provMap.paths.forEach(p => {
            svgHtml += `<path class="kr-land" id="${p.code}" d="${p.d}" />`;
          });
          svgHtml += `</g></svg>`;
          
          mapQuizContainer.innerHTML = svgHtml;
          
          const svg = mapQuizContainer.querySelector('svg');
          if (svg) {
            const targetPaths = svg.querySelectorAll(`path[id="${currentCountry.code}"]`);
            targetPaths.forEach(p => {
              p.style.fill = 'var(--accent)';
              p.style.filter = 'drop-shadow(0 0 6px var(--accent-glow))';
            });
            
            const pathData = provMap.paths.find(p => p.code === currentCountry.code);
            if (pathData && pathData.cx !== undefined && pathData.cy !== undefined) {
              const cx = pathData.cx;
              const cy = pathData.cy;
              const zoomW = 140;
              const zoomH = 110;
              svg.setAttribute('viewBox', `${cx - zoomW/2} ${cy - zoomH/2} ${zoomW} ${zoomH}`);
            }
          }
        } else {
          mapQuizContainer.innerHTML = '<div style="padding:1rem;">지도 준비 중</div>';
        }
      }

      renderMultipleChoices(options, 'name');
    }
  }

  // 4지선다 오답 보기 자동 필터 생성
  // 오답은 전체 데이터 풀에서 추출 → 선택 권역이 4개 미만이어도 항상 4지선다 보장
  function generateOptions(correctCountry) {
    const allData = window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
    const distractors = allData
      .filter(c => c.code !== correctCountry.code)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // 정답 포함 후 셔플
    return [correctCountry, ...distractors].sort(() => 0.5 - Math.random());
  }

  // 버튼들에 보기 생성
  function renderMultipleChoices(options, key) {
    const btnContainer = document.getElementById('quiz-options-area');
    btnContainer.innerHTML = ''; // 버튼 초기화

    options.forEach((opt, idx) => {
      const button = document.createElement('button');
      button.className = 'quiz-option-btn';
      button.innerHTML = `<span>${idx + 1}. ${opt[key]}</span><span></span>`;
      
      button.addEventListener('click', () => {
        if (state.answered) return;
        checkAnswer(opt.code, button);
      });

      btnContainer.appendChild(button);
    });
  }

  // 3. 정답 여부 체크
  function checkAnswer(selectedCode, clickedButton) {
    state.answered = true;
    const currentCountry = state.questions[state.currentIndex];
    
    const optionButtons = document.querySelectorAll('.quiz-option-btn');

    if (selectedCode === currentCountry.code) {
      // 정답 처리
      clickedButton.classList.add('correct');
      clickedButton.querySelector('span:last-child').textContent = '⭕';
      
      AudioSynth.playCorrect();
      
      state.streak++;
      // 기본점수 10점 + 연속 정답 보너스(콤보 수 * 2점)
      const bonus = (state.streak - 1) * 2;
      state.score += (10 + bonus);
      
    } else {
      // 오답 처리
      clickedButton.classList.add('wrong');
      clickedButton.querySelector('span:last-child').textContent = '❌';
      
      AudioSynth.playWrong();
      state.streak = 0;
      state.lives--;

      // 정답이었던 다른 보기 버튼에 초록색 테두리 하이라이트 표시
      optionButtons.forEach(btn => {
        // 버튼 내부 텍스트에 정답 나라의 국문명이 포함되어 있는지 검사
        if (btn.textContent.includes(currentCountry.name)) {
          btn.classList.add('correct');
        }
      });
    }

    // 하트 개수 갱신
    updateHeartsUI();
    
    // 다음 문제 버튼 표시
    document.getElementById('btn-quiz-next').classList.remove('hidden');

    // 하트 소진 시 게임 오버 처리
    if (state.lives <= 0) {
      setTimeout(() => {
        finishQuiz(true); // 조기종료(게임오버)
      }, 1000);
    }
  }

  // 하트 그리기 헬퍼
  function updateHeartsUI() {
    const container = document.getElementById('quiz-hearts');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.textContent = (i < state.lives) ? '❤️' : '🖤';
      container.appendChild(heart);
    }
  }

  // 4. 퀴즈 종료 및 스코어 누적
  function finishQuiz(isGameOver = false) {
    AudioSynth.init();
    
    // 퀴즈 뷰 상태 변경
    document.getElementById('quiz-active-area').classList.add('hidden');
    const resultArea = document.getElementById('quiz-result-area');
    resultArea.classList.remove('hidden');

    const resultSummary = document.getElementById('quiz-result-summary');
    const resultScore = document.getElementById('quiz-result-score');
    const resultPoints = document.getElementById('quiz-result-points');
    const badgeEarnedArea = document.getElementById('result-badge-earned-area');

    badgeEarnedArea.classList.add('hidden');

    if (isGameOver) {
      AudioSynth.playGameOver();
      resultSummary.textContent = "하트를 모두 잃었습니다. 다시 도전해 보세요! 😢";
      resultScore.textContent = `${state.score} 점`;
      resultPoints.textContent = "+0 P";

      // 게임오버도 이력에 기록
      window.AppAuth.getUserData().then(userData => {
        if (!userData) return;
        const history = userData.quizHistory || [];
        history.unshift({
          date: new Date().toISOString(),
          mode: window.AppMode || 'world',
          continent: state.continent,
          type: state.type,
          score: state.score,
          maxScore: state.questions.length * 10,
          isGameOver: true
        });
        // 최대 50개만 보관
        if (history.length > 50) history.splice(50);
        window.AppAuth.updateUserData({ quizHistory: history });
      });
    } else {
      AudioSynth.playFanfare();
      
      // 전체 프로그레스바 100% 채우기
      document.getElementById('quiz-progress-bar').style.width = `100%`;
      
      resultSummary.textContent = `축하합니다! 퀴즈를 모두 통과하셨습니다!`;
      resultScore.textContent = `${state.score} 점`;
      
      // 획득 포인트를 유저 프로필에 저장
      const pointsToAward = state.score;
      resultPoints.textContent = `+${pointsToAward} P`;

      // 가상 데이터베이스에 점수 적재 및 배지 부여 확인
      window.AppAuth.getUserData().then(userData => {
        if (!userData) return;

        const updatedPoints = userData.points + pointsToAward;
        const newBadges = [...userData.badges];

        // 조건별 배지 지급 로직
        // 1. 척척박사 (첫 100점 돌파 또는 만점)
        if (state.score >= 100 && !newBadges.includes('quiz1')) {
          newBadges.push('quiz1');
          showEarnedBadge('💯', '척척박사 배지 획득!');
        }

        // 2. 아시아 마스터 (아시아 대륙 완료)
        if (state.continent === '아시아' && state.score >= 100 && !newBadges.includes('asia')) {
          newBadges.push('asia');
          showEarnedBadge('🐉', '아시아 마스터 배지 획득!');
        }

        // 3. 유럽 마스터 (유럽 대륙 완료)
        if (state.continent === '유럽' && state.score >= 100 && !newBadges.includes('europe')) {
          newBadges.push('europe');
          showEarnedBadge('🏰', '유럽 마스터 배지 획득!');
        }

        // 5. 국토 사랑 (국내 지리 완료)
        const koreaRegions = ['서울특별시', '경기도', '강원특별자치도', '충청권', '전라권', '경상권', '제주도'];
        if (koreaRegions.includes(state.continent) && state.score >= 100 && !newBadges.includes('korea')) {
          newBadges.push('korea');
          showEarnedBadge('🇰🇷', '국토 사랑 배지 획득!');
        }

        // 4. 세계 정복자 (누적 1000점 돌파)
        if (updatedPoints >= 1000 && !newBadges.includes('world')) {
          newBadges.push('world');
          showEarnedBadge('👑', '세계 정복자 배지 획득!');
        }

        // 퀴즈 이력 저장
        const history = userData.quizHistory || [];
        history.unshift({
          date: new Date().toISOString(),
          mode: window.AppMode || 'world',
          continent: state.continent,
          type: state.type,
          score: state.score,
          maxScore: state.questions.length * 10,
          isGameOver: false
        });
        if (history.length > 50) history.splice(50);

        // 유저 DB 갱신 (포인트 + 배지 + 이력)
        window.AppAuth.updateUserData({
          points: updatedPoints,
          badges: newBadges,
          quizHistory: history
        });
      });
    }
  }

  // 뱃지 획득 알림 활성화
  function showEarnedBadge(emoji, text) {
    const badgeEarnedArea = document.getElementById('result-badge-earned-area');
    badgeEarnedArea.classList.remove('hidden');
    document.getElementById('result-badge-icon').textContent = emoji;
    document.getElementById('result-badge-name').textContent = text;
  }

  // 5. 외부 노출 API 바인딩
  window.AppAudioSynth = AudioSynth;
  window.AppQuiz = {
    // 퀴즈 초기 설정
    start: function(continent, type) {
      const ok = setupQuiz(continent, type);
      if (ok) {
        document.getElementById('quiz-setup-area').classList.add('hidden');
        document.getElementById('quiz-active-area').classList.remove('hidden');
        renderQuestion();
      }
    },
    // 다음 문제 넘어가기
    nextQuestion: function() {
      state.currentIndex++;
      if (state.currentIndex < state.questions.length) {
        renderQuestion();
      } else {
        finishQuiz(false); // 퀴즈 정상 완주
      }
    },
    // 퀴즈 중도 이탈
    exit: function() {
      if (confirm("정말로 퀴즈를 그만두시겠습니까? 진행 중인 기록은 유실됩니다.")) {
        document.getElementById('quiz-active-area').classList.add('hidden');
        document.getElementById('quiz-setup-area').classList.remove('hidden');
        state.lives = 0;
      }
    },
    // 모드별 필터 칩 초기화
    init: function() {
      const container = document.getElementById('quiz-setup-continents');
      if (!container) return;
      if (window.AppMode === 'world') {
        container.innerHTML = `
          <button class="filter-chip active" data-continent="all">전세계 전체</button>
          <button class="filter-chip" data-continent="아시아">아시아</button>
          <button class="filter-chip" data-continent="유럽">유럽</button>
          <button class="filter-chip" data-continent="북아메리카">북아메리카</button>
          <button class="filter-chip" data-continent="남아메리카">남아메리카</button>
          <button class="filter-chip" data-continent="아프리카">아프리카</button>
          <button class="filter-chip" data-continent="오세아니아">오세아니아</button>
        `;
      } else {
        container.innerHTML = `
          <button class="filter-chip active" data-continent="all">전국 전체</button>
          <button class="filter-chip" data-continent="서울특별시">서울</button>
          <button class="filter-chip" data-continent="경기도">경기</button>
          <button class="filter-chip" data-continent="강원특별자치도">강원</button>
          <button class="filter-chip" data-continent="충청권">충청</button>
          <button class="filter-chip" data-continent="전라권">전라</button>
          <button class="filter-chip" data-continent="경상권">경상</button>
          <button class="filter-chip" data-continent="제주도">제주</button>
        `;
      }
    }
  };
})();
