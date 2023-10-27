class ProductManager {
    constructor() {
      this.products = [];
      this.nextProductId = 1;
    }
  
    // Method to add a product
    addProduct(product) {
      // Assign a unique ID and increment the counter
      product.id = this.generateUniqueCode();;
      this.products.push(product);
      this.nextProductId++;
    }

    // Method to generate a unique code
    generateUniqueCode() {
      return this.nextProductId;
  }
  
    // Method to remove a product by its ID
    removeProduct(productId) {
      this.products = this.products.filter(product => product.id !== productId);
    }
  
    // Method to list all products
    getProducts() {
      return this.products;
    }

    // Method to get a product by its ID
    getProductById(productId) {
      const product = this.products.find(product => product.id === productId);
      if (!product) {
        console.error("Product not found");
      }
      return product;
    }
  
  }

  // Use the ProductManager class
  const productManager = new ProductManager();
  
  // Add products
  productManager.addProduct({ name: "Boot", description: "Brown leather boot", price: 10.99, img: "assets/img/boot.jpg", stock: 10 });
  productManager.addProduct({ name: "Hat", description: "Brown leather hat", price: 15.99, img: "assets/img/hat.jpg", stock: 10 });
  
  // Mehtods execution
  console.log("List of Products:", productManager.getProducts());
  console.log("Get product:", productManager.getProductById(2));
  console.log("Get product:", productManager.getProductById(3));
  productManager.removeProduct(1);
  console.log("Updated products:", productManager.getProducts());


  

















