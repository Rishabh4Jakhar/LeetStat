const users = ["rishabhjakhar04", "AdvikGupta2005", "BhattAkshat", "garvit4356", "udaypandita2005", "RobinHood_1803", "Mokshmalik999", "Eklavya_sharma", "Siddharth_kalra05", "HARDIK_ARORA_16", "tanmaygakhar", "_ishaaann_", "tanishqgoyal470", "ModitMalhotra", "timmiii", "nityaagoel","namit23340"];
const realNames = {
  "rishabhjakhar04": "Rishabh Jakhar",
  "AdvikGupta2005": "Advik Gupta",
  "BhattAkshat": "Akshat Bhatt",
  "garvit4356": "Garvit Yadav",
  "udaypandita2005": "Uday Pandita",
  "RobinHood_1803": "Sonal",
  "Mokshmalik999": "Moksh Malik",
  "Eklavya_sharma": "Eklavya Sharma",
  "Siddharth_kalra05": "Siddharth Kalra",
  "HARDIK_ARORA_16": "Hardik Arora",
  "tanmaygakhar": "Tanmay Gakhar",
  "_ishaaann_": "Ishaan",
  "tanishqgoyal470": "Tanishq Goyal",
  "ModitMalhotra": "Modit Malhotra",
  "timmiii": "Tanisha Thrower (TT)",
  "nityaagoel": "Nityaa",
  "namit23340": "Namit Bajaj"
};
const cards = document.getElementById("profiles");
let cache = {};

async function getStats(user) {
  try {
    const res =await fetch(`https://leetcode-stats.tashif.codes/${user}/profile`);
    const data = await res.json();
    if (data.status!=="success") {
      return {user,error:true};
    }
    const stats=data.submitStats.acSubmissionNum;
    return {
      user: user,
      totalSolved: stats[0].count,
      easySolved: stats[1].count,
      mediumSolved: stats[2].count,
      hardSolved: stats[3].count,
      submissionCalendar: data.submissionCalendar,
      recent: data.recentSubmissions.slice(0,3),
      avatar: data.profile.userAvatar,
      error: false      
    };
  } catch {
    return {user,error:true};
  }
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


function solvedToday(cal) {
  const today = Math.floor(Date.now()/1000/86400)*86400;
  return !!cal[today];
}

async function loadData() {
  cards.innerHTML="<p>Loading...</p>";
  cache=await Promise.all(users.map(async u => {
    const stat=await getStats(u);
    return stat;
  }));
  renderCards(cache);
}

function renderCards(all=cache) {
  const sortType=document.getElementById("sortSelect").value;
  if (sortType!=="default") {
    all.sort((a, b) => {
      switch (sortType) {
        case "total":
          return b.totalSolved - a.totalSolved;
        case "easy":
          return b.easySolved - a.easySolved;
        case "medium":
          return b.mediumSolved - a.mediumSolved;
        case "hard":
          return b.hardSolved - a.hardSolved;
        case "streak":
          return getStreak(b.submissionCalendar || {}) - getStreak(a.submissionCalendar || {});
        default:
          return 0;
      }
    });
  }
  cards.innerHTML = "";
  all.forEach(data => {
    const {user,totalSolved,easySolved,mediumSolved,hardSolved,submissionCalendar,recent,avatar,error}=data;
    const userName = realNames[user]||user;
    if (error){
      cards.innerHTML+=`<div class="card not-done"><h3>${userName}</h3><p>❌ Could not load data.</p></div>`;
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
        <div class="card-header">
        <h3><a href="https://leetcode.com/${user}" target="_blank">${userName}</a></h3>
        <img src="${avatar}" class="avatar ${glow}">
        </div>
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

loadData();
document.getElementById("sortSelect").addEventListener("change", () => {
  renderCards();
});
