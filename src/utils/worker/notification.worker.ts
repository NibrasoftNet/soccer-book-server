import { parentPort, workerData } from 'worker_threads';
import * as firebaseAdmin from 'firebase-admin';

class FirebaseSingleton {
  private static instance: firebaseAdmin.app.App;

  public static getInstance(): firebaseAdmin.app.App {
    if (!FirebaseSingleton.instance) {
      FirebaseSingleton.instance = firebaseAdmin.initializeApp({
        // Firebase configuration
        credential: firebaseAdmin.credential.cert({
          // Your Firebase service account credentials
          projectId: process.env.FIREBASE_MESSAGING_PROJECT_ID,
          clientEmail: process.env.FIREBASE_MESSAGING_CLIENT_EMAIL,
          privateKey: `-----BEGIN PRIVATE KEY-----${process.env.FIREBASE_MESSAGING_PRIVATE_KEY}-----END PRIVATE KEY-----\n`,
        }),
      });
    }
    return FirebaseSingleton.instance;
  }
}

// Initialize Firebase Admin SDK using the singleton pattern
const messaging = FirebaseSingleton.getInstance().messaging();

async function run() {
  try {
    const response = await messaging.sendEachForMulticast(workerData.message);
    if (response.failureCount === 1) {
      console.log(`Notifications were not sent sent ${response.failureCount}`);
    }
    console.log(
      `Notifications were sent successfully ${response.successCount}`,
    );
    parentPort?.postMessage(workerData);
  } catch (error) {
    console.log('Error sending message:', error);
    // Handle errors
    parentPort?.postMessage({ error: error.message });
  } finally {
    // Terminate the worker thread
    parentPort?.close();
  }
}

void run();
