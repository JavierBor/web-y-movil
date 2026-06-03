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

Asegúrate de tener instalado pgAdmin4 y haber creado la base de datos llamada tramites_db.

Luego, abre el archivo de configuración en tu entorno de desarrollo siguiendo la ruta: backend/config/database.js

Dentro de este archivo, modifica las credenciales (usuario y contraseña) correspondientes a tu servidor local de PostgreSQL, tal como se muestra en el siguiente bloque de código:

```
const sequelize = new Sequelize('tramites_db', 'tu_usuario', 'tu_contraseña', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false // Evita saturar la consola con mensajes de SQL
});
```

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

A continuación, se describen los requerimientos identificados para el desarrollo del sistema, en los que participan los roles de usuario y administrados.

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

![Diagrama 1](https://github.com/JavierBor/web-y-movil/blob/main/otros/MR.jpeg)

Relaciones: 
- usuarios (1) → (N) solicitudes_tramites (un usuario puede tener muchas solicitudes).
- sucursales (1) → (N) solicitudes_tramites (una sucursal puede recibir muchas solicitudes).
- tramites (1) → (N) solicitudes_tramites (un tipo de trámite puede tener muchas solicitudes).

Validación de integridad:

- Claves foráneas con ON DELETE CASCADE (se eliminan solicitudes al borrar un usuario o sucursal).
- datos_extra es de tipo JSONB, permite almacenar datos variables según el tipo de trámite (patentes, becas, etc.).
- tipo_tramite es un string que identifica la naturaleza del trámite (ej. 'patente', 'beca', 'permiso_circulacion').

### Desarrollo de API REST con endpoints básicos

Base URL: http://localhost:3000/api

Endpoints implementados:


| Método |	Ruta |	Descripción | Códigos HTTP posibles	| Autenticación |
| :--- | :--- | :--- | :--- | :--- |
| POST |	/auth/register |	Registro de un nuevo usuario (ciudadano). |	201 (Creado), 400 (Datos inválidos o correo duplicado), 500 (Error servidor) |	Pública |
| POST |	/auth/login	| Inicio de sesión. Devuelve token JWT y datos del usuario. |	200 (OK), 401 (Credenciales incorrectas), 500 (Error servidor) |	Pública |
| GET	| /tramites	| Lista todas las solicitudes de trámites (solo administradores). |	200 (OK), 403 (No autorizado), 500 (Error servidor) |	JWT + rol admin |
| POST |	/tramites |	 Crea una nueva solicitud de trámite (ciudadano autenticado). |	201 (Creado), 400 (Datos inválidos), 401 (No autenticado), 500 (Error servidor) | JWT (cualquier rol) |
| GET	| /tramites/usuario/:usuario_id |	Obtiene todas las solicitudes de un usuario específico (solo el propio usuario o admin). |	200 (OK), 403 (No autorizado), 404 (Usuario no encontrado), 500 (Error servidor) |	JWT |
| PUT	| /tramites/:id |	Actualiza el estado de una solicitud (solo administradores). |	200 (OK), 403 (No autorizado), 404 (Solicitud no existe), 500 (Error servidor) |	JWT + rol admin |
| DELETE |	/tramites/:id |	Elimina una solicitud (el propio ciudadano o administrador). |	200 (OK), 403 (No autorizado), 404 (No encontrada),500 (Error servidor) |	JWT + rol admin |

Ejemplo de respuesta:

```
{
  "ok": true,
  "mensaje": "Usuario registrado con éxito en la base de datos",
  "usuario": { "id": 1, "name": "Diego Álvarez" }
}
```

###  Consumo de la API REST desde Ionic + React (Axios)

Configuración de Axios:
Archivo frontend/src/services/api.ts

- Interceptores de petición: añaden automáticamente el token JWT al header Authorization: Bearer <token>.
- Interceptores de respuesta: capturan errores 401 (token inválido/expirado) y redirigen a /Login.

Ejemplo de uso:
```
const payload = {
  sucursal_id: 2,
  tramite_id: 4,
  tipo_tramite: 'patente',
  datos_extra: { nombre_negocio, rubro, direccion_comercial, tipo_patente }
};
const response = await API.post('/tramites', payload);
```

Manejo de errores:
Se muestra un IonAlert con el mensaje devuelto por el backend o un error genérico de conexión.

### Implementación de autenticación con JWT

-> Formularios de registro e inicio de sesión:
- Register.tsx: captura nombre, RUT, correo, región, comuna, contraseña y confirmación. Envía a /auth/register.
- Login.tsx: captura correo y contraseña. Envía a /auth/login. Al recibir el token, lo guarda en localStorage y en el contexto AuthContext.
- Redirección por roles: Si el usuario es admin, muestra un IonAlert para elegir modo (ciudadano/admin). Si es ciudadano, va directamente a /MenuPrincipal.

-> Rutas protegidas en frontend:
- PrivateRoute: componente que verifica la existencia de un token válido. Si no, redirige a /Login.
- AdminRoute: además del token, comprueba que rol === 'admin'. Si no, redirige a /MenuPrincipal.
- Uso en App.tsx:
```
<Route path="/MenuPrincipal" element={<PrivateRoute><MenuPrincipal /></PrivateRoute>} />
<Route path="/AdminMenu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
```

-> Generación y validación de JWT:
- Generación: en `backend/src/routes/authRoutes.js`, al validar credenciales, se crea un token con `jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: '24h' })`.
- Validación en backend: middleware verificarToken (en authMiddleware.js) extrae el token del header, lo verifica y decodifica, inyectando req.usuario. El middleware verificarAdmin comprueba el rol.
- Protección de rutas API: las rutas sensibles usan verificarToken y/o verificarAdmin.

-> Diferenciación por roles:

- En el frontend, AdminRoute y PrivateRoute segregan el acceso.
- En el backend, los endpoints como GET /tramites solo son accesibles para admin.
- El menú "Mi Cuenta" muestra opción de cambiar de modo solo si el usuario tiene rol admin.

###  Validación de usuarios y manejo de sesiones

-> Validación de inputs (frontend):
- En Register.tsx: se verifica que todos los campos obligatorios estén completos, que las contraseñas coincidan y que la contraseña tenga al menos 6 caracteres.
- En Login.tsx: se valida que ambos campos no estén vacíos.
- En formularios de trámites: se validan campos específicos (ej. nombre del negocio, RUT, etc.) antes de enviar.
-> Hash de contraseñas con bcrypt:
- En `backend/src/routes/authRoutes.js`, al registrar, se genera un hash con `bcrypt.hash(contrasena, 10)` y se guarda en la columna `contrasena_hash`.
- Al iniciar sesión, se compara la contraseña ingresada con el hash usando bcrypt.compare.
-> Manejo seguro de credenciales:
- Las contraseñas nunca se almacenan en texto plano.
- El token JWT se guarda en localStorage (para persistencia) y se envía en cada petición mediante el interceptor de Axios.
- El servidor valida el token en cada petición protegida.
-> Protección básica contra inyección SQL:
- Sequelize (ORM) utiliza consultas parametrizadas, lo que previene inyección SQL.
- No se concatenan strings para construir consultas SQL.

### Pruebas funcionales (Postman)

-> Pruebas realizadas en Postman:


|Endpoint	| Método	| Resultado esperado	| Evidencia |
| :--- | :--- | :--- | :--- |
|POST /auth/register	 |POST |	201 Created |	Imagen (registro exitoso) |
|POST /auth/login	| POST |	200 OK + token |	Imagen  (token JWT) |
|POST /tramites	| POST |	201 Created |	Imagen  (solicitud creada) |
|PUT /tramites/2	| PUT |	200 OK (estado actualizado) |	Imagen (cambio a "Aprobado") |
|GET /tramites	| GET |	200 OK + lista |	Imagen (solicitudes con datos de usuario) |

![Img Register](https://github.com/JavierBor/web-y-movil/blob/main/otros/Register.jpeg)

![Img Login](https://github.com/JavierBor/web-y-movil/blob/main/otros/Login.jpeg)

![Img CreacionTramites](https://github.com/JavierBor/web-y-movil/blob/main/otros/CreacionTramite.jpeg)

![Img ConfirmnTramites](https://github.com/JavierBor/web-y-movil/blob/main/otros/ConfirmarRechazarTramite.jpeg)

![Img ObtenerTramite](https://github.com/JavierBor/web-y-movil/blob/main/otros/ObtenerTramites.jpeg)

Estas imagenes demuestran:
- Registro exitoso.
- Login con obtención de token.
- Creación de solicitud con datos en JSON.
- Actualización de estado (aprobación).
- Listado de trámites con datos anidados del usuario.
