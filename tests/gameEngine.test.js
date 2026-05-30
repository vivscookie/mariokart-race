const { CHARACTERS, playRace } = require("../src/gameEngine");

describe("CHARACTERS", () => {
    test("all expected characters exist", () => {
        const expected = ["mario", "luigi", "peach", "toad", "yoshi", "dk", "bowser"];
        expected.forEach(k => expect(CHARACTERS[k]).toBeDefined());
    });

    test("each character has required stats", () => {
        Object.values(CHARACTERS).forEach(c => {
            expect(c).toHaveProperty("NOME");
            expect(c).toHaveProperty("VELOCIDADE");
            expect(c).toHaveProperty("MANOBRABILIDADE");
            expect(c).toHaveProperty("PODER");
            expect(c).toHaveProperty("img");
        });
    });
});

describe("playRace", () => {
    test("returns correct structure", () => {
        const result = playRace("mario", "luigi");
        expect(result).toHaveProperty("players");
        expect(result).toHaveProperty("rounds");
        expect(result).toHaveProperty("finalScore");
        expect(result.rounds).toHaveLength(5);
    });

    test("scores are non-negative", () => {
        const result = playRace("mario", "luigi");
        Object.values(result.finalScore).forEach(s => expect(s).toBeGreaterThanOrEqual(0));
    });

    test("winner matches final score", () => {
        const result = playRace("mario", "luigi");
        const keys = Object.keys(result.finalScore);
        const [k1, k2] = keys;
        if (result.finalScore[k1] > result.finalScore[k2]) expect(result.winner).toBe(k1);
        else if (result.finalScore[k2] > result.finalScore[k1]) expect(result.winner).toBe(k2);
        else expect(result.winner).toBeNull();
    });

    test("players start with 0 points (mutation isolation)", () => {
        playRace("mario", "luigi");
        playRace("mario", "luigi");
        // CHARACTERS should not be mutated between calls
        expect(CHARACTERS.mario.PONTOS).toBeUndefined();
    });
});
