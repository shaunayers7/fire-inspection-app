const fs = require('fs');
const path = require('path');

// Device type legend
const DEVICE_TYPES = {
  'H': 'Manual Pull Station',
  'HT': 'Heat Detector (Fixed Temp)',
  'RHT': 'Heat Detector (Rate of Rise)',
  'S': 'Smoke Detector',
  'DS': 'Duct Smoke Detector',
  'B': 'Bell',
  'K': 'Horn',
  'C': 'Chime',
  'V': 'Visual Alarm Appliance',
  'V/B': 'Visual/Bell',
  'SP': 'Loud Speaker',
  'HSP': 'Horn/Loud Speaker',
  'H/S': 'Horn/Strobe',
  'FS': 'Sprinkler Flow Switch',
  'TS': 'Sprinkler Tamper Switch',
  'ET': 'Emergency Telephone',
  'SA': 'Smoke Alarm',
  'AD': 'Ancillary Device'
};

// Building name mappings from file names to app names
const BUILDING_MAPPINGS = {
  'Cardston Temple': 'Cardston Temple',
  'Waterton': 'Waterton Chapel',
  'Magrath SC': 'Magrath Stake Center',
  'Raymond Tay': 'Raymond Taylor Street',
  'Fort Macleod SC': 'Fort Macleod Stake Center',
  'Champion': 'Champion',
  'Claresholm': 'Claresholm',
  'Park Lake': 'Park Lake',
  'Cardston ESC': 'Cardston East Stake',
  'Cardston S.Hill': 'Cardston Spring Hill',
  'Raymond Kni': 'Raymond Knights',
  'spring coulee': 'Spring Coulee',
  'Alpine stables Waterton': 'Alpine Stables Waterton',
  'Cardston west st': 'Cardston West Stake',
  'Hill spring': 'Hill Spring',
  'Leavitt': 'Leavitt',
  'Magrath GP': 'Magrath Grandview Park',
  'Raymond seminary 3': 'Raymond Seminary',
  'Raymond stake center': 'Raymond Stake Center',
  'Seminary  cardston': 'Seminary Cardston',
  'Seminary magrath': 'Seminary Magrath',
  'waterton opps bld': 'Waterton Operations Building'
};

