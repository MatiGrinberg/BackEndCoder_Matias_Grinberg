const app = require("../app");
const request = require("supertest");
const sinon = require("sinon");
const chai = require("chai"); // Add this line
const { expect } = chai; // Add this line
const AuthServices = require("../services/AuthServices");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe("PUT /changerole/:uid", function () {
  it("handle error when user logged-in tries to change a different user", async function () {
    const userId = "invalid_user_id";
    const error = new Error("Failed to change user role");
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "testuser@gmail.com", password: "testpassword" });
    const cookies = loginRes.headers["set-cookie"];
    const loggedInUserId = loginRes.body.userId;
    const res = await request(app)
      .put(`/changerole/${userId}`)
      .set("Cookie", cookies);
    expect(res.status).to.equal(403);
    expect(res.body)
      .to.have.property("error")
      .that.equals("Unauthorized: You can only change your own role");
    expect(userId).to.not.equal(loggedInUserId);
  });
});
