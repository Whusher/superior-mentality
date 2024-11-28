import React from 'react';
import './Subscription.css';
import ContentLA from "../layouts/ContentLA";

function Failure() {
  return (
    <div className="failure-container">
      <div className="failure-content">
        <h1 className="failure-title">Pago Fallido</h1>
        <p className="failure-message">
          Lo sentimos, tu pago no se pudo procesar. Por favor, intenta nuevamente.
        </p>
        <button className="retry-button" onClick={() => window.location.href = '/subscription'}>
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

export default function ViewFailure() {
  return <ContentLA child={<Failure />} />;
}