function parseInspectionReport(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Extract building name from filename
  let buildingName = '';
  for (const [key, value] of Object.entries(BUILDING_MAPPINGS)) {
    if (fileName.toLowerCase().includes(key.toLowerCase())) {
      buildingName = value;
      break;
    }
  }
  
  if (!buildingName) {
    console.log(`⚠️ Could not match building name from: ${fileName}`);
    return null;
  }
  
  const result = {
    buildingName,
    fileName,
    fireAlarmDevices: [],
    emergencyLights: [],
    notes: [],
    panelInfo: {},
    testInfo: {}
  };
  
  // Extract panel information
  const panelMatch = content.match(/Fire Alarm panel Manufacturer:\s*([^\n]+?)Model #:\s*([^\n]+)/i);
  if (panelMatch) {
    result.panelInfo.manufacturer = panelMatch[1].trim();
    result.panelInfo.model = panelMatch[2].trim();
  }
  
  // Extract AC power circuit and location
  const acPwrMatch = content.match(/AC Pwr[^:]*:\s*([^\n]+?)(?:Panel Location|Located|$)/i);
  if (acPwrMatch) {
    result.panelInfo.acPower = acPwrMatch[1].trim();
  }
  
  const panelLocMatch = content.match(/Panel (?:Located|Location)[^:]*:\s*([^\n]+)/i);
  if (panelLocMatch) {
    result.panelInfo.location = panelLocMatch[1].trim();
  }
  
  // Extract key location
  const keyMatch = content.match(/Key[^:]*:\s*([^\n]+)/i);
  if (keyMatch) {
    result.panelInfo.keyLocation = keyMatch[1].trim();
  }
  
  // Extract customer ID
  const customerIdMatch = content.match(/Customer ID:\s*(\d+)/i);
  if (customerIdMatch) {
    result.testInfo.customerId = customerIdMatch[1];
  }
  
  // Parse fire alarm devices table
  let inDeviceSection = false;
  let inEmergencySection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect device section start
    if (line.includes('ANNUAL TEST AND INSPECTION RECORD')) {
      inDeviceSection = true;
      continue;
    }
    
    // Detect emergency lights section
    if (line.includes('Annual Emergency Lights Test') || line.includes('Lamp Test Pass')) {
      inDeviceSection = false;
      inEmergencySection = true;
      continue;
    }
    
    // Stop device section if we hit certain markers
    if (line.includes('Exit Lights') || line.includes('Fixture #')) {
      inDeviceSection = false;
      inEmergencySection = true;
      continue;
    }
    
    // Parse fire alarm devices
    if (inDeviceSection && !inEmergencySection) {
      // Skip header and legend lines
      if (line.includes('Location') && line.includes('Device') ||
          line.includes('Manual Pull') || line.includes('Heat Detector') ||
          line.includes('Description') && line.includes('Type') ||
          line.includes('Model#') || 
          line.includes('Correctly Installed') ||
          line.includes('Missing') || line.includes('Requires Service') ||
          line.includes('Alarm Operation') || 
          line.includes('ZONE') && !line.match(/\d+/) ||
          line.includes('---') || 
          line.length === 0 ||
          line.includes('Device Testing – Legend')) {
        continue;
      }
      
      // Try to parse device line - flexible approach
      // Look for device type codes (check longer codes first to avoid false matches)
      const deviceTypes = ['H/S', 'V/B', 'RHT', 'HSP', 'HT', 'DS', 'SA', 'AD', 'FS', 'TS', 'ET', 'SP', 'H', 'S', 'B', 'K', 'C', 'V'];
      let foundDevice = null;
      let deviceIndex = -1;
      
      for (const dtype of deviceTypes) {
        // Look for the device type as a standalone word
        const regex = new RegExp('\\b' + dtype.replace('/', '\\/') + '\\b');
        const match = line.match(regex);
        if (match) {
          foundDevice = dtype;
          deviceIndex = match.index;
          break;
        }
      }
      
      if (foundDevice && DEVICE_TYPES[foundDevice] && deviceIndex >= 0) {
        // Extract location (everything before the device type)
        let location = line.substring(0, deviceIndex).trim();
        
        // Extract zone (everything after the device type)
        const afterDevice = line.substring(deviceIndex + foundDevice.length).trim();
        const zoneMatch = afterDevice.match(/^(\d+|N\/A|Local Only)/);
        const zone = zoneMatch ? zoneMatch[1] : '';
        
        // Clean up location - remove leading special characters and numbers at very start
        location = location.replace(/^[\s•\-\*\d\s]+(?=[A-Za-z])/, '').trim();
        
        // Validate location
        if (location.length > 1 && location.length < 150 && 
            !location.includes('Legend') && 
            !location.includes('Installed') &&
            location !== 'X') {
          result.fireAlarmDevices.push({
            location,
            type: foundDevice,
            typeName: DEVICE_TYPES[foundDevice],
            zone,
            status: 'Pass'
          });
        }
      }
    }
    
    // Parse emergency lights
    if (inEmergencySection) {
      // Look for EM-# pattern or EXIT pattern
      const emMatch = line.match(/(EM-?\d+|EXIT\s*LI[TG]E?S?)\s+([A-Z]-\d+)?\s*(.+)?/i);
      if (emMatch) {
        const emNumber = emMatch[1].trim();
        const circuit = emMatch[2] ? emMatch[2].trim() : '';
        const location = emMatch[3] ? emMatch[3].trim().replace(/^(Yes|No|Good|\s)+/i, '').trim() : '';
        
        // Only add if we have meaningful data
        if (emNumber && (circuit || location)) {
          result.emergencyLights.push({
            device: emNumber,
            circuit,
            location: location || 'See circuit location',
            status: 'Pass'
          });
        }
      }
      
      // Also look for standalone circuit and location patterns
      // Format: Circuit# Location
      if (!emMatch && line.match(/^[A-Z]-\d+/)) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const circuit = parts[0];
          const location = parts.slice(1).join(' ').replace(/^(Yes|No|Good|\s)+/i, '').trim();
          
          if (location.length > 2) {
            result.emergencyLights.push({
              device: 'Emergency Light',
              circuit,
              location,
              status: 'Pass'
            });
          }
        }
      }
    }
    
    // Extract notes/deficiencies - look for keywords
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('deficiencie') || 
        lowerLine.includes('replace') ||
        lowerLine.includes('broken') ||
        lowerLine.includes('fix') ||
        lowerLine.includes('repair') ||
        lowerLine.includes('not working') ||
        (lowerLine.includes('note') && lowerLine.includes(':'))) {
      
      // Clean up the note
      let note = line.trim();
      
      // Look ahead for continuation lines
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        // Continue if the next line looks like a continuation (not a section header, not a new device line)
        if (nextLine && 
            !nextLine.includes('---') && 
            !nextLine.includes('ANNUAL') &&
            !nextLine.match(/^[A-Z]\s/) && // Not a single letter (device code)
            nextLine.length < 100) {
          note += ' ' + nextLine;
        } else {
          break;
        }
      }
      
      // Clean up the note
      note = note.replace(/^(note[s]?:?\s*|deficiencie[s]?:?\s*)/i, '').trim();
      
      if (note.length > 10 && note.length < 500) {
        result.notes.push(note);
      }
    }
  }
  
  return result;
}

