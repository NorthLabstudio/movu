# Documentación de la API – Movu

## 1. Descripción general

La API de Movu permite la comunicación entre el frontend y el backend de la aplicación. Se encarga de recibir solicitudes, procesar operaciones, consultar y modificar información en la base de datos y devolver respuestas al cliente.

Está desarrollada con Node.js y Express, utilizando MongoDB como sistema de almacenamiento y Mongoose para gestionar los datos.

La API sigue una estructura REST y utiliza solicitudes HTTP para realizar las diferentes operaciones.

Entre sus principales funcionalidades se encuentran:

- Consultar rutas de transporte público.
- Registrar usuarios e iniciar sesión.
- Gestionar perfiles de usuario.
- Guardar y consultar rutas favoritas.
- Registrar y consultar el historial de rutas.
- Consultar y administrar novedades del transporte.
- Gestionar operaciones administrativas.
- Recibir mensajes del formulario de contacto.
- Procesar consultas mediante el asistente de inteligencia artificial.

## 2. Configuración general

### 2.1. URL base

La API se encuentra desplegada en Render.

**URL base de producción:**

https://movu.onrender.com

Durante el desarrollo local, el servidor utilizo el puerto **3000** de manera predeterminada.


### 2.2. Configuración del frontend

El frontend obtiene la dirección del backend mediante una variable de entorno.

Archivo: `frontend/config/api.js`

``javascript
const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;
``

La variable `VITE_API_URL` permite configurar la dirección de la API según el entorno de ejecución.

### 2.3. Configuración del servidor

El backend utiliza las siguientes configuraciones:

- **Express:** gestiona las solicitudes y respuestas HTTP.
- **CORS:** controla los orígenes autorizados para comunicarse con el servidor.
- **Express JSON:** permite recibir información en formato JSON.
- **Mongoose:** gestiona la conexión y las operaciones con MongoDB.
- **Dotenv:** permite cargar las variables de entorno desde `backend/config/.env`.

Entre las variables utilizadas se encuentran:

- **PORT**: puerto de ejecución del servidor.
- **MONGODB_URI**: dirección de conexión a MongoDB.
- **JWT_SECRET**: clave utilizada para firmar y verificar los tokens.
- **FRONTEND_URL**: origen del frontend autorizado.
- **GEMINI_API_KEY**: clave de acceso al servicio de Google Gemini.

Los valores de estas variables deben mantenerse privados.

## 3. Organización de los endpoints

Los endpoints de la API están organizados por módulos para separar las responsabilidades del sistema.

### 3.1. Rutas de transporte

**Endpoint:**

``http
GET /api/rutas
``

**Descripción:**

Consulta todas las rutas almacenadas en la base de datos.

**Autenticación:** No requiere.

**Respuesta exitosa (200):**

Devuelve un arreglo de objetos con la información de las rutas.

**Error (500):**

``json
{
  "mensaje": "Error al consultar las rutas"
}
``

### 3.2. Autenticación

**Prefijo:** `/api/auth`

Este módulo permite registrar usuarios, iniciar sesión y actualizar la información del perfil.

#### Registrar usuario

``http
POST /api/auth/registro
``

**Autenticación:** No requiere.

**Cuerpo de la solicitud:**

``json
{
  "nombre": "María",
  "email": "maria@example.com",
  "contraseña": "password123"
}
``

**Validaciones:**

- Todos los campos son obligatorios.
- La contraseña debe tener al menos 8 caracteres.
- El correo se convierte a minúsculas y se eliminan espacios al inicio y al final.
- No se permite registrar un correo que ya exista.

**Respuesta exitosa (201):**

``json
{
  "mensaje": "Usuario registrado correctamente",
  "usuario": {
    "id": "ID_DEL_USUARIO",
    "nombre": "María",
    "email": "maria@example.com"
  }
}
``

**Posibles errores:**

- `400`: campos obligatorios incompletos o contraseña demasiado corta.
- `409`: el correo electrónico ya está registrado.
- `500`: error al registrar el usuario.

#### Iniciar sesión

```http
POST /api/auth/login
```

**Autenticación:** No requiere.

**Cuerpo de la solicitud:**

```json
{
  "email": "maria@example.com",
  "contraseña": "password123"
}
```

**Funcionamiento:**

