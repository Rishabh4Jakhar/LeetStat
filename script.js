//const users = ["garvit4356"] // Test
const users = ["rishabhjakhar04", "AdvikGupta2005", "BhattAkshat", "garvit4356", "udaypandita2005", "RobinHood_1803", "Mokshmalik999", "Eklavya_sharma", "Siddharth_kalra05", "HARDIK_ARORA_16", "tanmaygakhar", "_ishaaann_", "tanishqgoyal470", "ModitMalhotra", "timmiii", "nityaagoel","namit23340","mrfate","RuSKie147","diviirockgod6","aryan23143", "yay-code", "aryantayal05"];
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
  "timmiii": "Tanisha Thrower (TR)",
  "nityaagoel": "Nityaa",
  "namit23340": "Namit Bajaj",
  "mrfate": "Avi Avinav",
  "RuSKie147": "Raj S. K.",
  "diviirockgod6": "Divyansh K. G.",
  "aryan23143": "Aryan Dutt",
  "yay-code": "Akshit Bansal",
  "aryantayal05": "Aryan Tayal"
};
const cards = document.getElementById("profiles");
let cache = {};

async function getStats(user) {
  try {
    const res =await fetch(`https://leetcode-stats.tashif.codes/${user}/profile`);
    const data = await res.json();
    if (data.status!=="success") {
      console.error(`Error fetching data for ${user}:`, data.message);
      return {user,error:true};
    }
    const stats=data.submitStats.acSubmissionNum;
  return {
      user,
      totalSolved: stats[0].count,
      easySolved: stats[1].count,
      mediumSolved: stats[2].count,
      hardSolved: stats[3].count,

      submissionCalendar: data.submissionCalendar,
      recent: data.recentSubmissions.length
          ? data.recentSubmissions.slice(0,3)
          : ["Private Profile"],

      avatar: data.profile.userAvatar,

      profile: data.profile,
      badges: data.badges,
      activeBadge: data.activeBadge,
      github: data.githubUrl,
      linkedin: data.linkedinUrl,
      twitter: data.twitterUrl,
      website: data.website,
      company: data.company,
      school: data.school,
      country: data.countryName,
      ranking: data.profile.ranking,
      reputation: data.profile.reputation,
      error:false
  }
  } catch {
    return {user,error:true};
  }
}

async function getHeatmap(user) {
    try {
        const res = await fetch(`https://leetcode-stats.tashif.codes/${user}/heatmap`);
        const data = await res.json();

        if (data.status !== "success") {
            return null;
        }

        return data;
    } catch {
        return null;
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
    if (!stat.error) {
      stat.heatmap=await getHeatmap(u);
    }
    return stat;
  }));
  renderCards();
}

function renderMiniHeatmap(heatmap) {
    if (!heatmap || !heatmap.dailyContributions)
        return "";
    const last30 = heatmap.dailyContributions.slice(-30);
    let html = `<div class="mini-heatmap">`;
    last30.forEach(day => {
        html += `<div class="mini-heat level-${day.level}" title="${day.date}: ${day.count/2} submissions"></div>`;
    });
    html += "</div>";
    return html;
}

