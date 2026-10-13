import { appIcons } from './appAssets';

export const LEVEL_TIERS = [
  { level: 1, name: "Seedling", xpRequired: 0, icon: appIcons.doubleLeaf },
  { level: 2, name: "Sprout", xpRequired: 300, icon: appIcons.leave },
  { level: 3, name: "Sapling", xpRequired: 700, icon: appIcons.sapling },
  { level: 4, name: "Bush", xpRequired: 1300, icon: appIcons.bush },
  { level: 5, name: "Grove", xpRequired: 2200, icon: appIcons.tree },
  { level: 6, name: "Forest", xpRequired: 3400, icon: appIcons.forest },
  { level: 7, name: "Rainforest", xpRequired: 4500, icon: appIcons.palm },
  { level: 8, name: "Eco Warrior", xpRequired: 5000, icon: appIcons.sword },
  { level: 9, name: "Earth Guardian", xpRequired: 7000, icon: appIcons.earth },
  { level: 10, name: "Planet Champion", xpRequired: 10000, icon: appIcons.trophy },
];

export const getUserLevelInfo = (xp) => {
  const userXp = xp || 0;
  let currentLevelIndex = 0;
  
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (userXp >= LEVEL_TIERS[i].xpRequired) {
      currentLevelIndex = i;
    } else {
      break;
    }
  }

  const currentLevel = LEVEL_TIERS[currentLevelIndex];
  const isMaxLevel = currentLevelIndex === LEVEL_TIERS.length - 1;
  const nextLevel = isMaxLevel ? currentLevel : LEVEL_TIERS[currentLevelIndex + 1];
  
  const xpNeededForNext = isMaxLevel ? 1 : (nextLevel.xpRequired - currentLevel.xpRequired);
  const progressPercent = isMaxLevel ? 100 : Math.min(((userXp - currentLevel.xpRequired) / xpNeededForNext) * 100, 100);
  const xpToNext = isMaxLevel ? 0 : nextLevel.xpRequired - userXp;

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpToNext,
    isMaxLevel
  };
};
