const fs = require('fs');
const path = require('path');

const renameFileOrDir = (oldPath, newPath) => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldPath} to ${newPath}`);
  }
};

function walkAndRename(dir) {
  let entries = fs.readdirSync(dir);
  for (let file of entries) {
    let fullPath = path.join(dir, file);
    let stat = fs.statSync(fullPath);
    
    // Check if name contains targets
    let newName = file;
    if (newName.includes('SuperAdmin')) newName = newName.replace('SuperAdmin', 'SystemAdmin');
    if (newName.includes('superAdmin')) newName = newName.replace('superAdmin', 'systemAdmin');
    if (newName.includes('super_admin')) newName = newName.replace('super_admin', 'system_admin');
    if (newName.includes('Super Admin')) newName = newName.replace('Super Admin', 'System Administrator');

    let newFullPath = path.join(dir, newName);
    
    if (newName !== file) {
      renameFileOrDir(fullPath, newFullPath);
      fullPath = newFullPath;
    }

    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        walkAndRename(fullPath);
      }
    }
  }
}

walkAndRename('c:/Users/post_lab/Downloads/Final-Year-Project-main/Final-Year-Project');
console.log('Renaming complete.');
