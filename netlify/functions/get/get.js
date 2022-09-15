const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { app } = require('firebase-admin');

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

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const db = getFirestore();
        const ref = db.collection("cards").doc(event.queryStringParameters.id);
        const doc = await ref.get();
        if (!doc.exists)
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({})
            };
        else
            return {
                statusCode: 200,
                header: headers,
                body: JSON.stringify(doc.data())
            };
    }
}