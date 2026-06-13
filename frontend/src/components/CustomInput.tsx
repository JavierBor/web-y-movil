import React from 'react';
import { IonInput, IonLabel } from '@ionic/react';
import './CustomInput.css';

interface CustomInputProps {
  label: string;
  value: string;
  onIonChange: (val: string) => void;
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
}

function CustomInput({ label, value, onIonChange, type = "text", placeholder }: CustomInputProps) {
  return (
    <div className="custom-input-group">
      <IonLabel position="stacked" className="custom-input-label">{label}</IonLabel>
      <IonInput 
        type={type}
        placeholder={placeholder}
        value={value}
        onIonChange={e => onIonChange(e.detail.value!)}
        className="muni-input-field"
      />
    </div>
  );
}

export default CustomInput;