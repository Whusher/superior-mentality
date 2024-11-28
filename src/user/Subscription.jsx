import React, { useState, useEffect } from 'react';
import './Subscription.css';
import ContentLA from "../layouts/ContentLA";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { MPEndpoint, CheckSubscriptionEndpoint } from '../utils/EndpointExporter';

const Subscription = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  initMercadoPago('APP_USR-ee749447-f085-4e70-97be-059fd9d0c495');

  useEffect(() => {
    const checkSubscription = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      try {
        const response = await fetch(`${CheckSubscriptionEndpoint}?token=${token}`);
        const data = await response.json();

        if (data.hasSubscription) {
          setSubscriptionInfo({
            startDate: new Date(data.startDate).toLocaleDateString(),
            endDate: new Date(data.endDate).toLocaleDateString(),
          });
        } else {
          setSubscriptionInfo(null);
        }
      } catch (error) {
        console.error('Error al verificar la suscripción:', error);
      }
    };

    checkSubscription();
  }, []);

  const handleSubscribeClick = async () => {
    setIsCheckoutOpen(true);
    await pay();
  };

  const pay = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${MPEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "Suscripción Premium",
          quantity: 1,
          price: 120,
        }),
      });
      const data = await response.json();
      setPreferenceId(data.preference_id);
    } catch (error) {
      console.error('Error al generar la preferencia:', error);
      alert('Error al generar la preferencia. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setPreferenceId(null);
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2 className="subscription-title">Plan de Suscripción</h2>
        <p className="subscription-description">
        Analiza el progreso de tus actividades con gráficos interactivos que muestran el porcentaje de tareas completadas.
        </p>
        {subscriptionInfo ? (
          <div>
            <p className="subscription-status">Suscripción activa desde {subscriptionInfo.startDate} hasta {subscriptionInfo.endDate}</p>
          </div>
        ) : (
          <>
            <p className="subscription-price">$120 / mes</p>
            <button className="subscribe-button" onClick={handleSubscribeClick}>
              Suscribirse Ahora
            </button>
          </>
        )}
      </div>

      {isCheckoutOpen && (
        <div className="checkout-modal">
          <div className="checkout-content">
            <button className="close-button" onClick={handleCloseCheckout}>×</button>
            <h2>Checkout</h2>
            <p>Completa tu compra usando Mercado Pago.</p>
            {preferenceId && <Wallet initialization={{preferenceId: preferenceId}} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ViewSubscription() {
  return <ContentLA child={<Subscription />} />;
}
