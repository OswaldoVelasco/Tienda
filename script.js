// ==========================================
// PRODUCTOS
// ==========================================

const productos = [

    {
        id: 1,
        nombre: "Laptop Pro 15",
        precio: 15999
    },

    {
        id: 2,
        nombre: "Audífonos Bluetooth",
        precio: 899
    },

    {
        id: 3,
        nombre: "Teclado Mecánico",
        precio: 1299
    },

    {
        id: 4,
        nombre: "Mouse Gamer",
        precio: 699
    },

    {
        id: 5,
        nombre: 'Monitor 24" Full HD',
        precio: 3499
    },

    {
        id: 6,
        nombre: "Webcam HD",
        precio: 799
    },

    {
        id: 7,
        nombre: "Bocina Bluetooth",
        precio: 1199
    },

    {
        id: 8,
        nombre: "Power Bank 20,000 mAh",
        precio: 599
    },

    {
        id: 9,
        nombre: "Memoria USB 128 GB",
        precio: 349
    },

    {
        id: 10,
        nombre: "Disco SSD 1 TB",
        precio: 1499
    }

];


// ==========================================
// RECUPERAR CARRITO
// ==========================================

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const carritoPanel =
    document.getElementById("carritoPanel");

const carritoOverlay =
    document.getElementById("carritoOverlay");

const carritoContenido =
    document.getElementById("carritoContenido");

const carritoTotal =
    document.getElementById("carritoTotal");

const contadorCarrito =
    document.getElementById("contadorCarrito");

const abrirCarrito =
    document.getElementById("abrirCarrito");

const cerrarCarrito =
    document.getElementById("cerrarCarrito");


// ==========================================
// ABRIR CARRITO
// ==========================================

abrirCarrito.addEventListener("click", function(event) {

    event.preventDefault();

    carritoPanel.classList.add("abierto");

    carritoOverlay.classList.add("abierto");

    mostrarCarrito();

});


// ==========================================
// CERRAR CARRITO
// ==========================================

cerrarCarrito.addEventListener("click", function() {

    carritoPanel.classList.remove("abierto");

    carritoOverlay.classList.remove("abierto");

});


carritoOverlay.addEventListener("click", function() {

    carritoPanel.classList.remove("abierto");

    carritoOverlay.classList.remove("abierto");

});


// ==========================================
// AGREGAR PRODUCTO
// ==========================================

function agregarAlCarrito(idProducto) {

    const producto =
        productos.find(
            producto => producto.id === idProducto
        );


    if (!producto) {

        console.error("Producto no encontrado");

        return;

    }


    const productoExistente =
        carrito.find(
            item => item.id === idProducto
        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            cantidad: 1

        });

    }


    guardarCarrito();

    mostrarCarrito();

}


// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

function aumentarCantidad(idProducto) {

    const producto =
        carrito.find(
            item => item.id === idProducto
        );


    if (producto) {

        producto.cantidad++;

    }


    guardarCarrito();

    mostrarCarrito();

}


// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

function disminuirCantidad(idProducto) {

    const producto =
        carrito.find(
            item => item.id === idProducto
        );


    if (!producto) {

        return;

    }


    producto.cantidad--;


    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                item => item.id !== idProducto
            );

    }


    guardarCarrito();

    mostrarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarProducto(idProducto) {

    carrito =
        carrito.filter(
            item => item.id !== idProducto
        );


    guardarCarrito();

    mostrarCarrito();

}


// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    carritoContenido.innerHTML = "";


    // --------------------------------------
    // CARRITO VACÍO
    // --------------------------------------

    if (carrito.length === 0) {

        carritoContenido.innerHTML = `
        
            <div class="carrito-vacio">
                🛒 Tu carrito está vacío.
            </div>

        `;

        carritoTotal.textContent = "$0";

        contadorCarrito.textContent = "0";

        return;

    }


    let total = 0;

    let cantidadTotal = 0;


    // --------------------------------------
    // CREAR PRODUCTOS
    // --------------------------------------

    carrito.forEach(producto => {


        const subtotal =
            producto.precio * producto.cantidad;


        total += subtotal;

        cantidadTotal += producto.cantidad;


        const item =
            document.createElement("div");


        item.className = "item-carrito";


        item.innerHTML = `

            <div class="item-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p class="item-precio">
                    $${producto.precio.toLocaleString("es-MX")}
                </p>


                <div class="cantidad-control">

                    <button
                        onclick="disminuirCantidad(${producto.id})"
                    >
                        −
                    </button>


                    <span class="cantidad">
                        ${producto.cantidad}
                    </span>


                    <button
                        onclick="aumentarCantidad(${producto.id})"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="eliminar-producto"
                onclick="eliminarProducto(${producto.id})"
                title="Eliminar producto"
            >
                🗑️
            </button>

        `;


        carritoContenido.appendChild(item);

    });


    // --------------------------------------
    // ACTUALIZAR TOTAL
    // --------------------------------------

    carritoTotal.textContent =
        "$" + total.toLocaleString("es-MX");


    // --------------------------------------
    // ACTUALIZAR CONTADOR
    // --------------------------------------

    contadorCarrito.textContent =
        cantidadTotal;

}


