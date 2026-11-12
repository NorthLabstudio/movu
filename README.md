# Movu

**Muévete sin sorpresas. Llega con confianza.**

## Descripción

Movu es una plataforma web de movilidad inteligente diseñada para mejorar la experiencia de las personas que utilizan el transporte público en Barranquilla y su área metropolitana, especialmente estudiantes universitarios que dependen de este servicio para desplazarse diariamente.

Su propósito es brindar información clara, organizada y centralizada sobre las rutas de transporte público, facilitando su consulta y ayudando a los usuarios a tomar decisiones de movilidad con mayor confianza.

La plataforma permite consultar rutas de buses, conocer información sobre sus recorridos y acceder a novedades relacionadas con cierres viales, desvíos, paradas suspendidas y cambios en los horarios que puedan afectar los desplazamientos.

Como parte de su propuesta de valor, Movu integra un asistente virtual basado en inteligencia artificial que orienta a los usuarios en consultas relacionadas con rutas, transporte y novedades de movilidad.

En futuras versiones, el proyecto busca ampliar sus capacidades mediante nuevas herramientas de planificación y la posible integración de información en tiempo real sobre la ubicación de los buses, a través de alianzas con empresas transportadoras.

## Objetivo

Desarrollar una plataforma digital que facilite la consulta y planificación de los desplazamientos en transporte público mediante información centralizada y herramientas inteligentes, contribuyendo a mejorar la experiencia de movilidad de los ciudadanos.

## Funcionalidades

Actualmente, Movu cuenta con los siguientes módulos:

- **Directorio de rutas:** consulta de rutas de transporte público, empresas, códigos, orígenes, destinos y otros datos disponibles.
- **Autenticación de usuarios:** registro, inicio de sesión y administración del perfil.
- **Rutas favoritas:** posibilidad de guardar y eliminar rutas favoritas.
- **Historial de consultas:** registro y consulta de las rutas revisadas por el usuario.
- **Novedades de movilidad:** visualización de novedades publicadas y vigentes que pueden afectar los recorridos.
- **Asistente virtual:** atención de consultas mediante inteligencia artificial con Google Gemini.
- **Panel administrativo:** gestión de rutas y novedades, además de consulta de estadísticas y actividad.
- **Formulario de contacto:** recepción y almacenamiento de mensajes enviados por los usuarios.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- JavaScript
- JSON Web Token (JWT)
- bcryptjs

### Base de datos
- MongoDB
- MongoDB Atlas
- Mongoose

### Inteligencia artificial
- Google Gemini
- @google/genai

### Herramientas y despliegue
- Git y GitHub
- Netlify
- Render

## Despliegue

El proyecto cuenta con los siguientes servicios de despliegue:

- **Frontend:** [Netlify](https://movunl.netlify.app/)
- **Backend:** [Render](https://movu.onrender.com/)
- **Base de datos:** MongoDB Atlas.
- **Control de versiones:** GitHub.

El frontend consume los servicios del backend mediante la variable de entorno `VITE_API_URL`.

## Estado del proyecto

Movu se encuentra en desarrollo. Su versión actual cuenta con los módulos principales de consulta de rutas, autenticación, favoritos, historial, novedades, asistencia virtual y administración.

Las funcionalidades de geolocalización y seguimiento de buses en tiempo real, así como otras herramientas avanzadas de planificación, forman parte de las posibilidades de evolución del proyecto y no se presentan como características disponibles actualmente.

## Propósito

Movu busca que desplazarse por la ciudad sea una experiencia más sencilla, informada y confiable, conectando a las personas con la información que necesitan para llegar a sus destinos.

## Identidad visual y diseño

Movu cuenta con una identidad visual que combina elementos tecnológicos, urbanos y contemporáneos, buscando transmitir confianza, cercanía e innovación. Su diseño toma como referencia el contexto de movilidad de Barranquilla y la necesidad de ofrecer una experiencia digital clara, accesible y fácil de utilizar.

La interfaz sigue un enfoque híbrido entre **Bento UI y diseño editorial minimalista**, utilizando tarjetas informativas, jerarquías visuales definidas, espacios equilibrados y componentes con bordes redondeados.

### Sistema visual

- **Tipografía principal:** Nunito, utilizada en textos, botones, navegación y elementos de la interfaz.
- **Tipografía de identidad:** Allerta Stencil, utilizada en el logotipo y elementos de marca.
- **Paleta cromática:** combinación de tonos azules, verdes y morados, acompañados de fondos claros para mantener una interfaz legible y contemporánea.
- **Componentes:** tarjetas de rutas, módulos informativos, botones, formularios y elementos de navegación.
- **Diseño responsive:** adaptación de la interfaz a diferentes tamaños de pantalla, priorizando la experiencia tanto en dispositivos móviles como en computadores.

El sistema visual busca mantener consistencia entre los diferentes módulos de la plataforma, facilitando la identificación de información y la interacción de los usuarios.