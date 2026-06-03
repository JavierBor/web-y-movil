# Entrega Parcial 1 (Tramites online)
Integrantes:
- Diego Álvarez [diego.alvarez.g@mail.pucv.cl]
- Javier Bórquez [javier.borquez.d@mail.pucv.cl]
- Benjamín Soto [benjamin.soto.v@mail.pucv.cl]

---

## Requisitos de sistema

Para garantizar la correcta ejecución del proyecto tener en cuenta los siguientes puntos:

| Herramienta | Versión requerida | Comando para verificar |
|-------------|-------------------|------------------------|
| Node.js     | **18.x o superior** | `node -v` |
| npm         | 9.x o superior    | `npm -v` |

-> Si se usa bajo esta version de node, la aplicación fallara.
-> Node.js 18+ desde [nodejs.org](https://nodejs.org/) o usa `nvm` (Node Version Manager) para cambiar de versión.

## 1. Ejecución del Proyecto (Compilación)

Este proyecto está desarrollado utilizando **Ionic**, **React** y **TypeScript**. A continuación, se detallan los pasos necesarios para compilar y levantar el entorno de desarrollo local.

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu equipo. Además, necesitarás la CLI de Ionic instalada de forma global. Si no la tienes, puedes instalarla ejecutando:
`npm install -g @ionic/cli`

### Pasos para ejecutar la aplicación

**1. Clonar el repositorio y acceder a la carpeta raíz**
Abre tu terminal, clona el repositorio (reemplaza la URL por la tuya) y navega hacia la carpeta del proyecto:
`git clone <URL_DE_TU_REPOSITORIO>`
`cd <NOMBRE_DE_LA_CARPETA>`

**2. Instalar las dependencias**
Una vez dentro de la carpeta raíz del proyecto, instala todas las dependencias necesarias (paquetes de React, Ionic y librerías adicionales) ejecutando:
`npm install`

**3. Levantar el servidor de desarrollo**
Para compilar la aplicación y desplegarla en tu navegador con recarga automática (hot-reload), ejecuta:
`ionic serve`

El sistema compilará el proyecto y la aplicación se abrirá automáticamente en tu navegador por defecto, generalmente en la dirección `http://localhost:8100`.

## 2. Estructura del proyecto

src/
├── assets/                 # Imágenes y recursos estáticos
├── components/             # Componentes reutilizables (CustomHeader, MainCard, etc.)
├── pages/                  # Vistas completas (Login, MenuPrincipal, AdminMenu, etc.)
├── routes/                 #
├── services/               #  
├── theme/                  # Variables CSS globales
├── App.tsx                 # Enrutador principal
├── main.tsx                # Punto de entrada
└── setupTests.ts           # Configuración de pruebas


## 3. Requerimientos Funcionales y No Funcionales

A continuación, se describen los requerimientos identificados para el desarrollo del sistema.

#### Requerimientos Funcionales

| ID | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF1** | Catálogo Dinámico de Trámites | El sistema permite filtrar trámites por sucursal (Edificio Consistorial / Plaza Cabildo). Cada trámite muestra nombre, descripción e ícono. |
| **RF2** | Visualización de Requisitos | Antes de iniciar un trámite, el usuario puede ver la lista completa de documentos necesarios (con iconos y descripciones). |
| **RF3** | Agendamiento de Citas Online | Interfaz con calendario visual (mes actual) y horarios divididos en bloques (mañana/tarde). El usuario selecciona fecha y hora, y confirma la cita. |
| **RF4** | Postulación y Carga de Documentos | Formulario multi‑paso para ingresar datos específicos del trámite (ej. nombre del negocio, RUT del estudiante) y futuramente adjuntar archivos (PDF/JPEG) con validación de tamaño y tipo. |
| **RF5** | Acceso a notificaciones pendientes | El usuario accede a un centro de avisos donde visualiza alertas sobre sus citas, cambios de estado o mensajes del administrador. |
| **RF6** | Seguimiento de Estados (Tracking) | Cada trámite muestra una línea de tiempo (stepper) con etapas: Recibido → En Revisión → Aprobado/Rechazado. Los colores indican el progreso (verde = completado, azul = activo, gris = pendiente). |
| **RF7** | Gestión administrativa | El administrador puede (a) ver lista de todos los trámites pendientes, (b) cambiar su estado (Confirmar/Rechazar), (c) enviar alertas masivas a los ciudadanos (correo y/o notificación interna). |

#### Requerimientos No Funcionales

| ID | Nombre | Descripción |
| :--- | :--- | :--- |
| **RNF1** | Seguridad de Acceso | Todas las contraseñas se almacenan con bcrypt (hash + salt). El intercambio de datos usa JWT con expiración de 24h. Las peticiones a la API solo se aceptan con token válido (rutas protegidas). |
| **RNF2** | Responsividad y Multiplataforma | La interfaz debe ser desarrollada en Ionic con React, garantizando una experiencia de usuario coherente y fluida en navegadores web, sin importar el tamaño de la pantalla. |
| **RNF3** | Estándares de Arquitectura API | El backend debe operar como una API RESTful, utilizando el formato JSON para el intercambio de datos y manejando correctamente los códigos de estado HTTP para cada respuesta. |
| **RNF4** | Integridad de Datos | El sistema debe utilizar una base de datos relacional (PostgreSQL o MySQL) con protección básica contra inyección SQL para garantizar la seguridad de la información de los trámites. |
| **RNF5** | Rendimiento | La aplicación debe cargar la pantalla de inicio (Login) en menos de 2 segundos en una conexión de banda ancha estándar. |
| **RNF6** | Integración futura Clave Única | Preparación para autenticación estatal con OAuth 2.0 / OpenID Connect, utilizando APIs proporcionadas por la municipalidad. |

## 4. Definición del Proyecto y Análisis del Usuario Objetivo (basado en el 1er Estudio de Madurez Digital de Municipalidades y la Ley 21.180)

### Contexto nacional
El 1er Estudio de Madurez Digital de Municipalidades (realizado por Movistar Empresas, Fundación País Digital y Fortinet) reveló que, si bien el 90% de los municipios permite pagar el permiso de circulación en línea, solo el 19% ofrece agendar exámenes de licencia de conducir por internet, generando demoras de hasta 4 meses y alta congestión presencial. Además, apenas el 6% de las municipalidades tiene un plan de transformación digital definido y solo el 16% ha capacitado a su personal en competencias digitales.

La Ley de Transformación Digital del Estado (Ley 21.180) exige que todos los organismos públicos, incluidas las municipalidades, implementen sistemas 100% digitales antes de 2027, eliminando el papel, garantizando interoperabilidad y ciberseguridad.

### Problema especifico de la Municipalidad de Santo Domingo

Actualmente, los ciudadanos de Santo Domingo enfrentan:

- Largas filas presenciales para trámites como patentes municipales, becas y permisos de circulación.

- Falta de transparencia en el estado de sus solicitudes.

- Desconocimiento de requisitos previos (documentos, horarios).

- El personal municipal usa planillas Excel o papel, lo que retrasa las respuestas y dificulta el seguimiento.

Nuestra solución digitaliza el ciclo completo de los trámites más demandados, alineándose con los ejes del estudio: conectividad, soluciones digitales y transformación digital. Proporciona un catálogo por sucursal, agendamiento en línea, carga de documentos, seguimiento visual y panel administrativo para gestionar solicitudes.

### Análisis detallado del usuario objetivo

Perfil Ciudadano:

- Edad: 25‑65 años, nivel educativo diverso.
- Familiaridad con tecnología: media‑baja. Valoran la simplicidad y los pasos guiados.
- Necesidades: resolver trámites rápidamente, sin desplazarse, con instrucciones claras y seguimiento en tiempo real.
- Dificultades: confusión con la nomenclatura de los trámites, olvido de documentos, desconocimiento de requisitos previos.
- Expectativas: recordatorios automáticos, notificaciones de cambios de estado, interfaz intuitiva tanto en móvil como en web.

Perfil Administrador Municipalidad:

- Funcionarios de la Oficina de Partes y Atención al Vecino.
- Necesidades: una bandeja centralizada donde revisar solicitudes, ver documentos adjuntos y actualizar estados (confirmar/rechazar).
- Dificultades: actualmente usan planillas Excel o papel, lo que retrasa las respuestas.
- Expectativas: herramienta intuitiva, avisos automáticos a los ciudadanos, historial completo de cada trámite.

## Prototipo Figma 

- Más de 7 pantallas.
- Versión web solicitada y conversada con el solicitante de la municipalidad.
- Unificación del idioma (todas las etiquetas en español).

**Enlace al Prototipo (Figma):** [Proyecto Web y Móvil - Trámites](https://www.figma.com/proto/DL35jWeIPprjCTITTUBVDe/Proyecto-web-y-movil?node-id=3516-956&p=f&t=mpUIVUan1DObxKIR-0&scaling=min-zoom&content-scaling=fixed&page-id=3315%3A3)

## 5. Arquitectura de Navegación y Estructura

La aplicación usa React Router dentro de IonReactRouter para manejar las rutas. Las vistas se organizan en públicas (Login, Register) y protegidas (el resto). Actualmente, la protección se simula redirigiendo automáticamente desde la raíz (/) al Login. En futuras versiones se añadirá un guard de autenticación basado en JWT.

### 5.1 Definición de Rutas (Añadir archivos faltantes)
Siguiendo la lógica de `App.tsx`, las rutas se dividen en principales (centros de control) y secundarias (pasos de un proceso).

| Tipo | Ruta (Path) | Componente (.tsx) | Acceso | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Principal** | `/Login` | `Login` | Público | Pantalla de entrada al sistema. |
| **Principal** | `/Register` | `Register` | Público | Registro de nuevos usuarios ciudadanos. |
| **Principal** | `/MenuPrincipal` | `MenuPrincipal` | Protegido | Dashboard central del Ciudadano. |
| **Principal** | `/AdminMenu` | `AdminMenu` | Protegido (Admin) | Panel central de administración. |
| **Secundaria** | `/tramites` | `Tramites` | Protegido | Catálogo general de servicios municipales. |
| **Secundaria** | `/mis-tramites` | `MisTramites` | Protegido | Historial y estado de trámites del usuario. |
| **Secundaria** | `/notificaciones`| `MisNotificaciones` | Protegido | Centro de avisos personales del ciudadano. |
| **Secundaria** | `/permiso-circulacion` | `PermisoCirculacion` | Protegido | Trámite específico de Permiso de Circulación. |
| **Secundaria** | `/aseo-tramite` | `AseoTramite` | Protegido | Trámite específico de Aseo Domiciliario. |
| **Secundaria** | `/gestion-tramites`| `GestionTramites` | Protegido (Admin) | Gestión del catálogo de trámites (CRUD). |
| **Secundaria** | `/admin-alerts` | `AdminAlerts` | Protegido (Admin) | Monitor de alertas del sistema. |
| **Secundaria** | `/admin-pendientes` | `GestionTramites` | Protegido (Admin) | Revisión de trámites pendientes (confirmar/rechazar).

### 5.2 Relaciones Jerárquicas entre Vistas (Faltan funcionalidades)
La aplicación se organiza en una estructura de árbol donde el acceso se ramifica desde los centros de control principales:

* **Nivel 1 (Acceso):** `Login` y `Register` (Rutas públicas).
* **Nivel 2 (Nodos Centrales):** `MenuPrincipal` (Ciudadano) y `AdminMenu` (Administrador).
* **Nivel 3 (Funcionalidades):** Desde el menú ciudadano se accede de forma jerárquica a:
    * `Tramites` -> `DetalleTramite` ->  `SubirDocumentos` → `AgendarCita`.

Para la entrega del frontend, decidimos poder cambiar la vista del usuario con la del administrador presionando en el boton "MI CUENTA"

### 5.3 Diferenciación de Roles
* **Ciudadano:** solo puede ver sus propios trámites y notificaciones, y agendar citas.
* **Administrador:** puede ver todos los trámites pendientes, gestionar el catálogo y enviar avisos masivos a traves de `AdminMenu`.

### 5.4 Flujo de Tareas
Se han definido dos flujos principales para garantizar la eficiencia de la interacción:

Flujo ciudadano (agendar un trámite):

1.  Iniciar sesión (`/Login`) → 2. Navegar al menú principal → 3. Seleccionar “Realizar trámite” → 4. Elegir sucursal (filtro) → 5. Hacer clic en “Ver detalles” de un trámite → 6. Leer requisitos → 7. Completar formulario de datos y subir documentos → 8. Seleccionar fecha y hora en el calendario → 9. Confirmar cita → 10. Ver mensaje de éxito y redirección al historial.

Flujo administrador (revisar solicitudes):
   
2.  Iniciar sesión como admin → 2. Elegir “Modo Administrador” (alerta de selección) → 3. Ingresar a `/AdminMenu` → 4. Clic en “Trámites Pendientes” → 5. Ver lista de solicitudes con estado “Pendiente” → 6. Descargar documentos subidos → 7. Elegir “Confirmar cita” o “Rechazar cita” → 8. Confirmar acción en diálogo → 9. El estado se actualiza y el ciudadano recibe notificación.

### 5.5 Puntos Críticos de Interacción
1. Inicio de sesión y registro: validación en tiempo real, mensajes de error claros.
2. Agendamiento de cita: confirmación explícita para evitar reservas accidentales.
3. Carga de documentos: indicador de progreso, validación de formatos y tamaño.
4. Seguimiento de estados: representación visual con colores y leyendas precisas.
5. Acciones administrativas: diálogo de confirmación antes de confirmar/rechazar, feedback inmediato.
6. Envío de avisos: contador de caracteres, botón deshabilitado hasta completar datos válidos, toast de confirmación.

### 5.6 coherencia de experiencia entre dispositivos 
Si bien esta entrega se centra en la versión web, se adoptó un enfoque responsive usando IonGrid, media queries y componentes adaptativos de Ionic. Así, la interfaz se reestructura automáticamente en viewports más pequeños sin necesidad de reescribir código. Esto garantiza una experiencia homogénea en escritorio, tablet y móvil, y facilitará una futura compilación con Capacitor si se requiere una app nativa.

Además:

- Login y registro: validación en tiempo real, mensajes de error claros.
- Agendamiento de cita: confirmación explícita (alerta) antes de guardar.
- Futura carga de documentos: indicador de progreso, límite de tamaño (5 MB), formatos permitidos (PDF, JPG, PNG).
- Seguimiento de estados: uso de colores universales (verde = completado, azul = activo, rojo = error).
- Acciones administrativas: diálogo de confirmación antes de modificar estados, feedback con toast.

### 5.7 Justificación Técnica

- React Router v6 con PrivateRoute y AdminRoute para proteger rutas según rol.
- Redirección automática desde / a /Login y desde rutas no autorizadas a la pantalla de acceso.
- Estructura modular (pages, components, services) que facilita el mantenimiento y la escalabilidad.
- Estructura modular (pages, components, services) que facilita el mantenimiento y la escalabilidad.

### 6. Tecnologías utilizadas
1. Frontend: Ionic 7, React18, TypeScript, Vite.
2. Estilos: CSS personalizados con variables, Flexbox/Grid.
3. Enrutamiento: React Router v5, IonReactRouter.
4. Herramientas: Visual Studio Code, Git, GitHub, Figma.

# Documentación de la Entrega Parcial 2 – Backend, API REST, Autenticación JWT y Pruebas

### Creación del servidor en Node.js con Express

Tecnología utilizada: Node.js + Express.

Archivo principal: `backend/src/server.js`

Características:

- Servidor HTTP en el puerto 3000.
- Configuración de middlewares: cors, express.json(), express.static() para archivos estáticos (/uploads).
- Conexión a PostgreSQL mediante Sequelize (ORM):
-> Modelos: cada archivo en backend/src/models/ (por ejemplo Usuario.js, Sucursal.js, Tramite.js, SolicitudTramite.js) define una clase que extiende de Sequelize.Model y utiliza          sequelize.define().
-> Conexión: en backend/src/config/database.js se crea una instancia de Sequelize pasando la configuración de PostgreSQL.
-> Operaciones: en las rutas (tramiteRoutes.js, authRoutes.js) se usan métodos del ORM como Usuario.findOne(), SolicitudTramite.create(), findAll(), findByPk(), save(), destroy().
-> Sincronización: en server.js se ejecuta sequelize.sync() que crea las tablas a partir de los modelos.
- Sincronización de modelos con sequelize.sync({ alter: false }) (evita cambios automáticos en producción).

Evidencia:

- `backend/package.json` (dependencias: express, cors, sequelize, pg, bcrypt, jsonwebtoken, multer).
- `backend/src/app.js` (configuración de middlewares y rutas).
- `backend/src/server.js` (inicio del servidor y conexión a BD).

### Configuración y modelado de la base de datos relacional

- Sistema gestor: PostgreSQL.
- ORM: Sequelize (permite definir modelos y relaciones).

Diagrama de modelo relacional: 

![Diagrama 1]()
