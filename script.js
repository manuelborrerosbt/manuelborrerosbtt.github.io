// Función para alternar entre los formularios de inicio de sesión y registro
function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

// Función para registrar un nuevo usuario
function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    // Guarda los datos del usuario en el almacenamiento local
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleForms(); // Cambia a la vista de inicio de sesión
}

// Función para iniciar sesión
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // Obtiene los datos del almacenamiento local
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    // Verifica las credenciales
    if (username === storedUsername && password === storedPassword) {
        alert("Inicio de sesión exitoso.");
        document.getElementById("authSection").style.display = "none"; // Oculta la sección de autenticación
        document.getElementById("orderSection").style.display = "block"; // Muestra el formulario de pedido
    } else {
        alert("Nombre de usuario o contraseña incorrectos.");
    }
}

// Función para calcular el total del pedido
function calculateTotal() {
    const cakeWeight = parseFloat(document.getElementById("cakeWeight").value) || 0;
    const candles = document.getElementById("candles");
    const numCandles = candles.selectedOptions.length;
    const photoOption = document.getElementById("photoOption").checked;

    const cakePricePerKg = 13; // Precio por kg de tarta
    const candlePrice = 0.75; // Precio por vela
    const photoPrice = 7; // Precio por foto

    const total = (cakeWeight * cakePricePerKg) + (numCandles * candlePrice) + (photoOption ? photoPrice : 0);
    document.getElementById("totalAmount").value = total.toFixed(2); // Mostrar total
    document.getElementById("remainingBalance").value = (total - (parseFloat(document.getElementById("advance").value) || 0)).toFixed(2);
}

// Función para manejar el envío del formulario de pedido
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío del formulario y la recarga de la página

    const order = {
        customerName: document.getElementById("customerName").value,
        deliveryDate: document.getElementById("deliveryDate").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        cakeWeight: document.getElementById("cakeWeight").value,
        filling: Array.from(document.getElementById("filling").selectedOptions).map(option => option.value),
        cover: Array.from(document.getElementById("cover").selectedOptions).map(option => option.value),
        photoOption: document.getElementById("photoOption").checked,
        candles: Array.from(document.getElementById("candles").selectedOptions).map(option => option.value),
        notes: document.getElementById("notes").value,
        totalAmount: document.getElementById("totalAmount").value,
        advance: document.getElementById("advance").value,
        remainingBalance: document.getElementById("remainingBalance").value,
        date: new Date().toLocaleString() // Fecha de creación
    };

    // Guarda el pedido en el almacenamiento local
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    displayOrders(); // Actualiza el historial de pedidos

    // Resetea el formulario
    document.getElementById("orderForm").reset();
    calculateTotal(); // Vuelve a calcular el total
});

// Función para mostrar el historial de pedidos
function displayOrders() {
    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = ""; // Limpia la lista antes de mostrar

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${order.customerName}</p>
            <p><strong>Fecha de Entrega:</strong> ${order.deliveryDate}</p>
            <p><strong>Número de Teléfono:</strong> ${order.phoneNumber}</p>
            <p><strong>Peso de la Tarta:</strong> ${order.cakeWeight} kg</p>
            <p><strong>Relleno:</strong> ${order.filling.join(", ")}</p>
            <p><strong>Cubierta:</strong> ${order.cover.join(", ")}</p>
            <p><strong>Foto:</strong> ${order.photoOption ? "Sí" : "No"}</p>
            <p><strong>Velas:</strong> ${order.candles.join(", ")}</p>
            <p><strong>Anotaciones:</strong> ${order.notes}</p>
            <p><strong>Importe Total:</strong> €${order.totalAmount}</p>
            <p><strong>Anticipo:</strong> €${order.advance}</p>
            <p><strong>Importe Pendiente:</strong> €${order.remainingBalance}</p>
            <p><strong>Fecha de Pedido:</strong> ${order.date}</p>
            <hr>
        `;
        ordersList.appendChild(orderDiv);
    });
}

// Muestra el historial de pedidos al cargar la página
document.addEventListener("DOMContentLoaded", displayOrders);
