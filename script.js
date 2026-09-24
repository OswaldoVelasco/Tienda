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
// CARGAR CATÁLOGO
// ==========================================

async function cargarCatalogo() {

    try {

        console.log("1. Iniciando catálogo...");

        const respuesta =
            await fetch("./catalogo.csv");

        console.log(
            "2. Respuesta CSV:",
            respuesta.status,
            respuesta.statusText
        );

        if (!respuesta.ok) {

            throw new Error(
                "No se encontró catalogo.csv"
            );

        }

        const texto =
            await respuesta.text();

        console.log(
            "3. CSV recibido:",
            texto
        );


        productos =
            convertirCSV(texto);


        console.log(
            "4. Productos detectados:",
            productos
        );


        if (productos.length === 0) {

            contenedorProductos.innerHTML = `
                <p style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    font-size: 20px;
                ">
                    El CSV se encontró, pero no contiene productos válidos.
                </p>
            `;

            return;

        }


        mostrarProductos();

        conectarBotones();

        mostrarCarrito();


    }

    catch (error) {

        console.error(
            "ERROR:",
            error
        );


        contenedorProductos.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">

                <h3>
                    ❌ Error al cargar el catálogo
                </h3>

                <p>
                    ${error.message}
                </p>

                <p>
                    Revisa la consola del navegador.
                </p>

            </div>
        `;

    }

}


// ==========================================
// CONVERTIR CSV
// ==========================================

function convertirCSV(texto) {

    texto =
        texto.replace(/^\uFEFF/, "");


    const lineas =
        texto
            .split(/\r?\n/)
            .filter(
                linea =>
                    linea.trim() !== ""
            );


    if (lineas.length < 2) {

        return [];

    }


    // Detectar separador
    const separador =
        lineas[0].includes(";")
            ? ";"
            : ",";


    console.log(
        "Separador detectado:",
        separador
    );


    // Encabezados
    const encabezados =
        lineas[0]
            .split(separador)
            .map(
                encabezado =>
                    encabezado
                        .replace(/^\uFEFF/, "")
                        .trim()
                        .toLowerCase()
            );


    console.log(
        "Encabezados:",
        encabezados
    );


    const productosCSV = [];


    for (
        let i = 1;
        i < lineas.length;
        i++
    ) {

        const columnas =
            lineas[i]
                .split(separador)
                .map(
                    valor =>
                        valor.trim()
                );


        const producto = {};


        encabezados.forEach(
            (encabezado, indice) => {

                producto[encabezado] =
                    columnas[indice] || "";

            }
        );


        let precio =
            producto.precio || "0";


        precio =
            precio
                .replace(/\$/g, "")
                .replace(/,/g, "")
                .trim();


        const productoFinal = {

            id:
                Number(producto.id),

            nombre:
                producto.nombre,

            categoria:
                producto.categoria,

            descripcion:
                producto.descripcion,

            precio:
                Number(precio),

            imagen:
                producto.imagen

        };


        console.log(
            "Producto:",
            productoFinal
        );


        if (
            productoFinal.id > 0 &&
            productoFinal.nombre !== ""
        ) {

            productosCSV.push(
                productoFinal
            );

        }

    }


    return productosCSV;

}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos() {

    contenedorProductos.innerHTML = "";


    productos.forEach(
        producto => {

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

        }
    );

}


// ==========================================
// BOTONES DE PRODUCTOS
// ==========================================

function conectarBotones() {

    const botones =
        document.querySelectorAll(".boton");


    botones.forEach(
        boton => {

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

        }
    );

}


// ==========================================
// CARRITO
// ==========================================

function agregarAlCarrito(idProducto) {

    const producto =
        productos.find(
            producto =>
                producto.id === idProducto
        );


    if (!producto) {
        return;
    }


    const existente =
        carrito.find(
            item =>
                item.id === idProducto
        );


    if (existente) {

        existente.cantidad++;

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


function eliminarProducto(idProducto) {

    carrito =
        carrito.filter(
            item =>
                item.id !== idProducto
        );


    guardarCarrito();

    mostrarCarrito();

}


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


    carrito.forEach(
        producto => {

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
                >
                    🗑️
                </button>

            `;


            carritoContenido.appendChild(
                item
            );

        }
    );


    carritoTotal.textContent =
        "$" +
        total.toLocaleString("es-MX");


    contadorCarrito.textContent =
        cantidadTotal;

}


// ==========================================
// ABRIR / CERRAR CARRITO
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
// RESUMEN DE COMPRA
// ==========================================

function mostrarResumenCompra() {

    resumenProductos.innerHTML = "";

    let total = 0;


    carrito.forEach(
        producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;


            total += subtotal;


            const elemento =
                document.createElement("div");


            elemento.className =
                "producto-resumen";


            elemento.innerHTML = `

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
                elemento
            );

        }
    );


    resumenTotal.textContent =
        "$" +
        total.toLocaleString("es-MX");

}


// ==========================================
// WHATSAPP
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


        carrito.forEach(
            producto => {

                const subtotal =
                    producto.precio *
                    producto.cantidad;


                total += subtotal;


                mensajeProductos +=
                    `- ${producto.nombre} x${producto.cantidad} — $${subtotal.toLocaleString("es-MX")}\n`;

            }
        );


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
// INICIAR
// ==========================================

cargarCatalogo();