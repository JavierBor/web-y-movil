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
| Docker Desktop | Última Ver. | docker-compose up --build (construir imagenes) |



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
Además de tener instalado Docker Desktop, comandos utiles:

| Comando | Descripción | 
|-------------|-------------------|
| docker-compose up --build    | Construye imágenes y levanta contenedores (modo interactivo) |
| docker-compose up -d --build    | Ídem, pero en segundo plano (modo detached) | 
| docker-compose down | Detiene y elimina contenedores (mantiene volúmenes) |
| docker-compose down -v | Detiene, elimina contenedores y borra volúmenes (pierdes datos de BD) | 
| docker-compose logs -f backend | Ver logs en tiempo real del backend |
| docker-compose logs -f frontend | Ver logs en tiempo real del frontend | 
| docker-compose ps | Ver estado de los servicios |

### Pasos para ejecutar la aplicación

**Caso Docker:**

**1. Instalar Docker**
- Descargar instalador de Docker -> https://www.docker.com/products/docker-desktop/
- Ejecutar instalador y seguir las instrucciones.
- Aparece con un icono de ballena.

**2. Obtener código proyecto**
- Abre una terminal (PowerShell en Windows, Terminal en Mac).
- Clona el repositorio (reemplaza la URL si es privada):
```
git clone https://github.com/JavierBor/web-y-movil.git
cd web-y-movil
```
**3. Levantar Docker**
- Asegúrate de que Docker Desktop esté abierto y funcionando.
- En la terminal (dentro de la carpeta web-y-movil), ejecuta:
`
docker-compose up --build

**4. Usar la aplicación**

- Una vez que veas mensajes como:
```
Servidor corriendo en http://localhost:3000
```
- Abre tu navegador y ve:
    - Frontend: http://localhost:8080
    - Backend (API): http://localhost:3000 (deberías ver "Servidor Express corriendo correctamente")
- Regístrate o inicia sesión con las credenciales adecuadas. 

**5. Detener la aplicación**
- En la terminal donde está corriendo docker-compose up, presiona Ctrl + C para detener los contenedores.
- Luego ejecuta: 
```
docker-compose down
``` 

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


# Entrega final

## 1. Implementación de funcionalidades completas

En esta fase final, el sistema ha consolidado su lógica de negocio transaccional, logrando una integración completa de extremo a extremo (End-to-End) entre el Frontend (Ionic/React) y el Backend (Node.js/Express + PostgreSQL). Se han programado y desplegado las funcionalidades *core* que resuelven de forma real las problemáticas planteadas.

A continuación, se detallan los módulos principales completados y operativos en su totalidad:

###  Módulo de Documentación y Carga de Archivos (Ciudadano)
* **Descripción:** Permite a los vecinos adjuntar y enviar la documentación requerida para formalizar sus trámites (por ejemplo, certificados de alumno regular para la Beca Municipal o padrón del vehículo para el Permiso de Circulación).
* **Detalles Técnicos:** Uso de los componentes `SubirDocumentos.tsx` y `UploadItem.tsx` en el frontend, que gestionan los estados de carga y validaciones visuales. Procesamiento en el backend mediante el middleware `Multer` para la captura segura de archivos, almacenando las referencias directas en la base de datos (columna `datos_extra` / enlaces asociados) y vinculándolas estrictamente al registro del trámite y al `usuario_id`.

###  Módulo de Auditoría y Gestión de Documentos (Administrador)
* **Descripción:** Panel especializado que dota al cuerpo administrativo municipal de herramientas para revisar minuciosamente las solicitudes recibidas.
* **Detalles Técnicos:** Implementado en la vista `GestionTramites.tsx`. El administrador cuenta con un flujo CRUD completo donde puede listar todas las solicitudes pendientes de la comuna, deserializar los metadatos variables de cada trámite y **visualizar/revisar de forma independiente los archivos adjuntos** cargados por el ciudadano para su aprobación o rechazo en tiempo real.

###  Módulo de Notificaciones y Alertas del Portal
* **Descripción:** Sistema de comunicación reactivo diseñado para mantener al ciudadano informado sobre el estado de sus trámites en curso y emitir comunicados importantes de la comuna.
* **Detalles Técnicos:**
  * **Seguimiento Individual:** Vistas reactivas en `MisNotificaciones.tsx` y `MisTramites.tsx` que leen directamente los cambios de estado (Aprobado/Rechazado/Pendiente) gatillados por las acciones del administrador.
  * **Avisos Masivos:** Herramienta administrativa (`EnviarAvisos.tsx` / `AdminAlerts.tsx`) que permite la redacción y emisión de avisos generales dirigidos a todos los usuarios del sistema (ej: cierres de sucursal por mantención o llamados a postulación).

---

###  Resumen de Cumplimiento del CRUD y Flujo de Datos
El circuito transaccional del sistema se ejecuta sin dependencias estáticas o datos simulados (*mockups*):
1. **Create (POST):** El ciudadano agenda su cita o postula a un beneficio enviando el formulario con sus archivos adjuntos (`/api/tramites`).
2. **Read (GET):** El ciudadano visualiza su historial y notificaciones; el Administrador lista globalmente las solicitudes y descarga los archivos adjuntos (`/api/tramites`).
3. **Update (PUT):** El Administrador actualiza el estado del trámite tras auditar la documentación o modifica la disponibilidad horaria de las oficinas.
4. **Delete (DELETE):** Permite la cancelación de solicitudes vigentes o la depuración de registros según las reglas de negocio.

---
## 2. Mejoras avanzadas en la UI/UX y optimización del rendimiento (EF 2)

Para cumplir con una experiencia de usuario fluida, responsiva y adaptada a las necesidades del ecosistema municipal, se implementaron las siguientes mejoras en la interfaz:

* **Componentes de Carga Interactivos (Subir Archivos):** Se diseñó una experiencia guiada permitiendo que el usuario sea capaz de subir archivos
* **Consistencia de Flujos de Extremo a Extremo (End-to-End):** Se realizó una revisión exhaustiva de consistencia en todas las rutas de navegación de la aplicación, garantizando que tanto el flujo del ciudadano (desde el catálogo guiado hasta la confirmación explícita) como el del administrador operen bajo una misma línea gráfica, predictibilidad y coherencia cognitiva. 
* **Optimización de Tiempos de Respuesta:** El uso de empaquetado optimizado mediante **Vite** en combinación con llamadas asíncronas no bloqueantes en el Frontend garantiza que los componentes esenciales de la aplicación (como el Login y el Catálogo) carguen en menos de 2 segundos.

## 3. Implementación de seguridad avanzada en API (EF 3)

Para garantizar la integridad del sistema y resguardar la información confidencial de los ciudadanos, la API REST construida en Node.js/Express implementa múltiples capas de seguridad avanzada, mitigando los riesgos informáticos más comunes descritos en el estándar OWASP Top 10.

###  Mitigación de Inyección SQL (SQL Injection) mediante Consultas Parametrizadas
* **Mecanismo:** La persistencia y comunicación con la base de datos PostgreSQL se gestiona mediante el ORM **Sequelize**, prohibiendo de manera estricta la construcción de queries mediante concatenación directa de strings de texto.
* **Detalle Técnico:** Sequelize implementa de forma nativa la **parametrización y sanitización automática de variables** (Prepared Statements). Cuando un usuario ingresa datos en los formularios de Ionic (como el RUT o datos variables del trámite), los valores se envían disociados de la estructura del comando SQL. Cualquier intento de inyectar código malicioso es interpretado por el motor de la base de datos como un simple string literal inofensivo y no como una instrucción ejecutable.

###  Configuración de CORS Seguro (Cross-Origin Resource Sharing)
* **Mecanismo:** Para evitar que scripts maliciosos alojados en dominios de terceros apunten e interactúen con nuestra API, se configuró el middleware oficial `cors` en el servidor Express.
* **Detalle Técnico:** Se restringe el acceso limitando los métodos HTTP permitidos (`GET`, `POST`, `PUT`, `DELETE`) y definiendo explícitamente una lista blanca (*whitelist*) de orígenes autorizados, incluyendo `http://localhost:8080` (puerto del frontend en entorno Dockerizado) y `http://localhost:8100` (entorno local). Peticiones provenientes de dominios no autorizados son rechazadas de inmediato a nivel de red por el servidor.

