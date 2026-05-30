const request = require("supertest");
const app = require("../src/index");

describe("GET /health", () => {
    it("returns ok", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});

describe("GET /api/characters", () => {
    it("returns all characters", async () => {
        const res = await request(app).get("/api/characters");
        expect(res.statusCode).toBe(200);
        expect(Object.keys(res.body).length).toBeGreaterThan(0);
    });
});

describe("POST /api/race", () => {
    it("runs a valid race", async () => {
        const res = await request(app)
            .post("/api/race")
            .send({ player1: "mario", player2: "luigi" });
        expect(res.statusCode).toBe(200);
        expect(res.body.rounds).toHaveLength(5);
    });

    it("rejects missing players", async () => {
        const res = await request(app).post("/api/race").send({});
        expect(res.statusCode).toBe(400);
    });

    it("rejects invalid character", async () => {
        const res = await request(app)
            .post("/api/race")
            .send({ player1: "pikachu", player2: "mario" });
        expect(res.statusCode).toBe(400);
    });

    it("rejects same character for both players", async () => {
        const res = await request(app)
            .post("/api/race")
            .send({ player1: "mario", player2: "mario" });
        expect(res.statusCode).toBe(400);
    });
});
