"""
한국 행정구역 GeoJSON → 시·도별 SVG path 변환기
사용법: python convert_geojson_to_svg.py
출력: js/korea-province-maps.js
"""

import json
import math
import os
import urllib.request

# ──────────────────────────────────────────────
# 1. GeoJSON 데이터 다운로드 (southkorea-maps)
# ──────────────────────────────────────────────
SIGUNGU_URL = "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-submunicipalities-geo.json"

def download_geojson(url, filename):
    if os.path.exists(filename):
        print(f"[캐시] {filename} 이미 존재")
        return
    print(f"[다운로드] {url}")
    with urllib.request.urlopen(url, timeout=30) as response:
        data = response.read().decode('utf-8')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(data)
    print(f"[완료] {filename} 저장됨")

# ──────────────────────────────────────────────
# 2. 좌표 변환 유틸
# ──────────────────────────────────────────────
def lng_lat_to_xy(lng, lat, min_lng, max_lng, min_lat, max_lat, svg_w, svg_h, padding=20):
    """
    WGS84 경위도 → SVG 픽셀 좌표
    위도는 위에서 아래 방향으로 증가하도록 Y축 반전
    """
    usable_w = svg_w - 2 * padding
    usable_h = svg_h - 2 * padding
    
    lng_range = max_lng - min_lng
    lat_range = max_lat - min_lat
    
    if lng_range == 0 or lat_range == 0:
        return padding, padding
    
    x = padding + (lng - min_lng) / lng_range * usable_w
    # 위도는 북쪽이 위이므로 Y축 반전
    y = padding + (max_lat - lat) / lat_range * usable_h
    return round(x, 2), round(y, 2)

def polygon_to_path_d(coordinates, min_lng, max_lng, min_lat, max_lat, svg_w, svg_h, padding):
    """폴리곤 좌표 배열 → SVG path d 문자열"""
    parts = []
    for ring in coordinates:
        if not ring:
            continue
        pts = []
        for coord in ring:
            lng, lat = coord[0], coord[1]
            x, y = lng_lat_to_xy(lng, lat, min_lng, max_lng, min_lat, max_lat, svg_w, svg_h, padding)
            pts.append(f"{x},{y}")
        if pts:
            parts.append("M" + " L".join(pts) + " Z")
    return " ".join(parts)

def multipolygon_to_path_d(coordinates, min_lng, max_lng, min_lat, max_lat, svg_w, svg_h, padding):
    """멀티폴리곤 → SVG path d 문자열"""
    parts = []
    for polygon in coordinates:
        parts.append(polygon_to_path_d(polygon, min_lng, max_lng, min_lat, max_lat, svg_w, svg_h, padding))
    return " ".join(parts)

# ──────────────────────────────────────────────
# 3. 시도 코드 → SVG ID 매핑
# ──────────────────────────────────────────────
PROVINCE_CODE_TO_ID = {
    '11': 'seoul',
    '21': 'busan',
    '22': 'daegu',
    '23': 'incheon',
    '24': 'gwangju',
    '25': 'daejeon',
    '26': 'ulsan',
    '29': 'sejong',
    '31': 'gyeonggi',
    '32': 'gangwon',
    '33': 'north-chungcheong',
    '34': 'south-chungcheong',
    '35': 'north-jeolla',
    '36': 'south-jeolla',
    '37': 'north-gyeongsang',
    '38': 'south-gyeongsang',
    '39': 'jeju',
}

PROVINCE_ID_TO_KR = {
    'seoul': '서울특별시',
    'busan': '부산광역시',
    'daegu': '대구광역시',
    'incheon': '인천광역시',
    'gwangju': '광주광역시',
    'daejeon': '대전광역시',
    'ulsan': '울산광역시',
    'sejong': '세종특별자치시',
    'gyeonggi': '경기도',
    'gangwon': '강원특별자치도',
    'north-chungcheong': '충청북도',
    'south-chungcheong': '충청남도',
    'north-jeolla': '전북특별자치도',
    'south-jeolla': '전라남도',
    'north-gyeongsang': '경상북도',
    'south-gyeongsang': '경상남도',
    'jeju': '제주특별자치도',
}