function generatePopulateScript(parsedReports) {
  console.log('\n=== Building Data Summary ===\n');
  
  const buildingsData = {};
  
  parsedReports.forEach(report => {
    if (!report) return;
    
    console.log(`📋 ${report.buildingName}`);
    console.log(`   File: ${report.fileName}`);
    console.log(`   Fire Alarm Devices: ${report.fireAlarmDevices.length}`);
    console.log(`   Emergency Lights: ${report.emergencyLights.length}`);
    if (report.notes.length > 0) {
      console.log(`   Notes: ${report.notes.length}`);
    }
    console.log('');
    
    buildingsData[report.buildingName] = report;
  });
  
  // Generate the populate HTML script
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>Populate 2025 Inspection Data</title>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
</head>
<body>
  <h1>Populating 2025 Inspection Data...</h1>
  <div id="status"></div>
  <pre id="log"></pre>
  
  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyAKC3te8kUzGQCJvPdLRJlEpH_qbm0Ys4s",
      authDomain: "fire-inspection-7d90b.firebaseapp.com",
      projectId: "fire-inspection-7d90b",
      storageBucket: "fire-inspection-7d90b.firebasestorage.app",
      messagingSenderId: "645032950544",
      appId: "1:645032950544:web:52835da11e1ed4f9e5f3bc"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const APP_ID = 'welling-fm';
    
    const log = (msg) => {
      console.log(msg);
      document.getElementById('log').textContent += msg + '\\n';
    };
    
    const status = (msg) => {
      document.getElementById('status').innerHTML = '<h2>' + msg + '</h2>';
    };
    
    const buildingsData = ${JSON.stringify(buildingsData, null, 2)};
    
    async function populateBuildings() {
      try {
        status('🔄 Loading existing buildings from Firebase...');
        
        const buildingsRef = db.collection(\`apps/\${APP_ID}/buildings\`);
        const snapshot = await buildingsRef.get();
        
        log(\`Found \${snapshot.size} existing buildings in Firebase\`);
        
        let updated = 0;
        let notFound = 0;
        
        for (const [buildingName, reportData] of Object.entries(buildingsData)) {
          log(\`\\n📋 Processing: \${buildingName}\`);
          
          // Find matching building in Firebase
          let matchingDoc = null;
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name === buildingName && data.year === '2025') {
              matchingDoc = { id: doc.id, data };
            }
          });
          
          if (!matchingDoc) {
            log(\`  ⚠️ Building not found in Firebase: \${buildingName}\`);
            notFound++;
            continue;
          }
          
          log(\`  ✓ Found building in Firebase (ID: \${matchingDoc.id})\`);
          
          // Prepare updated building data
          const updatedData = { ...matchingDoc.data };
          
          // Update building details if we have panel info
          if (reportData.panelInfo.manufacturer) {
            updatedData.buildingDetails = updatedData.buildingDetails || [];
            const panelDetail = updatedData.buildingDetails.find(d => d.label === 'Fire Alarm Panel');
            if (panelDetail) {
              panelDetail.value = \`\${reportData.panelInfo.manufacturer} - \${reportData.panelInfo.model}\`;
            } else {
              updatedData.buildingDetails.push({
                id: Date.now() + '_panel',
                label: 'Fire Alarm Panel',
                value: \`\${reportData.panelInfo.manufacturer} - \${reportData.panelInfo.model}\`
              });
            }
          }
          
          if (reportData.panelInfo.location) {
            updatedData.buildingDetails = updatedData.buildingDetails || [];
            const locDetail = updatedData.buildingDetails.find(d => d.label === 'Panel Location');
            if (locDetail) {
              locDetail.value = reportData.panelInfo.location;
            } else {
              updatedData.buildingDetails.push({
                id: Date.now() + '_loc',
                label: 'Panel Location',
                value: reportData.panelInfo.location
              });
            }
          }
          
          if (reportData.testInfo.customerId) {
            updatedData.buildingDetails = updatedData.buildingDetails || [];
            const custDetail = updatedData.buildingDetails.find(d => d.label === 'Customer ID');
            if (custDetail) {
              custDetail.value = reportData.testInfo.customerId;
            } else {
              updatedData.buildingDetails.push({
                id: Date.now() + '_cust',
                label: 'Customer ID',
                value: reportData.testInfo.customerId
              });
            }
          }
          
          // Populate Fire Alarm Devices section
          if (reportData.fireAlarmDevices.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.fireAlarmDevices = reportData.fireAlarmDevices.map((device, idx) => ({
              id: \`fa_\${Date.now()}_\${idx}\`,
              name: \`\${device.location} - \${device.typeName}\`,
              location: device.location,
              type: device.typeName,
              zone: device.zone,
              status: device.status,
              date: new Date().toISOString().split('T')[0],
              notes: ''
            }));
            log(\`  ✓ Added \${reportData.fireAlarmDevices.length} fire alarm devices\`);
          }
          
          // Populate Emergency Lights section
          if (reportData.emergencyLights.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.emergencyLights = reportData.emergencyLights.map((light, idx) => ({
              id: \`em_\${Date.now()}_\${idx}\`,
              name: \`\${light.device} - \${light.location}\`,
              device: light.device,
              circuit: light.circuit,
              location: light.location,
              status: light.status,
              date: new Date().toISOString().split('T')[0],
              notes: ''
            }));
            log(\`  ✓ Added \${reportData.emergencyLights.length} emergency lights\`);
          }
          
          // Add notes section if there are notes
          if (reportData.notes.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.additionalNotes = reportData.notes.map((note, idx) => ({
              id: \`note_\${Date.now()}_\${idx}\`,
              name: 'Note',
              content: note,
              date: new Date().toISOString().split('T')[0]
            }));
            
            // Add to sections if not present
            if (!updatedData.sections.find(s => s.id === 'additionalNotes')) {
              updatedData.sections.push({
                id: 'additionalNotes',
                name: 'Additional Notes',
                icon: '📝'
              });
            }
            log(\`  ✓ Added \${reportData.notes.length} notes\`);
          }
          
          // Update timestamp
          updatedData.lastModified = new Date().toISOString();
          
          // Save to Firebase
          await buildingsRef.doc(matchingDoc.id).set(updatedData);
          log(\`  ✅ Updated building in Firebase\`);
          updated++;
        }
        
        status(\`✅ Complete! Updated: \${updated}, Not Found: \${notFound}\`);
        log(\`\\n🎉 Population complete!\`);
        log(\`   Updated: \${updated} buildings\`);
        log(\`   Not found: \${notFound} buildings\`);
        
      } catch (error) {
        status(\`❌ Error: \${error.message}\`);
        log(\`Error: \${error}\`);
        console.error(error);
      }
    }
    
    // Run on page load
    populateBuildings();
  </script>
</body>
</html>`;
  
  return html;
}

// Main execution
const reportsDir = path.join(__dirname, 'inspection-reports', '2025');
const files = fs.readdirSync(reportsDir);

console.log(`🔍 Found ${files.length} files in inspection-reports/2025/\n`);

const parsedReports = [];

files.forEach(file => {
  if (file.endsWith('.txt')) {
    const filePath = path.join(reportsDir, file);
    console.log(`📄 Parsing: ${file}`);
    const report = parseInspectionReport(filePath, file);
    if (report) {
      parsedReports.push(report);
    }
  }
});

console.log(`\n✅ Successfully parsed ${parsedReports.length} reports\n`);

// Generate the populate HTML
const html = generatePopulateScript(parsedReports);
fs.writeFileSync(path.join(__dirname, 'populate-2025-detailed.html'), html);

console.log('✅ Generated: populate-2025-detailed.html');
console.log('\nOpen this file in a browser to populate the data to Firebase.');
