import React from 'react';
import TeacherHeader from '../components/teacher/TeacherHeader';
import TeacherHero from '../components/teacher/TeacherHero';
import QuickActionCards from '../components/teacher/QuickActionCards';
import MyClasses from '../components/teacher/MyClasses';
import RecentLessons from '../components/teacher/RecentLessons';

const TeacherDashboard = () => {
  return (
    <>
      <TeacherHeader />
      <TeacherHero />
      <QuickActionCards />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        <MyClasses />
        <RecentLessons />
      </div>
    </>
  );
};

export default TeacherDashboard;
