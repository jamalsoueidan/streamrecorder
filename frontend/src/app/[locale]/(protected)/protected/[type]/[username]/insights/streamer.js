// Get username from URL
const params = new URLSearchParams(window.location.search);
const username = params.get("u");

if (!username) {
  window.location.href = "/";
}

document.getElementById("streamerName").textContent = `@${username}`;
document.title = `@${username} - Stats`;

// Format numbers
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

// Create rank badge
function rankBadge(rank) {
  const cls = rank <= 3 ? `rank rank-${rank}` : "rank";
  return `<span class="${cls}">${rank}</span>`;
}

// Sanitize text
function sanitize(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

// Format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Format duration
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Load earnings (last 30 days)
async function loadEarnings() {
  const summary = document.getElementById("earningsSummary");
  const tbody = document.getElementById("earningsTable");

  summary.innerHTML = '<div class="loading">Loading...</div>';
  tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading...</td></tr>';

  try {
    const res = await fetch(`/api/streamer/${encodeURIComponent(username)}/earnings`);
    const data = await res.json();

    if (data.length === 0) {
      summary.innerHTML = '<p class="empty">No earnings data</p>';
      tbody.innerHTML = '<tr><td colspan="4" class="empty">No data yet</td></tr>';
      return;
    }

    // Calculate totals
    const totalDiamonds = data.reduce((sum, d) => sum + Number(d.diamonds), 0);
    const totalGifts = data.reduce((sum, d) => sum + Number(d.gifts), 0);
    const avgDaily = Math.round(totalDiamonds / data.length);

    // Date range
    const dates = data.map(d => d.date).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    summary.innerHTML = `
      <div class="earnings-stat">
        <div class="period">${firstDate} to ${lastDate}</div>
        <div class="label">Period (${data.length} days)</div>
      </div>
      <div class="earnings-stat">
        <div class="total">${formatNumber(totalDiamonds)}</div>
        <div class="label">Total Diamonds</div>
      </div>
      <div class="earnings-stat">
        <div class="total" style="color: #fe2c55;">${formatNumber(totalGifts)}</div>
        <div class="label">Total Gifts</div>
      </div>
      <div class="earnings-stat">
        <div class="total" style="color: #fbbf24;">${formatNumber(avgDaily)}</div>
        <div class="label">Avg Daily</div>
      </div>
    `;

    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${row.date}</td>
        <td class="diamonds">${formatNumber(Number(row.diamonds))}</td>
        <td>${formatNumber(Number(row.gifts))}</td>
        <td>${formatNumber(Number(row.unique_gifters))}</td>
      </tr>
    `).join("");
  } catch (e) {
    summary.innerHTML = '<p class="empty">Failed to load</p>';
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Failed to load</td></tr>';
  }
}

// Load streamer stats
async function loadStats() {
  try {
    const res = await fetch(`/api/streamer/${encodeURIComponent(username)}/stats`);
    const data = await res.json();

    document.getElementById("totalDiamonds").textContent = formatNumber(Number(data.total_diamonds) || 0);
    document.getElementById("battleDiamonds").textContent = formatNumber(Number(data.battle_diamonds) || 0);
    document.getElementById("nonBattleDiamonds").textContent = formatNumber(Number(data.non_battle_diamonds) || 0);
    document.getElementById("uniqueGifters").textContent = formatNumber(Number(data.unique_gifters) || 0);
    document.getElementById("totalBattles").textContent = formatNumber(Number(data.total_battles) || 0);

    const totalBattles = Number(data.total_battles) || 0;
    const battlesWon = Number(data.battles_won) || 0;
    const winRate = totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0;
    document.getElementById("winRate").textContent = `${winRate}%`;
  } catch (e) {
    console.error("Failed to load stats:", e);
  }
}

// Load top gifters
async function loadGifters() {
  const tbody = document.getElementById("giftersTable");
  tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading...</td></tr>';

  try {
    const res = await fetch(`/api/streamer/${encodeURIComponent(username)}/top-gifters`);
    const data = await res.json();

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">No gifters yet</td></tr>';
      return;
    }

    tbody.innerHTML = data
      .map(
        (row, i) => `
      <tr>
        <td>${rankBadge(i + 1)}</td>
        <td>
          <a href="/streamer.html?u=${encodeURIComponent(row.sender_username)}" class="username">@${sanitize(row.sender_username)}</a>
          <div class="nickname">${sanitize(row.sender_nickname)}</div>
        </td>
        <td class="diamonds">${formatNumber(Number(row.diamonds))}</td>
        <td>${formatNumber(Number(row.gift_count))}</td>
      </tr>
    `
      )
      .join("");
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Failed to load</td></tr>';
  }
}

// Format TikTok timestamp to readable date
function formatBattleDate(createTime) {
  // TikTok timestamps can be in seconds or milliseconds
  // If > 10 billion, it's already milliseconds
  const ms = createTime > 10000000000 ? createTime : createTime * 1000;
  const d = new Date(ms);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Pagination state
let battlesOffset = 0;
let opponentsOffset = 0;
let activityOffset = 0;
const PAGE_SIZE = 10;
const ACTIVITY_PAGE_SIZE = 20;

// Load battle history
async function loadBattles(reset = true) {
  if (reset) battlesOffset = 0;

  const tbody = document.getElementById("battlesTable");
  const pagination = document.getElementById("battlesPagination");
  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading...</td></tr>';

  try {
    const res = await fetch(`/api/streamer/${encodeURIComponent(username)}/battles?limit=${PAGE_SIZE}&offset=${battlesOffset}`);
    const { data, total, hasMore } = await res.json();

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No battles yet</td></tr>';
      pagination.innerHTML = '';
      return;
    }

    tbody.innerHTML = data
      .map((row) => {
        const battleType = row.battle_type || "1v1";
        const battleWon = Number(row.battle_won) || 0;
        const status = row.status || "completed";

        // Determine result - battle_won: 1=we won, 2/3/4=opponent position won, 0=draw
        let resultClass, resultText;
        if (status === "live") {
          resultClass = "live";
          resultText = "LIVE";
        } else if (status === "interrupted") {
          resultClass = "draw";
          resultText = "—";
        } else if (battleWon === 1) {
          resultClass = "win";
          resultText = "WIN";
        } else if (battleWon === 0) {
          resultClass = "draw";
          resultText = "DRAW";
        } else {
          resultClass = "loss";
          resultText = "LOSS";
        }

        // Build all participants based on battle type
        let participants = [];
        let scoreDisplay = "";
        let opponentLinks = "";

        if (battleType === "1v1") {
          // 1v1: 2 streamers
          participants = [
            { name: row.streamer_1_username || row.streamer_1, score: row.team_1_score || 0, pos: 1 },
            { name: row.streamer_2_username || row.streamer_2, score: row.team_2_score || 0, pos: 2 },
          ].filter(s => s.name);

          const myScoreClass = battleWon === 1 ? "winner" : "";
          const oppScoreClass = battleWon === 2 ? "winner" : "";
          scoreDisplay = `<span class="score ${myScoreClass}">${formatNumber(row.team_1_score || 0)}</span> - <span class="score ${oppScoreClass}">${formatNumber(row.team_2_score || 0)}</span>`;

        } else if (battleType === "2v2") {
          // 2v2: 4 streamers, each with individual score
          // our team = pos 1+2, opponent team = pos 3+4
          participants = [
            { name: row.streamer_1_username || row.streamer_1, score: Number(row.team_1_score) || 0, pos: 1, team: 1 },
            { name: row.streamer_2_username || row.streamer_2, score: Number(row.team_2_score) || 0, pos: 2, team: 1 },
            { name: row.streamer_3_username || row.streamer_3, score: Number(row.team_3_score) || 0, pos: 3, team: 2 },
            { name: row.streamer_4_username || row.streamer_4, score: Number(row.team_4_score) || 0, pos: 4, team: 2 },
          ].filter(s => s.name);

          const myTotal = (Number(row.team_1_score) || 0) + (Number(row.team_2_score) || 0);
          const oppTotal = (Number(row.team_3_score) || 0) + (Number(row.team_4_score) || 0);
          const myScoreClass = battleWon === 1 ? "winner" : "";
          const oppScoreClass = battleWon === 2 ? "winner" : "";
          scoreDisplay = `<span class="score ${myScoreClass}">${formatNumber(myTotal)}</span> - <span class="score ${oppScoreClass}">${formatNumber(oppTotal)}</span>`;

        } else if (battleType === "1v1v1") {
          // 1v1v1: 3 streamers
          participants = [
            { name: row.streamer_1_username || row.streamer_1, score: row.team_1_score || 0, pos: 1 },
            { name: row.streamer_2_username || row.streamer_2, score: row.team_2_score || 0, pos: 2 },
            { name: row.streamer_3_username || row.streamer_3, score: row.team_3_score || 0, pos: 3 },
          ].filter(s => s.name);

          scoreDisplay = participants
            .map(s => {
              const isWinner = battleWon === s.pos;
              const cls = isWinner ? "winner" : (s.pos === 1 ? "" : "opponent-score");
              return `<span class="score ${cls}">${formatNumber(s.score)}</span>`;
            })
            .join(" - ");

        } else if (battleType === "1v1v1v1") {
          // 1v1v1v1: 4 streamers
          participants = [
            { name: row.streamer_1_username || row.streamer_1, score: row.team_1_score || 0, pos: 1 },
            { name: row.streamer_2_username || row.streamer_2, score: row.team_2_score || 0, pos: 2 },
            { name: row.streamer_3_username || row.streamer_3, score: row.team_3_score || 0, pos: 3 },
            { name: row.streamer_4_username || row.streamer_4, score: row.team_4_score || 0, pos: 4 },
          ].filter(s => s.name);

          scoreDisplay = participants
            .map(s => {
              const isWinner = battleWon === s.pos;
              const cls = isWinner ? "winner" : (s.pos === 1 ? "" : "opponent-score");
              return `<span class="score ${cls}">${formatNumber(s.score)}</span>`;
            })
            .join(" - ");
        }

        // Build participants display
        if (battleType === "2v2") {
          // Show: "with @teammate vs @opp1, @opp2"
          const teammate = participants.find(s => s.pos === 2);
          const opps = participants.filter(s => s.team === 2);
          const teammateLink = teammate
            ? `<span style="color:#666;font-size:11px">with </span><a href="/streamer.html?u=${encodeURIComponent(teammate.name)}" class="opponent">@${sanitize(teammate.name)}</a>`
            : "";
          const oppLinks = opps.map(s => {
            const isWinner = battleWon === 2;
            const winnerMark = isWinner ? ' <span class="winner-mark">★</span>' : '';
            return `<a href="/streamer.html?u=${encodeURIComponent(s.name)}" class="opponent ${isWinner ? 'winner' : ''}">@${sanitize(s.name)}${winnerMark}</a>`;
          }).join(", ");
          opponentLinks = [teammateLink, `<span style="color:#4ade80;font-size:11px;font-weight:600"> vs </span>${oppLinks}`].filter(Boolean).join("");
        } else {
          opponentLinks = participants
            .filter(s => s.pos > 1)
            .map(s => {
              const isWinner = battleWon === s.pos;
              const winnerMark = isWinner ? ' <span class="winner-mark">★</span>' : '';
              return `<a href="/streamer.html?u=${encodeURIComponent(s.name)}" class="opponent ${isWinner ? 'winner' : ''}">@${sanitize(s.name)}${winnerMark}</a>`;
            })
            .join(", ");
        }

        const earnings = Number(row.gifts_during_battle) || 0;
        const maxMultiplier = Number(row.max_multiplier) || 0;
        // multiplier_value=5 → Boosting Glove (TikTok internal code, not literally 5x)
        // multiplier_value=2 → top2/top3 bonus (actual 2x)
        const multiplierBadge = maxMultiplier === 5
          ? ` <span style="color:#f59e0b;font-size:10px;font-weight:700">⚡Boost</span>`
          : maxMultiplier === 2
          ? ` <span style="color:#f59e0b;font-size:10px;font-weight:700">×2</span>`
          : "";

        // For live/interrupted battles, hide scores
        if (status !== "completed") {
          scoreDisplay = '<span style="color:#666">—</span>';
        }

        return `
      <tr data-id="${row.battle_id}">
        <td class="session-time">${formatBattleDate(row.started_at)}</td>
        <td>${battleType}</td>
        <td><span class="battle-result ${resultClass}">${resultText}</span></td>
        <td>${opponentLinks || "-"}</td>
        <td>${scoreDisplay}</td>
        <td class="diamonds">${formatNumber(earnings)}${multiplierBadge}</td>
      </tr>
    `;
      })
      .join("");

    // Pagination
    pagination.innerHTML = `
      <button class="page-btn" ${battlesOffset === 0 ? 'disabled' : ''} onclick="prevBattles()">Previous</button>
      <span class="page-info">Page ${Math.floor(battlesOffset / PAGE_SIZE) + 1} &middot; ${total} total</span>
      <button class="page-btn" ${!hasMore ? 'disabled' : ''} onclick="nextBattles()">Next</button>
    `;
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Failed to load</td></tr>';
  }
}

function prevBattles() {
  battlesOffset = Math.max(0, battlesOffset - PAGE_SIZE);
  loadBattles(false);
}

function nextBattles() {
  battlesOffset += PAGE_SIZE;
  loadBattles(false);
}

// Load top opponents
async function loadOpponents(reset = true) {
  if (reset) opponentsOffset = 0;

  const tbody = document.getElementById("opponentsTable");
  const pagination = document.getElementById("opponentsPagination");
  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading...</td></tr>';

  try {
    const res = await fetch(`/api/streamer/${encodeURIComponent(username)}/top-opponents?limit=${PAGE_SIZE}&offset=${opponentsOffset}`);
    const { data, total, hasMore } = await res.json();

    if (data.length === 0 && opponentsOffset === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No opponents yet</td></tr>';
      pagination.innerHTML = '';
      return;
    }

    tbody.innerHTML = data
      .map((row, i) => {
        const rank = opponentsOffset + i + 1;
        const winRate = row.battles > 0 ? Math.round((row.wins / row.battles) * 100) : 0;
        const winRateClass = winRate >= 50 ? "win" : "loss";
        return `
      <tr>
        <td>${rankBadge(rank)}</td>
        <td>
          <a href="/streamer.html?u=${encodeURIComponent(row.opponent_username)}" class="username">@${sanitize(row.opponent_username)}</a>
        </td>
        <td>${formatNumber(Number(row.battles))}</td>
        <td class="score winner">${formatNumber(Number(row.wins))}</td>
        <td class="score" style="color: #f87171;">${formatNumber(Number(row.losses))}</td>
        <td><span class="battle-result ${winRateClass}">${winRate}%</span></td>
      </tr>
    `;
      })
      .join("");

    // Pagination
    pagination.innerHTML = `
      <button class="page-btn" ${opponentsOffset === 0 ? 'disabled' : ''} onclick="prevOpponents()">Previous</button>
      <span class="page-info">Page ${Math.floor(opponentsOffset / PAGE_SIZE) + 1} &middot; ${total} total</span>
      <button class="page-btn" ${!hasMore ? 'disabled' : ''} onclick="nextOpponents()">Next</button>
    `;
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Failed to load</td></tr>';
  }
}

function prevOpponents() {
  opponentsOffset = Math.max(0, opponentsOffset - PAGE_SIZE);
  loadOpponents(false);
}

function nextOpponents() {
  opponentsOffset += PAGE_SIZE;
  loadOpponents(false);
}

// Load stream activity
async function loadActivity(reset = true) {
  if (reset) activityOffset = 0;

  const tbody = document.getElementById("activityTable");
  const pagination = document.getElementById("activityPagination");
  const scheduleGrid = document.getElementById("scheduleGrid");

  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading...</td></tr>';
  if (reset) scheduleGrid.innerHTML = '<div class="loading">Loading...</div>';

  try {
    const sessionsRes = await fetch(`/api/streamer/${encodeURIComponent(username)}/activity?limit=${ACTIVITY_PAGE_SIZE}&offset=${activityOffset}`);
    const { data: sessions, total, hasMore } = await sessionsRes.json();

    if (sessions.length === 0 && activityOffset === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No activity yet</td></tr>';
      pagination.innerHTML = '';
    } else {
      tbody.innerHTML = sessions
        .map((row) => `
        <tr>
          <td class="session-time">${formatDate(row.started_at)}</td>
          <td>${formatDuration(Number(row.duration_minutes) || 0)}</td>
          <td>${formatNumber(Number(row.peak_viewers) || 0)}</td>
          <td>${formatNumber(Number(row.avg_viewers) || 0)}</td>
          <td class="diamonds">${formatNumber(Number(row.diamonds) || 0)}</td>
          <td>${formatNumber(Number(row.battles) || 0)}</td>
        </tr>
      `)
        .join("");

      pagination.innerHTML = `
        <button class="page-btn" ${activityOffset === 0 ? 'disabled' : ''} onclick="prevActivity()">Previous</button>
        <span class="page-info">Page ${Math.floor(activityOffset / ACTIVITY_PAGE_SIZE) + 1} &middot; ${total} total</span>
        <button class="page-btn" ${!hasMore ? 'disabled' : ''} onclick="nextActivity()">Next</button>
      `;
    }

    // Only reload schedule on first load
    if (reset) {
      const scheduleRes = await fetch(`/api/streamer/${encodeURIComponent(username)}/schedule`);
      const schedule = await scheduleRes.json();

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const scheduleMap = {};
      schedule.forEach(s => { scheduleMap[s.day_of_week] = s; });

      scheduleGrid.innerHTML = days.map((day, i) => {
        const dayNum = i + 1;
        const d = scheduleMap[dayNum] || { total_hours: 0, stream_count: 0 };
        const hours = Math.round(Number(d.total_hours) || 0);
        const streams = Number(d.stream_count) || 0;
        return `
          <div class="schedule-day ${hours > 0 ? 'active' : ''}">
            <div class="day-name">${day}</div>
            <div class="day-hours">${hours}h</div>
            <div class="day-streams">${streams} streams</div>
          </div>
        `;
      }).join("");
    }
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Failed to load</td></tr>';
    if (reset) scheduleGrid.innerHTML = '<div class="empty">Failed to load</div>';
  }
}

function prevActivity() {
  activityOffset = Math.max(0, activityOffset - ACTIVITY_PAGE_SIZE);
  loadActivity(false);
}

function nextActivity() {
  activityOffset += ACTIVITY_PAGE_SIZE;
  loadActivity(false);
}

// Tab switching
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const tabName = tab.dataset.tab;
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
  });
});

// Load all
loadStats();
loadEarnings();
loadGifters();
loadOpponents();
loadBattles();
loadActivity();
