export type SkillRank = "Novice" | "Apprentice" | "Journeyman" | "Expert" | "Master" | "Grandmaster";

export type RankedSkill = {
  name: string;
  rank: SkillRank;
  experience: number;
};

const lifeSkills = [
  "Fishing", "Cooking", "Smithing", "Alchemy", "Tailoring", "Carpentry",
  "Mining", "Herbalism", "Enchanting", "Archaeology", "Beast Taming",
  "Gardening", "Potion Making", "Trap Making", "Lockpicking", "Persuasion"
];

export const generateRankedSkills = (count: number = 3): RankedSkill[] => {
  const skills: RankedSkill[] = [];
  const available = [...lifeSkills];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    const skillName = available.splice(index, 1)[0];
    
    skills.push({
      name: skillName,
      rank: "Novice",
      experience: 0
    });
  }
  
  return skills;
};

export const getRankFromExperience = (exp: number): SkillRank => {
  if (exp >= 10000) return "Grandmaster";
  if (exp >= 5000) return "Master";
  if (exp >= 2000) return "Expert";
  if (exp >= 500) return "Journeyman";
  if (exp >= 100) return "Apprentice";
  return "Novice";
};

export const gainSkillExperience = (skill: RankedSkill, amount: number): RankedSkill => {
  const newExp = skill.experience + amount;
  return {
    ...skill,
    experience: newExp,
    rank: getRankFromExperience(newExp)
  };
};
