const socket = io();
socket.on('products', products => {
    const productsDiv = document.getElementById('products')
    let productsList = ''
    products.forEach(product => {
        productsList += `<ul>
             <li>Id: ${product.id}</li>
            <li>Producto: ${product.title}</li>
            <li>Descripción: ${product.description}</li>
            <li>Precio: ${product.price}</li>
            <li>Código: ${product.code}</li>
            <li>Status: ${product.status}</li>
            <li>Categoría: ${product.category}</li>
            <li>Stock: ${product.code}</li>
            <hr>
        </ul>`
    })
    productsDiv.innerHTML = productsList;
})