1. Verifica que el correo y la contraseña estén presentes.
2. Busca el usuario en MongoDB.
3. Comprueba que la cuenta exista y esté activa.
4. Compara la contraseña ingresada con el hash almacenado mediante bcrypt.
5. Genera un token JWT si las credenciales son correctas.

El token tiene una duración de una hora.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": "ID_DEL_USUARIO",
    "nombre": "María",
    "email": "maria@example.com",
    "universidad": "",
    "ciudad": "",
    "rol": "usuario"
  }
}
```

**Posibles errores:**

- `400`: correo o contraseña no proporcionados.
- `401`: credenciales incorrectas o cuenta no disponible.
- `500`: error al iniciar sesión o configuración incorrecta del servidor.

#### Actualizar perfil

```http
PUT /api/auth/perfil
```

**Autenticación:** Requiere token JWT.

**Encabezado:**

```http
Authorization: Bearer TOKEN_JWT
```

**Cuerpo de la solicitud:**

```json
{
  "nombre": "María Caputo",
  "email": "maria@example.com",
  "universidad": "Universidad Sergio Arboleda",
  "ciudad": "Barranquilla"
}
```

**Validaciones:**

- El nombre debe tener al menos 2 caracteres.
- El correo debe tener un formato válido.
- No se permite utilizar un correo registrado por otro usuario.
- Solo se actualizan los campos permitidos: nombre, email, universidad y ciudad.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Perfil actualizado correctamente",
  "usuario": {
    "id": "ID_DEL_USUARIO",
    "nombre": "María Caputo",
    "email": "maria@example.com",
    "universidad": "Universidad Sergio Arboleda",
    "ciudad": "Barranquilla",
    "rol": "usuario"
  }
}
```

**Posibles errores:**

- `400`: nombre o correo inválidos.
- `401`: token ausente, vencido o inválido.
- `404`: usuario no encontrado o cuenta no disponible.
- `409`: correo registrado por otro usuario.
- `500`: error interno o falta de configuración del JWT.

### 3.3. Favoritos

**Prefijo:** `/api/fav`

Este módulo permite que los usuarios registrados gestionen sus rutas favoritas.

Todas las operaciones requieren autenticación mediante `verificarToken`.

**Encabezado de autenticación:**

```http
Authorization: Bearer TOKEN_JWT
```

#### Consultar favoritos

```http
GET /api/fav
```

**Descripción:**

Devuelve las rutas favoritas del usuario autenticado.

El backend utiliza `populate()` para obtener la información de las rutas relacionadas.

**Respuesta exitosa (200):**

Devuelve un arreglo de objetos con la información de las rutas favoritas.

#### Agregar favorito

```http
POST /api/fav/:rutaId
```

**Parámetro:**

- `rutaId`: identificador de MongoDB correspondiente a la ruta.

**Descripción:**

Agrega una ruta a la lista de favoritos del usuario.

Antes de guardarla, el backend verifica que el identificador sea válido, que la ruta exista y que no esté registrada previamente como favorita.

**Respuesta exitosa (201):**

