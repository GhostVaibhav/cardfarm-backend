const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../../cardfarm-d0a76-firebase-adminsdk-q5uoi-859b9e65cb.json');

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const db = getFirestore();
        const ref = db.collection("cards");
        const doc = await ref.add(JSON.parse(event.body));
        return {
            statusCode: 200,
            body: JSON.stringify({ id: doc.id })
        };
    }
}