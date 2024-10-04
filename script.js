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

    // Função para gerar o código Pix Copia e Cola
function generatePixCode() {
    const pixKey = "48243861000127"; // Chave Pix (CNPJ - Nubank)
    const merchantName = "Chama Burguer"; // Nome do comerciante
    const merchantCity = "FLORIANOPOLIS"; // Cidade do comerciante (máximo 15 caracteres)
    const total = calculateTotal(); // Função para calcular o valor total do pedido
    const transactionId = "CHAMABURGER123"; // Identificador único da transação

    // Formatando o valor para incluir sempre duas casas decimais
    const formattedTotal = total.toFixed(2).replace('.', '');

    // Gera o código Pix Copia e Cola no formato EMV QR Code
    const pixCode = `
        000201
        010212
        26${pixKey.length + 5}0014BR.GOV.BCB.PIX01${pixKey.length}${pixKey}
        52040000
        5303986
        54${('' + formattedTotal).length}${formattedTotal}
        5802BR
        5914${merchantName}
        6011${merchantCity}
        62070503${transactionId}
        6304
    `.replace(/\s+/g, ''); // Remove espaços e novas linhas

    // Calcula o CRC16 do código para validar
    const crc = generateCRC16(pixCode);

    // Adiciona o CRC no final do código Pix Copia e Cola
    const finalPixCode = pixCode + crc;

    // Insere o código no textarea
    document.getElementById("pix-code").value = finalPixCode;
}

// Função para calcular o CRC16 (obrigatório no Pix Copia e Cola)
function generateCRC16(pixCode) {
    let crc = 0xFFFF;
    let polynomial = 0x1021;

    for (let i = 0; i < pixCode.length; i++) {
        let byte = pixCode.charCodeAt(i);
        crc ^= byte << 8;

        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }

    crc &= 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Função para calcular o valor total do pedido
function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    total += deliveryFee; // Adiciona a taxa de entrega
    return total;
}

    // Função para copiar o código Pix Copia e Cola
function copyPixCode() {
    const pixCode = document.getElementById("pix-code");

    // Seleciona o conteúdo do textarea
    pixCode.select();
    pixCode.setSelectionRange(0, 99999); // Para compatibilidade com dispositivos móveis

    // Executa o comando de copiar
    document.execCommand("copy");

    // Mostrar mensagem de sucesso
    document.getElementById("copy-success").style.display = "block";

    // Esconder mensagem após 2 segundos
    setTimeout(() => {
        document.getElementById("copy-success").style.display = "none";
    }, 2000);
}


// Função para calcular o valor total do pedido
function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    total += deliveryFee; // Adiciona a taxa de entrega
    return total;
}


// Função para calcular o valor total do pedido
function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    total += deliveryFee; // Adiciona a taxa de entrega
    return total;
}

    // Função para copiar o código Pix Copia e Cola
function copyPixCode() {
    const pixCode = document.getElementById("pix-code");
    pixCode.select();
    document.execCommand("copy");

    // Mostrar mensagem de sucesso
    document.getElementById("copy-success").style.display = "block";

    // Esconder mensagem após 2 segundos
    setTimeout(() => {
        document.getElementById("copy-success").style.display = "none";
    }, 2000);
}


// Função para calcular o valor total do pedido
function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    total += deliveryFee; // Adiciona a taxa de entrega
    return total;
}



    // Gerar a comanda para enviar via WhatsApp
    let orderSummary = `🍔 *Pedido de ${customerName}* 🍔\n\n`;
    orderSummary += `📍 *Endereço:* ${address}\n`;
    orderSummary += `📝 *Ponto de Referência:* ${reference}\n\n`;
    
    let total = 0;

    cart.forEach((item) => {
        let removed = item.removedIngredients.length > 0 ? ` (Remover: ${item.removedIngredients.join(', ')})` : '';
        orderSummary += `🍔 *Hambúrguer:* ${item.productName}\n`;
        orderSummary += `Tamanho: ${item.size}\n`;
        orderSummary += `Pão: ${item.bread}${removed}\n`;
        orderSummary += `💵 *Preço:* R$${item.price.toFixed(2)}\n`;
        orderSummary += `---\n`;
        total += item.price;
    });

    total += deliveryFee; // Adicionar taxa de entrega
    orderSummary += `\n💰 *Total com entrega:* R$${total.toFixed(2)}\n`;
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



