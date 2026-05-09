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

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import MenuPrincipal from './pages/MenuPrincipal';
import Tramites from './pages/Tramites';
import DetalleTramite from './pages/DetalleTramite';
import SubirDocumentos from './pages/SubirDocumentos';
import AdminMenu from './pages/AdminMenu';
import GestionTramites from './pages/GestionTramites';
import EnviarAvisos from './pages/EnviarAvisos';
import MisTramites from './pages/MisTramites';
import MisNotificaciones from './pages/MisNotificaciones';
<<<<<<< HEAD
import AdminAlerts from './pages/AdminAlerts';

=======
import AseoTramite from './pages/AseoTramite';
import PermisoCirculacion from './pages/PermisoCirculacion';
>>>>>>> aa3822fffdb68b93459ab9d4cb10f1e25b8283a6
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas públicas */}
        <Route path="/Login" component={Login} exact />
        <Route exact path="/" render={() => <Redirect to="/Login" />} />
        <Route path="/Register" component={Register} exact />

        {/* Menú usuario */}
        <Route path="/MenuPrincipal" component={MenuPrincipal} exact />
        <Route path="/agendar" component={Tramites} exact />
        <Route path="/detalle-tramite" component={DetalleTramite} exact />
        <Route path="/subir-documentos" component={SubirDocumentos} exact />
        <Route path="/mis-tramites" component={MisTramites} exact />
        <Route path="/tramites" component={Tramites} exact />
        <Route path="/gestion-tramites" component={GestionTramites} exact />
        <Route path="/mis-notificaciones" component={MisNotificaciones} exact />

        {/* Menú admin */}
        <Route path="/AdminMenu" component={AdminMenu} exact />
        <Route path="/admin/gestion" component={Tramites} exact />
        <Route path="/admin/avisos" component={AdminAlerts} exact />
        <Route path="/admin/pendientes" component={GestionTramites} exact />
      </IonRouterOutlet>
        <Route exact path="/tramites/aseo">
          <AseoTramite />
        </Route>
        <Route exact path="/tramites/permiso-circulacion">
          <PermisoCirculacion />
        </Route>
    </IonReactRouter>
  </IonApp>
);

export default App;