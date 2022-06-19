import request from "supertest";

const baseUrl = "http://localhost:4000";

describe("Test scenario №1", () => {
  it("should get empty users array", async () => {
    let res = await request(baseUrl).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should create a new user", async () => {
    let resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });
    expect(resPost.statusCode).toEqual(201);
    expect(resPost.body.name).toBe("User");
    expect(resPost.body.age).toBe(13);
  });

  it("should get a user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    const resGet = await request(baseUrl).get(`/api/users/${resPost.body.id}`);
    expect(resGet.statusCode).toEqual(200);
  });

  it("should update  a user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    const resPut = await request(baseUrl)
      .put(`/api/users/${resPost.body.id}`)
      .send({
        name: "newUserName",
        age: 18,
        hobbies: ["play"],
      });

    expect(resPut.statusCode).toEqual(200);
    expect(resPut.body.name).toBe("newUserName");
    expect(resPut.body.age).toBe(18);
    expect(resPut.body.id).toBe(resPost.body.id);
  });

  it("should delete a user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    const resDelete = await request(baseUrl).delete(
      `/api/users/${resPost.body.id}`
    );

    expect(resDelete.statusCode).toEqual(204);
  });

  it("should get deleted user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    await request(baseUrl).delete(`/api/users/${resPost.body.id}`);
    const resGetId = await request(baseUrl).get(
      `/api/users/${resPost.body.id}`
    );

    expect(resGetId.statusCode).toEqual(404);
  });
});

describe("Test scenario №2", () => {
  it("should return error when creating invalid new user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        hobbies: ["play"],
      });
    expect(resPost.statusCode).toEqual(400);
  });

  it("should return error when didn't have userId", async () => {
    await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 12,
        hobbies: ["play"],
      });
    const resGetId = await request(baseUrl).get(`/api/users/${111}`);
    expect(resGetId.statusCode).toEqual(400);
  });
});

describe("Test scenario №3", () => {
  it("should get all user", async () => {
    await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    let resGetAllUser = await request(baseUrl).get("/api/users");
    expect(resGetAllUser.statusCode).toEqual(200);
  });

  it("should return error when update deleted user", async () => {
    const resPost = await request(baseUrl)
      .post("/api/users")
      .send({
        name: "User",
        age: 13,
        hobbies: ["play"],
      });

    await request(baseUrl).delete(`/api/users/${resPost.body.id}`);
    const resPut = await request(baseUrl)
      .put(`/api/users/${resPost.body.id}`)
      .send({
        name: "newUserName",
        age: 18,
        hobbies: ["play"],
      });

    expect(resPut.statusCode).toEqual(404);
  });
});
