const users = ["rishabhjakhar04", "AdvikGupta2005", "BhattAkshat", "garvit4356", "udaypandita2005", "RobinHood_1803", "Mokshmalik999", "Eklavya_sharma", "Siddharth_kalra05", "HARDIK_ARORA_16", "tanmaygakhar", "_ishaaann_", "tanishqgoyal470"];
const realNames = {
  "rishabhjakhar04": "Rishabh Jakhar",
  "AdvikGupta2005": "Advik Gupta",
  "BhattAkshat": "Akshat Bhatt",
  "garvit4356": "Garvit Yadav",
  "udaypandita2005": "Uday Pandita",
  "RobinHood_1803": "Nitesh",
  "Mokshmalik999": "Moksh Malik",
  "Eklavya_sharma": "Eklavya Sharma",
  "Siddharth_kalra05": "Siddharth Kalra",
  "HARDIK_ARORA_16": "Hardik Arora",
  "tanmaygakhar": "Tanmay Gakhar",
  "_ishaaann_": "Ishaan",
  "tanishqgoyal470": "Tanishq Goyal"
};
const cards = document.getElementById("profiles");
//const refresh = document.getElementById("refreshBtn");

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
    //console.log("Checking day:",today-i*86400);
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
  const today = Math.floor(Date.now()/1000/86400)*86400;
  return !!cal[today];
}

async function showCards() {
  cards.innerHTML="<p>Loading...</p>";
  const all=await Promise.all(users.map(async u => {
    const stat=await getStats(u);
    let recent=[];
    if (!stat.error){
      try{
        recent=await Promise.race([
        getRecent(u),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")), 4000))
        ]);
      } catch (e) {
        recent = [];
      }
    }
    return { ...stat, recent };
  }));
  cards.innerHTML = "";
  all.forEach(data => {
    const {user,totalSolved,easySolved,mediumSolved,hardSolved,submissionCalendar,recent,error}=data;
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
        <h3><a href="https://leetcode.com/${user}" target="_blank">${userName}</a></h3>
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
//refresh.addEventListener("click", showCards);
showCards();