```json
{
  "mensaje": "Ruta agregada a fav.",
  "rutaId": "ID_DE_LA_RUTA"
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `401`: usuario no autenticado.
- `404`: ruta no encontrada.
- `409`: la ruta ya está guardada como favorita.
- `500`: error al guardar el favorito.

#### Eliminar favorito

```http
DELETE /api/fav/:rutaId
```

**Parámetro:**

- `rutaId`: identificador de la ruta que se desea eliminar.

**Descripción:**

Elimina una ruta de la lista de favoritos del usuario autenticado.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Ruta eliminada de fav."
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `401`: usuario no autenticado.
- `404`: la ruta no estaba guardada en favoritos.
- `500`: error al eliminar el favorito.

### 3.4. Historial

**Prefijo:** `/api/historial`

Este módulo permite registrar y consultar las rutas que un usuario ha consultado.

Todas las operaciones requieren autenticación mediante `verificarToken`.

#### Registrar consulta

```http
POST /api/historial/:rutaId
```

**Parámetro:**

- `rutaId`: identificador de la ruta consultada.

**Descripción:**

Registra una consulta asociando el usuario autenticado con la ruta correspondiente.

**Respuesta exitosa (201):**

```json
{
  "mensaje": "Consulta registrada correctamente.",
  "consulta": {
    "_id": "ID_DE_LA_CONSULTA",
    "usuario": "ID_DEL_USUARIO",
    "ruta": "ID_DE_LA_RUTA",
    "fecha": "2026-11-12T10:00:00.000Z"
  }
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `401`: usuario no autenticado.
- `404`: ruta no encontrada.
- `500`: error al registrar la consulta.

#### Consultar historial

```http
GET /api/historial
```

**Descripción:**

Devuelve el historial de consultas del usuario autenticado.

El backend incluye la información de las rutas mediante `populate()` y ordena los registros desde el más reciente hasta el más antiguo.

**Respuesta exitosa (200):**

Devuelve un arreglo de registros de historial con la información de las rutas relacionadas.

#### Eliminar una consulta

```http
DELETE /api/historial/:id
```

**Parámetro:**

- `id`: identificador del registro del historial.

**Descripción:**

Elimina una consulta específica, siempre que pertenezca al usuario autenticado.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Consulta eliminada correctamente."
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `401`: usuario no autenticado.
- `404`: consulta no encontrada en el historial del usuario.
- `500`: error al eliminar la consulta.

#### Eliminar todo el historial

```http
DELETE /api/historial
```

**Descripción:**

Elimina todos los registros del historial pertenecientes al usuario autenticado.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Historial eliminado correctamente."
}
```

**Posibles errores:**

- `401`: usuario no autenticado.
- `500`: error al limpiar el historial.

### 3.5. Novedades

**Prefijo:** `/api/novedades`

Este módulo permite consultar las novedades del transporte público.

#### Consultar novedades vigentes

```http
GET /api/novedades
```

**Autenticación:** No requiere.

**Descripción:**

Devuelve las novedades que cumplen las siguientes condiciones:

- Su estado es `Publicada`.
- Su fecha de inicio es anterior o igual a la fecha actual.
- Su fecha de finalización es igual o posterior a la fecha actual, o no tiene una fecha de finalización definida.

Los resultados se ordenan por fecha de inicio, desde la más reciente.

**Respuesta exitosa (200):**

Devuelve un arreglo de novedades vigentes.

**Error (500):**

```json
{
  "mensaje": "Error al consultar las novedades"
}
```

Las operaciones administrativas de creación, actualización y eliminación de novedades se encuentran documentadas en el módulo de administración.

### 3.6. Administración

**Prefijo:** `/api/admin`

Este módulo permite gestionar información y consultar estadísticas desde el panel administrativo.

Todas sus operaciones requieren autenticación y autorización mediante el middleware `verificarAdmin`.

**Encabezado de autenticación:**

```http
Authorization: Bearer TOKEN_JWT
```

#### Consultar estadísticas

```http
GET /api/admin/estadisticas
```

**Descripción:**

Obtiene los principales indicadores del sistema:

- Usuarios registrados con rol `usuario`.
- Total de rutas almacenadas.
- Total de consultas registradas en el historial.
- Total de novedades publicadas y vigentes.

**Respuesta exitosa (200):**

```json
{
  "usuarios": 100,
  "rutas": 55,
  "consultas": 250,
  "novedadesActivas": 4
}
```

Los valores son ilustrativos y no representan necesariamente los datos actuales de producción.

#### Consultar usuarios

```http
GET /api/admin/usuarios
```

**Descripción:**

Obtiene los usuarios registrados, excluyendo información sensible como las contraseñas.

Los resultados incluyen nombre, correo, universidad, ciudad, rol, estado de la cuenta y fecha de creación.

Se ordenan desde el registro más reciente.

**Respuesta exitosa (200):**

```json
{
  "total": 2,
  "usuarios": [
    {
      "_id": "ID_DEL_USUARIO",
      "nombre": "María",
      "email": "maria@example.com",
      "universidad": "Universidad Sergio Arboleda",
      "ciudad": "Barranquilla",
      "rol": "usuario",
      "activo": true
    }
  ]
}
```

El ejemplo es ilustrativo.

#### Consultar actividades

```http
GET /api/admin/actividad
```

**Descripción:**

Consulta el registro de actividades administrativas.

Por defecto, devuelve las cinco actividades más recientes.

Para consultar todas las actividades se utiliza el siguiente parámetro:

```http
GET /api/admin/actividad?todas=true
```

Las actividades registran operaciones como la creación, actualización y eliminación de rutas y novedades.

**Respuesta exitosa (200):**

Devuelve un arreglo de actividades ordenadas por fecha, desde la más reciente.

#### Consultar novedades administrativas

```http
GET /api/admin/novedades
```

**Descripción:**

Devuelve todas las novedades almacenadas, independientemente de su estado.

Se utiliza principalmente para la gestión desde el panel administrativo.

**Respuesta exitosa (200):**

Devuelve un arreglo de objetos de novedades.

#### Crear novedad

```http
POST /api/admin/novedades
```

**Cuerpo de la solicitud:**

```json
{
  "titulo": "Desvío temporal de ruta",
  "tipo": "Desvio",
  "descripcion": "La ruta presenta un cambio temporal en su recorrido.",
  "ubicacion": "Barranquilla",
  "empresa": "Empresa de transporte",
  "ruta": "U12",
  "fechaInicio": "2026-11-12T08:00:00.000Z",
  "fechaFin": null,
  "estado": "Publicada"
}
```

**Descripción:**

Crea una nueva novedad.

El backend asigna automáticamente el identificador del administrador autenticado al campo `creadoPor`.

Después de guardar la novedad, registra la actividad correspondiente.

**Respuesta exitosa (201):**

```json
{
  "mensaje": "Novedad creada correctamente",
  "novedad": {}
}
```

El objeto `novedad` contiene el registro creado.

**Error (400):**

```json
{
  "mensaje": "No se pudo crear la novedad",
  "error": "Detalle del error"
}
```

#### Actualizar novedad

```http
PUT /api/admin/novedades/:id
```

**Parámetro:**

- `id`: identificador de la novedad.

**Cuerpo de la solicitud:**

Recibe los campos que se desean actualizar de acuerdo con el modelo de novedades.

**Descripción:**

Actualiza una novedad existente y registra la actividad administrativa correspondiente.

El campo `creadoPor` no se acepta como dato modificable desde el cuerpo de la solicitud.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Novedad actualizada correctamente",
  "novedad": {}
}
```

