# Arquitectura del sistema – Movu

## 1. Descripción general

Movu utiliza una arquitectura cliente-servidor, en la que el frontend y el backend funcionan como componentes independientes que se comunican mediante solicitudes HTTP.

El sistema está desarrollado como una aplicación web que permite a los usuarios consultar rutas de transporte público, gestionar sus cuentas, guardar rutas favoritas, consultar novedades y utilizar un asistente de inteligencia artificial.

La arquitectura se divide principalmente en tres componentes:

- **Frontend:** interfaz de usuario desarrollada con React y Vite, junto con los recursos de presentación y páginas del proyecto.
- **Backend:** servidor desarrollado con Node.js y Express, encargado de procesar las solicitudes y ejecutar la lógica del sistema.
- **Base de datos:** MongoDB Atlas, utilizada para almacenar y consultar la información de la aplicación.

Adicionalmente, el sistema integra servicios externos para funcionalidades específicas, como el asistente de inteligencia artificial.

## 2. Arquitectura general del sistema

La comunicación entre los componentes sigue este flujo:

1. El usuario accede a Movu desde su navegador.
2. El frontend presenta la interfaz y gestiona las interacciones.
3. Cuando necesita información o realizar una operación, el frontend envía una solicitud HTTP a la API del backend.
4. El backend recibe la solicitud mediante Express y ejecuta la lógica correspondiente.
5. Cuando la operación requiere información almacenada, el backend consulta o modifica la base de datos MongoDB Atlas.
6. El backend devuelve una respuesta al frontend.
7. El frontend procesa la respuesta y actualiza la información que se muestra al usuario.

### Diagrama general


                   USUARIO
                      |
                      v
               NAVEGADOR WEB
                      |
                      v
          +-----------------------+
          |       FRONTEND        |
          |                       |
          |     React + Vite      |
          |                       |
          |  Interfaz de usuario  |
          |  Componentes         |
          |  Navegación           |
          +-----------------------+
                      |
                 Solicitudes
                   HTTP
                      |
                      v
          +-----------------------+
          |        BACKEND        |
          |                       |
          |    Node.js + Express  |
          |                       |
          |  Rutas de la API      |
          |  Middleware           |
          |  Modelos              |
          |  Servicios            |
          |  Lógica del servidor  |
          +-----------------------+
                |           |
                |           |
                v           v
       +----------------+  +----------------+
       |   MongoDB      |  | Google Gemini  |
       |     Atlas      |  |                |
       |                |  | Asistente de   |
       | Almacenamiento |  | inteligencia   |
       | de información |  | artificial     |
       +----------------+  +----------------+


El diagrama representa la comunicación conceptual entre los componentes. La integración con Google Gemini corresponde específicamente al funcionamiento del asistente de inteligencia artificial.

## 3. Componentes tecnológicos

### 3.1. Frontend

El frontend es la parte del sistema con la que interactúan directamente los usuarios.

Está desarrollado principalmente con:

- **React:** biblioteca de JavaScript utilizada para construir interfaces mediante componentes reutilizables.
- **Vite:** herramienta de desarrollo y construcción del proyecto.
- **JavaScript:** lenguaje utilizado para implementar la interacción y la lógica del lado del cliente.
- **CSS:** encargado de los estilos, la presentación visual y la adaptación de la interfaz a diferentes dispositivos.

Entre sus responsabilidades se encuentran:

- Mostrar el catálogo de rutas disponibles.
- Presentar la información de cada ruta.
- Gestionar la navegación entre las diferentes secciones.
- Permitir el registro y el inicio de sesión.
- Mostrar el perfil, los favoritos y el historial del usuario.
- Presentar las novedades del transporte.
- Permitir la interacción con el asistente de inteligencia artificial.
- Enviar información al backend mediante solicitudes HTTP.

El frontend se encuentra dentro de la carpeta `frontend/`.

### 3.2. Backend

El backend es el componente encargado de procesar las solicitudes que recibe desde el frontend y gestionar las operaciones del sistema.

Está desarrollado con:

