const CHARACTERS = {
    mario:  { NOME: "Mario",  VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, img: "mario.gif" },
    luigi:  { NOME: "Luigi",  VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, img: "luigi.gif" },
    peach:  { NOME: "Peach",  VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, img: "peach.gif" },
    toad:   { NOME: "Toad",   VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 2, img: "toad.gif" },
    yoshi:  { NOME: "Yoshi",  VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 3, img: "yoshi.gif" },
    dk:     { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, img: "dk.gif" },
    bowser: { NOME: "Bowser", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, img: "bowser.gif" },
};

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function getRandomBlock() {
    const r = Math.random();
    if (r < 0.33) return "RETA";
    if (r < 0.66) return "CURVA";
    return "CONFRONTO";
}

function playRace(char1Key, char2Key) {
    const character1 = { ...CHARACTERS[char1Key], PONTOS: 0 };
    const character2 = { ...CHARACTERS[char2Key], PONTOS: 0 };
    const rounds = [];

    for (let round = 1; round <= 5; round++) {
        const block = getRandomBlock();
        const dice1 = rollDice();
        const dice2 = rollDice();
        const events = [];
        let skill1 = 0;
        let skill2 = 0;

        if (block === "RETA") {
            skill1 = dice1 + character1.VELOCIDADE;
            skill2 = dice2 + character2.VELOCIDADE;
            events.push({ type: "roll", name: character1.NOME, attr: "velocidade", dice: dice1, bonus: character1.VELOCIDADE, total: skill1 });
            events.push({ type: "roll", name: character2.NOME, attr: "velocidade", dice: dice2, bonus: character2.VELOCIDADE, total: skill2 });
        } else if (block === "CURVA") {
            skill1 = dice1 + character1.MANOBRABILIDADE;
            skill2 = dice2 + character2.MANOBRABILIDADE;
            events.push({ type: "roll", name: character1.NOME, attr: "manobrabilidade", dice: dice1, bonus: character1.MANOBRABILIDADE, total: skill1 });
            events.push({ type: "roll", name: character2.NOME, attr: "manobrabilidade", dice: dice2, bonus: character2.MANOBRABILIDADE, total: skill2 });
        } else {
            const power1 = dice1 + character1.PODER;
            const power2 = dice2 + character2.PODER;
            events.push({ type: "roll", name: character1.NOME, attr: "poder", dice: dice1, bonus: character1.PODER, total: power1 });
            events.push({ type: "roll", name: character2.NOME, attr: "poder", dice: dice2, bonus: character2.PODER, total: power2 });

            if (power1 > power2 && character2.PONTOS > 0) {
                character2.PONTOS--;
                events.push({ type: "confronto", winner: character1.NOME, loser: character2.NOME });
            } else if (power2 > power1 && character1.PONTOS > 0) {
                character1.PONTOS--;
                events.push({ type: "confronto", winner: character2.NOME, loser: character1.NOME });
            } else if (power1 === power2) {
                events.push({ type: "empate" });
            } else {
                events.push({ type: "nada" });
            }
        }

        if (block !== "CONFRONTO") {
            if (skill1 > skill2) {
                character1.PONTOS++;
                events.push({ type: "ponto", name: character1.NOME });
            } else if (skill2 > skill1) {
                character2.PONTOS++;
                events.push({ type: "ponto", name: character2.NOME });
            } else {
                events.push({ type: "empate" });
            }
        }

        rounds.push({
            round,
            block,
            events,
            score: { [char1Key]: character1.PONTOS, [char2Key]: character2.PONTOS },
        });
    }

    let winner = null;
    if (character1.PONTOS > character2.PONTOS) winner = char1Key;
    else if (character2.PONTOS > character1.PONTOS) winner = char2Key;

    return {
        players: { [char1Key]: character1, [char2Key]: character2 },
        rounds,
        winner,
        finalScore: { [char1Key]: character1.PONTOS, [char2Key]: character2.PONTOS },
    };
}

module.exports = { CHARACTERS, playRace };
