const users = ["rishabhjakhar04", "AdvikGupta2005", "BhattAkshat", "garvit4356", "udaypandita2005", "RobinHood_1803", "Mokshmalik999", "Eklavya_sharma", "Siddharth_kalra05", "HARDIK_ARORA_16", "tanmaygakhar", "_ishaaann_"];
const cards = document.getElementById("profiles");
const refresh = document.getElementById("refreshBtn");

async function getStats(user) {
  const res =await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
  if (!res.ok) {
    return {user,error:true};
  }
  const data= await res.json();
  data.user =user;
  return data;
}

function getStreak(cal) {
  const today=Math.floor(Date.now()/1000/86400)*86400;
  let streak=0;
  for (let i=0;i<1000;i++) {
    const day = today-i*86400;
    if (cal[day]) {
      streak++;
    } else {
      if (i!==0) break;
    }
  }
  return streak;
}

function lastSolved(cal) {
  const times=Object.keys(cal).map(Number);
  const last=Math.max(...times);
  const date=new Date(last * 1000);
  return date.toDateString();
}

async function getRecent(user, n=3) {
  const res=await fetch(`https://alfa-leetcode-api.onrender.com/${user}/acSubmission?limit=${n}`);
  if (!res.ok) return [];
  const json=await res.json();
  return json.submission || [];
}

function solvedToday(cal) {
  const now=new Date();
  const ist=new Date(now.getTime() + (5.5 * 60 * 60000));
  if (ist.getHours()<5 || (ist.getHours()===5 && ist.getMinutes()<30)) {
    ist.setDate(ist.getDate()-1);
  }
  const day=Math.floor(ist.getTime()/1000/86400)*86400;
  return !!cal[day];
}

async function showCards() {
  cards.innerHTML="<p>Loading...</p>";
  const all=await Promise.all(users.map(async u => {
    const stat=await getStats(u);
    const recent=(stat.error ? []:await getRecent(u));
    return { ...stat, recent };
  }));
  cards.innerHTML= "";
  all.forEach(data => {
    const { user, totalSolved, easySolved, mediumSolved, hardSolved, submissionCalendar, recent, error } = data;
    if (error) {
      cards.innerHTML+=`<div class="card not-done"><h3>${user}</h3><p>❌ Could not load data.</p></div>`;
      return;
    }
    const glow=solvedToday(submissionCalendar || {}) ? "done-today" : "not-done";
    const streak=getStreak(submissionCalendar || {});
    const recentHtml = recent.map(q => {
      const link = `https://leetcode.com/problems/${q.titleSlug}`;
      return `
        <div class="recent-item">
          <a href="${link}" target="_blank"><strong>${q.title}</strong></a>
          <span class="tag">${q.lang}</span>
        </div>`;
    }).join("");
    cards.innerHTML += `
      <div class="card ${glow}">
        <h3><a href="https://leetcode.com/${user}" target="_blank">${user}</a></h3>
        <p><strong>Total Solved:</strong> ${totalSolved}</p>
        <p>Easy: ${easySolved}, Medium: ${mediumSolved}, Hard: ${hardSolved}</p>
        <p><strong>Streak:</strong> ${streak} days</p>
        <div class="recent-list">
          <p><strong>Last 3 solved:</strong></p>
          ${recentHtml}
        </div>
      </div>`;
  });
}
refresh.addEventListener("click", showCards);
showCards();
