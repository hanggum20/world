// 인쇄용 학습지 및 정답지 자동 컴파일러 로직
(function() {
  function getCurrentData() {
    return window.AppMode === 'world' ? window.WORLD_DATA : window.KOREA_DATA;
  }
  
  // 1. 학습지 생성 메인 로직
  function generateWorksheet() {
    const titleInput = document.getElementById('ws-title-input');
    const typeSelect = document.getElementById('ws-question-type');
    const countSelect = document.getElementById('ws-count-select');
    const answerKeyCheckbox = document.getElementById('ws-toggle-answerkey');
    const previewContainer = document.getElementById('worksheet-preview');

    if (!previewContainer) return;

    const defaultTitle = window.AppMode === 'world' ? "세계 여러 나라 학습지" : "우리나라 시·군·구 학습지";
    const title = titleInput.value.trim() || defaultTitle;
    const type = typeSelect.value;
    const count = parseInt(countSelect.value, 10);
    const includeAnswerKey = answerKeyCheckbox.checked;

    // 선택된 대륙 배열 가져오기
    const selectedContinents = [];
    const checkboxes = document.querySelectorAll('#ws-continents-checkboxes input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (cb.checked) {
        selectedContinents.push(cb.value);
      }
    });

    if (selectedContinents.length === 0) {
      alert("출제 범위를 최소 1개 이상 선택해 주세요!");
      return;
    }

    // 선택 대륙 기반 국가 필터링
    const filteredCountries = getCurrentData().filter(c => selectedContinents.includes(c.continent));
    // 선택된 범위 내 지역이 없으면 차단 (오답은 전체 데이터에서 춰우므로 4개 미만이라도 무방)
    if (filteredCountries.length < 1) {
      alert("선택된 범위 내 지역이 없습니다. 범위를 다시 선택해 주세요!");
      return;
    }

    // 문제 데이터 생성
    const questionsData = buildQuestionsData(filteredCountries, type, count);

    // HTML 구조 렌더링 시작
    previewContainer.innerHTML = '';

    // 한 페이지당 들어갈 문제 수 정의 (A4 1장 기준 객관식 10문제, 매칭은 5문제씩 묶음)
    const questionsPerPage = (type === 'matching') ? 5 : 10;
    const totalPages = Math.ceil(questionsData.length / questionsPerPage);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageEl = document.createElement('div');
      pageEl.className = 'a4-page';

      // 1) 학습지 상단 타이틀 및 신상 입력칸 (1페이지에만 노출)
      if (pageNum === 1) {
        pageEl.appendChild(createHeader(title));
        pageEl.appendChild(createInstructions(type));
      } else {
        // 2페이지 이후에는 미니 타이틀만 추가
        const miniHeader = document.createElement('div');
        miniHeader.style.display = 'flex';
        miniHeader.style.justify = 'space-between';
        miniHeader.style.borderBottom = '1px solid #1e293b';
        miniHeader.style.paddingBottom = '0.3rem';
        miniHeader.style.fontSize = '0.8rem';
        miniHeader.style.color = '#64748b';
        miniHeader.innerHTML = `<span>${title}</span><span>페이지 ${pageNum}/${totalPages}</span>`;
        pageEl.appendChild(miniHeader);
      }

      // 2) 문제 렌더링 컨테이너
      const qContainer = document.createElement('div');
      qContainer.className = 'ws-questions-container';
      qContainer.style.marginTop = '1rem';
      
      const startIdx = (pageNum - 1) * questionsPerPage;
      const endIdx = Math.min(startIdx + questionsPerPage, questionsData.length);
      const pageQuestions = questionsData.slice(startIdx, endIdx);

      if (type === 'matching') {
        // 선 긋기형 문제는 5문제를 하나의 매칭 영역으로 렌더링
        qContainer.appendChild(createMatchingQuestion(pageQuestions, startIdx + 1));
      } else {
        // 객관식 또는 주관식 렌더링
        pageQuestions.forEach((q, index) => {
          const absoluteIndex = startIdx + index + 1;
          qContainer.appendChild(createIndividualQuestion(q, absoluteIndex));
        });
      }

      pageEl.appendChild(qContainer);

      // 3) 페이지 하단 푸터 표기
      const footer = document.createElement('div');
      footer.style.marginTop = 'auto';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '0.8rem';
      footer.style.color = '#94a3b8';
      footer.textContent = `- ${pageNum} -`;
      pageEl.appendChild(footer);

      previewContainer.appendChild(pageEl);
    }

    // 4) 정답지 페이지 추가
    if (includeAnswerKey) {
      const answerPage = document.createElement('div');
      answerPage.className = 'a4-page';
      
      const ansHeader = document.createElement('div');
      ansHeader.className = 'ws-title-area';
      ansHeader.innerHTML = `<h1 class="ws-title" style="border-bottom: 2px dashed #000; padding-bottom: 0.5rem;">[정답지] ${title}</h1>`;
      answerPage.appendChild(ansHeader);

      const ansGrid = document.createElement('div');
      ansGrid.className = 'ws-answer-key-grid';
      ansGrid.style.marginTop = '2rem';

      questionsData.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'ws-answer-item';
        
        let answerText = "";
        if (q.type === 'matching') {
          // 선긋기는 각 매핑 정답 표기
          answerText = `${q.name} ➡️ 수도: ${q.capital} ➡️ 국기 코드: ${q.code.toUpperCase()}`;
        } else if (q.type === 'multiple-choice') {
          answerText = `정답: ${q.correctIndex + 1}번 (${q.answer})`;
        } else if (q.type === 'write-capital') {
          answerText = `정답: ${q.answer}`;
        }

        item.innerHTML = `<strong>Q ${index + 1}.</strong> ${answerText}`;
        ansGrid.appendChild(item);
      });

      answerPage.appendChild(ansGrid);
      
      const ansFooter = document.createElement('div');
      ansFooter.style.marginTop = 'auto';
      ansFooter.style.textAlign = 'center';
      ansFooter.style.fontSize = '0.8rem';
      ansFooter.style.color = '#94a3b8';
      ansFooter.textContent = `- 정답지 -`;
      answerPage.appendChild(ansFooter);

      previewContainer.appendChild(answerPage);
    }

    // Firebase에 학습지 생성 이력 저장
    const user = window.AppAuth.getCurrentUser();
    if (user && (user.role === 'teacher' || user.role === 'admin')) {
      window.AppAuth.getUserData().then(userData => {
        if (!userData) return;
        const history = userData.worksheetHistory || [];
        const newEntry = {
          date: new Date().toISOString(),
          title: title,
          type: type,
          count: count,
          mode: window.AppMode || 'world',
          continents: selectedContinents
        };
        const dupIdx = history.findIndex(h => h.title === title && h.type === type && h.count === count);
        if (dupIdx !== -1) {
          history.splice(dupIdx, 1);
        }
        history.unshift(newEntry);
        if (history.length > 20) history.splice(20);
        window.AppAuth.updateUserData({ worksheetHistory: history }).then(() => {
          renderWorksheetHistory();
        });
      });
    }
  }

  // 2. 문제 세부 문항 데이터 구축
  function buildQuestionsData(countries, type, count) {
    // 풀에서 무작위 셔플하여 출제 개수만큼 선택
    const selected = [...countries].sort(() => 0.5 - Math.random()).slice(0, count);
    
    return selected.map((country, idx) => {
      // 출제 유형 세부 정의
      let questionType = type;
      if (type === 'mixed') {
        const types = ['multiple-choice', 'write-capital'];
        // 매칭은 레이아웃 꼬임을 방지하기 위해 믹스에서 제외하고 2가지로 교차 편성
        questionType = types[idx % types.length];
      }

      if (questionType === 'multiple-choice') {
        // 객관식형 출제 (수도 또는 국기 맞히기 중 랜덤)
        const isCapitalQuestion = Math.random() > 0.5;
        const options = [country];
        
        // 오답용 distractor 선택 — 전체 데이터 풀에서 추출하여 1~3개만 선택해도 4지선다 보장
        const allData = getCurrentData();
        const pool = allData.filter(c => c.code !== country.code);
        const distractors = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
        options.push(...distractors);
        options.sort(() => 0.5 - Math.random());

        const correctIdx = options.findIndex(o => o.code === country.code);

        if (isCapitalQuestion) {
          if (window.AppMode === 'world') {
            return {
              type: 'multiple-choice',
              prompt: `다음 중 수도가 [ ${country.capital} ]인 나라는 어느 곳입니까?`,
              options: options.map(o => o.name),
              correctIndex: correctIdx,
              answer: country.name
            };
          } else {
            return {
              type: 'multiple-choice',
              prompt: `다음 중 [ ${country.continent} ]에 속해 있는 곳은 어디입니까?`,
              options: options.map(o => o.name),
              correctIndex: correctIdx,
              answer: country.name
            };
          }
        } else {
          if (window.AppMode === 'world') {
            return {
              type: 'multiple-choice',
              prompt: `제시된 국기를 사용하는 나라의 이름을 고르세요.`,
              flagCode: country.code,
              options: options.map(o => o.name),
              correctIndex: correctIdx,
              answer: country.name
            };
          } else {
            return {
              type: 'multiple-choice',
              prompt: `다음 중 [ ${country.capital} ](이)가 유명한 곳을 고르세요.`,
              options: options.map(o => o.name),
              correctIndex: correctIdx,
              answer: country.name
            };
          }
        }
        
      } else if (questionType === 'write-capital') {
        // 주관식 수도 쓰기 출제
        if (window.AppMode === 'world') {
          return {
            type: 'write-capital',
            prompt: `제시된 나라의 수도 이름을 적으세요.`,
            name: country.name,
            flagCode: country.code,
            answer: country.capital
          };
        } else {
          return {
            type: 'write-capital',
            prompt: `제시된 지역이 속한 도/권역(예: 경기도, 전라권 등)을 적으세요.`,
            name: country.name,
            answer: country.continent
          };
        }
        
      } else {
        // 선긋기 매칭형 출제용 데이터
        return {
          type: 'matching',
          code: country.code,
          name: country.name,
          capital: country.capital
        };
      }
    });
  }

  // 3. 인쇄용 헤더 엘리먼트 생성
  function createHeader(title) {
    const header = document.createElement('div');
    header.className = 'ws-title-area';
    
    // 오늘의 날짜 문자열
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    header.innerHTML = `
      <div class="ws-title">${title}</div>
      <div class="ws-info-fields">
        <div style="font-size: 0.9rem; color: #475569;">일자: ${dateStr}</div>
        <div class="ws-field-item">학년   반</div>
        <div class="ws-field-item">번호</div>
        <div class="ws-field-item">이름:</div>
      </div>
    `;
    return header;
  }

  // 4. 지시사항 안내문 생성
  function createInstructions(type) {
    const el = document.createElement('div');
    el.className = 'ws-instructions';
    
    let text = window.AppMode === 'world' ? "세계 주요 나라들의 위치와 특징을 탐구하며 문제를 풀어보세요." : "우리나라 시·군·구의 위치와 특징을 탐구하며 문제를 풀어보세요.";
    if (type === 'multiple-choice') {
      text = "[객관식] 질문에 맞게 알맞은 번호를 골라 보기에서 고르세요.";
    } else if (type === 'write-capital') {
      text = window.AppMode === 'world' ? "[주관식] 각 나라명을 확인하고, 빈칸에 올바른 수도 명칭을 적어 넣으세요." : "[주관식] 각 지역명을 확인하고, 빈칸에 올바른 도/권역 명칭을 적어 넣으세요.";
    } else if (type === 'matching') {
      text = window.AppMode === 'world' ? "[선긋기] 왼쪽의 나라 이름, 가운데 국기, 오른쪽의 수도가 일치하도록 선으로 깔끔하게 연결하세요." : "[선긋기] 왼쪽의 지역 이름, 가운데 위치 기호, 오른쪽의 상징이 일치하도록 선으로 깔끔하게 연결하세요.";
    } else if (type === 'mixed') {
      text = "[혼합형] 각 문항의 안내에 맞춰 객관식 및 주관식 답안을 정확히 작성하세요.";
    }

    el.textContent = text;
    return el;
  }

  // 5. 단일 문항(객관식/주관식) 렌더링 헬퍼
  function createIndividualQuestion(q, num) {
    const wrap = document.createElement('div');
    wrap.className = 'ws-question';
    wrap.style.marginBottom = '1.8rem';

    // 질문 텍스트
    const prompt = document.createElement('div');
    prompt.className = 'ws-question-text';
    prompt.innerHTML = `${num}. ${q.prompt}`;
    wrap.appendChild(prompt);

    // 국기 이미지가 포함된 문제인 경우
    if (q.flagCode) {
      const img = document.createElement('img');
      img.src = `https://flagcdn.com/w80/${q.flagCode}.png`;
      img.className = 'ws-flag-box';
      img.style.marginTop = '0.4rem';
      img.style.marginBottom = '0.4rem';
      wrap.appendChild(img);
    }

    if (q.type === 'multiple-choice') {
      // 4지선다형 레이아웃 그리기
      const grid = document.createElement('div');
      grid.className = 'ws-options-grid';
      grid.style.marginTop = '0.5rem';
      
      q.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'ws-option-item';
        item.textContent = `① ${opt}`;
        // 유니코드 원형 숫자로 변환 표기
        const circNums = ['①', '②', '③', '④'];
        item.textContent = `${circNums[idx]} ${opt}`;
        grid.appendChild(item);
      });
      wrap.appendChild(grid);

    } else if (q.type === 'write-capital') {
      // 주관식 빈칸 그리기
      const ansArea = document.createElement('div');
      ansArea.style.marginTop = '0.5rem';
      ansArea.style.fontSize = '0.95rem';
      if (window.AppMode === 'world') {
        ansArea.innerHTML = `<strong>${q.name}</strong>의 수도는? <span class="ws-short-answer-line"></span> 입니다.`;
      } else {
        ansArea.innerHTML = `<strong>${q.name}</strong>이(가) 속한 곳은? <span class="ws-short-answer-line"></span> 입니다.`;
      }
      wrap.appendChild(ansArea);
    }

    return wrap;
  }

  // 6. 선긋기(매칭형) 문항 그룹 렌더링 헬퍼 (5개 국가 세트)
  function createMatchingQuestion(subQuestions, startNum) {
    const wrap = document.createElement('div');
    wrap.className = 'ws-question';
    wrap.style.marginBottom = '2rem';

    const prompt = document.createElement('div');
    prompt.className = 'ws-question-text';
    prompt.textContent = window.AppMode === 'world' ? `[문항 ${startNum}~${startNum + subQuestions.length - 1}] 나라 이름, 국기, 수도를 바르게 선으로 연결해 보세요.` : `[문항 ${startNum}~${startNum + subQuestions.length - 1}] 지역 이름, 기호, 상징을 바르게 선으로 연결해 보세요.`;
    wrap.appendChild(prompt);

    const matchContainer = document.createElement('div');
    matchContainer.className = 'ws-match-container';
    matchContainer.style.marginTop = '1.5rem';

    // 컬럼 A: 나라 이름 (오리지널 순서 유지)
    const colA = document.createElement('div');
    colA.className = 'ws-match-col';
    
    // 컬럼 B: 국기 이미지 (무작위 셔플)
    const colB = document.createElement('div');
    colB.className = 'ws-match-col';
    
    // 컬럼 C: 수도 이름 (무작위 셔플)
    const colC = document.createElement('div');
    colC.className = 'ws-match-col';

    const flagsShuffled = [...subQuestions].sort(() => 0.5 - Math.random());
    const capitalsShuffled = [...subQuestions].sort(() => 0.5 - Math.random());

    subQuestions.forEach(q => {
      const item = document.createElement('div');
      item.className = 'ws-match-item';
      item.innerHTML = `<span>${q.name}</span><span class="ws-match-dot"></span>`;
      colA.appendChild(item);
    });

    flagsShuffled.forEach(q => {
      const item = document.createElement('div');
      item.className = 'ws-match-item';
      if (window.AppMode === 'world') {
        item.innerHTML = `<span class="ws-match-dot"></span><img src="https://flagcdn.com/w80/${q.code}.png" class="ws-flag-box"><span class="ws-match-dot"></span>`;
      } else {
        const sym = q.symbol || '📍';
        if (q.logo) {
          item.innerHTML = `<span class="ws-match-dot"></span><img src="${q.logo}" style="height:32px;width:32px;object-fit:contain;background:#fff;border-radius:4px;padding:2px;border:1px solid #ddd;" onerror="this.outerHTML='<span style=\\'font-size:2rem;\\'>${sym}</span>'"><span class="ws-match-dot"></span>`;
        } else {
          item.innerHTML = `<span class="ws-match-dot"></span><span style="font-size:2rem;">${sym}</span><span class="ws-match-dot"></span>`;
        }
      }
      colB.appendChild(item);
    });

    capitalsShuffled.forEach(q => {
      const item = document.createElement('div');
      item.className = 'ws-match-item';
      item.innerHTML = `<span class="ws-match-dot"></span><span>${q.capital}</span>`;
      colC.appendChild(item);
    });

    matchContainer.appendChild(colA);
    matchContainer.appendChild(colB);
    matchContainer.appendChild(colC);

    wrap.appendChild(matchContainer);
    return wrap;
  }

  // 7. 인쇄 대화상자 출력
  function printWorksheet() {
    window.print();
  }

  // 8. 초기화 헬퍼
  function initWorksheet() {
    const container = document.getElementById('ws-continents-checkboxes');
    const titleInput = document.getElementById('ws-title-input');
    if (!container || !titleInput) return;

    if (window.AppMode === 'world') {
      titleInput.placeholder = '세계 여러 나라 학습지';
      titleInput.value = '';
      container.innerHTML = `
        <label><input type="checkbox" value="아시아" checked> 아시아</label>
        <label><input type="checkbox" value="유럽" checked> 유럽</label>
        <label><input type="checkbox" value="북아메리카"> 북아메리카</label>
        <label><input type="checkbox" value="남아메리카"> 남아메리카</label>
        <label><input type="checkbox" value="아프리카"> 아프리카</label>
        <label><input type="checkbox" value="오세아니아"> 오세아니아</label>
      `;
    } else {
      titleInput.placeholder = '우리나라 시·군·구 학습지';
      titleInput.value = '';
      container.innerHTML = `
        <label><input type="checkbox" value="서울특별시" checked> 서울</label>
        <label><input type="checkbox" value="경기도" checked> 경기</label>
        <label><input type="checkbox" value="강원특별자치도"> 강원</label>
        <label><input type="checkbox" value="충청권"> 충청</label>
        <label><input type="checkbox" value="전라권"> 전라</label>
        <label><input type="checkbox" value="경상권"> 경상</label>
        <label><input type="checkbox" value="제주도"> 제주</label>
      `;
    }

    // 최근 학습지 생성 이력 렌더링
    renderWorksheetHistory();
  }

  function renderWorksheetHistory() {
    const user = window.AppAuth.getCurrentUser();
    const section = document.getElementById('ws-history-section');
    const list = document.getElementById('ws-history-list');
    if (!section || !list) return;

    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      section.style.display = 'none';
      return;
    }

    window.AppAuth.getUserData().then(userData => {
      if (!userData) {
        section.style.display = 'none';
        return;
      }

      const history = userData.worksheetHistory || [];
      if (history.length === 0) {
        section.style.display = 'block';
        list.innerHTML = '<li style="color:var(--text-muted);text-align:center;padding:0.5rem 0;">생성 이력이 없습니다.</li>';
        return;
      }

      section.style.display = 'block';
      list.innerHTML = history.map(item => {
        const d = new Date(item.date);
        const dateStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        const typeLabel = { mixed: '혼합형', 'multiple-choice': '객관식', 'write-capital': '주관식', matching: '선긋기' }[item.type] || item.type;
        return `
          <li style="background:rgba(255,255,255,0.03); padding:0.4rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between; align-items:center; gap:0.5rem; border:1px solid rgba(255,255,255,0.05); margin-bottom: 0.35rem;">
            <div style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap; flex:1;" title="${item.title}">
              📄 <strong>${item.title}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${typeLabel}, ${item.count}문항)</span>
            </div>
            <span style="font-size:0.7rem; color:var(--text-muted); flex-shrink:0;">${dateStr}</span>
          </li>
        `;
      }).join('');
    });
  }

  window._renderWorksheetHistory = renderWorksheetHistory;

  // 9. 네임스페이스 등록
  window.AppWorksheet = {
    init: initWorksheet,
    generate: generateWorksheet,
    print: printWorksheet
  };
})();
