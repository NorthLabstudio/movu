# Base de datos — Movu

## 1. Descripción general

Movu utiliza **MongoDB** como sistema de gestión de bases de datos no relacional y **Mongoose** como herramienta de modelado de datos para Node.js.

La información se organiza en colecciones, cuyos documentos siguen estructuras definidas mediante esquemas. Estos esquemas permiten establecer tipos de datos, campos obligatorios, valores predeterminados y reglas de validación.

La base de datos está alojada en MongoDB Atlas y se conecta con el backend mediante una variable de entorno, evitando exponer las credenciales de conexión en el código fuente.

## 2. Colecciones y modelos

La base de datos de Movu está organizada en seis modelos principales:

- **Usuario:** gestiona las cuentas, los datos y las rutas favoritas de los usuarios.
- **Actividad:** registra acciones administrativas relacionadas con rutas y novedades.
- **Contacto:** almacena los mensajes enviados mediante el formulario de contacto.
- **Ruta:** contiene la información de las rutas de transporte público.
- **Novedad:** gestiona avisos y situaciones que pueden afectar el servicio de transporte.
- **Historial:** registra las rutas consultadas por cada usuario.

### 2.1 Usuarios (`Usuario`)

**Archivo:** `models/usuario.js`

**Descripción:**

Almacena la información de los usuarios registrados en Movu. Permite gestionar sus datos básicos, credenciales de acceso, rol dentro de la plataforma, estado de la cuenta y rutas favoritas.

**Campos del modelo:**

- `nombre` (String): nombre del usuario. Es obligatorio, debe tener al menos dos caracteres y elimina espacios externos.
- `email` (String): correo electrónico del usuario. Es obligatorio, único, se convierte a minúsculas y elimina espacios externos.
- `contraseña` (String): contraseña del usuario. Es un campo obligatorio.
- `universidad` (String): universidad asociada al usuario. Es opcional y su valor predeterminado es una cadena vacía.
- `ciudad` (String): ciudad del usuario. Es opcional y su valor predeterminado es una cadena vacía.
- `rol` (String): define los permisos dentro de la plataforma. Admite los valores `usuario` y `admin`. Su valor predeterminado es `usuario`.
- `activo` (Boolean): indica si la cuenta se encuentra activa. Su valor predeterminado es `true`.
- `fav` (Array de ObjectId): almacena referencias a las rutas favoritas del usuario mediante el modelo `Ruta`.

**Campos automáticos:**

El esquema utiliza `timestamps: true`, por lo que Mongoose genera automáticamente:

- `createdAt`: fecha de creación del documento.
- `updatedAt`: fecha de la última actualización.

**Relaciones:**

El campo `fav` permite relacionar un usuario con varias rutas mediante sus identificadores.

### 2.2 Actividades (`Actividad`)

**Archivo:** `models/actividad.js`

**Descripción:**

Registra las actividades administrativas relacionadas con la creación, actualización y eliminación de rutas y novedades. Permite conservar un registro de los cambios realizados en estos elementos de la plataforma.

**Campos del modelo:**

- `tipo` (String): identifica el elemento sobre el que se realizó la actividad. Es obligatorio y admite los valores `ruta` o `novedad`.
- `accion` (String): indica la operación realizada. Es obligatorio y admite los valores `creada`, `actualizada` o `eliminada`.
- `titulo` (String): título descriptivo de la actividad. Es obligatorio.
- `descripcion` (String): información complementaria sobre el cambio realizado. Es opcional y su valor predeterminado es una cadena vacía.
- `fecha` (Date): registra el momento de la actividad. Su valor predeterminado es la fecha y hora actuales.

**Colección:**

El modelo utiliza explícitamente la colección `actividades`.

**Consideraciones:**

Este modelo no utiliza timestamps automáticos. Emplea el campo `fecha` para registrar el momento de cada actividad. Tampoco contiene una referencia al usuario que ejecutó la acción.

### 2.3 Contactos (`Contacto`)

**Archivo:** `models/contacto.js`

**Descripción:**

Almacena los mensajes enviados por los usuarios o visitantes a través del formulario de contacto de Movu. Permite gestionar las solicitudes y hacer seguimiento a su estado de atención.

**Campos del modelo:**

- `nombre` (String): nombre de quien envía el mensaje. Es obligatorio y elimina espacios externos.
- `email` (String): correo electrónico de contacto. Es obligatorio, se convierte a minúsculas y elimina espacios externos.
- `mensaje` (String): contenido del mensaje enviado. Es obligatorio y elimina espacios externos.
- `fecha` (Date): registra la fecha de recepción del mensaje. Su valor predeterminado es la fecha y hora actuales.
- `estado` (String): indica el estado de atención del mensaje. Admite tres valores:
  - `Pendiente`
  - `Revisado`
  - `Respondido`

  Su valor predeterminado es `Pendiente`.

**Consideraciones:**

El modelo no utiliza timestamps automáticos. La fecha de recepción se almacena mediante el campo `fecha`.

### 2.4 Rutas (`Ruta`)

**Archivo:** `models/rutas.js`

**Descripción:**

Almacena la información de las rutas de transporte público disponibles en el directorio de Movu. Contiene datos de identificación, empresa operadora, recorrido, paradas, tarifas, horarios y fuentes de información.

