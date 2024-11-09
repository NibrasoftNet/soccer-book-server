import { parentPort, workerData } from 'worker_threads';
import { ExportService } from '../export/export.service';

async function run() {
  const exportService = new ExportService();
  try {
    await exportService.exportToCsvExcel(
      workerData.filePath,
      workerData.fileType,
      workerData.data,
    );
    parentPort?.postMessage(workerData);
  } catch (error) {
    // Handle errors
    parentPort?.postMessage({ error: error.message });
  } finally {
    // Terminate the worker thread
    parentPort?.close();
  }
}
void run();
