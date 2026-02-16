#!/usr/bin/env node

/**
 * Generate HTML file to auto-populate all 2025 inspection reports
 * This script reads all files from inspection-reports/2025/ and creates
 * an HTML page that will parse and import them all into the app
 */

const fs = require('fs');
const path = require('path');

const reportsDir = './inspection-reports/2025';
const outputFile = './populate-2025-buildings.html';

console.log('📁 Reading inspection reports from:', reportsDir);

// Read all .txt files from the directory
const files = fs.readdirSync(reportsDir)
    .filter(f => f.endsWith('.txt'))
    .sort();

console.log(`📄 Found ${files.length} inspection reports`);

// Read content of each file
const fileContents = files.map(filename => {
    const filepath = path.join(reportsDir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    // Extract likely building name from filename
    let buildingName = filename
        .replace(/^\d+_\d+_\d+_/, '') // Remove ID prefix
        .replace(/_Fire Alarm System.*\.txt$/, '') // Remove suffix
        .replace(/_Annual Emergency.*\.txt$/, '')
        .replace(/\.txt$/, '')
        .replace(/_/g, ' ')
        .trim();
    
    console.log(`  ✓ ${filename} → "${buildingName}"`);
    
    return {
        filename,
        buildingName,
        content: content.replace(/`/g, '\\`').replace(/\$/g, '\\$') // Escape backticks and $ for template literal
    };
});

console.log('\n🔨 Generating HTML import file...');

// Generate HTML file
const html = `<!DOCTYPE html>
<html>
<head>
    <title>Auto-Populate 2025 Buildings</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-top: 0;
            font-size: 32px;
        }
        .status {
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            font-weight: 500;
        }
        .loading {
            background: #fff3cd;
            border: 2px solid #ffc107;
            color: #856404;
        }
        .success {
            background: #d4edda;
            border: 2px solid #28a745;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border: 2px solid #dc3545;
            color: #721c24;
        }
        .building-list {
            margin-top: 20px;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f8f9fa;
        }
        .building-item {
            padding: 8px;
            margin: 5px 0;
            background: white;
            border-left: 4px solid #667eea;
            border-radius: 4px;
            font-size: 14px;
        }
        .building-item strong {
            color: #667eea;
        }
        .button {
            margin-top: 20px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background: #5568d3;
        }
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📥 Import 2025 Inspection Reports</h1>
        <div id="status" class="status loading">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="spinner"></div>
                <div>Processing ${files.length} inspection reports...</div>
            </div>
        </div>
        <div id="buildings" class="building-list" style="display: none;"></div>
        <div id="actions" style="display: none;">
            <a href="index.html" class="button">🚀 Open Fire Inspection App</a>
        </div>
    </div>

    <script>
        // Import the parsing logic (simplified version)
        const getNewBuildingTemplate = (name = 'New Building', address = '', city = '', initialStatus = 'not-started') => ({
            id: \`b-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
            name,
            lastSynced: null,
            details: {
                buildingName: name,
                address: address,
                city: city,
                panelLocation: '',
                manufacturer: '',
                panelModel: '',
                serialNumber: 'N/A',
                softwareVersion: 'N/A',
                dateManufactured: 'N/A',
                lastServiceDate: 'N/A'
            },
            sections: [
                { id: 'checklist', title: 'Pre-job checklist', color: 'bg-orange-500', isDev: false },
                { id: 'control', title: 'control equipment', color: 'bg-purple-600', isDev: false },
                { id: 'devices', title: 'Device inventory', color: 'bg-[#1C252E]', isDev: true },
                { id: 'battery', title: 'Battery health', color: 'bg-blue-500', isDev: false },
                { id: 'lights', title: 'Emergency lights', color: 'bg-[#EAB308]', isDev: false }
            ],
            data: {
                checklist: Array(5).fill(0).map((_, i) => ({ id: \`ck\${i}-\${Date.now()}\`, label: \`Checklist Item \${i+1}\`, status: initialStatus, note: '', photo: null, fixed: false })),
                control: Array(16).fill(0).map((_, i) => ({ id: \`c\${i}-\${Date.now()}\`, label: \`Control Equipment \${i+1}\`, status: initialStatus, note: '', photo: null, fixed: false })),
                devices: Array(10).fill(0).map((_, i) => ({ id: \`d\${i}-\${Date.now()}\`, deviceNo: \`\${i+1}\`, label: \`Device \${i+1}\`, type: 'Smoke Detector', status: initialStatus, note: '', photo: null, fixed: false })),
                battery: [
                    { id: \`b1-\${Date.now()}\`, label: 'Battery voltage AC on', status: initialStatus, note: '', photo: null, fixed: false },
                    { id: \`b2-\${Date.now()}\`, label: 'Battery under load', status: initialStatus, note: '', photo: null, fixed: false },
                    { id: \`b3-\${Date.now()}\`, label: 'Battery clean tight terminals', status: initialStatus, note: '', photo: null, fixed: false },
                    { id: \`b4-\${Date.now()}\`, label: 'Battery type', status: initialStatus, note: '', photo: null, fixed: false }
                ],
                lights: Array(5).fill(0).map((_, i) => ({ id: \`e\${i}-\${Date.now()}\`, label: \`Emergency Light \${i+1}\`, status: initialStatus, note: '', photo: null, fixed: false })),
                customDeficiencies: []
            }
        });

        ${fs.readFileSync('./index.html', 'utf-8').match(/const parseImportText = \(text\) => \{[\s\S]*?\n        \};/)[0]}

        // Inspection reports data
        const reports = ${JSON.stringify(fileContents, null, 8)};

        // Process all reports
        setTimeout(() => {
            console.log('🚀 Starting import of ${files.length} buildings...');
            
            const buildings = [];
            const buildingsList = document.getElementById('buildings');
            
            reports.forEach((report, idx) => {
                try {
                    const parsed = parseImportText(report.content);
                    if (parsed.length > 0) {
                        const building = parsed[0];
                        // Override name with filename-derived name
                        building.name = report.buildingName;
                        building.details.buildingName = report.buildingName;
                        buildings.push(building);
                        
                        const item = document.createElement('div');
                        item.className = 'building-item';
                        item.innerHTML = \`
                            <strong>\${idx + 1}.</strong> \${building.name} 
                            <span style="color: #666;">| \${building.details.manufacturer || 'No panel'} \${building.details.panelModel || ''}</span>
                        \`;
                        buildingsList.appendChild(item);
                        
                        console.log(\`✅ [\${idx + 1}/${files.length}] \${building.name}: \${building.details.manufacturer} \${building.details.panelModel}\`);
                    } else {
                        console.warn(\`⚠️  [\${idx + 1}/${files.length}] Failed to parse: \${report.filename}\`);
                    }
                } catch (error) {
                    console.error(\`❌ [\${idx + 1}/${files.length}] Error parsing \${report.filename}:\`, error);
                }
            });

            // Save to localStorage
            const saved = localStorage.getItem('fire_inspection_v4_data');
            let yearData = saved ? JSON.parse(saved) : {};
            
            // Ensure 2025 exists
            if (!yearData['2025']) {
                yearData['2025'] = [];
            }
            
            // Add all buildings to 2025
            yearData['2025'] = buildings;
            
            // Save
            localStorage.setItem('fire_inspection_v4_data', JSON.stringify(yearData));
            
            // Update UI
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status success';
            statusDiv.innerHTML = \`
                <div style="font-size: 20px; margin-bottom: 10px;">✅ Success!</div>
                <div>Imported <strong>\${buildings.length} buildings</strong> into 2025</div>
                <div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">
                    Data saved to localStorage. Open the app to view all buildings.
                </div>
            \`;
            
            buildingsList.style.display = 'block';
            document.getElementById('actions').style.display = 'block';
            
            console.log(\`\\n🎉 Successfully imported \${buildings.length} buildings into year 2025!\`);
        }, 500);
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(outputFile, html, 'utf-8');

console.log(`\n✅ Generated: ${outputFile}`);
console.log(`\n📝 Instructions:`);
console.log(`   1. Open ${outputFile} in your browser`);
console.log(`   2. Wait for import to complete`);
console.log(`   3. Click "Open Fire Inspection App"`);
console.log(`   4. Select year 2025 to view all imported buildings\n`);
