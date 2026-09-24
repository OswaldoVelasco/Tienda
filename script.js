// ==========================================
// VARIABLES
// ==========================================

let productos = [];

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const contenedorProductos =
    document.getElementById("productos");

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
// CARGAR CATÁLOGO CSV
// ==========================================

async function cargarCatalogo() {

    try {

        const respuesta =
            await fetch("catalogo.csv");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar catalogo.csv"
            );

        }

        const texto =
            await respuesta.text();

        productos =
            convertirCSV(texto);

        mostrarProductos();

        conectarBotones();

        mostrarCarrito();

        console.log(
            "Catálogo cargado:",
            productos
        );

    } catch (error) {

        console.error(
            "Error al cargar el catálogo:",
            error
        );

        contenedorProductos.innerHTML = `

            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">
                No se pudo cargar el catálogo.
            </p>

        `;

    }

}


// ==========================================
// CONVERTIR CSV
// ==========================================

function convertirCSV(texto) {

    const filas =
        [];

    let fila =
        [];

    let campo =
        "";

    let dentroComillas =
        false;


    for (let i = 0; i < texto.length; i++) {

        const caracter =
            texto[i];

        const siguiente =
            texto[i + 1];


        if (caracter === '"' && dentroComillas && siguiente === '"') {

            campo += '"';

            i++;

        }

        else if (caracter === '"') {

            dentroComillas =
                !dentroComillas;

        }

        else if (caracter === "," && !dentroComillas) {

            fila.push(campo);

            campo = "";

        }

        else if (
            (caracter === "\n" || caracter === "\r")
            && !dentroComillas
        ) {

            if (caracter === "\r" && siguiente === "\n") {

                i++;

            }

            fila.push(campo);

            campo = "";

            if (fila.some(valor => valor.trim() !== "")) {

                filas.push(fila);

            }

            fila = [];

        }

        else {

            campo += caracter;

        }

    }


    if (campo !== "" || fila.length > 0) {

        fila.push(campo);

        filas.push(fila);

    }


    if (filas.length < 2) {

        return [];

    }


    const encabezados =
        filas[0].map(
            encabezado =>
                encabezado.trim().toLowerCase()
        );


    return filas
        .slice(1)
        .map(fila => {

            const producto = {};

            encabezados.forEach(
                (encabezado, indice) => {

                    producto[encabezado] =
                        fila[indice]
                            ? fila[indice].trim()
                            : "";

                }
            );


            return {

                id:
                    Number(producto.id),

                nombre:
                    producto.nombre,

                categoria:
                    producto.categoria,

                descripcion:
                    producto.descripcion,

                precio:
                    Number(
                        producto.precio
                            .replace(/[$,]/g, "")
                    ),

                imagen:
                    producto.imagen

            };

        })
        .filter(
            producto =>
                producto.id &&
                producto.nombre
        );

}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos() {

    contenedorProductos.innerHTML = "";


    productos.forEach(producto => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "producto";

        tarjeta.dataset.id =
            producto.id;


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="img/${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </div>


            <div class="producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p class="categoria">
                    ${producto.categoria}
                </p>

                <p class="descripcion">
                    ${producto.descripcion}
                </p>

                <p class="precio">
                    $${producto.precio.toLocaleString("es-MX")}
                </p>

                <button class="boton">
                    Agregar al carrito
                </button>

            </div>

        `;


        contenedorProductos.appendChild(
            tarjeta
        );

    });

}


// ==========================================
// CONECTAR BOTONES
// ==========================================

function conectarBotones() {

    const botones =
        document.querySelectorAll(".boton");


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            function() {

                const tarjeta =
                    boton.closest(".producto");

                const idProducto =
                    Number(
                        tarjeta.dataset.id
                    );


                agregarAlCarrito(
                    idProducto
                );


                carritoPanel.classList.add(
                    "abierto"
                );

                carritoOverlay.classList.add(
                    "abierto"
                );

            }
        );

    });

}


// ==========================================
// ABRIR CARRITO
// ==========================================

abrirCarrito.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        carritoPanel.classList.add(
            "abierto"
        );

        carritoOverlay.classList.add(
            "abierto"
        );

        mostrarCarrito();

    }
);


// ==========================================
// CERRAR CARRITO
// ==========================================

cerrarCarrito.addEventListener(
    "click",
    function() {

        carritoPanel.classList.remove(
            "abierto"
        );

        carritoOverlay.classList.remove(
            "abierto"
        );

    }
);


carritoOverlay.addEventListener(
    "click",
    function() {

        carritoPanel.classList.remove(
            "abierto"
        );

        carritoOverlay.classList.remove(
            "abierto"
        );

    }
);


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function agregarAlCarrito(idProducto) {

    const producto =
        productos.find(
            producto =>
                producto.id === idProducto
        );


    if (!producto) {

        console.error(
            "Producto no encontrado"
        );

        return;

    }


    const productoExistente =
        carrito.find(
            item =>
                item.id === idProducto
        );


    if (productoExistente) {

        productoExistente.cantidad++;

    }

    else {

        carrito.push({

            id:
                producto.id,

            nombre:
                producto.nombre,

            precio:
                producto.precio,

            cantidad:
                1

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
            item =>
                item.id === idProducto
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
            item =>
                item.id === idProducto
        );


    if (!producto) {

        return;

    }


    producto.cantidad--;


    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                item =>
                    item.id !== idProducto
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
            item =>
                item.id !== idProducto
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


    if (carrito.length === 0) {

        carritoContenido.innerHTML = `

            <div class="carrito-vacio">
                🛒 Tu carrito está vacío.
            </div>

        `;


        carritoTotal.textContent =
            "$0";

        contadorCarrito.textContent =
            "0";

        return;

    }


    let total = 0;

    let cantidadTotal = 0;


    carrito.forEach(producto => {

        const subtotal =
            producto.precio *
            producto.cantidad;


        total += subtotal;

        cantidadTotal +=
            producto.cantidad;


        const item =
            document.createElement("div");


        item.className =
            "item-carrito";


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


        carritoContenido.appendChild(
            item
        );

    });


    carritoTotal.textContent =
        "$" +
        total.toLocaleString("es-MX");


    contadorCarrito.textContent =
        cantidadTotal;

}


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
// ABRIR FORMULARIO
// ==========================================

botonComprar.addEventListener(
    "click",
    function() {

        if (carrito.length === 0) {

            alert(
                "Tu carrito está vacío."
            );

            return;

        }


        mostrarResumenCompra();


        compraPanel.classList.add(
            "abierto"
        );

        compraOverlay.classList.add(
            "abierto"
        );

    }
);


// ==========================================
// CERRAR FORMULARIO
// ==========================================

cerrarCompra.addEventListener(
    "click",
    function() {

        compraPanel.classList.remove(
            "abierto"
        );

        compraOverlay.classList.remove(
            "abierto"
        );

    }
);


compraOverlay.addEventListener(
    "click",
    function() {

        compraPanel.classList.remove(
            "abierto"
        );

        compraOverlay.classList.remove(
            "abierto"
        );

    }
);


// ==========================================
// MOSTRAR RESUMEN
// ==========================================

function mostrarResumenCompra() {

    resumenProductos.innerHTML = "";

    let total = 0;


    carrito.forEach(producto => {

        const subtotal =
            producto.precio *
            producto.cantidad;


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
        "$" +
        total.toLocaleString("es-MX");

}


// ==========================================
// ENVIAR PEDIDO POR WHATSAPP
// ==========================================

enviarWhatsApp.addEventListener(
    "click",
    function() {

        const nombre =
            nombreCliente.value.trim();

        const telefono =
            telefonoCliente.value.trim();


        if (nombre === "") {

            alert(
                "Por favor escribe tu nombre."
            );

            nombreCliente.focus();

            return;

        }


        if (telefono === "") {

            alert(
                "Por favor escribe tu teléfono."
            );

            telefonoCliente.focus();

            return;

        }


        let total = 0;

        let mensajeProductos = "";


        carrito.forEach(producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total += subtotal;


            mensajeProductos +=
                `- ${producto.nombre} x${producto.cantidad} — $${subtotal.toLocaleString("es-MX")}\n`;

        });


        const mensaje =

`🛒 *NUEVO PEDIDO*

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}

📦 *Productos:*
${mensajeProductos}
💰 *TOTAL:* $${total.toLocaleString("es-MX")}

¡Gracias por tu compra!`;


        const numeroWhatsApp =
            "525535006910";


        const urlWhatsApp =
            "https://wa.me/" +
            numeroWhatsApp +
            "?text=" +
            encodeURIComponent(
                mensaje
            );


        window.open(
            urlWhatsApp,
            "_blank"
        );

    }
);


// ==========================================
// INICIAR TIENDA
// ==========================================

cargarCatalogo();