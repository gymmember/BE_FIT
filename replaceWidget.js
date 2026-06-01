import fs from "fs";

let text = fs.readFileSync("src/components/AdminPanel.tsx", "utf-8");

const startWidget = `              {/* Recent Member signups summaries */}`;
const endWidget = `              {/* Gym Bookings Metrics logs */}`;

if (text.includes(startWidget) && text.includes(endWidget)) {
  const newWidget = `              {/* Recent Athlete Profiles */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Users className="text-blue-500 w-4 h-4" />
                    Recent Athlete Profiles
                  </h4>
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded font-mono font-bold">
                    {allUserProfiles.length} Total
                  </span>
                </div>

                <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                  {allUserProfiles.slice(0, 4).map((p) => {
                    const matchedBooking = bookings.find(b => b.userId === p.userId);
                    const matchedPass = passes.find(pa => pa.userId === p.userId);
                    const userDisplayName = p.displayName || (matchedBooking ? matchedBooking.userName : null) || (matchedPass ? matchedPass.clientName : null) || \`Athlete #\${p.userId.substring(0, 5).toUpperCase()}\`;
                    return (
                    <div key={p.userId} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition-all">
                      <div>
                        <span className="font-bold text-slate-800 block text-xs md:text-sm capitalize">{userDisplayName}</span>
                        <div className="flex items-center gap-x-2 font-mono text-[10px] text-slate-400 mt-0.5">
                          <span>UID: <span className="font-bold text-slate-600">{p.userId.substring(0,8)}</span></span>
                          <span>•</span>
                          <span>Goal: <span className="text-emerald-600">{p.goal || "Weight Loss"}</span></span>
                        </div>
                      </div>
                    </div>
                  )})}
                  {allUserProfiles.length === 0 && (
                    <p className="text-center py-8 text-xs text-slate-400">No profiles found.</p>
                  )}
                </div>
              </div>

`;
  
  const startIndex = text.indexOf(startWidget);
  const endIndex = text.indexOf(endWidget);
  text = text.substring(0, startIndex) + newWidget + text.substring(endIndex);
  fs.writeFileSync("src/components/AdminPanel.tsx", text);
  console.log("Replaced recent passports widget");
} else {
  console.log("Could not find recent passports widget!");
}
