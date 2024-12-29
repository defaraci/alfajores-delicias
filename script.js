/*
Fecha de entrega 29/12/2024
Alumno: David Ezequiel Faraci
Proyecto Alfajores Delicias
Talento Tech Adultos
*/

document.addEventListener("DOMContentLoaded", async () => {
    // Variables globales
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=ars"; //pagina donde saco cotización
    let tipoCambio = 1025; // Valor que utilizara si surge un error
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let productos = [];

    // Obtener cotización
    const obtenerCotizacion = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            tipoCambio = data.usd.ars;
        } catch (error) {
            //que no muestre nada
        }
    };

    await obtenerCotizacion();

    // Cargar productos desde JSON
    try {
        const response = await fetch("productos.json");
        productos = await response.json();
        cargarProductos(productos);
    } catch (error) {
        //que no muestre nada
    }

    // Función para cargar productos
    const cargarProductos = (productos) => {
        const cardsContainer = document.querySelector(".cards");
        cardsContainer.innerHTML = productos.map(producto => `
            <div class="card col-md-3">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text"><strong>Preciox12Unid:</strong> $${producto.precio} ARS / $${(producto.precio / tipoCambio).toFixed(2)} USD</p>
                    <button class="btn btn-primary agregar" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            </div>
        `).join("");

        // Asignar eventos a botones
        document.querySelectorAll(".agregar").forEach(btn => {
            btn.addEventListener("click", () => agregarAlCarrito(Number(btn.dataset.id)));
        });
    };

    const ampliarDescripcion = (id, productos) => {
        const producto = productos.find(p => p.id == id);
        const cardBody = document.querySelector(`.ampliar[data-id="${id}"]`).parentNode;

    };
    
    const actualizarCarrito = () => {
        const listaCarrito = document.getElementById("lista-carrito");
        listaCarrito.innerHTML = "";
        let totalPrecioARS = 0;
        let totalPrecioUSD = 0;

        carrito.forEach(producto => {
            const item = document.createElement("li");
            item.classList.add("list-group-item");
            item.innerHTML = `
                ${producto.nombre} - $${producto.precio} ARS / $${(producto.precio / tipoCambio).toFixed(2)} USD x ${producto.cantidad}
                <button class="btn btn-sm btn-danger float-end eliminar" data-id="${producto.id}">Eliminar</button>
            `;
            listaCarrito.appendChild(item);
            totalPrecioARS += producto.precio * producto.cantidad;
            totalPrecioUSD += (producto.precio * producto.cantidad) / tipoCambio;
        });

        document.getElementById("cantidad-carrito").textContent = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        document.getElementById("total-precio").textContent = `Total: $${totalPrecioARS} ARS / $${totalPrecioUSD.toFixed(2)} USD`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    const agregarAlCarrito = (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        const existente = carrito.find(p => p.id === productoId);

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
    };

    document.querySelector(".cards").innerHTML = productos.map(producto => `
        <div class="card col-md-3">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top" />
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <p class="card-text"><strong>Precio x12Unid:</strong> $${producto.precio} ARS / $${(producto.precio / tipoCambio).toFixed(2)} USD</p>
                <button class="btn btn-primary agregar" data-id="${producto.id}">Agregar al carrito</button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".agregar").forEach(btn => {
        btn.addEventListener("click", () => {
            agregarAlCarrito(Number(btn.dataset.id));
        });
    });

    document.getElementById("ver-carrito").addEventListener("click", () => {
        const modal = new bootstrap.Modal(document.getElementById("modalCarrito"));
        modal.show();
    });

    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        carrito.length = 0;
        actualizarCarrito();
    });

    document.getElementById("lista-carrito").addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar")) {
            const productoId = Number(e.target.dataset.id);
            const producto = carrito.find(p => p.id === productoId);
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                const index = carrito.indexOf(producto);
                carrito.splice(index, 1);
            }
            actualizarCarrito();
        }
    });

    actualizarCarrito();


    //Validación de formulario con javascript
    document.getElementById("contacto").addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();
        const mensajeDiv = document.getElementById("form-mensaje");
    
        if (nombre === "" || email === "" || mensaje === "") {
            mensajeDiv.textContent = "Por favor, complete todos los campos.";
            mensajeDiv.style.color = "red";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            mensajeDiv.textContent = "Por favor, ingrese un correo válido.";
            mensajeDiv.style.color = "red";
        } else {
            mensajeDiv.textContent = "Formulario enviado con éxito.";
            mensajeDiv.style.color = "green";
            e.target.reset(); // Limpiar el formulario
        }
    });
});
