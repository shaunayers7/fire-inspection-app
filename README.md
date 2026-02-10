Fire Inspection App - Manual GitHub Upload Guide

Overview

This is a single-file React application designed for field fire inspections. It is optimized for mobile browsers (iPhone and Android) and utilizes an ARCHITECT LOCK to maintain consistency across all inspection cycles.

How to Set Up (No Terminal Required)

Create Repository: Create a new repository on GitHub named fire-inspection-app.

Upload Files: Upload the index.html and this README.md file directly to the repository.

Enable Hosting:

Navigate to Settings (top tab) -> Pages (left sidebar).

Under "Build and deployment", set the Branch to main.

Click Save.

Access: GitHub will provide a link (e.g., https://username.github.io/fire-inspection-app/). Open this on your mobile device.

Architect Lock Rules

Section Integrity: Do not change the UI layout or header titles.

Color Palette:

Building Details: Blue

Pre-job Checklist: Orange

Control Equipment: Purple

Device Inventory: Dark Grey/Navy

Battery Health: Blue

Emergency Lights: Yellow

Deficiencies: Red

Fixed Quantities: Maintain 10 building items, 5 checklist items, 7 control points, 28 devices, 7 battery metrics, and 5 light entries.

Persistence: All data saves to the phone's browser cache (localStorage).

Deficiency Logic

Automatic: Any item marked with a red "X" (failed) automatically appears in the Deficiency section.

Manual: New deficiencies can be added at the bottom with photos and notes.

Completion: Each deficiency has a "Mark Fixed" checkbox. A building is only marked "Complete" when all inventory is checked and all deficiencies are marked as fixed.

Data Safety

Use the "Export" button to save a copy of the report to your device or Google Drive before clearing browser history, as clearing history will delete local data.
