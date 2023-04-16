import fs from "fs";
import { send } from "process";

export class CartManager {
  constructor(path, productManager) {
    this.path = path;
    this.productManager = productManager;
  }

  async addCart() {
    const cart = { id: 0, products: [] };
    let carts = [cart];

    if (fs.existsSync(this.path)) {
      carts = await this.getCarts();

      const lastIndex = carts.length - 1;
      cart.id = carts[lastIndex].id + 1;
      carts.push(cart);
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return cart;
  }

  async getCarts() {
    const carts = JSON.parse(await fs.promises.readFile(this.path));
    return carts;
  }

  async getCartById(cartId) {
    const carts = JSON.parse(await fs.promises.readFile(this.path));

    const cartWithSimilarId = carts.find((aCart) => aCart.id === cartId);

    if (!cartWithSimilarId) throw new Error("Cart not found");

    return cartWithSimilarId;
  }

  async updateProductCartById(cartId, productId) {
    const carts = await this.getCarts();
    const cartIdFound = carts.findIndex((aCart) => aCart.id === cartId);
    if (cartIdFound < 0) throw new Error("Cart not found");

    await this.productManager.getProductById(productId);

    const productIdx = carts[cartIdFound].products.findIndex(
      (aProduct) => aProduct.id === productId
    );

    if (productIdx < 0) {
      const newProduct = {
        id: productId,
        quantity: 1,
      };

      carts[cartIdFound].products.push(newProduct);
    } else {
      const product = carts[cartIdFound].products[productIdx];
      product.quantity = product.quantity + 1;

      carts[cartIdFound].products[productIdx] = product;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return carts[cartIdFound];
  }
}
