# Lógica del Negocio y Funcionamiento de Movu

## 1. Descripción general

Movu es una plataforma web de movilidad inteligente diseñada para facilitar la consulta y planificación de desplazamientos en transporte público, proporcionando información organizada sobre rutas de buses y novedades relacionadas con la movilidad urbana.

Inicialmente enfocada en Barranquilla y su área metropolitana, Movu busca ayudar principalmente a estudiantes universitarios a encontrar información sobre las rutas de transporte disponibles para llegar a sus instituciones educativas.

La plataforma centraliza información de diferentes empresas de transporte, permitiendo consultar recorridos, identificar rutas, conocer sus principales paradas y guardar aquellas que resulten de interés para el usuario.

Además, incorpora funcionalidades de gestión de cuentas, rutas favoritas, historial de consultas, publicación de novedades y un asistente conversacional basado en inteligencia artificial.

**Propósito principal:** reducir la incertidumbre que experimentan los usuarios al utilizar el transporte público, facilitando el acceso a información que les permita tomar decisiones de movilidad más informadas.

## 2. Objetivos de la plataforma

- Centralizar información de rutas de transporte público.
- Facilitar la búsqueda y consulta de rutas por empresa y otros criterios.
- Proporcionar información sobre recorridos y paradas.
- Permitir que los usuarios guarden rutas de interés.
- Mantener un historial de las rutas consultadas.
- Comunicar novedades relacionadas con el servicio y la movilidad.
- Facilitar la interacción con un asistente conversacional.
- Ofrecer herramientas de administración para gestionar la información de la plataforma.

## 3. Usuarios y roles

Movu contempla dos tipos principales de usuarios:

### 3.1. Usuario

Es la persona que utiliza la plataforma para consultar información de movilidad.

Puede:

- Explorar el directorio de rutas.
- Buscar y filtrar rutas disponibles.
- Consultar información y recorridos.
- Visualizar novedades publicadas.
- Crear una cuenta e iniciar sesión.
- Editar sus datos personales.
- Guardar y eliminar rutas favoritas.
- Consultar su historial de rutas.
- Eliminar registros del historial.
- Interactuar con el asistente conversacional.

### 3.2. Administrador

Es el usuario autorizado para gestionar la información de Movu.

Puede:

- Administrar las rutas registradas.
- Crear, consultar, actualizar y eliminar información de rutas.
- Gestionar novedades relacionadas con la movilidad.
- Crear y editar publicaciones.
- Gestionar usuarios

El administrador cuenta con permisos diferentes a los de un usuario convencional.

## 4. Módulos y funcionalidades

### 4.1. Página de inicio (Landing Page)

Es el punto de entrada a la plataforma. Su función es presentar Movu, explicar su propósito y orientar al visitante hacia las principales funcionalidades.

Contiene:

- Presentación de Movu.
- Problema de movilidad que busca atender.
- Descripción de las funcionalidades.
- Beneficios para los usuarios.
- Público al que está dirigida.
- Información de contacto.
- CTA
- Accesos para registrarse o iniciar sesión.

### 4.2. Autenticación y gestión de cuentas

Permite identificar a los usuarios y controlar el acceso a las funcionalidades privadas.

**Registro:**
1. El usuario ingresa sus datos.
2. El sistema valida la información.
3. La contraseña se almacena mediante un proceso de cifrado hash.
4. Se crea el registro del usuario en la base de datos.

**Inicio de sesión:**
1. El usuario proporciona sus credenciales.
2. El sistema verifica la información.
3. Si las credenciales son correctas, genera un token de autenticación.
4. El usuario accede a las funcionalidades correspondientes a su rol.

La sesión se mantiene mediante un token de autenticación y la información básica del usuario almacenada en el navegador.

### 4.3. Catálogo o directorio de rutas

Es uno de los módulos principales de Movu. Permite consultar las rutas de transporte público registradas en la plataforma.

La información se organiza por empresas de transporte, facilitando la exploración del catálogo.

**Funcionamiento:**

1. El usuario ingresa al directorio.
2. El sistema obtiene las rutas disponibles desde el backend.
3. Las rutas se presentan agrupadas por empresa, y mostradas en cartas.
4. El usuario puede utilizar el buscador y los filtros disponibles.
5. Selecciona una tarjeta para consultar información adicional.
6. Puede visualizar el recorrido y las paradas registradas.

**Estructura conceptual del directorio:**

- Directorio de rutas.
  - Buscador y filtros.
  - Empresa Coolitoral.
    - Tarjetas de rutas.
  - Empresa Sobusa.
    - Tarjetas de rutas.
  - Empresa Transmetro.
    - Tarjetas de rutas.
  - Otras empresas registradas...

