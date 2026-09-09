import fs from 'fs';
const file = 'src/components/teacher/MyClasses.jsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `    const { data: sessionData } = await supabase.auth.getSession();n    if (!sessionData?.session) {n      addToast('Please log in again to create a class.', 'error');n      return;n    }n`,
  `    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      addToast('Please log in again to create a class.', 'error');
      return;
    }\n`
);

fs.writeFileSync(file, code);