function openModal(username){
    console.log("Opening modal for", username);
    const data = cache.find(x=>x.user===username);

    if(!data) return;

    const body=document.getElementById("modalBody");

    body.innerHTML=`
      <div class="modal-hero">
        <img class="modal-avatar" src="${data.avatar}" alt="">
        <h2>${realNames[username] || username}</h2>
        <div class="modal-handle">@${username}</div>
        ${data.profile.aboutMe ? `<p class="modal-about">${data.profile.aboutMe}</p>` : ''}
        <div class="rank-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          Rank #${data.ranking ? data.ranking.toLocaleString() : 'N/A'}
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-stats">
          <div class="modal-stat total"><div class="modal-stat-val">${data.totalSolved}</div><div class="modal-stat-label">Total solved</div></div>
          <div class="modal-stat easy"><div class="modal-stat-val">${data.easySolved}</div><div class="modal-stat-label">Easy</div></div>
          <div class="modal-stat medium"><div class="modal-stat-val">${data.mediumSolved}</div><div class="modal-stat-label">Medium</div></div>
          <div class="modal-stat hard"><div class="modal-stat-val">${data.hardSolved}</div><div class="modal-stat-label">Hard</div></div>
        </div>
        <div class="modal-section">
          <div class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile info
          </div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">Company</div><div class="info-val">${data.company || '—'}</div></div>
            <div class="info-item"><div class="info-label">School</div><div class="info-val">${data.school || '—'}</div></div>
            <div class="info-item"><div class="info-label">Country</div><div class="info-val">${data.country || '—'}</div></div>
            <div class="info-item"><div class="info-label">Reputation</div><div class="info-val">${data.reputation ?? '—'}</div></div>
          </div>
        </div>
        <div id="socialLinks"></div>
        <div class="modal-section">
          <div class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Activity (last 30 days)
          </div>
          ${renderMiniHeatmap(data.heatmap)}
        </div>
        <div class="modal-section">
          <div class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Recent submissions
          </div>
          <div class="modal-recent-list">
            ${data.recent[0]==="Private Profile" ? '<div class="private-msg"><em>Recent submissions are private.</em><br>Go bully them to make it public</div>' : data.recent.map(q => {
              const link = `https://leetcode.com/problems/${q.titleSlug}`;
              return `<div class="modal-recent-item"><a href="${link}" target="_blank"><strong>${q.title}</strong></a><span class="tag">${q.lang}</span></div>`;
            }).join("")}
          </div>
        </div>
        <img src="https://leetcode-stats.tashif.codes/${username}/stats/svg" style="width:100%;margin-top:20px;border-radius:8px;" alt="Stats chart">
      </div>
    `;

    renderSocials(data);

    document.getElementById("profileModal").classList.add("active");
}

function renderSocials(data){
    let html="";
    if(data.github){
        html+=`<a class="social-btn" href="${data.github}" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>`;
    }
    if(data.linkedin){
        html+=`<a class="social-btn" href="${data.linkedin}" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn</a>`;
    }
    if(data.twitter){
        html+=`<a class="social-btn" href="${data.twitter}" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>Twitter</a>`;
    }
    if(data.website){
        html+=`<a class="social-btn" href="${data.website}" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>Website</a>`;
    }
    const container = document.getElementById("socialLinks");
    if(html && container){
        container.innerHTML=`<div class="modal-section"><div class="modal-section-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>Links</div><div class="socials">`+html+`</div></div>`;
    }
}

function renderCards() {
  const sortType=document.getElementById("sortSelect").value;
  let all=[...cache];
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
      cards.innerHTML+=`<div class="card error-card"><div class="card-header"><h3>${userName}</h3></div><p class="error-text">❌ Could not load data.</p></div>`;
      return;
    }
    const glow=solvedToday(submissionCalendar || {}) ? "done-today" : "not-done";
    const streak=getStreak(submissionCalendar || {});
    const recentHtml = recent[0]==="Private Profile" ? `<p class="private-text"><em>Recent submissions are private.</em><br>Go bully them to make it public</p>` : recent.map(q => {
      const link = `https://leetcode.com/problems/${q.titleSlug}`;
        return `<div class="recent-item"><a href="${link}" target="_blank"><strong>${q.title}</strong></a><span class="tag">${q.lang}</span></div>`;
      }).join("");

    const heatmapHtml = renderMiniHeatmap(data.heatmap);

    cards.innerHTML += `
      <div class="card ${glow}" onclick="openModal('${user}')">
        <div class="card-header">
          <img src="${avatar}" class="avatar" alt="" loading="lazy">
          <div class="card-header-text">
            <h3><a href="https://leetcode.com/${user}" target="_blank" class="profile-link" onclick="event.stopPropagation()">${userName}</a></h3>
            <span class="handle">@${user}</span>
          </div>
          <span class="status-dot ${glow}" title="${glow === 'done-today' ? 'Solved today' : 'Not solved today'}"></span>
        </div>
        <div class="stats-pills">
          <div class="pill"><span class="pill-val">${totalSolved}</span><span class="pill-label">Total</span></div>
          <div class="pill easy"><span class="pill-val">${easySolved}</span><span class="pill-label">Easy</span></div>
          <div class="pill medium"><span class="pill-val">${mediumSolved}</span><span class="pill-label">Medium</span></div>
          <div class="pill hard"><span class="pill-val">${hardSolved}</span><span class="pill-label">Hard</span></div>
        </div>
        <div class="streak-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          <span>${streak} day streak</span>
        </div>
        ${heatmapHtml}
        <div class="recent-list">
          <p class="recent-title">Last 3 solved</p>
          ${recentHtml}
        </div>
      </div>`;
  });
}

const modal=document.getElementById("profileModal");

document.getElementById("closeModal").onclick=()=>{
    modal.classList.remove("active");
};

window.onclick=(e)=>{
    if(e.target===modal)
        modal.classList.remove("active");
};

loadData();

document.getElementById("sortSelect").addEventListener("change", () => {
  renderCards();
});