### 4.4. Tarjetas de rutas

Cada ruta se representa mediante una tarjeta interactiva con dos vistas.

**Vista frontal:**

Presenta información general de la ruta:

- Empresa de transporte.
- Código o identificación de la ruta.
- Origen.
- Destino.
- Estado o información disponible del servicio.
- Precio, cuando está registrado.
- Tiempo estimado, cuando está registrado.
- Botón para guardar o eliminar de favoritos.
- Acceso para visualizar el recorrido.

**Vista posterior:**

Al seleccionar la opción de recorrido, la tarjeta gira y muestra:

- Recorrido registrado.
- Paradas o puntos principales.
- Información complementaria disponible.

Si una ruta tiene muchas paradas, estas se pueden consultar mediante desplazamiento dentro de la tarjeta.

**Visualización del recorrido en mapa**

En la vista posterior de cada tarjeta se contempla un botón denominado «Ver recorrido en el mapa», que permitirá abrir una ventana modal sobre la interfaz principal. 

Dentro de este modal, el usuario podrá visualizar:

- Un mapa geográfico con el trazado del recorrido del bus.

- La ubicación de las paradas registradas a lo largo de la ruta.

- El punto de origen y el destino.

El propósito de esta funcionalidad es ofrecer una representación visual y geográfica de las rutas, facilitando la comprensión del trayecto y permitiendo que el usuario identifique cómo se distribuyen las paradas a lo largo del recorrido.

Información complementaria sobre el recorrido, cuando esté disponible. La visualización se construirá a partir de la información geográfica disponible para cada ruta.

### 4.5. Favoritos

Esta funcionalidad permite que los usuarios registrados guarden las rutas que consultan frecuentemente.

**Funcionamiento:**

1. El usuario selecciona el botón de favoritos en una tarjeta.
2. El sistema verifica su sesión.
3. Si la ruta no está guardada, se registra como favorita.
4. Si ya está guardada, puede eliminarse de la lista.
5. Los cambios se reflejan en el perfil del usuario y en el dashboard.

Los favoritos están asociados a la cuenta de cada usuario.

### 4.6. Historial de consultas

Permite consultar las rutas que el usuario ha revisado anteriormente.

**Funcionamiento:**

1. El usuario consulta una ruta y accede a su recorrido.
2. El sistema registra la consulta.
3. El registro queda asociado al usuario.
4. El usuario puede revisar las rutas consultadas desde su perfil.
5. Puede eliminar registros individuales o limpiar todo el historial.

### 4.7. Perfil del usuario

Es el espacio personal desde el cual cada usuario puede gestionar su información y consultar su actividad en Movu.

Incluye:

**Información personal:**
- Nombre.
- Correo electrónico.
- Información académica registrada (Universidad).
- Ciudad.

**Gestión de actividad:**
- Rutas favoritas.
- Historial de consultas.

**Configuración:**
- Opciones relacionadas con la cuenta y su información. (No disponible actualmente, solo edicion de usuario)

### 4.8. Novedades de movilidad

Este módulo permite publicar información relacionada con cambios o situaciones que puedan afectar los desplazamientos.

Las novedades son gestionadas desde el entorno administrativo.

Pueden incluir:

- Cambios temporales en rutas.
- Cierres viales.
- Modificaciones en recorridos.
- Información importante sobre el servicio.
- Otras novedades relacionadas con la movilidad.

Las publicaciones cuentan con estados de gestión:

- **Borrador:** información que todavía no se encuentra publicada.
- **Publicada:** información disponible para los usuarios.
- **Finalizada:** novedad cuya vigencia ha terminado.

La visualización de las novedades depende de su estado y vigencia.

### 4.9. Asistente conversacional con inteligencia artificial

Movu incorpora un asistente conversacional para facilitar la consulta de información relacionada con el transporte público.

Su propósito es ofrecer una interacción más natural, permitiendo que los usuarios formulen preguntas sobre rutas y opciones de movilidad.

Ejemplos de consultas:

- ¿Qué rutas puedo consultar para llegar a una universidad?
- ¿Cuál es el recorrido de esta ruta?
- ¿Qué alternativas de transporte aparecen disponibles?
- ¿Qué información hay sobre una determinada ruta?

El asistente utiliza inteligencia artificial y puede apoyarse en la información de rutas y novedades disponible en la plataforma.

**Importante:** el asistente no debe interpretarse como un sistema de seguimiento GPS en tiempo real ni como un motor de optimización de recorridos. Sus respuestas dependen de la información disponible y de las capacidades implementadas.

