// 관리자/교사 전용 기능 모듈
(function() {

  window.AppAdmin = {

    // ── 계정 일괄 생성 (한 반 전체) ─────────────────────────
    // school: 학교명, grade: 학년, classNum: 반, count: 인원수, namePrefix: 이름 접두어
    bulkCreateStudents: function(school, grade, classNum, count, teacherId) {
      const promises = [];
      for (let i = 1; i <= count; i++) {
        const num = String(i).padStart(2, '0');
        const email = `${grade}-${classNum}-${num}@school.kr`;
        const password = `student${num}`;
        const displayName = `${grade}학년${classNum}반${i}번`;

        const data = {
          email,
          password,
          displayName,
          role: 'student',
          school,
          grade: Number(grade),
          classNum: Number(classNum),
          studentNum: i,
          teacherId: teacherId || null
        };
        promises.push(window.AppAuth.createUser(data).catch(() => null)); // 중복 무시
      }
      return Promise.all(promises).then(results => results.filter(Boolean));
    },

    // ── 반별 학생 학습 통계 집계 ─────────────────────────────
    calcClassStats: function(students) {
      if (!students || students.length === 0) return null;
      const total = students.length;
      const avgPoints = Math.round(students.reduce((s, u) => s + (u.points || 0), 0) / total);
      const quizDone = students.filter(u => (u.quizHistory || []).length > 0).length;
      const badgeCounts = {};
      students.forEach(u => {
        (u.badges || []).forEach(b => {
          badgeCounts[b] = (badgeCounts[b] || 0) + 1;
        });
      });
      return { total, avgPoints, quizDone, quizDoneRate: Math.round(quizDone / total * 100), badgeCounts };
    },

    // ── 이메일 중복 검사 ─────────────────────────────────────
    checkEmailExists: function(email) {
      return window.AppAuth.getAllUsers().then(users => users.some(u => u.email === email));
    }
  };

})();
