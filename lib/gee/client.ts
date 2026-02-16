import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ee = require('@google/earthengine');

let isInitialized = false;

export const getGEE = async () => {
  if (isInitialized) return ee;

  return new Promise((resolve, reject) => {
    try {
      const raw = process.env.GEE_SERVICE_ACCOUNT_JSON;

      if (!raw) {
        return reject(new Error("Missing GEE_SERVICE_ACCOUNT_JSON"));
      }

      const serviceAccount = JSON.parse(raw);

      ee.data.authenticateViaPrivateKey(
        serviceAccount,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              isInitialized = true;
              console.log("✅ GEE Connected");
              resolve(ee);
            },
            reject
          );
        },
        reject
      );
    } catch (err) {
      reject(err);
    }
  });
};
