const express = require("express");
const router = express.Router();
const cartService = require("../services/CartServices");
const roleMiddleware = require("../middleware/roleAuth");

/**
 * @swagger
 * /carts/{cid}/purchase:
 *   post:
 *     summary: Purchase a product from the cart
 *     description: Purchase a product from the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID of the cart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product purchased successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.route("/:cid/purchase").post(async (req, res) => {
  await cartService.handlePurchaseCart(req, res);
});

/**
 * @swagger
 * /carts/{cid}/payment:
 *   post:
 *     summary: Process payment for products in the cart
 *     description: Process payment for the products in the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID of the cart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.route("/:cid/payment").post(async (req, res) => {
  await cartService.handlePaymentCart(req, res);
});

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     description: Create a new cart.
 *     tags:
 *      - Carts
 *     responses:
 *       200:
 *         description: Cart created successfully
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all carts
 *     description: Retrieve all carts from the server.
 *     tags:
 *      - Carts
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .post(async (req, res) => {
    await cartService.handleCreateCart(req, res);
  })
  .get(async (req, res) => {
    await cartService.handleGetAllCarts(req, res);
  });

/**
 * @swagger
 * /carts/{cid}:
 *   parameters:
 *     - name: cid
 *       in: path
 *       description: ID of the cart
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     summary: Get cart by ID
 *     description: Retrieve a cart from the server by its ID.
 *     tags:
 *       - Carts
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete all products from the cart
 *     description: Delete all products from the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     responses:
 *       200:
 *         description: Products deleted successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update cart with products
 *     description: Update the cart with the given CID with new products.
 *     tags:
 *      - Carts
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router
  .route("/:cid")
  .get(async (req, res) => {
    await cartService.handleGetCartById(req, res);
  })
  .delete(async (req, res) => {
    await cartService.handleDeleteAllProductsFromCart(req, res);
  })
  .put(async (req, res) => {
    await cartService.handleUpdateCartWithProducts(req, res);
  });

/**
 * @swagger
 * /carts/{cid}/product/{pid}:
 *   parameters:
 *     - name: cid
 *       in: path
 *       description: ID of the cart
 *       required: true
 *       schema:
 *         type: string
 *     - name: pid
 *       in: path
 *       description: ID of the product
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a product to the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     security:
 *       - roleAuth: []
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       403:
 *         description: Unauthorized request
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a product from the cart
 *     description: Delete a product from the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     security:
 *       - roleAuth: []
 *     responses:
 *       200:
 *         description: Product deleted from cart successfully
 *       403:
 *         description: Unauthorized request
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update product quantity in the cart
 *     description: Update the quantity of a product in the cart associated with the given CID.
 *     tags:
 *       - Carts
 *     security:
 *       - roleAuth: []
 *     responses:
 *       200:
 *         description: Product quantity updated in cart successfully
 *       403:
 *         description: Unauthorized request
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Server error
 */
router
  .route("/:cid/product/:pid")
  .post(roleMiddleware(["usuario"]), async (req, res) => {
    await cartService.handleAddProductToCart(req, res);
  })
  .delete(roleMiddleware(["usuario"]), async (req, res) => {
    await cartService.handleDeleteProductFromCart(req, res);
  })
  .put(roleMiddleware(["usuario"]), async (req, res) => {
    await cartService.handleUpdateProductQuantityInCart(req, res);
  });

module.exports = router;