- **Node.js:** entorno de ejecución de JavaScript del lado del servidor.
- **Express:** framework utilizado para gestionar las rutas y solicitudes HTTP.
- **Mongoose:** herramienta que facilita la interacción entre Node.js y MongoDB.
- **bcrypt:** utilizado para proteger las contraseñas mediante funciones de hash.
- **JWT (JSON Web Token):** utilizado para gestionar la autenticación de los usuarios.
- **Google GenAI:** biblioteca utilizada para integrar el servicio de inteligencia artificial.

Entre sus responsabilidades se encuentran:

- Gestionar el registro y la autenticación de usuarios.
- Consultar y administrar las rutas de transporte.
- Gestionar los favoritos y el historial.
- Consultar y administrar las novedades.
- Procesar los mensajes del formulario de contacto.
- Gestionar las operaciones administrativas.
- Procesar las solicitudes del asistente de inteligencia artificial.
- Validar las solicitudes y controlar los permisos de acceso.

El backend se encuentra dentro de la carpeta `backend/` y organiza sus componentes en módulos separados para facilitar el mantenimiento del código.

### 3.3. Base de datos

Movu utiliza **MongoDB Atlas**, un servicio de base de datos en la nube basado en documentos.

La conexión entre el backend y la base de datos se realiza mediante Mongoose.

La información se organiza en diferentes colecciones, correspondientes a los modelos definidos en el backend:

- Usuarios.
- Rutas.
- Novedades.
- Historial.
- Contactos.
- Actividades.

Los favoritos se almacenan como referencias a rutas dentro del modelo de usuario.

La estructura de los modelos, sus campos, validaciones y relaciones se encuentra documentada en `base_de_datos.md`.

## 4. Comunicación entre componentes

La comunicación entre el frontend y el backend se realiza mediante una API REST, utilizando el protocolo HTTP.

El frontend utiliza la dirección de la API configurada en:

`frontend/config/api.js`

``javascript
const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;
``

La variable `VITE_API_URL` permite definir la dirección del servidor sin tener que modificar directamente el código cada vez que cambia el entorno de ejecución.

El backend recibe las solicitudes, procesa la información y devuelve respuestas que el frontend utiliza para actualizar la interfaz.

### Flujo de una solicitud

Por ejemplo, cuando un usuario consulta el catálogo de rutas:

1. El usuario ingresa a la sección de rutas.
2. El frontend inicia una solicitud al backend.
3. Express recibe la solicitud correspondiente.
4. El backend consulta la colección de rutas en MongoDB.
5. MongoDB devuelve los registros solicitados.
6. El backend envía la respuesta al frontend.
7. El frontend muestra las rutas disponibles.

Este mismo principio se aplica a las demás operaciones de la plataforma, de acuerdo con las necesidades de cada módulo.

## 5. Seguridad y autenticación

La arquitectura incorpora mecanismos para proteger la información y controlar el acceso a las funcionalidades.

### Autenticación

- Las contraseñas se procesan mediante bcrypt para evitar almacenarlas como texto plano.
- La autenticación utiliza JSON Web Tokens (JWT).
- Los tokens permiten verificar la identidad del usuario en las solicitudes que requieren autenticación.

### Autorización

El sistema contempla dos roles principales:

- **Usuario:** puede acceder a las funcionalidades disponibles para los usuarios registrados.
- **Administrador:** cuenta con permisos adicionales para gestionar información y operaciones administrativas.

El backend verifica los permisos correspondientes antes de permitir el acceso a las operaciones protegidas.

### Variables de entorno

La configuración del sistema utiliza variables de entorno para almacenar información sensible y parámetros de conexión.

Entre ellas se encuentran las relacionadas con:

- Conexión a MongoDB.
- Secreto utilizado para JWT.
- Dirección del frontend.
- Clave de acceso al servicio de inteligencia artificial.
- Puerto del servidor.

Los valores privados no deben incluirse en el repositorio público ni en la documentación.

## 6. Integración con servicios externos

### Google Gemini

Movu incorpora un asistente de inteligencia artificial que utiliza Google Gemini para procesar las consultas de los usuarios.

La comunicación con este servicio se realiza desde el backend, evitando exponer directamente la clave de acceso en el frontend.

El flujo general es:

1. El usuario escribe una pregunta en el asistente.
2. El frontend envía el mensaje al backend.
3. El backend procesa la solicitud y se comunica con el servicio de Google Gemini.
4. El servicio devuelve una respuesta.
5. El backend entrega el resultado al frontend.
6. El usuario visualiza la respuesta en el asistente.

