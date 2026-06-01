import fs from "fs";
let text = fs.readFileSync("src/components/AdminPanel.tsx", "utf-8");

const filterCode = `  // Filtered members list
  const filteredMembers = memberLogins.filter((m) => {
    const q = memberQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (m.displayName || "").toLowerCase().includes(q) ||
      (m.username || "").toLowerCase().includes(q)
    );
  });`;

text = text.replace(filterCode, "");

const stateStart = `  // States for Member Logins management`;
const stateEndStr = `  // States for Trainers (persisted locally)`;
const ssIdx = text.indexOf(stateStart);
const seIdx = text.indexOf(stateEndStr);

if (ssIdx !== -1 && seIdx !== -1) {
  text = text.substring(0, ssIdx) + text.substring(seIdx);
}

fs.writeFileSync("src/components/AdminPanel.tsx", text);
console.log("Cleanup done!");