# ──────────────────────────────────────────────
# 4. kr-region 코드 매핑 (korea-data.js와 동기화)
# ──────────────────────────────────────────────
# GeoJSON의 행정구역명(ADM_NM) → kr-region 코드 매핑
# 이 매핑은 korea-data.js의 name 필드와 일치해야 함
def build_name_to_code_map():
    """
    korea-data.js 파일에서 name → code 매핑 생성
    """
    data_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'korea-data.js')
    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    name_to_code = {}
    import re
    # { code: "kr-region-N", name: "XXX", ... } 패턴 파싱
    pattern = r'\{\s*code:\s*["\']([^"\']+)["\'],\s*name:\s*["\']([^"\']+)["\']'
    for match in re.finditer(pattern, content):
        code = match.group(1)
        name = match.group(2)
        name_to_code[name] = code
    
    print(f"[정보] korea-data.js에서 {len(name_to_code)}개 항목 로드")
    return name_to_code

# ──────────────────────────────────────────────
# 5. 메인 변환 함수
# ──────────────────────────────────────────────
SVG_W = 600
SVG_H = 500
PADDING = 20

def convert():
    os.makedirs("cache", exist_ok=True)
    cache_file = "cache/sigungu.json"
    download_geojson(SIGUNGU_URL, cache_file)
    
    with open(cache_file, 'r', encoding='utf-8') as f:
        geojson = json.load(f)
    
    name_to_code = build_name_to_code_map()
    
    # 시도별로 feature 그룹화
    provinces = {}  # province_id → list of features
    
    for feature in geojson['features']:
        props = feature.get('properties', {})
        # southkorea-maps의 속성 키
        # 가능한 속성: CTP_KOR_NM, SIG_KOR_NM, SIG_CD, CTP_RVN_CD 등
        
        # 시도 코드 추출 (CTP_RVN_CD 혹은 SIG_CD 앞 2자리)
        sig_cd = props.get('SIG_CD') or props.get('sig_cd') or ''
        ctp_cd = props.get('CTP_RVN_CD') or props.get('ctp_rvn_cd') or ''
        
        if sig_cd:
            prov_code = str(sig_cd)[:2]
        elif ctp_cd:
            prov_code = str(ctp_cd)[:2]
        else:
            # 속성명 출력하여 디버깅
            if not hasattr(convert, '_printed_props'):
                convert._printed_props = True
                print(f"[디버그] 첫 번째 feature 속성: {list(props.keys())}")
                print(f"[디버그] 첫 번째 feature 속성값: {props}")
            continue
        
        prov_id = PROVINCE_CODE_TO_ID.get(prov_code)
        if not prov_id:
            continue
        
        if prov_id not in provinces:
            provinces[prov_id] = []
        provinces[prov_id].append(feature)
    
    print(f"\n[결과] {len(provinces)}개 시도 그룹 생성:")
    for pid, feats in provinces.items():
        print(f"  {pid}: {len(feats)}개 시군구")
    
    # 시도별 SVG 생성
    province_maps = {}
    
    for prov_id, features in provinces.items():
        # 시도 전체의 경계 범위 계산
        all_lngs = []
        all_lats = []
        
        for feat in features:
            geom = feat['geometry']
            coords_list = []
            
            if geom['type'] == 'Polygon':
                for ring in geom['coordinates']:
                    coords_list.extend(ring)
            elif geom['type'] == 'MultiPolygon':
                for poly in geom['coordinates']:
                    for ring in poly:
                        coords_list.extend(ring)
            
            for coord in coords_list:
                all_lngs.append(coord[0])
                all_lats.append(coord[1])
        
        if not all_lngs:
            continue
        
        min_lng = min(all_lngs)
        max_lng = max(all_lngs)
        min_lat = min(all_lats)
        max_lat = max(all_lats)
        
        # 비율 유지하여 SVG 크기 조정
        lng_range = max_lng - min_lng
        lat_range = max_lat - min_lat
        
        if lng_range == 0 or lat_range == 0:
            svg_w, svg_h = SVG_W, SVG_H
        else:
            aspect = lng_range / lat_range
            if aspect > SVG_W / SVG_H:
                svg_w = SVG_W
                svg_h = round(SVG_W / aspect)
            else:
                svg_h = SVG_H
                svg_w = round(SVG_H * aspect)
        
        # 최소 크기 보장
        svg_w = max(svg_w, 300)
        svg_h = max(svg_h, 300)
        
        paths_data = []
        
        for feat in features:
            props = feat['properties']
            geom = feat['geometry']
            
            # 구역 이름 추출
            name = (
                props.get('SIG_KOR_NM') or
                props.get('sig_kor_nm') or
                props.get('ADM_NM') or
                props.get('adm_nm') or
                ''
            )
            
            if not name:
                continue
            
            # kr-region 코드 조회
            code = name_to_code.get(name)
            if not code:
                # 부분 매칭 시도
                for data_name, data_code in name_to_code.items():
                    if name in data_name or data_name in name:
                        code = data_code
                        break
            
            if not code:
                print(f"  [경고] 코드 없음: {name} ({prov_id})")
                code = f"unknown-{name}"
            
            # SVG path 생성
            if geom['type'] == 'Polygon':
                d = polygon_to_path_d(
                    geom['coordinates'],
                    min_lng, max_lng, min_lat, max_lat,
                    svg_w, svg_h, PADDING
                )
            elif geom['type'] == 'MultiPolygon':
                d = multipolygon_to_path_d(
                    geom['coordinates'],
                    min_lng, max_lng, min_lat, max_lat,
                    svg_w, svg_h, PADDING
                )
            else:
                continue
            
            # 라벨 중심점 계산 (bounding box 중앙)
            feat_lngs = []
            feat_lats = []
            if geom['type'] == 'Polygon':
                for coord in geom['coordinates'][0]:
                    feat_lngs.append(coord[0])
                    feat_lats.append(coord[1])
            elif geom['type'] == 'MultiPolygon':
                largest = max(geom['coordinates'], key=lambda p: len(p[0]))
                for coord in largest[0]:
                    feat_lngs.append(coord[0])
                    feat_lats.append(coord[1])
            
            if feat_lngs:
                center_lng = (min(feat_lngs) + max(feat_lngs)) / 2
                center_lat = (min(feat_lats) + max(feat_lats)) / 2
                cx, cy = lng_lat_to_xy(
                    center_lng, center_lat,
                    min_lng, max_lng, min_lat, max_lat,
                    svg_w, svg_h, PADDING
                )
            else:
                cx, cy = svg_w / 2, svg_h / 2
            
            paths_data.append({
                'code': code,
                'name': name,
                'd': d,
                'cx': cx,
                'cy': cy
            })
        
        province_maps[prov_id] = {
            'viewBox': f"0 0 {svg_w} {svg_h}",
            'paths': paths_data
        }
        print(f"  [{prov_id}] {len(paths_data)}개 경계 path 생성 (SVG: {svg_w}x{svg_h})")
    
    # JS 파일 출력
    output_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'korea-province-maps.js')
    
    lines = ['// 한국 시·도별 시·군·구 경계 SVG path 데이터']
    lines.append('// 자동 생성: convert_geojson_to_svg.py')
    lines.append('// 데이터 출처: southkorea/southkorea-maps (공개 데이터)')
    lines.append('')
    lines.append('window.KOREA_PROVINCE_MAPS = {')
    
    for prov_id, data in province_maps.items():
        kr_name = PROVINCE_ID_TO_KR.get(prov_id, prov_id)
        lines.append(f'  // {kr_name}')
        lines.append(f'  {json.dumps(prov_id)}: {{')
        lines.append(f'    viewBox: {json.dumps(data["viewBox"])},')
        lines.append(f'    paths: [')
        
        for p in data['paths']:
            escaped_d = p['d'].replace('\\', '\\\\')
            lines.append(f'      {{code:{json.dumps(p["code"])}, name:{json.dumps(p["name"])}, cx:{p["cx"]}, cy:{p["cy"]}, d:{json.dumps(escaped_d)}}},')
        
        lines.append(f'    ]')
        lines.append(f'  }},')
    
    lines.append('};')
    lines.append('')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    size_kb = os.path.getsize(output_path) / 1024
    print(f'\n[완료] {output_path} 생성됨 ({size_kb:.1f} KB)')
    print(f'총 {sum(len(d["paths"]) for d in province_maps.values())}개 시군구 경계 포함')

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    convert()
