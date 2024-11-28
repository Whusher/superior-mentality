import React, { useEffect } from 'react';
import './Subscription.css';
import ContentLA from "../layouts/ContentLA";
import { PaySaveEndpoint } from '../utils/EndpointExporter';

const ThankYou = () => {
  useEffect(() => {
    const saveSubscription = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error("No se encontró el token de usuario");
        return;
      }

      try {
        const response = await fetch(`${PaySaveEndpoint}?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              subscription_type: 'Mensual',
              amount: 120.00,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Error al guardar la suscripción');
        }

        console.log('Suscripción guardada exitosamente');
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    saveSubscription();
  }, []);

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <h2 className="thankyou-title">¡Gracias por suscribirte!</h2>
        <p className="thankyou-message">
          Ahora podrás recibir tus documentos en formato PDF directamente en tu correo.
        </p>
      </div>
    </div>
  );
};

export default function ViewThankYou() {
  return <ContentLA child={<ThankYou />} />;
}
