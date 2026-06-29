const fs = require('fs');
const path = require('path');
const https = require('https');

const SIGUNGU_URL = "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-municipalities-2018-geo.json";

const PROVINCE_CODE_TO_ID = {
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
};

const PROVINCE_ID_TO_KR = {
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
};

function downloadGeoJSON(url) {
  return new Promise((resolve, reject) => {
    console.log(`[다운로드] ${url}`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(JSON.parse(data)); });
    }).on('error', (err) => { reject(err); });
  });
}

function buildNameToCodeMap() {
  const dataPath = path.join(__dirname, '..', 'js', 'korea-data.js');
  const content = fs.readFileSync(dataPath, 'utf-8');
  const nameToCode = {};
  
  // { code: "kr-region-N", name: "XXX", ... }
  const pattern = /\{\s*code:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["']/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const code = match[1];
    const name = match[2];
    nameToCode[name] = code;
  }
  
  console.log(`[정보] korea-data.js에서 ${Object.keys(nameToCode).length}개 항목 로드`);
  return nameToCode;
}

function lngLatToXy(lng, lat, minLng, maxLng, minLat, maxLat, svgW, svgH, padding = 20) {
  const usableW = svgW - 2 * padding;
  const usableH = svgH - 2 * padding;
  
  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;
  
  if (lngRange === 0 || latRange === 0) {
    return [padding, padding];
  }
  
  const x = padding + ((lng - minLng) / lngRange) * usableW;
  const y = padding + ((maxLat - lat) / latRange) * usableH;
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}

function polygonToPathD(coordinates, minLng, maxLng, minLat, maxLat, svgW, svgH, padding) {
  const parts = [];
  for (const ring of coordinates) {
    if (!ring || ring.length === 0) continue;
    const pts = [];
    for (const coord of ring) {
      const [lng, lat] = coord;
      const [x, y] = lngLatToXy(lng, lat, minLng, maxLng, minLat, maxLat, svgW, svgH, padding);
      pts.push(`${x},${y}`);
    }
    if (pts.length > 0) {
      parts.push("M" + pts.join(" L") + " Z");
    }
  }
  return parts.join(" ");
}

function multiPolygonToPathD(coordinates, minLng, maxLng, minLat, maxLat, svgW, svgH, padding) {
  const parts = [];
  for (const polygon of coordinates) {
    parts.push(polygonToPathD(polygon, minLng, maxLng, minLat, maxLat, svgW, svgH, padding));
  }
  return parts.join(" ");
}

async function convert() {
  try {
    const geojson = await downloadGeoJSON(SIGUNGU_URL);
    const nameToCode = buildNameToCodeMap();
    
    const provinces = {};
    
    for (const feature of geojson.features) {
      const props = feature.properties || {};
      const sigCd = props.SIG_CD || props.sig_cd || props.code || '';
      
      let provCode = '';
      if (sigCd) {
        provCode = String(sigCd).slice(0, 2);
      } else {
        continue;
      }
      
      const provId = PROVINCE_CODE_TO_ID[provCode];
      if (!provId) continue;
      
      if (!provinces[provId]) {
        provinces[provId] = [];
      }
      provinces[provId].push(feature);
    }
    
    console.log(`\n[결과] ${Object.keys(provinces).length}개 시도 그룹 생성:`);
    for (const [pid, feats] of Object.entries(provinces)) {
      console.log(`  ${pid}: ${feats.length}개 시군구`);
    }
    
    const SVG_W = 600;
    const SVG_H = 500;
    const PADDING = 20;
    
    const provinceMaps = {};
    
    for (const [provId, features] of Object.entries(provinces)) {
      const allLngs = [];
      const allLats = [];
      
      for (const feat of features) {
        const geom = feat.geometry;
        const coordsList = [];
        
        if (geom.type === 'Polygon') {
          for (const ring of geom.coordinates) {
            coordsList.push(...ring);
          }
        } else if (geom.type === 'MultiPolygon') {
          for (const poly of geom.coordinates) {
            for (const ring of poly) {
              coordsList.push(...ring);
            }
          }
        }
        
        for (const coord of coordsList) {
          allLngs.push(coord[0]);
          allLats.push(coord[1]);
        }
      }
      
      if (allLngs.length === 0) continue;
      let minLng = Infinity;
      let maxLng = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;
      for (let i = 0; i < allLngs.length; i++) {
        const lng = allLngs[i];
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      }
      for (let i = 0; i < allLats.length; i++) {
        const lat = allLats[i];
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      
      const lngRange = maxLng - minLng;
      const latRange = maxLat - minLat;
      
      let svgW = SVG_W;
      let svgH = SVG_H;
      
      if (lngRange !== 0 && latRange !== 0) {
        const aspect = lngRange / latRange;
        if (aspect > SVG_W / SVG_H) {
          svgW = SVG_W;
          svgH = Math.round(SVG_W / aspect);
        } else {
          svgH = SVG_H;
          svgW = Math.round(SVG_H * aspect);
        }
      }
      
      svgW = Math.max(svgW, 300);
      svgH = Math.max(svgH, 300);
      
      const pathsData = [];
      
      for (const feat of features) {
        const props = feat.properties || {};
        const geom = feat.geometry;
        
        let name = props.SIG_KOR_NM || props.sig_kor_nm || props.ADM_NM || props.adm_nm || props.name || '';
        if (!name) continue;
        
        let code = nameToCode[name];
        if (!code) {
          for (const [dataName, dataCode] of Object.entries(nameToCode)) {
            if (name.includes(dataName) || dataName.includes(name)) {
              code = dataCode;
              break;
            }
          }
        }
        
        if (!code) {
          console.log(`  [경고] 코드 없음: ${name} (${provId})`);
          code = `unknown-${name}`;
        }
        
        let d = '';
        if (geom.type === 'Polygon') {
          d = polygonToPathD(geom.coordinates, minLng, maxLng, minLat, maxLat, svgW, svgH, PADDING);
        } else if (geom.type === 'MultiPolygon') {
          d = multiPolygonToPathD(geom.coordinates, minLng, maxLng, minLat, maxLat, svgW, svgH, PADDING);
        } else {
          continue;
        }
        
        // centroid/center calculations
        let featLngs = [];
        let featLats = [];
        if (geom.type === 'Polygon') {
          for (const coord of geom.coordinates[0]) {
            featLngs.push(coord[0]);
            featLats.push(coord[1]);
          }
        } else if (geom.type === 'MultiPolygon') {
          let largest = geom.coordinates[0];
          for (const poly of geom.coordinates) {
            if (poly[0].length > largest[0].length) {
              largest = poly;
            }
          }
          for (const coord of largest[0]) {
            featLngs.push(coord[0]);
            featLats.push(coord[1]);
          }
        }
        
        let cx = svgW / 2;
        let cy = svgH / 2;
        if (featLngs.length > 0) {
          const centerLng = (Math.min(...featLngs) + Math.max(...featLngs)) / 2;
          const centerLat = (Math.min(...featLats) + Math.max(...featLats)) / 2;
          const [tcx, tcy] = lngLatToXy(centerLng, centerLat, minLng, maxLng, minLat, maxLat, svgW, svgH, PADDING);
          cx = tcx;
          cy = tcy;
        }
        
        pathsData.push({
          code,
          name,
          d,
          cx,
          cy
        });
      }
      
      provinceMaps[provId] = {
        viewBox: `0 0 ${svgW} ${svgH}`,
        paths: pathsData
      };
      console.log(`  [${provId}] ${pathsData.length}개 경계 path 생성 (SVG: ${svgW}x${svgH})`);
    }
    
    const outputPath = path.join(__dirname, '..', 'js', 'korea-province-maps.js');
    const lines = [
      '// 한국 시·도별 시·군·구 경계 SVG path 데이터',
      '// 자동 생성: convert_geojson_to_svg.js',
      '// 데이터 출처: southkorea/southkorea-maps (공개 데이터)',
      '',
      'window.KOREA_PROVINCE_MAPS = {'
    ];
    
    for (const [provId, data] of Object.entries(provinceMaps)) {
      const krName = PROVINCE_ID_TO_KR[provId] || provId;
      lines.push(`  // ${krName}`);
      lines.push(`  ${JSON.stringify(provId)}: {`);
      lines.push(`    viewBox: ${JSON.stringify(data.viewBox)},`);
      lines.push(`    paths: [`);
      
      for (const p of data.paths) {
        const escapedD = p.d.replace(/\\/g, '\\\\');
        lines.push(`      {code:${JSON.stringify(p.code)}, name:${JSON.stringify(p.name)}, cx:${p.cx}, cy:${p.cy}, d:${JSON.stringify(escapedD)}},`);
      }
      
      lines.push(`    ]`);
      lines.push(`  },`);
    }
    
    lines.push('};');
    lines.push('');
    
    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
    const sizeKb = fs.statSync(outputPath).size / 1024;
    console.log(`\n[완료] ${outputPath} 생성됨 (${sizeKb.toFixed(1)} KB)`);
    
  } catch (err) {
    console.error(err);
  }
}

convert();
