// Node.js script to populate 2025 inspection data from reports
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": "fire-inspection-7d90b",
  "private_key_id": "key-id-here",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@fire-inspection-7d90b.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
};

// For web client approach (using fetch to Firestore REST API)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAKC3te8kUzGQCJvPdLRJlEpH_qbm0Ys4s",
  authDomain: "fire-inspection-7d90b.firebaseapp.com",
  projectId: "fire-inspection-7d90b",
  storageBucket: "fire-inspection-7d90b.firebasestorage.app",
  messagingSenderId: "645032950544",
  appId: "1:645032950544:web:52835da11e1ed4f9e5f3bc"
};

const APP_ID = 'welling-fm';

// Inspection data extracted from reports
const inspectionData = {
  "Cardston Temple": {
    panelInfo: { manufacturer: "Edwards", model: "2280" },
    customerID: "5034876",
    devices: [
      { loc: "SE Bishop Exit (14)", type: "Manual Pull Station", zone: "2" },
      { loc: "E Ent (1)", type: "Manual Pull Station", zone: "1" },
      { loc: "Library Closet (5)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "Library (4)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "5 Ward Bishop (7)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "105 Closet (8)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "SE Ent (3)", type: "Manual Pull Station", zone: "2" },
      { loc: "107 Closet (9)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "N Mech 201 (28)", type: "Heat Detector (Fixed Temp)", zone: "9" },
      { loc: "RS N1 Closet (15)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "RS N2 Closet (16)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "S RS Closet 1 (12)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "S RS Closet 2 (13)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "RS (11)", type: "Manual Pull Station", zone: "2" },
      { loc: "S Hall Center (2)", type: "Manual Pull Station", zone: "2" },
      { loc: "S Hall Custodial (10)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "SW Ent (13)", type: "Manual Pull Station", zone: "2" },
      { loc: "RM 104 (12)", type: "Manual Pull Station", zone: "2" },
      { loc: "103 Closet 1 (17)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "104 Closet 2 (18)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "104 Closet 3 (19)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "Sacrament Prep (21)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "Custodial By Library (20)", type: "Heat Detector (Fixed Temp)", zone: "2" },
      { loc: "Sound Closet (22)", type: "Heat Detector (Fixed Temp)", zone: "1" },
      { loc: "Gym B-6 Rm (39)", type: "Heat Detector (Rate of Rise)", zone: "1" },
      { loc: "S Gym (10)", type: "Manual Pull Station", zone: "1" },
      { loc: "N Gym (9)", type: "Manual Pull Station", zone: "1" },
      { loc: "Kitchen (23)", type: "Heat Detector (Rate of Rise)", zone: "1" },
      { loc: "N ent (8)", type: "Manual Pull Station", zone: "1" },
      { loc: "Downstairs (7)", type: "Manual Pull Station", zone: "4" },
      { loc: "Dn Strg Rm 2 (36)", type: "Heat Detector (Fixed Temp)", zone: "4" },
      { loc: "DN ST A-1 Closet (37)", type: "Heat Detector (Fixed Temp)", zone: "4" },
      { loc: "N Stair Well (26)", type: "Smoke Detector", zone: "6" },
      { loc: "N Stairwell up (6)", type: "Manual Pull Station", zone: "9" },
      { loc: "201 C-11 (27)", type: "Heat Detector (Fixed Temp)", zone: "9" },
      { loc: "Up Video (30)", type: "Heat Detector (Fixed Temp)", zone: "9" },
      { loc: "Up hallway Mech (32)", type: "Heat Detector (Fixed Temp)", zone: "9" },
      { loc: "Up Custodial (34)", type: "Heat Detector (Fixed Temp)", zone: "8" },
      { loc: "Middle Hall Up (4)", type: "Manual Pull Station", zone: "8" },
      { loc: "Rm 214 closet (31)", type: "Heat Detector (Fixed Temp)", zone: "8" },
      { loc: "214 Mech (33)", type: "Heat Detector (Fixed Temp)", zone: "8" },
      { loc: "Rm 214 (34A)", type: "Heat Detector (Fixed Temp)", zone: "8" },
      { loc: "C Stairwell (24)", type: "Smoke Detector", zone: "7" },
      { loc: "C Stairwell Up (3)", type: "Manual Pull Station", zone: "7" },
      { loc: "S Stairwell (25)", type: "Smoke Detector", zone: "5" },
      { loc: "S Stairwell Up (5)", type: "Manual Pull Station", zone: "5" },
      { loc: "Bell 1", type: "Bell", zone: "" },
      { loc: "Bell 2", type: "Bell", zone: "" },
      { loc: "Bell 3", type: "Bell", zone: "" },
      { loc: "Bell 4", type: "Bell", zone: "" },
      { loc: "Bell 5", type: "Bell", zone: "" },
      { loc: "Bell 6", type: "Bell", zone: "" },
      { loc: "Bell 7", type: "Bell", zone: "" },
      { loc: "Bell 8", type: "Bell", zone: "" },
      { loc: "Bell 9", type: "Bell", zone: "" },
      { loc: "Bell 10", type: "Bell", zone: "" },
      { loc: "Bell 11", type: "Bell", zone: "" },
      { loc: "Bell 12", type: "Bell", zone: "" },
      { loc: "Bell 13", type: "Bell", zone: "" },
      { loc: "Bell 14", type: "Bell", zone: "" },
      { loc: "Bell 15", type: "Bell", zone: "" }
    ],
    emergencyLights: [
      { device: "EM-1", circuit: "A-1", loc: "Classroom C-101" },
      { device: "EM-2", circuit: "B-11", loc: "Gym Over Basketball Hoop" },
      { device: "EM-3", circuit: "B-11", loc: "Gym Over Basketball Hoop" },
      { device: "EM-4", circuit: "A-17", loc: "North Entrance" },
      { device: "EM-5", circuit: "A-17", loc: "North Entrance" },
      { device: "EM-6", circuit: "B-19", loc: "Chapel West 1" },
      { device: "EM-7", circuit: "B-23", loc: "Chapel East 1" },
      { device: "EM-8", circuit: "B-23", loc: "Chapel East Middle" },
      { device: "EM-9", circuit: "B-23", loc: "Chapel East Front" },
      { device: "EM-10", circuit: "B-23", loc: "Chapel East Rear" },
      { device: "EM-11", circuit: "B-23", loc: "Chapel East Rear" },
      { device: "EM-12", circuit: "B-19", loc: "Chapel West Front" },
      { device: "EM-13", circuit: "B-19", loc: "Chapel West Rear" },
      { device: "EM-14", circuit: "B-19", loc: "Chapel West Rear" },
      { device: "EM-15", circuit: "B-5", loc: "C/H Row 2 East" },
      { device: "EM-16", circuit: "B-5", loc: "C/H Row 2 West" },
      { device: "EM-17", circuit: "B-9", loc: "C/H Row 5 East" },
      { device: "EM-18", circuit: "C-13", loc: "Attic Top Of Stairs" },
      { device: "EM-19", circuit: "C-13", loc: "Attic West Side" }
    ]
  },
  // ... (all other buildings - keeping this shorter for the script)
};

console.log('This script requires Firebase Admin SDK or web authentication.');
console.log('Due to security limitations, please use the HTML file instead:');
console.log('');
console.log('OPTION 1: Open HTML file in browser');
console.log('  1. Right-click on populate-2025-from-reports.html');
console.log('  2. Select "Copy Path"');
console.log('  3. Paste the path into your browser address bar');
console.log('');
console.log('OPTION 2: Use VS Code Live Server');
console.log('  1. Install "Live Server" extension in VS Code');
console.log('  2. Right-click populate-2025-from-reports.html');
console.log('  3. Select "Open with Live Server"');
console.log('');
console.log('OPTION 3: Use Python HTTP server');
console.log('  Run: python3 -m http.server 8000');
console.log('  Then open: http://localhost:8000/populate-2025-from-reports.html');
