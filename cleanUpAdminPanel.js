import fs from "fs";

let text = fs.readFileSync("src/components/AdminPanel.tsx", "utf-8");

// Remove the Passports block and the `memberSubTab === "profiles" && (` wrapper
// The start of what we want to remove: `            {memberSubTab === "passports" && (`
// The end of what we want to remove: `            {memberSubTab === "profiles" && (`

const startMarker = '{memberSubTab === "passports" && (';
const endMarker = '{memberSubTab === "profiles" && (';

const startIndex = text.indexOf(startMarker);
const endIndex = text.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // Remove from startMarker up to endMarker + length
  text = text.slice(0, startIndex) + text.slice(endIndex + endMarker.length);
  // Also we need to remove the matching `)}` that was closing `memberSubTab === "profiles" && (`
  // It is right before TAB 3
  text = text.replace(/(\n\s*)\}\)\;\n\s*\n\s*\{\/\* TAB 3: MEMBERSHIP PLANS MANAGER \*\/\}/g, "$1\n$1{/* TAB 3: MEMBERSHIP PLANS MANAGER */}");
  // Wait, let's use exact string replacement for the end
  const closingBraceStr = `
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: MEMBERSHIP PLANS MANAGER */}`;
  const replacementBraceStr = `
                </div>
              </div>

          </div>
        )}

        {/* TAB 3: MEMBERSHIP PLANS MANAGER */}`;
  
  if (text.includes(closingBraceStr)) {
    text = text.replace(closingBraceStr, replacementBraceStr);
  } else {
    console.log("Could not find the closing brace block to remove");
  }

  fs.writeFileSync("src/components/AdminPanel.tsx", text);
  console.log("Cleaned up passports section!");
} else {
  console.log("Could not find start/end markers");
}
