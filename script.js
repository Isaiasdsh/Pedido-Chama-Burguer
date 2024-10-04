let cart = [];
const deliveryFee = 5.00; // Taxa de entrega
const pixKey = "123e4567-e89b-12d3-a456-426614174000"; // Chave Pix

// Função para adicionar itens ao carrinho
function addToCart(productName, sizeClass, breadClass, ingredientClass) {
    const size = document.querySelector(`input[name=${sizeClass}]:checked`).value;
    const bread = document.querySelector(`input[name=${breadClass}]:checked`).value;

    let price = size === 'single' ? (productName === 'CHAMA Clássico' ? 25 : 29) : (productName === 'CHAMA Clássico' ? 33 : 37);

    cart.push({
        productName,
        size: size === 'single' ? 'Simples' : 'Duplo',
        bread,
        price
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
    cart.forEach((item) => {
        cartElement.innerHTML += `<p>${item.productName} (${item.size}) - Pão: ${item.bread} - R$${item.price.toFixed(2)}</p>`;
        total += item.price;
    });

    // Exibir a taxa de entrega de forma clara
    deliveryFeeElement.innerHTML = `<h3>Taxa de entrega: R$${deliveryFee.toFixed(2)}</h3>`;
    
    // Calcular o total final com a taxa de entrega
    total += deliveryFee;
    totalPriceElement.innerHTML = `<h3>Total com entrega: R$${total.toFixed(2)}</h3>`;
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
        alert("Por favor, preencha todos os campos de endereço, ponto de referência e nome.");
        return;
    }

    // Verificar se foi selecionado "Dinheiro" e se o cliente precisa de troco
    if (paymentMethod === "dinheiro") {
        troco = document.getElementById("troco").value;
        if (troco === "") {
            troco = "Sem necessidade de troco";
        } else {
            troco = `Troco para: R$${troco}`;
        }
    }

    // Gerar a comanda para enviar via WhatsApp
    let orderSummary = `🍔 *Pedido de ${customerName}* 🍔\n\n`;
    orderSummary += `📍 *Endereço:* ${address}\n`;
    orderSummary += `📝 *Ponto de Referência:* ${reference}\n\n`;
    
    let total = 0;
    cart.forEach((item) => {
        orderSummary += `🍔 *Hambúrguer:* ${item.productName} (${item.size}) - Pão: ${item.bread}\n💵 *Preço:* R$${item.price.toFixed(2)}\n---\n`;
        total += item.price;
    });

    total += deliveryFee;
    orderSummary += `\n📦 *Taxa de entrega:* R$${deliveryFee.toFixed(2)}\n💰 *Total com entrega:* R$${total.toFixed(2)}\n\n`;
    orderSummary += `💳 *Forma de pagamento:* ${paymentMethod}\n`;

    if (paymentMethod === "dinheiro") {
        orderSummary += `🤑 ${troco}\n`;
    } else if (paymentMethod === "pix") {
        orderSummary += `🔑 *Chave Pix:* ${pixKey}\n📎 *Por favor, envie o comprovante pelo WhatsApp.*\n`;
    }

    orderSummary += `\n*Obrigado pelo seu pedido!* 😊`;

    // Enviar a comanda para o WhatsApp
    sendOrderToWhatsApp(orderSummary);

    // Limpar o carrinho após o envio
    cart = [];
    displayCart();
}

// Função para enviar pedido via WhatsApp
function sendOrderToWhatsApp(orderSummary) {
    const phoneNumber = "48991490613"; // Número do WhatsApp no formato internacional
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappLink, '_blank');
}


