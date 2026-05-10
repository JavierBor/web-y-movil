# Entrega Parcial 1 (Tramites online)
Integrantes:
- Diego Álvarez [diego.alvarez.g@mail.pucv.cl]
- Javier Bórquez [javier.borquez.d@mail.pucv.cl]
- Benjamín Soto [benjamin.soto.v@mail.pucv.cl]

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
├── theme/                  # Variables CSS globales
├── App.tsx                 # Enrutador principal
├── main.tsx                # Punto de entrada
└── setupTests.ts           # Configuración de pruebas

## 3. Requerimientos Funcionales y No Funcionales

A continuación, se describen los requerimientos identificados para el desarrollo del sistema.

#### Requerimientos Funcionales

| ID | Nombre | Descripción |
| :--- | :--- | :--- |
| **RF1** | Catálogo Dinámico de Trámites | El sistema permitirá buscar y filtrar trámites por sucursal (ej. Edificio Plaza Cabildo). |
| **RF2** | Visualización de Requisitos | El usuario podrá ver la lista detallada de documentos necesarios antes de iniciar un trámite. |
| **RF3** | Agendamiento de Citas Online | Interfaz de calendario para seleccionar fecha y bloques horarios (Mañana/Tarde) para atención presencial. |
| **RF4** | Postulación y Carga de Documentos | Formulario para ingresar datos personales y adjuntar archivos (Cédula de Identidad Frontal/Reverso). |
| **RF5** | Acceso a notificaciones pendientes | El usuario recibirá alertas alertas y avisos sobre sus citas y trámites. |
| **RF6** | Seguimiento de Estados (Tracking) | Visualización del progreso del trámite mediante una línea de tiempo (Recibido, En Revisión, Aprobado, etc.). 
| **RF7** | Gestión administrativa | El administrador podrá Confirmar/Rechazar trámites y enviar alertas o avisos en tiempo real. |

#### Requerimientos No Funcionales

| ID | Nombre | Descripción |
| :--- | :--- | :--- |
| **RNF1** | Seguridad de Acceso | El sistema debe implementar autenticación mediante JWT (JSON Web Tokens) y asegurar que todas las contraseñas sean almacenadas usando un hash con bcrypt para protección de credenciales. |
| **RNF2** | Responsividad y Multiplataforma | La interfaz debe ser desarrollada en Ionic con React, garantizando una experiencia de usuario coherente y fluida en navegadores web, sin importar el tamaño de la pantalla. |
| **RNF3** | Estándares de Arquitectura API | El backend debe operar como una API RESTful, utilizando el formato JSON para el intercambio de datos y manejando correctamente los códigos de estado HTTP para cada respuesta. |
| **RNF4** | Integridad de Datos | El sistema debe utilizar una base de datos relacional (PostgreSQL o MySQL) con protección básica contra inyección SQL para garantizar la seguridad de la información de los trámites. |
| **RNF5** | Integración futura Clave Única | Preparación para autenticación estatal con OAuth 2.0 / OpenID Connect, utilizando APIs proporcionadas por la municipalidad. |

## 4. Definición del Proyecto

### 4.1 Justificación del Problema
La digitalización de trámites municipales responde a la necesidad de reducir las barreras burocráticas y las largas filas presenciales en la Municipalidad de Santo Domingo. El sistema permite centralizar la gestión de documentos, agendamiento de citas y seguimiento de estados, mejorando la transparencia y eficiencia en la atención al ciudadano.

### 4.2 Análisis del Usuario Objetivo
El sistema está diseñado para dos perfiles principales:
1.  **Ciudadano:** Personas que necesitan realizar trámites municipales de forma remota, con poco tiempo disponible y que buscan una interfaz intuitiva tanto en móvil como en web.
2.  **Administrador Municipal:** Personal encargado de la gestión interna, revisión de documentos y actualización del catálogo de trámites.

* **Enlace al Prototipo (Figma):** [Proyecto Web y Móvil - Trámites](https://www.figma.com/proto/DL35jWeIPprjCTITTUBVDe/Proyecto-web-y-movil?node-id=3569-2&t=RzJ9EIYChqhZK2EX-1&scaling=min-zoom&content-scaling=fixed&page-id=3315%3A3)

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

### 5.4 Flujo de Tareas (Revisar Flujo Administrativo)
Se han definido dos flujos principales para garantizar la eficiencia de la interacción:

1.  **Flujo Ciudadano (Reserva de Trámite):**
    `Login` → `MenuPrincipal` → `Tramites` → `DetalleTramite`  → `SubirDocumentos` → `AgendarCita`.
2.  **Flujo Administrativo:**
    `Login` → `MenuPrincipal` → `Acceso Mi Cuenta` → `AdminMenu`.

### 5.5 Puntos Críticos de Interacción
1. Inicio de sesión y registro: validación en tiempo real, mensajes de error claros.
2. Agendamiento de cita: confirmación explícita para evitar reservas accidentales.
3. Carga de documentos: indicador de progreso, validación de formatos y tamaño.
4. Seguimiento de estados: representación visual con colores y leyendas precisas.
5. Acciones administrativas: diálogo de confirmación antes de confirmar/rechazar, feedback inmediato.
6. Envío de avisos: contador de caracteres, botón deshabilitado hasta completar datos válidos, toast de confirmación.


### 5.6 coherencia de experiencia entre dispositivos (Falta esto)
Si bien esta entrega se centra en la versión web, se adoptó un enfoque responsive usando IonGrid, media queries y componentes adaptativos de Ionic. Así, la interfaz se reestructura automáticamente en viewports más pequeños sin necesidad de reescribir código. Esto garantiza una experiencia homogénea en escritorio, tablet y móvil, y facilitará una futura compilación con Capacitor si se requiere una app nativa.

### 5.7 Justificación Técnica
La arquitectura modular (pages, components) y el uso de React Router con IonReactRouter proporcionan un enrutamiento declarativo y eficiente. Se implementó **redirección automática** al Login desde la raíz. Los componentes reutilizables (CustomHeader, MainCard, PageLayout) estandarizan la apariencia y reducen la duplicación de código. Las variables CSS (:root) permiten cambiar la paleta de colores de forma centralizada y preparan el proyecto para un eventual tema oscuro.

### 6. Tecnologías utilizadas
1. Frontend: Ionic 7, React18, TypeScript, Vite.
2. Estilos: CSS personalizados con variables, Flexbox/Grid.
3. Enrutamiento: React Router v5, IonReactRouter.
4. Herramientas: Visual Studio Code, Git, GitHub, Figma.
 
