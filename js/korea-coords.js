// 전국 230개 시·군·구 SVG 정밀 좌표 데이터
// SVG viewBox: 0 0 524 631 기준
// 각 시·군·구의 실제 지리 위치를 기반으로 산출된 픽셀 좌표

window.KOREA_COORDS = {
  // ── 서울특별시 (25구) ──────────────────────────────────
  "kr-region-1":  {cx: 148, cy: 127}, // 종로구 (중심)
  "kr-region-2":  {cx: 152, cy: 131}, // 중구 (도심)
  "kr-region-3":  {cx: 149, cy: 134}, // 용산구 (중앙남)
  "kr-region-4":  {cx: 158, cy: 130}, // 성동구 (동부)
  "kr-region-5":  {cx: 165, cy: 131}, // 광진구 (동부)
  "kr-region-6":  {cx: 158, cy: 126}, // 동대문구 (동북)
  "kr-region-7":  {cx: 165, cy: 124}, // 중랑구 (동북)
  "kr-region-8":  {cx: 152, cy: 123}, // 성북구 (북부)
  "kr-region-9":  {cx: 148, cy: 120}, // 강북구 (북부)
  "kr-region-10": {cx: 153, cy: 117}, // 도봉구 (최북)
  "kr-region-11": {cx: 161, cy: 118}, // 노원구 (북동)
  "kr-region-12": {cx: 140, cy: 121}, // 은평구 (서북)
  "kr-region-13": {cx: 143, cy: 127}, // 서대문구 (서중)
  "kr-region-14": {cx: 140, cy: 132}, // 마포구 (서부)
  "kr-region-15": {cx: 136, cy: 138}, // 양천구 (서남)
  "kr-region-16": {cx: 131, cy: 134}, // 강서구 (서쪽 끝)
  "kr-region-17": {cx: 137, cy: 141}, // 구로구 (서남)
  "kr-region-18": {cx: 141, cy: 145}, // 금천구 (서남)
  "kr-region-19": {cx: 143, cy: 136}, // 영등포구 (서남)
  "kr-region-20": {cx: 149, cy: 140}, // 동작구 (남부)
  "kr-region-21": {cx: 144, cy: 145}, // 관악구 (남부)
  "kr-region-22": {cx: 153, cy: 143}, // 서초구 (동남)
  "kr-region-23": {cx: 158, cy: 140}, // 강남구 (동남)
  "kr-region-24": {cx: 164, cy: 138}, // 송파구 (동남)
  "kr-region-25": {cx: 170, cy: 136}, // 강동구 (동쪽 끝)

  // ── 부산광역시 (16구/군) ───────────────────────────────
  "kr-region-26": {cx: 360, cy: 412}, // 중구
  "kr-region-27": {cx: 352, cy: 416}, // 서구
  "kr-region-28": {cx: 364, cy: 406}, // 동구
  "kr-region-29": {cx: 357, cy: 422}, // 영도구 (섬)
  "kr-region-30": {cx: 364, cy: 400}, // 부산진구
  "kr-region-31": {cx: 369, cy: 394}, // 동래구
  "kr-region-32": {cx: 372, cy: 416}, // 남구
  "kr-region-33": {cx: 355, cy: 390}, // 북구
  "kr-region-34": {cx: 382, cy: 400}, // 해운대구
  "kr-region-35": {cx: 345, cy: 415}, // 사하구
  "kr-region-36": {cx: 369, cy: 385}, // 금정구
  "kr-region-37": {cx: 338, cy: 393}, // 강서구
  "kr-region-38": {cx: 369, cy: 404}, // 연제구
  "kr-region-39": {cx: 378, cy: 410}, // 수영구
  "kr-region-40": {cx: 355, cy: 398}, // 사상구
  "kr-region-41": {cx: 393, cy: 382}, // 기장군

  // ── 대구광역시 (8구 1군) ──────────────────────────────
  "kr-region-42": {cx: 298, cy: 350}, // 중구
  "kr-region-43": {cx: 308, cy: 345}, // 동구 (팔공산)
  "kr-region-44": {cx: 290, cy: 350}, // 서구
  "kr-region-45": {cx: 297, cy: 360}, // 남구
  "kr-region-46": {cx: 298, cy: 340}, // 북구
  "kr-region-47": {cx: 307, cy: 358}, // 수성구
  "kr-region-48": {cx: 288, cy: 360}, // 달서구
  "kr-region-49": {cx: 277, cy: 368}, // 달성군
  "kr-region-50": {cx: 320, cy: 308}, // 군위군 (2023 대구 편입)

  // ── 인천광역시 (8구 2군) ──────────────────────────────
  "kr-region-51": {cx: 93,  cy: 136}, // 중구 (인천공항·영종도 포함)
  "kr-region-52": {cx: 110, cy: 135}, // 동구
  "kr-region-53": {cx: 113, cy: 141}, // 미추홀구
  "kr-region-54": {cx: 116, cy: 147}, // 연수구 (송도)
  "kr-region-55": {cx: 121, cy: 143}, // 남동구
  "kr-region-56": {cx: 118, cy: 133}, // 부평구
  "kr-region-57": {cx: 122, cy: 126}, // 계양구
  "kr-region-58": {cx: 108, cy: 127}, // 서구 (청라)
  "kr-region-59": {cx: 81,  cy: 109}, // 강화군 (섬)
  "kr-region-60": {cx: 58,  cy: 148}, // 옹진군 (서해 도서)

  // ── 광주광역시 (5구) ───────────────────────────────────
  "kr-region-61": {cx: 158, cy: 410}, // 동구
  "kr-region-62": {cx: 145, cy: 410}, // 서구
  "kr-region-63": {cx: 151, cy: 418}, // 남구
  "kr-region-64": {cx: 152, cy: 403}, // 북구
  "kr-region-65": {cx: 139, cy: 408}, // 광산구

  // ── 대전광역시 (5구) ───────────────────────────────────
  "kr-region-66": {cx: 206, cy: 270}, // 동구
  "kr-region-67": {cx: 197, cy: 280}, // 중구
  "kr-region-68": {cx: 192, cy: 270}, // 서구
  "kr-region-69": {cx: 192, cy: 262}, // 유성구 (카이스트·엑스포)
  "kr-region-70": {cx: 206, cy: 262}, // 대덕구

  // ── 울산광역시 (4구 1군) ──────────────────────────────
  "kr-region-71": {cx: 385, cy: 352}, // 중구 (태화강)
  "kr-region-72": {cx: 388, cy: 365}, // 남구 (장생포)
  "kr-region-73": {cx: 401, cy: 353}, // 동구 (조선소)
  "kr-region-74": {cx: 390, cy: 342}, // 북구 (자동차)
  "kr-region-75": {cx: 373, cy: 356}, // 울주군 (간절곶·영남알프스)

  // ── 세종특별자치시 (1) ────────────────────────────────
  "kr-region-76": {cx: 188, cy: 248}, // 세종시

  // ── 경기도 (28시 3군) ─────────────────────────────────
  "kr-region-77":  {cx: 148, cy: 158}, // 수원시 (화성)
  "kr-region-78":  {cx: 162, cy: 162}, // 용인시 (에버랜드)
  "kr-region-79":  {cx: 158, cy: 151}, // 성남시 (판교)
  "kr-region-80":  {cx: 135, cy: 112}, // 고양시 (일산)
  "kr-region-81":  {cx: 127, cy: 135}, // 부천시
  "kr-region-82":  {cx: 120, cy: 153}, // 안산시 (시화)
  "kr-region-83":  {cx: 144, cy: 148}, // 안양시
  "kr-region-84":  {cx: 175, cy: 128}, // 남양주시
  "kr-region-85":  {cx: 138, cy: 168}, // 화성시
  "kr-region-86":  {cx: 142, cy: 186}, // 평택시
  "kr-region-87":  {cx: 157, cy: 120}, // 의정부시
  "kr-region-88":  {cx: 122, cy: 145}, // 시흥시
  "kr-region-89":  {cx: 118, cy: 100}, // 파주시
  "kr-region-90":  {cx: 133, cy: 140}, // 광명시
  "kr-region-91":  {cx: 112, cy: 118}, // 김포시
  "kr-region-92":  {cx: 141, cy: 153}, // 군포시
  "kr-region-93":  {cx: 168, cy: 155}, // 광주시
  "kr-region-94":  {cx: 175, cy: 168}, // 이천시
  "kr-region-95":  {cx: 155, cy: 113}, // 양주시
  "kr-region-96":  {cx: 149, cy: 168}, // 오산시
  "kr-region-97":  {cx: 165, cy: 132}, // 구리시
  "kr-region-98":  {cx: 162, cy: 180}, // 안성시
  "kr-region-99":  {cx: 170, cy: 105}, // 포천시
  "kr-region-100": {cx: 145, cy: 152}, // 의왕시
  "kr-region-101": {cx: 168, cy: 141}, // 하남시
  "kr-region-102": {cx: 188, cy: 168}, // 여주시
  "kr-region-103": {cx: 185, cy: 150}, // 양평군
  "kr-region-104": {cx: 155, cy: 107}, // 동두천시
  "kr-region-105": {cx: 148, cy: 145}, // 과천시
  "kr-region-106": {cx: 196, cy: 115}, // 가평군
  "kr-region-107": {cx: 148, cy: 93},  // 연천군 (DMZ 인근)

  // ── 강원특별자치도 (7시 11군) ─────────────────────────
  "kr-region-108": {cx: 200, cy: 110}, // 춘천시
  "kr-region-109": {cx: 215, cy: 165}, // 원주시
  "kr-region-110": {cx: 295, cy: 120}, // 강릉시
  "kr-region-111": {cx: 308, cy: 153}, // 동해시
  "kr-region-112": {cx: 297, cy: 171}, // 태백시
  "kr-region-113": {cx: 278, cy: 73},  // 속초시
  "kr-region-114": {cx: 318, cy: 169}, // 삼척시
  "kr-region-115": {cx: 237, cy: 135}, // 홍천군
  "kr-region-116": {cx: 228, cy: 155}, // 횡성군
  "kr-region-117": {cx: 258, cy: 176}, // 영월군
  "kr-region-118": {cx: 255, cy: 155}, // 평창군 (올림픽)
  "kr-region-119": {cx: 276, cy: 165}, // 정선군
  "kr-region-120": {cx: 215, cy: 80},  // 철원군 (DMZ)
  "kr-region-121": {cx: 231, cy: 91},  // 화천군
  "kr-region-122": {cx: 249, cy: 96},  // 양구군
  "kr-region-123": {cx: 256, cy: 116}, // 인제군
  "kr-region-124": {cx: 270, cy: 68},  // 고성군 (금강산 인근)
  "kr-region-125": {cx: 287, cy: 100}, // 양양군 (낙산)

  // ── 충청북도 (3시 8군) ────────────────────────────────
  "kr-region-126": {cx: 220, cy: 257}, // 청주시
  "kr-region-127": {cx: 250, cy: 228}, // 충주시 (충주호)
  "kr-region-128": {cx: 273, cy: 218}, // 제천시
  "kr-region-129": {cx: 228, cy: 278}, // 보은군
  "kr-region-130": {cx: 215, cy: 287}, // 옥천군
  "kr-region-131": {cx: 225, cy: 299}, // 영동군
  "kr-region-132": {cx: 229, cy: 248}, // 증평군
  "kr-region-133": {cx: 213, cy: 240}, // 진천군
  "kr-region-134": {cx: 244, cy: 260}, // 괴산군
  "kr-region-135": {cx: 231, cy: 236}, // 음성군
  "kr-region-136": {cx: 271, cy: 205}, // 단양군

  // ── 충청남도 (8시 7군) ────────────────────────────────
  "kr-region-137": {cx: 180, cy: 215}, // 천안시
  "kr-region-138": {cx: 178, cy: 252}, // 공주시 (백제 고도)
  "kr-region-139": {cx: 130, cy: 280}, // 보령시 (머드축제)
  "kr-region-140": {cx: 168, cy: 213}, // 아산시 (현충사)
  "kr-region-141": {cx: 118, cy: 218}, // 서산시
  "kr-region-142": {cx: 170, cy: 278}, // 논산시 (훈련소)
  "kr-region-143": {cx: 182, cy: 273}, // 계룡시
  "kr-region-144": {cx: 133, cy: 207}, // 당진시
  "kr-region-145": {cx: 211, cy: 290}, // 금산군 (인삼)
  "kr-region-146": {cx: 155, cy: 272}, // 부여군 (백제 유적)
  "kr-region-147": {cx: 138, cy: 289}, // 서천군
  "kr-region-148": {cx: 152, cy: 262}, // 청양군 (칠갑산)
  "kr-region-149": {cx: 143, cy: 250}, // 홍성군
  "kr-region-150": {cx: 163, cy: 240}, // 예산군 (덕산)
  "kr-region-151": {cx: 104, cy: 232}, // 태안군 (반도)

  // ── 전북특별자치도 (6시 8군) ──────────────────────────
  "kr-region-152": {cx: 178, cy: 340}, // 전주시 (한옥마을)
  "kr-region-153": {cx: 147, cy: 320}, // 군산시 (근대역사)
  "kr-region-154": {cx: 163, cy: 318}, // 익산시 (미륵사지)
  "kr-region-155": {cx: 165, cy: 352}, // 정읍시 (내장산)
  "kr-region-156": {cx: 197, cy: 360}, // 남원시 (춘향전)
  "kr-region-157": {cx: 153, cy: 335}, // 김제시 (지평선)
  "kr-region-158": {cx: 190, cy: 340}, // 완주군
  "kr-region-159": {cx: 211, cy: 348}, // 진안군 (마이산)
  "kr-region-160": {cx: 219, cy: 325}, // 무주군 (반딧불)
  "kr-region-161": {cx: 213, cy: 361}, // 장수군
  "kr-region-162": {cx: 195, cy: 363}, // 임실군 (치즈)
  "kr-region-163": {cx: 185, cy: 372}, // 순창군 (고추장)
  "kr-region-164": {cx: 152, cy: 365}, // 고창군 (청보리)
  "kr-region-165": {cx: 138, cy: 345}, // 부안군 (변산)

  // ── 전라남도 (5시 17군) ───────────────────────────────
  "kr-region-166": {cx: 128, cy: 445}, // 목포시
  "kr-region-167": {cx: 191, cy: 465}, // 여수시 (엑스포)
  "kr-region-168": {cx: 183, cy: 455}, // 순천시 (순천만)
  "kr-region-169": {cx: 158, cy: 430}, // 나주시 (배)
  "kr-region-170": {cx: 201, cy: 453}, // 광양시 (제철)
  "kr-region-171": {cx: 173, cy: 420}, // 담양군 (대나무)
  "kr-region-172": {cx: 186, cy: 430}, // 곡성군 (기차마을)
  "kr-region-173": {cx: 201, cy: 438}, // 구례군 (지리산)
  "kr-region-174": {cx: 188, cy: 478}, // 고흥군 (나로도)
  "kr-region-175": {cx: 177, cy: 462}, // 보성군 (녹차)
  "kr-region-176": {cx: 170, cy: 438}, // 화순군 (운주사)
  "kr-region-177": {cx: 163, cy: 463}, // 장흥군
  "kr-region-178": {cx: 155, cy: 468}, // 강진군 (다산초당)
  "kr-region-179": {cx: 143, cy: 476}, // 해남군 (땅끝)
  "kr-region-180": {cx: 148, cy: 453}, // 영암군 (왕인)
  "kr-region-181": {cx: 133, cy: 437}, // 무안군 (공항)
  "kr-region-182": {cx: 143, cy: 430}, // 함평군 (나비)
  "kr-region-183": {cx: 131, cy: 418}, // 영광군 (굴비)
  "kr-region-184": {cx: 163, cy: 415}, // 장성군
  "kr-region-185": {cx: 153, cy: 494}, // 완도군
  "kr-region-186": {cx: 118, cy: 489}, // 진도군 (울돌목)
  "kr-region-187": {cx: 97,  cy: 460}, // 신안군 (천사섬)

  // ── 경상북도 (10시 13군) ──────────────────────────────
  "kr-region-188": {cx: 393, cy: 288}, // 포항시 (제철)
  "kr-region-189": {cx: 378, cy: 320}, // 경주시 (신라 고도)
  "kr-region-190": {cx: 280, cy: 305}, // 김천시
  "kr-region-191": {cx: 342, cy: 255}, // 안동시 (하회마을)
  "kr-region-192": {cx: 297, cy: 292}, // 구미시 (전자)
  "kr-region-193": {cx: 328, cy: 222}, // 영주시 (부석사)
  "kr-region-194": {cx: 362, cy: 305}, // 영천시
  "kr-region-195": {cx: 308, cy: 263}, // 상주시 (자전거)
  "kr-region-196": {cx: 292, cy: 248}, // 문경시 (새재)
  "kr-region-197": {cx: 352, cy: 325}, // 경산시
  "kr-region-198": {cx: 323, cy: 285}, // 군위군 (경북)
  "kr-region-199": {cx: 340, cy: 278}, // 의성군 (마늘·컬링)
  "kr-region-200": {cx: 366, cy: 252}, // 청송군 (주왕산)
  "kr-region-201": {cx: 379, cy: 228}, // 영양군
  "kr-region-202": {cx: 399, cy: 243}, // 영덕군 (대게)
  "kr-region-203": {cx: 348, cy: 335}, // 청도군 (소싸움)
  "kr-region-204": {cx: 305, cy: 330}, // 고령군 (가야)
  "kr-region-205": {cx: 295, cy: 315}, // 성주군 (참외)
  "kr-region-206": {cx: 308, cy: 312}, // 칠곡군
  "kr-region-207": {cx: 323, cy: 242}, // 예천군 (황목근)
  "kr-region-208": {cx: 352, cy: 218}, // 봉화군 (춘양목)
  "kr-region-209": {cx: 401, cy: 218}, // 울진군 (원전·대게)
  "kr-region-210": {cx: 487, cy: 185}, // 울릉군 (울릉도·독도)

  // ── 경상남도 (8시 10군) ──────────────────────────────
  "kr-region-211": {cx: 285, cy: 403}, // 창원시 (진해)
  "kr-region-212": {cx: 258, cy: 407}, // 진주시 (남강유등)
  "kr-region-213": {cx: 290, cy: 437}, // 통영시 (한려수도)
  "kr-region-214": {cx: 270, cy: 425}, // 사천시 (항공)
  "kr-region-215": {cx: 325, cy: 400}, // 김해시 (가야·공항)
  "kr-region-216": {cx: 340, cy: 383}, // 밀양시 (아리랑)
  "kr-region-217": {cx: 311, cy: 451}, // 거제시 (조선)
  "kr-region-218": {cx: 346, cy: 390}, // 양산시 (통도사)
  "kr-region-219": {cx: 292, cy: 388}, // 의령군
  "kr-region-220": {cx: 308, cy: 395}, // 함안군 (말이산)
  "kr-region-221": {cx: 322, cy: 378}, // 창녕군 (우포늪)
  "kr-region-222": {cx: 278, cy: 432}, // 고성군 (공룡)
  "kr-region-223": {cx: 258, cy: 447}, // 남해군
  "kr-region-224": {cx: 240, cy: 433}, // 하동군 (지리산·재첩)
  "kr-region-225": {cx: 252, cy: 418}, // 산청군 (한방)
  "kr-region-226": {cx: 238, cy: 403}, // 함양군 (상림)
  "kr-region-227": {cx: 253, cy: 390}, // 거창군
  "kr-region-228": {cx: 280, cy: 393}, // 합천군 (해인사)

  // ── 제주특별자치도 (2시) ─────────────────────────────
  "kr-region-229": {cx: 113, cy: 598}, // 제주시 (한라산 북)
  "kr-region-230": {cx: 121, cy: 620}, // 서귀포시 (한라산 남)
};


