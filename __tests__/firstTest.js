/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");

let server, agent;

describe("Initial Testing", () => {
  beforeAll(async () => {
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await server.close();
  });

  test("First Test", async () => {
    let res = await agent.get("/");
    expect(res.status).toBe(200);
  });
});
