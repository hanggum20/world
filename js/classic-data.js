// 100곡의 세계 명곡 클래식 학습용 전체 데이터셋
(function() {
  const CLASSIC_DATA = [
    // ── STAGE 1: 바로크 시대 명곡 (Baroque) ──
    {
      id: 1,
      stage: 1,
      title: "캐논 (Canon in D)",
      composer: "파헬벨",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Johann_Pachelbel_-_Canon_in_D_major.ogg",
      trivia: "세 개의 바이올린과 저음 반주를 위해 작곡된 곡으로, 단순하면서도 아름다운 8마디의 베이스 화음 선율이 끊임없이 반복되며 깊은 감동을 줍니다."
    },
    {
      id: 2,
      stage: 1,
      title: "G선상의 아리아 (Air on the G String)",
      composer: "바흐",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Air_on_the_G_String_by_Bach_violin_synthesizer.ogg",
      trivia: "원래 바흐의 관현악 모음곡 제3번의 일부였으나, 바이올린의 가장 낮고 깊은 소리가 나는 G선 하나만으로 연주할 수 있도록 편곡되어 큰 사랑을 받고 있습니다."
    },
    {
      id: 3,
      stage: 1,
      title: "토카타와 푸가 D단조",
      composer: "바흐",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Toccata_et_Fuga_d-Moll_BWV_565.ogg",
      trivia: "웅장한 파이프오르간 소리로 시작하는 도입부가 매우 강렬하며, 유령이나 긴장감 넘치는 공포 분위기의 대명사로 대중매체에서 자주 쓰이는 걸작입니다."
    },
    {
      id: 4,
      stage: 1,
      title: "미뉴에트 G장조 (Minuet in G)",
      composer: "바흐",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/J.S.Bach_Minuet_in_G.ogg",
      trivia: "바흐가 그의 사랑하는 아내 안나 막달레나를 위해 엮은 음악 수첩에 들어있는 곡으로, 3박자의 우아하고 정겨운 무도곡 선율이 특징입니다."
    },
    {
      id: 5,
      stage: 1,
      title: "무반주 첼로 모음곡 1번 전주곡 (Cello Suite No. 1 Prelude)",
      composer: "바흐",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Johann_Sebastian_Bach_-_Cello_Suite_No._1_in_G_major_-_BWV_1007_-_I._Pr%C3%A9lude.ogg",
      trivia: "반주 없이 오직 첼로 한 대만으로 연주되는 음악으로, 물 흐르듯 잔잔하게 시작하여 첼로가 가진 목가적이고 따뜻한 매력을 극한으로 보여줍니다."
    },
    {
      id: 6,
      stage: 1,
      title: "사계 중 '봄' 1악장",
      composer: "비발디",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_1_Spring_Allegro.ogg",
      trivia: "겨울이 지나고 새들이 노래하며 시냇물이 졸졸 흐르는 따스한 봄날의 활기찬 풍경을 묘사한, 전 세계에서 가장 유명한 바이올린 협주곡입니다."
    },
    {
      id: 7,
      stage: 1,
      title: "사계 중 '여름' 3악장",
      composer: "비발디",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_2_Summer_Presto.ogg",
      trivia: "여름철 갑작스럽게 몰아치는 격렬한 천둥번개와 세찬 폭풍우의 기세를 바이올린의 매우 빠르고 긴박한 연주 기법으로 리얼하게 묘사했습니다."
    },
    {
      id: 8,
      stage: 1,
      title: "사계 중 '가을' 1악장",
      composer: "비발디",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_3_Autumn_Allegro.ogg",
      trivia: "풍성한 수확을 마친 농부들이 기쁨에 넘쳐 춤을 추고 노래하며, 술잔을 나누는 흥겨운 가을 축제의 모습을 경쾌하게 묘사한 곡입니다."
    },
    {
      id: 9,
      stage: 1,
      title: "사계 중 '겨울' 1악장",
      composer: "비발디",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/John_Harrison_-_Vivaldi_-_The_Four_Seasons_-_4_Winter_Allegro_Non_Molto.ogg",
      trivia: "차가운 겨울바람에 몸을 오들오들 떨고 세차게 발을 구르며, 얼음 위를 미끄러지듯 조심조심 걸어가는 추운 겨울날의 정취를 긴장감 있게 표현했습니다."
    },
    {
      id: 10,
      stage: 1,
      title: "메시아 중 '할렐루야' (Hallelujah Chorus)",
      composer: "헨델",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Georg_Friedrich_H%C3%A4ndel_-_Messiah_-_Part_II_-_44_Hallelujah.ogg",
      trivia: "오라토리오 '메시아'의 가장 유명한 합창곡으로, 영국의 국왕 조지 2세가 감동하여 자리에서 일어선 유래에 따라 오늘날에도 청중이 기립하는 전통이 있습니다."
    },

    // ── STAGE 2: 고전주의 시대 명곡 1 (Classical I) ──
    {
      id: 11,
      stage: 2,
      title: "터키 행진곡 (Turkish March)",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Mozart_-_Rondo_alla_Turca.ogg",
      trivia: "당시 유럽에서 유행하던 터키 군악대의 타악기 리듬과 스타일을 피아노 소리로 경쾌하고 이국적으로 표현하여 오늘날 대중에게 매우 친숙한 곡입니다."
    },
    {
      id: 12,
      stage: 2,
      title: "아이네 클라이네 나흐트무지크 1악장",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Wolfgang_Amadeus_Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
      trivia: "'소야곡(작은 밤의 음악)'이라는 뜻을 가진 현악 합주곡으로, 밝고 우아하며 활기찬 멜로디가 넘쳐흘러 귀빈들의 야외 파티나 축제 음악으로 널리 사랑받았습니다."
    },
    {
      id: 13,
      stage: 2,
      title: "교향곡 40번 G단조 1악장",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Wolfgang_Amadeus_Mozart_-_Sinfonie_40_g-moll_-_1._Molto_allegro.ogg",
      trivia: "모차르트가 남긴 단 두 개의 단조 교향곡 중 하나로, 한숨을 쉬는 듯한 서글프면서도 아름다운 질주 선율이 듣는 이의 마음을 단숨에 사로잡습니다."
    },
    {
      id: 14,
      stage: 2,
      title: "피가로의 결혼 서곡",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Mozart_-_Overture_to_the_Marriage_of_Figaro.ogg",
      trivia: "오페라 공연이 시작되기 전에 흥을 돋우는 서곡으로, 단 한 순간도 쉬지 않고 속삭이듯 쉴 새 없이 몰아치는 유쾌하고 분주한 악기들의 연주가 압권입니다."
    },
    {
      id: 15,
      stage: 2,
      title: "반짝반짝 작은 별 변주곡",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Twelve_Variations_on_%22Ah_vous_dirai-je%2C_Maman%22.ogg",
      trivia: "프랑스의 대중 전래 민요인 '아! 어머니께 말씀드릴게요' 테마에 모차르트 특유의 화려하고 천재적인 12가지 변주 기법을 덧붙인 사랑스러운 피아노곡입니다."
    },
    {
      id: 16,
      stage: 2,
      title: "교향곡 94번 '놀람' 2악장",
      composer: "하이든",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Haydn_-_Symphony_No._94_%28Surprise%29_-_II.ogg",
      trivia: "평화롭고 아주 조용하게 연주가 진행되다가, 갑자기 모든 악기가 큰 타악기 소리와 함께 쾅! 하고 울려 음악회에서 졸던 관객들을 깜짝 놀라게 한 유머러스한 곡입니다."
    },
    {
      id: 17,
      stage: 2,
      title: "교향곡 101번 '시계' 2악장",
      composer: "하이든",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Haydn_-_Symphony_No._101_%28Clock%29_-_II.ogg",
      trivia: "바순과 현악기들이 일정한 간격으로 '똑딱똑딱' 소리를 내며 기계 시계가 작동하는 초침 소리를 절묘하게 묘사하여 '시계'라는 별명이 붙었습니다."
    },
    {
      id: 18,
      stage: 2,
      title: "트럼펫 협주곡 E플랫 장조 3악장",
      composer: "하이든",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Haydn_trumpet_concerto_mvt3.ogg",
      trivia: "트럼펫의 화려하고 청아한 독주 기교가 폭발하는 곡으로, 한국에서는 과거 인기 예능 프로그램 '장학퀴즈'의 오프닝 시그널 음악으로 온 국민에게 익숙합니다."
    },
    {
      id: 19,
      stage: 2,
      title: "미뉴에트 (Boccherini Minuet)",
      composer: "보케리니",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Boccherini_-_Minuet.ogg",
      trivia: "귀족들이 가발을 쓰고 궁정에서 사뿐사뿐 춤을 추는 듯한 기품 있고 섬세한 선율을 가진 곡으로, 현악 5중주 특유의 아기자기한 현악 울림이 특징입니다."
    },
    {
      id: 20,
      stage: 2,
      title: "정령들의 춤 (Melodie)",
      composer: "글루크",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Gluck_Orfeo_melodie.ogg",
      trivia: "오페라 '오르페오와 에우리디체' 중 그리스 신화 속 축복받은 사후세계인 에리시온 평원에서 정령들이 평화롭게 춤추는 슬프고도 고결한 플루트 멜로디입니다."
    },

    // ── STAGE 3: 고전주의 시대 명곡 2 (Classical II) ──
    {
      id: 21,
      stage: 3,
      title: "운명 교향곡 1악장 (Symphony No. 5)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Ludwig_van_Beethoven_-_Sinfonia_N._5_in_do_minore_Op._67_-_I._Allegro_con_brio.mp3",
      trivia: "'빠바바밤~' 하고 운명이 문을 두드리는 강렬한 4음 모티브로 시작하여, 청각을 잃어가던 베토벤이 운명의 가혹함에 맞서 불굴의 의지로 극복해 나가는 삶을 그렸습니다."
    },
    {
      id: 22,
      stage: 3,
      title: "엘리제를 위하여 (Für Elise)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ludwig_van_Beethoven_-_Bagatelle_No._25_in_A_minor_-_%22F%C3%BCr_Elise%22.ogg",
      trivia: "전 세계의 전자 피아노나 후진 경보음 등 일상 속에서 가장 흔히 들을 수 있는 소곡으로, 베토벤이 짝사랑했던 여인인 '테레제'의 악필을 잘못 읽어 '엘리제'가 되었다는 설이 유력합니다."
    },
    {
      id: 23,
      stage: 3,
      title: "월광 소나타 1악장 (Moonlight Sonata)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Ludwig_van_Beethoven_-_Sonata_No._14_in_C_sharp_minor_-_Op._27_No._2_-_I._Adagio_sostenuto.ogg",
      trivia: "고요하고 신비로운 피아노 음들이 잔잔히 흐르며, 마치 한밤중 루체른 호수 위에 은은하게 부서져 내리는 차가운 달빛의 흔들림을 묘사하는 듯한 명곡입니다."
    },
    {
      id: 24,
      stage: 3,
      title: "비창 소나타 2악장 (Pathétique Sonata)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Beethoven_Pathetique_2nd_Mvt.ogg",
      trivia: "비장하고 서글픈 감정이 기저에 깔려있으면서도, 한편으로는 세상에서 가장 아늑하고 따뜻하게 마음을 어루만져 주는 듯한 깊은 위로의 멜로디가 펼쳐집니다."
    },
    {
      id: 25,
      stage: 3,
      title: "합창 교향곡 4악장 '환희의 송가'",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Ludwig_van_Beethoven_-_Symphony_No._9_in_D_minor_Op._125_-_IV._Presto_-_Choral.ogg",
      trivia: "인류 역사상 최초로 교향곡에 사람의 목소리(성악 합창)를 도입한 대혁신적 걸작으로, 오늘날 전 인류의 평화와 우애, 화합을 상징하는 전 세계적 노래입니다."
    },
    {
      id: 26,
      stage: 3,
      title: "영웅 교향곡 1악장 (Symphony No. 3)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Beethoven_Symphony_3_Mvt_1_Part_1.ogg",
      trivia: "원래 베토벤이 나폴레옹을 기리기 위해 헌정하려 했으나, 나폴레옹이 스스로 황제에 즉위했다는 소식을 듣고 분노하여 악보 표지를 찢어버렸다는 웅장한 역사적 비화가 있습니다."
    },
    {
      id: 27,
      stage: 3,
      title: "전원 교향곡 1악장 (Symphony No. 6)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Beethoven_-_Symphony_6_-_I._Allegro_ma_non_troppo.ogg",
      trivia: "시끄러운 도시를 벗어나 맑은 공기와 새들의 노랫소리, 목가적이고 평화로운 시골 벌판에 도착했을 때 느끼는 인간의 순수한 기쁨을 소리로 그려낸 자연 예찬곡입니다."
    },
    {
      id: 28,
      stage: 3,
      title: "미뉴에트 G장조 (Minuet in G)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Beethoven_-_Minuet_in_G.ogg",
      trivia: "베토벤이 젊은 시절 작곡한 바이올린과 피아노 소품으로, 고전적인 절제미 속에 친근하고 달콤한 사랑의 대화가 오가는 듯한 경쾌함이 흐릅니다."
    },
    {
      id: 29,
      stage: 3,
      title: "소나티네 Op. 36 No. 1 1악장",
      composer: "클레멘티",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Clementi_Sonatina_36_1_1st_mvt.ogg",
      trivia: "피아노 기초 체르니 단계에서 무조건 거쳐 가는 연습곡으로, 피아노의 맑은 터치감과 또랑또랑한 고전적 화성 진행을 배우기 아주 좋은 교과서 단골 곡입니다."
    },
    {
      id: 30,
      stage: 3,
      title: "레퀴엠 중 '라크리모사' (Lacrimosa)",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Mozart_Requiem_Lacrimosa.ogg",
      trivia: "'눈물의 날'이라는 뜻의 가사로, 모차르트가 이 곡의 8마디째를 쓰다가 미완성으로 눈을 감아 그의 장례식에서 연주되었던 세상에서 가장 슬프고 극적인 진혼곡입니다."
    },

    // ── STAGE 4: 낭만주의 시대 명곡 1 (Romantic I) ──
    {
      id: 31,
      stage: 4,
      title: "마왕 (Erlkönig)",
      composer: "슈베르트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Franz_Schubert_-_Erlk%C3%B6nig.ogg",
      trivia: "괴테의 시를 바탕으로 피아노 선율이 쉴 새 없이 달리는 말발굽 소리를 모사하고, 해설자, 아버지를 안심시키는 아들, 유혹하는 마왕의 4가지 목소리를 1명의 가창자가 극적으로 노래합니다."
    },
    {
      id: 32,
      stage: 4,
      title: "아베 마리아 (Ave Maria)",
      composer: "슈베르트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Franz_Schubert_-_Ave_Maria.ogg",
      trivia: "원래 스콧의 시 '호수의 여인' 중 주인공 엘렌이 곤경에 처해 성모 마리아에게 올리는 기도를 노래한 것으로, 성스럽고 경건하며 온화함이 넘치는 종교적 명곡입니다."
    },
    {
      id: 33,
      stage: 4,
      title: "피아노 5중주 '송어' 4악장",
      composer: "슈베르트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Franz_Schubert_-_Piano_Quintet_in_A_major_-_D._667_-_IV._Andantino.ogg",
      trivia: "맑고 깨끗한 시냇물 속을 쏜살같이 활기차게 헤엄치는 물고기(송어)의 꼬리짓과 튀기는 물방울을 바이올린과 피아노의 아기자기한 스타카토 기법으로 통통 튀게 표현했습니다."
    },
    {
      id: 34,
      stage: 4,
      title: "세레나데 (Serenade)",
      composer: "슈베르트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Franz_Schubert_-_Serenade.ogg",
      trivia: "한여름 밤 사랑하는 연인의 창가 밑에서 부드러운 기타나 만돌린 반주에 맞춰 애틋하게 마음을 고백하며 부르는 낭만적인 밤의 사랑 노래입니다."
    },
    {
      id: 35,
      stage: 4,
      title: "교향곡 8번 '미완성' 1악장",
      composer: "슈베르트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Schubert_Symphony_8_Mvt_1.ogg",
      trivia: "보통 교향곡은 4개 악장으로 구성되지만, 이 곡은 2개 악장만 완성된 채 방치되었습니다. 그럼에도 선율미의 완벽한 조화와 높은 완성도 덕분에 낭만파 최고의 명작으로 손꼽힙니다."
    },
    {
      id: 36,
      stage: 4,
      title: "바이올린 협주곡 E단조 1악장",
      composer: "멘델스존",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mendelssohn_Violin_Concerto_1st_Mvt.ogg",
      trivia: "오케스트라의 긴 서주를 생략하고, 시작하자마자 서정적이고 애절한 바이올린의 독주 고음이 바로 치고 나오는 획기적이고 낭만적인 구성을 가진 최고의 협주곡입니다."
    },
    {
      id: 37,
      stage: 4,
      title: "한여름 밤의 꿈 중 '결혼 행진곡'",
      composer: "멘델스존",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Felix_Mendelssohn_-_Wedding_March_-_Op._61_No._9.ogg",
      trivia: "결혼식장에서 신랑 신부가 행진을 마치고 퇴장할 때 터져 나오는 힘찬 트럼펫 팡파르로 시작하며, 전 세계 예식의 표준이자 축복의 대명사인 밝고 당당한 행진곡입니다."
    },
    {
      id: 38,
      stage: 4,
      title: "노래의 날개 위에 (Auf Flügeln des Gesanges)",
      composer: "멘델스존",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mendelssohn_On_Wings_of_Song.ogg",
      trivia: "하이네의 시에 멘델스존이 감미로운 선율을 붙인 명곡으로, 사랑하는 사람을 노래의 날개에 실어 인도 갱지스강 가의 평화롭고 향기로운 에덴동산으로 데려가겠다는 로맨틱한 내용입니다."
    },
    {
      id: 39,
      stage: 4,
      title: "어린이 정경 중 '꿈 (Traumerei)'",
      composer: "슈만",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Schumann_Traumerei.ogg",
      trivia: "어른이 어릴 적 겪었던 순수한 동심의 시절을 추억하며 회상하는 평화로운 꿈결 같은 멜로디로, 따뜻한 피아노 타건이 마음에 깊은 평안을 선사합니다."
    },
    {
      id: 40,
      stage: 4,
      title: "시인의 사랑 중 '아름다운 5월에'",
      composer: "슈만",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/Schumann_Dichterliebe_1.ogg",
      trivia: "연가곡집의 첫 번째 서곡으로, 만물이 꽃 피어나는 아름다운 계절인 5월에 내 마음에 싹튼 수줍은 첫사랑의 고백을 피아노와 성악의 서정적 대화로 그려냈습니다."
    },

    // ── STAGE 5: 낭만주의 시대 명곡 2 (Romantic II) ──
    {
      id: 41,
      stage: 5,
      title: "야상곡(녹턴) Op. 9 No. 2",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Fr%C3%A9d%C3%A9ric_Chopin_-_Nocturne_in_E_flat_major_Op._9_No._2.ogg",
      trivia: "밤의 감성을 피아노의 물 흐르듯 유려한 데코레이션 선율로 표현했으며, 촛불 밑에서 편안하게 감상하기에 아주 최적화된 쇼팽의 대표적 밤의 시학입니다."
    },
    {
      id: 42,
      stage: 5,
      title: "즉흥환상곡 (Fantaisie-Impromptu)",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Fr%C3%A9d%C3%A9ric_Chopin_-_Fantaisie-Impromptu_in_C_sharp_minor_Op._66.ogg",
      trivia: "왼손의 셋잇단음표 반주 위에 오른손이 매우 빠르게 물방울 튀듯 16분음표를 몰아치며 전개되며, 중간 부분의 감미롭고 부드러운 하강 선율의 대비가 환상적인 최고 인기 곡입니다."
    },
    {
      id: 43,
      stage: 5,
      title: "연습곡 '혁명' (Etude Op. 10 No. 12)",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Fr%C3%A9d%C3%A9ric_Chopin_-_Etude_Op._10_No._12_in_C_minor_-_Revolutionary.ogg",
      trivia: "쇼팽이 고국 폴란드의 혁명 실패와 수도 바르샤바의 함락 소식을 타지에서 듣고 피를 토하는 듯한 절망과 뜨거운 애국심의 분노를 격정적인 타건으로 폭발시킨 연습곡입니다."
    },
    {
      id: 44,
      stage: 5,
      title: "강아지 왈츠 (Minute Waltz)",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Chopin_Minute_Waltz.ogg",
      trivia: "쇼팽의 연인이었던 조르주 상드가 기르던 강아지가 자기 꼬리를 잡으려고 뱅글뱅글 제자리에서 도는 귀여운 모습에 영감을 받아 피아노의 경쾌한 빠른 선율로 스케치했습니다."
    },
    {
      id: 45,
      stage: 5,
      title: "빗방울 전주곡 (Raindrop Prelude)",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Chopin_Raindrop_Prelude.ogg",
      trivia: "수도원 처마 끝에서 일정한 간격으로 뚝, 뚝 떨어지는 빗방울 소리를 가슴 먹먹하고 애조 띤 베이스 음의 일정한 두드림으로 묘사하여 우울한 비 오는 날 듣기 아주 좋습니다."
    },
    {
      id: 46,
      stage: 5,
      title: "영웅 폴로네이즈 (Heroic Polonaise)",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Chopin_Polonaise_Heroic.ogg",
      trivia: "폴란드 민족의 전통 무용인 폴로네이즈 리듬에 조국의 찬란한 옛 영광과 영웅적인 기상을 불어넣은 대작으로, 묵직하고 당당한 포효를 지닌 대규모 피아노곡입니다."
    },
    {
      id: 47,
      stage: 5,
      title: "사랑의 꿈 3번 (Liebestraum No. 3)",
      composer: "리스트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Liszt_Liebestraum_3.ogg",
      trivia: "원래 사랑을 찬미하는 가곡이었으나 피아노 독주곡으로 편곡되며 초대박이 났습니다. 사랑할 수 있는 한 최대한 열정적으로 사랑하라는 감미롭고도 정열적인 후기 낭만파 명곡입니다."
    },
    {
      id: 48,
      stage: 5,
      title: "라 캄파넬라 (La Campanella)",
      composer: "리스트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Liszt_La_Campanella.ogg",
      trivia: "이탈리아어로 '종(Bell)'을 뜻하는 말로, 당대 바이올린 악마였던 파가니니의 연주를 듣고 자극을 받은 리스트가 초인적인 옥타브 도약 기법을 활용해 맑은 종소리를 묘사한 초고난도 곡입니다."
    },
    {
      id: 49,
      stage: 5,
      title: "헝가리 광시곡 2번",
      composer: "리스트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Liszt_Hungarian_Rhapsody_No_2.ogg",
      trivia: "집시들의 독특한 민속 춤곡 리듬을 극대화한 곡으로, 톰과 제리 애니메이션에서 피아노 연주 배틀 장면의 메인 테마곡으로 쓰여 대중에게도 웃음과 친근감을 주는 빠른 템포의 명곡입니다."
    },
    {
      id: 50,
      stage: 5,
      title: "헝가리 무곡 5번",
      composer: "브람스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Brahms_-_Hungarian_Dance_No._5.ogg",
      trivia: "헝가리 집시 음악의 멜로디에 클래식한 세련미를 이식한 곡으로, 템포가 갑자기 엄청나게 빨라졌다가 느려지는 다이내믹한 완급조절이 가슴을 두근거리게 만듭니다."
    },

    // ── STAGE 6: 낭만주의 시대 명곡 3 (Romantic III) ──
    {
      id: 51,
      stage: 6,
      title: "브람스 자장가 (Lullaby)",
      composer: "브람스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Brahms_-_Lullaby.ogg",
      trivia: "브람스가 지인의 아기 탄생을 축하하며 선물한 음악으로, 전 세계 모든 오르골이나 신생아 모빌에서 흘러나오는 세상에서 가장 나른하고 아늑한 잠잠한 평안의 멜로디입니다."
    },
    {
      id: 52,
      stage: 6,
      title: "대학축전 서곡 (Academic Festival Overture)",
      composer: "브람스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Brahms_Academic_Festival_Overture.ogg",
      trivia: "명예 박사학위를 수여한 대학 측에 감사의 뜻으로 선사한 곡으로, 진중한 브람스답지 않게 당시 대학가 유흥가에서 부르던 신나는 대학생 술노래들을 절묘하게 믹스해 매우 발랄합니다."
    },
    {
      id: 53,
      stage: 6,
      title: "교향곡 6번 '비창' 1악장",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Tchaikovsky_Symphony_6_Mvt_1.ogg",
      trivia: "작곡가 본인이 '나의 모든 영혼을 쏟아부었으며 생애 최고의 명작'이라 칭한 비장한 교향곡으로, 인간이 맞이하는 최후의 절망과 깊은 한숨의 우울함이 선율 곳곳에 짙게 베여 있습니다."
    },
    {
      id: 54,
      stage: 6,
      title: "피아노 협주곡 1번 1악장",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tchaikovsky_Piano_Concerto_1_Mvt_1_Part_1.ogg",
      trivia: "시작하자마자 호른의 우렁찬 팡파르와 함께 피아노가 오케스트라의 강력한 포효 위로 화려한 옥타브 화음을 때려 박으며 장엄하게 질주하는, 피아노 협주곡 역사의 정점입니다."
    },
    {
      id: 55,
      stage: 6,
      title: "바이올린 협주곡 D장조 1악장",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Tchaikovsky_Violin_Concerto_1st_Mvt.ogg",
      trivia: "초연 당시 바이올린의 난이도가 너무나 말도 안 되게 파격적이어서 '연주 불가능한 엽기적 곡'이라는 악평을 들었으나, 오늘날에는 극강의 기교와 러시아풍 우수를 가득 담아 세계 4대 바이올린 협주곡으로 꼽힙니다."
    },
    {
      id: 56,
      stage: 6,
      title: "1812년 서곡 (1812 Overture)",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Tchaikovsky_1812_Overture.ogg",
      trivia: "나폴레옹 군대의 침공을 러시아 민중들이 목숨 바쳐 격퇴한 전쟁을 묘사한 축제 서곡으로, 곡의 절정 부분에서 오케스트라 악기 대신 **실제 대포(Cannon)**를 대포 소리로 발사하는 엄청난 스케일을 자랑합니다."
    },
    {
      id: 57,
      stage: 6,
      title: "동물의 사육제 중 '백조'",
      composer: "생상스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Saint-Sa%C3%ABns_-_Carnival_of_the_Animals_-_13_The_Swan.ogg",
      trivia: "잔잔하고 맑은 호수 위를 미끄러지듯 소리 없이 우아하게 헤엄쳐 나가는 백조의 고귀한 날갯짓을 첼로의 길게 늘어지는 중저음 선율과 피아노의 물결 반주로 아름답게 묘사했습니다."
    },
    {
      id: 58,
      stage: 6,
      title: "동물의 사육제 중 '수족관'",
      composer: "생상스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Saint-Saens_Aquarium.ogg",
      trivia: "유리관 수족관 속에서 형형색색의 예쁜 물고기들이 은빛 물방울을 뿜어내며 신비롭게 헤엄치는 정경을 실로폰과 첼레스타의 차갑고 반짝이는 소리로 절묘하게 스케치했습니다."
    },
    {
      id: 59,
      stage: 6,
      title: "죽음의 무도 (Danse Macabre)",
      composer: "생상스",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Saint-Saens_Danse_Macabre.ogg",
      trivia: "할로윈처럼 깊은 한밤중 공동묘지에서 죽음의 사신이 바이올린 불협화음을 켜자, 무덤에서 해골들이 깨어나 새벽 닭이 울 때까지 기괴하고 광란의 춤을 춘다는 환상적인 묘사 음악입니다."
    },
    {
      id: 60,
      stage: 6,
      title: "레퀴엠 중 '진노의 날' (Dies Irae)",
      composer: "베르디",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Verdi_Dies_Irae.ogg",
      trivia: "최후의 심판 날에 하늘이 무너지고 땅이 갈라지며 모든 죄인들이 공포에 질려 비명을 지르는 대재앙의 순간을 오케스트라의 강력한 큰북 타격과 폭포수 합창으로 극대화했습니다."
    },

    // ── STAGE 7: 국민악파 명곡 (Nationalist) ──
    {
      id: 61,
      stage: 7,
      title: "페르 귄트 중 '아침 기분'",
      composer: "그리그",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Edvard_Grieg_-_Peer_Gynt_Suite_No._1_-_I._Morning_Mood.ogg",
      trivia: "어슴푸레한 새벽안개가 걷히며 아침 해가 떠오르고, 맑은 새들의 속삭임과 싱그러운 아침이슬이 맺히는 자연의 첫 시작을 플루트와 오보에의 목가적 선율로 평화롭게 연주합니다."
    },
    {
      id: 62,
      stage: 7,
      title: "페르 귄트 중 '산속 마왕의 궁전에서'",
      composer: "그리그",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Edvard_Grieg_-_Peer_Gynt_Suite_No._1_-_IV._In_the_Hall_of_the_Mountain_King.ogg",
      trivia: "동굴 속 마왕의 부하 괴물들이 주인공 페르귄트를 잡기 위해 조용히 포위망을 좁혀오다가, 끝내 발견하고 떼 지어 쫓아가며 미친 듯 소동을 피우는 과정을 아주 빠른 가속도(Crescendo) 연주로 그렸습니다."
    },
    {
      id: 63,
      stage: 7,
      title: "피아노 협주곡 A단조 1악장",
      composer: "그리그",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Grieg_Piano_Concerto_1st_Mvt.ogg",
      trivia: "피아노가 쾅! 치는 강력한 폭포수 낙하 음으로 힘차게 포문을 여는 북유럽 노르웨이의 차가운 만년설과 웅장한 피오르드 협곡의 자연 기상을 가득 담은 민족주의 대표 명곡입니다."
    },
    {
      id: 64,
      stage: 7,
      title: "교향시 '핀란디아' (Finlandia)",
      composer: "시벨리우스",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Sibelius_Finlandia.ogg",
      trivia: "러시아 제국의 압제와 지배 속에서 고통받던 핀란드 민중의 애국심을 고취하기 위해 작곡된 감격스러운 곡으로, 고결한 찬송가풍 선율은 오늘날 핀란드의 제2의 애국가로 추앙받습니다."
    },
    {
      id: 65,
      stage: 7,
      title: "나의 조국 중 '몰다우 강'",
      composer: "스메타나",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Smetana_Moldau.ogg",
      trivia: "보헤미아 숲속의 작은 샘물에서 출발하여 점차 큰 강을 이루고, 프라하 시내를 굽이쳐 장엄하게 흘러가는 조국의 몰다우 강줄기를 아름답고 서정적인 물결 멜로디로 노래했습니다."
    },
    {
      id: 66,
      stage: 7,
      title: "교향곡 9번 '신세계로부터' 2악장 (Largo)",
      composer: "드보르자크",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dvorak_Symphony_9_Mvt_2.ogg",
      trivia: "드보르자크가 고향 체코를 떠나 미국(신세계) 체류 중 고향에 대한 지독한 향수와 외로움을 잉글리시 호른의 구슬프고 따뜻한 민요조 선율에 실어 보낸 '고향 생각' 음악입니다."
    },
    {
      id: 67,
      stage: 7,
      title: "교향곡 9번 '신세계로부터' 4악장",
      composer: "드보르자크",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dvorak_Symphony_9_Mvt_4.ogg",
      trivia: "영화 죠스(Jaws)의 상어 등장이 연상되는 팽팽하고 긴박한 서주로 시작하여, 금관악기들이 뿜어내는 호쾌한 기차 질주 멜로디가 낭만주의 시대 오케스트라 파워의 극치를 보여줍니다."
    },
    {
      id: 68,
      stage: 7,
      title: "드보르자크 유모레스크 (Humoresque)",
      composer: "드보르자크",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dvorak_Humoresque.ogg",
      trivia: "원래 '기발하고 유쾌한 소곡'이라는 뜻으로, 사뿐사뿐 가볍게 산책을 하며 가벼운 스텝을 밟는 듯 깡총거리는 아기자기한 당김음 멜로디가 매우 사랑스러운 곡입니다."
    },
    {
      id: 69,
      stage: 7,
      title: "전람회의 그림 중 '프롬나드'",
      composer: "무소르그스키",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Mussorgsky_Promenade.ogg",
      trivia: "전시회장(전람회)에 들어가 그림 액자 앞을 천천히 걸어 다니며 구경하는 관람객의 발걸음을 장엄하고 담백한 트럼펫 솔로와 금관 팡파르 리듬으로 사실적으로 표현했습니다."
    },
    {
      id: 70,
      stage: 7,
      title: "왕벌의 비행 (Flight of the Bumblebee)",
      composer: "림스키코르사코프",
      era: "국민악파",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Rimsky-Korsakov_Flight_of_the_Bumblebee.ogg",
      trivia: "커다란 왕벌 한 마리가 귓가 주위를 '윙윙윙윙' 소리를 내며 정신없이 날아다니는 묘사를 반음계 형식의 엄청나게 빠른 16분음표 연속 연주로 재미있고 유쾌하게 극화했습니다."
    },

    // ── STAGE 8: 인상주의 및 근현대 명곡 (Impressionist/Modern) ──
    {
      id: 71,
      stage: 8,
      title: "달빛 (Clair de Lune)",
      composer: "드뷔시",
      era: "인상주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Claude_Debussy_-_Clair_de_Lune.ogg",
      trivia: "조성이 모호하고 몽환적인 멜로디가 피아노 건반 위에서 물안개처럼 피어오르며, 구름 사이에 숨었다 나타났다 하는 은은하고 신비한 달빛의 색채를 소리의 명암으로 그려냈습니다."
    },
    {
      id: 72,
      stage: 8,
      title: "목신의 오후에의 전주곡",
      composer: "드뷔시",
      era: "인상주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Debussy_Prelude_Faune.ogg",
      trivia: "시인 말라르메의 시에 영감을 받은 곡으로, 더운 여름날 오후 숲속 그늘에서 나른한 잠에 취한 반인반수의 목신(Faun)이 피리를 불며 몽상에 잠기는 노곤하고 몽환적인 꿈결을 표현했습니다."
    },
    {
      id: 73,
      stage: 8,
      title: "볼레로 (Bolero)",
      composer: "라벨",
      era: "인상주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Maurice_Ravel_-_Bolero.ogg",
      trivia: "시작부터 끝까지 스네어 드럼이 똑같은 스페인 민속 리듬을 169번 반복하는 동안, 악기들이 하나둘 늘어나며 점차 거대해져 최후에는 폭발적인 음량(Crescendo)으로 터져 나오는 최강의 중독성 음악입니다."
    },
    {
      id: 74,
      stage: 8,
      title: "죽은 왕녀를 위한 파반느",
      composer: "라벨",
      era: "인상주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ravel_Pavane.ogg",
      trivia: "스페인 궁정 화가 벨라스케스의 그림 속 어린 공주의 초상화에 영감을 받아 작곡된 곡으로, 공주의 죽음을 슬퍼하기보다 옛날 스페인 궁정에서 우아하게 춤추던 공주의 모습을 추억하는 우아하고 품위 있는 슬픔입니다."
    },
    {
      id: 75,
      stage: 8,
      title: "짐노페디 1번 (Gymnopedie No. 1)",
      composer: "에릭 사티",
      era: "근현대",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/Erik_Satie_Gymnopedie_1.ogg",
      trivia: "가구처럼 일상에 조용히 묻혀 존재하는 '가구 음악'의 효시로, 매우 느리고 단조로우며 공간감이 넓은 피아노 터치가 지친 현대인들의 마음을 아무 생각 없이 쉬게 해주는 최고의 힐링 음악입니다."
    },
    {
      id: 76,
      stage: 8,
      title: "위풍당당 행진곡 1번",
      composer: "엘가",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Edward_Elgar_-_Pomp_and_Circumstance_March_No._1.ogg",
      trivia: "과거 대영제국의 번영을 예찬하는 품격 있고 장중한 행진곡으로, 중간 부분의 드넓고 희망찬 '희망과 영광의 나라' 멜로디는 현재도 각종 졸업식이나 대형 축제 행사에서 무조건 연주되는 애국적 행진곡입니다."
    },
    {
      id: 77,
      stage: 8,
      title: "사랑의 인사 (Salut d'Amour)",
      composer: "엘가",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Elgar_Salut_d_Amour.ogg",
      trivia: "엘가가 사랑하는 아내 앨리스와의 약혼을 기념하며 바친 로맨틱한 소품으로, 따뜻하고 정겨운 바이올린 멜로디가 마치 속삭이듯 사랑의 인사를 상냥하게 건네는 듯합니다."
    },
    {
      id: 78,
      stage: 8,
      title: "모음곡 행성 중 '목성 (Jupiter)'",
      composer: "홀스트",
      era: "근현대",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gustav_Holst_-_The_Planets_-_Jupiter.ogg",
      trivia: "기쁨을 가져다주는 신 목성을 예찬하는 대규모 관현악곡으로, 웅장하고 쾌활하게 달리다가 중간에 터져 나오는 가슴을 울리는 광활한 찬가 선율은 애국가나 종교 찬송가로 널리 가창됩니다."
    },
    {
      id: 79,
      stage: 8,
      title: "불새 조곡 중 마왕의 죽음의 춤",
      composer: "스트라빈스키",
      era: "근현대",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Stravinsky_Firebird.ogg",
      trivia: "러시아 민담을 바탕으로 한 발레 음악으로, 불새의 마법에 걸린 사악한 마왕과 괴물들이 자신들의 의지와 상관없이 미친 듯 지쳐 쓰러질 때까지 춤을 추는 야만적이고 원시적인 타악기 타격음이 충격적입니다."
    },
    {
      id: 80,
      stage: 8,
      title: "랩소디 인 블루 (Rhapsody in Blue)",
      composer: "거슈윈",
      era: "근현대",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Gershwin_Rhapsody_in_Blue.ogg",
      trivia: "클래식 오케스트라 사운드에 미국 흑인들의 즉흥 재즈(Jazz)와 블루스 감성을 완벽하게 융합시킨 대명작으로, 도입부의 클라리넷이 하늘 위로 길게 울부짖는 글리산도 연주가 트레이드 마크입니다."
    },

    // ── STAGE 9: 피아노 명곡선 (Piano Masterpieces) ──
    {
      id: 81,
      stage: 9,
      title: "소녀의 기도 (A Maiden's Prayer)",
      composer: "바다르체프스카",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Badarzewska_Maidens_Prayer.ogg",
      trivia: "폴란드의 무명 18세 소녀 작곡가가 남긴 기적 같은 소품으로, 은방울이 굴러가는 듯 영롱하고 아름다운 트레몰로 아르페지오 음색이 소박하면서도 가슴을 깨끗하게 비춰 줍니다."
    },
    {
      id: 82,
      stage: 9,
      title: "꽃노래 (Blumenlied)",
      composer: "랑게",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Lange_Flower_Song.ogg",
      trivia: "가정용 살롱 피아노 명곡의 대명사로, 봄날 들판에 핀 예쁜 꽃들이 바람에 살랑살랑 춤추는 듯 우아하고 달콤하며, 귀여운 스타카토 선율이 매력 포인트입니다."
    },
    {
      id: 83,
      stage: 9,
      title: "피아노 소나타 16번 C장조 1악장",
      composer: "모차르트",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Mozart_Piano_Sonata_No_16_Mvt_1.ogg",
      trivia: "모차르트 스스로 '초보자를 위한 쉬운 소나타'라고 적었으나, 실제 연주 시 흠 하나 없이 맑고 고르게 치기가 대단히 까다로운 곡으로, 맑은 시냇물 같은 고전 피아노의 투명함을 가졌습니다."
    },
    {
      id: 84,
      stage: 9,
      title: "엘리제를 위하여 (Piano Solo)",
      composer: "베토벤",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ludwig_van_Beethoven_-_Bagatelle_No._25_in_A_minor_-_%22F%C3%BCr_Elise%22.ogg",
      trivia: "피아노 학원 기초 단계를 지나면 남녀노소 누구나 한 번쯤 건반 위에서 쳐보는 국민 연습곡으로, 고즈넉한 A단조 선율 속에 숨겨진 베토벤의 애틋한 고백이 담겨 있습니다."
    },
    {
      id: 85,
      stage: 9,
      title: "멜로디 F장조 (Melody in F)",
      composer: "루빈스타인",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rubinstein_Melody_in_F.ogg",
      trivia: "19세기 러시아 피아노 전설 루빈스타인의 대표 소곡으로, 양손의 가운데 손가락들이 얽히며 만들어내는 잔잔하고 따뜻하며 서정성이 가득 찬 살롱 멜로디가 편안함을 안겨줍니다."
    },
    {
      id: 86,
      stage: 9,
      title: "왈츠 Op. 64 No. 2 C# 단조",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Chopin_Waltz_Op_64_No_2.ogg",
      trivia: "화려한 춤을 추기 위한 무도회 곡이라기보다, 쇼팽 특유의 병약하고 시적인 감성이 가득 베인 쓸쓸하고 우수 어린 선율로 시작하여 빠르게 회전하며 고조되는 대비가 슬프도록 아릅답습니다."
    },
    {
      id: 87,
      stage: 9,
      title: "녹턴 Op. 9 No. 1 Bb 단조",
      composer: "쇼팽",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Chopin_Nocturne_Op_9_No_1.ogg",
      trivia: "매우 대중적인 2번에 가려져 있으나, 쇼팽 녹턴 예술의 진수를 담은 처연하고 외로운 밤의 명곡으로, 오른손이 흘러내리듯 고독하게 울부짖는 피아노 장식음들이 무척이나 아름답습니다."
    },
    {
      id: 88,
      stage: 9,
      title: "아라베스크 1번 (Arabesque No. 1)",
      composer: "드뷔시",
      era: "인상주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Debussy_Arabesque_1.ogg",
      trivia: "'아라비아풍의 장식 문양'이라는 뜻의 미술 용어로, 피아노 오른손과 왼손의 다른 박자 비율이 얽히며 마치 정원의 넝쿨 식물이 곡선으로 뻗어나가는 듯한 입체적 묘사를 담았습니다."
    },
    {
      id: 90,
      stage: 9,
      title: "파헬벨 캐논 (Piano Solo Arrangement)",
      composer: "파헬벨",
      era: "바로크",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Johann_Pachelbel_-_Canon_in_D_major.ogg",
      trivia: "클래식 캐논의 원곡 오케스트라 앙상블을 피아노 한 대의 넓은 건반 울림으로 고즈넉하게 재해석하여 한층 더 포근하고 아름다운 정취를 주는 편곡 버전입니다."
    },
    {
      id: 89,
      stage: 9,
      title: "라 캄파넬라 (Piano Solo - Liszt)",
      composer: "리스트",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Liszt_La_Campanella.ogg",
      trivia: "새벽녘 정적을 깨우며 멀리 성당 꼭대기에서 맑게 울려 펴지는 청아한 종소리를 피아노의 가장 높은 고음 건반 연타와 화려한 기교로 눈이 부시도록 세련되게 모사했습니다."
    },

    // ── STAGE 10: 오페라 및 발레 명곡 (Opera & Ballet) ──
    {
      id: 91,
      stage: 10,
      title: "카르멘 중 '투우사의 노래'",
      composer: "비제",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Georges_Bizet_-_Carmen_-_Act_II_-_Toreador_Song.ogg",
      trivia: "투우장에 위풍당당하게 입장하여 소와 사투를 벌이는 투우사 에스카밀리오의 용맹한 기상과 관중들의 뜨거운 함성을 씩씩하고 박진감 넘치게 노래한 최고의 아리아입니다."
    },
    {
      id: 92,
      stage: 10,
      title: "카르멘 중 '하바네라'",
      composer: "비제",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Georges_Bizet_-_Carmen_-_Act_I_-_Habanera.ogg",
      trivia: "치명적인 매력을 지닌 집시 여인 카르멘이 미련한 군인 돈 호세를 유혹하며 부르는 농염하고 이국적인 쿠바풍 춤 노래로, '사랑은 길들이지 않는 거역하는 새와 같다'는 가사가 유명합니다."
    },
    {
      id: 93,
      stage: 10,
      title: "빌헬름 텔 서곡 (William Tell Overture)",
      composer: "로시니",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Gioachino_Rossini_-_William_Tell_Overture.ogg",
      trivia: "스위스 의적 빌헬름 텔이 폭정에 맞서 싸우는 활약상을 묘사한 서곡으로, 트럼펫의 힘찬 팡파르와 함께 질주하는 종결부 멜로디는 전 세계 기병대 돌격의 시그널 음악입니다."
    },
    {
      id: 94,
      stage: 10,
      title: "세비야의 이발사 서곡",
      composer: "로시니",
      era: "고전주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Gioachino_Rossini_-_The_Barber_of_Seville_-_Overture.ogg",
      trivia: "로시니 특유의 유쾌하고 쾌활한 음악 스타일이 폭발하는 서곡으로, 작은 소리에서 점차 악기들이 더해지며 거대하게 부풀어 오르는 '로시니 크레셴도'의 유쾌한 장난기를 느낄 수 있습니다."
    },
    {
      id: 95,
      stage: 10,
      title: "아름답고 푸른 도나우강",
      composer: "요한 슈트라우스 2세",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Johann_Strauss_II_-_The_Blue_Danube.ogg",
      trivia: "매년 오스트리아 빈 신년 음악회의 단골 앙코르곡이자 왈츠의 황제 요한 슈트라우스 2세의 최대 히트작으로, 도나우강의 도도한 흐름을 사뿐거리는 3박자 왈츠 리듬에 실어 표현했습니다."
    },
    {
      id: 96,
      stage: 10,
      title: "지옥의 오르페우스 중 '캉캉' (Can-Can)",
      composer: "오펜바흐",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Offenbach_Can-Can.ogg",
      trivia: "치마를 들치며 다리를 높이 차올리는 프랑스의 열정적인 댄스 캉캉의 시그널 곡으로, 템포가 상상을 초월하게 빨라지며 정신을 아득하게 만드는 코믹하고 신나는 춤곡입니다."
    },
    {
      id: 97,
      stage: 10,
      title: "발키리의 기행 (Ride of the Valkyries)",
      composer: "바그너",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Richard_Wagner_-_Ride_of_the_Valkyries.ogg",
      trivia: "오페라 '니벨룽의 반지' 중 전장의 여신 발키리 전사들이 날개 달린 말을 타고 전선 위 하늘을 맹렬히 날아다니는 장면으로, 영화 '지옥의 묵시록' 헬기 공습 씬에 쓰여 압도적인 위압감을 선사합니다."
    },
    {
      id: 98,
      stage: 10,
      title: "호두까기 인형 중 '꽃의 왈츠'",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Tchaikovsky_-_Nutcracker_Suite_-_8_Waltz_of_the_Flowers.ogg",
      trivia: "하프의 화려하고 꿈결 같은 독주 카덴차로 시작하여, 사탕 과자의 나라 축제에서 꽃 요정들이 한데 어우러져 화려하고 풍성하게 원을 그리며 왈츠 춤을 추는 크리스마스 단골 곡입니다."
    },
    {
      id: 99,
      stage: 10,
      title: "백조의 호수 중 '정경 (Scene)'",
      composer: "차이콥스키",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Tchaikovsky_-_Swan_Lake_-_Act_II_Scene_10.ogg",
      trivia: "오보에가 호수 위를 떠다니는 가련한 백조(오데트 공주)의 슬프고 애절한 주제 멜로디를 불고, 뒤이어 하프의 잔잔한 물결이 넘실대며 발레 역사상 가장 신비로운 호수의 밤 분위기를 그립니다."
    },
    {
      id: 100,
      stage: 10,
      title: "아이다 중 '개선 행진곡' (Grand March)",
      composer: "베르디",
      era: "낭만주의",
      audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Verdi_Grand_March_Aida.ogg",
      trivia: "이집트 군대의 승리를 축하하며 입장하는 개선 행진 장면의 대작으로, 특별히 고안된 긴 나팔 모양의 '아이다 트럼펫'이 내지르는 우렁차고 찬란한 멜로디가 전율을 선사합니다."
    }
  ];

  window.CLASSIC_DATA = CLASSIC_DATA;
})();
