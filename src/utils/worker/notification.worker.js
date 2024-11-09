import { parentPort, workerData } from 'worker_threads';
import { NotificationService } from '../../notification/notification.service';

async function run() {
  const notificationService = new NotificationService();
  console.log('Notification worker thread got data:', workerData);
  try {
    await notificationService.sendFirebaseMessage(workerData.message);
    parentPort.postMessage(workerData);
  } catch (error) {
    // Handle errors
    parentPort.postMessage({ error: error.message });
  } finally {
    // Terminate the worker thread
    parentPort.close();
  }
}

void run();
