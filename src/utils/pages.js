export const FALLBACK = 'blocking';

export const isCustomPageUri = ( uri ) => {
    const pagesToExclude = [
        '/',
        '/prodotti',
        '/checkout',
        '/cart',
        '/area-clienti',
        '/thank-you',
        '/registrazione',
        '/favicon',
    ];

    return pagesToExclude.includes( uri );
};

export const sanitizeContent = ( content ) => {
    let text = content;
    text.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, 'http://localhost:3000');
    return text;
};