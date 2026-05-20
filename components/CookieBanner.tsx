"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not already accepted
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="glue-cookie-notification-bar" aria-hidden={!isVisible}>
      <p className="glue-cookie-notification-bar__text">
        We use cookies to analyse our traffic and deliver the best experience. {" "}
        <a href="#" className="glue-cookie-notification-bar__more">
          Read more
        </a>
      </p>
      <button 
        onClick={handleReject}
        className="glue-cookie-notification-bar__reject mr-2"
        style={{ background: 'transparent', color: '#1a73e8', border: '1px solid #1a73e8' }}
      >
        Reject
      </button>
      <button 
        onClick={handleAccept}
        className="glue-cookie-notification-bar__accept"
      >
        Accept
      </button>
    </div>
  );
}
