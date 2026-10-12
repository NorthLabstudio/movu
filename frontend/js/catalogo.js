
const origenInput = document.getElementById("origen");
const destinoInput = document.getElementById("destino");
const cards = document.querySelectorAll(".route-card");
const searchBtn = document.getElementById("search-button");

// Empresa y universidad
const empresaSelect = document.getElementById("empresaSelect");
const universidadSelect = document.getElementById("UniversidadSelect");
const seccionesEmpresa = document.querySelectorAll(".company-container");

const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", function () {

  const origenBuscado = origenInput.value.trim().toLowerCase();
  const destinoBuscado = destinoInput.value.trim().toLowerCase();

  const textoBuscado = searchInput.value.trim().toLowerCase();

  const empresaBuscada = empresaSelect.value === "all"
    ? ""
    : empresaSelect.value.trim().toLowerCase();

  const universidadBuscada = universidadSelect.value === "all"
    ? ""
    : universidadSelect.value.trim().toLowerCase();

  // Recorremos cada sección de empresa
  seccionesEmpresa.forEach(function (seccion) {

    const nombreEmpresa = seccion
      .querySelector(".company-section .company-name")
      .textContent.trim().toLowerCase();

    const coincideEmpresa =
      empresaBuscada === "" ||
      nombreEmpresa.includes(empresaBuscada);

    // Filtramos únicamente las tarjetas de esta sección
    const tarjetas = seccion.querySelectorAll(".route-card");
    let hayTarjetasVisibles = false;

    tarjetas.forEach(function (card) {

      const cardOrigen = card.querySelector(".cardmain .origen");
      const cardDestino = card.querySelector(".cardmain .destino");
      const paradas = card.querySelector(".busstops");

      const origenRuta = cardOrigen.textContent.trim().toLowerCase();
      const destinoRuta = cardDestino.textContent.trim().toLowerCase();
      const universidadesRuta = paradas.textContent.toLowerCase();

      const coincideOrigen = origenRuta.includes(origenBuscado);
      const coincideDestino = destinoRuta.includes(destinoBuscado);

      const codigoRuta = card.querySelector(".buscode");
      const empresaTarjeta = card.querySelector(".cardmain .company-name");

      const codigo = codigoRuta
        ? codigoRuta.textContent.trim().toLowerCase()
        : "";

      const empresa = empresaTarjeta
        ? empresaTarjeta.textContent.trim().toLowerCase()
        : "";

      const textoOrigen = cardOrigen.textContent.trim().toLowerCase();
      const textoDestino = cardDestino.textContent.trim().toLowerCase();

      const textoParadas = paradas
        ? paradas.textContent.trim().toLowerCase()
        : "";

      const coincideBusqueda =
        textoBuscado === "" ||
        codigo.includes(textoBuscado) ||
        empresa.includes(textoBuscado) ||
        textoOrigen.includes(textoBuscado) ||
        textoDestino.includes(textoBuscado) ||
        textoParadas.includes(textoBuscado);

      const coincideUniversidad =
        universidadBuscada === "" ||
        universidadesRuta.includes(universidadBuscada);

      const mostrarTarjeta =
        coincideOrigen &&
        coincideDestino &&
        coincideUniversidad
        &&
        coincideBusqueda;

      card.style.display = mostrarTarjeta ? "" : "none";

      if (mostrarTarjeta) {
        hayTarjetasVisibles = true;
      }

    });

    // Mostramos la sección solo si coincide la empresa
    // y tiene al menos una tarjeta que cumple los filtros
    if (coincideEmpresa && hayTarjetasVisibles) {
      seccion.style.display = "";
    } else {
      seccion.style.display = "none";
    }

  });

});
