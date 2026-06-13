// src/App.tsx
// Cambios respecto al original:
//   1. Envuelve todo en <AuthProvider>
//   2. Rutas de usuario → <PrivateRoute>
//   3. Rutas de admin   → <AdminRoute>
//   4. Login y Register siguen siendo <Route> públicas

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

// ── Auth ─────────────────────────────────────────────────────
import { AuthProvider }             from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './routes/ProtectedRoutes';

// ── Páginas ───────────────────────────────────────────────────
import Login                from './pages/Login';
import Register             from './pages/Register';
import MenuPrincipal        from './pages/MenuPrincipal';
import Tramites             from './pages/Tramites';
import DetalleTramite       from './pages/DetalleTramite';
import SubirDocumentos      from './pages/SubirDocumentos';
import AgendarCita          from './pages/AgendarCita';
import MisTramites          from './pages/MisTramites';
import MisNotificaciones    from './pages/MisNotificaciones';
import AseoTramite          from './pages/AseoTramite';
import PermisoCirculacion   from './pages/PermisoCirculacion';
import PlazaCabildoTramites from './pages/PlazaCabildoTramites';
import PatenteMunicipal     from './pages/PatenteMunicipal';
import BecaMunicipal        from './pages/BecaMunicipal';
import AdminMenu            from './pages/AdminMenu';
import GestionTramites      from './pages/GestionTramites';
import EnviarAvisos         from './pages/EnviarAvisos';
import AdminAlerts          from './pages/AdminAlerts';

setupIonicReact();

const App: React.FC = () => (
  // AuthProvider DEBE ser el componente más externo para que
  // useAuth() funcione en CustomHeader, ProtectedRoutes, etc.
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

          {/* Redirección raíz */}
          <Route exact path="/" render={() => <Redirect to="/Login" />} />

          {/* ══════════════════════════════════════
              RUTAS PÚBLICAS — sin autenticación
          ══════════════════════════════════════ */}
          <Route path="/Login"    component={Login}    exact />
          <Route path="/Register" component={Register} exact />

          {/* ══════════════════════════════════════
              RUTAS DE USUARIO
              PrivateRoute → redirige a /Login si no hay sesión activa
          ══════════════════════════════════════ */}
          <PrivateRoute exact path="/MenuPrincipal"      component={MenuPrincipal} />
          <PrivateRoute exact path="/agendar"            component={Tramites} />
          <PrivateRoute exact path="/tramites"           component={Tramites} />
          <PrivateRoute exact path="/detalle-tramite"    component={DetalleTramite} />
          <PrivateRoute exact path="/subir-documentos"   component={SubirDocumentos} />
          <PrivateRoute exact path="/seleccionar-fecha"  component={AgendarCita} />
          <PrivateRoute exact path="/mis-tramites"       component={MisTramites} />
          <PrivateRoute exact path="/mis-notificaciones" component={MisNotificaciones} />

          <PrivateRoute exact path="/tramites/aseo"                component={AseoTramite} />
          <PrivateRoute exact path="/tramites/permiso-circulacion" component={PermisoCirculacion} />

          <PrivateRoute exact path="/PlazaCabildoTramites" component={PlazaCabildoTramites} />
          <PrivateRoute exact path="/PatenteMunicipal"     component={PatenteMunicipal} />
          <PrivateRoute exact path="/BecaMunicipal"        component={BecaMunicipal} />

          {/* ══════════════════════════════════════
              RUTAS DE ADMIN
              AdminRoute → redirige a /Login si no hay sesión
                        → redirige a /MenuPrincipal si rol !== 'admin'
          ══════════════════════════════════════ */}
          <AdminRoute exact path="/AdminMenu"        component={AdminMenu} />
          <AdminRoute exact path="/admin/pendientes" component={GestionTramites} />
          <AdminRoute exact path="/admin/avisos"     component={AdminAlerts} />
          <AdminRoute exact path="/admin/gestion"    component={Tramites} />
          <AdminRoute exact path="/gestion-tramites" component={GestionTramites} />
          <AdminRoute exact path="/EnviarAvisos"     component={EnviarAvisos} />

          {/* Fallback */}
          <Route render={() => <Redirect to="/Login" />} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;