/**
 * 시·군·구 마커를 SVG에 동적으로 주입하는 유틸리티 함수
 * @param {SVGSVGElement} svgEl - 마커를 주입할 SVG 엘리먼트
 * @param {Object} [options]
 * @param {boolean} [options.hidden=false] - true이면 'hidden' 클래스를 붙여 감춤 (지도학습 모드용)
 * @returns {SVGGElement} 생성된 마커 그룹
 */
window.createKoreaSigunguMarkers = function(svgEl, options) {
  if (!svgEl || !window.KOREA_COORDS || !window.KOREA_DATA) return null;
  var hidden = options && options.hidden;
  var includeLabels = options && options.includeLabels;

  // 기존 동적 마커 그룹 제거 (중복 방지)
  var existing = svgEl.getElementById('dynamic-sigungu-markers');
  if (existing) existing.remove();

  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.id = 'dynamic-sigungu-markers';

  window.KOREA_DATA.forEach(function(item) {
    var coords = window.KOREA_COORDS[item.code];
    if (!coords) return;

    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', hidden ? 'kr-marker sigungu-marker hidden' : 'kr-marker sigungu-marker');
    circle.setAttribute('id', item.code);
    circle.setAttribute('data-code', item.code);
    circle.setAttribute('data-continent', item.continent);

    // 시도 path ID 연결
    var provId = (window.KOREA_PROVINCE_IDS || {})[item.continent];
    if (provId) circle.setAttribute('data-province', provId);

    circle.setAttribute('cx', coords.cx);
    circle.setAttribute('cy', coords.cy);
    circle.setAttribute('r', '4');

    group.appendChild(circle);

    if (includeLabels) {
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', hidden ? 'kr-label sigungu-label hidden' : 'kr-label sigungu-label');
      text.setAttribute('id', 'label-' + item.code);
      text.setAttribute('data-code', item.code);
      text.setAttribute('data-continent', item.continent);
      if (provId) text.setAttribute('data-province', provId);
      text.setAttribute('x', coords.cx);
      text.setAttribute('y', coords.cy - 6);
      text.textContent = item.name;
      group.appendChild(text);
    }
  });

  svgEl.appendChild(group);
  return group;
};

// 시도명 → SVG path ID 매핑 (map.js와 동기화)
window.KOREA_PROVINCE_IDS = {
  '서울특별시':    'seoul',
  '부산광역시':    'busan',
  '인천광역시':    'incheon',
  '대구광역시':    'daegu',
  '광주광역시':    'gwangju',
  '대전광역시':    'daejeon',
  '울산광역시':    'ulsan',
  '세종특별자치시':'sejong',
  '경기도':        'gyeonggi',
  '강원특별자치도':'gangwon',
  '충청북도':      'north-chungcheong',
  '충청남도':      'south-chungcheong',
  '전북특별자치도':'north-jeolla',
  '전라남도':      'south-jeolla',
  '경상북도':      'north-gyeongsang',
  '경상남도':      'south-gyeongsang',
  '제주특별자치도':'jeju'
};
