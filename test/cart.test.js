const app = require("../app");
const request = require("supertest");
const sinon = require("sinon");
const chai = require("chai");
const { expect } = chai;
const CartManager = require("../dao/CartManager"); // Import the CartManager service
const Cart = require("../dao/schemas/cartSchema");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe("DELETE /carts/:cid", function () {
  it("should delete all products from a cart", async function () {
    const cartId = "65bfbb56decda1068a8c7c36";
    const res = await request(app).delete(`/carts/${cartId}`);
    const cart = await Cart.findById(cartId);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "All products deleted from cart"
    );
    expect(cart.products).to.be.an("array").that.is.empty;
  });
});
