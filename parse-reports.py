#!/usr/bin/env python3
import os
import re
import json

# Device type legend
DEVICE_TYPES = {
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
}

# Building name mappings
BUILDING_MAPPINGS = {
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
    'Raymond seminary': 'Raymond Seminary',
    'Raymond stake center': 'Raymond Stake Center',
    'Seminary  cardston': 'Seminary Cardston',
    'Seminary magrath': 'Seminary Magrath',
    'waterton opps bld': 'Waterton Operations Building'
}

def parse_inspection_report(file_path, file_name):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Extract building name
    building_name = None
    for key, value in BUILDING_MAPPINGS.items():
        if key.lower() in file_name.lower():
            building_name = value
            break
    
    if not building_name:
        print(f"⚠️  Could not match building name from: {file_name}")
        return None
    
    result = {
        'buildingName': building_name,
        'fileName': file_name,
        'fireAlarmDevices': [],
        'emergencyLights': [],
        'notes': [],
        'panelInfo': {},
        'testInfo': {}
    }
    
    # Extract panel information
    panel_match = re.search(r'Fire Alarm panel Manufacturer:\s*([^\n]+?)Model #:\s*([^\n]+)', content, re.IGNORECASE)
    if panel_match:
        result['panelInfo']['manufacturer'] = panel_match.group(1).strip()
        result['panelInfo']['model'] = panel_match.group(2).strip()
    
    # Extract customer ID
    customer_match = re.search(r'Customer ID:\s*(\d+)', content)
    if customer_match:
        result['testInfo']['customerId'] = customer_match.group(1)
    
    # Parse devices
    in_device_section = False
    in_emergency_section = False
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Detect sections
        if 'ANNUAL TEST AND INSPECTION RECORD' in line:
            in_device_section = True
            in_emergency_section = False
            continue
        
        if 'Annual Emergency Lights Test' in line or 'Lamp Test Pass' in line or 'Exit Lights' in line:
            in_device_section = False
            in_emergency_section = True
            continue
        
        # Parse fire alarm devices
        if in_device_section and not in_emergency_section:
            # Skip headers
            if any(x in line for x in ['Location', 'Device', 'Correctly Installed', 'Missing', 
                                        'Requires Service', 'Description', 'Model#']) and not re.search(r'\d+', line):
                continue
            
            # Check for device type codes (longer codes first)
            device_types = ['H/S', 'V/B', 'RHT', 'HSP', 'HT', 'DS', 'SA', 'AD', 'FS', 'TS', 'ET', 'SP', 'H', 'S', 'B', 'K', 'C', 'V']
            found_device = None
            device_index = -1
            
            for dtype in device_types:
                pattern = r'\b' + re.escape(dtype) + r'\b'
                match = re.search(pattern, line)
                if match:
                    found_device = dtype
                    device_index = match.start()
                    break
            
            if found_device and found_device in DEVICE_TYPES and device_index >= 0:
                # Extract location (before device type)
                location = line[:device_index].strip()
                
                # Extract zone (after device type)
                after_device = line[device_index + len(found_device):].strip()
                zone_match = re.match(r'^(\d+|N/A|Local Only)', after_device)
                zone = zone_match.group(1) if zone_match else ''
                
                # Clean location
                location = re.sub(r'^[\s•\-\*\d\s]+(?=[A-Za-z])', '', location).strip()
                
                # Validate
                if 1 < len(location) < 150 and 'Legend' not in location and 'Installed' not in location and location != 'X':
                    result['fireAlarmDevices'].append({
                        'location': location,
                        'type': found_device,
                        'typeName': DEVICE_TYPES[found_device],
                        'zone': zone,
                        'status': 'Pass'
                    })
        
        # Parse emergency lights
        if in_emergency_section:
            em_match = re.search(r'(EM-?\d+|EXIT\s*LI[TG]E?S?)\s+([A-Z]-\d+)?\s*(.+)?', line, re.IGNORECASE)
            if em_match:
                em_number = em_match.group(1).strip()
                circuit = em_match.group(2).strip() if em_match.group(2) else ''
                location = em_match.group(3).strip() if em_match.group(3) else ''
                location = re.sub(r'^(Yes|No|Good|\s)+', '', location, flags=re.IGNORECASE).strip()
                
                if em_number and (circuit or location):
                    result['emergencyLights'].append({
                        'device': em_number,
                        'circuit': circuit,
                        'location': location or 'See circuit location',
                        'status': 'Pass'
                    })
        
        # Extract notes
        lower_line = line.lower()
        if any(x in lower_line for x in ['deficienc', 'replace', 'broken', 'fix', 'repair', 'not working']) or ('note' in lower_line and ':' in lower_line):
            note = line.strip()
            
            # Look ahead for continuation
            for j in range(i + 1, min(i + 3, len(lines))):
                next_line = lines[j].strip()
                if next_line and '---' not in next_line and 'ANNUAL' not in next_line and len(next_line) < 100:
                    note += ' ' + next_line
                else:
                    break
            
            note = re.sub(r'^(note[s]?:?\s*|deficiencie[s]?:?\s*)', '', note, flags=re.IGNORECASE).strip()
            
            if 10 < len(note) < 500:
                result['notes'].append(note)
    
    return result

# Parse all reports
reports_dir = 'inspection-reports/2025'
files = [f for f in os.listdir(reports_dir) if f.endswith('.txt')]

print(f"🔍 Found {len(files)} files in {reports_dir}/\n")

parsed_reports = []
for file in files:
    file_path = os.path.join(reports_dir, file)
    print(f"📄 Parsing: {file}")
    report = parse_inspection_report(file_path, file)
    if report:
        parsed_reports.append(report)

