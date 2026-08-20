window.VTM_DATA = window.VTM_DATA || {};
window.VTM_DATA.lifepaths = [
  {
    id:"artist",name:"Artist",type:"mortal",tier:"mortal",
    description:"Writer, actor, painter, designer, sculptor, or another creative professional.",
    skills:["awareness","craft","expression","knowledge","persuasion"],
    focusHints:[{skill:"expression",name:"Choose an art form"},{skill:"knowledge",name:"Art"}],
    resources:[
      {key:"wealth",type:"wealth",label:""},
      {key:"contact_art_dealer",type:"contact",label:"Art Dealer"},
      {key:"ally_patron",type:"ally",label:"Patron"}
    ]
  },
  {
    id:"corporate_executive",name:"Corporate Executive",type:"mortal",tier:"mortal",
    description:"Corporate leadership, negotiation, and organizational power.",
    skills:["awareness","investigation","knowledge","persuasion","subterfuge"],
    focusHints:[{skill:"investigation",name:"Gossip"},{skill:"knowledge",name:"Business"},{skill:"subterfuge",name:"Deceit"}],
    resources:[
      {key:"wealth",type:"wealth",label:""},
      {key:"property",type:"property",label:""},
      {key:"haven",type:"haven",label:""}
    ]
  },
  {
    id:"criminal",name:"Criminal",type:"mortal",tier:"mortal",
    description:"You made your living by breaking the law.",
    skills:["athletics","awareness","fighting","sabotage","subterfuge"],
    focusHints:[{skill:"athletics",name:"Running"},{skill:"fighting",name:"Fighting Dirty"},{skill:"sabotage",name:"Burglary"}],
    resources:[
      {key:"contact_fencer",type:"contact",label:"Fencer"},
      {key:"wealth",type:"wealth",label:""},
      {key:"mask",type:"mask",label:""}
    ]
  },
  {
    id:"holy_person",name:"Holy Person",type:"mortal",tier:"mortal",
    description:"You dedicated part of your life to the study and dissemination of a religious faith.",
    skills:["awareness","expression","knowledge","medicine","persuasion"],
    focusHints:[{skill:"expression",name:"Oratory"},{skill:"knowledge",name:"Religion"}],
    resources:[
      {key:"contact_local_church",type:"contact",label:"Local Church"},
      {key:"status_church_member",type:"status",label:"Mortal: Church Member"},
      {key:"wealth",type:"wealth",label:""}
    ]
  },
  {
    id:"hunter",name:"Hunter",type:"mortal",tier:"mortal",
    description:"You tracked prey, set traps, and survived where your quarry hid.",
    skills:["awareness","craft","fighting","shooting","survival"],
    focusHints:[{skill:"craft",name:"Traps"},{skill:"survival",name:"Wilderness Hunting"}],
    resources:[
      {key:"haven",type:"haven",label:""},
      {key:"ally_fellow_hunter",type:"ally",label:"Fellow Hunter"},
      {key:"repository_armory",type:"repository",label:"Armory"}
    ]
  },
  {
    id:"military",name:"Military",type:"mortal",tier:"mortal",
    description:"Military service with extensive training in war and survival.",
    skills:["athletics","fighting","medicine","shooting","survival"],
    focusHints:[{skill:"medicine",name:"First Aid"},{skill:"shooting",name:"Heavy Weapons"}],
    resources:[
      {key:"repository_weapons",type:"repository",label:"Weapons"},
      {key:"contact_military",type:"contact",label:"Military"},
      {key:"ally_former_comrades",type:"ally",label:"Former Comrades"}
    ]
  },
  {
    id:"politician",name:"Politician",type:"mortal",tier:"mortal",
    description:"Politics, negotiation, policy, and public attention.",
    skills:["awareness","investigation","knowledge","persuasion","subterfuge"],
    focusHints:[{skill:"awareness",name:"Insight"},{skill:"knowledge",name:"Politics"},{skill:"persuasion",name:"Negotiation"},{skill:"subterfuge",name:"Deceit"}],
    resources:[
      {key:"wealth",type:"wealth",label:""},
      {key:"status_political",type:"status",label:"Political"},
      {key:"haven",type:"haven",label:""}
    ]
  },
  {
    id:"technician",name:"Technician",type:"mortal",tier:"mortal",
    description:"Practical tools, repair, improvisation, and dismantling.",
    skills:["athletics","craft","fighting","sabotage","subterfuge"],
    focusHints:[{skill:"craft",name:"Improvised"},{skill:"sabotage",name:"Security Systems"}],
    resources:[
      {key:"vehicle",type:"vehicle",label:""},
      {key:"repository_tools",type:"repository",label:"Tools"},
      {key:"haven",type:"haven",label:""}
    ]
  },
  {
    id:"blood_deliverer",name:"Blood Deliverer",type:"vampire",tier:"neonate",
    description:"You acquired and delivered blood to other vampires.",
    skills:["athletics","awareness","persuasion","sabotage","subterfuge"],
    focusHints:[{skill:"subterfuge",name:"Skulking"}],
    resources:[
      {key:"vehicle",type:"vehicle",label:""},
      {key:"wealth",type:"wealth",label:""},
      {key:"contact",type:"contact",label:""}
    ]
  },
  {
    id:"clean_up_crew",name:"Clean Up Crew",type:"vampire",tier:"neonate",
    description:"You made vampiric messes and evidence disappear.",
    skills:["athletics","fighting","investigation","sabotage","subterfuge"],
    focusHints:[{skill:"investigation",name:"Crime Scene"}],
    resources:[
      {key:"contact_vampiric_authority",type:"contact",label:"Vampiric Authority"},
      {key:"vehicle",type:"vehicle",label:""},
      {key:"repository_cleaning",type:"repository",label:"Cleaning Materials"}
    ]
  },
  {
    id:"hound",name:"Hound",type:"vampire",tier:"neonate",
    description:"Muscle for a local vampiric authority; also usable for Sweeper or Ductus.",
    skills:["fighting","investigation","shooting","subterfuge","survival"],
    focusHints:[{skill:"investigation",name:"Streetwise"},{skill:"survival",name:"Urban Tracking"}],
    resources:[
      {key:"status_sect",type:"status",label:"Sect"},
      {key:"repository_armory",type:"repository",label:"Armory"},
      {key:"contact_vampiric_authority",type:"contact",label:"Vampiric Authority"}
    ]
  }
];
