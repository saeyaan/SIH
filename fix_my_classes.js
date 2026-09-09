import fs from 'fs';
const file = 'src/components/teacher/MyClasses.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the fetchClasses function entirely to use the fallback approach
code = code.replace(
  /const fetchClasses = async \(\) => \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\} finally \{[\s\S]*?\};/,
  `const fetchClasses = async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      // 1. Fetch the teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, class_code, description, created_at')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (classesError) throw classesError;

      // 2. Fetch class members to calculate counts
      // Extract class IDs to filter members (optional optimization, but good for safety)
      const classIds = classesData.map(c => c.id);
      
      let memberCounts = {};
      
      if (classIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('class_members')
          .select('id, class_id')
          .in('class_id', classIds);
          
        if (membersError) throw membersError;
        
        // Count members per class
        membersData.forEach(member => {
          memberCounts[member.class_id] = (memberCounts[member.class_id] || 0) + 1;
        });
      }
      
      const formattedData = classesData.map((cls, idx) => ({
        id: cls.id,
        name: cls.name,
        code: cls.class_code,
        description: cls.description,
        students: memberCounts[cls.id] || 0,
        color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'][idx % 3]
      }));
      
      setClasses(formattedData);
    } catch (err) {
      console.error({
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      });
      addToast('Failed to load classes.', 'error');
    } finally {
      setLoading(false);
    }
  };`
);

fs.writeFileSync(file, code);
