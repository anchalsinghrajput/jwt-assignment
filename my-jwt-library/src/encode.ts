// src/encode.ts
import * as crypto from 'crypto';

// Helper function to manually perform Base64 URL encoding
const encodeBase64Url = (input: string): string => {
    let base64 = Buffer.from(input, 'utf8').toString('base64');
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
    return base64.replace(/=+$/, ''); // Remove padding
};

// JWT encoding function
export const encode_jwt = (
    secret: string,
    id: string | number,
    payload: object,
    ttl?: number
): string => {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresAt = ttl ? currentTime + ttl : null;
    const body = JSON.stringify({ ...payload, id, exp: expiresAt, iat: currentTime });

    // Encode header and body
    const headerEncoded = encodeBase64Url(header);
    const bodyEncoded = encodeBase64Url(body);

    // Create signature
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${headerEncoded}.${bodyEncoded}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Return JWT
    return `${headerEncoded}.${bodyEncoded}.${signature}`;
};
