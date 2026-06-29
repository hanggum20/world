// 지도 플래시 학습 모드 엔진 (대륙별 5개 단위 학습 + TTS + 확인 퀴즈 + 오답 노트)
(function () {

  // ── 지역 마크 헬퍼 ─────────────────────────────────────────────────────────
  // logo URL이 있으면 실제 이미지를, 없으면 emoji(symbol)를, 둘 다 없으면 📍를 반환
  function getRegionMarkHtml(country, size) {
    // size: 'sm' (그룹 목록), 'md' (오답 카드), 'lg' (플래시카드/퀴즈)
    const sizeMap = { sm: '2rem', md: '2rem', lg: '5rem' };
    const imgSizeMap = { sm: '36px', md: '36px', lg: '96px' };
    const s = sizeMap[size] || '2rem';
    const imgS = imgSizeMap[size] || '36px';
    const sym = country.symbol || '📍';
    if (country.logo) {
      return `<img src="${country.logo}" alt="${country.name} 마크" title="${country.name}" style="height:${imgS};width:${imgS};object-fit:contain;border-radius:4px;background:#fff;padding:2px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span style="font-size:${s};display:none;" title="${country.name}">${sym}</span>`;
    }
    return `<span style="font-size:${s};" title="${country.name}">${sym}</span>`;
  }

  // 플래시카드용 img src 반환 (SVG data URI 또는 logo URL)
  function getRegionImgSrc(country) {
    if (country.logo) return country.logo;
    const sym = country.symbol || '📍';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${sym}</text></svg>`;
  }


  // ── 상태 ──────────────────────────────────────────────────────────────────
  const st = {
    continent: null,          // 선택 대륙
    allCountries: [],         // 해당 대륙 전체 국가 배열
    groups: [],               // 5개씩 나눈 그룹 배열
    groupIdx: 0,              // 현재 그룹 번호
    cardIdx: 0,               // 현재 카드(국가) 번호
    autoPlay: true,           // 자동 넘기기 여부
    autoTimer: null,          // setInterval 핸들러
    autoDelay: 4500,          // 자동 넘기기 딜레이 (ms)

    // 퀴즈 관련
    quizQuestions: [],
    quizIdx: 0,
    quizScore: 0,
    quizAnswered: false,
    quizAttempts: 0,          // 현재 문제의 오답 시도 횟수
    isNextLocked: false,      // 다음 버튼 잠금 여부
    nextLockTimer: null,      // 다음 버튼 잠금 타이머

    // 오답 노트 관련
    sessionWrongCodes: [],    // 현재 퀴즈 세션에서 틀린 나라 코드
    wrongStudyMode: false,    // 오답 학습 모드 여부
    wrongStudyGroupKey: null, // 현재 오답 학습 그룹 키
    wrongStudyGroupIdx: null, // 오답 학습 그룹 인덱스 (복귀용)
    wrongStudyBatches: [],    // 오답 학습 배치 목록 (전체)
    level: 'basic',           // 'basic' (기본 - 교과서) 또는 'advanced' (심화 - 전체)
  };

  function getCurrentData() {
    return window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
  }

  function getLevelCountries() {
    const allData = getCurrentData();
    if (window.AppMode === 'world' && st.level === 'basic') {
      const limitMap = {
        '아시아': 30,
        '유럽': 25,
        '북아메리카': 20,
        '남아메리카': 15,
        '아프리카': 25,
        '오세아니아': 10
      };
      
      const filtered = [];
      Object.keys(limitMap).forEach(cont => {
        const contCountries = allData.filter(c => c.continent === cont);
        const limit = limitMap[cont];
        filtered.push(...contCountries.slice(0, limit));
      });
      return filtered;
    }
    return allData;
  }

  // ── TTS ───────────────────────────────────────────────────────────────────
  const TTS = {
    speak(country) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      let text;
      if (window.AppMode === 'world') {
        text = `${country.name}. 수도는 ${country.capital} 입니다. ${country.continent}에 위치합니다.`;
      } else {
        text = `${country.name}. 대표 상징은 ${country.capital} 이며, ${country.continent}에 속해 있습니다.`;
      }

      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'ko-KR';
      utt.rate = 0.88;
      utt.pitch = 1.05;
      utt.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koVoice) utt.voice = koVoice;
      window.speechSynthesis.speak(utt);
    },
    stop() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  // ── 헬퍼: 5개씩 그룹으로 분할 ──────────────────────────────────────────────
  function makeGroups(countries) {
    const g = [];
    for (let i = 0; i < countries.length; i += 5) {
      g.push(countries.slice(i, i + 5));
    }
    return g;
  }

  // ── 헬퍼: 여러 엘리먼트의 통합 bounding box 계산 ─────────────────────────
  function getElementsBBox(elements) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    elements.forEach(el => {
      try {
        const bbox = el.getBBox();
        if (bbox.width === 0 && bbox.height === 0) return;
        if (bbox.x < minX) minX = bbox.x;
        if (bbox.y < minY) minY = bbox.y;
        if (bbox.x + bbox.width > maxX) maxX = bbox.x + bbox.width;
        if (bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
      } catch (e) {}
    });
    if (minX === Infinity) return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  // ── 헬퍼: SVG 지도에서 국가 강조 및 줌인 ─────────────────────────────────
  function highlightCountryOnMiniMap(containerEl, countryCode) {
    if (window.AppMode === 'world') {
      const mapSvg = window.WORLD_MAP_SVG;
      if (!mapSvg) {
        containerEl.innerHTML = '<div style="padding:1rem;color:var(--text-muted);">지도 준비 중</div>';
        return;
      }
      containerEl.innerHTML = mapSvg;
      const svg = containerEl.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.borderRadius = '12px';

      // 모든 path 초기화
      svg.querySelectorAll('path').forEach(p => {
        p.style.fill = 'var(--map-country, #2c364c)';
        p.style.stroke = 'var(--map-stroke, #151c2c)';
        p.style.strokeWidth = '0.5';
      });

      // 현재 그룹에 속한 지역들 연보라로 강조
      if (st.allCountries && st.allCountries.length) {
        const continentCodes = new Set(st.allCountries.map(c => c.code));
        svg.querySelectorAll('path').forEach(p => {
          const parentG = p.closest('g');
          const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : p.id.toLowerCase();
          if (continentCodes.has(code) && code !== countryCode) {
            p.style.fill = 'rgba(99, 102, 241, 0.25)';
          }
        });
      }

      // 타겟 path 주황색 강조
      const targets = svg.querySelectorAll(
        `path[id="${countryCode}"], g[id="${countryCode}"] path, path[data-code="${countryCode}"]`
      );
      targets.forEach(p => {
        p.style.fill = 'var(--accent, #f59e0b)';
        p.style.filter = 'drop-shadow(0 0 8px var(--accent-glow, rgba(245, 158, 11, 0.5)))';
        p.style.stroke = '#fff';
        p.style.strokeWidth = '0.8';
      });

      // path 기준 줌인 (World Mode)
      const bbox = getElementsBBox(Array.from(targets));
      if (bbox) {
        const paddingX = Math.max(bbox.width * 0.6, 75);
        const paddingY = Math.max(bbox.height * 0.6, 55);
        const finalWidth = Math.max(bbox.width + paddingX * 2, 180);
        const finalHeight = Math.max(bbox.height + paddingY * 2, 135);
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        svg.setAttribute('viewBox', `${centerX - finalWidth / 2} ${centerY - finalHeight / 2} ${finalWidth} ${finalHeight}`);
      }
    } else {
      // Korea Mode: render the province map of the target district
      const targetCountry = window.KOREA_DATA.find(c => c.code === countryCode);
      if (!targetCountry) {
        containerEl.innerHTML = '<div style="padding:1rem;color:var(--text-muted);">지역 정보 없음</div>';
        return;
      }
      const provKey = window.KOREA_PROVINCE_IDS && window.KOREA_PROVINCE_IDS[targetCountry.continent];
      if (!provKey || !window.KOREA_PROVINCE_MAPS || !window.KOREA_PROVINCE_MAPS[provKey]) {
        containerEl.innerHTML = '<div style="padding:1rem;color:var(--text-muted);">지도 준비 중</div>';
        return;
      }

      const provMap = window.KOREA_PROVINCE_MAPS[provKey];
      const viewBox = provMap.viewBox || "0 0 600 400";
      
      // We will render the province map with text labels for study context
      let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" style="border-radius:12px;">
        <defs>
          <style>
            .kr-land {
              fill: var(--map-country, #2c364c);
              stroke: var(--map-stroke, #151c2c);
              stroke-width: 0.8;
            }
            .kr-label {
              font-family: 'Noto Sans KR', sans-serif;
              font-size: 7.5px;
              fill: #cbd5e1;
              pointer-events: none;
              text-anchor: middle;
              font-weight: 500;
              text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            }
            [data-theme="light"] .kr-label {
              fill: #1e293b;
              text-shadow: 0 1px 1px rgba(255,255,255,0.8);
            }
          </style>
        </defs>
        <rect width="100%" height="100%" fill="none" class="kr-sea"/>
        <g id="province-paths">`;

      provMap.paths.forEach(p => {
        svgHtml += `<path class="kr-land" id="${p.code}" d="${p.d}" />`;
      });

      svgHtml += `</g><g id="province-labels" pointer-events="none">`;

      provMap.paths.forEach(p => {
        if (p.cx !== undefined && p.cy !== undefined) {
          svgHtml += `<text class="kr-label" id="label-${p.code}" x="${p.cx}" y="${p.cy + 3}">${p.name}</text>`;
        }
      });

      svgHtml += `</g></svg>`;

      containerEl.innerHTML = svgHtml;
      const svg = containerEl.querySelector('svg');
      if (!svg) return;

      // Highlight other group members in light purple
      const currentGroup = st.groups[st.groupIdx] || [];
      const groupCodes = new Set(currentGroup.map(c => c.code));

      svg.querySelectorAll('path').forEach(p => {
        const code = p.getAttribute('id');
        if (groupCodes.has(code) && code !== countryCode) {
          p.style.fill = 'rgba(99, 102, 241, 0.25)';
        }
      });

      // Highlight the target district in orange
      const targetPath = svg.querySelector(`path[id="${countryCode}"]`);
      if (targetPath) {
        targetPath.style.fill = 'var(--accent, #f59e0b)';
        targetPath.style.filter = 'drop-shadow(0 0 8px var(--accent-glow, rgba(245, 158, 11, 0.5)))';
        targetPath.style.stroke = '#fff';
        targetPath.style.strokeWidth = '1.0';
      }

      // Zoom to the target district
      const pathData = provMap.paths.find(p => p.code === countryCode);
      if (pathData && pathData.cx !== undefined && pathData.cy !== undefined) {
        const cx = pathData.cx;
        const cy = pathData.cy;
        const zoomW = 150;
        const zoomH = 120;
        svg.setAttribute('viewBox', `${cx - zoomW/2} ${cy - zoomH/2} ${zoomW} ${zoomH}`);
      }
    }
  }

  // ── 뷰 전환 헬퍼 ─────────────────────────────────────────────────────────
  function showSubView(id) {
    ['fc-continent-select', 'fc-group-select', 'fc-learn-area', 'fc-quiz-area', 'fc-result-area', 'fc-wrong-area']
      .forEach(sid => {
        const el = document.getElementById(sid);
        if (el) el.classList.toggle('hidden', sid !== id);
      });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. 대륙 선택 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────
  function renderContinentSelect() {
    TTS.stop();
    clearAutoPlay();
    st.wrongStudyMode = false;
    showSubView('fc-continent-select');

    // 난이도 선택기 표시 제어 및 활성 탭 동기화
    const levelWrapper = document.getElementById('fc-level-tab-wrapper');
    if (levelWrapper) {
      if (window.AppMode === 'world') {
        levelWrapper.style.display = 'flex';
        const tabs = levelWrapper.querySelectorAll('.fc-level-tab');
        tabs.forEach(tab => {
          if (tab.getAttribute('data-fc-level') === st.level) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
      } else {
        levelWrapper.style.display = 'none';
      }
    }

    let CONTINENT_META = {};
    if (window.AppMode === 'world') {
      CONTINENT_META = {
        '아시아':    { emoji: '🐉', color: '#6366f1' },
        '유럽':      { emoji: '🏰', color: '#8b5cf6' },
        '북아메리카':{ emoji: '🗽', color: '#10b981' },
        '남아메리카':{ emoji: '🌿', color: '#f59e0b' },
        '아프리카':  { emoji: '🦁', color: '#ef4444' },
        '오세아니아':{ emoji: '🦘', color: '#06b6d4' }
      };
    } else {
      CONTINENT_META = {
        '서울특별시': { emoji: '🏙️', color: '#6366f1' },
        '경기도': { emoji: '🏞️', color: '#8b5cf6' },
        '강원특별자치도': { emoji: '⛰️', color: '#10b981' },
        '충청권': { emoji: '♨️', color: '#f59e0b' },
        '전라권': { emoji: '🍚', color: '#ef4444' },
        '경상권': { emoji: '🏭', color: '#06b6d4' },
        '제주도': { emoji: '🍊', color: '#f43f5e' }
      };
    }

    const container = document.getElementById('fc-continent-grid');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(CONTINENT_META).forEach(cont => {
      const countries = getLevelCountries().filter(c => c.continent === cont);
      if (countries.length === 0) return; // 데이터가 없는 지역은 표시하지 않음
      
      const groupCount = Math.ceil(countries.length / 5);
      const meta = CONTINENT_META[cont];

      const card = document.createElement('div');
      card.className = 'fc-continent-card';
      card.style.setProperty('--fc-color', meta.color);
      card.innerHTML = `
        <div class="fc-continent-emoji">${meta.emoji}</div>
        <h3>${cont}</h3>
        <div class="fc-continent-stats">
          <span>🌍 ${countries.length}개국</span>
          <span>📚 ${groupCount}개 그룹</span>
        </div>
        <button class="btn btn-primary fc-start-btn" style="width:100%; margin-top:0.8rem; background: ${meta.color};">학습 시작</button>
      `;
      card.addEventListener('click', () => startContinent(cont));
      card.querySelector('.fc-start-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        startContinent(cont);
      });
      container.appendChild(card);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. 그룹 선택 화면 렌더링 (타일 그리드 + 학습 통계)
  // ─────────────────────────────────────────────────────────────────────────
  function startContinent(continent) {
    st.continent = continent;
    st.allCountries = getLevelCountries().filter(c => c.continent === continent);
    st.groups = makeGroups(st.allCountries);
    renderGroupSelect();
  }

  function renderGroupSelect() {
    st.wrongStudyMode = false;
    showSubView('fc-group-select');

    document.getElementById('fc-gs-title').textContent = `${st.continent} 학습 그룹 선택`;
    document.getElementById('fc-gs-subtitle').textContent =
      `${st.allCountries.length}개국을 5개씩 ${st.groups.length}개 그룹으로 나누어 학습합니다.`;

    const list = document.getElementById('fc-group-list');
    list.innerHTML = '<div style="text-align:center;padding:2.5rem;color:var(--text-muted);">⏳ 학습 기록 불러오는 중...</div>';

    window.AppAuth.getUserData()
      .then(userData => {
        const completedGroups = (userData && userData.completedFlashcards) || [];
        const stats = (userData && userData.flashcardStats) || {};
        renderGroupTiles(list, completedGroups, stats);
      })
      .catch(err => {
        console.error('그룹 데이터 동기화 실패 (오프라인 진행):', err);
        renderGroupTiles(list, [], {});
      });
  }

  function renderGroupTiles(list, completedGroups, stats) {
    list.innerHTML = '';
    list.className = 'fc-group-tile-grid';

    st.groups.forEach((group, idx) => {
      const groupKey = `${st.continent}_group_${idx}`;
      const isCompleted = completedGroups.includes(groupKey);
      const gStats = stats[groupKey] || {};
      const sessionCount = gStats.sessionCount || 0;
      const wrongCounts = gStats.wrongCounts || {};
      const wrongList = gStats.wrongList || {};
      const wrongListCodes = Object.keys(wrongList);
      const wrongTotal = wrongListCodes.length;

      // 자주 틀리는 나라 TOP 3
      const topWrong = Object.entries(wrongCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const tile = document.createElement('div');
      tile.className = 'fc-group-tile glass-panel';
      if (isCompleted) tile.classList.add('completed');
      if (wrongTotal > 0) tile.classList.add('has-wrong');

      const names = group.map(c => c.name).join(', ');

      // 오답 섹션
      let wrongSection = '';
      if (wrongTotal > 0) {
        const topWrongHtml = topWrong.map(([code, cnt]) => {
          const country = getCurrentData().find(c => c.code === code);
          if (!country) return '';
          
          let flagHtml = '';
          if (window.AppMode === 'world') {
            flagHtml = `<img src="https://flagcdn.com/w20/${code}.png" style="height:11px;border-radius:2px;vertical-align:middle;">`;
          } else {
            flagHtml = country.logo
              ? `<img src="${country.logo}" style="height:16px;width:16px;object-fit:contain;border-radius:2px;vertical-align:middle;background:#fff;padding:1px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span style="font-size:11px;vertical-align:middle;display:none;">${country.symbol||'📍'}</span>`
              : `<span style="font-size:11px;vertical-align:middle;">${country.symbol || '📍'}</span>`;
          }

          return `<span class="fc-wrong-country-tag" title="${cnt}회 틀림">
            ${flagHtml}
            ${country.name}
          </span>`;
        }).join('');
        wrongSection = `
          <div class="fc-tile-wrong-info">
            <span class="fc-wrong-count-badge">❌ 자주 틀리는 나라</span>
            <div class="fc-wrong-country-list">${topWrongHtml}</div>
          </div>
        `;
      }

      tile.innerHTML = `
        <div class="fc-tile-header">
          <div class="fc-tile-badge ${isCompleted ? 'completed' : ''}">
            ${isCompleted ? '✅' : '📖'} 그룹 ${idx + 1}
          </div>
          <div class="fc-tile-stats">
            <span class="fc-stat-chip">🎓 ${sessionCount}회 학습</span>
            ${wrongTotal > 0 ? `<span class="fc-stat-chip wrong">❌ 오답 ${wrongTotal}</span>` : ''}
          </div>
        </div>
        <div class="fc-tile-flags">
          ${group.map(c => window.AppMode === 'world' ? `<img src="https://flagcdn.com/w40/${c.code}.png" alt="${c.name}" title="${c.name}" class="fc-tile-flag">` : (c.logo ? `<img src="${c.logo}" alt="${c.name}" title="${c.name}" style="height:40px;width:40px;object-fit:contain;border-radius:6px;background:#fff;padding:2px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span style="font-size:1.5rem;display:none;" title="${c.name}">${c.symbol || '📍'}</span>` : `<span style="font-size:1.5rem;" title="${c.name}">${c.symbol || '📍'}</span>`)).join('')}
        </div>
        <div class="fc-tile-countries">${names}</div>
        ${wrongSection}
        <div class="fc-tile-actions">
          <button class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} fc-tile-start-btn">
            ${isCompleted ? '🔄 다시 학습' : '▶ 학습 시작'}
          </button>
          ${wrongTotal > 0
            ? `<button class="btn btn-danger fc-tile-wrong-btn">📝 오답 학습 (${wrongTotal})</button>`
            : ''}
        </div>
      `;

      tile.querySelector('.fc-tile-start-btn').addEventListener('click', () => {
        st.wrongStudyMode = false;
        startGroup(idx);
      });

      const wrongBtn = tile.querySelector('.fc-tile-wrong-btn');
      if (wrongBtn) {
        wrongBtn.addEventListener('click', () => startWrongStudy(groupKey, idx, wrongList));
      }

      list.appendChild(tile);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. 학습 카드 렌더링
  // ─────────────────────────────────────────────────────────────────────────
  function startGroup(groupIdx) {
    st.groupIdx = groupIdx;
    st.cardIdx = 0;
    st.sessionWrongCodes = [];
    showSubView('fc-learn-area');
    updateAutoPlayToggle();
    renderCard();
  }

  function renderCard() {
    const group = st.groups[st.groupIdx];
    const country = group[st.cardIdx];

    // 진행 표시
    document.getElementById('fc-progress-text').textContent =
      `${st.cardIdx + 1} / ${group.length}`;
    document.getElementById('fc-group-label').textContent = st.wrongStudyMode
      ? `📝 오답 학습 · 배치 ${st.groupIdx + 1}`
      : `${st.continent} · 그룹 ${st.groupIdx + 1}`;

    const progressBar = document.getElementById('fc-learn-progress-bar');
    progressBar.style.width = `${((st.cardIdx + 1) / group.length) * 100}%`;

    // 지도 하이라이트
    const mapEl = document.getElementById('fc-mini-map');
    highlightCountryOnMiniMap(mapEl, country.code);

    // 국기 & 정보
    const flagEl = document.getElementById('fc-card-flag');
    if (window.AppMode === 'world') {
      flagEl.src = `https://flagcdn.com/w160/${country.code}.png`;
      flagEl.onerror = null;
    } else {
      const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${country.symbol || '📍'}</text></svg>`;
      flagEl.src = getRegionImgSrc(country);
      if (country.logo) {
        flagEl.style.objectFit = 'contain';
        flagEl.style.background = '#fff';
        flagEl.style.borderRadius = '12px';
        flagEl.style.padding = '8px';
        flagEl.onerror = function() {
          this.src = fallbackSvg;
          this.style.objectFit = '';
          this.style.background = '';
          this.style.borderRadius = '';
          this.style.padding = '';
        };
      } else {
        flagEl.style.objectFit = '';
        flagEl.style.background = '';
        flagEl.style.borderRadius = '';
        flagEl.style.padding = '';
        flagEl.onerror = null;
      }
    }
    flagEl.alt = `${country.name} 상징`;
    document.getElementById('fc-card-name').textContent = country.name;
    document.getElementById('fc-card-engname').textContent = country.engName || '';
    document.getElementById('fc-card-capital').textContent = country.capital;
    document.getElementById('fc-card-engcapital').textContent = country.engCapital ? `(${country.engCapital})` : '';
    document.getElementById('fc-card-location').textContent = country.location || '';

    // 상징 정보(꽃, 새, 나무) 표시
    const symbolRow = document.getElementById('fc-card-symbol-row');
    const symbolsContent = document.getElementById('fc-card-symbols-content');
    if (symbolRow && symbolsContent) {
      if (window.AppMode === 'korea' && (country.flower || country.bird || country.tree)) {
        symbolRow.classList.remove('hidden');
        let parts = [];
        if (country.flower) parts.push(`🌸 꽃: ${country.flower}`);
        if (country.bird) parts.push(`🐦 새: ${country.bird}`);
        if (country.tree) parts.push(`🌳 나무: ${country.tree}`);
        symbolsContent.textContent = parts.join('   ');
      } else {
        symbolRow.classList.add('hidden');
      }
    }

    // 이전/다음 버튼 상태
    document.getElementById('fc-btn-prev').disabled = st.cardIdx === 0;

    const nextBtn = document.getElementById('fc-btn-next');
    nextBtn.textContent = st.cardIdx === group.length - 1 ? '확인 퀴즈 시작 ✏️' : '다음 ➡️';

    // 1.5초 다음 버튼 잠금
    if (st.nextLockTimer) clearTimeout(st.nextLockTimer);
    st.isNextLocked = true;
    nextBtn.disabled = true;
    st.nextLockTimer = setTimeout(() => {
      st.isNextLocked = false;
      nextBtn.disabled = false;
      st.nextLockTimer = null;
    }, 1500);

    // TTS & 자동 넘기기 (오답 학습 모드에서는 자동 넘기기 안 함)
    TTS.speak(country);
    if (st.autoPlay && !st.wrongStudyMode) startAutoPlay();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. 자동 넘기기
  // ─────────────────────────────────────────────────────────────────────────
  function startAutoPlay() {
    clearAutoPlay();
    st.autoTimer = setInterval(() => { advanceCard(); }, st.autoDelay);
  }

  function clearAutoPlay() {
    if (st.autoTimer) { clearInterval(st.autoTimer); st.autoTimer = null; }
  }

  function updateAutoPlayToggle() {
    const btn = document.getElementById('fc-auto-toggle');
    if (!btn) return;
    if (st.autoPlay) {
      btn.textContent = '⏸ 자동넘김 ON';
      btn.classList.add('active');
    } else {
      btn.textContent = '▶ 자동넘김 OFF';
      btn.classList.remove('active');
    }
  }

  function advanceCard() {
    const group = st.groups[st.groupIdx];
    if (st.cardIdx < group.length - 1) {
      st.cardIdx++;
      renderCard();
    } else {
      clearAutoPlay();
      startQuiz();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. 확인 퀴즈 구성 및 렌더링
  // ─────────────────────────────────────────────────────────────────────────
  function startQuiz() {
    TTS.stop();
    clearAutoPlay();
    const group = st.groups[st.groupIdx];

    const types = ['flag', 'capital', 'write-name'];
    st.quizQuestions = group.map((country, i) => {
      const type = types[i % types.length];
      const sameGroupPool = group.filter(c => c.code !== country.code);
      const globalPool = getCurrentData().filter(
        c => c.code !== country.code && !sameGroupPool.find(x => x.code === c.code)
      );
      const distractors = [...sameGroupPool, ...globalPool.sort(() => 0.5 - Math.random())].slice(0, 3);
      const options = [country, ...distractors].sort(() => 0.5 - Math.random());
      return { type, country, options };
    });

    st.quizIdx = 0;
    st.quizScore = 0;
    st.quizAnswered = false;
    showSubView('fc-quiz-area');
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = st.quizQuestions[st.quizIdx];
    st.quizAnswered = false;
    st.quizAttempts = 0;

    document.getElementById('fc-quiz-progress-text').textContent =
      `${st.quizIdx + 1} / ${st.quizQuestions.length}`;
    document.getElementById('fc-quiz-progress-bar').style.width =
      `${((st.quizIdx + 1) / st.quizQuestions.length) * 100}%`;
    document.getElementById('fc-quiz-next-btn').classList.add('hidden');

    const promptEl   = document.getElementById('fc-quiz-prompt');
    const flagArea   = document.getElementById('fc-quiz-flag-area');
    const textArea   = document.getElementById('fc-quiz-text-area');
    const optionsEl  = document.getElementById('fc-quiz-options');
    const typeBadge  = document.getElementById('fc-quiz-type-badge');

    flagArea.classList.add('hidden');
    textArea.classList.add('hidden');

    if (q.type === 'flag') {
      if (window.AppMode === 'world') {
        typeBadge.textContent = '국기 보고 나라 맞히기';
        promptEl.textContent = '이 국기를 사용하는 나라는 어디일까요?';
        flagArea.innerHTML = `<img src="https://flagcdn.com/w160/${q.country.code}.png" alt="국기" class="fc-quiz-flag-img">`;
      } else {
        typeBadge.textContent = '상징 보고 지역 맞히기';
        promptEl.textContent = `[ ${q.country.capital} ] (이)가 유명한 곳은 어디일까요?`;
        const sym = q.country.symbol || '📍';
        const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' x='50' font-size='60' text-anchor='middle' dominant-baseline='middle'>${sym}</text></svg>`;
        if (q.country.logo) {
          flagArea.innerHTML = `<img src="${q.country.logo}" alt="${q.country.name} 마크" class="fc-quiz-flag-img" style="object-fit:contain;background:#fff;border-radius:12px;padding:12px;" onerror="this.src='${fallbackSvg}';this.style.objectFit='';this.style.background='';this.style.borderRadius='';this.style.padding='';">`;
        } else {
          flagArea.innerHTML = `<img src="${fallbackSvg}" alt="상징" class="fc-quiz-flag-img">`;
        }
      }
      flagArea.classList.remove('hidden');
      optionsEl.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = makeOptionBtn(`${i + 1}. ${opt.name}`, () => checkAnswer(opt.code, btn, q));
        optionsEl.appendChild(btn);
      });
    } else if (q.type === 'capital') {
      if (window.AppMode === 'world') {
        typeBadge.textContent = '수도 보고 나라 맞히기';
        promptEl.textContent = `수도가 [ ${q.country.capital} ] 인 나라는 어디일까요?`;
        textArea.innerHTML = `<span class="fc-quiz-big-text">${q.country.capital}</span>`;
      } else {
        typeBadge.textContent = '소속 보고 지역 맞히기';
        promptEl.textContent = `[ ${q.country.continent} ] 에 속해 있는 곳은 어디일까요?`;
        textArea.innerHTML = `<span class="fc-quiz-big-text">${q.country.continent}</span>`;
      }
      textArea.classList.remove('hidden');
      optionsEl.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = makeOptionBtn(`${i + 1}. ${opt.name}`, () => checkAnswer(opt.code, btn, q));
        optionsEl.appendChild(btn);
      });
    } else {
      // write-name: 나라 보고 수도 맞히기
      if (window.AppMode === 'world') {
        typeBadge.textContent = '나라 보고 수도 맞히기';
        promptEl.textContent = `[ ${q.country.name} ] 의 수도는 어디일까요?`;
        flagArea.innerHTML = `<img src="https://flagcdn.com/w80/${q.country.code}.png" alt="국기" class="fc-quiz-flag-img" style="height:60px;">`;
      } else {
        typeBadge.textContent = '지역 보고 특성 맞히기';
        promptEl.textContent = `[ ${q.country.name} ] (이)가 유명한 것은 무엇일까요?`;
        const sym = q.country.symbol || '📍';
        if (q.country.logo) {
          flagArea.innerHTML = `<img src="${q.country.logo}" alt="${q.country.name} 마크" class="fc-quiz-flag-img" style="height:80px;object-fit:contain;background:#fff;border-radius:12px;padding:8px;" onerror="this.outerHTML='<span style=\\'font-size:3rem;\\'>${sym}</span>'">`;
        } else {
          flagArea.innerHTML = `<span style="font-size:3rem;">${sym}</span>`;
        }
      }
      flagArea.classList.remove('hidden');
      optionsEl.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = makeOptionBtn(`${i + 1}. ${opt.capital}`, () => checkAnswerCapital(opt.code, btn, q));
        optionsEl.appendChild(btn);
      });
    }
  }

  function makeOptionBtn(label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span>${label}</span><span></span>`;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function goToNextQuestion() {
    st.quizIdx++;
    if (st.quizIdx < st.quizQuestions.length) {
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  }

  // ── 정답/오답 체크 ────────────────────────────────────────────────────────
  function checkAnswer(selectedCode, clickedBtn, q) {
    if (st.quizAnswered) return;
    if (clickedBtn.classList.contains('wrong') || clickedBtn.classList.contains('correct')) return;

    const correct = selectedCode === q.country.code;
    if (correct) {
      st.quizAnswered = true;
      applyAnswerFeedback(clickedBtn, true, q.country.name, 'name');
      st.quizScore++;
      if (window.AppAudioSynth) window.AppAudioSynth.playCorrect();
      // 오답 학습 모드: 첫 번째 시도 정답 시 스트릭 증가
      if (st.wrongStudyMode && st.quizAttempts === 0) {
        st.wrongStudyStreaks[q.country.code] = (st.wrongStudyStreaks[q.country.code] || 0) + 1;
      }
      setTimeout(() => { goToNextQuestion(); }, 200);
    } else {
      if (st.quizAttempts === 0) {
        // 첫 번째 오답: 한 번 더 기회 제공
        st.quizAttempts = 1;
        clickedBtn.classList.add('wrong');
        clickedBtn.querySelector('span:last-child').textContent = '❌';
        if (window.AppAudioSynth) window.AppAudioSynth.playWrong();
        if (st.wrongStudyMode) st.wrongStudyStreaks[q.country.code] = 0;
      } else {
        // 두 번째 오답: 정답 공개 후 다음 버튼 노출
        st.quizAnswered = true;
        applyAnswerFeedback(clickedBtn, false, q.country.name, 'name');
        if (window.AppAudioSynth) window.AppAudioSynth.playWrong();
        document.getElementById('fc-quiz-next-btn').classList.remove('hidden');
        if (!st.wrongStudyMode) {
          recordWrongInSession(q.country.code);
        } else {
          st.wrongStudyStreaks[q.country.code] = 0;
        }
      }
    }
  }

  function checkAnswerCapital(selectedCode, clickedBtn, q) {
    if (st.quizAnswered) return;
    if (clickedBtn.classList.contains('wrong') || clickedBtn.classList.contains('correct')) return;

    const correct = selectedCode === q.country.code;
    if (correct) {
      st.quizAnswered = true;
      applyAnswerFeedback(clickedBtn, true, q.country.capital, 'capital');
      st.quizScore++;
      if (window.AppAudioSynth) window.AppAudioSynth.playCorrect();
      if (st.wrongStudyMode && st.quizAttempts === 0) {
        st.wrongStudyStreaks[q.country.code] = (st.wrongStudyStreaks[q.country.code] || 0) + 1;
      }
      setTimeout(() => { goToNextQuestion(); }, 200);
    } else {
      if (st.quizAttempts === 0) {
        st.quizAttempts = 1;
        clickedBtn.classList.add('wrong');
        clickedBtn.querySelector('span:last-child').textContent = '❌';
        if (window.AppAudioSynth) window.AppAudioSynth.playWrong();
        if (st.wrongStudyMode) st.wrongStudyStreaks[q.country.code] = 0;
      } else {
        st.quizAnswered = true;
        applyAnswerFeedback(clickedBtn, false, q.country.capital, 'capital');
        if (window.AppAudioSynth) window.AppAudioSynth.playWrong();
        document.getElementById('fc-quiz-next-btn').classList.remove('hidden');
        if (!st.wrongStudyMode) {
          recordWrongInSession(q.country.code);
        } else {
          st.wrongStudyStreaks[q.country.code] = 0;
        }
      }
    }
  }

  function applyAnswerFeedback(clickedBtn, correct, correctLabel, mode) {
    const optionBtns = document.querySelectorAll('#fc-quiz-options .quiz-option-btn');
    if (correct) {
      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('span:last-child').textContent = '⭕';
    } else {
      clickedBtn.classList.add('wrong');
      clickedBtn.querySelector('span:last-child').textContent = '❌';
      optionBtns.forEach(btn => {
        if (btn.querySelector('span:first-child').textContent.includes(correctLabel)) {
          btn.classList.add('correct');
        }
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. 오답 세션 기록 & 통계 저장
  // ─────────────────────────────────────────────────────────────────────────
  function recordWrongInSession(code) {
    if (!st.sessionWrongCodes.includes(code)) {
      st.sessionWrongCodes.push(code);
    }
  }

  async function saveSessionStats() {
    if (!window.AppAuth.getCurrentUser()) return;
    const groupKey = `${st.continent}_group_${st.groupIdx}`;
    try {
      const userData = await window.AppAuth.getUserData();
      const allStats = (userData && userData.flashcardStats) || {};
      if (!allStats[groupKey]) {
        allStats[groupKey] = { sessionCount: 0, wrongCounts: {}, wrongList: {} };
      }
      const g = allStats[groupKey];
      g.sessionCount = (g.sessionCount || 0) + 1;

      // 이번 세션에서 틀린 나라 기록
      st.sessionWrongCodes.forEach(code => {
        g.wrongCounts[code] = (g.wrongCounts[code] || 0) + 1;
        if (!g.wrongList[code]) {
          g.wrongList[code] = { streak: 0 };
        } else {
          g.wrongList[code].streak = 0; // 다시 틀렸으므로 스트릭 리셋
        }
      });
      await window.AppAuth.updateUserData({ flashcardStats: allStats });
    } catch (e) {
      console.error('세션 통계 저장 실패:', e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. 오답 학습 완료 처리 (스트릭 3 이상 → 오답 목록 삭제)
  // ─────────────────────────────────────────────────────────────────────────
  async function processWrongStudyResult() {
    const masteredCodes = [];
    const remainingCodes = [];
    if (!window.AppAuth.getCurrentUser()) return { masteredCodes, remainingCodes };

    const groupKey = st.wrongStudyGroupKey;
    try {
      const userData = await window.AppAuth.getUserData();
      const allStats = (userData && userData.flashcardStats) || {};
      if (!allStats[groupKey]) return { masteredCodes, remainingCodes };

      const g = allStats[groupKey];
      const batchCodes = st.groups[st.groupIdx].map(c => c.code);

      batchCodes.forEach(code => {
        const streak = st.wrongStudyStreaks[code] || 0;
        if (!g.wrongList[code]) return;
        if (streak >= 3) {
          // 마스터! 오답 목록에서 제거
          delete g.wrongList[code];
          masteredCodes.push(code);
        } else {
          g.wrongList[code].streak = streak;
          remainingCodes.push(code);
        }
      });

      await window.AppAuth.updateUserData({ flashcardStats: allStats });
    } catch (e) {
      console.error('오답 학습 결과 처리 실패:', e);
    }
    return { masteredCodes, remainingCodes };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. 배지 획득 알림
  // ─────────────────────────────────────────────────────────────────────────
  function showFlashcardEarnedBadge(emoji, text) {
    const area = document.getElementById('fc-result-badge-earned-area');
    if (!area) return;
    area.classList.remove('hidden');
    const iconEl = document.getElementById('fc-result-badge-icon');
    const nameEl = document.getElementById('fc-result-badge-name');
    if (iconEl) iconEl.textContent = emoji;
    if (nameEl) nameEl.textContent = text;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9. 퀴즈 결과 화면
  // ─────────────────────────────────────────────────────────────────────────
  function showQuizResult() {
    showSubView('fc-result-area');
    const total = st.quizQuestions.length;
    const score = st.quizScore;
    const pct = Math.round((score / total) * 100);

    const badgeEarnedArea = document.getElementById('fc-result-badge-earned-area');
    if (badgeEarnedArea) badgeEarnedArea.classList.add('hidden');

    let emoji = '😢', msg = '다시 한 번 학습하고 도전해 보세요!';
    if (pct >= 100) { emoji = '🏆'; msg = '완벽합니다! 이 그룹은 완전히 마스터했어요!'; }
    else if (pct >= 80) { emoji = '🌟'; msg = '정말 잘 했어요! 거의 다 맞혔네요!'; }
    else if (pct >= 60) { emoji = '😊'; msg = '좋아요! 조금만 더 연습하면 완벽해질 거예요!'; }
    else if (pct >= 40) { emoji = '📖'; msg = '카드를 한 번 더 보고 다시 도전해 보세요!'; }

    document.getElementById('fc-result-emoji').textContent = emoji;
    document.getElementById('fc-result-msg').textContent = msg;
    document.getElementById('fc-result-score').textContent = `${score} / ${total}`;
    document.getElementById('fc-result-pct').textContent = `${pct}점`;

    const starsEl = document.getElementById('fc-result-stars');
    const stars = pct >= 100 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
    starsEl.innerHTML = Array.from({ length: 3 }, (_, i) =>
      `<span style="font-size:2.5rem; opacity:${i < stars ? 1 : 0.2};">⭐</span>`
    ).join('');

    const nextGroupBtn  = document.getElementById('fc-btn-next-group');
    const retryGroupBtn = document.getElementById('fc-btn-retry-group');
    const backHomeBtn   = document.getElementById('fc-btn-back-home');

    if (st.wrongStudyMode) {
      // ── 오답 학습 결과 화면 버튼 ─────────────────────────────────────
      const hasNextBatch = st.groupIdx + 1 < st.groups.length;
      nextGroupBtn.style.display = hasNextBatch ? '' : 'none';
      nextGroupBtn.textContent = `다음 배치 ➡️`;
      retryGroupBtn.textContent = '🔄 이 배치 다시';
      backHomeBtn.textContent = '📝 오답 목록으로';

      // 마스터 처리 (비동기)
      processWrongStudyResult().then(({ masteredCodes, remainingCodes }) => {
        if (masteredCodes.length > 0) {
          const names = masteredCodes.map(code => {
            const c = getCurrentData().find(x => x.code === code);
            return c ? c.name : code;
          });
          const msgEl = document.getElementById('fc-result-msg');
          msgEl.innerHTML = `🎉 <strong>${names.join(', ')}</strong> 마스터!<br>
            <span style="font-size:0.85rem;color:var(--text-muted);">오답 목록에서 삭제됨 · 남은 오답: ${remainingCodes.length}개</span>`;
        }
      });
    } else {
      // ── 일반 학습 결과 화면 버튼 ─────────────────────────────────────
      const hasNextGroup = st.groupIdx + 1 < st.groups.length;
      nextGroupBtn.style.display = hasNextGroup ? '' : 'none';
      nextGroupBtn.textContent = `다음 그룹 학습 (그룹 ${st.groupIdx + 2}) ➡️`;
      retryGroupBtn.textContent = '🔄 다시 학습';
      backHomeBtn.textContent = '🏠 대륙 선택';

      // 세션 통계 저장 (오답 기록)
      saveSessionStats();

      if (pct >= 60) {
        if (window.AppAudioSynth) window.AppAudioSynth.playFanfare();

        window.AppAuth.getUserData().then(userData => {
          const completedGroups = (userData && userData.completedFlashcards) || [];
          const groupKey = `${st.continent}_group_${st.groupIdx}`;
          const isFirstTime = !completedGroups.includes(groupKey);
          if (isFirstTime) completedGroups.push(groupKey);

          const currentPoints = (userData && userData.points) || 0;
          const scorePoints = score * 10;
          const updatedPoints = currentPoints + (isFirstTime ? scorePoints : 0);

          const newBadges = [...((userData && userData.badges) || [])];
          const continentGroupsCount = st.groups.length;
          const completedContinentGroups = completedGroups.filter(k => k.startsWith(`${st.continent}_group_`));

          if (completedContinentGroups.length === continentGroupsCount) {
            if (st.continent === '아시아' && !newBadges.includes('asia')) {
              newBadges.push('asia');
              showFlashcardEarnedBadge('🐉', '아시아 마스터 배지 획득!');
            } else if (st.continent === '유럽' && !newBadges.includes('europe')) {
              newBadges.push('europe');
              showFlashcardEarnedBadge('🏰', '유럽 마스터 배지 획득!');
            } else {
              const koreaRegions = ['서울특별시', '경기도', '강원특별자치도', '충청권', '전라권', '경상권', '제주도'];
              if (koreaRegions.includes(st.continent) && !newBadges.includes('korea')) {
                newBadges.push('korea');
                showFlashcardEarnedBadge('🇰🇷', '국토 사랑 배지 획득!');
              }
            }
          }
          if (updatedPoints >= 1000 && !newBadges.includes('world')) {
            newBadges.push('world');
            showFlashcardEarnedBadge('👑', '세계 정복자 배지 획득!');
          }

          const pctEl = document.getElementById('fc-result-pct');
          if (pctEl) {
            pctEl.innerHTML = `${pct}점<br><span style="font-size:0.75rem;font-weight:500;color:var(--secondary);">${isFirstTime ? `+${scorePoints} P 획득` : '완료됨 (추가 포인트 없음)'}</span>`;
          }

          window.AppAuth.updateUserData({
            completedFlashcards: completedGroups,
            points: updatedPoints,
            badges: newBadges
          });
        }).catch(err => {
          console.error('퀴즈 결과 저장 실패:', err);
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 10. 오답 학습 모드
  // ─────────────────────────────────────────────────────────────────────────
  function startWrongStudy(groupKey, groupIdx, wrongList) {
    const wrongCodes = Object.keys(wrongList);
    if (wrongCodes.length === 0) {
      alert('🎉 오답 목록이 비어있습니다! 모두 마스터했어요!');
      return;
    }

    // 오답 나라 객체 목록
    const wrongCountries = wrongCodes
      .map(code => getCurrentData().find(c => c.code === code))
      .filter(Boolean);

    st.wrongStudyGroupKey = groupKey;
    st.wrongStudyGroupIdx = groupIdx;
    st.wrongStudyBatches = makeGroups(wrongCountries);

    renderWrongStudyArea(wrongCountries, groupKey, groupIdx, wrongList);
  }

  function renderWrongStudyArea(wrongCountries, groupKey, groupIdx, wrongList) {
    showSubView('fc-wrong-area');
    const area = document.getElementById('fc-wrong-area');
    const batches = makeGroups(wrongCountries);

    area.innerHTML = `
      <div class="fc-header">
        <button class="btn btn-outline fc-back-btn" id="fc-wrong-back-btn">← 그룹 목록으로</button>
        <div>
          <h2 class="text-gradient">📝 오답 학습 — ${st.continent} 그룹 ${groupIdx + 1}</h2>
          <p style="color:var(--text-muted);font-size:0.88rem;margin-top:0.3rem;">
            3번 연속 정답 시 오답 목록에서 자동 삭제됩니다.
          </p>
        </div>
      </div>

      <div class="fc-wrong-stats-row">
        <div class="fc-wrong-stat-card danger">
          <div class="fc-wrong-stat-num">${wrongCountries.length}</div>
          <div class="fc-wrong-stat-label">총 오답 수</div>
        </div>
        <div class="fc-wrong-stat-card">
          <div class="fc-wrong-stat-num">${batches.length}</div>
          <div class="fc-wrong-stat-label">학습 배치</div>
        </div>
        <div class="fc-wrong-stat-card accent">
          <div class="fc-wrong-stat-num">3</div>
          <div class="fc-wrong-stat-label">연속 정답 → 제거</div>
        </div>
      </div>

      <div class="fc-wrong-country-overview">
        ${wrongCountries.map(c => {
          const streakVal = (wrongList[c.code] && wrongList[c.code].streak) || 0;
          return `
            <div class="fc-wrong-country-card">
              ${window.AppMode === 'world' ? `<img src="https://flagcdn.com/w40/${c.code}.png" class="fc-wrong-flag" alt="${c.name}">` : (c.logo ? `<img src="${c.logo}" class="fc-wrong-flag" alt="${c.name}" style="height:32px;width:32px;object-fit:contain;border-radius:4px;background:#fff;padding:2px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span style="font-size:1.5rem;display:none;">${c.symbol || '📍'}</span>` : `<span style="font-size:1.5rem;">${c.symbol || '📍'}</span>`)}
              <span class="fc-wrong-name">${c.name}</span>
              <div class="fc-wrong-streak-bar" title="연속 정답: ${streakVal}/3">
                ${[0,1,2].map(i => `<div class="fc-streak-dot ${i < streakVal ? 'filled' : ''}"></div>`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="fc-wrong-section-title">배치 선택</div>
      <div class="fc-wrong-batch-grid">
        ${batches.map((batch, i) => `
          <div class="fc-wrong-batch-tile glass-panel">
            <div class="fc-batch-num">📦 배치 ${i + 1} (${batch.length}개국)</div>
            <div class="fc-batch-flags">
              ${batch.map(c => window.AppMode === 'world' ? `<img src="https://flagcdn.com/w40/${c.code}.png" alt="${c.name}" title="${c.name}" class="fc-tile-flag">` : (c.logo ? `<img src="${c.logo}" alt="${c.name}" title="${c.name}" style="height:36px;width:36px;object-fit:contain;border-radius:6px;background:#fff;padding:2px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span style="font-size:1.5rem;display:none;" title="${c.name}">${c.symbol || '📍'}</span>` : `<span style="font-size:1.5rem;" title="${c.name}">${c.symbol || '📍'}</span>`)).join('')}
            </div>
            <div class="fc-batch-countries">${batch.map(c => c.name).join(', ')}</div>
            <button class="btn btn-danger" style="width:100%;margin-top:0.6rem;" data-batch-start="${i}">
              📝 배치 ${i + 1} 학습 시작
            </button>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('fc-wrong-back-btn').addEventListener('click', renderGroupSelect);

    area.querySelectorAll('[data-batch-start]').forEach(btn => {
      const batchIdx = parseInt(btn.getAttribute('data-batch-start'), 10);
      btn.addEventListener('click', () => startWrongBatch(batchIdx));
    });
  }

  function startWrongBatch(batchIdx) {
    st.wrongStudyMode = true;
    st.wrongStudyStreaks = {};
    st.sessionWrongCodes = [];

    // 오답 배치들을 groups으로 설정
    st.groups = st.wrongStudyBatches;
    st.groupIdx = batchIdx;
    st.cardIdx = 0;

    // 오답 학습 모드에서는 자동 넘기기 비활성화
    st.autoPlay = false;
    updateAutoPlayToggle();

    showSubView('fc-learn-area');
    renderCard();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 11. 외부 API 노출
  // ─────────────────────────────────────────────────────────────────────────
  window.AppFlashcard = {
    init() {
      // 난이도(기본/심화) 탭 선택 이벤트 리스너 바인딩
      const levelTabs = document.querySelectorAll('.fc-level-tab');
      levelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          levelTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          st.level = tab.getAttribute('data-fc-level');
          renderContinentSelect(); // 대륙 선택 화면 다시 렌더링
        });
      });

      // 뒤로 가기 버튼들
      document.getElementById('fc-back-to-continents-from-groups')
        ?.addEventListener('click', renderContinentSelect);

      document.getElementById('fc-back-to-groups-from-learn')
        ?.addEventListener('click', () => {
          clearAutoPlay();
          TTS.stop();
          renderGroupSelect();
        });

      document.getElementById('fc-back-to-groups-from-quiz')
        ?.addEventListener('click', () => {
          renderGroupSelect();
        });

      // 카드 이전/다음
      document.getElementById('fc-btn-prev')?.addEventListener('click', () => {
        if (st.cardIdx > 0) { clearAutoPlay(); st.cardIdx--; renderCard(); }
      });
      document.getElementById('fc-btn-next')?.addEventListener('click', () => {
        if (st.isNextLocked) return;
        clearAutoPlay();
        advanceCard();
      });

      // 자동넘김 토글
      document.getElementById('fc-auto-toggle')?.addEventListener('click', () => {
        st.autoPlay = !st.autoPlay;
        updateAutoPlayToggle();
        if (st.autoPlay) startAutoPlay();
        else clearAutoPlay();
      });

      // 속도 조절
      document.getElementById('fc-speed-select')?.addEventListener('change', (e) => {
        st.autoDelay = parseInt(e.target.value, 10);
        if (st.autoPlay) startAutoPlay();
      });

      // 퀴즈 다음 버튼
      document.getElementById('fc-quiz-next-btn')?.addEventListener('click', () => {
        goToNextQuestion();
      });

      // 결과 화면 버튼들
      document.getElementById('fc-btn-retry-group')?.addEventListener('click', () => {
        if (st.wrongStudyMode) {
          // 오답 모드: 같은 배치 다시
          st.wrongStudyStreaks = {};
          startWrongBatch(st.groupIdx);
        } else {
          startGroup(st.groupIdx);
        }
      });

      document.getElementById('fc-btn-retry-quiz')?.addEventListener('click', () => {
        startQuiz();
      });

      document.getElementById('fc-btn-next-group')?.addEventListener('click', () => {
        if (st.wrongStudyMode) {
          const nextIdx = st.groupIdx + 1;
          if (nextIdx < st.groups.length) {
            st.wrongStudyStreaks = {};
            startWrongBatch(nextIdx);
          }
        } else {
          startGroup(st.groupIdx + 1);
        }
      });

      document.getElementById('fc-btn-back-home')?.addEventListener('click', () => {
        TTS.stop();
        clearAutoPlay();
        if (st.wrongStudyMode) {
          renderGroupSelect();
        } else {
          renderContinentSelect();
        }
      });
    },

    // app.js에서 뷰 진입 시 호출
    enter() {
      TTS.stop();
      clearAutoPlay();
      st.level = 'basic'; // 난이도 상태를 기본으로 리셋
      renderContinentSelect();
    }
  };

})();
