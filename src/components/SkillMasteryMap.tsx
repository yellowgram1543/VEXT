import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function SkillMasteryMap() {
  // Fetch mastery data - in a real app this might be per user, 
  // but for the prototype we use the global UserMastery if it exists.
  const mastery = await prisma.userMastery.findFirst();

  const skills = [
    { name: 'Theory', value: mastery?.theoryScore || 0, color: 'bg-primary' },
    { name: 'Math', value: mastery?.numericalScore || 0, color: 'bg-accent-purple' },
    { name: 'Coding', value: mastery?.codingScore || 0, color: 'bg-secondary' },
  ];

  return (
    <div className="bg-white border-3 border-brand-dark p-6 rounded-neo neo-brutal-shadow">
      <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-6">
        Skill Mastery Map
      </h3>
      
      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-heading font-bold text-xs uppercase text-brand-dark">
                {skill.name}
              </span>
              <span className="font-heading font-black text-brand-dark text-sm">
                {Math.round(skill.value)}%
              </span>
            </div>
            <div className="w-full h-4 bg-surface-container border-3 border-brand-dark rounded-full overflow-hidden">
              <div 
                className={`h-full ${skill.color} border-r-3 border-brand-dark transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, skill.value))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t-3 border-brand-dark border-dashed">
        <p className="text-[10px] font-bold text-brand-dark/50 uppercase leading-tight">
          Mastery increases by 5% for each passed quiz or completed practice cell.
        </p>
      </div>
    </div>
  );
}