La integración utiliza la biblioteca `@google/genai`.

## 7. Infraestructura y despliegue

Movu utiliza servicios externos para alojar sus componentes y mantener la aplicación disponible en internet.

- **Netlify:** alojamiento del frontend.
- **Render:** alojamiento del backend.
- **MongoDB Atlas:** alojamiento de la base de datos.
- **GitHub:** almacenamiento del código fuente y control de versiones.

Las direcciones de producción son:

- Frontend: https://movunl.netlify.app/
- Backend: https://movu.onrender.com/

El frontend se comunica con el backend desplegado mediante la dirección configurada en sus variables de entorno.

La configuración de los servicios, las variables de entorno y el procedimiento de publicación se describen con mayor detalle en `despliegue.md`.

## 8. Organización del proyecto

El proyecto se organiza en carpetas independientes para separar las responsabilidades del frontend, el backend y la documentación.

La estructura general es la siguiente:

MOVU/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── index.js
│
├── docs/
│   ├── logica.md
│   ├── arquitectura.md
│   ├── api.md
│   ├── base_de_datos.md
│   └── despliegue.md
│
├── frontend/
│   ├── admin/
│   ├── config/
│   ├── css/
│   ├── js/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── oxlintrc.json
│   ├── catalogo.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── package.json
│   ├── profile.html
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md

### 8.1. Estructura del backend

La carpeta `backend/` contiene los archivos responsables de la lógica del servidor.

- **config/:** contiene archivos de configuración del backend y sus conexiones.
- **middleware/:** contiene funciones intermedias que procesan solicitudes antes de llegar a las operaciones correspondientes, como los controles de autenticación y autorización.
- **models/:** contiene los modelos de Mongoose que definen la estructura de los datos almacenados en MongoDB.
- **routes/:** contiene las rutas de la API y define los endpoints disponibles.
- **services/:** contiene funciones y procesos que encapsulan operaciones específicas utilizadas por el backend.
- **index.js:** archivo principal desde el que se configura e inicia el servidor.

### 8.2. Estructura del frontend

La carpeta `frontend/` contiene los recursos necesarios para construir y ejecutar la interfaz de Movu.

- **admin/:** contiene recursos relacionados con la sección administrativa.
- **config/:** contiene archivos de configuración del frontend, como la dirección de la API.
- **css/:** contiene hojas de estilo.
- **js/:** contiene archivos JavaScript utilizados en las funcionalidades del frontend.
- **node_modules/:** contiene las dependencias instaladas mediante npm.
- **public/:** almacena recursos estáticos accesibles desde la aplicación.
- **src/:** contiene el código fuente organizado para el desarrollo con React y Vite.
- **.env:** contiene variables de entorno del frontend.
- **.gitignore:** define archivos y carpetas que no deben incluirse en el control de versiones.
- **oxlintrc.json:** archivo de configuración de Oxlint, si corresponde a la herramienta utilizada en el proyecto.
- **catalog.html, dashboard.html, index.html, login.html y profile.html:** páginas HTML de entrada del proyecto.
- **package.json:** define las dependencias, los scripts y la configuración del proyecto.
- **vite.config.js:** contiene la configuración de Vite.

La presencia de carpetas JavaScript, CSS y páginas HTML junto con `src/` refleja la organización actual del proyecto y sus distintos recursos de interfaz.

### 8.3. Archivos principales de la raíz

En el directorio principal se encuentran:

- **.gitignore:** define los archivos y directorios que Git debe ignorar.
- **package.json:** contiene la configuración y las dependencias definidas para el proyecto en la raíz.
- **README.md:** presenta la información general del proyecto y las instrucciones iniciales.

## 9. Consideraciones técnicas

- El frontend y el backend funcionan como componentes independientes.
- La comunicación entre ambos se realiza mediante solicitudes HTTP.
- El backend centraliza la lógica del servidor y el acceso a la base de datos.
- MongoDB Atlas permite almacenar la información en un servicio externo al servidor de la aplicación.
- Las variables de entorno permiten separar la configuración local de la configuración de producción.
- La autenticación y los permisos se gestionan desde el backend.
- Las integraciones externas se realizan desde el servidor cuando requieren credenciales privadas.