**Posibles errores:**

- `400`: identificador inválido o error de validación.
- `404`: novedad no encontrada.

#### Eliminar novedad

```http
DELETE /api/admin/novedades/:id
```

**Parámetro:**

- `id`: identificador de la novedad.

**Descripción:**

Elimina una novedad y registra la actividad administrativa correspondiente.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Novedad eliminada correctamente"
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `404`: novedad no encontrada.
- `500`: error al eliminar la novedad.

#### Consultar rutas administrativas

```http
GET /api/admin/rutas
```

**Descripción:**

Obtiene todas las rutas almacenadas y las ordena por empresa y código de bus.

**Respuesta exitosa (200):**

Devuelve un arreglo con los registros de rutas.

#### Crear ruta

```http
POST /api/admin/rutas
```

**Cuerpo de la solicitud:**

```json
{
  "routeId": "U56",
  "company-name": "Empresa de transporte",
  "busCode": "PT2-4102",
  "origen": "Barranquilla",
  "destino": "Universidad del Atlántico",
  "stop": "Paradas registradas",
  "precio": "Por verificar",
  "tiempo": "Por verificar",
  "horario": "Por verificar",
  "Tipo": "Urbana",
  "busstatus": "Activa",
  "Fuente": "Fuente de información",
  "Universidades ": "Universidad del Atlántico"
}
```

**Descripción:**

Registra una nueva ruta.

El backend verifica que no exista otra ruta con el mismo identificador `routeId`, sin distinguir entre mayúsculas y minúsculas.

Después de guardar la ruta, registra una actividad administrativa.

**Respuesta exitosa (201):**

```json
{
  "mensaje": "Ruta creada correctamente",
  "ruta": {}
}
```

**Posibles errores:**

- `400`: error de validación o creación.
- `409`: ya existe una ruta con ese identificador.

#### Actualizar ruta

```http
PUT /api/admin/rutas/:id
```

**Parámetro:**

- `id`: identificador de MongoDB correspondiente a la ruta.

**Cuerpo de la solicitud:**

Recibe los campos de la ruta que se van a actualizar, como identificador, empresa, código de bus, origen, destino, paradas, precio, tiempo, horario, tipo, estado, fuente y universidades.

**Descripción:**

