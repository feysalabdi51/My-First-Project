document.addEventListener("DOMContentLoaded", () => {
  const teamSelect = document.getElementById("team-select");
  const playersContainer = document.getElementById("players-container");
  const toggleTheme = document.getElementById("toggle-theme");

  const API_BASE = "https://v3.football.api-sports.io";
  const HEADERS = {
    "x-apisports-key": "45d3192e4bfd2fee8c3ee5f4be188e75"
  };
  const EPL_LEAGUE_ID = 39; // Premier League
  const SEASON = 2023;

  fetch(`${API_BASE}/teams?league=${EPL_LEAGUE_ID}&season=${SEASON}`, {
    headers: HEADERS
  })
    .then(res => res.json())
    .then(data => {
      data.response.forEach(entry => {
        const team = entry.team;
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Team fetch error:", err));

  teamSelect.addEventListener("change", e => {
    const teamId = e.target.value;
    if (teamId) {
      fetch(`${API_BASE}/players?team=${teamId}&season=${SEASON}`, {
        headers: HEADERS
      })
        .then(res => res.json())
        .then(data => {
          playersContainer.innerHTML = "";
          data.response.slice(0, 10).forEach(playerObj => {
            const player = playerObj.player;
            const card = document.createElement("div");
            card.className = "player-card";
            card.innerHTML = `
              <h3>${player.name}</h3>
              <p><strong>Position:</strong> ${player.position}</p>
              <p><strong>Nationality:</strong> ${player.nationality}</p>
              <p><strong>Age:</strong> ${player.age}</p>
              <button class="like-btn">❤️ Like</button>
              <input type="text" placeholder="Add a comment..." class="comment-input"/>
              <div class="comments"></div>
            `;
            playersContainer.appendChild(card);
          });

          document.querySelectorAll(".like-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              btn.textContent = btn.textContent === "❤️ Like" ? "💖 Liked!" : "❤️ Like";
            });
          });

          document.querySelectorAll(".comment-input").forEach(input => {
            input.addEventListener("keypress", e => {
              if (e.key === "Enter" && input.value.trim() !== "") {
                const commentBox = input.nextElementSibling;
                const comment = document.createElement("p");
                comment.textContent = input.value;
                commentBox.appendChild(comment);
                input.value = "";
              }
            });
          });
        })
        .catch(err => console.error("Player fetch error:", err));
    }
  });

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
});
