/* =========================================================
   ELEMENTOS DE FILTROS
========================================================= */

// Select de empresa
const empresaSelect = document.getElementById("empresaSelect");

// Inputs de origen y destino
const origenInput = document.getElementById("origen");
const destinoInput = document.getElementById("destino");

// Select de universidad
const universidadSelect = document.getElementById("UniversidadSelect");

// Fecha y hora
const fechaHora = document.getElementById("fechaHora");

// Buscador
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");


/* =========================================================
   CARDS DE RUTAS
========================================================= */

// Seleccionamos todas las cards
const routeCards = document.querySelectorAll(".route-card");

// Contenedor de las cards
const routeGrid = document.querySelector(".route-grid");


/* =========================================================
   FILTRAR RUTAS
========================================================= */

function filtrarRutas() {

  const empresaSeleccionada = empresaSelect.value;

  const origenBuscado = origenInput.value
    .toLowerCase()
    .trim();

  const destinoBuscado = destinoInput.value
    .toLowerCase()
    .trim();

  const universidadSeleccionada = universidadSelect.value;

  const textoBuscado = searchInput.value
    .toLowerCase()
    .trim();


  // Revisamos cada card
  routeCards.forEach(function (card) {

    const empresa = card
      .querySelector(".company-name")
      .textContent
      .toLowerCase()
      .trim();

    const origen = card
      .querySelector(".origen")
      .textContent
      .toLowerCase()
      .trim();

    const destino = card
      .querySelector(".destino")
      .textContent
      .toLowerCase()
      .trim();


    /* -----------------------------------------
       COINCIDENCIA EMPRESA
    ----------------------------------------- */

    const coincideEmpresa =
      empresaSeleccionada === "all" ||
      empresa.includes(empresaSeleccionada.toLowerCase());


    /* -----------------------------------------
       COINCIDENCIA ORIGEN
    ----------------------------------------- */

    const coincideOrigen =
      origenBuscado === "" ||
      origen.includes(origenBuscado);


    /* -----------------------------------------
       COINCIDENCIA DESTINO
    ----------------------------------------- */

    const coincideDestino =
      destinoBuscado === "" ||
      destino.includes(destinoBuscado);


    /* -----------------------------------------
       COINCIDENCIA BÚSQUEDA GENERAL
    ----------------------------------------- */

    const coincideBusqueda =
      textoBuscado === "" ||
      card.textContent.toLowerCase().includes(textoBuscado);


    /* -----------------------------------------
       UNIVERSIDAD
       
       Todavía no tenemos universidad asociada
       a cada card, por eso por ahora solo
       comprobamos "all".
    ----------------------------------------- */

    const coincideUniversidad =
      universidadSeleccionada === "all";


    /* -----------------------------------------
       RESULTADO FINAL
    ----------------------------------------- */

    const mostrar =
      coincideEmpresa &&
      coincideOrigen &&
      coincideDestino &&
      coincideBusqueda &&
      coincideUniversidad;


    if (mostrar) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }

  });

}


/* =========================================================
   EVENTOS DE FILTROS
========================================================= */

empresaSelect.addEventListener("change", filtrarRutas);

origenInput.addEventListener("input", filtrarRutas);

destinoInput.addEventListener("input", filtrarRutas);

universidadSelect.addEventListener("change", filtrarRutas);

fechaHora.addEventListener("change", filtrarRutas);

searchInput.addEventListener("input", filtrarRutas);

searchButton.addEventListener("click", filtrarRutas);


/* =========================================================
   GIRAR CARDS
========================================================= */

// Recorremos todas las cards
routeCards.forEach((card) => {

  card.addEventListener("click", (event) => {

    /*
      Si hacemos clic en un botón,
      dejamos que ese botón maneje
      su propio comportamiento.
    */

    if (event.target.closest("button")) {
      return;
    }


    // Giramos la card
    card.classList.toggle("is-flipped");

  });

});


/* =========================================================
   BOTÓN "VER RECORRIDO"
========================================================= */

const recorridoButtons =
  document.querySelectorAll(".card-front > button");


recorridoButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    // Evitamos que el clic llegue a la card
    event.stopPropagation();


    // Buscamos la card correspondiente
    const card = button.closest(".route-card");


    // Giramos la card
    card.classList.toggle("is-flipped");

  });

});


/* =========================================================
   BOTÓN "VER RUTA COMPLETA"
========================================================= */

const mapButtons =
  document.querySelectorAll(".map-btn");


mapButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    // Evitamos que la card vuelva a girar
    event.stopPropagation();


    console.log("Abrir mapa de la ruta");

  });

});