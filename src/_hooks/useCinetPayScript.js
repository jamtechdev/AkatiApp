import { useEffect } from 'react';

const useCinetPayScript = (clientId) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://cdn.cinetpay.com/seamless/main.js`;
        script.async = true;
        script.onload = () => {
            if (typeof window !== 'undefined' && window.paypal) {
                console.log('Cinetpay SDK loaded');
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [clientId]);
};

export default useCinetPayScript;
