const express = require("express");
const router = express.Router();
const ProductServices = require("../services/ProductServices");
const roleMiddleware = require("../middleware/roleAuth");

router.route("/mockingproducts").get(async (req, res) => {
  await ProductServices.mock(req, res);
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products from the server.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add a new product
 *     description: Add a new product to the server.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Product added successfully
 *       500:
 *         description: Server error
 */

router
  .route("/")
  .get(async (req, res) => {
    await ProductServices.getAllProducts(req, res);
  })
  .post(roleMiddleware(["admin", "premium"]), async (req, res) => {
    await ProductServices.addProduct(req, res);
  });

/**
 * @swagger
 * /products/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of the product
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a product from the server by its ID.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a product
 *     description: Update a product on the server. Requires admin role.
 *     tags:
 *      - Products
 *     security:
 *      - roleAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Unauthorized request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product from the server. Requires admin or premium role.
 *     tags:
 *      - Products
 *     security:
 *       - roleAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Unauthorized request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id")
  .get(async (req, res) => {
    await ProductServices.getProductById(req, res);
  })
  .put(roleMiddleware(["admin"]), async (req, res) => {
    await ProductServices.updateProduct(req, res);
  })
  .delete(roleMiddleware(["admin", "premium", "usuario"]), async (req, res) => {
    await ProductServices.deleteProduct(req, res);
  });

module.exports = router;
