import React, { useRef, useState } from 'react';
import { IonIcon, IonButton, IonText } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import './UploadItem.css';

interface UploadProps {
  icon: string;
  title: string;
  description: string;
  isUploaded?: boolean;
  onFileSelect: (file: File | null) => void; // 🔌 Canal de comunicación: Envía el archivo seleccionado al padre
}

const UploadItem: React.FC<UploadProps> = ({ icon, title, description, isUploaded = false, onFileSelect }) => {
  // 1. Creamos una referencia para poder hacerle "clic" al input de HTML mediante código
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 2. Estado interno para recordar y pintar en pantalla el nombre del archivo seleccionado por el usuario
  const [nombreArchivoLocal, setNombreArchivoLocal] = useState<string>('Ningun archivo seleccionado.');

  // Función que simula el clic en el selector real cuando presionas el diseño de Ionic
  const handleGatillarSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 3. Captura el archivo binario apenas el ciudadano lo escoge en su dispositivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const archivoSeleccionado = files[0];
      setNombreArchivoLocal(archivoSeleccionado.name); // Cambia el texto "Ningun archivo..." por "mi_cedula.pdf"
      onFileSelect(archivoSeleccionado); // 🚀 Despacha el archivo hacia el hook useState de la página principal
    } else {
      setNombreArchivoLocal('Ningun archivo seleccionado.');
      onFileSelect(null);
    }
  };

  return (
    <div className="upload-item-box">
      {/* Indicador de Estado Superior Derecho */}
      <div className="status-indicator">
        <IonText className="status-text">{isUploaded ? '' : 'pendiente'}</IonText>
        <IonIcon 
          icon={isUploaded ? checkmarkCircle : 'circle'} 
          className={isUploaded ? 'icon-success' : 'icon-pending'} 
        />
      </div>

      <div className="upload-main-content">
        <div className="upload-icon-container">
          <IonIcon icon={icon} />
        </div>
        <div className="upload-text-container">
          <h4 className="upload-item-title">{title}</h4>
          <p className="upload-item-desc">{description}</p>
        </div>
      </div>

      {/* 🛠️ INPUT NATIVO DE HTML (Invisible): Indispensable para que se abra la ventana de archivos del sistema */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="application/pdf, image/*" // Filtro visual seguro: Solo deja escoger PDFs o imágenes (JPG, PNG)
        onChange={handleFileChange}
      />

      {/* Selector de Archivo Estilo Browser */}
      <div className="file-input-container">
        {/* Le agregamos onClick y cursor pointer a toda la barra para mejorar la usabilidad (UX) */}
        <div className="custom-browser" onClick={handleGatillarSelector} style={{ cursor: 'pointer' }}>
          <span className="browse-label">Browse File</span>
          <span 
            className="file-name-placeholder" 
            style={{ color: nombreArchivoLocal !== 'Ningun archivo seleccionado.' ? '#333' : '#999' }}
          >
            {nombreArchivoLocal}
          </span>
        </div>
        {/* El botón "Subir" ahora reacciona abriendo el explorador de archivos */}
        <IonButton size="small" className="btn-subir" onClick={handleGatillarSelector}>
          Subir
        </IonButton>
      </div>
    </div>
  );
};

export default UploadItem;