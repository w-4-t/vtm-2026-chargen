window.VTM_DATA = window.VTM_DATA || {};
window.VTM_DATA.rules = {
  version: "0.3.0",
  tier: "neonate",
  standard: {
    lifepaths: 2,
    lifepathSkillDots: 5,
    freeSkillDots: 8,
    skillCap: 3,
    lifepathFocuses: 2,
    freeFocuses: 2,
    focusBonus: 2,
    maxFocusesPerSkill: 2,
    lifepathResourceDots: 3,
    freeResourceDots: 3,
    startingMerits: 1,
    disciplineDots: [2,1],
    startingHumanity: 7,
    minConvictions: 1,
    maxConvictions: 3
  },
  young: {
    lifepaths: 1,
    xpMultiplier: 2
  },
  advancement: {
    skillNewRatingMultiplier: 3,
    newFocusCost: 5,
    baseSessionXpGuideline: 10,
    note: "Base XP is an ST pacing guideline, not a fixed award. Advancement is usage-based."
  },
  attributes: {
    chargenDistribution: {"4":1,"3":3,"2":4,"1":1}
  },
  generationBloodPotency: {
    "10":2,"11":2,"12":1,"13":1
  }
};
