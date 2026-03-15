// ============================================================
// CONFIGURATION FILE
// ============================================================
// ⚠️ THIS FILE IS GITIGNORED. 
// Do not commit your real API key.
// 
// To use:
// 1. Get a free key at: https://aistudio.google.com/apikey
// 2. Paste it below.
// ============================================================
const CONFIG = {
  // If you provide a raw GEMINI_API_KEY, the app will use it directly (Good for local testing).
  // DO NOT USE THIS IN PRODUCTION as it will expose your key.
  GEMINI_API_KEY: 'YOUR_API_KEY_HERE',
  EMAIL: 'your-email@example.com',
  WEB3FORMS_KEY: 'YOUR_WEB3FORMS_ACCESS_KEY_HERE',
  
  // For Production: Provide your Firebase config below to use Firebase AI Logic and App Check.
  // This protects your API quotas from unauthorized use.
  FIREBASE_CONFIG: {
    /*
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-ABCDEF123"
    */
  }
};