### 4.10. Formulario de contacto

Permite que los visitantes o usuarios envíen mensajes a Movu.

 Actualmente, la información proporcionada se procesa desde el backend y se almacena en la base de datos para su posterior consulta o gestión. (esto se editara despues, para o se vea en el panel admin o se integrar otra herramienta para que llegue al correo del admin)

## 5. Flujo general de funcionamiento

### 5.1. Flujo del visitante

1. Ingresa a Movu.
2. Explora la página de inicio.
3. Conoce las funcionalidades.
4. Puede registrarse o iniciar sesión para utilizar las funcionalidades personalizadas.

### 5.2. Flujo del usuario registrado

1. Ingresa a la plataforma.
2. Inicia sesión.
3. Accede al catálogo de rutas.
4. Busca o filtra las rutas disponibles.
5. Consulta la información de una ruta.
6. Guarda rutas favoritas si lo desea.
7. El sistema registra las consultas realizadas.
8. Puede consultar novedades de movilidad.
9. Puede utilizar el asistente conversacional.
10. Accede a su perfil para gestionar sus datos, favoritos e historial.
11. Cierra sesión.

### 5.3. Flujo administrativo

1. El administrador inicia sesión.
2. El sistema identifica su rol.
3. Accede a las herramientas administrativas.
4. Gestiona la información de las rutas.
5. Crea o actualiza novedades.
6. Define el estado de las publicaciones.
7. La información publicada queda disponible para los usuarios según las reglas de visualización.

## 6. Mapa conceptual del sistema

La estructura general de navegación se organiza de la siguiente manera:

**MOVU**

- Página de inicio.
  - Presentación.
  - Funcionalidades.
  - Beneficios.
  - Contacto.
  - Registro e inicio de sesión.

- Autenticación.
  - Registro.
  - Inicio de sesión.

- Plataforma principal.
  - Catálogo de rutas.
    - Buscador.
    - Filtros.
    - Empresas.
    - Tarjetas de rutas.
    - Recorridos y paradas.
  - Dashboard
    - Resumen.
    - Novedades.
    - Asistente conversacional.

- Perfil del usuario.
  - Datos personales.
  - Información académica.
  - Favoritos.
  - Historial.
  - Configuración.

- Administración.
  - Gestión de rutas.
  - Gestión de novedades.
  - Gestión de publicaciones.
  - Gestión usuarios.

## 7. Reglas generales del negocio

1. Las funcionalidades personalizadas requieren que el usuario tenga una sesión válida.
2. Cada usuario solo puede consultar y gestionar sus propios favoritos e historial.
3. Las rutas se consultan a partir de la información registrada en la base de datos.
4. Las rutas se identifican mediante un registro único.
5. Los cambios realizados por el administrador deben reflejarse en la información disponible para los usuarios.
6. Las novedades deben respetar sus estados y condiciones de vigencia.
7. Las contraseñas no deben almacenarse en texto plano.
8. Las funcionalidades administrativas deben estar protegidas mediante control de roles.
9. La información presentada por el asistente depende de las fuentes de datos disponibles en Movu.

## 8. Funcionalidades futuras y oportunidades de mejora

Las siguientes funcionalidades representan posibilidades de evolución de la plataforma. No deben confundirse con las capacidades actualmente implementadas.

- Planificación de recorridos mediante origen y destino.
- Integración de información de fecha y hora para planificar desplazamientos.
- Recomendación automática de rutas según las necesidades del usuario.
- Comparación de alternativas de transporte.
- Seguimiento de vehículos en tiempo real mediante GPS, si se dispone de fuentes de datos adecuadas.
- Notificaciones personalizadas sobre cambios en rutas.
- Recuperación de contraseñas.
- Mayor personalización del asistente de inteligencia artificial.
- Participación de usuarios mediante reportes y experiencias de movilidad.
- Integración con fuentes oficiales de información de transporte.

## 9. Consideraciones sobre la información

Movu utiliza información registrada y organizada para facilitar la consulta de rutas de transporte público.

La precisión y actualización de los resultados dependen de la disponibilidad y calidad de las fuentes de información utilizadas.

La plataforma no garantiza que todos los datos representen las condiciones del transporte en tiempo real. Por ello, los usuarios deben considerar la información disponible como una herramienta de orientación para sus desplazamientos.

---

**Documento:** Lógica del Negocio y Funcionamiento de Movu  
**Proyecto:** Movu  
**Ámbito inicial:** Barranquilla y su área metropolitana, Colombia  
**Estado:** Versión de documentación del sistema actual y sus posibilidades de evolución.