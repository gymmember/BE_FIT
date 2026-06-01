import fs from "fs";
let text = fs.readFileSync("src/components/AdminPanel.tsx", "utf-8");

const createStart = "  const handleCreateMember = async () => {";
const deleteStart = "  const handleDeleteMember = async (username: string) => {";

// We remove till closing } for each.
// For handleCreateMember, it is a long function. We can remove from createStart up to handleDeleteMember.
const deleteIndex = text.indexOf(deleteStart);
if (deleteIndex !== -1) {
  const createIndex = text.indexOf(createStart);
  if (createIndex !== -1) {
    // Delete till the end of handleDeleteMember.
    // handleDeleteMember ends at `  };` followed by `  // Filtered members list`
    
    // find next comment after handleDeleteMember
    const filterComment = "  // Filtered members list";
    const filterIndex = text.indexOf(filterComment, deleteIndex);
    
    if (filterIndex !== -1) {
      text = text.substring(0, createIndex) + text.substring(filterIndex);
      fs.writeFileSync("src/components/AdminPanel.tsx", text);
      console.log("Removed handleCreateMember and handleDeleteMember!");
    } else {
      console.log("Could not find next line");
    }
  } else {
     console.log("Could not find createStart");
  }
} else {
  console.log("Could not find deleteStart");
}
