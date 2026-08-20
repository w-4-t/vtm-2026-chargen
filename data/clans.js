window.VTM_DATA = window.VTM_DATA || {};
window.VTM_DATA.clans = [
  {
    id:"banu_haqim", name:"Banu Haqim", short:"BHQ", category:"clan",
    tagline:"Judges, hunters, and blood-bound arbiters.",
    description:"Banu Haqim often frame themselves as judges and executioners among Kindred. Their blood favors speed, concealment, and sorcery, making them dangerous investigators and precise predators.",
    disciplines:["Blood Sorcery","Celerity","Obfuscate"],
    bane:{name:"Blood Addiction",summary:"Vampire vitae is dangerously tempting to the clan; feeding from other Kindred can provoke loss of control."},
    compulsion:{name:"Judgment",summary:"The vampire becomes driven to identify and punish a transgression according to their own moral code."}
  },
  {
    id:"brujah", name:"Brujah", short:"BRU", category:"clan",
    tagline:"Passion, rebellion, and force directed against what should change.",
    description:"Brujah are associated with rebels, agitators, philosophers, organizers, and people unwilling to accept authority merely because it exists. Their Blood amplifies passion and makes violence dangerously close at hand.",
    disciplines:["Celerity","Potence","Presence"],
    bane:{name:"Violent Temper",summary:"Brujah have greater difficulty resisting fury when provoked; their Blood makes rage unusually immediate."},
    compulsion:{name:"Rebellion",summary:"The vampire is driven to challenge authority, expectations, or an established order in the current situation."}
  },
  {
    id:"gangrel", name:"Gangrel", short:"GAN", category:"clan",
    tagline:"Survivors whose Blood remains close to the animal world.",
    description:"Gangrel are adaptable predators and survivors, often comfortable where social structures weaken and practical competence matters most. Their vampirism visibly echoes the Beast when control slips.",
    disciplines:["Animalism","Fortitude","Protean"],
    bane:{name:"Bestial Features",summary:"Frenzy can leave temporary animalistic physical traits that are difficult to conceal."},
    compulsion:{name:"Feral Impulses",summary:"The vampire falls back on an animal response to the immediate problem, making complex human behavior harder."}
  },
  {
    id:"hecata", name:"Hecata", short:"HEC", category:"clan",
    tagline:"The family of death, ghosts, inheritance, and necromantic power.",
    description:"The Hecata are bound together by death, family structures, occult inheritance, and dealings with the dead. Their power combines supernatural perception, endurance, and Oblivion.",
    disciplines:["Auspex","Fortitude","Oblivion"],
    bane:{name:"Painful Kiss",summary:"The Hecata Kiss brings pain instead of the usual vampiric ecstasy, making discreet feeding more difficult."},
    compulsion:{name:"Morbidity",summary:"The vampire becomes preoccupied with death and must pursue knowledge about mortality, corpses, or the cause of a death."}
  },
  {
    id:"lasombra", name:"Lasombra", short:"LAS", category:"clan",
    tagline:"Ambition, command, and mastery of darkness.",
    description:"Lasombra tend to value will, competence, and the ability to seize control. They are political predators whose relationship with Oblivion is mirrored by a curse that makes modern reflections and technology unreliable around them.",
    disciplines:["Dominate","Oblivion","Potence"],
    bane:{name:"Distorted Image",summary:"Reflections and recordings fail to represent the vampire normally, and modern technology can react poorly to their presence."},
    compulsion:{name:"Ruthlessness",summary:"The vampire becomes fixated on achieving the immediate goal through the most direct and uncompromising route."}
  },
  {
    id:"malkavian", name:"Malkavian", short:"MAL", category:"clan",
    tagline:"Perception fractured by a Blood that sees connections others miss.",
    description:"Malkavians are marked by altered perception and the Cobweb connecting the clan. Their insights may be extraordinary, but the Blood also imposes persistent distortions that can become acute under stress.",
    disciplines:["Auspex","Dominate","Obfuscate"],
    bane:{name:"Fractured Perspective",summary:"Each Malkavian carries a persistent psychological distortion that can impose mechanical penalties when it becomes acute."},
    compulsion:{name:"Delusion",summary:"The vampire becomes temporarily consumed by an altered interpretation of reality that shapes their behavior."}
  },
  {
    id:"ministry", name:"The Ministry", short:"MIN", category:"clan",
    tagline:"Liberation through temptation, transgression, and broken restraints.",
    description:"The Ministry tests convictions and encourages others to abandon imposed limits. They thrive in secrecy, temptation, and social influence, while their Blood reacts badly to sunlight even by vampiric standards.",
    disciplines:["Obfuscate","Presence","Protean"],
    bane:{name:"Sunlight Sensitivity",summary:"Sunlight is especially destructive to members of the Ministry."},
    compulsion:{name:"Transgression",summary:"The vampire is driven to make someone break a personal, social, or moral boundary."}
  },
  {
    id:"nosferatu", name:"Nosferatu", short:"NOS", category:"clan",
    tagline:"Secrets survive where appearances fail.",
    description:"Nosferatu cannot pass easily for ordinary mortals, but their curse has pushed the clan toward concealment, surveillance, information networks, and mastery of what others would rather keep hidden.",
    disciplines:["Animalism","Obfuscate","Potence"],
    bane:{name:"Repulsive",summary:"The clan's curse visibly marks them and makes ordinary human presentation difficult or impossible without supernatural concealment."},
    compulsion:{name:"Cryptophilia",summary:"The vampire becomes driven to uncover a secret that someone nearby is trying to keep hidden."}
  },
  {
    id:"ravnos", name:"Ravnos", short:"RAV", category:"clan",
    tagline:"Restless survivors, tricksters, and risk-takers.",
    description:"Modern Ravnos are survivors of catastrophe, associated with movement, deception, and refusing predictable patterns. Their Blood punishes remaining in one place too long.",
    disciplines:["Animalism","Obfuscate","Presence"],
    bane:{name:"Doomed",summary:"Resting repeatedly in the same place becomes dangerous; the clan is pushed toward movement and changing havens."},
    compulsion:{name:"Tempting Fate",summary:"The vampire is driven to confront unnecessary risk or solve the situation through a daring, dangerous approach."}
  },
  {
    id:"salubri", name:"Salubri", short:"SAL", category:"clan",
    tagline:"Rare vampires defined by empathy, endurance, and persecution.",
    description:"Salubri are scarce and widely mistrusted, with traditions emphasizing healing, spiritual discipline, or warrior ethics depending on lineage. Their vitae is particularly tempting to other vampires.",
    disciplines:["Auspex","Dominate","Fortitude"],
    bane:{name:"Hunted Blood",summary:"When Salubri use certain powers their third eye can manifest and their vitae becomes especially difficult for nearby vampires to resist."},
    compulsion:{name:"Affective Empathy",summary:"The vampire becomes overwhelmed by another person's suffering and is driven to address it."}
  },
  {
    id:"toreador", name:"Toreador", short:"TOR", category:"clan",
    tagline:"Passion, aesthetics, creation, and obsession.",
    description:"Toreador are drawn toward beauty, performance, craft, people, and experiences capable of producing intense emotional response. Their Blood can turn aesthetic fascination into immobilizing fixation.",
    disciplines:["Auspex","Celerity","Presence"],
    bane:{name:"Aesthetic Fixation",summary:"The vampire can become transfixed by beauty or another personally compelling aesthetic experience."},
    compulsion:{name:"Obsession",summary:"The vampire becomes fixated on a person, object, or experience and has difficulty directing attention elsewhere."}
  },
  {
    id:"tremere", name:"Tremere", short:"TRE", category:"clan",
    tagline:"Vampiric sorcerers built from stolen immortality and disciplined study.",
    description:"The Tremere began as mages who transformed themselves into vampires. Their identity remains tied to occult study, hierarchy, controlled knowledge, and Blood Sorcery even after the destruction of the old Pyramid's certainty.",
    disciplines:["Auspex","Blood Sorcery","Dominate"],
    bane:{name:"Deficient Blood Bonds",summary:"The Tremere curse interferes with the normal ability to Blood Bond other vampires, reflecting the clan's damaged relationship with vitae."},
    compulsion:{name:"Perfectionism",summary:"The vampire becomes consumed by the need to perform a task correctly and can struggle to move on from an imperfect result."}
  },
  {
    id:"tzimisce", name:"Tzimisce", short:"TZI", category:"clan",
    tagline:"Ownership, transformation, and the terrible plasticity of flesh.",
    description:"Tzimisce are intensely territorial and proprietary. Their relationship with possession can apply to land, people, institutions, collections, or bodies, while Protean supports the clan's infamous traditions of flesh transformation.",
    disciplines:["Animalism","Dominate","Protean"],
    bane:{name:"Grounded",summary:"A Tzimisce needs to rest surrounded by something they consider personally owned or claimed; separation from it impairs them."},
    compulsion:{name:"Covetousness",summary:"The vampire becomes driven to possess, control, or establish ownership over something significant in the scene."}
  },
  {
    id:"ventrue", name:"Ventrue", short:"VEN", category:"clan",
    tagline:"Rule, obligation, hierarchy, and selective predation.",
    description:"Ventrue cultivate authority, responsibility, pedigree, and command. Their Blood gives them formidable powers of control and resilience, while also restricting the vessels from which they can feed.",
    disciplines:["Dominate","Fortitude","Presence"],
    bane:{name:"Rarefied Palate",summary:"Each Ventrue can feed only from a narrow category of mortal vessels; other blood is rejected."},
    compulsion:{name:"Arrogance",summary:"The vampire becomes driven to assert superiority and establish that their judgment or status deserves recognition."}
  },
  {
    id:"caitiff", name:"Caitiff", short:"CAI", category:"special",
    tagline:"Clanless Kindred whose Blood does not express a recognized lineage.",
    description:"Caitiff lack the clear markers of a major clan. They are mechanically and socially distinct from ordinary clan characters and require special handling for Disciplines and sect prejudice.",
    disciplines:["Special selection"],
    bane:{name:"Clanless",summary:"Caitiff do not inherit a normal clan Bane, but their status and Discipline advancement follow special V5 rules."},
    compulsion:{name:"None (clan)",summary:"Caitiff do not have a normal clan Compulsion."}
  }
];
