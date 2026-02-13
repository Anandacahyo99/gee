import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ee = require('@google/earthengine');

// Membaca file JSON secara langsung
const serviceAccount = require('./service-account.json');

let isInitialized = false;

export const getGEE = async () => {
  if (isInitialized) return ee;

  return new Promise((resolve, reject) => {
    try {
      console.log("⏳ Mencoba Autentikasi GEE via JSON File...");

      ee.data.authenticateViaPrivateKey(
        serviceAccount, // Kirim seluruh objek JSON asli
        () => {
          console.log("🔑 Autentikasi Berhasil, memulai inisialisasi...");
          ee.initialize(
            null,
            null,
            () => {
              isInitialized = true;
              console.log("✅ GEE Berhasil Terhubung!");
              resolve(ee);
            },
            (err: any) => {
              console.error("❌ GEE Init Error:", err);
              reject(new Error(err));
            }
          );
        },
        (err: any) => {
          console.error("❌ GEE Auth Error Detail:", err);
          reject(new Error(err));
        }
      );
    } catch (err: any) {
      console.error("❌ GEE Fatal Error:", err);
      reject(err);
    }
  });
};