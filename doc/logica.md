# Logica del Negocio: Movu

## Descripcion: 
Movu es una plataforma web de movilidad inteligente diseñada para ayudar a las personas que utilizan el transporte público a planificar sus desplazamientos de forma más sencilla, informada y confiable.

Inicialmente enfocada en Barranquilla, Colombia, la plataforma reúne información relevante sobre rutas de buses, novedades de movilidad, cierres viales y recomendaciones para que los usuarios puedan tomar mejores decisiones antes y durante sus recorridos.

Además, Movu incorpora un asistente inteligente que ayuda a resolver dudas sobre rutas y alternativas de transporte, buscando reducir la incertidumbre y mejorar la experiencia de movilidad urbana.

## Flujo Principal: 
1. El usuario ingresa a la plataforma.
2. El usuario consulta rutas de buses.
3. El usuario recibe alertas de movilidad.
4. El usuario encuentra alternativas de transporte.
5. El usuario planifica su desplazamiento.
6. El usuario comparte su experiencia con otros usuarios.
7. El usuario puede crear una cuenta para acceder a más funciones.Como guardar sus preferencias, ver su historial de bus y hablar con un chat bot personalizado.

## Mapa de Flujo:
Inicio

↓

Landing Page

• Información del proyecto (¿Qué es Movu? y que resuelve)
• Funcionalidades (¿Que puede hacer?)
• Beneficios (¿Por qué usar Movu?)
• Publico dirigido
• Contacto
• Call to action
• Registro / Iniciar sesión

↓

Autenticación

• Crear cuenta
• Iniciar sesión
• Recuperar contraseña

↓

Dashboard Principal

↓

Buscador de rutas (catalogo)
[estructura del catalogo:

  Directorio de rutas
    ↓
Buscador + filtros
    ↓
Coolitoral
    ├── tarjeta B1
    ├── tarjeta B2A
    └── tarjeta B10
    ↓
Sobusa
    ├── tarjeta K54
    ├── tarjeta C10
    └── ...
    ↓
Transmetro
    ├── tarjeta S1
    └── ...
    ]

↓

El usuario ingresa

• Origen
• Destino
• Fecha y hora de salida
• Tipo de transporte (bus, transmetro, etc.)
• Nombre de la empresa
• Nombre del bus o ruta

↓

El sistema analiza la información disponible

↓

Resultados

• Ruta recomendada
• Tiempo aproximado
• Información de la ruta
• Novedades
• Alternativas disponibles

↓

Detalle de la ruta

• Recorrido
• Paradas principales
• Estado de la ruta
• Cambios temporales
• Recomendaciones

↓

Asistente IA

El usuario puede preguntar:

• ¿Qué bus debo tomar?
• ¿Existe una ruta alternativa?
• ¿Hay cierres en mi recorrido?
• ¿Cuál es la mejor opción para llegar?

↓

Notificaciones

• Cambios de rutas
• Cierres viales
• Alertas de movilidad
• Información importante

↓

Perfil del usuario

• Datos personales
• Rutas favoritas
• Historial de consultas
• Configuración

↓

Cerrar sesión


.
├── app
│   └── src
│       ├── App.tsx
│       ├── components
│       │   └── PostSummary.js
│       └── pages
│           ├── Archive.js
│           ├── Create.js
│           ├── Home.js
│           └── Post.js
└── server
    ├── .env
    ├── db
    │   └── conn.mjs
    ├── index.mjs
    ├── loadEnvironment.mjs
    └── routes
        └── posts.mjs