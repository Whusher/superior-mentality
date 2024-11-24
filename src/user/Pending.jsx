import React from 'react';
import './Subscription.css';
import ContentLA from "../layouts/ContentLA";

function Pending() {
  return (
    <div className="pending-container">
      <div className="pending-content">
        <h1 className="pending-title">Pago Pendiente</h1>
        <p className="pending-message">
          Tu pago está en proceso. Por favor, espera mientras confirmamos el pago. Si el problema persiste, Vuelve a intentarlo por favor.
        </p>
        <button className="retry-button" onClick={() => window.location.href = '/subscription'}>
          Volver a Intentar
        </button>
      </div>
    </div>
  );
}

export default function ViewPending() {
  return <ContentLA child={<Pending />} />;
}
