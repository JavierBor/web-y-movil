import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonInput,
  IonTextarea,
  IonItem,
  IonList,
  IonText,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  personCircleOutline,
  chevronDownOutline,
  sendOutline,
  closeOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './EnviarAvisos.css';

interface AvisoForm {
  enviarA: string;
  asunto: string;
  mensaje: string;
}

interface FormErrors {
  enviarA?: string;
  asunto?: string;
  mensaje?: string;
}

const EnviarAvisos: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState<AvisoForm>({
    enviarA: '',
    asunto: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.enviarA.trim()) {
      newErrors.enviarA = 'El correo destinatario es requerido.';
    } else if (!validateEmail(form.enviarA.trim())) {
      newErrors.enviarA = 'Ingrese un correo electrónico válido.';
    }

    if (!form.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido.';
    } else if (form.asunto.trim().length < 5) {
      newErrors.asunto = 'El asunto debe tener al menos 5 caracteres.';
    }

    if (!form.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido.';
    } else if (form.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnviar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Simula llamada a la API REST del backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToastMessage('¡Aviso enviado exitosamente!');
      setToastColor('success');
      setShowToast(true);
      setForm({ enviarA: '', asunto: '', mensaje: '' });
      setErrors({});
    } catch {
      setToastMessage('Error al enviar el aviso. Intente nuevamente.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setForm({ enviarA: '', asunto: '', mensaje: '' });
    setErrors({});
    history.goBack();
  };

  return (
    <IonPage className="enviar-avisos-page">
      {/* ── HEADER ── */}
      <IonHeader className="enviar-avisos-header ion-no-border">
        <IonToolbar className="enviar-avisos-toolbar">
          <IonButtons slot="start">
            <IonButton className="back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              <IonLabel>Volver</IonLabel>
            </IonButton>
          </IonButtons>

          <div className="header-brand" slot="start">
            <img
              src="/assets/logo-municipalidad.png"
              alt="Logo Municipalidad"
              className="header-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <IonTitle className="header-title">Enviar Alertas/Avisos</IonTitle>

          <IonButtons slot="end">
            <IonButton className="account-btn">
              <IonIcon icon={personCircleOutline} slot="start" />
              <IonLabel>Admin</IonLabel>
              <span className="account-label">Mi Cuenta</span>
              <IonIcon icon={chevronDownOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ── CONTENT ── */}
      <IonContent className="enviar-avisos-content">
        <div className="form-wrapper">
          <div className="form-card">

            {/* Campo: Enviar a */}
            <div className="field-group">
              <IonLabel className="field-label">Enviar a:</IonLabel>
              <div className={`input-container ${errors.enviarA ? 'input-error' : ''}`}>
                <IonInput
                  className="custom-input"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={form.enviarA}
                  onIonInput={(e) => {
                    setForm({ ...form, enviarA: e.detail.value ?? '' });
                    if (errors.enviarA) setErrors({ ...errors, enviarA: undefined });
                  }}
                  clearInput
                />
              </div>
              {errors.enviarA && (
                <IonText color="danger" className="error-text">
                  <p>{errors.enviarA}</p>
                </IonText>
              )}
            </div>

            {/* Campo: Asunto */}
            <div className="field-group">
              <IonLabel className="field-label">Asunto</IonLabel>
              <div className={`input-container ${errors.asunto ? 'input-error' : ''}`}>
                <IonInput
                  className="custom-input"
                  type="text"
                  placeholder="Escriba el asunto del mensaje"
                  value={form.asunto}
                  onIonInput={(e) => {
                    setForm({ ...form, asunto: e.detail.value ?? '' });
                    if (errors.asunto) setErrors({ ...errors, asunto: undefined });
                  }}
                  clearInput
                />
              </div>
              {errors.asunto && (
                <IonText color="danger" className="error-text">
                  <p>{errors.asunto}</p>
                </IonText>
              )}
            </div>

            {/* Campo: Mensaje */}
            <div className="field-group">
              <IonLabel className="field-label">Mensaje</IonLabel>
              <div className={`textarea-container ${errors.mensaje ? 'input-error' : ''}`}>
                <IonTextarea
                  className="custom-textarea"
                  placeholder="Escriba el contenido del mensaje"
                  value={form.mensaje}
                  rows={6}
                  onIonInput={(e) => {
                    setForm({ ...form, mensaje: e.detail.value ?? '' });
                    if (errors.mensaje) setErrors({ ...errors, mensaje: undefined });
                  }}
                />
              </div>
              {errors.mensaje && (
                <IonText color="danger" className="error-text">
                  <p>{errors.mensaje}</p>
                </IonText>
              )}
            </div>

            {/* Contador de caracteres */}
            <div className="char-counter">
              <span className={form.mensaje.length > 500 ? 'char-limit' : ''}>
                {form.mensaje.length} / 500 caracteres
              </span>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <IonButton
                className="btn-enviar"
                expand="block"
                onClick={handleEnviar}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" className="btn-spinner" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <IonIcon icon={sendOutline} slot="start" />
                    Enviar aviso
                  </>
                )}
              </IonButton>

              <IonButton
                className="btn-cancelar"
                expand="block"
                fill="outline"
                onClick={handleCancelar}
                disabled={loading}
              >
                <IonIcon icon={closeOutline} slot="start" />
                Cancelar
              </IonButton>
            </div>

          </div>
        </div>
      </IonContent>

      {/* Toast de notificación */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color={toastColor}
        position="top"
      />
    </IonPage>
  );
};

export default EnviarAvisos;
