import fs from 'fs';
const file = 'src/components/teacher/MyClasses.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the fetch error block
code = code.replace(
  /catch \(err\) \{\n\s*console\.error\(\{[\s\S]*?\}\);\n\s*addToast\('Failed to load classes\.', 'error'\);\n\s*\}/,
  `catch (err) {
      console.error('CLASSES ERROR (FETCH)', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        status: err?.status,
        fullError: err
      });
      addToast('Failed to load classes.', 'error');
    }`
);

// Replace the insert error block
code = code.replace(
  /catch \(err\) \{\n\s*console\.error\(err\);\n\s*addToast\(err\.message \|\| 'Failed to create class', 'error'\);\n\s*\}/,
  `catch (err) {
      console.error('CLASSES ERROR (CREATE)', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        status: err?.status,
        fullError: err
      });
      addToast(err?.message || 'Failed to create class', 'error');
    }`
);

fs.writeFileSync(file, code);
