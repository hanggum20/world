// 세계 지도 상호작용 및 탐색 로직
(function() {
  let activeCountryCode = null;
  let originalViewBox = "30.767 241.591 784.077 458.627";
  let viewBoxAnimationId = null;
  let currentContinent = 'all';

  let currentLoadedProvince = null;
  const KOREA_MARKER_MAP = {
    'kr-gw-chuncheon': 'kr-region-108',
    'kr-gw-gangneung': 'kr-region-110',
    'kr-gw-sokcho': 'kr-region-113',
    'kr-cb-cheongju': 'kr-region-126',
    'kr-dj-yuseong': 'kr-region-69',
    'kr-cn-buyeo': 'kr-region-173',
    'kr-jb-jeonju': 'kr-region-180',
    'kr-jn-boseong': 'kr-region-205',
    'kr-jn-yeosu': 'kr-region-197',
    'kr-gb-andong': 'kr-region-223',
    'kr-gb-gyeongju': 'kr-region-221',
    'kr-gn-jinju': 'kr-region-246',
    'kr-bs-haeundae': 'kr-region-34',
    'kr-jj-jeju': 'kr-region-229',
    'kr-jj-seogwipo': 'kr-region-230'
  };
  const KOREA_PROVINCE_NAMES = {};
  if (window.KOREA_PROVINCE_IDS) {
    for (const [name, key] of Object.entries(window.KOREA_PROVINCE_IDS)) {
      KOREA_PROVINCE_NAMES[key] = name;
    }
  }

  function getProvinceKey(codeOrName) {
    if (!codeOrName) return null;
    if (window.KOREA_PROVINCE_MAPS && window.KOREA_PROVINCE_MAPS[codeOrName]) return codeOrName;
    if (window.KOREA_PROVINCE_IDS && window.KOREA_PROVINCE_IDS[codeOrName]) return window.KOREA_PROVINCE_IDS[codeOrName];
    if (window.KOREA_DATA) {
      const item = window.KOREA_DATA.find(d => d.code === codeOrName);
      if (item && window.KOREA_PROVINCE_IDS && window.KOREA_PROVINCE_IDS[item.continent]) {
        return window.KOREA_PROVINCE_IDS[item.continent];
      }
    }
    return null;
  }

  function isProvinceInRegion(provKey, region) {
    if (region === 'all') return true;
    if (region === '충청권') {
      return (provKey === 'north-chungcheong' || provKey === 'south-chungcheong' || provKey === 'sejong');
    }
    if (region === '전라권') {
      return (provKey === 'north-jeolla' || provKey === 'south-jeolla' || provKey === 'gwangju');
    }
    if (region === '경상권') {
      return (provKey === 'north-gyeongsang' || provKey === 'south-gyeongsang' || provKey === 'daegu' || provKey === 'busan' || provKey === 'ulsan');
    }
    if (region === '제주도') {
      return (provKey === 'jeju');
    }
    const name = KOREA_PROVINCE_NAMES[provKey];
    return provKey === region || name === region;
  }

  function renderProvinceMap(provKey) {
    const container = document.getElementById('map-container');
    if (!container) return;

    const provMap = window.KOREA_PROVINCE_MAPS[provKey];
    if (!provMap) return;

    currentLoadedProvince = provKey;

    const viewBox = provMap.viewBox || "0 0 600 400";
    
    // Build the SVG string
    let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" id="province-map-svg" style="display:block;margin:0 auto;">
      <defs>
        <style>
          .kr-land {
            fill: var(--map-country, #2a3550);
            stroke: var(--map-stroke, #4a6090);
            stroke-width: 0.8;
            transition: fill 0.2s, stroke 0.2s, filter 0.2s;
            cursor: pointer;
          }
          .kr-land:hover {
            fill: #4a90d9;
            stroke: #7ab8f5;
            filter: drop-shadow(0 0 5px rgba(74, 144, 217, 0.6));
          }
          .kr-land.active {
            fill: #10b981;
            stroke: #6ee7b7;
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.65));
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

    // Add paths
    provMap.paths.forEach(p => {
      svgHtml += `<path class="kr-land sigungu-path" id="${p.code}" data-code="${p.code}" d="${p.d}" aria-label="${p.name}" />`;
    });

    svgHtml += `</g><g id="province-labels" pointer-events="none">`;

    // Add labels
    provMap.paths.forEach(p => {
      if (p.cx !== undefined && p.cy !== undefined) {
        svgHtml += `<text class="kr-label" id="label-${p.code}" x="${p.cx}" y="${p.cy + 3}" data-code="${p.code}">${p.name}</text>`;
      }
    });

    svgHtml += `</g></svg>`;

    container.innerHTML = svgHtml;

    // Bind event listeners to new paths
    const svgEl = container.querySelector('svg');
    const paths = svgEl.querySelectorAll('path.sigungu-path');
    paths.forEach(path => {
      const code = path.getAttribute('data-code');
      path.addEventListener('click', (e) => {
        e.stopPropagation();
        selectCountry(code);
      });
    });

    // Background click to clear selection
    svgEl.addEventListener('click', (e) => {
      if (e.target.tagName === 'svg' || e.target.classList.contains('kr-sea')) {
        clearSelection();
      }
    });
  }

  function loadNationalMap() {
    const container = document.getElementById('map-container');
    if (!container) return;

    currentLoadedProvince = null;

    container.innerHTML = window.KOREA_MAP_SVG || '';

    const svgEl = container.querySelector('svg');
    if (svgEl) {
      originalViewBox = svgEl.getAttribute('viewBox') || "0 0 524 631";
    }

    // Re-bind national map listeners
    const paths = container.querySelectorAll('path');
    paths.forEach(path => {
      const parentG = path.closest('g');
      const countryCode = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
      if (countryCode && !countryCode.startsWith('_') && countryCode !== 'kr-mainland') {
        path.setAttribute('data-code', countryCode);
        path.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCountry(countryCode);
        });
      }
    });

    const circles = container.querySelectorAll('circle[id]');
    circles.forEach(circle => {
      const code = circle.id;
      if (code && code.startsWith('kr-')) {
        circle.setAttribute('data-code', code);
        circle.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCountry(code);
        });
      }
    });

    if (svgEl) {
      svgEl.addEventListener('click', () => {
        clearSelection();
      });
    }
  }

  function getCurrentData() {
    return window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
  }

  function getProvincePathId(continent) {
    const mapping = {
      '서울특별시': 'seoul',
      '부산광역시': 'busan',
      '인천광역시': 'incheon',
      '대구광역시': 'daegu',
      '광주광역시': 'gwangju',
      '대전광역시': 'daejeon',
      '울산광역시': 'ulsan',
      '세종특별자치시': 'sejong',
      '경기도': 'gyeonggi',
      '강원특별자치도': 'gangwon',
      '충청북도': 'north-chungcheong',
      '충청남도': 'south-chungcheong',
      '전북특별자치도': 'north-jeolla',
      '전라남도': 'south-jeolla',
      '경상북도': 'north-gyeongsang',
      '경상남도': 'south-gyeongsang',
      '제주특별자치도': 'jeju'
    };
    return mapping[continent] || null;
  }

  function getRelativeCoords(location, name) {
    let rx = 0.5;
    let ry = 0.5;
    
    if (location) {
      if (location.includes('최북단') || location.includes('최북부')) { rx = 0.5; ry = 0.12; }
      else if (location.includes('최남단') || location.includes('최남부')) { rx = 0.5; ry = 0.88; }
      else if (location.includes('최서단') || location.includes('최서부')) { rx = 0.12; ry = 0.5; }
      else if (location.includes('최동단') || location.includes('최동부')) { rx = 0.88; ry = 0.5; }
      else if (location.includes('북동부') || location.includes('북동')) { rx = 0.72; ry = 0.28; }
      else if (location.includes('북서부') || location.includes('북서')) { rx = 0.28; ry = 0.28; }
      else if (location.includes('남동부') || location.includes('남동')) { rx = 0.72; ry = 0.72; }
      else if (location.includes('남서부') || location.includes('남서')) { rx = 0.28; ry = 0.72; }
      else if (location.includes('북부')) { rx = 0.5; ry = 0.3; }
      else if (location.includes('남부')) { rx = 0.5; ry = 0.7; }
      else if (location.includes('동부')) { rx = 0.7; ry = 0.5; }
      else if (location.includes('서부')) { rx = 0.3; ry = 0.5; }
      else if (location.includes('중심부') || location.includes('중부') || location.includes('원도심')) { rx = 0.5; ry = 0.5; }
    }

    // 결정론적 노이즈 (명칭 해시 사용)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const randX = ((Math.abs(hash) % 100) / 100) * 0.36 - 0.18; // -18% ~ +18%
    const randY = ((Math.abs(hash >> 8) % 100) / 100) * 0.36 - 0.18;

    rx = Math.max(0.1, Math.min(0.9, rx + randX));
    ry = Math.max(0.1, Math.min(0.9, ry + randY));

    return { rx, ry };
  }

  function updateSigunguMarkersVisibility(activeProvinceId, activeContinent) {
    const container = document.getElementById('map-container');
    if (!container) return;
    const svgEl = container.querySelector('svg');
    if (!svgEl || window.AppMode !== 'korea') return;

    svgEl.querySelectorAll('.sigungu-marker, .sigungu-label').forEach(el => {
      const prov = el.getAttribute('data-province');
      const cont = el.getAttribute('data-continent');
      
      let show = false;
      
      if (activeProvinceId) {
        show = (prov === activeProvinceId);
      } else if (activeContinent && activeContinent !== 'all') {
        if (activeContinent === '충청권') {
          show = (cont === '충청북도' || cont === '충청남도' || cont === '세종특별자치시');
        } else if (activeContinent === '전라권') {
          show = (cont === '전북특별자치도' || cont === '전라남도' || cont === '광주광역시');
        } else if (activeContinent === '경상권') {
          show = (cont === '경상북도' || cont === '경상남도' || cont === '대구광역시' || cont === '부산광역시' || cont === '울산광역시');
        } else if (activeContinent === '제주도') {
          show = (cont === '제주특별자치도');
        } else {
          show = (cont === activeContinent);
        }
      }
      
      if (show) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
        el.classList.remove('active');
      }
    });
  }

  // 뷰박스 문자열 파싱 헬퍼 (쉼표와 공백 모두 처리)
  function parseViewBoxStr(str) {
    if (!str) return { x: 30.767, y: 241.591, width: 784.077, height: 458.627 };
    const parts = str.trim().split(/[,\s]+/).map(Number);
    return {
      x: isNaN(parts[0]) ? 30.767 : parts[0],
      y: isNaN(parts[1]) ? 241.591 : parts[1],
      width: isNaN(parts[2]) ? 784.077 : parts[2],
      height: isNaN(parts[3]) ? 458.627 : parts[3]
    };
  }

  // 여러 엘리먼트의 통합 bounding box 계산
  function getElementsBBox(elements) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(el => {
      try {
        const bbox = el.getBBox();
        if (bbox.width === 0 && bbox.height === 0) return;
        
        if (bbox.x < minX) minX = bbox.x;
        if (bbox.y < minY) minY = bbox.y;
        if (bbox.x + bbox.width > maxX) maxX = bbox.x + bbox.width;
        if (bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
      } catch (e) {
        // getBBox 에러 대비 안전장치
      }
    });

    if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
      return null;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  // 뷰박스 애니메이션 처리
  function animateViewBox(svgEl, targetViewBox, duration = 600) {
    if (viewBoxAnimationId) {
      cancelAnimationFrame(viewBoxAnimationId);
    }

    const currentAttr = svgEl.getAttribute('viewBox') || originalViewBox;
    const start = currentAttr.trim().split(/[,\s]+/).map(Number);
    
    // 최소 크기 제한 (너무 작게 줌인되어 깨지는 현상 방지)
    const minWidth = 80;
    const minHeight = 60;
    
    let targetWidth = targetViewBox.width;
    let targetHeight = targetViewBox.height;
    let targetX = targetViewBox.x;
    let targetY = targetViewBox.y;

    if (isNaN(targetX) || isNaN(targetY) || isNaN(targetWidth) || isNaN(targetHeight)) {
      const fallback = parseViewBoxStr(originalViewBox);
      svgEl.setAttribute('viewBox', `${fallback.x} ${fallback.y} ${fallback.width} ${fallback.height}`);
      return;
    }

    if (targetWidth < minWidth) {
      const diff = minWidth - targetWidth;
      targetX -= diff / 2;
      targetWidth = minWidth;
    }
    if (targetHeight < minHeight) {
      const diff = minHeight - targetHeight;
      targetY -= diff / 2;
      targetHeight = minHeight;
    }

    const end = [targetX, targetY, targetWidth, targetHeight];

    if (start.length !== 4 || start.some(isNaN) || end.some(isNaN)) {
      svgEl.setAttribute('viewBox', `${targetX} ${targetY} ${targetWidth} ${targetHeight}`);
      return;
    }

    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      const current = start.map((s, i) => s + (end[i] - s) * eased);
      svgEl.setAttribute('viewBox', current.map(v => v.toFixed(3)).join(' '));

      if (progress < 1) {
        viewBoxAnimationId = requestAnimationFrame(step);
      } else {
        viewBoxAnimationId = null;
      }
    }

    viewBoxAnimationId = requestAnimationFrame(step);
  }

  function zoomToBbox(svgEl, bbox, paddingFactor = 0.25) {
    const containerEl = document.getElementById('map-container');
    const containerW = containerEl ? containerEl.clientWidth : 600;
    const containerH = containerEl ? containerEl.clientHeight : 400;
    const aspectRatio = containerW > 0 && containerH > 0 ? containerW / containerH : 1.5;

    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    let targetW, targetH;
    const bboxRatio = bbox.width / (bbox.height || 1);

    if (bboxRatio > aspectRatio) {
      targetW = bbox.width * (1 + paddingFactor * 2);
      targetH = targetW / aspectRatio;
    } else {
      targetH = bbox.height * (1 + paddingFactor * 2);
      targetW = targetH * aspectRatio;
    }

    animateViewBox(svgEl, {
      x: cx - targetW / 2,
      y: cy - targetH / 2,
      width: targetW,
      height: targetH
    });
  }

  // 1. 지도 초기화 및 SVG 주입
  function initMap() {
    const container = document.getElementById('map-container');
    if (!container) return;

    // 모드별 필터 칩 동적 생성
    const filterContainer = document.getElementById('continent-filters');
    if (filterContainer) {
      if (window.AppMode === 'world') {
        filterContainer.innerHTML = `
          <button class="filter-chip active" data-continent="all">전체</button>
          <button class="filter-chip" data-continent="아시아">아시아</button>
          <button class="filter-chip" data-continent="유럽">유럽</button>
          <button class="filter-chip" data-continent="북아메리카">북아메리카</button>
          <button class="filter-chip" data-continent="남아메리카">남아메리카</button>
          <button class="filter-chip" data-continent="아프리카">아프리카</button>
          <button class="filter-chip" data-continent="오세아니아">오세아니아</button>
        `;
      } else {
        filterContainer.innerHTML = `
          <button class="filter-chip active" data-continent="all">전국</button>
          <button class="filter-chip" data-continent="서울특별시">서울</button>
          <button class="filter-chip" data-continent="인천광역시">인천</button>
          <button class="filter-chip" data-continent="경기도">경기</button>
          <button class="filter-chip" data-continent="강원특별자치도">강원</button>
          <span class="filter-divider"></span>
          <button class="filter-chip" data-continent="충청북도">충북</button>
          <button class="filter-chip" data-continent="충청남도">충남</button>
          <button class="filter-chip" data-continent="세종특별자치시">세종</button>
          <button class="filter-chip" data-continent="대전광역시">대전</button>
          <span class="filter-divider"></span>
          <button class="filter-chip" data-continent="전북특별자치도">전북</button>
          <button class="filter-chip" data-continent="전라남도">전남</button>
          <button class="filter-chip" data-continent="광주광역시">광주</button>
          <span class="filter-divider"></span>
          <button class="filter-chip" data-continent="경상북도">경북</button>
          <button class="filter-chip" data-continent="경상남도">경남</button>
          <button class="filter-chip" data-continent="대구광역시">대구</button>
          <button class="filter-chip" data-continent="부산광역시">부산</button>
          <button class="filter-chip" data-continent="울산광역시">울산</button>
          <span class="filter-divider"></span>
          <button class="filter-chip" data-continent="제주특별자치도">제주</button>
        `;
      }
    }

    // JS 상수로 주입된 SVG 지도를 컨테이너에 삽입
    if (window.AppMode === 'world') {
      container.innerHTML = window.WORLD_MAP_SVG || '';
      const svgEl = container.querySelector('svg');
      if (svgEl) {
        originalViewBox = svgEl.getAttribute('viewBox') || "30.767 241.591 784.077 458.627";
        svgEl.addEventListener('click', () => {
          clearSelection();
        });
      }

      // 삽입된 SVG 내부의 국가 path 요소를 찾아 리스너 바인딩
      const paths = container.querySelectorAll('path');
      paths.forEach(path => {
        const parentG = path.closest('g');
        const countryCode = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
        if (countryCode && !countryCode.startsWith('_')) {
          path.setAttribute('data-code', countryCode);
          path.addEventListener('click', (e) => {
            e.stopPropagation();
            selectCountry(countryCode);
          });
        }
      });
    } else {
      loadNationalMap();
    }

    // 상세 정보 패널 뒤로가기 버튼 리스너 바인딩
    const backBtn = document.getElementById('btn-back-to-list');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        clearSelection();
      });
    }

    // 대륙 필터 이벤트 리스너 설정
    setupContinentFilters();

    // 국가 검색 인풋 이벤트 리스너 설정
    setupSearch();

    // 첫 로드 시 초기 안내 화면 표시 (대륙 필터 선택 전)
    // showInitialState는 함수 호이스팅이 안 되므로 setTimeout으로 호출 시점 보장
    setTimeout(() => showInitialState(), 0);
  }

  // 2. 특정 국가 선택 처리
  function selectCountry(code) {
    const container = document.getElementById('map-container');
    if (!container) return;

    const originalCode = code;
    if (window.AppMode === 'korea' && KOREA_MARKER_MAP[code]) {
      code = KOREA_MARKER_MAP[code];
    }

    let countryData = getCurrentData().find(c => c.code === code);
    
    if (window.AppMode === 'korea') {
      const provKey = getProvinceKey(code);
      if (provKey) {
        // If it's a province code or a sigungu whose province map is not loaded
        if (currentLoadedProvince !== provKey) {
          renderProvinceMap(provKey);
        }
        // If the clicked code itself is the province key, we just zoom out to the province
        if (code === provKey) {
          const svgEl = container.querySelector('svg');
          const provMap = window.KOREA_PROVINCE_MAPS[provKey];
          if (svgEl && provMap && provMap.viewBox) {
            animateViewBox(svgEl, parseViewBoxStr(provMap.viewBox));
          }
          renderCountryList(window.KOREA_PROVINCE_NAMES[provKey] || provKey);
          return;
        }
      }
    }

    // 이전 활성화 효과 제거
    container.querySelectorAll('path').forEach(p => p.classList.remove('active'));
    container.querySelectorAll('circle').forEach(c => c.classList.remove('active'));

    // 지도 상에 클릭한 국가 색상 반전 활성화 (그룹 또는 단일 패스/서클)
    const targetPaths = container.querySelectorAll(`path[id="${code}"], g[id="${code}"] path, path[data-code="${code}"]`);
    targetPaths.forEach(p => p.classList.add('active'));

    const targetCircles = container.querySelectorAll(`circle[id="${code}"], circle[data-code="${code}"], circle[id="${originalCode}"], circle[data-code="${originalCode}"]`);
    targetCircles.forEach(c => c.classList.add('active'));

    activeCountryCode = code;

    // 사이드바 상세 패널 업데이트
    updateSidebar(countryData, code);

    // 클릭/선택 시 지도 줌인 연동
    const svgEl = container.querySelector('svg');
    if (svgEl) {
      const targetElements = Array.from(targetPaths);
      if (targetElements.length > 0) {
        const bbox = getElementsBBox(targetElements);
        if (bbox) {
          zoomToBbox(svgEl, bbox, 0.25);
        } else if (window.AppMode === 'korea' && currentLoadedProvince) {
          // getBBox 실패 시 cx/cy 기반 fallback (Korea province map 전용)
          const provMap = window.KOREA_PROVINCE_MAPS[currentLoadedProvince];
          const pathData = provMap && provMap.paths.find(p => p.code === code);
          if (pathData && pathData.cx !== undefined && pathData.cy !== undefined) {
            zoomToBbox(svgEl, {
              x: pathData.cx - 45,
              y: pathData.cy - 30,
              width: 90,
              height: 60
            }, 0.25);
          }
        }
      } else if (window.AppMode === 'korea' && targetCircles.length > 0) {
        // 전국 지도에서 circle 기반 줌 (legacy 서클 마커)
        try {
          const firstCircle = targetCircles[0];
          const cx = parseFloat(firstCircle.getAttribute('cx') || 0);
          const cy = parseFloat(firstCircle.getAttribute('cy') || 0);
          zoomToBbox(svgEl, { x: cx - 25, y: cy - 25, width: 50, height: 50 }, 0.25);
        } catch (e) {
          console.error('Circle zoom error:', e);
        }
      } else {
        // 지도에 패스가 없는 소국인 경우 해당 대륙 전체 줌인
        if (countryData && countryData.continent) {
          const activeCodes = getCurrentData()
            .filter(c => c.continent === countryData.continent)
            .map(c => c.code);
            
          const activePaths = Array.from(container.querySelectorAll('path')).filter(p => {
            const parentG = p.closest('g');
            const cCode = (parentG && parentG.id) ? parentG.id.toLowerCase() : p.id.toLowerCase();
            return activeCodes.includes(cCode);
          });
          
          if (activePaths.length > 0) {
            const bbox = getElementsBBox(activePaths);
            if (bbox) {
              zoomToBbox(svgEl, bbox, 0.15);
            }
          }
        }
      }
    }
  }

  // 3. 사이드바 상세 패널 정보 갱신
  function updateSidebar(data, code) {
    const defaultState = document.getElementById('detail-default-state');
    const activeState = document.getElementById('detail-active-state');
    
    if (!defaultState || !activeState) return;

    if (data) {
      // 34개 학습 주요 국가인 경우
      defaultState.classList.add('hidden');
      activeState.classList.remove('hidden');

      // 국기/심볼 이미지 로드
      const flagImg = document.getElementById('detail-flag-img');
      if (window.AppMode === 'world') {
        flagImg.src = `https://flagcdn.com/w80/${code}.png`;
        flagImg.onerror = function() {
          this.src = 'https://flagcdn.com/w80/kr.png';
        };
      } else {
        const sym = data.symbol || '📍';
        const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="55" x="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${sym}</text></svg>`;
        if (data.logo) {
          flagImg.src = data.logo;
          flagImg.style.objectFit = 'contain';
          flagImg.style.background = 'rgba(255,255,255,0.95)';
          flagImg.style.padding = '6px';
          flagImg.style.borderRadius = '10px';
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

      document.getElementById('detail-country-name').textContent = data.name;
      document.getElementById('detail-eng-name').textContent = data.engName;
      document.getElementById('detail-continent').textContent = data.continent;
      if (window.AppMode === 'world') {
        document.getElementById('detail-capital').textContent = `${data.capital} (${data.engCapital || ''})`;
      } else {
        document.getElementById('detail-capital').textContent = data.capital || '';
      }
      document.getElementById('detail-location').textContent = data.location;
      document.getElementById('detail-trivia').textContent = data.trivia;

      // 사이드바 레이블 텍스트를 모드별로 조정
      const continentLabel = document.querySelector('[for-id="detail-continent"]') || (() => {
        const sections = document.querySelectorAll('.info-section-title');
        // 순서대로 대륙, 수도, 위치, 특징 레이블 찾기
        return sections[0];
      })();
      const capitalSection = document.querySelector('.info-section:nth-child(2) .info-section-title');
      const allSectionTitles = document.querySelectorAll('#detail-active-state .info-section-title');
      if (allSectionTitles.length >= 2) {
        if (window.AppMode === 'world') {
          allSectionTitles[0].textContent = '대륙';
          allSectionTitles[1].textContent = '수도';
        } else {
          allSectionTitles[0].textContent = '소속 도/권역';
          allSectionTitles[1].textContent = '핵심 상징 / 특산물';
        }
      }

      // 대표 랜드마크 생성
      const landmarksContainer = document.getElementById('detail-landmarks');
      landmarksContainer.innerHTML = '';
      if (data.landmarks && data.landmarks.length > 0) {
        data.landmarks.forEach(lm => {
          const tag = document.createElement('span');
          tag.className = 'landmark-tag';
          tag.textContent = lm;
          landmarksContainer.appendChild(tag);
        });
      }
    } else {
      // 데이터셋에 등록되지 않은 특수 지역 또는 영토를 클릭한 경우
      defaultState.classList.remove('hidden');
      activeState.classList.add('hidden');
      
      const formattedCode = code.toUpperCase();
      defaultState.innerHTML = `
        <div style="font-size: 4rem;">🧭</div>
        <h3>기타 영토 및 미지원 지역 (${formattedCode})</h3>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">
          이 지역은 독립 올림픽 참가국이 아니거나 상세 데이터를 지원하지 않는 특수 영토입니다.<br>
          상단의 대륙 필터를 활용하여 전 세계 여러 올림픽 참가국들을 학습해 보세요!
        </p>
      `;
    }
  }

  // 4. 지도 선택 해제 및 목록 복원
  function clearSelection() {
    const container = document.getElementById('map-container');
    if (!container) return;

    container.querySelectorAll('path').forEach(p => p.classList.remove('active'));
    container.querySelectorAll('circle').forEach(c => c.classList.remove('active'));
    activeCountryCode = null;

    const defaultState = document.getElementById('detail-default-state');
    const activeState = document.getElementById('detail-active-state');
    if (!defaultState || !activeState) return;

    defaultState.classList.remove('hidden');
    activeState.classList.add('hidden');

    if (window.AppMode === 'korea') {
      if (currentContinent === 'all') {
        showInitialState();
        loadNationalMap();
        const svgEl = container.querySelector('svg');
        if (svgEl) animateViewBox(svgEl, parseViewBoxStr(originalViewBox));
      } else {
        // Check if currentContinent is a region group or single province
        const provKey = getProvinceKey(currentContinent);
        if (provKey) {
          // Keep province map loaded, zoom out to show whole province map
          renderProvinceMap(provKey);
          renderCountryList(currentContinent);
          const svgEl = container.querySelector('svg');
          const provMap = window.KOREA_PROVINCE_MAPS[provKey];
          if (svgEl && provMap && provMap.viewBox) {
            animateViewBox(svgEl, parseViewBoxStr(provMap.viewBox));
          }
        } else {
          // It's a region group: reload national map and apply filter without recursion
          if (currentLoadedProvince !== null) {
            loadNationalMap();
          }
          renderCountryList(currentContinent);
          // 직접 필터 적용 (filterMapByContinent 호출 시 재귀 발생하므로 헬퍼 직접 사용)
          _applyRegionFilterOnNationalMap(currentContinent);
        }
      }
      return;
    }

    // World mode logic (existing)
    if (currentContinent === 'all') {
      showInitialState();
      const svgEl = container.querySelector('svg');
      if (svgEl) animateViewBox(svgEl, parseViewBoxStr(originalViewBox));
      container.querySelectorAll('path').forEach(p => p.classList.remove('filtered-out'));
    } else {
      renderCountryList(currentContinent);
      resetMapToContinent(currentContinent);
    }
  }

  // 지도를 특정 대륙 전체 뷰로 줌아웃 (clearSelection 내에서 무한 루프 없이 사용)
  function resetMapToContinent(continent) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    const svgEl = mapContainer.querySelector('svg');
    const paths = mapContainer.querySelectorAll('path');

    const activeCodes = getCurrentData()
      .filter(c => c.continent === continent)
      .map(c => c.code);

    paths.forEach(path => {
      const parentG = path.closest('g');
      const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
      if (activeCodes.includes(code)) {
        path.classList.remove('filtered-out');
      } else {
        path.classList.add('filtered-out');
      }
    });

    if (svgEl) {
      const activePaths = Array.from(paths).filter(p => !p.classList.contains('filtered-out'));
      if (activePaths.length > 0) {
        const bbox = getElementsBBox(activePaths);
        if (bbox) {
          zoomToBbox(svgEl, bbox, 0.15);
        }
      }
    }
  }

  // 5. 대륙 필터 칩 작동 설정
  function setupContinentFilters() {
    const filterContainer = document.getElementById('continent-filters');
    const mapContainer = document.getElementById('map-container');
    if (!filterContainer || !mapContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;

      const continent = btn.getAttribute('data-continent');

      // 이미 활성화된 대륙 칩을 다시 클릭하면 초기화면으로 리셋
      if (btn.classList.contains('active') && continent !== 'all') {
        // '전체' 칩을 active로 전환
        filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        filterContainer.querySelector('[data-continent="all"]').classList.add('active');

        currentContinent = 'all';
        filterMapByContinent('all');
        showInitialState();
        return;
      }

      // 액티브 클래스 이동
      filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');

      currentContinent = continent; // 현재 선택 대륙 업데이트
      filterMapByContinent(continent);

      // 대륙 필터 변경 시 우측 리스트 갱신
      if (continent === 'all') {
        showInitialState();
      } else {
        renderCountryList(continent);
      }
    });
  }

  // 초기 안내 화면 표시 헬퍼 (대륙 선택 전 기본 상태)
  function showInitialState() {
    // 국가 선택 해제
    containerPathsClearActive();
    activeCountryCode = null;

    const defaultState = document.getElementById('detail-default-state');
    const activeState = document.getElementById('detail-active-state');
    if (!defaultState || !activeState) return;

    activeState.classList.add('hidden');
    defaultState.classList.remove('hidden');
    defaultState.className = 'flex-center';
    defaultState.removeAttribute('style');
    if (window.AppMode === 'world') {
      defaultState.innerHTML = `
        <div style="font-size: 4rem;">🧭</div>
        <h3>국가를 선택하세요</h3>
        <p style="font-size: 0.9rem;">지도에서 특정 국가를 클릭하거나 검색 창에서 검색하면 자세한 국가 정보 카드가 표시됩니다.<br>대륙 필터를 선택하면 해당 대륙의 국가 목록이 표시됩니다.</p>
      `;
    } else {
      defaultState.innerHTML = `
        <div style="font-size: 4rem;">🧭</div>
        <h3>지역을 선택하세요</h3>
        <p style="font-size: 0.9rem;">지도에서 특정 지역을 클릭하거나 검색 창에서 검색하면 자세한 지역 정보 카드가 표시됩니다.<br>권역 필터를 선택하면 해당 권역의 지역 목록이 표시됩니다.</p>
      `;
    }
  }

  // 내부 헬퍼: 전국 지도에서 권역 필터 + 줌인 적용 (clearSelection 재귀 없이 순수 지도 처리만 담당)
  function _applyRegionFilterOnNationalMap(continent) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    const svgEl = mapContainer.querySelector('svg');

    const paths = mapContainer.querySelectorAll('path');
    paths.forEach(path => {
      const parentG = path.closest('g');
      const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
      if (code && !code.startsWith('_') && code !== 'kr-mainland') {
        if (isProvinceInRegion(code, continent)) {
          path.classList.remove('filtered-out');
        } else {
          path.classList.add('filtered-out');
        }
      }
    });

    if (svgEl) {
      const activePaths = Array.from(paths).filter(p => !p.classList.contains('filtered-out'));
      if (activePaths.length > 0) {
        const bbox = getElementsBBox(activePaths);
        if (bbox) {
          zoomToBbox(svgEl, bbox, 0.15);
        }
      }
    }
  }

  // 대륙별 지도 필터링 시각화 효과 및 확대/축소
  // 주의: clearSelection() 을 직접 호출하지 않음 (무한 재귀 방지)
  function filterMapByContinent(continent) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    let svgEl = mapContainer.querySelector('svg');
    
    if (continent === 'all') {
      if (window.AppMode === 'korea') {
        loadNationalMap();
        svgEl = mapContainer.querySelector('svg');
      }
      if (svgEl) {
        svgEl.querySelectorAll('path').forEach(p => p.classList.remove('filtered-out'));
        animateViewBox(svgEl, parseViewBoxStr(originalViewBox));
      }
      // clearSelection() 은 호출하지 않음 (setupContinentFilters에서 showInitialState 처리)
      return;
    }

    if (window.AppMode === 'korea') {
      const provKey = getProvinceKey(continent);
      if (provKey) {
        // 단일 시도: 해당 시도의 상세 지도 로드
        renderProvinceMap(provKey);
        // 사이드 패널 초기화 (선택 해제 상태)
        const defaultState = document.getElementById('detail-default-state');
        const activeState = document.getElementById('detail-active-state');
        if (defaultState && activeState) {
          defaultState.classList.remove('hidden');
          activeState.classList.add('hidden');
        }
        activeCountryCode = null;
        return;
      }

      // 권역 그룹 (충청권, 전라권, 경상권, 제주도): 전국 지도에서 필터링
      if (currentLoadedProvince !== null) {
        loadNationalMap();
      }
      _applyRegionFilterOnNationalMap(continent);

      // 사이드 패널 초기화
      const defaultState = document.getElementById('detail-default-state');
      const activeState = document.getElementById('detail-active-state');
      if (defaultState && activeState) {
        defaultState.classList.remove('hidden');
        activeState.classList.add('hidden');
      }
      activeCountryCode = null;
      return;
    }

    // World mode: 대륙별 path 필터링
    const activeCodes = getCurrentData()
      .filter(c => c.continent === continent)
      .map(c => c.code);

    const paths = mapContainer.querySelectorAll('path');
    paths.forEach(path => {
      const parentG = path.closest('g');
      const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
      if (activeCodes.includes(code)) {
        path.classList.remove('filtered-out');
      } else {
        path.classList.add('filtered-out');
      }
    });

    if (svgEl) {
      const activePaths = Array.from(paths).filter(p => !p.classList.contains('filtered-out'));
      if (activePaths.length > 0) {
        const bbox = getElementsBBox(activePaths);
        if (bbox) {
          zoomToBbox(svgEl, bbox, 0.15);
        }
      }
    }
    // World 모드에서도 clearSelection() 호출 제거 (setupContinentFilters에서 처리)
  }

  // 6. 검색 기능 설정 (검색 결과에 따라 우측 리스트와 지도를 동시 필터링)
  function setupSearch() {
    const searchInput = document.getElementById('map-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      // 검색 시 사이드바 목록 갱신 (선택 해제 후 리스트가 보이도록)
      const activeState = document.getElementById('detail-active-state');
      if (activeState && !activeState.classList.contains('hidden')) {
        // 이미 국가 상세 정보를 보고 있다면 뒤로가기 처리하여 검색 결과를 노출시킴
        containerPathsClearActive();
        activeCountryCode = null;
        activeState.classList.add('hidden');
        document.getElementById('detail-default-state').classList.remove('hidden');
      }
      
      // 리스트 갱신
      renderCountryList(currentContinent);

      if (!query) {
        // 검색어 삭제 시 원래 상태 복귀
        filterMapByContinent(currentContinent);
        return;
      }

      // 이름 또는 수도에 검색어가 매칭되는 국가 찾기
      const matched = getCurrentData().filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.engName.toLowerCase().includes(query) ||
        c.capital.toLowerCase().includes(query) ||
        c.engCapital.toLowerCase().includes(query)
      );

      // 지도 시각 필터링
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        const paths = mapContainer.querySelectorAll('path');
        const matchedCodes = matched.map(c => c.code);

        if (window.AppMode === 'korea' && currentLoadedProvince === null) {
          // We are on the national map, filter provinces that contain matched sigungus
          const matchedProvKeys = matched.map(c => getProvinceKey(c.code));
          paths.forEach(path => {
            const parentG = path.closest('g');
            const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
            if (code && !code.startsWith('_') && code !== 'kr-mainland') {
              if (matchedProvKeys.includes(code)) {
                path.classList.remove('filtered-out');
              } else {
                path.classList.add('filtered-out');
              }
            }
          });
        } else {
          // World mode, or Korea mode with a province map loaded
          paths.forEach(path => {
            const parentG = path.closest('g');
            const code = (parentG && parentG.id) ? parentG.id.toLowerCase() : path.id.toLowerCase();
            
            if (matchedCodes.includes(code)) {
              path.classList.remove('filtered-out');
            } else {
              path.classList.add('filtered-out');
            }
          });
        }

        // 검색 매칭된 국가들에 따른 지도 줌 조절
        const svgEl = mapContainer.querySelector('svg');
        if (svgEl) {
          const activePaths = Array.from(paths).filter(p => !p.classList.contains('filtered-out'));
          if (activePaths.length > 0) {
            const bbox = getElementsBBox(activePaths);
            if (bbox) {
              zoomToBbox(svgEl, bbox, 0.20);
            }
          }
        }
      }

      // 검색결과가 딱 하나인 경우 즉시 선택 처리
      if (matched.length === 1) {
        selectCountry(matched[0].code);
      }
    });
  }

  // Helper to clear active paths and circle markers (Korea Mode)
  function containerPathsClearActive() {
    const container = document.getElementById('map-container');
    if (container) {
      container.querySelectorAll('path').forEach(p => p.classList.remove('active'));
      container.querySelectorAll('circle').forEach(c => c.classList.remove('active'));
    }
  }

  // 7. 사이드바 국가 리스트 렌더링 (동일 데이터 보장)
  function renderCountryList(continent) {
    const defaultState = document.getElementById('detail-default-state');
    if (!defaultState) return;

    // 대륙 필터
    let list = getCurrentData();
    if (continent !== 'all') {
      list = list.filter(c => {
        if (window.AppMode === 'korea') {
          const provKey = getProvinceKey(c.continent);
          return isProvinceInRegion(provKey, continent);
        } else {
          return c.continent === continent;
        }
      });
    }

    // 검색어 필터 추가 연동
    const searchInput = document.getElementById('map-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) {
      list = list.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.engName.toLowerCase().includes(query) ||
        c.capital.toLowerCase().includes(query) ||
        c.engCapital.toLowerCase().includes(query)
      );
    }

    const container = document.getElementById('map-container');
    const svgEl = container ? container.querySelector('svg') : null;

    let listTitle = '';
    let countText = '';
    if (window.AppMode === 'world') {
      const continentName = continent === 'all' ? '전체 세계' : continent;
      listTitle = `${continentName} 국가 목록`;
      countText = `총 ${list.length}개국 (클릭하여 상세 정보 학습)`;
    } else {
      const continentName = continent === 'all' ? '전국' : continent;
      listTitle = `${continentName} 지역 목록`;
      countText = `총 ${list.length}개 지역 (클릭하여 상세 정보 학습)`;
    }

    let html = `
      <div class="country-list-container">
        <div class="country-list-header">
          <h3>${listTitle}</h3>
          <p>${countText}</p>
        </div>
        <div class="country-grid">
    `;

    list.forEach(c => {
      // SVG 맵 내 물리 패스 존재 여부 체크
      let hasPath = false;
      if (svgEl) {
        const path = svgEl.querySelector(`path[id="${c.code}"], g[id="${c.code}"] path, path[data-code="${c.code}"]`);
        if (path) hasPath = true;
      }

      const missingClass = hasPath ? '' : ' missing-svg';
      const tooltip = hasPath ? '' : ' title="지도에 표시되지 않는 소국/영토입니다"';

      let imgTag = '';
      if (window.AppMode === 'world') {
        imgTag = `<img src="https://flagcdn.com/w80/${c.code}.png" alt="${c.name} 국기" onerror="this.src='https://flagcdn.com/w80/kr.png';">`;
      } else {
        const sym = c.symbol || '📍';
        if (c.logo) {
          imgTag = `<img src="${c.logo}" alt="${c.name} 마크" style="height:40px;width:40px;object-fit:contain;margin-bottom:0.4rem;background:rgba(255,255,255,0.95);border-radius:8px;padding:3px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="font-size:1.5rem;margin-bottom:0.4rem;display:none;">${sym}</span>`;
        } else {
          imgTag = `<span style="font-size:1.5rem; margin-bottom:0.4rem; display:block;">${sym}</span>`;
        }
      }

      html += `
        <div class="country-list-item${missingClass}" data-code="${c.code}"${tooltip}>
          ${imgTag}
          <span>${c.name}</span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    defaultState.innerHTML = html;
    defaultState.className = ""; // flex-center 클래스 제거로 스크롤 및 정상 그리드 레이아웃 확보
    defaultState.style.display = "block";
    defaultState.style.height = "100%";

    // 각 아이템 클릭 리스너 설정
    const items = defaultState.querySelectorAll('.country-list-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const code = item.getAttribute('data-code');
        selectCountry(code);
      });
    });
  }
  // 8. 네임스페이스 등록
  window.AppMap = {
    init: initMap,
    selectCountry: selectCountry,
    clearSelection: clearSelection,
    renderCountryList: renderCountryList
  };
})();
