const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, searchValue, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.split(searchValue).join(replaceValue);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/post_lab/Downloads/Final-Year-Project-main/Final-Year-Project');

files.forEach(file => {
  replaceInFile(file, 'system_admin', 'system_admin');
  replaceInFile(file, 'System Administrator', 'System Administrator');
  replaceInFile(file, 'SystemAdmin', 'SystemAdmin');
  replaceInFile(file, 'systemAdmin', 'systemAdmin');
});
console.log('Replacement complete.');
