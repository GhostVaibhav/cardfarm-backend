const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json; charset=utf-8'
};

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.CLIENT_CERT
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
        }
    }
    else if (event.httpMethod === "POST") {
        const db = getFirestore();
        const ref = db.collection("cards");
        const doc = await ref.add(JSON.parse(event.body));
        const response = JSON.stringify({ id: doc.id });
        return {
            statusCode: 200,
            body: response,
            headers: {
                ...CORS_HEADERS,
            }
        };
    }
}