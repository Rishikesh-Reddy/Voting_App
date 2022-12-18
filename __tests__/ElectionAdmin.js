/* eslint-disable no-undef */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCSRFToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, email, password) => {
  let res = await agent.get("/admin/login");
  let csrfToken = extractCSRFToken(res);
  res = await agent.post("/admin/login").send({
    email: email,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Testing Functionalities of Election Admin", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3001, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    await server.close();
  });

  test("Testing SignUp Functionality", async () => {
    let res = await agent.get("/admin/signup");
    const csrfToken = extractCSRFToken(res);
    res = await agent.post("/admin/signup").send({
      _csrf: csrfToken,
      firstname: "Test",
      lastname: "User1",
      username: "user1",
      email: "user1@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toEqual(302);
    res = await agent.get("/admin/");
    expect(res.statusCode).toEqual(200);
  });

  test("Testing Sign Out Functionality", async () => {
    let res = await agent.get("/admin/");
    expect(res.statusCode).toEqual(200);
    res = await agent.get("/admin/signout");
    expect(res.statusCode).toEqual(302);
    res = await agent.get("/admin/");
    expect(res.statusCode).toBe(302);
  });

  test("Testing Login Functionality", async () => {
    await login(agent, "user1@gmail.com", "password");
    let res = await agent.get("/admin/");
    expect(res.statusCode).toEqual(200);
  });
});