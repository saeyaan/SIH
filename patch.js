const fs = require('fs');
const file = 'src/components/teacher/MyClasses.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `    if (!newClassName.trim()) {`,
  `    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      addToast('Please log in again to create a class.', 'error');
      return;
    }
    
    if (!newClassName.trim()) {`
);

fs.writeFileSync(file, code);
