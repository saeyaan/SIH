import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherBottomNav from './TeacherBottomNav';
import TeacherRightPanel from '../components/teacher/TeacherRightPanel';

const TeacherLayout = () => {
  return (
    <div className="teacher-layout">
      
      <div className="teacher-sidebar">
        <TeacherSidebar />
      </div>

      <div className="teacher-main-content">
        <Outlet />
      </div>

      <div className="teacher-right-panel">
        <TeacherRightPanel />
      </div>

      <TeacherBottomNav />
      
    </div>
  );
};

export default TeacherLayout;