**Campos del modelo:**

- `routeId` (String): identificador de la ruta dentro de Movu. Es obligatorio.
- `company-name` (String): nombre de la empresa operadora. Es obligatorio.
- `busCode` (String): código o identificación del bus o ruta. Es obligatorio.
- `origen` (String): punto de origen del recorrido. Es obligatorio.
- `destino` (String): punto de destino del recorrido. Es obligatorio.
- `stop` (String): información de las paradas del recorrido. Es opcional y su valor predeterminado es una cadena vacía.
- `precio` (String): tarifa del servicio. Su valor predeterminado es `Por verificar`.
- `tiempo` (String): tiempo estimado del recorrido. Su valor predeterminado es `Por verificar`.
- `horario` (String): horarios de operación de la ruta. Su valor predeterminado es `Por verificar`.
- `Tipo` (String): tipo de servicio o clasificación de la ruta. Es opcional y su valor predeterminado es una cadena vacía.
- `busstatus` (String): estado de la ruta. Su valor predeterminado es `Activa`.
- `Fuente` (String): fuente de la información de la ruta. Es opcional y su valor predeterminado es una cadena vacía.
- `Universidades ` (String): universidades asociadas al recorrido. Es opcional y su valor predeterminado es una cadena vacía.

**Colección:**

El modelo utiliza explícitamente la colección `rutas`.

**Consideraciones:**

Los campos relacionados con precio, tiempo y horario utilizan valores predeterminados cuando la información no está disponible. Esto permite identificar datos pendientes de verificación.

Los campos `company-name` y `Universidades ` conservan sus nombres originales en el esquema, incluyendo el espacio final del segundo campo.

### 2.5 Novedades (`Novedad`)

**Archivo:** `models/novedad.js`

**Descripción:**

Almacena información sobre situaciones que pueden afectar o modificar el servicio de transporte público, como cierres viales, desvíos, suspensión de paradas y cambios de horario. Permite gestionar el estado de publicación y la vigencia de cada aviso.

**Campos del modelo:**

- `titulo` (String): título de la novedad. Es obligatorio y elimina espacios externos.
- `tipo` (String): clasificación de la novedad. Es obligatorio y admite las siguientes opciones:
  - `Via cerrada`
  - `Desvio`
  - `Parada suspendida`
  - `Cambio de horario`
  - `Restablecimiento`
  - `Informacion general`
- `descripcion` (String): detalle de la situación reportada. Es obligatorio y elimina espacios externos.
- `ubicacion` (String): lugar donde ocurre la novedad. Es opcional y su valor predeterminado es una cadena vacía.
- `empresa` (String): empresa de transporte relacionada. Es opcional y su valor predeterminado es una cadena vacía.
- `ruta` (String): ruta relacionada con la novedad. Es opcional y su valor predeterminado es una cadena vacía.
- `fechaInicio` (Date): fecha desde la cual aplica la novedad. Es obligatoria.
- `fechaFin` (Date): fecha de finalización de la novedad. Es opcional y su valor predeterminado es `null`.
- `estado` (String): estado de publicación de la novedad. Admite los valores `Borrador`, `Publicada` y `Finalizada`. Su valor predeterminado es `Borrador`.
- `creadoPor` (ObjectId): identificador del usuario que creó la novedad. Es obligatorio y establece una referencia al modelo `Usuario`.

**Campos automáticos:**

El esquema utiliza `timestamps: true`, generando:

- `createdAt`: fecha de creación del documento.
- `updatedAt`: fecha de la última actualización.

**Relaciones:**

El campo `creadoPor` establece una referencia al usuario responsable de crear la novedad.

### 2.6 Historial (`Historial`)

**Archivo:** `models/historial.js`

**Descripción:**

Registra las consultas de rutas realizadas por los usuarios de Movu. Permite conservar un historial de las rutas que cada usuario ha visualizado dentro de la plataforma.

**Campos del modelo:**

- `usuario` (ObjectId): identificador del usuario que consultó la ruta. Es obligatorio y referencia al modelo `Usuario`.
- `ruta` (ObjectId): identificador de la ruta consultada. Es obligatorio y referencia al modelo `Ruta`.
- `fecha` (Date): registra la fecha y hora de la consulta. Su valor predeterminado es la fecha y hora actuales.

**Colección:**

El modelo utiliza explícitamente la colección `historial`.

**Relaciones:**

Cada registro relaciona un usuario con una ruta mediante sus respectivos identificadores. Un usuario puede tener múltiples registros en el historial y una ruta puede aparecer en los historiales de diferentes usuarios.

## 3. Relaciones entre colecciones

Movu utiliza referencias mediante `ObjectId` para relacionar documentos de diferentes colecciones. Estas relaciones permiten conectar la información sin tener que duplicar todos los datos.

Las relaciones implementadas son las siguientes:

**Usuarios y rutas favoritas**

El modelo `Usuario` contiene el campo `fav`, que almacena los identificadores de las rutas favoritas. Un usuario puede tener varias rutas asociadas a su cuenta.

**Usuarios y novedades**

El modelo `Novedad` utiliza el campo `creadoPor` para identificar al usuario responsable de registrar cada novedad.

**Usuarios e historial**

El modelo `Historial` utiliza el campo `usuario` para identificar a