// ==========================================
// BOTONES "AGREGAR AL CARRITO"
// ==========================================

const tarjetas =
    document.querySelectorAll(".producto");


tarjetas.forEach(tarjeta => {

    const boton =
        tarjeta.querySelector(".boton");

    const idProducto =
        Number(tarjeta.dataset.id);


    boton.addEventListener("click", function() {

        agregarAlCarrito(idProducto);


        // Abrir carrito automáticamente

        carritoPanel.classList.add("abierto");

        carritoOverlay.classList.add("abierto");

    });

});

// ==========================================
// FINALIZAR COMPRA
// ==========================================

const botonComprar =
    document.getElementById("botonComprar");

const compraPanel =
    document.getElementById("compraPanel");

const compraOverlay =
    document.getElementById("compraOverlay");

const cerrarCompra =
    document.getElementById("cerrarCompra");

const enviarWhatsApp =
    document.getElementById("enviarWhatsApp");

const nombreCliente =
    document.getElementById("nombreCliente");

const telefonoCliente =
    document.getElementById("telefonoCliente");

const resumenProductos =
    document.getElementById("resumenProductos");

const resumenTotal =
    document.getElementById("resumenTotal");


// ==========================================
// ABRIR FORMULARIO DE COMPRA
// ==========================================

botonComprar.addEventListener("click", function() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;

    }

    mostrarResumenCompra();

    compraPanel.classList.add("abierto");

    compraOverlay.classList.add("abierto");

});


// ==========================================
// CERRAR FORMULARIO
// ==========================================

cerrarCompra.addEventListener("click", function() {

    compraPanel.classList.remove("abierto");

    compraOverlay.classList.remove("abierto");

});


compraOverlay.addEventListener("click", function() {

    compraPanel.classList.remove("abierto");

    compraOverlay.classList.remove("abierto");

});


// ==========================================
// MOSTRAR RESUMEN
// ==========================================

function mostrarResumenCompra() {

    resumenProductos.innerHTML = "";

    let total = 0;


    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;

        total += subtotal;


        const productoResumen =
            document.createElement("div");

        productoResumen.className =
            "producto-resumen";


        productoResumen.innerHTML = `

            <div>
                <strong>
                    ${producto.nombre}
                </strong>

                <span>
                    ${producto.cantidad} x
                    $${producto.precio.toLocaleString("es-MX")}
                </span>
            </div>

            <strong>
                $${subtotal.toLocaleString("es-MX")}
            </strong>

        `;


        resumenProductos.appendChild(
            productoResumen
        );

    });


    resumenTotal.textContent =
        "$" + total.toLocaleString("es-MX");

}


// ==========================================
// ENVIAR PEDIDO POR WHATSAPP
// ==========================================

enviarWhatsApp.addEventListener("click", function() {

    const nombre =
        nombreCliente.value.trim();

    const telefono =
        telefonoCliente.value.trim();


    // Validar nombre

    if (nombre === "") {

        alert("Por favor escribe tu nombre.");

        nombreCliente.focus();

        return;

    }


    // Validar teléfono

    if (telefono === "") {

        alert("Por favor escribe tu teléfono.");

        telefonoCliente.focus();

        return;

    }


    // ==========================================
    // CALCULAR TOTAL
    // ==========================================

    let total = 0;


    let mensajeProductos = "";


    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;

        total += subtotal;


        mensajeProductos +=
            `- ${producto.nombre} x${producto.cantidad} — $${subtotal.toLocaleString("es-MX")}\n`;

    });


    // ==========================================
    // CREAR MENSAJE
    // ==========================================

    const mensaje =

`🛒 *NUEVO PEDIDO*

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}

📦 *Productos:*
${mensajeProductos}
💰 *TOTAL:* $${total.toLocaleString("es-MX")}

¡Gracias por tu compra!`;


    // ==========================================
    // NÚMERO DE WHATSAPP DE LA TIENDA
    // ==========================================

    const numeroWhatsApp =
        "525535006910";


    // ==========================================
    // CREAR ENLACE
    // ==========================================

    const urlWhatsApp =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensaje);


    // ==========================================
    // ABRIR WHATSAPP
    // ==========================================

    window.open(
        urlWhatsApp,
        "_blank"
    );

});

// ==========================================
// INICIALIZAR
// ==========================================

mostrarCarrito();