print(f"\n✅ Successfully parsed {len(parsed_reports)} reports\n")

# Print summary
print("=== Building Data Summary ===\n")
for report in parsed_reports:
    print(f"📋 {report['buildingName']}")
    print(f"   File: {report['fileName']}")
    print(f"   Fire Alarm Devices: {len(report['fireAlarmDevices'])}")
    print(f"   Emergency Lights: {len(report['emergencyLights'])}")
    if report['notes']:
        print(f"   Notes: {len(report['notes'])}")
    print()

# Save to JSON
with open('parsed-2025-data.json', 'w') as f:
    json.dump(parsed_reports, f, indent=2)

print("✅ Saved parsed data to: parsed-2025-data.json")
print("\nNow creating populate HTML file...")

# Generate populate HTML
buildings_data = {r['buildingName']: r for r in parsed_reports}

html_template = '''<!DOCTYPE html>
<html>
<head>
  <title>Populate 2025 Inspection Data</title>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    #status { font-size: 24px; margin: 20px 0; }
    #log { background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; max-height: 600px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>🔄 Populating 2025 Inspection Data...</h1>
  <div id="status">Initializing...</div>
  <div id="log"></div>
  
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
      document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
    };
    
    const status = (msg) => {
      document.getElementById('status').textContent = msg;
    };
    
    const buildingsData = ''' + json.dumps(buildings_data) + ''';
    
    async function populateBuildings() {
      try {
        status('🔄 Loading existing buildings from Firebase...');
        
        const buildingsRef = db.collection(`apps/${APP_ID}/buildings`);
        const snapshot = await buildingsRef.get();
        
        log(`Found ${snapshot.size} existing buildings in Firebase`);
        
        let updated = 0;
        let notFound = 0;
        
        for (const [buildingName, reportData] of Object.entries(buildingsData)) {
          log(`\\n📋 Processing: ${buildingName}`);
          
          // Find matching building in Firebase
          let matchingDoc = null;
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name === buildingName && data.year === '2025') {
              matchingDoc = { id: doc.id, data };
            }
          });
          
          if (!matchingDoc) {
            log(`  ⚠️  Building not found in Firebase: ${buildingName}`);
            notFound++;
            continue;
          }
          
          log(`  ✓ Found building in Firebase (ID: ${matchingDoc.id})`);
          
          // Prepare updated building data
          const updatedData = { ...matchingDoc.data };
          
          // Update building details
          if (reportData.panelInfo.manufacturer) {
            updatedData.buildingDetails = updatedData.buildingDetails || [];
            let panelDetail = updatedData.buildingDetails.find(d => d.label === 'Fire Alarm Panel');
            if (panelDetail) {
              panelDetail.value = `${reportData.panelInfo.manufacturer} - ${reportData.panelInfo.model}`;
            } else {
              updatedData.buildingDetails.push({
                id: Date.now() + '_panel',
                label: 'Fire Alarm Panel',
                value: `${reportData.panelInfo.manufacturer} - ${reportData.panelInfo.model}`
              });
            }
          }
          
          if (reportData.testInfo.customerId) {
            updatedData.buildingDetails = updatedData.buildingDetails || [];
            let custDetail = updatedData.buildingDetails.find(d => d.label === 'Customer ID');
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
          
          // Populate Fire Alarm Devices
          if (reportData.fireAlarmDevices.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.fireAlarmDevices = reportData.fireAlarmDevices.map((device, idx) => ({
              id: `fa_${Date.now()}_${idx}`,
              name: `${device.location} - ${device.typeName}`,
              location: device.location,
              type: device.typeName,
              zone: device.zone,
              status: device.status,
              date: new Date().toISOString().split('T')[0],
              notes: ''
            }));
            log(`  ✓ Added ${reportData.fireAlarmDevices.length} fire alarm devices`);
          }
          
          // Populate Emergency Lights
          if (reportData.emergencyLights.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.emergencyLights = reportData.emergencyLights.map((light, idx) => ({
              id: `em_${Date.now()}_${idx}`,
              name: `${light.device} - ${light.location}`,
              device: light.device,
              circuit: light.circuit,
              location: light.location,
              status: light.status,
              date: new Date().toISOString().split('T')[0],
              notes: ''
            }));
            log(`  ✓ Added ${reportData.emergencyLights.length} emergency lights`);
          }
          
          // Add notes section if there are notes
          if (reportData.notes.length > 0) {
            updatedData.data = updatedData.data || {};
            updatedData.data.additionalNotes = reportData.notes.map((note, idx) => ({
              id: `note_${Date.now()}_${idx}`,
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
            log(`  ✓ Added ${reportData.notes.length} notes`);
          }
          
          // Update timestamp
          updatedData.lastModified = new Date().toISOString();
          
          // Save to Firebase
          await buildingsRef.doc(matchingDoc.id).set(updatedData);
          log(`  ✅ Updated building in Firebase`);
          updated++;
        }
        
        status(`✅ Complete! Updated: ${updated}, Not Found: ${notFound}`);
        log(`\\n🎉 Population complete!`);
        log(`   Updated: ${updated} buildings`);
        log(`   Not found: ${notFound} buildings`);
        
      } catch (error) {
        status(`❌ Error: ${error.message}`);
        log(`Error: ${error}`);
        console.error(error);
      }
    }
    
    // Run on page load
    populateBuildings();
  </script>
</body>
</html>'''

with open('populate-2025-detailed.html', 'w') as f:
    f.write(html_template)

print("✅ Generated: populate-2025-detailed.html")
print("\nOpen this file in a browser to populate the data to Firebase.")
