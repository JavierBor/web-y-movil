import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuPrincipal from './pages/MenuPrincipal';
import Tramites from './pages/Tramites'; // Tu nueva página
import DetalleTramite from './pages/DetalleTramite';
import SubirDocumentos from './pages/SubirDocumentos';
import AdminMenu from './pages/AdminMenu';
import AgendarCita from './pages/AgendarCita';
import AdminAlerts from './pages/AdminAlerts';
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/Login" component={Login} exact />
        <Route exact path="/" render={() => <Redirect to="/Login" />} />
        <Route path="/Register" component={Register} exact />
        <Route path="/MenuPrincipal" component={MenuPrincipal} exact />
        <Route path="/agendar" component={Tramites} exact />
        <Route path="/AdminMenu" component={AdminMenu} exact /> 
    
        <Route path="/detalle-tramite" component={DetalleTramite} exact />
        <Route path="/subir-documentos" component={SubirDocumentos} exact />
        <Route path="/seleccionar-fecha" component={AgendarCita} exact />
        <Route exact path="/admin/avisos">
          <AdminAlerts />

        </Route>
        

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
