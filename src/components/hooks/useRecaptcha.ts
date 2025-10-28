// hooks/useRecaptcha.ts
import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export const useRecaptcha = () => {
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadRecaptcha = () => {
            // Vérifier si déjà chargé
            if (window.grecaptcha) {
                setRecaptchaLoaded(true);
                return;
            }

            const script = document.createElement('script');
            // SUPPRIMEZ dotenv et utilisez directement process.env
            script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('✅ reCAPTCHA chargé avec succès');
                setRecaptchaLoaded(true);
            };
            script.onerror = () => {
                console.error('❌ Erreur chargement reCAPTCHA');
                setRecaptchaLoaded(false);
            };
            document.head.appendChild(script);
        };

        loadRecaptcha();
    }, []);

    const getRecaptchaToken = useCallback(async (action: string = 'submit'): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!window.grecaptcha) {
                reject(new Error("reCAPTCHA non chargé"));
                return;
            }

            window.grecaptcha.ready(async () => {
                try {
                    const token = await window.grecaptcha.execute(
                        process.env.REACT_APP_RECAPTCHA_SITE_KEY, 
                        { action }
                    );
                    console.log('🔐 Token reCAPTCHA généré:', token ? 'OUI' : 'NON');
                    resolve(token);
                } catch (error) {
                    console.error('❌ Erreur génération token reCAPTCHA:', error);
                    reject(error);
                }
            });
        });
    }, []);

    return {
        recaptchaLoaded,
        getRecaptchaToken,
        loading: loading,
        setLoading
    };
};