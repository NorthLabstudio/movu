# Despliegue — Movu

## 1. Descripción general

Movu utiliza una arquitectura de despliegue dividida en tres componentes principales: frontend, backend y base de datos.

Cada componente se aloja en un servicio independiente, permitiendo que la interfaz de usuario, la lógica del servidor y el almacenamiento de información funcionen de manera separada.

La infraestructura actual utiliza los siguientes servicios:

- **Netlify:** alojamiento y despliegue del frontend.
- **Render:** alojamiento y ejecución del backend.
- **MongoDB Atlas:** almacenamiento y gestión de la base de datos.
- **GitHub:** repositorio del código fuente y control de versiones.

## 2. Arquitectura de despliegue

El funcionamiento general de la infraestructura sigue este flujo:

1. El usuario accede a Movu desde el navegador mediante el sitio publicado en Netlify.
2. El frontend realiza solicitudes HTTP al backend.
3. El backend, alojado en Render, procesa las solicitudes y ejecuta la lógica de la aplicación.
4. Cuando se requiere consultar o modificar información, el backend se comunica con MongoDB Atlas.
5. El servidor devuelve la respuesta al frontend para mostrar los resultados al usuario.

## 3. Despliegue del frontend

**Plataforma:** Netlify.

**Tecnologías:** React y Vite.

**Directorio:** `frontend/`.

**Sitio publicado:** https://movunl.netlify.app/

El frontend contiene la interfaz visual y los componentes con los que interactúan los usuarios. Su despliegue se realiza mediante el servicio de Netlify, que permite publicar la aplicación a partir del código fuente alojado en GitHub.

### Configuración de compilación

- **Directorio del proyecto:** `frontend`.
- **Comando de construcción:** `npm run build`.
- **Directorio de publicación:** `dist`.

### Variables de entorno

El frontend utiliza una variable de entorno para identificar la dirección del backend:

- `VITE_API_URL`: dirección base de la API desplegada en Render.

Esta variable se utiliza en el archivo `config/api.js` para centralizar la dirección del servidor y facilitar la comunicación entre ambos componentes.

## 4. Despliegue del backend

**Plataforma:** Render.

**Tecnologías:** Node.js y Express.

**Directorio:** `backend/`.

**URL del servidor:** https://movu.onrender.com/

El backend contiene la lógica de funcionamiento de Movu, administra las solicitudes realizadas por el frontend, gestiona la autenticación, ejecuta las operaciones sobre la base de datos y proporciona los diferentes servicios de la aplicación mediante una API.

### Configuración de ejecución

El servidor se ejecuta mediante Node.js y utiliza Express para gestionar las rutas y solicitudes HTTP.

- **Directorio del proyecto:** `backend`.
- **Entorno de ejecución:** Node.js.
- **Puerto:** definido mediante la variable de entorno `PORT`, cuando está disponible.
- **Archivo principal:** `index.js`.

### Variables de entorno

El backend utiliza variables de entorno para gestionar información de configuración y credenciales.

Entre las principales se encuentran:

- `PORT`: puerto de ejecución del servidor.
- `MONGODB_URI`: cadena de conexión con MongoDB Atlas.
- `JWT_SECRET`: clave utilizada para la generación y verificación de tokens de autenticación.
- `FRONTEND_URL`: dirección del frontend autorizado para comunicarse con el backend.
- `GEMINI_API_KEY`: clave de acceso al servicio de inteligencia artificial de Google, utilizado por el asistente de Movu.

Las credenciales y claves privadas no deben incluirse directamente en el código fuente ni publicarse en el repositorio.

## 5. Base de datos en producción

**Servicio:** MongoDB Atlas.

MongoDB Atlas aloja la base de datos utilizada por la versión desplegada de Movu.

El backend establece la conexión mediante Mongoose y utiliza la variable de entorno `MONGODB_URI` para acceder a la instancia correspondiente.

La base de datos almacena la información de usuarios, rutas, novedades, actividades, contactos e historial.

La conexión requiere que el servidor tenga autorización de acceso en la configuración de red de MongoDB Atlas.

## 6. Repositorio y control de versiones

**Plataforma:** GitHub.

El código fuente de Movu se mantiene en un repositorio de GitHub, desde el cual se gestionan los cambios y las actualizaciones del proyecto.

Git permite realizar seguimiento de las modificaciones, recuperar versiones anteriores y mantener un historial del desarrollo.

El repositorio contiene los directorios principales del proyecto:

- `backend/`: servidor, API, modelos, rutas y configuración.
- `frontend/`: interfaz de usuario y componentes de React.
- `docs/`: documentación técnica del proyecto.

Los archivos de configuración que contienen credenciales, como los archivos `.env`, deben excluirse del repositorio mediante `.gitignore`.

## 7. Proceso de actualización y despliegue

Cuando se realizan cambios en el código fuente, el proceso general de actualización es el siguiente:

1. Realizar las modificaciones correspondientes en el entorno local.
2. Probar los cambios para verificar el funcionamiento de la aplicación.
3. Registrar las modificaciones mediante Git.
4. Enviar los cambios al repositorio de GitHub.
5. Verificar el despliegue del componente correspondiente en Netlify o Render.
6. Comprobar que el frontend se comunique correctamente con el backend.
7. Verificar las operaciones que requieren conexión con MongoDB Atlas.

El despliegue puede ejecutarse automáticamente cuando se configuran las integraciones correspondientes entre GitHub y las plataformas de alojamiento.

## 8. Consideraciones de despliegue

- Las variables de entorno deben configurarse directamente en los paneles de administración de Netlify y Render.
- La dirección del frontend debe coincidir con la configuración CORS del backend.
- La conexión con MongoDB Atlas debe contar con los permisos de red correspondientes.
- Las claves privadas y credenciales no deben compartirse públicamente.
- Los cambios realizados en el frontend y el backend deben probarse para garantizar la compatibilidad entre ambos.
- La disponibilidad de los servicios puede depender del plan de alojamiento contratado.

Este documento describe la infraestructura de despliegue utilizada por la versión actual de Movu.