let cart = [];

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

// Função para exibir o carrinho
function displayCart() {
  const cartElement = document.getElementById("cart-content");
  cartElement.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    let removed = item.removedIngredients.length > 0 ? ` (Remover: ${item.removedIngredients.join(', ')})` : '';
    cartElement.innerHTML += `<p>${item.productName} (${item.size}) - Pão: ${item.bread}${removed} - R$${item.price.toFixed(2)} <button onclick="removeFromCart(${index})">Remover</button></p>`;
    total += item.price;
  });

  total += 5.00;
  cartElement.innerHTML += `<h3>Total com entrega: R$${total.toFixed(2)}</h3>`;
}

// Função para remover itens do carrinho
function removeFromCart(index) {
  cart.splice(index, 1); // Remove o item do carrinho
  displayCart(); // Atualiza o carrinho
}

// Função para enviar pedido via WhatsApp
function sendOrderToWhatsApp(orderSummary) {
  const phoneNumber = "48991490613"; // Número do WhatsApp no formato internacional (sem o "+")
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;
  window.open(whatsappLink, '_blank');
}

// Função para finalizar o pedido
function finalizeOrder() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const customerName = document.getElementById("customer-name").value;
  const address = document.getElementById("address").value;
  const reference = document.getElementById("reference").value;

  if (!customerName || !address || !reference) {
    alert("Por favor, preencha todos os campos de endereço, ponto de referência e nome.");
    return;
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

  total += 5.00; // Adicionar taxa de entrega
  orderSummary += `\n💰 *Total com entrega:* R$${total.toFixed(2)}\n\n`;
  orderSummary += `*Obrigado pelo seu pedido!* 😊`;

  // Enviar a comanda para o WhatsApp
  sendOrderToWhatsApp(orderSummary);

  // Limpar o carrinho após o envio
  cart = [];
  displayCart();
}

