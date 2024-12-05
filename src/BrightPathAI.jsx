import React from 'react';
import MainContent from './MainContent';
import RoleBasedRoadmaps from './RoleBasedRoadmaps';
import SkillsBasedRoadmaps from './SkillsBasedRoadmaps';
import Videos from './extra';
import PracticeForFree from './PracticeForFree';

function BrightPathAI() {
  return (
    <div className="flex overflow-hidden flex-col items-center bg-neutral-950 pt-20">
      <div className="w-full max-w-[1344px] px-4">
        <MainContent />
        <RoleBasedRoadmaps />
        <SkillsBasedRoadmaps />
        <Videos/>
        <PracticeForFree/>
      </div>
    </div>
  );
}

export default BrightPathAI;