// 180곡의 세계 명곡 클래식 학습용 전체 데이터셋 (3개씩 60그룹으로 자동 분할)
(function() {
  const CLASSIC_DATA = [
  {
    "id": 1,
    "group": 1,
    "title": "캐논 (Canon in D)",
    "composer": "파헬벨",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Johann_Pachelbel_-_Canon_in_D_major.ogg",
    "trivia": "세 개의 바이올린과 저음 반주를 위해 작곡된 곡으로, 단순하면서도 아름다운 8마디의 베이스 화음 선율이 끊임없이 반복되며 깊은 감동을 줍니다."
  },
  {
    "id": 2,
    "group": 1,
    "title": "G선상의 아리아",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Air_on_the_G_String_by_Bach_violin_synthesizer.ogg",
    "trivia": "원래 바흐의 관현악 모음곡 제3번의 일부였으나, 바이올린의 가장 낮고 깊은 소리가 나는 G선 하나만으로 연주할 수 있도록 편곡되어 큰 사랑을 받고 있습니다."
  },
  {
    "id": 3,
    "group": 1,
    "title": "토카타와 푸가 D단조",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Toccata_et_Fuga_d-Moll_BWV_565.ogg",
    "trivia": "웅장한 파이프오르간 소리로 시작하는 도입부가 매우 강렬하며, 유령이나 긴장감 넘치는 공포 분위기의 대명사로 대중매체에서 자주 쓰이는 걸작입니다."
  },
  {
    "id": 4,
    "group": 2,
    "title": "미뉴에트 G장조",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/J.S.Bach_Minuet_in_G.ogg",
    "trivia": "바흐가 그의 사랑하는 아내 안나 막달레나를 위해 엮은 음악 수첩에 들어있는 곡으로, 3박자의 우아하고 정겨운 무도곡 선율이 특징입니다."
  },
  {
    "id": 5,
    "group": 2,
    "title": "무반주 첼로 모음곡 1번 전주곡",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Johann_Sebastian_Bach_-_Cello_Suite_No._1_in_G_major_-_BWV_1007_-_I._Pr%C3%A9lude.ogg",
    "trivia": "반주 없이 오직 첼로 한 대만으로 연주되는 음악으로, 물 흐르듯 잔잔하게 시작하여 첼로가 가진 목가적이고 따뜻한 매력을 극한으로 보여줍니다."
  },
  {
    "id": 6,
    "group": 2,
    "title": "사계 중 '봄' 1악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_1_Spring_Allegro.ogg",
    "trivia": "겨울이 지나고 새들이 노래하며 시냇물이 졸졸 흐르는 따스한 봄날의 활기찬 풍경을 묘사한, 전 세계에서 가장 유명한 바이올린 협주곡입니다."
  },
  {
    "id": 7,
    "group": 3,
    "title": "사계 중 '여름' 3악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_2_Summer_Presto.ogg",
    "trivia": "여름철 갑작스럽게 몰아치는 격렬한 천둥번개와 세찬 폭풍우의 기세를 바이올린의 매우 빠르고 긴박한 연주 기법으로 리얼하게 묘사했습니다."
  },
  {
    "id": 8,
    "group": 3,
    "title": "사계 중 '가을' 1악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_3_Autumn_Allegro.ogg",
    "trivia": "풍성한 수확을 마친 농부들이 기쁨에 넘쳐 춤을 추고 노래하며, 술잔을 나누는 흥겨운 가을 축제의 모습을 경쾌하게 묘사한 곡입니다."
  },
  {
    "id": 9,
    "group": 3,
    "title": "사계 중 '겨울' 1악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/ff/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_4_Winter_Allegro_Non_Molto.ogg",
    "trivia": "차가운 겨울바람에 몸을 오들오들 떨고 세차게 발을 구르며, 얼음 위를 미끄러지듯 조심조심 걸어가는 추운 겨울날의 정취를 긴장감 있게 표현했습니다."
  },
  {
    "id": 10,
    "group": 4,
    "title": "메시아 중 '할렐루야'",
    "composer": "헨델",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Georg_Friedrich_H%C3%A4ndel_-_Messiah_-_Part_II_-_44_Hallelujah.ogg",
    "trivia": "오라토리오 '메시아'의 가장 유명한 합창곡으로, 영국의 국왕 조지 2세가 감동하여 자리에서 일어선 유래에 따라 오늘날에도 청중이 기립하는 전통이 있습니다."
  },
  {
    "id": 11,
    "group": 4,
    "title": "터키 행진곡",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Mozart_-_Rondo_alla_Turca.ogg",
    "trivia": "당시 유럽에서 유행하던 터키 군악대의 타악기 리듬과 스타일을 피아노 소리로 경쾌하고 이국적으로 표현하여 오늘날 대중에게 매우 친숙한 곡입니다."
  },
  {
    "id": 12,
    "group": 4,
    "title": "아이네 클라이네 나흐트무지크 1악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/24/Wolfgang_Amadeus_Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
    "trivia": "'소야곡(작은 밤의 음악)'이라는 뜻을 가진 현악 합주곡으로, 밝고 우아하며 활기찬 멜로디가 넘쳐흘러 귀빈들의 야외 파티나 축제 음악으로 널리 사랑받았습니다."
  },
  {
    "id": 13,
    "group": 5,
    "title": "교향곡 40번 G단조 1악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Wolfgang_Amadeus_Mozart_-_Sinfonie_40_g-moll_-_1._Molto_allegro.ogg",
    "trivia": "모차르트가 남긴 단 두 개의 단조 교향곡 중 하나로, 한숨을 쉬는 듯한 서글프면서도 아름다운 질주 선율이 듣는 이의 마음을 단숨에 사로잡습니다."
  },
  {
    "id": 14,
    "group": 5,
    "title": "피가로의 결혼 서곡",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Mozart_-_Overture_to_the_Marriage_of_Figaro.ogg",
    "trivia": "오페라 공연이 시작되기 전에 흥을 돋우는 서곡으로, 단 한 순간도 쉬지 않고 속삭이듯 쉴 새 없이 몰아치는 유쾌하고 분주한 악기들의 연주가 압권입니다."
  },
  {
    "id": 15,
    "group": 5,
    "title": "반짝반짝 작은 별 변주곡",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Twelve_Variations_on_%22Ah_vous_dirai-je%2C_Maman%22.ogg",
    "trivia": "프랑스의 대중 전래 민요인 '아! 어머니께 말씀드릴게요' 테마에 모차르트 특유의 화려하고 천재적인 12가지 변주 기법을 덧붙인 사랑스러운 피아노곡입니다."
  },
  {
    "id": 16,
    "group": 6,
    "title": "교향곡 94번 '놀람' 2악장",
    "composer": "하이든",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Haydn_-_Symphony_No._94_%28Surprise%29_-_II.ogg",
    "trivia": "평화롭고 아주 조용하게 연주가 진행되다가, 갑자기 모든 악기가 큰 타악기 소리와 함께 쾅! 하고 울려 음악회에서 졸던 관객들을 깜짝 놀라게 한 유머러스한 곡입니다."
  },
  {
    "id": 17,
    "group": 6,
    "title": "교향곡 101번 '시계' 2악장",
    "composer": "하이든",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Haydn_-_Symphony_No._101_%28Clock%29_-_II.ogg",
    "trivia": "바순과 현악기들이 일정한 간격으로 '똑딱똑딱' 소리를 내며 기계 시계가 작동하는 초침 소리를 절묘하게 묘사하여 '시계'라는 별명이 붙었습니다."
  },
  {
    "id": 18,
    "group": 6,
    "title": "트럼펫 협주곡 E플랫 장조 3악장",
    "composer": "하이든",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Haydn_trumpet_concerto_mvt3.ogg",
    "trivia": "트럼펫의 화려하고 청아한 독주 기교가 폭발하는 곡으로, 한국에서는 과거 인기 예능 프로그램 '장학퀴즈'의 오프닝 시그널 음악으로 온 국민에게 익숙합니다."
  },
  {
    "id": 19,
    "group": 7,
    "title": "보케리니 미뉴에트",
    "composer": "보케리니",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Boccherini_-_Minuet.ogg",
    "trivia": "귀족들이 가발을 쓰고 궁정에서 사뿐사뿐 춤을 추는 듯한 기품 있고 섬세한 선율을 가진 곡으로, 현악 5중주 특유의 아기자기한 현악 울림이 특징입니다."
  },
  {
    "id": 20,
    "group": 7,
    "title": "정령들의 춤 (멜로디)",
    "composer": "글루크",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Gluck_Orfeo_melodie.ogg",
    "trivia": "오페라 '오르페오와 에우리디체' 중 그리스 신화 속 축복받은 사후세계인 에리시온 평원에서 정령들이 평화롭게 춤추는 슬프고도 고결한 플루트 멜로디입니다."
  },
  {
    "id": 21,
    "group": 7,
    "title": "운명 교향곡 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Ludwig_van_Beethoven_-_Sinfonia_N._5_in_do_minore_Op._67_-_I._Allegro_con_brio.mp3",
    "trivia": "'빠바바밤~' 하고 운명이 문을 두드리는 강렬한 4음 모티브로 시작하여, 청각을 잃어가던 베토벤이 운명의 가혹함에 맞서 불굴의 의지로 극복해 나가는 삶을 그렸습니다."
  },
  {
    "id": 22,
    "group": 8,
    "title": "엘리제를 위하여",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ludwig_van_Beethoven_-_Bagatelle_No._25_in_A_minor_-_%22F%C3%BCr_Elise%22.ogg",
    "trivia": "전 세계의 전자 피아노나 후진 경보음 등 일상 속에서 가장 흔히 들을 수 있는 소곡으로, 베토벤이 짝사랑했던 여인인 '테레제'의 악필을 잘못 읽어 '엘리제'가 되었다는 설이 유력합니다."
  },
  {
    "id": 23,
    "group": 8,
    "title": "월광 소나타 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/03/Ludwig_van_Beethoven_-_Sonata_No._14_in_C_sharp_minor_-_Op._27_No._2_-_I._Adagio_sostenuto.ogg",
    "trivia": "고요하고 신비로운 피아노 음들이 잔잔히 흐르며, 마치 한밤중 루체른 호수 위에 은은하게 부서져 내리는 차가운 달빛의 흔들림을 묘사하는 듯한 명곡입니다."
  },
  {
    "id": 24,
    "group": 8,
    "title": "비창 소나타 2악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Beethoven_Pathetique_2nd_Mvt.ogg",
    "trivia": "비장하고 서글픈 감정이 기저에 깔려있으면서도, 한편으로는 세상에서 가장 아늑하고 따뜻하게 마음을 어루만져 주는 듯한 깊은 위로의 멜로디가 펼쳐집니다."
  },
  {
    "id": 25,
    "group": 9,
    "title": "합창 교향곡 4악장 '환희의 송가'",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Ludwig_van_Beethoven_-_Symphony_No._9_in_D_minor_Op._125_-_IV._Presto_-_Choral.ogg",
    "trivia": "인류 역사상 최초로 교향곡에 사람의 목소리(성악 합창)를 도입한 대혁신적 걸작으로, 오늘날 전 인류의 평화와 우애, 화합을 상징하는 전 세계적 노래입니다."
  },
  {
    "id": 26,
    "group": 9,
    "title": "영웅 교향곡 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Beethoven_Symphony_3_Mvt_1_Part_1.ogg",
    "trivia": "원래 베토벤이 나폴레옹을 기리기 위해 헌정하려 했으나, 나폴레옹이 스스로 황제에 즉위했다는 소식을 듣고 분노하여 악보 표지를 찢어버렸다는 웅장한 역사적 비화가 있습니다."
  },
  {
    "id": 27,
    "group": 9,
    "title": "전원 교향곡 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Beethoven_-_Symphony_6_-_I._Allegro_ma_non_troppo.ogg",
    "trivia": "시끄러운 도시를 벗어나 맑은 공기와 새들의 노랫소리, 목가적이고 평화로운 시골 벌판에 도착했을 때 느끼는 인간의 순수한 기쁨을 소리로 그려낸 자연 예찬곡입니다."
  },
  {
    "id": 28,
    "group": 10,
    "title": "베토벤 미뉴에트 G장조",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Beethoven_-_Minuet_in_G.ogg",
    "trivia": "베토벤이 젊은 시절 작곡한 바이올린과 피아노 소품으로, 고전적인 절제미 속에 친근하고 달콤한 사랑의 대화가 오가는 듯한 경쾌함이 흐릅니다."
  },
  {
    "id": 29,
    "group": 10,
    "title": "소나티네 Op. 36 No. 1 1악장",
    "composer": "클레멘티",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Clementi_Sonatina_36_1_1st_mvt.ogg",
    "trivia": "피아노 기초 체르니 단계에서 무조건 거쳐 가는 연습곡으로, 피아노의 맑은 터치감과 또랑또랑한 고전적 화성 진행을 배우기 아주 좋은 교과서 단골 곡입니다."
  },
  {
    "id": 30,
    "group": 10,
    "title": "레퀴엠 중 '라크리모사'",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Mozart_Requiem_Lacrimosa.ogg",
    "trivia": "'눈물의 날'이라는 뜻의 가사로, 모차르트가 이 곡의 8마디째를 쓰다가 미완성으로 눈을 감아 그의 장례식에서 연주되었던 세상에서 가장 슬프고 극적인 진혼곡입니다."
  },
  {
    "id": 31,
    "group": 11,
    "title": "마왕",
    "composer": "슈베르트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Franz_Schubert_-_Erlk%C3%B6nig.ogg",
    "trivia": "괴테의 시를 바탕으로 피아노 선율이 쉴 새 없이 달리는 말발굽 소리를 모사하고, 해설자, 아버지를 안심시키는 아들, 유혹하는 마왕의 4가지 목소리를 1명의 가창자가 극적으로 노래합니다."
  },
  {
    "id": 32,
    "group": 11,
    "title": "아베 마리아",
    "composer": "슈베르트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/73/Franz_Schubert_-_Ave_Maria.ogg",
    "trivia": "원래 스콧의 시 '호수의 여인' 중 주인공 엘렌이 곤경에 처해 성모 마리아에게 올리는 기도를 노래한 것으로, 성스럽고 경건하며 온화함이 넘치는 종교적 명곡입니다."
  },
  {
    "id": 33,
    "group": 11,
    "title": "피아노 5중주 '송어' 4악장",
    "composer": "슈베르트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Franz_Schubert_-_Piano_Quintet_in_A_major_-_D._667_-_IV._Andantino.ogg",
    "trivia": "맑고 깨끗한 시냇물 속을 쏜살같이 활기차게 헤엄치는 물고기(송어)의 꼬리짓과 튀기는 물방울을 바이올린과 피아노의 아기자기한 스타카토 기법으로 통통 튀게 표현했습니다."
  },
  {
    "id": 34,
    "group": 12,
    "title": "슈베르트 세레나데",
    "composer": "슈베르트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Franz_Schubert_-_Serenade.ogg",
    "trivia": "한여름 밤 사랑하는 연인의 창가 밑에서 부드러운 기타나 만돌린 반주에 맞춰 애틋하게 마음을 고백하며 부르는 낭만적인 밤의 사랑 노래입니다."
  },
  {
    "id": 35,
    "group": 12,
    "title": "교향곡 8번 '미완성' 1악장",
    "composer": "슈베르트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/94/Schubert_Symphony_8_Mvt_1.ogg",
    "trivia": "보통 교향곡은 4개 악장으로 구성되지만, 이 곡은 2개 악장만 완성된 채 방치되었습니다. 그럼에도 선율미의 완벽한 조화와 높은 완성도 덕분에 낭만파 최고의 명작으로 손꼽힙니다."
  },
  {
    "id": 36,
    "group": 12,
    "title": "바이올린 협주곡 E단조 1악장",
    "composer": "멘델스존",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mendelssohn_Violin_Concerto_1st_Mvt.ogg",
    "trivia": "오케스트라의 긴 서주를 생략하고, 시작하자마자 서정적이고 애절한 바이올린의 독주 고음이 바로 치고 나오는 획기적이고 낭만적인 구성을 가진 최고의 협주곡입니다."
  },
  {
    "id": 37,
    "group": 13,
    "title": "결혼 행진곡",
    "composer": "멘델스존",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Felix_Mendelssohn_-_Wedding_March_-_Op._61_No._9.ogg",
    "trivia": "결혼식장에서 신랑 신부가 행진을 마치고 퇴장할 때 터져 나오는 힘찬 트럼펫 팡파르로 시작하며, 전 세계 예식의 표준이자 축복의 대명사인 밝고 당당한 행진곡입니다."
  },
  {
    "id": 38,
    "group": 13,
    "title": "노래의 날개 위에",
    "composer": "멘델스존",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mendelssohn_On_Wings_of_Song.ogg",
    "trivia": "하이네의 시에 멘델스존이 감미로운 선율을 붙인 명곡으로, 사랑하는 사람을 노래의 날개에 실어 인도 갱지스강 가의 평화롭고 향기로운 에덴동산으로 데려가겠다는 로맨틱한 내용입니다."
  },
  {
    "id": 39,
    "group": 13,
    "title": "어린이 정경 중 '꿈'",
    "composer": "슈만",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Schumann_Traumerei.ogg",
    "trivia": "어른이 어릴 적 겪었던 순수한 동심의 시절을 추억하며 회상하는 평화로운 꿈결 같은 멜로디로, 따뜻한 피아노 타건이 마음에 깊은 평안을 선사합니다."
  },
  {
    "id": 40,
    "group": 14,
    "title": "시인의 사랑 중 '아름다운 5월에'",
    "composer": "슈만",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Schumann_Dichterliebe_1.ogg",
    "trivia": "연가곡집의 첫 번째 서곡으로, 만물이 꽃 피어나는 아름다운 계절인 5월에 내 마음에 싹튼 수줍은 첫사랑의 고백을 피아노와 성악의 서정적 대화로 그려냈습니다."
  },
  {
    "id": 41,
    "group": 14,
    "title": "야상곡(녹턴) Op. 9 No. 2",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Fr%C3%A9d%C3%A9ric_Chopin_-_Nocturne_in_E_flat_major_Op._9_No._2.ogg",
    "trivia": "밤의 감성을 피아노의 물 흐르듯 유려한 데코레이션 선율로 표현했으며, 촛불 밑에서 편안하게 감상하기에 아주 최적화된 쇼팽의 대표적 밤의 시학입니다."
  },
  {
    "id": 42,
    "group": 14,
    "title": "즉흥환상곡",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Fr%C3%A9d%C3%A9ric_Chopin_-_Fantaisie-Impromptu_in_C_sharp_minor_Op._66.ogg",
    "trivia": "왼손의 셋잇단음표 반주 위에 오른손이 매우 빠르게 물방울 튀듯 16분음표를 몰아치며 전개되며, 중간 부분의 감미롭고 부드러운 하강 선율의 대비가 환상적인 최고 인기 곡입니다."
  },
  {
    "id": 43,
    "group": 15,
    "title": "연습곡 '혁명'",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Fr%C3%A9d%C3%A9ric_Chopin_-_Etude_Op._10_No._12_in_C_minor_-_Revolutionary.ogg",
    "trivia": "쇼팽이 고국 폴란드의 혁명 실패와 수도 바르샤바의 함락 소식을 타지에서 듣고 피를 토하는 듯한 절망과 뜨거운 애국심의 분노를 격정적인 타건으로 폭발시킨 연습곡입니다."
  },
  {
    "id": 44,
    "group": 15,
    "title": "강아지 왈츠",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Chopin_Minute_Waltz.ogg",
    "trivia": "쇼팽의 연인이었던 조르주 상드가 기르던 강아지가 자기 꼬리를 잡으려고 뱅글뱅글 제자리에서 도는 귀여운 모습에 영감을 받아 피아노의 경쾌한 빠른 선율로 스케치했습니다."
  },
  {
    "id": 45,
    "group": 15,
    "title": "빗방울 전주곡",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Chopin_Raindrop_Prelude.ogg",
    "trivia": "수도원 처마 끝에서 일정한 간격으로 뚝, 뚝 떨어지는 빗방울 소리를 가슴 먹먹하고 애조 띤 베이스 음의 일정한 두드림으로 묘사하여 우울한 비 오는 날 듣기 아주 좋습니다."
  },
  {
    "id": 46,
    "group": 16,
    "title": "영웅 폴로네이즈",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Chopin_Polonaise_Heroic.ogg",
    "trivia": "폴란드 민족의 전통 무용인 폴로네이즈 리듬에 조국의 찬란한 옛 영광과 영웅적인 기상을 불어넣은 대작으로, 묵직하고 당당한 포효를 지닌 대규모 피아노곡입니다."
  },
  {
    "id": 47,
    "group": 16,
    "title": "사랑의 꿈 3번",
    "composer": "리스트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Liszt_Liebestraum_3.ogg",
    "trivia": "원래 사랑을 찬미하는 가곡이었으나 피아노 독주곡으로 편곡되며 초대박이 났습니다. 사랑할 수 있는 한 최대한 열정적으로 사랑하라는 감미롭고도 정열적인 후기 낭만파 명곡입니다."
  },
  {
    "id": 48,
    "group": 16,
    "title": "라 캄파넬라",
    "composer": "리스트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Liszt_La_Campanella.ogg",
    "trivia": "이탈리아어로 '종(Bell)'을 뜻하는 말로, 당대 바이올린 악마였던 파가니니의 연주를 듣고 자극을 받은 리스트가 초인적인 옥타브 도약 기법을 활용해 맑은 종소리를 묘사한 초고난도 곡입니다."
  },
  {
    "id": 49,
    "group": 17,
    "title": "헝가리 광시곡 2번",
    "composer": "리스트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Liszt_Hungarian_Rhapsody_No_2.ogg",
    "trivia": "집시들의 독특한 민속 춤곡 리듬을 극대화한 곡으로, 톰과 제리 애니메이션에서 피아노 연주 배틀 장면의 메인 테마곡으로 쓰여 대중에게도 웃음과 친근감을 주는 빠른 템포의 명곡입니다."
  },
  {
    "id": 50,
    "group": 17,
    "title": "헝가리 무곡 5번",
    "composer": "브람스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Brahms_-_Hungarian_Dance_No._5.ogg",
    "trivia": "헝가리 집시 음악의 멜로디에 클래식한 세련미를 이식한 곡으로, 템포가 갑자기 엄청나게 빨라졌다가 느려지는 다이내믹한 완급조절이 가슴을 두근거리게 만듭니다."
  },
  {
    "id": 51,
    "group": 17,
    "title": "브람스 자장가",
    "composer": "브람스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Brahms_-_Lullaby.ogg",
    "trivia": "브람스가 지인의 아기 탄생을 축하하며 선물한 음악으로, 전 세계 모든 오르골이나 신생아 모빌에서 흘러나오는 세상에서 가장 나른하고 아늑한 잠잠한 평안의 멜로디입니다."
  },
  {
    "id": 52,
    "group": 18,
    "title": "대학축전 서곡",
    "composer": "브람스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Brahms_Academic_Festival_Overture.ogg",
    "trivia": "명예 박사학위를 수여한 대학 측에 감사의 뜻으로 선사한 곡으로, 진중한 브람스답지 않게 당시 대학가 유흥가에서 부르던 신나는 대학생 술노래들을 절묘하게 믹스해 매우 발랄합니다."
  },
  {
    "id": 53,
    "group": 18,
    "title": "교향곡 6번 '비창' 1악장",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Tchaikovsky_Symphony_6_Mvt_1.ogg",
    "trivia": "작곡가 본인이 '나의 모든 영혼을 쏟아부었으며 생애 최고의 명작'이라 칭한 비장한 교향곡으로, 인간이 맞이하는 최후의 절망과 깊은 한숨의 우울함이 선율 곳곳에 짙게 베여 있습니다."
  },
  {
    "id": 54,
    "group": 18,
    "title": "피아노 협주곡 1번 1악장",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tchaikovsky_Piano_Concerto_1_Mvt_1_Part_1.ogg",
    "trivia": "시작하자마자 호른의 우렁찬 팡파르와 함께 피아노가 오케스트라의 강력한 포효 위로 화려한 옥타브 화음을 때려 박으며 장엄하게 질주하는, 피아노 협주곡 역사의 정점입니다."
  },
  {
    "id": 55,
    "group": 19,
    "title": "바이올린 협주곡 D장조 1악장",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Tchaikovsky_Violin_Concerto_1st_Mvt.ogg",
    "trivia": "초연 당시 바이올린의 난이도가 너무나 말도 안 되게 파격적이어서 '연주 불가능한 엽기적 곡'이라는 악평을 들었으나, 오늘날에는 극강의 기교와 러시아풍 우수를 가득 담아 세계 4대 바이올린 협주곡으로 꼽힙니다."
  },
  {
    "id": 56,
    "group": 19,
    "title": "1812년 서곡",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Tchaikovsky_1812_Overture.ogg",
    "trivia": "나폴레옹 군대의 침공을 러시아 민중들이 목숨 바쳐 격퇴한 전쟁을 묘사한 축제 서곡으로, 곡의 절정 부분에서 오케스트라 악기 대신 실제 대포를 대포 소리로 발사하는 엄청난 스케일을 자랑합니다."
  },
  {
    "id": 57,
    "group": 19,
    "title": "동물의 사육제 중 '백조'",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Saint-Sa%C3%ABns_-_Carnival_of_the_Animals_-_13_The_Swan.ogg",
    "trivia": "잔잔하고 맑은 호수 위를 미끄러지듯 소리 없이 우아하게 헤엄쳐 나가는 백조의 고귀한 날갯짓을 첼로의 길게 늘어지는 중저음 선율과 피아노의 물결 반주로 아름답게 묘사했습니다."
  },
  {
    "id": 58,
    "group": 20,
    "title": "동물의 사육제 중 '수족관'",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Saint-Saens_Aquarium.ogg",
    "trivia": "유리관 수족관 속에서 형형색색의 예쁜 물고기들이 은빛 물방울을 뿜어내며 신비롭게 헤엄치는 정경을 실로폰과 첼레스타의 차갑고 반짝이는 소리로 절묘하게 스케치했습니다."
  },
  {
    "id": 59,
    "group": 20,
    "title": "죽음의 무도",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Saint-Saens_Danse_Macabre.ogg",
    "trivia": "할로윈처럼 깊은 한밤중 공동묘지에서 죽음의 사신이 바이올린 불협화음을 켜자, 무덤에서 해골들이 깨어나 새벽 닭이 울 때까지 기괴하고 광란의 춤을 춤을 추는 묘사곡입니다."
  },
  {
    "id": 60,
    "group": 20,
    "title": "레퀴엠 중 '진노의 날'",
    "composer": "베르디",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/18/Verdi_Dies_Irae.ogg",
    "trivia": "최후의 심판 날에 하늘이 무너지고 땅이 갈라지며 모든 죄인들이 공포에 질려 비명을 지르는 대재앙의 순간을 오케스트라의 강력한 큰북 타격과 폭포수 합창으로 극대화했습니다."
  },
  {
    "id": 61,
    "group": 21,
    "title": "페르 귄트 중 '아침 기분'",
    "composer": "그리그",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Edvard_Grieg_-_Peer_Gynt_Suite_No._1_-_I._Morning_Mood.ogg",
    "trivia": "어슴푸레한 새벽안개가 걷히며 아침 해가 떠오르고, 맑은 새들의 속삭임과 싱그러운 아침이슬이 맺히는 자연의 첫 시작을 플루트와 오보에의 목가적 선율로 평화롭게 연주합니다."
  },
  {
    "id": 62,
    "group": 21,
    "title": "페르 귄트 중 '산속 마왕의 궁전에서'",
    "composer": "그리그",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Edvard_Grieg_-_Peer_Gynt_Suite_No._1_-_IV._In_the_Hall_of_the_Mountain_King.ogg",
    "trivia": "동굴 속 마왕의 부하 괴물들이 주인공 페르귄트를 잡기 위해 조용히 포위망을 좁혀오다가, 끝내 발견하고 떼 지어 쫓아가며 미친 듯 소동을 피우는 과정을 연주했습니다."
  },
  {
    "id": 63,
    "group": 21,
    "title": "그리그 피아노 협주곡 A단조",
    "composer": "그리그",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Grieg_Piano_Concerto_1st_Mvt.ogg",
    "trivia": "피아노가 쾅! 치는 강력한 폭포수 낙하 음으로 힘차게 포문을 여는 북유럽 노르웨이의 차가운 만년설과 웅장한 피오르드 협곡의 자연 기상을 가득 담은 민족주의 대표 명곡입니다."
  },
  {
    "id": 64,
    "group": 22,
    "title": "교향시 '핀란디아'",
    "composer": "시벨리우스",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Sibelius_Finlandia.ogg",
    "trivia": "러시아 제국의 압제와 지배 속에서 고통받던 핀란드 민중의 애국심을 고취하기 위해 작곡된 감격스러운 곡으로, 고결한 찬송가풍 선율은 오늘날 핀란드의 제2의 애국가로 추앙받습니다."
  },
  {
    "id": 65,
    "group": 22,
    "title": "나의 조국 중 '몰다우'",
    "composer": "스메타나",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Smetana_Moldau.ogg",
    "trivia": "보헤미아 숲속의 작은 샘물에서 출발하여 점차 큰 강을 이루고, 프라하 시내를 굽이쳐 장엄하게 흘러가는 조국의 몰다우 강줄기를 아름답고 서정적인 물결 멜로디로 노래했습니다."
  },
  {
    "id": 66,
    "group": 22,
    "title": "신세계로부터 2악장 (Largo)",
    "composer": "드보르자크",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dvorak_Symphony_9_Mvt_2.ogg",
    "trivia": "드보르자크가 고향 체코를 떠나 미국(신세계) 체류 중 고향에 대한 지독한 향수와 외로움을 잉글리시 호른의 구슬프고 따뜻한 민요조 선율에 실어 보낸 '고향 생각' 음악입니다."
  },
  {
    "id": 67,
    "group": 23,
    "title": "신세계로부터 4악장",
    "composer": "드보르자크",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dvorak_Symphony_9_Mvt_4.ogg",
    "trivia": "영화 죠스의 상어 등장이 연상되는 팽팽하고 긴박한 서주로 시작하여, 금관악기들이 뿜어내는 호쾌한 기차 질주 멜로디가 낭만주의 시대 오케스트라 파워의 극치를 보여줍니다."
  },
  {
    "id": 68,
    "group": 23,
    "title": "드보르자크 유모레스크",
    "composer": "드보르자크",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dvorak_Humoresque.ogg",
    "trivia": "원래 '기발하고 유쾌한 소곡'이라는 뜻으로, 사뿐사뿐 가볍게 산책을 하며 가벼운 스텝을 밟는 듯 깡총거리는 아기자기한 당김음 멜로디가 매우 사랑스러운 곡입니다."
  },
  {
    "id": 69,
    "group": 23,
    "title": "전람회의 그림 중 '프롬나드'",
    "composer": "무소르그스키",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/da/Mussorgsky_Promenade.ogg",
    "trivia": "전시회장(전람회)에 들어가 그림 액자 앞을 천천히 걸어 다니며 구경하는 관람객의 발걸음을 장엄하고 담백한 트럼펫 솔로와 금관 팡파르 리듬으로 사실적으로 표현했습니다."
  },
  {
    "id": 70,
    "group": 24,
    "title": "왕벌의 비행",
    "composer": "림스키코르사코프",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Rimsky-Korsakov_Flight_of_the_Bumblebee.ogg",
    "trivia": "커다란 왕벌 한 마리가 귓가 주위를 '윙윙윙윙' 소리를 내며 정신없이 날아다니는 묘사를 반음계 형식의 엄청나게 빠른 16분음표 연속 연주로 재미있고 유쾌하게 극화했습니다."
  },
  {
    "id": 71,
    "group": 24,
    "title": "달빛",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Claude_Debussy_-_Clair_de_Lune.ogg",
    "trivia": "조성이 모호하고 몽환적인 멜로디가 피아노 건반 위에서 물안개처럼 피어오르며, 구름 사이에 숨었다 나타났다 하는 은은하고 신비한 달빛의 색채를 소리의 명암으로 그려냈습니다."
  },
  {
    "id": 72,
    "group": 24,
    "title": "목신의 오후에의 전주곡",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/42/Debussy_Prelude_Faune.ogg",
    "trivia": "시인 말라르메의 시에 영감을 받은 곡으로, 더운 여름날 오후 숲속 그늘에서 나른한 잠에 취한 반인반수의 목신이 피리를 불며 몽상에 잠기는 노곤하고 몽환적인 곡입니다."
  },
  {
    "id": 73,
    "group": 25,
    "title": "볼레로",
    "composer": "라벨",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Maurice_Ravel_-_Bolero.ogg",
    "trivia": "시작부터 끝까지 스네어 드럼이 똑같은 스페인 민속 리듬을 169번 반복하는 동안, 악기들이 하나둘 늘어나며 점차 거대해져 최후에는 폭발적인 음량으로 터져 나오는 곡입니다."
  },
  {
    "id": 74,
    "group": 25,
    "title": "죽은 왕녀를 위한 파반느",
    "composer": "라벨",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ravel_Pavane.ogg",
    "trivia": "스페인 궁정 화가 벨라스케스의 그림 속 어린 공주의 초상화에 영감을 받아 작곡된 곡으로, 공주의 죽음을 슬퍼하기보다 옛날 스페인 궁정의 모습을 추억하는 곡입니다."
  },
  {
    "id": 75,
    "group": 25,
    "title": "짐노페디 1번",
    "composer": "에릭 사티",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/db/Erik_Satie_Gymnopedie_1.ogg",
    "trivia": "가구처럼 일상에 조용히 묻혀 존재하는 '가구 음악'의 효시로, 매우 느리고 단조로우며 공간감이 넓은 피아노 터치가 지친 현대인들의 마음을 아무 생각 없이 쉬게 해주는 음악입니다."
  },
  {
    "id": 76,
    "group": 26,
    "title": "위풍당당 행진곡 1번",
    "composer": "엘가",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Edward_Elgar_-_Pomp_and_Circumstance_March_No._1.ogg",
    "trivia": "과거 대영제국의 번영을 예찬하는 품격 있고 장중한 행진곡으로, 중간 부분의 드넓고 희망찬 멜로디는 현재도 각종 대형 축제 행사에서 무조건 연주됩니다."
  },
  {
    "id": 77,
    "group": 26,
    "title": "사랑의 인사",
    "composer": "엘가",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Elgar_Salut_d_Amour.ogg",
    "trivia": "엘가가 사랑하는 아내 앨리스와의 약혼을 기념하며 바친 로맨틱한 소품으로, 따뜻하고 정겨운 바이올린 멜로디가 마치 속삭이듯 사랑의 인사를 상냥하게 건네는 듯합니다."
  },
  {
    "id": 78,
    "group": 26,
    "title": "모음곡 행성 중 '목성'",
    "composer": "홀스트",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gustav_Holst_-_The_Planets_-_Jupiter.ogg",
    "trivia": "기쁨을 가져다주는 신 목성을 예찬하는 대규모 관현악곡으로, 웅장하고 쾌활하게 달리다가 중간에 터져 나오는 찬가 선율은 애국가나 종교 찬송가로 널리 가창됩니다."
  },
  {
    "id": 79,
    "group": 27,
    "title": "불새 조곡 중 죽음의 춤",
    "composer": "스트라빈스키",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Stravinsky_Firebird.ogg",
    "trivia": "러시아 민담을 바탕으로 한 발레 음악으로, 불새의 마법에 걸린 사악한 마왕과 괴물들이 자신들의 의지와 상관없이 미친 듯 지쳐 쓰러질 때까지 춤을 추는 춤곡입니다."
  },
  {
    "id": 80,
    "group": 27,
    "title": "랩소디 인 블루",
    "composer": "거슈윈",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Gershwin_Rhapsody_in_Blue.ogg",
    "trivia": "클래식 오케스트라 사운드에 미국 흑인들의 즉흥 재즈와 블루스 감성을 완벽하게 융합시킨 대명작으로, 도입부의 클라리넷 글리산도 연주가 트레이드 마크입니다."
  },
  {
    "id": 81,
    "group": 27,
    "title": "소녀의 기도",
    "composer": "바다르체프스카",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Badarzewska_Maidens_Prayer.ogg",
    "trivia": "폴란드의 무명 18세 소녀 작곡가가 남긴 기적 같은 소품으로, 은방울이 굴러가는 듯 영롱하고 아름다운 트레몰로 아르페지오 음색이 소박하면서도 가슴을 깨끗하게 비춰 줍니다."
  },
  {
    "id": 82,
    "group": 28,
    "title": "꽃노래 (랑게)",
    "composer": "랑게",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Lange_Flower_Song.ogg",
    "trivia": "가정용 살롱 피아노 명곡의 대명사로, 봄날 들판에 핀 예쁜 꽃들이 바람에 살랑살랑 춤추는 듯 우아하고 달콤하며, 귀여운 스타카토 선율이 매력 포인트입니다."
  },
  {
    "id": 83,
    "group": 28,
    "title": "피아노 소나타 16번 C장조 1악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Mozart_Piano_Sonata_No_16_Mvt_1.ogg",
    "trivia": "모차르트 스스로 '초보자를 위한 쉬운 소나타'라고 적었으나, 실제 연주 시 흠 하나 없이 맑고 고르게 치기가 대단히 까다로운 곡으로, 맑은 시냇물 같은 고전 피아노의 투명함을 가졌습니다."
  },
  {
    "id": 84,
    "group": 28,
    "title": "엘리제를 위하여 (피아노 솔로)",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ludwig_van_Beethoven_-_Bagatelle_No._25_in_A_minor_-_%22F%C3%BCr_Elise%22.ogg",
    "trivia": "피아노 학원 기초 단계를 지나면 남녀노소 누구나 한 번쯤 건반 위에서 쳐보는 국민 연습곡으로, 고즈넉한 A단조 선율 속에 숨겨진 베토벤의 애틋한 고백이 담겨 있습니다."
  },
  {
    "id": 85,
    "group": 29,
    "title": "멜로디 F장조",
    "composer": "루빈스타인",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rubinstein_Melody_in_F.ogg",
    "trivia": "19세기 러시아 피아노 전설 루빈스타인의 대표 소곡으로, 양손의 가운데 손가락들이 얽히며 만들어내는 잔잔하고 따뜻하며 서정성이 가득 찬 살롱 멜로디가 편안함을 안겨줍니다."
  },
  {
    "id": 86,
    "group": 29,
    "title": "왈츠 Op. 64 No. 2 C# 단조",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Chopin_Waltz_Op_64_No_2.ogg",
    "trivia": "화려한 춤을 추기 위한 무도회 곡이라기보다, 쇼팽 특유의 병약하고 시적인 감성이 가득 베인 쓸쓸하고 우수 어린 선율로 시작하여 빠르게 회전하며 고조되는 왈츠입니다."
  },
  {
    "id": 87,
    "group": 29,
    "title": "녹턴 Op. 9 No. 1 Bb 단조",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Chopin_Nocturne_Op_9_No_1.ogg",
    "trivia": "매우 대중적인 2번에 가려져 있으나, 쇼팽 녹턴 예술의 진수를 담은 처연하고 외로운 밤의 명곡으로, 오른손이 흘러내리듯 고독하게 울부짖는 피아노 건반이 무척이나 아름답습니다."
  },
  {
    "id": 88,
    "group": 30,
    "title": "아라베스크 1번",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Debussy_Arabesque_1.ogg",
    "trivia": "'아라비아풍의 장식 문양'이라는 뜻의 미술 용어로, 피아노 오른손과 왼손의 다른 박자 비율이 얽히며 마치 정원의 넝쿨 식물이 곡선으로 뻗어나가는 듯한 입체적 묘사를 담았습니다."
  },
  {
    "id": 89,
    "group": 30,
    "title": "파헬벨 캐논 (피아노 솔로)",
    "composer": "파헬벨",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Johann_Pachelbel_-_Canon_in_D_major.ogg",
    "trivia": "클래식 캐논의 원곡 오케스트라 앙상블을 피아노 한 대의 넓은 건반 울림으로 고즈넉하게 재해석하여 한층 더 포근하고 아름다운 정취를 주는 편곡 버전입니다."
  },
  {
    "id": 90,
    "group": 30,
    "title": "라 캄파넬라 (피아노 독주)",
    "composer": "리스트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Liszt_La_Campanella.ogg",
    "trivia": "새벽녘 정적을 깨우며 멀리 성당 꼭대기에서 맑게 울려 펴지는 청아한 종소리를 피아노의 가장 높은 고음 건반 연타와 화려한 기교로 눈이 부시도록 세련되게 모사했습니다."
  },
  {
    "id": 91,
    "group": 31,
    "title": "카르멘 중 '투우사의 노래'",
    "composer": "비제",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Georges_Bizet_-_Carmen_-_Act_II_-_Toreador_Song.ogg",
    "trivia": "투우장에 위풍당당하게 입장하여 소와 사투를 벌이는 투우사의 용맹한 기상과 관중들의 뜨거운 함성을 씩씩하고 박진감 넘치게 노래한 최고의 아리아입니다."
  },
  {
    "id": 92,
    "group": 31,
    "title": "카르멘 중 '하바네라'",
    "composer": "비제",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Georges_Bizet_-_Carmen_-_Act_I_-_Habanera.ogg",
    "trivia": "치명적인 매력을 지닌 집시 여인 카르멘이 미련한 군인을 유혹하며 부르는 농염하고 이국적인 쿠바풍 춤 노래로, 리드미컬하고 매혹적인 곡입니다."
  },
  {
    "id": 93,
    "group": 31,
    "title": "빌헬름 텔 서곡",
    "composer": "로시니",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Gioachino_Rossini_-_William_Tell_Overture.ogg",
    "trivia": "스위스 의적 빌헬름 텔이 폭정에 맞서 싸우는 활약상을 묘사한 서곡으로, 트럼펫의 힘찬 팡파르와 함께 질주하는 종결부 멜로디는 전 세계적으로 유명합니다."
  },
  {
    "id": 94,
    "group": 32,
    "title": "세비야의 이발사 서곡",
    "composer": "로시니",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/84/Gioachino_Rossini_-_The_Barber_of_Seville_-_Overture.ogg",
    "trivia": "로시니 특유의 유쾌하고 쾌활한 음악 스타일이 폭발하는 서곡으로, 작은 소리에서 점차 악기들이 더해지며 거대하게 부풀어 오르는 유쾌한 곡입니다."
  },
  {
    "id": 95,
    "group": 32,
    "title": "아름답고 푸른 도나우강",
    "composer": "요한 슈트라우스 2세",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Johann_Strauss_II_-_The_Blue_Danube.ogg",
    "trivia": "매년 빈 신년 음악회의 단골 앙코르곡이자 왈츠의 황제 요한 슈트라우스 2세의 최대 히트작으로, 도나우강의 도도한 흐름을 사뿐거리는 3박자 왈츠 리듬에 실어 표현했습니다."
  },
  {
    "id": 96,
    "group": 32,
    "title": "지옥의 오르페우스 중 '캉캉'",
    "composer": "오펜바흐",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Offenbach_Can-Can.ogg",
    "trivia": "치마를 들치며 다리를 높이 차올리는 프랑스의 열정적인 댄스 캉캉의 시그널 곡으로, 템포가 상상을 초월하게 빨라지며 정신을 아득하게 만드는 춤곡입니다."
  },
  {
    "id": 97,
    "group": 33,
    "title": "발키리의 기행",
    "composer": "바그너",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Richard_Wagner_-_Ride_of_the_Valkyries.ogg",
    "trivia": "오페라 '니벨룽의 반지' 중 전장의 여신 발키리 전사들이 날개 달린 말을 타고 전선 위 하늘을 맹렬히 날아다니는 장면으로, 장엄함과 위압감을 선사합니다."
  },
  {
    "id": 98,
    "group": 33,
    "title": "호두까기 인형 중 '꽃의 왈츠'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Tchaikovsky_-_Nutcracker_Suite_-_8_Waltz_of_the_Flowers.ogg",
    "trivia": "하프의 화려하고 꿈결 같은 독주 카덴차로 시작하여, 사탕 과자의 나라 축제에서 꽃 요정들이 한데 어우러져 화려하고 풍성하게 왈츠 춤을 추는 곡입니다."
  },
  {
    "id": 99,
    "group": 33,
    "title": "백조의 호수 중 '정경'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Tchaikovsky_-_Swan_Lake_-_Act_II_Scene_10.ogg",
    "trivia": "오보에가 호수 위를 떠다니는 가련한 백조의 슬프고 애절한 주제 멜로디를 불고, 뒤이어 하프의 잔잔한 물결이 넘실대며 발레 역사상 가장 신비로운 분위기를 그립니다."
  },
  {
    "id": 100,
    "group": 34,
    "title": "아이다 중 '개선 행진곡'",
    "composer": "베르디",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Verdi_Grand_March_Aida.ogg",
    "trivia": "이집트 군대의 승리를 축하하며 개선 장군들이 입장하는 장엄한 개선 행진 장면의 대작으로, 우렁차고 찬란한 멜로디가 전율을 선사합니다. "
  },
  {
    "id": 101,
    "group": 34,
    "title": "브란덴부르크 협주곡 3번 1악장",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Bach_Brandenburg_Concerto_3_1st_Mvt.ogg",
    "trivia": "현악기들의 촘촘하고 정교한 대위법적 앙상블이 활기차게 살아 꿈틀대는 바로크 합주 협주곡의 대명사입니다."
  },
  {
    "id": 102,
    "group": 34,
    "title": "골트베르크 변주곡 중 아리아",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/GoldbergVariations_Aria.ogg",
    "trivia": "불면증에 시달리던 백작을 위해 작곡된 곡으로, 피아노의 잔잔하고 지적인 타건이 심신에 깊은 평안을 선사합니다."
  },
  {
    "id": 103,
    "group": 35,
    "title": "음악의 헌정 중 무한 캐논",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/Bach_Canon_a_2_perpetuus.ogg",
    "trivia": "프로이센 국왕 프리드리히 2세가 제시한 주제를 바탕으로 바흐의 신비롭고 복잡한 수학적 대위법 기교를 극대화한 곡입니다."
  },
  {
    "id": 104,
    "group": 35,
    "title": "하프시코드 협주곡 1번 1악장",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Bach_Harpsichord_Concerto_BWV_1052_1st_mvt.ogg",
    "trivia": "하프시코드 건반의 찰랑이는 메탈릭 사운드와 현악 오케스트라가 팽팽하고 힘찬 긴장감을 자아내는 명곡입니다."
  },
  {
    "id": 105,
    "group": 35,
    "title": "양들은 한가로이 풀을 뜯고",
    "composer": "바흐",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Bach_Sheep_May_Safely_Graze.ogg",
    "trivia": "바흐의 사냥 칸타타 중 가장 평화롭고 온화한 분위기의 멜로디로, 시골 목장의 아늑하고 잔잔한 햇살을 연상시킵니다."
  },
  {
    "id": 106,
    "group": 36,
    "title": "마술피리 중 '밤의 여왕 아리아'",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Der_H%C3%B6lle_Rache.ogg",
    "trivia": "인간의 목소리 한계를 시험하는 듯한 엄청난 고음역대의 초고난도 콜로라투라 소프라노 독주곡으로, 분노에 찬 밤의 여왕의 복수심을 노래합니다."
  },
  {
    "id": 107,
    "group": 36,
    "title": "클라리넷 협주곡 A장조 2악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Mozart_Clarinet_Concerto_2nd_Mvt.ogg",
    "trivia": "영화 '아웃 오브 아프리카' 테마곡으로 유명하며, 클라리넷의 깊고 포근한 바람 소리 같은 부드러운 음색이 아늑함을 줍니다."
  },
  {
    "id": 108,
    "group": 36,
    "title": "피아노 소나타 11번 A장조 1악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/14/Mozart_Piano_Sonata_No_11_Mvt_1.ogg",
    "trivia": "우아하고 소박한 사랑의 가창 테마로 시작해, 피아노의 다채롭고 아름다운 아르페지오 변주가 펼쳐지는 서두 악장입니다."
  },
  {
    "id": 109,
    "group": 37,
    "title": "교향곡 41번 '주피터' 4악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mozart_Symphony_41_4th_Mvt.ogg",
    "trivia": "모차르트 생애 마지막 교향곡의 종악장으로, 웅장하고 신성한 신들의 제왕 주피터처럼 완벽한 대위법의 극치를 자랑합니다."
  },
  {
    "id": 110,
    "group": 37,
    "title": "혼 협주곡 4번 3악장",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Mozart_Horn_Concerto_4_3rd_Mvt.ogg",
    "trivia": "사냥용 뿔나팔(Horn)에서 유래한 금관악기의 시원하고 활기찬 리듬이 마치 숲속에서 말을 타고 달리는 듯 역동적입니다."
  },
  {
    "id": 111,
    "group": 37,
    "title": "교향곡 7번 A장조 2악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven_Symphony_7_Mvt_2.ogg",
    "trivia": "영화 '킹스 스피치' 등 무수한 영화의 하이라이트에 쓰인 곡으로, 장엄하고 무거운 장송 행진 리듬이 슬프면서도 숭고한 정서를 뿜어냅니다."
  },
  {
    "id": 112,
    "group": 38,
    "title": "교향곡 5번 '운명' 4악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Beethoven_Symphony_5_4th_Mvt.ogg",
    "trivia": "1악장의 어둡고 고통스러운 운명의 그늘을 뚫고 나와, 최후에 찬란한 C장조의 승리와 환희의 빛을 터뜨리는 장엄한 종악장입니다."
  },
  {
    "id": 113,
    "group": 38,
    "title": "바이올린 협주곡 D장조 3악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Beethoven_Violin_Concerto_3rd_Mvt.ogg",
    "trivia": "바이올린의 우아하고 따뜻한 론도 리듬이 오케스트라와 경쾌하게 주거니 받거니 하며, 축제날의 신나는 흥을 돋웁니다."
  },
  {
    "id": 114,
    "group": 38,
    "title": "피아노 협주곡 5번 '황제' 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Beethoven_Piano_Concerto_5_1st_Mvt.ogg",
    "trivia": "시작하자마자 오케스트라의 장엄한 화음 선언 위에 피아노가 폭포수 같은 즉흥 카덴차 화음을 쏟아붓는 황제다운 위용을 보입니다."
  },
  {
    "id": 115,
    "group": 39,
    "title": "피아노 협주곡 5번 '황제' 2악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Beethoven_Piano_Concerto_5_2nd_Mvt.ogg",
    "trivia": "세상에서 가장 신성하고 아늑한 자장가 같은 기도를 피아노가 조용히 연주하며, 숭고한 평화를 들려주는 베토벤 최고의 서정 악장입니다."
  },
  {
    "id": 116,
    "group": 39,
    "title": "피아노 소나타 23번 '열정' 3악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Beethoven_Appassionata_3rd_Mvt.ogg",
    "trivia": "쉴 새 없이 몰아치는 왼손과 오른손의 거센 파도 같은 분노의 타건이 낭만적 열정을 뿜어내는 베토벤 피아노 소나타의 거대한 절정입니다."
  },
  {
    "id": 117,
    "group": 39,
    "title": "바이올린 소나타 5번 '봄' 1악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Beethoven_Violin_Sonata_5_1st_mvt.ogg",
    "trivia": "바이올린과 피아노가 봄날의 싱그럽고 따스한 들판을 가볍게 산책하는 듯, 감미롭고 평화로운 멜로디가 매력적인 곡입니다."
  },
  {
    "id": 118,
    "group": 40,
    "title": "교향곡 9번 '합창' 3악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Beethoven_Symphony_9_3rd_mvt.ogg",
    "trivia": "4악장의 폭발적인 인간 합창이 나타나기 전, 아늑하고 경건하며 숭고한 기도의 평화를 오케스트라가 길고 잔잔하게 묘사하는 아다지오 악장입니다."
  },
  {
    "id": 119,
    "group": 40,
    "title": "에그몬트 서곡",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Beethoven_Egmont_Overture.ogg",
    "trivia": "괴테의 비극 '에그몬트'를 위해 작곡한 서곡으로, 억압받는 민중들의 고통과 민족 영웅의 장엄한 희생, 승리의 팡파르를 담았습니다."
  },
  {
    "id": 120,
    "group": 40,
    "title": "월광 소나타 3악장",
    "composer": "베토벤",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Beethoven_Moonlight_3rd_Mvt.ogg",
    "trivia": "1악장의 고즈넉함을 깨부수고, 한밤중 거센 태풍과 몰아치는 폭풍우처럼 피아노 건반 위를 양손이 폭발하듯 긁어 올라가는 초격정적인 곡입니다."
  },
  {
    "id": 121,
    "group": 41,
    "title": "사계 중 '여름' 1악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Vivaldi_Summer_1st_Mvt.ogg",
    "trivia": "지독한 여름철 무더위에 지친 농부들과 동물들이 헐떡이며 지쳐 쓰러져가는 피로와 정적을 바이올린으로 노곤하게 그렸습니다."
  },
  {
    "id": 122,
    "group": 41,
    "title": "사계 중 '겨울' 2악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Vivaldi_Winter_2nd_Mvt.ogg",
    "trivia": "밖에는 세찬 차가운 비가 내리지만, 아늑한 벽난로가 있는 방 안에서 평화롭고 따스한 휴식을 취하는 행복한 겨울날의 풍경을 따뜻하게 연주합니다."
  },
  {
    "id": 123,
    "group": 41,
    "title": "조화의 영감 협주곡 6번 1악장",
    "composer": "비발디",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Vivaldi_L_Estro_Armonico_No_6_1st_Mvt.ogg",
    "trivia": "비발디 협주곡집의 정수를 담은 곡으로, 바이올린 독주가 쉴 새 없이 날카롭고 리드미컬하게 달리는 강력한 바로크 에너지를 뿜어냅니다."
  },
  {
    "id": 124,
    "group": 42,
    "title": "울게 하소서 (Lascia ch'io pianga)",
    "composer": "헨델",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Handel_Lascia_ch_io_pianga.ogg",
    "trivia": "오페라 '리날도'의 가장 유명한 아리아로, 가혹한 운명에 갇힌 슬픔을 처연하고 성스러운 오보에와 성악 선율로 아름답게 호소합니다."
  },
  {
    "id": 125,
    "group": 42,
    "title": "수상 음악 중 '알레그로'",
    "composer": "헨델",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Handel_Water_Music_Allegro.ogg",
    "trivia": "영국 국왕 조지 1세가 템즈강 가에서 뱃놀이를 즐길 때 웅장한 금관악기들이 배 위에서 연주하던 시원하고 당당한 강가 축제 음악입니다."
  },
  {
    "id": 126,
    "group": 42,
    "title": "왕궁의 불꽃놀이 음악 중 '미뉴에트'",
    "composer": "헨델",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Handel_Royal_Fireworks_Minuet.ogg",
    "trivia": "영국의 전승 기념 대규모 불꽃놀이 축제를 위해 작곡된 곡으로, 우아하고 웅장한 영국 왕실의 품격이 느껴지는 3박자 무도곡입니다."
  },
  {
    "id": 127,
    "group": 43,
    "title": "타이스의 명상곡 (Meditation)",
    "composer": "마스네",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Massenet_Meditation_from_Thais.ogg",
    "trivia": "오페라 '타이스' 중 여주인공이 세속의 욕망을 참회하고 신성한 기도로 들어가는 고요하고 정결한 바이올린 솔로 위로 하프의 천상 선율이 내립니다."
  },
  {
    "id": 128,
    "group": 43,
    "title": "시실리안느 (Sicilienne)",
    "composer": "포레",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Faure_Sicilienne.ogg",
    "trivia": "이탈리아 시칠리아 섬의 서정적이고 우수 어린 무도곡 리듬을 플루트와 첼로의 촉촉하고 서글픈 울림으로 감미롭게 담아냈습니다."
  },
  {
    "id": 129,
    "group": 43,
    "title": "파반느 (Pavane Op. 50)",
    "composer": "포레",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Faure_Pavane.ogg",
    "trivia": "스페인 궁정 무용 파반느의 느린 스텝에 프랑스 특유의 몽환적이고 귀족적인 아련함을 이식한 환상적 관현악곡입니다."
  },
  {
    "id": 130,
    "group": 44,
    "title": "아를의 여인 조곡 중 '미뉴에트'",
    "composer": "비제",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bizet_L_Arlesienne_Minuet.ogg",
    "trivia": "하프의 영롱한 뜯기 위에 플루트가 세상에서 가장 맑고 달콤하며 아련한 사랑의 노래를 들려주는 단골 클래식 명곡입니다."
  },
  {
    "id": 131,
    "group": 44,
    "title": "빗방울 전주곡 (피아노 솔로)",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Chopin_Raindrop_Prelude.ogg",
    "trivia": "지중해 마요르카 섬의 수도원 처마 끝에서 뚝뚝 떨어지는 빗방울을 연상시키는 중독적인 피아노의 일정한 베이스 타건이 쓸쓸합니다."
  },
  {
    "id": 132,
    "group": 44,
    "title": "왈츠 Op. 69 No. 1 '이별의 왈츠'",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Chopin_Waltz_Op_69_No_1.ogg",
    "trivia": "쇼팽이 사랑했던 여인 마리아와 헤어지며 선물한 서글프고 아련한 이별의 왈츠로, 가슴 한 구석이 뭉클해지는 멜로디를 지녔습니다."
  },
  {
    "id": 133,
    "group": 45,
    "title": "녹턴 Op. 27 No. 2 D플랫 장조",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Chopin_Nocturne_Op_27_No_2.ogg",
    "trivia": "쇼팽의 녹턴 예술의 극치로 불리며, 밤의 잔잔하고 신비로운 달빛 아래 두 연인이 손을 잡고 사랑을 대화하는 듯한 평온한 명곡입니다."
  },
  {
    "id": 134,
    "group": 45,
    "title": "영웅 폴로네이즈 (축소본)",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Chopin_Polonaise_Heroic.ogg",
    "trivia": "폴란드 민족의 기상과 뜨거운 애국심을 피아노 오케스트라 사운드로 쏟아붓는 쇼팽의 최고 난이도 대작 중 대작입니다."
  },
  {
    "id": 135,
    "group": 45,
    "title": "스케르초 2번 Bb단조",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Chopin_Scherzo_No_2.ogg",
    "trivia": "속삭이듯 조용하게 노크하는 소리로 시작해, 갑자기 피아노 건반 위로 불꽃처럼 분노의 선율이 솟구쳐 오르는 열정적인 명곡입니다."
  },
  {
    "id": 136,
    "group": 46,
    "title": "현을 위한 세레나데 2악장 '왈츠'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Tchaikovsky_Serenade_for_Strings_Waltz.ogg",
    "trivia": "현악 오케스트라만으로 구성되어, 비단결처럼 부드럽고 풍성한 현악기의 아름다운 왈츠 선율이 온 마음을 포근하게 감싸줍니다."
  },
  {
    "id": 137,
    "group": 46,
    "title": "호두까기 인형 중 '중국 인형의 춤'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Tchaikovsky_Nutcracker_Chinese_Dance.ogg",
    "trivia": "바순의 낮게 툭툭 던지는 스타카토 반주 위로 플루트가 삐삐 소리를 내며 아기자기하게 춤추는 깜찍한 곡입니다."
  },
  {
    "id": 138,
    "group": 46,
    "title": "호두까기 인형 중 '러시아 인형의 춤'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Tchaikovsky_Nutcracker_Russian_Dance.ogg",
    "trivia": "러시아 민속 무용인 트레팍 리듬을 살려, 곡의 끝으로 갈수록 템포가 숨 가쁘게 빨라지며 광란의 발놀림을 유도하는 신나는 곡입니다."
  },
  {
    "id": 139,
    "group": 47,
    "title": "피아노 협주곡 1번 2악장",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Tchaikovsky_Piano_Concerto_1_Mvt_2.ogg",
    "trivia": "1악장의 웅장함을 잠재우고, 플루트와 피아노가 한밤중 들판의 고요한 숨결을 나누는 듯 순수하고 맑은 낭만을 들려줍니다."
  },
  {
    "id": 140,
    "group": 47,
    "title": "현악 4중주 1번 2악장 '안단테 칸타빌레'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Tchaikovsky_Andante_Cantabile.ogg",
    "trivia": "톨스토이가 이 음악을 감상하다 눈물을 흘렸다는 곡으로, 러시아 민요풍의 극치인 구슬프고 따뜻한 위안의 멜로디가 특징입니다."
  },
  {
    "id": 141,
    "group": 47,
    "title": "사랑의 인사 (첼로 편곡)",
    "composer": "엘가",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Elgar_Salut_d_Amour.ogg",
    "trivia": "엘가가 부인에게 바친 로맨틱한 선율을 첼로의 포근하고 깊은 중저음 사운드로 더욱 묵직하고 따스하게 감상하는 버전입니다."
  },
  {
    "id": 142,
    "group": 48,
    "title": "죽음의 무도 (현악 아르페지오)",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Saint-Saens_Danse_Macabre.ogg",
    "trivia": "공동묘지 시계가 밤 12시를 종소리로 치고 나면 해골들이 무덤에서 깨어나 격렬하게 춤을 추기 시작하는 환상곡입니다."
  },
  {
    "id": 143,
    "group": 48,
    "title": "동물의 사육제 중 '화석'",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Saint_Saens_Carnival_of_the_Animals_Fossils.ogg",
    "trivia": "박물관 속 공룡의 뼈와 화석들이 살랑살랑 부딪치며 춤을 추는 소리를 실로폰의 딱딱하고 경쾌한 타격음으로 사실적으로 유쾌하게 그렸습니다."
  },
  {
    "id": 144,
    "group": 48,
    "title": "동물의 사육제 중 '코끼리'",
    "composer": "생상스",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Saint_Saens_Carnival_of_the_Animals_Elephant.ogg",
    "trivia": "무겁고 뚱뚱한 코끼리가 왈츠 리듬에 맞춰 뒤뚱뒤뚱 익살스럽게 춤을 추는 모습을 더블베이스의 아주 묵직하고 낮은 소리로 위트 있게 묘사했습니다."
  },
  {
    "id": 145,
    "group": 49,
    "title": "사랑의 예찬 (Liebesfreud)",
    "composer": "크라이슬러",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Kreisler_Liebesfreud.ogg",
    "trivia": "빈의 오스트리아풍 경쾌한 무도 리듬에 실린 바이올린의 사랑스러운 속삭임으로, 기쁨이 솟구치는 따스한 고백 곡입니다."
  },
  {
    "id": 146,
    "group": 49,
    "title": "사랑의 슬픔 (Liebesleid)",
    "composer": "크라이슬러",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Kreisler_Liebesleid.ogg",
    "trivia": "기쁨과 대비되는 서글프고 우수 어린 멜로디를 바이올린의 달콤 쌉싸름한 연주로 들려주는 아련하고 로맨틱한 빈 스타일 왈츠곡입니다."
  },
  {
    "id": 147,
    "group": 49,
    "title": "피아노 협주곡 2번 C단조 1악장",
    "composer": "라흐마니노프",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Rachmaninoff_Piano_Concerto_2_Mvt_1.ogg",
    "trivia": "장엄한 러시아 종소리를 피아노 타건으로 시작해, 현악 오케스트라의 거대한 폭풍우 같은 감정적 멜로디가 휘몰아치는 최고의 대작입니다."
  },
  {
    "id": 148,
    "group": 50,
    "title": "보칼리제 (Vocalise Op. 34)",
    "composer": "라흐마니노프",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Rachmaninoff_Vocalise.ogg",
    "trivia": "가사 없이 오직 모음 하나만으로 길고 애절하게 흐느끼듯 부르는 노래로, 쓸쓸하고도 숭고한 극강의 낭만주의 멜로디입니다."
  },
  {
    "id": 149,
    "group": 50,
    "title": "파가니니 주제에 의한 랩소디 중 18변주",
    "composer": "라흐마니노프",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/df/Rachmaninoff_Paganini_Rhapsody_Var18.ogg",
    "trivia": "파가니니의 날카로운 리듬을 뒤집어 세상에서 가장 로맨틱하고 영화 같은 아름다운 하강 선율로 창조해 낸 낭만파 최고의 사랑 테마입니다."
  },
  {
    "id": 150,
    "group": 50,
    "title": "프렐류드 C# 단조 '모스크바의 종소리'",
    "composer": "라흐마니노프",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rachmaninoff_Prelude_in_C_sharp_minor.ogg",
    "trivia": "웅장하고 무거운 종소리가 파멸을 예고하듯 쿵, 쿵 울려 퍼지며, 건반 전체를 도약하는 피아노의 압도적인 장엄한 기개를 자랑합니다."
  },
  {
    "id": 151,
    "group": 51,
    "title": "핀란디아 중 '찬가' (Chorale)",
    "composer": "시벨리우스",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Sibelius_Finlandia.ogg",
    "trivia": "전쟁의 긴장감을 극복하고 후반부에 평화롭고 고결하게 합창하는 파트로, 핀란드 사람들의 숭고한 정신과 애국심을 가득 고취합니다."
  },
  {
    "id": 152,
    "group": 51,
    "title": "슬라브 무곡 Op. 72 No. 2",
    "composer": "드보르자크",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dvorak_Slavonic_Dance_Op_72_No_2.ogg",
    "trivia": "체코의 가을 들판을 걷는 듯 애조 띠면서도 한편으로는 너무나 감미로운 보헤미아 민속 리듬이 가슴을 쓸어내리게 만듭니다."
  },
  {
    "id": 153,
    "group": 51,
    "title": "유모레스크 (바이올린 편곡)",
    "composer": "드보르자크",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dvorak_Humoresque.ogg",
    "trivia": "특유의 통통 튀는 경쾌한 멜로디를 바이올린의 맑고 우아한 현악 스타카토와 미끄러짐(Glissando)으로 귀엽게 표현했습니다."
  },
  {
    "id": 154,
    "group": 52,
    "title": "나의 조국 중 '타보르'",
    "composer": "스메타나",
    "era": "국민악파",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Smetana_Tabor.ogg",
    "trivia": "조국 체코의 종교 혁명 영웅들을 기리는 장엄하고 결연한 오케스트라 전투 음악으로, 뜨거운 민족주의 정신이 불타오릅니다."
  },
  {
    "id": 155,
    "group": 52,
    "title": "하바네라 (Habera from Carmen)",
    "composer": "비제",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Georges_Bizet_-_Carmen_-_Act_I_-_Habanera.ogg",
    "trivia": "이국적인 스페인풍 지중해 왈츠에 실린 카르멘의 대표 아리아로, 사랑을 거부하는 자유로운 새에 빗대어 유혹합니다."
  },
  {
    "id": 156,
    "group": 52,
    "title": "밤의 여왕 아리아 (소프라노 독주)",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Der_H%C3%B6lle_Rache.ogg",
    "trivia": "모차르트 오페라 중 가장 격렬하고 소름 돋는 콜로라투라 고음의 분노 표출 곡으로, 듣는 이를 압도하는 긴장감이 대단합니다."
  },
  {
    "id": 157,
    "group": 53,
    "title": "아이다 개선행진곡 (팡파르)",
    "composer": "베르디",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Verdi_Grand_March_Aida.ogg",
    "trivia": "개선 장군들의 승전 축하식을 위해 대규모 이집트 군악대가 행진하며 부르는, 금관악기 팡파르의 화려함이 장관을 이루는 곡입니다."
  },
  {
    "id": 158,
    "group": 53,
    "title": "캉캉 (Orchestra Edition)",
    "composer": "오펜바흐",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Offenbach_Can-Can.ogg",
    "trivia": "빠르고 가벼운 발동작 캉캉의 무대 춤곡으로, 숨 막힐 정도로 빠른 질주 템포가 듣는 이의 아드레날린을 최고조로 끌어올립니다."
  },
  {
    "id": 159,
    "group": 53,
    "title": "발키리의 기행 (오케스트라)",
    "composer": "바그너",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Richard_Wagner_-_Ride_of_the_Valkyries.ogg",
    "trivia": "북유럽 신화 속 전사들의 영혼을 모으러 하늘을 비행하는 날개 달린 여신들의 힘찬 행진을 묵직한 호른과 트롬본으로 그렸습니다."
  },
  {
    "id": 160,
    "group": 54,
    "title": "투우사의 노래 (카르멘 조곡)",
    "composer": "비제",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Georges_Bizet_-_Carmen_-_Act_II_-_Toreador_Song.ogg",
    "trivia": "화려한 투우사 복장을 하고 투우장에 당당하게 등장하는 주인공의 기백을 트럼펫과 타악기 앙상블로 묘사한 대표 행진곡입니다."
  },
  {
    "id": 161,
    "group": 54,
    "title": "꿈 (Reverie)",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Debussy_Reverie.ogg",
    "trivia": "공중에 붕 떠서 구름 속을 유유히 걷는 듯, 고요하고 신비로운 피아노 음들이 영혼을 아늑하게 달래주는 몽환적 꿈 명곡입니다."
  },
  {
    "id": 162,
    "group": 54,
    "title": "아라베스크 2번 G장조",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Debussy_Arabesque_2.ogg",
    "trivia": "1번의 잔잔함과 달리, 바람에 나부끼는 레이스 장식이나 정원의 나비들이 가볍게 춤추며 날아다니는 듯 발랄하고 경쾌합니다."
  },
  {
    "id": 163,
    "group": 55,
    "title": "달빛 (오케스트라 편곡)",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Claude_Debussy_-_Clair_de_Lune.ogg",
    "trivia": "잔잔한 피아노 원곡의 깊이를 하프와 목관악기 앙상블로 확장하여, 은빛 찬란한 밤하늘의 몽환적인 우주감을 연출한 버전입니다."
  },
  {
    "id": 164,
    "group": 55,
    "title": "목신의 오후 (플루트 독주 파트)",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/42/Debussy_Prelude_Faune.ogg",
    "trivia": "더운 한낮의 숲에서 플루트의 나른한 독주가 영혼을 스르르 잠속으로 끌어당기는 듯한 신비로운 인상주의 음색입니다."
  },
  {
    "id": 165,
    "group": 55,
    "title": "볼레로 (크레셴도 종결부)",
    "composer": "라벨",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Maurice_Ravel_-_Bolero.ogg",
    "trivia": "모든 악기가 한데 뭉쳐 소리의 벽을 형성하고, 마지막 순간 조성을 확 뒤집으며 폭발하듯 질주해 끝을 맺는 타격감이 일품입니다."
  },
  {
    "id": 166,
    "group": 56,
    "title": "죽은 왕녀를 위한 파반느 (관현악)",
    "composer": "라벨",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ravel_Pavane.ogg",
    "trivia": "호른의 아늑한 솔로로 문을 열어 현악기들이 물밀듯 들어와 차갑고 우아한 궁정 무용의 슬픈 아름다움을 연주하는 버전입니다."
  },
  {
    "id": 167,
    "group": 56,
    "title": "짐노페디 1번 (오케스트라)",
    "composer": "에릭 사티",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/db/Erik_Satie_Gymnopedie_1.ogg",
    "trivia": "오보에의 고독한 선율과 현악기의 아주 조용하고 일정한 하강음이, 공허한 방 한구석에 가만히 앉아 명상하는 깊은 휴식을 줍니다."
  },
  {
    "id": 168,
    "group": 56,
    "title": "사랑의 인사 (바이올린 독주)",
    "composer": "엘가",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Elgar_Salut_d_Amour.ogg",
    "trivia": "엘가가 연인에게 바친 가장 스위트하고 아름다운 바이올린 선율이 봄바람을 탄 꽃잎처럼 달콤하게 흩날리는 명곡입니다."
  },
  {
    "id": 169,
    "group": 57,
    "title": "모음곡 행성 중 '금성 (Venus)'",
    "composer": "홀스트",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Holst_The_Planets_Venus.ogg",
    "trivia": "평화를 가져다주는 신 금성을 묘사하여, 호른의 깊은 평화와 현악기의 한없이 조용하고 순결한 평온함이 극치에 이르는 명곡입니다."
  },
  {
    "id": 170,
    "group": 57,
    "title": "랩소디 인 블루 (재즈 밴드)",
    "composer": "거슈윈",
    "era": "근현대",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Gershwin_Rhapsody_in_Blue.ogg",
    "trivia": "클라리넷의 신음하는 듯한 솔로와 피아노 재즈 터치가 미국 뉴욕의 화려한 도시 빌딩 숲과 역동성을 신나게 묘사하는 명곡입니다."
  },
  {
    "id": 171,
    "group": 57,
    "title": "소녀의 기도 (오르골 톤)",
    "composer": "바다르체프스카",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Badarzewska_Maidens_Prayer.ogg",
    "trivia": "소녀의 순수한 기도를 담은 피아노 곡을 더욱 영롱하고 귀여운 오르골 건반 톤으로 따스하고 청아하게 듣는 버전입니다."
  },
  {
    "id": 172,
    "group": 58,
    "title": "꽃노래 (살롱 피아노)",
    "composer": "랑게",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Lange_Flower_Song.ogg",
    "trivia": "19세기 살롱에서 귀부인들이 모여 음악을 즐길 때 연주되던, 우아하고 아기자기한 스타카토와 꽃의 향기를 담은 피아노 소품입니다."
  },
  {
    "id": 173,
    "group": 58,
    "title": "피아노 소나타 16번 (론도 악장)",
    "composer": "모차르트",
    "era": "고전주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Mozart_Piano_Sonata_No_16_Mvt_1.ogg",
    "trivia": "모차르트 특유의 또랑또랑하고 구김살 없는 어린이의 맑은 미소 같은 순수한 선율이 건반 위를 가볍게 미끄러지듯 연주됩니다."
  },
  {
    "id": 174,
    "group": 58,
    "title": "멜로디 F장조 (피아노 독주)",
    "composer": "루빈스타인",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rubinstein_Melody_in_F.ogg",
    "trivia": "양손 건반이 잔잔한 시냇물의 흐름을 그리고, 그 위로 아늑하고 편안한 사랑의 노래가 달콤하게 흘러나오는 명곡입니다."
  },
  {
    "id": 175,
    "group": 59,
    "title": "녹턴 Op. 9 No. 1 (피아노)",
    "composer": "쇼팽",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Chopin_Nocturne_Op_9_No_1.ogg",
    "trivia": "쇼팽이 밤에 작곡한 최초의 야상곡으로, 조용하고 감상적인 쓸쓸함과 아련함이 방 안에 촛불이 켜진 아늑한 무드를 선사합니다."
  },
  {
    "id": 176,
    "group": 59,
    "title": "아라베스크 1번 (피아노)",
    "composer": "드뷔시",
    "era": "인상주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Debussy_Arabesque_1.ogg",
    "trivia": "물결 무늬 아라베스크 선율이 피아노 건반 위로 우아한 곡선을 그리며 연기처럼 부드럽게 솟구쳐 오르는 명곡입니다."
  },
  {
    "id": 177,
    "group": 59,
    "title": "파헬벨 캐논 (피아노 리프)",
    "composer": "파헬벨",
    "era": "바로크",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Johann_Pachelbel_-_Canon_in_D_major.ogg",
    "trivia": "8마디의 평화롭고 신성한 화음이 건반 위에서 끝없이 겹쳐 쌓이며 깊고 숭고한 사랑의 결실을 노래하는 편주곡입니다."
  },
  {
    "id": 178,
    "group": 60,
    "title": "라 캄파넬라 (리스트 피아노)",
    "composer": "리스트",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Liszt_La_Campanella.ogg",
    "trivia": "건반의 가장 높은 옥타브 고음을 빠른 속도로 연타하여, 성당에서 맑고 시리게 번져 나가는 은빛 종소리를 묘사하는 피아노곡입니다."
  },
  {
    "id": 179,
    "group": 60,
    "title": "백조의 호수 중 '왈츠'",
    "composer": "차이콥스키",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Tchaikovsky_-_Nutcracker_Suite_-_8_Waltz_of_the_Flowers.ogg",
    "trivia": "크리스마스 이브날 호두까기 인형을 선물 받은 신비로운 파티장에서 요정들과 장난감들이 춤을 추는 유쾌하고 아름다운 왈츠곡입니다."
  },
  {
    "id": 180,
    "group": 60,
    "title": "개선 행진곡 (아이다 오케스트라)",
    "composer": "베르디",
    "era": "낭만주의",
    "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Verdi_Grand_March_Aida.ogg",
    "trivia": "승리한 영웅 장군들이 이집트 국민들의 뜨거운 연호 속에서 위풍당당하게 행진하며 승리를 예찬하는 장엄한 행진곡입니다."
  }
];

  window.CLASSIC_DATA = CLASSIC_DATA;
})();
