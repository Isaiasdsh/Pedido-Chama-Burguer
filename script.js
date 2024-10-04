let cart = [];
const deliveryFee = 5.00; // Taxa de entrega
const pixKey = "CNPJ 48243861000127"; // Chave Pix atualizada

// Função para adicionar itens ao carrinho
function addToCart(productName, sizeClass, breadClass, ingredientClass) {
    const size = document.querySelector(`input[name=${sizeClass}]:checked`).value;
    const bread = document.querySelector(`input[name=${breadClass}]:checked`).value;

    const ingredientCheckboxes = document.getElementsByClassName(ingredientClass);
    const removedIngredients = [];
    for (let checkbox of ingredientCheckboxes) {
        if (checkbox.checked) {
            removedIngredients.push(checkbox.value);
        }
    }

    let price = size === 'single' ? (productName === 'CHAMA Clássico' ? 25 : 29) : (productName === 'CHAMA Clássico' ? 33 : 37);

    cart.push({
        productName,
        size: size === 'single' ? 'Simples' : 'Duplo',
        bread,
        price,
        removedIngredients
    });

    displayCart();
}

// Função para exibir o carrinho e taxa de entrega
function displayCart() {
    const cartElement = document.getElementById("cart-content");
    const deliveryFeeElement = document.getElementById("delivery-fee");
    const totalPriceElement = document.getElementById("total-price");

    cartElement.innerHTML = "";

    let total = 0;
    cart.forEach((item, index) => {
        let removed = item.removedIngredients.length > 0 ? ` (Remover: ${item.removedIngredients.join(', ')})` : '';
        cartElement.innerHTML += `<p>${item.productName} (${item.size}) - Pão: ${item.bread}${removed} - R$${item.price.toFixed(2)} <button onclick="removeFromCart(${index})">Remover</button></p>`;
        total += item.price;
    });

    // Exibir a taxa de entrega de forma clara
    deliveryFeeElement.innerHTML = `<h3>Taxa de entrega: R$${deliveryFee.toFixed(2)}</h3>`;
    
    // Calcular o total final com a taxa de entrega
    total += deliveryFee;
    totalPriceElement.innerHTML = `<h3>Total com entrega: R$${total.toFixed(2)}</h3>`;
}

// Função para remover itens do carrinho
function removeFromCart(index) {
    cart.splice(index, 1); // Remove o item do carrinho
    displayCart(); // Atualiza o carrinho
}

// Mostrar ou esconder campos adicionais dependendo da forma de pagamento
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
    input.addEventListener('change', function() {
        if (this.value === "dinheiro") {
            document.getElementById("troco-section").style.display = "block";
            document.getElementById("pix-section").style.display = "none";
        } else if (this.value === "pix") {
            document.getElementById("troco-section").style.display = "none";
            document.getElementById("pix-section").style.display = "block";
        } else {
            document.getElementById("troco-section").style.display = "none";
            document.getElementById("pix-section").style.display = "none";
        }
    });
});

// Função para finalizar o pedido
function finalizeOrder() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const customerName = document.getElementById("customer-name").value;
    const address = document.getElementById("address").value;
    const reference = document.getElementById("reference").value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let troco = "";

    if (!customerName || !address || !reference) {
        alert("Por favor, preencha


