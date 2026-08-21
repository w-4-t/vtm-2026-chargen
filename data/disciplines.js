window.VTM_DATA = window.VTM_DATA || {};
window.VTM_DATA.disciplines = [
  {id:"animalism",name:"Animalism",summary:"Command, understand, and channel animals and the Beast.",powers:[
    {id:"bond_famulus",name:"Bond Famulus",level:1},{id:"sense_the_beast",name:"Sense the Beast",level:1},
    {id:"feral_whispers",name:"Feral Whispers",level:2},
    {id:"animal_succulence",name:"Animal Succulence",level:3},{id:"quell_the_beast",name:"Quell the Beast",level:3},
    {id:"subsume_the_spirit",name:"Subsume the Spirit",level:4},
    {id:"animal_dominion",name:"Animal Dominion",level:5},{id:"drawing_out_the_beast",name:"Drawing Out the Beast",level:5}
  ]},
  {id:"auspex",name:"Auspex",summary:"Heightened perception, supernatural insight, and access to thoughts and impressions.",powers:[
    {id:"heightened_senses",name:"Heightened Senses",level:1},{id:"sense_the_unseen",name:"Sense the Unseen",level:1},
    {id:"premonition",name:"Premonition",level:2},
    {id:"scry_the_soul",name:"Scry the Soul",level:3},{id:"share_the_senses",name:"Share the Senses",level:3},
    {id:"spirits_touch",name:"Spirit's Touch",level:4},
    {id:"clairvoyance",name:"Clairvoyance",level:5},{id:"telepathy",name:"Telepathy",level:5}
  ]},
  {id:"blood_sorcery",name:"Blood Sorcery",summary:"Manipulate vitae directly through learned sorcerous techniques. Rituals are tracked separately from powers.",powers:[
    {id:"a_taste_for_blood",name:"A Taste for Blood",level:1},{id:"corrosive_vitae",name:"Corrosive Vitae",level:1},
    {id:"extinguish_vitae",name:"Extinguish Vitae",level:2},
    {id:"blood_of_potency",name:"Blood of Potency",level:3},{id:"scorpions_touch",name:"Scorpion's Touch",level:3},
    {id:"theft_of_vitae",name:"Theft of Vitae",level:4},
    {id:"baals_caress",name:"Baal's Caress",level:5},{id:"cauldron_of_blood",name:"Cauldron of Blood",level:5}
  ]},
  {id:"celerity",name:"Celerity",summary:"Supernatural speed, reaction, balance, and precision.",powers:[
    {id:"cats_grace",name:"Cat's Grace",level:1},{id:"rapid_reflexes",name:"Rapid Reflexes",level:1},
    {id:"fleetness",name:"Fleetness",level:2},
    {id:"blink",name:"Blink",level:3},{id:"traversal",name:"Traversal",level:3},
    {id:"draught_of_elegance",name:"Draught of Elegance",level:4},{id:"unerring_aim",name:"Unerring Aim",level:4,requires:{auspex:2}},
    {id:"lightning_strike",name:"Lightning Strike",level:5},{id:"split_second",name:"Split Second",level:5}
  ]},
  {id:"dominate",name:"Dominate",summary:"Impose commands, edit memories, and override another mind.",powers:[
    {id:"cloud_memory",name:"Cloud Memory",level:1},{id:"compel",name:"Compel",level:1},
    {id:"mesmerize",name:"Mesmerize",level:2},{id:"dementation",name:"Dementation",level:2,requires:{obfuscate:2}},
    {id:"the_forgetful_mind",name:"The Forgetful Mind",level:3},{id:"submerged_directive",name:"Submerged Directive",level:3},
    {id:"rationalize",name:"Rationalize",level:4},
    {id:"mass_manipulation",name:"Mass Manipulation",level:5},{id:"terminal_decree",name:"Terminal Decree",level:5}
  ]},
  {id:"fortitude",name:"Fortitude",summary:"Supernatural durability and resistance of body and mind.",powers:[
    {id:"resilience",name:"Resilience",level:1},{id:"unswayable_mind",name:"Unswayable Mind",level:1},
    {id:"toughness",name:"Toughness",level:2},
    {id:"defy_bane",name:"Defy Bane",level:3},{id:"fortify_the_inner_facade",name:"Fortify the Inner Facade",level:3},
    {id:"draught_of_endurance",name:"Draught of Endurance",level:4},
    {id:"flesh_of_marble",name:"Flesh of Marble",level:5},{id:"prowess_from_pain",name:"Prowess from Pain",level:5}
  ]},
  {id:"obfuscate",name:"Obfuscate",summary:"Hide presence, alter perception, and pass unseen or unrecognized.",powers:[
    {id:"cloak_of_shadows",name:"Cloak of Shadows",level:1},{id:"silence_of_death",name:"Silence of Death",level:1},
    {id:"unseen_passage",name:"Unseen Passage",level:2},
    {id:"ghost_in_the_machine",name:"Ghost in the Machine",level:3},{id:"mask_of_a_thousand_faces",name:"Mask of a Thousand Faces",level:3},
    {id:"conceal",name:"Conceal",level:4,requires:{auspex:3}},{id:"vanish",name:"Vanish",level:4},
    {id:"cloak_the_gathering",name:"Cloak the Gathering",level:5},{id:"impostors_guise",name:"Impostor's Guise",level:5}
  ]},
  {id:"oblivion",name:"Oblivion",summary:"Manipulate deathly energies, shadows, decay, and the boundary with the dead.",powers:[
    {id:"ashes_to_ashes",name:"Ashes to Ashes",level:1},{id:"binding_fetter",name:"The Binding Fetter",level:1},{id:"oblivions_sight",name:"Oblivion's Sight",level:1},{id:"shadow_cloak",name:"Shadow Cloak",level:1},
    {id:"arms_of_ahriman",name:"Arms of Ahriman",level:2},{id:"where_the_veil_thins",name:"Where the Veil Thins",level:2},
    {id:"aura_of_decay",name:"Aura of Decay",level:3},{id:"shadow_perspective",name:"Shadow Perspective",level:3},{id:"touch_of_oblivion",name:"Touch of Oblivion",level:3},
    {id:"necrotic_plague",name:"Necrotic Plague",level:4},{id:"stygian_shroud",name:"Stygian Shroud",level:4},
    {id:"tenebrous_avatar",name:"Tenebrous Avatar",level:5},{id:"withering_spirit",name:"Withering Spirit",level:5}
  ],note:"Oblivion is consolidated across V5 supplements; manual power entry remains available for source-specific options."},
  {id:"potence",name:"Potence",summary:"Supernatural strength and force.",powers:[
    {id:"lethal_body",name:"Lethal Body",level:1},{id:"soaring_leap",name:"Soaring Leap",level:1},
    {id:"prowess",name:"Prowess",level:2},
    {id:"brutal_feed",name:"Brutal Feed",level:3},{id:"spark_of_rage",name:"Spark of Rage",level:3,requires:{presence:3}},{id:"uncanny_grip",name:"Uncanny Grip",level:3},
    {id:"draught_of_might",name:"Draught of Might",level:4},
    {id:"earthshock",name:"Earthshock",level:5},{id:"fist_of_caine",name:"Fist of Caine",level:5}
  ]},
  {id:"presence",name:"Presence",summary:"Supernatural magnetism, dread, attraction, and emotional command.",powers:[
    {id:"awe",name:"Awe",level:1},{id:"daunt",name:"Daunt",level:1},
    {id:"lingering_kiss",name:"Lingering Kiss",level:2},
    {id:"dread_gaze",name:"Dread Gaze",level:3},{id:"entrancement",name:"Entrancement",level:3},
    {id:"irresistible_voice",name:"Irresistible Voice",level:4,requires:{dominate:1}},{id:"summon",name:"Summon",level:4},
    {id:"majesty",name:"Majesty",level:5},{id:"star_magnetism",name:"Star Magnetism",level:5}
  ]},
  {id:"protean",name:"Protean",summary:"Transform the vampiric body and adapt it toward predatory forms.",powers:[
    {id:"eyes_of_the_beast",name:"Eyes of the Beast",level:1},{id:"weight_of_the_feather",name:"Weight of the Feather",level:1},
    {id:"feral_weapons",name:"Feral Weapons",level:2},
    {id:"earth_meld",name:"Earth Meld",level:3},{id:"shapechange",name:"Shapechange",level:3},
    {id:"metamorphosis",name:"Metamorphosis",level:4},
    {id:"mist_form",name:"Mist Form",level:5},{id:"the_unfettered_heart",name:"The Unfettered Heart",level:5}
  ]}
];
