const STAT_MAX = 5;

let characters = {};
let selected = { p1: null, p2: null };

async function init() {
    const res = await fetch("/api/characters");
    characters = await res.json();
    renderGrids();
}

function renderGrids() {
    renderGrid("grid-p1", "p1");
    renderGrid("grid-p2", "p2");
}

function renderGrid(containerId, player) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = "";
    Object.entries(characters).forEach(([key, char]) => {
        const card = document.createElement("div");
        card.className = "char-card";
        card.dataset.key = key;
        card.innerHTML = `<img src="${char.img}" alt="${char.NOME}" /><span>${char.NOME}</span>`;
        card.addEventListener("click", () => selectChar(player, key, card));
        grid.appendChild(card);
    });
}

function selectChar(player, key, cardEl) {
    const other = player === "p1" ? "p2" : "p1";

    // Clear previous selection in this player's grid
    const gridId = player === "p1" ? "grid-p1" : "grid-p2";
    document.querySelectorAll(`#${gridId} .char-card`).forEach(c => c.classList.remove("selected"));
    cardEl.classList.add("selected");
    selected[player] = key;

    // Update preview
    renderPreview(player, key);

    // Lock that character in the other player's grid
    const otherGridId = other === "p1" ? "grid-p1" : "grid-p2";
    document.querySelectorAll(`#${otherGridId} .char-card`).forEach(c => {
        if (c.dataset.key === key) c.classList.add("disabled");
        else c.classList.remove("disabled");
    });

    // Unselect if other had chosen same
    if (selected[other] === key) {
        selected[other] = null;
        renderPreview(other, null);
        document.querySelectorAll(`#${otherGridId} .char-card`).forEach(c => c.classList.remove("selected"));
    }

    checkReady();
}

function renderPreview(player, key) {
    const el = document.getElementById(`preview-p${player === "p1" ? "1" : "2"}`);
    if (!key) {
        el.innerHTML = "<span>Nenhum selecionado</span>";
        return;
    }
    const c = characters[key];
    el.innerHTML = `
        <img src="${c.img}" alt="${c.NOME}" />
        <div class="preview-stats">
            <strong>${c.NOME}</strong><br>
            ${statBar("Velocidade", c.VELOCIDADE)}
            ${statBar("Manobrabilidade", c.MANOBRABILIDADE)}
            ${statBar("Poder", c.PODER)}
        </div>`;
}

function statBar(label, value) {
    const pct = (value / STAT_MAX) * 100;
    return `<div class="stat-bar"><span style="width:90px">${label}</span>
        <div style="background:#333;border-radius:3px;flex:1;height:6px">
            <div class="stat-bar-fill" style="width:${pct}%"></div>
        </div>
        <span style="width:14px;text-align:right;color:#ffe600;font-weight:700">${value}</span></div>`;
}

function checkReady() {
    const btn = document.getElementById("start-btn");
    btn.disabled = !(selected.p1 && selected.p2);
}

document.getElementById("start-btn").addEventListener("click", startRace);
document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("race-screen").classList.remove("active");
    document.getElementById("selection-screen").classList.add("active");
    selected = { p1: null, p2: null };
    renderGrids();
    document.getElementById("preview-p1").innerHTML = "<span>Nenhum selecionado</span>";
    document.getElementById("preview-p2").innerHTML = "<span>Nenhum selecionado</span>";
    document.getElementById("start-btn").disabled = true;
});

async function startRace() {
    document.getElementById("selection-error").textContent = "";

    const res = await fetch("/api/race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1: selected.p1, player2: selected.p2 }),
    });
    const data = await res.json();

    if (!res.ok) {
        document.getElementById("selection-error").textContent = data.error;
        return;
    }

    document.getElementById("selection-screen").classList.remove("active");
    document.getElementById("race-screen").classList.add("active");

    renderRace(data);
}

function renderRace(data) {
    const keys = Object.keys(data.finalScore);
    const k1 = keys[0], k2 = keys[1];
    const c1 = data.players[k1], c2 = data.players[k2];

    // Racers header
    document.getElementById("racer1-display").innerHTML =
        `<img src="${characters[k1].img}" alt="${c1.NOME}" /><span>${c1.NOME}</span>`;
    document.getElementById("racer2-display").innerHTML =
        `<img src="${characters[k2].img}" alt="${c2.NOME}" /><span>${c2.NOME}</span>`;

    const logEl = document.getElementById("round-log");
    logEl.innerHTML = "";
    document.getElementById("winner-banner").classList.add("hidden");

    let scoreA = 0, scoreB = 0;

    data.rounds.forEach((round, idx) => {
        setTimeout(() => {
            scoreA = round.score[k1];
            scoreB = round.score[k2];
            document.getElementById("score-p1").textContent = scoreA;
            document.getElementById("score-p2").textContent = scoreB;

            const card = document.createElement("div");
            card.className = "round-card";

            const blockClass = `block-${round.block}`;
            card.innerHTML = `<div class="round-title">🏁 Volta ${round.round} <span class="block-badge ${blockClass}">${round.block}</span></div>`;

            round.events.forEach(ev => {
                const line = document.createElement("div");
                line.className = "event-line";
                if (ev.type === "roll") {
                    line.textContent = `🎲 ${ev.name} rolou ${ev.attr}: ${ev.dice} + ${ev.bonus} = ${ev.total}`;
                } else if (ev.type === "ponto") {
                    line.className += " point";
                    line.textContent = `⭐ ${ev.name} marcou um ponto!`;
                } else if (ev.type === "confronto") {
                    line.className += " highlight";
                    line.textContent = `💥 ${ev.winner} ganhou o confronto! ${ev.loser} perdeu um ponto.`;
                } else if (ev.type === "empate") {
                    line.textContent = "🤝 Empate!";
                } else if (ev.type === "nada") {
                    line.textContent = "😶 Nada acontece...";
                }
                card.appendChild(line);
            });

            logEl.appendChild(card);
            logEl.scrollTop = logEl.scrollHeight;

            if (idx === data.rounds.length - 1) {
                setTimeout(() => showWinner(data, k1, k2), 600);
            }
        }, idx * 800);
    });
}

function showWinner(data, k1, k2) {
    const banner = document.getElementById("winner-banner");
    banner.classList.remove("hidden");

    if (data.winner) {
        const w = data.players[data.winner];
        document.getElementById("winner-gif").src = characters[data.winner].img;
        document.getElementById("winner-text").textContent =
            `🏆 ${w.NOME} venceu a corrida com ${data.finalScore[data.winner]} ponto(s)!`;
    } else {
        document.getElementById("winner-gif").src = "flag.png";
        document.getElementById("winner-text").textContent = "🤝 Empate!";
    }
}

init();
