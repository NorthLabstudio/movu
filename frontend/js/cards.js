/* =========================================================
   GIRAR CARDS
========================================================= */
const routeCards = document.querySelectorAll(".route-card");
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