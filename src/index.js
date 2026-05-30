const express = require("express");
const path = require("path");
const { CHARACTERS, playRace } = require("./gameEngine");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
// Serve GIFs/PNGs from project root (assets live alongside index.js in dev)
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/characters", (req, res) => {
    res.json(CHARACTERS);
});

app.post("/api/race", (req, res) => {
    const { player1, player2 } = req.body;
    if (!player1 || !player2) {
        return res.status(400).json({ error: "player1 and player2 are required" });
    }
    if (!CHARACTERS[player1] || !CHARACTERS[player2]) {
        return res.status(400).json({ error: "Invalid character selection" });
    }
    if (player1 === player2) {
        return res.status(400).json({ error: "Players must choose different characters" });
    }
    const result = playRace(player1, player2);
    res.json(result);
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Mario Kart server running on port ${PORT}`);
    });
}

module.exports = app;
