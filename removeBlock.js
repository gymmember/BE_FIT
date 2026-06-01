import fs from 'fs';
const text = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const startTag = '{memberSubTab === "passports" && (';
const endTag = '{memberSubTab === "profiles" && (';

const startIndex = text.indexOf(startTag);
const endIndex = text.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const newText = text.substring(0, startIndex) + text.substring(endIndex + endTag.length);
  // Also remove the closing brace for the profiles block
  // Wait, let's find where the profiles block ends.
  
  fs.writeFileSync('src/components/AdminPanel.tsx', newText, 'utf-8');
  console.log("Replaced block successfully");
} else {
  console.log("Could not find tags", startIndex, endIndex);
}
