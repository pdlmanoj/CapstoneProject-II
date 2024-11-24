import React from 'react';
import Header from './Header';
import MainContent from './MainContent';
import RoleBasedRoadmaps from './RoleBasedRoadmaps';
import SkillsBasedRoadmaps from './SkillsBasedRoadmaps';
import Videos from './extra';
import PracticeForFree from './PracticeForFree';
import Footer from './Footer';

function BrightPathAI() {
  return (
    <div className="flex overflow-hidden flex-col items-center bg-neutral-950 pt-20">
      <Header />
      <div className="w-full max-w-[1344px] px-4">
        <MainContent />
        <RoleBasedRoadmaps />
        <SkillsBasedRoadmaps />
        <Videos/>
        <PracticeForFree/>
      </div>
      <Footer/>
    </div>
  );
}

export default BrightPathAI;