###  Encriptación de Credenciales con Bcrypt
* **Mecanismo:** Siguiendo las directrices de seguridad de la industria, las contraseñas de los usuarios jamás se almacenan en texto plano en PostgreSQL.
* **Detalle Técnico:** Durante el flujo de registro (`/api/auth/register`), el backend intercepta la contraseña y le aplica una función hash criptográfica utilizando la librería **bcrypt**, aplicando un factor de costo computacional (Salt). Al iniciar sesión, el sistema utiliza `bcrypt.compare()` para contrastar la contraseña ingresada contra el hash guardado, haciendo inviable la ingeniería inversa o la lectura de contraseñas en caso de una filtración.

###  Protección de Cabeceras con Helmet
* **Mecanismo:** Integración de la librería `helmet()` como middleware de cabeceras HTTP seguras en Express. Esto blinda la API ocultando la firma del servidor web (como `X-Powered-By`), mitigando ataques de Cross-Site Scripting (XSS) y Clickjacking directamente en el navegador del cliente.

---
## 4. Optimización de consultas y eficiencia de respuesta (EF 4)

El backend de la aplicación ha sido diseñado bajo estrictos estándares de rendimiento relacional, optimizando la comunicación con el motor PostgreSQL para garantizar transacciones concurrentes eficientes y respuestas ligeras en el cliente:

* **Mitigación del Problema de Rendimiento $N+1$ (Eager Loading):** En el endpoint crítico de administración `GET /api/tramites`, el sistema rechaza la ejecución de múltiples consultas iterativas a la base de datos. En su lugar, utiliza la estrategia de carga asociativa de Sequelize mediante la cláusula `include`, acoplando el modelo `Usuario` al de `SolicitudTramite`. Esto resuelve la obtención global de solicitudes y los metadatos de los ciudadanos en una **única consulta indexada** (`LEFT OUTER JOIN`), reduciendo drásticamente la latencia en el servidor.
* **Proyección Selectiva de Atributos y Privacidad:** En estricta alineación con la eficiencia de red, las consultas hacia el modelo `Usuario` restringen la transferencia de datos especificando únicamente campos necesarios en el payload (`attributes: ['rut', 'nombre_usuario', 'correo']`). Esto no solo aligera los paquetes JSON que viajan por HTTP, sino que previene de raíz la exposición de metadatos innecesarios o hashes de credenciales críticas del sistema.
* **Uso Eficiente de Estructuras Dinámicas con `JSONB`:** La persistencia de los datos variables y específicos de cada tipo de formulario municipal (ej. rubro de patentes o datos escolares de becas) se delega a la columna `datos_extra`. Al operar bajo el tipo de dato nativo `JSONB` de PostgreSQL, el servidor procesa y serializa los campos de manera eficiente como objetos binarios indexables en disco, evitando complejas uniones de tablas adicionales o reestructuraciones del esquema relacional.
* **Validación de Estados en Memoria:** Antes de procesar inserciones pesadas en la base de datos (como la carga en disco del middleware Multer), el endpoint `POST /api/tramites` realiza un filtro preventivo mediante `findOne` para verificar si el ciudadano ya cuenta con registros duplicados en estado `'Pendiente'`, deteniendo el flujo de forma inmediata y liberando recursos de procesamiento tempranamente si la regla de negocio no se cumple.

## 4. Integración con algún servicio externo (EF 5)

El sistema automatiza la comunicación asíncrona hacia el exterior mediante la integración de la API con servicios de mensajería masiva e institucional provistos por terceros.

* **Servicio Utilizado:** Servidor SMTP Seguro de **Google (Gmail API Integration)**.
* **Librería de Abstracción:** **Nodemailer** incorporado en el entorno Node.js.
* **Detalle de Implementación:** Desde la pantalla de administración (`AdminAlerts.tsx`), el gestor municipal puede redactar y emitir un comunicado importante. Al accionar el botón, Axios despacha el payload hacia la ruta autenticada de la API. El backend levanta un objeto `transporter` seguro encriptado con TLS, consume las credenciales inyectadas desde las variables de entorno del archivo compilado, traduce la información a una plantilla HTML responsiva con la marca corporativa municipal y despacha en tiempo real la notificación directa a la bandeja de entrada del correo personal del vecino contribuyente.

---

## 5. Despliegue con Docker (EF 6)

Para asegurar la portabilidad y la reproducibilidad exacta del entorno (evitando problemas de dependencias locales), toda la arquitectura se encuentra empaquetada, aislada y orquestada dentro de contenedores independientes mediante **Docker Compose**.

### Componentes de la infraestructura Docker:
1. **Contenedor `tramites_db` (PostgreSQL 15 Alpine):** Base de datos relacional aislada con persistencia montada en un volumen independiente (`postgres_data`).
2. **Contenedor `tramites_backend` (Node.js 18 Alpine):** Levanta la API Express expuesta hacia el host en el puerto `3000`. Recibe de manera segura las variables de entorno para su comunicación interna con la BD y el servidor de Nodemailer.
3. **Contenedor `tramites_frontend` (Ionic 7 / React Alpine):** Compila la SPA optimizada y la sirve bajo un servidor web mapeado y expuesto hacia la máquina local en el puerto de producción externo **`8080`**.

### Comandos de Control de Infraestructura:
* **Encender y compilar la arquitectura completa:**
```bash
  docker compose up -d --build

