const app = require("../app");
const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");

describe("GET /products", function () {
  it("should render products view with correct data", async function () {
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "testuser@gmail.com", password: "testpassword" });
    const cookies = loginRes.headers["set-cookie"];
    const res = await request(app).get("/products").set("Cookie", cookies);
    expect(res.status).to.equal(200);
    const productContainers = res.text.match(/<div class="product-container"/g);
    expect(productContainers).to.have.lengthOf(9);
  });
  it("should return a product by its ID", async function () {
    const productId = "6574bfddcb529059d1571c96";
    const res = await request(app).get(`/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(typeof res.body.payload._id).to.equal("string");
    expect(typeof res.body.payload.title).to.equal("string");
    expect(typeof res.body.payload.description).to.equal("string");
    expect(typeof res.body.payload.price).to.equal("number");
    expect(typeof res.body.payload.stock).to.equal("number");
    expect(typeof res.body.payload.category).to.equal("string");
  });
});