Actualiza una ruta existente y registra la actividad administrativa correspondiente.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Ruta actualizada correctamente",
  "ruta": {}
}
```

**Posibles errores:**

- `400`: identificador inválido o error de validación.
- `404`: ruta no encontrada.

#### Eliminar ruta

```http
DELETE /api/admin/rutas/:id
```

**Parámetro:**

- `id`: identificador de MongoDB correspondiente a la ruta.

**Descripción:**

Elimina una ruta del sistema.

Antes de eliminarla, el backend también:

1. Retira la referencia de esa ruta de los favoritos de los usuarios.
2. Elimina los registros del historial relacionados con esa ruta.
3. Elimina el documento de la colección de rutas.
4. Registra la actividad administrativa correspondiente.

**Respuesta exitosa (200):**

```json
{
  "mensaje": "Ruta eliminada correctamente"
}
```

**Posibles errores:**

- `400`: identificador inválido.
- `404`: ruta no encontrada.
- `500`: error al eliminar la ruta.

### 3.7. Formulario de contacto

**Prefijo:** `/api/contacto`

#### Enviar mensaje

```http
POST /api/contacto
```

**Autenticación:** No requiere.

**Cuerpo de la solicitud:**

```json
{
  "nombre": "María",
  "email": "maria@example.com",
  "mensaje": "Quisiera obtener más información sobre Movu."
}
```

**Descripción:**

Recibe los datos enviados mediante el formulario de contacto y los almacena en MongoDB.

El backend valida que todos los campos estén completos y que el correo tenga un formato válido.

**Respuesta exitosa (201):**

```json
{
  "mensaje": "Tu mensaje fue enviado correctamente."
}
```

**Posibles errores:**

- `400`: campos obligatorios incompletos o correo inválido.
- `500`: error al guardar el mensaje.

### 3.8. Asistente de inteligencia artificial

**Prefijo:** `/api/chat`

#### Enviar pregunta al asistente

```http
POST /api/chat
```

**Autenticación:** No requiere.

**Cuerpo de la solicitud:**

```json
{
  "mensaje": "¿Qué rutas puedo tomar para llegar a la Universidad del Atlántico?",
  "origen": "Soledad",
  "destino": "Universidad del Atlántico"
}
```

Los campos `origen` y `destino` son opcionales. El único campo obligatorio es `mensaje`.

**Validaciones:**

- El mensaje debe ser una cadena de texto.
- No puede estar vacío.
- No puede superar los 1000 caracteres.
- El servicio de Gemini debe estar configurado.

**Funcionamiento:**

1. El backend recibe la pregunta del usuario.
2. Google Gemini identifica el tipo de consulta.
3. La consulta se clasifica en una de las siguientes categorías:
   - `transporte`
   - `novedades`
   - `movu`
   - `general`
4. Si corresponde a una consulta de transporte, el backend obtiene información de las rutas.
5. Si corresponde a transporte o novedades, consulta las novedades publicadas y vigentes.
6. El backend prepara el contexto con la información disponible.
7. Google Gemini genera una respuesta utilizando ese contexto.
8. El backend devuelve la respuesta al frontend.

Cuando el usuario proporciona directamente los campos `origen` y `destino`, estos tienen prioridad sobre los valores identificados por el modelo.

**Respuesta exitosa (200):**

```json
{
  "respuesta": "Puedes consultar las rutas disponibles en Movu..."
}
```

**Posibles errores:**

- `400`: mensaje vacío, inválido o superior a 1000 caracteres.
- `500`: clave de Gemini no configurada o error al procesar la consulta.

## 4. Autenticación y autorización

Movu utiliza JSON Web Tokens (JWT) para gestionar las sesiones y controlar el acceso a las operaciones protegidas.

### 4.1. Generación del token

El token se genera cuando un usuario inicia sesión correctamente.

Incluye los siguientes datos:

- Identificador del usuario.
- Rol del usuario.

Su duración está configurada en una hora.

### 4.2. Envío del token

Para acceder a los endpoints protegidos, el frontend debe enviar el token en el encabezado HTTP:

```http
Authorization: Bearer TOKEN_JWT
```

### 4.3. Middleware verificarToken

El middleware `verificarToken.js` se encarga de:

1. Comprobar que la solicitud incluya el encabezado `Authorization`.
2. Verificar que el encabezado utilice el formato `Bearer`.
3. Validar el token mediante la clave `JWT_SECRET`.
4. Consultar el usuario correspondiente en MongoDB.
5. Verificar que la cuenta exista y esté activa.
6. Adjuntar la información del usuario a `req.usuario`.
7. Permitir que la solicitud continúe mediante `next()`.

Este middleware protege principalmente las operaciones de favoritos e historial.

### 4.4. Middleware verificarAdmin

El middleware `verificarAdmin.js` realiza las validaciones de autenticación y comprueba adicionalmente que el usuario tenga el rol `admin`.

El rol se consulta directamente en la base de datos para verificar los permisos actuales de la cuenta.

Si el usuario no tiene permisos administrativos, el servidor devuelve una respuesta `403`.

Este middleware protege todas las operaciones del módulo administrativo.

### 4.5. Códigos de autenticación y autorización

- `401`: no se proporcionó un token, el token es inválido o expiró, o la cuenta no está disponible.
- `403`: el usuario está autenticado, pero no tiene permisos de administrador.
- `500`: existe un error de configuración o verificación del servidor.

**Consideración:** la actualización del perfil (`PUT /api/auth/perfil`) realiza su propia validación JWT dentro del endpoint, en lugar de utilizar directamente el middleware `verificarToken.js`.

## 5. Códigos de respuesta HTTP

La API utiliza los códigos de estado HTTP para indicar el resultado de las solicitudes.

Los principales son:

- **200 – OK:** operación realizada correctamente.
- **201 – Created:** recurso creado correctamente.
- **400 – Bad Request:** solicitud incorrecta, datos incompletos o identificadores inválidos.
- **401 – Unauthorized:** se requiere autenticación o el token no es válido.
- **403 – Forbidden:** el usuario no tiene permisos suficientes.
- **404 – Not Found:** el recurso solicitado no existe o no se encontró.
- **409 – Conflict:** existe un conflicto con la información enviada, como un correo o identificador duplicado.
- **500 – Internal Server Error:** ocurrió un error durante el procesamiento de la solicitud.

Los códigos específicos pueden variar según el endpoint y la operación realizada.

## 6. Rutas de prueba del servidor

Además de los endpoints funcionales, `index.js` contiene algunas rutas utilizadas para comprobar el funcionamiento del servidor.

### Verificar la API

```http
GET /
```

Devuelve:

```text
Movu API está funcionando correctamente.
```

### Verificar favoritos

```http
GET /api/fav/prueba
```

Devuelve:

```json
{
  "mensaje": "La ruta de fav está funcionando"
}
```

### Verificar acceso administrativo

```http
GET /api/admin/prueba
```

Requiere autenticación y permisos de administrador.

Devuelve:

```json
{
  "mensaje": "Acceso de administrador autorizado",
  "usuario": "Nombre del administrador"
}
```

### Verificar el servidor

```http
GET /prueba-servidor
```

Devuelve:

```text
Este es el servidor correcto
```

Estas rutas tienen fines de comprobación y no representan funcionalidades principales de la aplicación.

## 7. Consideraciones técnicas

- Las solicitudes que envían información al servidor deben utilizar el formato JSON cuando corresponda.
- Los endpoints protegidos requieren el encabezado `Authorization` con un token JWT válido.
- Las contraseñas se almacenan mediante hash y no deben enviarse en las respuestas de la API.
- Las operaciones administrativas requieren el rol correspondiente.
- Los identificadores de MongoDB se validan en las operaciones que reciben identificadores de rutas o novedades.
- Los errores se gestionan mediante bloques `try/catch` y respuestas HTTP.
- Las claves y credenciales de servicios externos deben mantenerse en variables de entorno.
- La API utiliza MongoDB Atlas como fuente de almacenamiento de información.
- Las consultas del chatbot dependen de la disponibilidad y configuración del servicio de Google Gemini.

## 8. Documentación relacionada

Para ampliar la información sobre el funcionamiento y la estructura de Movu, se recomienda consultar:

- `logica.md`: funcionalidades, módulos y flujos de uso.
- `arquitectura.md`: estructura tecnológica y comunicación entre componentes.
- `base_de_datos.md`: modelos, colecciones, campos y relaciones.
- `despliegue.md`: infraestructura, configuración y publicación del proyecto.