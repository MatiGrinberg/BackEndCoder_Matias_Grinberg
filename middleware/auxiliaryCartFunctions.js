async function stockCart(cart) {
  try {
    const inStock = [];
    const outOfStock = [];
    let totalAmount = 0;
    for (const product of cart.products) {
      if (product.quantity <= product._id.stock) {
        inStock.push(product);
        totalAmount += product.quantity * product._id.price;
      } else {
        outOfStock.push(product);
      }
    }
    const result = {
      inStock,
      outOfStock,
      userId: cart.userId,
      code: Math.random().toString(36).substring(2, 10),
      amount: totalAmount,
      purchaser: cart.userId.email,
    };
    return result;
  } catch (error) {
    console.error("Error comparing Cart_Q vs Stock:", error.message);
    return false;
  }
}

module.exports = { stockCart };
