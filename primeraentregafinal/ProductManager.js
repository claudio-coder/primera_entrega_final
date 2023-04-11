import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  isAnyValueUndefined(product) {
    const productFields = Object.keys(product);

    return productFields
      .filter((aField) => aField !== "thumbnail")
      .some((aField) => product[aField] === undefined);
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock
  ) {
    const product = {
      id: 0,
      title,
      description,
      price,
      thumbnail,
      code: code,
      status,
      category,
      stock,
    };
    let products = [product];

    const isAnyValueUndefined = this.isAnyValueUndefined(product);

    if (isAnyValueUndefined) {
      throw new Error("A field is missing");
    }

    if (fs.existsSync(this.path)) {
      products = await this.getProducts();

      const isAnyCodeRepeated = products.some(
        (aProduct) => aProduct.code === code
      );

      if (isAnyCodeRepeated) {
        console.error("Repeated product");
        throw new Error("Repeated product");
      }

      const lastIndex = products.length - 1;
      product.id = products[lastIndex].id + 1;
      products.push(product);
    }

    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return products;
  }

  async getProducts() {
    const products = JSON.parse(await fs.promises.readFile(this.path));
    return products;
  }

  async getProductById(productId) {
    const products = JSON.parse(await fs.promises.readFile(this.path));

    const productWithSimilarId = products.find(
      (aProduct) => aProduct.id === productId
    );
    if (productWithSimilarId === undefined) {
      // console.error("Not found");
      throw new Error("Product Not Found");
    }
    console.log(productWithSimilarId);
    return productWithSimilarId;
  }

  async updateProduct(productId, toUpdateFields) {
    const products = await this.getProducts();

    const productIdx = products.findIndex(
      (aProduct) => aProduct.id === productId
    );
    if (productIdx === -1) {
      throw new Error("Product Not Found");
    }

    const oldProduct = products[productIdx];
    const newProduct = {
      ...oldProduct,
      ...toUpdateFields,
    };

    products[productIdx] = newProduct;

    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return products;
  }

  async deleteProduct(productId) {
    const products = await this.getProducts();

    const productIdx = products.findIndex(
      (aProduct) => aProduct.id === productId
    );
    if (productIdx < 0) {
      console.error("Not exist");
      return;
    }

    products.splice(productIdx, 1);

    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return products;
  }
}

// const miProductManager = new ProductManager("./products.json");

// miProductManager.addProduct(
//   "Old Prince 15kg",
//   "Comida para Gatos",
//   9660,
//   "Sin imagen",
//   "oldpri15K",
//   28
// );
