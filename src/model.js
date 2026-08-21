(function(global){
  const DATA = global.VTM_DATA;
  const clone = v => JSON.parse(JSON.stringify(v));
  const skillIds = () => DATA.skills.map(s=>s.id);
  const blankDots = () => Object.fromEntries(skillIds().map(id=>[id,0]));
  const attrIds = ["strength","dexterity","stamina","charisma","manipulation","composure","intelligence","wits","resolve"];
  const blankAttrs = () => Object.fromEntries(attrIds.map(id=>[id,null]));
  const disciplineIds = () => DATA.disciplines.map(d=>d.id);
  const blankDisciplines = () => ({primary:"",secondary:"",ratings:{},powers:{}});
  const makeLpSlot = () => ({id:"",skillDots:blankDots(),focuses:[],resourceDots:{}});
  const makeConviction = () => ({conviction:"",touchstone:"",relationship:""});

  function newState(){
    return {
      schemaVersion:3,
      identity:{
        name:"",aliases:"",concept:"",chronicle:"",clan:"",generation:13,young:false,
        sire:"",apparentAge:"",actualAge:"",ageAtEmbrace:"",embraceDate:"",nostalgicDecade:"",
        appearance:"",distinguishingFeatures:"",ambition:"",desire:""
      },
      attributes:blankAttrs(),
      lifepaths:[makeLpSlot(),makeLpSlot()],
      freeSkills:blankDots(),
      freeFocuses:[],
      freeResources:[],
      disciplines:blankDisciplines(),
      merit:"",
      flaws:[],
      humanity:{value:DATA.rules.standard.startingHumanity,stains:0,convictions:[makeConviction()]},
      feedingPattern:"",
      notes:"",
      changeLog:[]
    };
  }

  const getLp = id => DATA.lifepaths.find(x=>x.id===id)||null;
  const getClan = id => DATA.clans.find(x=>x.id===id)||null;
  const getSkill = id => DATA.skills.find(x=>x.id===id)||null;
  const getDiscipline = id => DATA.disciplines.find(x=>x.id===id)||null;
  const disciplineIdByName = name => (DATA.disciplines.find(d=>d.name.toLowerCase()===String(name||"").toLowerCase())||{}).id||"";
  const activeLpCount = state => state.identity.young ? 1 : DATA.rules.standard.lifepaths;
  const log = (state,msg) => { state.changeLog.unshift({at:new Date().toISOString(),msg}); state.changeLog=state.changeLog.slice(0,20); };

  function totalSkill(state,id){ return state.lifepaths.reduce((n,lp)=>n+(Number(lp.skillDots?.[id])||0),0)+(Number(state.freeSkills?.[id])||0); }
  function totalSkills(state){ return Object.fromEntries(skillIds().map(id=>[id,totalSkill(state,id)])); }
  function allFocuses(state){ return [...state.lifepaths.flatMap(x=>x.focuses||[]),...(state.freeFocuses||[])]; }
  function focusCountOnSkill(state,skill){ return allFocuses(state).filter(f=>f.skill===skill).length; }

  function setClan(state,id){
    const next=getClan(id); if(!next) return false;
    if(state.identity.clan===id) return true;
    const old=getClan(state.identity.clan), cleared=[];
    if(state.disciplines && (state.disciplines.primary||state.disciplines.secondary||Object.keys(state.disciplines.ratings||{}).length)){
      state.disciplines=blankDisciplines(); cleared.push("Disciplines and powers");
    }
    if(state.merit){
      const merit=DATA.merits.find(m=>m.id===state.merit);
      if(merit?.clans && !merit.clans.includes(id)){state.merit="";cleared.push("starting Merit");}
    }
    state.identity.clan=id;
    log(state,`${old?old.name:"Clan"} changed to ${next.name}${cleared.length?`; cleared ${cleared.join(", ")}`:""}.`);
    reconcile(state); return true;
  }

  function setIdentityField(state,key,value){ if(!(key in state.identity)) return false; state.identity[key]=value; return true; }
  function setGeneration(state,value){ value=Number(value); if(![10,11,12,13].includes(value)) return false; state.identity.generation=value; return true; }
  function setYoung(state,young){
    young=!!young; if(state.identity.young===young) return true; state.identity.young=young;
    if(young){
      const lp=state.lifepaths[1];
      if(lp.id||Object.values(lp.skillDots||{}).some(Boolean)||(lp.focuses||[]).length||Object.values(lp.resourceDots||{}).some(Boolean)){
        state.lifepaths[1]=makeLpSlot(); log(state,"Young character enabled: Lifepath 2 and its dependent choices were cleared.");
      }
    }
    reconcile(state); return true;
  }

  function attributeCounts(state){
    const counts={1:0,2:0,3:0,4:0};
    for(const v of Object.values(state.attributes||{})) if(v!=null && counts[v]!=null) counts[v]++;
    return counts;
  }
  function attributeSlotsLeft(state){
    const used=attributeCounts(state), out={};
    for(const [rating,max] of Object.entries(DATA.rules.attributes.chargenDistribution)) out[rating]=max-(used[rating]||0);
    return out;
  }
  function setAttribute(state,id,rating){
    if(!attrIds.includes(id)) return false;
    if(rating===null||rating===""||rating===0){state.attributes[id]=null;return true;}
    rating=Number(rating); const quota=DATA.rules.attributes.chargenDistribution[String(rating)]; if(!quota) return false;
    const old=state.attributes[id]; if(old===rating) return true;
    const used=Object.entries(state.attributes).filter(([k])=>k!==id).filter(([,v])=>v===rating).length;
    if(used>=quota) return false;
    state.attributes[id]=rating; return true;
  }
  function attributesComplete(state){
    const vals=Object.values(state.attributes||{}); if(vals.some(v=>v==null)) return false;
    const counts=attributeCounts(state);
    return Object.entries(DATA.rules.attributes.chargenDistribution).every(([r,n])=>counts[r]===n);
  }

  function setLifepath(state,index,id){
    if(index<0||index>1||!getLp(id)) return false;
    const old=state.lifepaths[index]; if(old.id===id) return true;
    const had=old.id||Object.values(old.skillDots||{}).some(Boolean)||(old.focuses||[]).length||Object.values(old.resourceDots||{}).some(Boolean);
    state.lifepaths[index]=makeLpSlot(); state.lifepaths[index].id=id;
    if(had) log(state,`Lifepath ${index+1} changed: its Skill dots, Focuses, and Resource dots were cleared.`);
    reconcile(state); return true;
  }
  function setLpSkillDot(state,index,skill,value){
    const lp=getLp(state.lifepaths[index]?.id); if(!lp||!lp.skills.includes(skill)) return false;
    value=Math.max(0,Math.min(DATA.rules.standard.lifepathSkillDots,Number(value)||0));
    const old=state.lifepaths[index].skillDots[skill]||0;
    const spent=Object.values(state.lifepaths[index].skillDots).reduce((a,b)=>a+(Number(b)||0),0)-old+value;
    if(spent>DATA.rules.standard.lifepathSkillDots) return false;
    if(totalSkill(state,skill)-old+value>DATA.rules.standard.skillCap) return false;
    state.lifepaths[index].skillDots[skill]=value; reconcile(state); return true;
  }
  function setFreeSkillDot(state,skill,value){
    if(!skillIds().includes(skill)) return false;
    value=Math.max(0,Math.min(DATA.rules.standard.freeSkillDots,Number(value)||0));
    const old=state.freeSkills[skill]||0;
    const spent=Object.values(state.freeSkills).reduce((a,b)=>a+(Number(b)||0),0)-old+value;
    if(spent>DATA.rules.standard.freeSkillDots) return false;
    if(totalSkill(state,skill)-old+value>DATA.rules.standard.skillCap) return false;
    state.freeSkills[skill]=value; reconcile(state); return true;
  }

  const normalizeFocusName = x => String(x||"").trim().replace(/\s+/g," ");
  function canAddFocus(state,skill){ return totalSkill(state,skill)>=1 && focusCountOnSkill(state,skill)<DATA.rules.standard.maxFocusesPerSkill; }
  function focusExists(state,skill,name){ name=normalizeFocusName(name).toLowerCase(); return allFocuses(state).some(f=>f.skill===skill&&String(f.name).toLowerCase()===name); }
  function addLpFocus(state,index,skill,name){
    const lp=getLp(state.lifepaths[index]?.id); name=normalizeFocusName(name);
    if(!lp||!lp.skills.includes(skill)||!name||!canAddFocus(state,skill)||focusExists(state,skill,name)) return false;
    if(state.lifepaths[index].focuses.length>=DATA.rules.standard.lifepathFocuses) return false;
    state.lifepaths[index].focuses.push({skill,name}); return true;
  }
  function addFreeFocus(state,skill,name){
    name=normalizeFocusName(name);
    if(!name||!canAddFocus(state,skill)||focusExists(state,skill,name)||state.freeFocuses.length>=DATA.rules.standard.freeFocuses) return false;
    state.freeFocuses.push({skill,name}); return true;
  }
  function removeFocus(state,scope,index,focusIndex){
    if(scope==="free") state.freeFocuses.splice(focusIndex,1); else state.lifepaths[index]?.focuses.splice(focusIndex,1);
    return true;
  }

  function setLpResourceDot(state,index,key,value){
    const lp=getLp(state.lifepaths[index]?.id); if(!lp||!lp.resources.some(r=>r.key===key)) return false;
    value=Math.max(0,Math.min(5,Number(value)||0)); const old=state.lifepaths[index].resourceDots[key]||0;
    const spent=Object.values(state.lifepaths[index].resourceDots).reduce((a,b)=>a+(Number(b)||0),0)-old+value;
    if(spent>DATA.rules.standard.lifepathResourceDots) return false;
    state.lifepaths[index].resourceDots[key]=value; return true;
  }
  function addFreeResource(state,type,label,dots){
    if(!DATA.resourceTypes.some(r=>r.id===type)) return false;
    dots=Math.max(1,Math.min(DATA.rules.standard.freeResourceDots,Number(dots)||1));
    const spent=state.freeResources.reduce((n,r)=>n+(Number(r.dots)||0),0); if(spent+dots>DATA.rules.standard.freeResourceDots) return false;
    state.freeResources.push({id:`free_${Date.now()}_${Math.random().toString(16).slice(2)}`,type,label:String(label||"").trim(),dots}); return true;
  }
  function removeFreeResource(state,id){ const i=state.freeResources.findIndex(r=>r.id===id); if(i<0)return false; state.freeResources.splice(i,1);return true; }

  function clanDisciplineIds(state){
    const c=getClan(state.identity.clan); if(!c||c.id==="caitiff") return [];
    return c.disciplines.map(disciplineIdByName).filter(Boolean);
  }
  function disciplineRating(state,id){ return Number(state.disciplines?.ratings?.[id])||0; }
  function setDisciplineAllocation(state,primary,secondary){
    if(!getDiscipline(primary)||!getDiscipline(secondary)||primary===secondary) return false;
    const c=getClan(state.identity.clan); if(!c) return false;
    if(c.id!=="caitiff"){
      const allowed=clanDisciplineIds(state); if(!allowed.includes(primary)||!allowed.includes(secondary)) return false;
    }
    const oldP=state.disciplines?.powers||{};
    state.disciplines.primary=primary; state.disciplines.secondary=secondary;
    state.disciplines.ratings={[primary]:2,[secondary]:1}; state.disciplines.powers={};
    for(const id of [primary,secondary]){
      const max=state.disciplines.ratings[id];
      const old=(oldP[id]||[]).slice(0,max).filter(p=>powerEntryEligible(state,id,p));
      state.disciplines.powers[id]=old;
    }
    reconcileDisciplines(state); return true;
  }
  function requirementsMet(state,req){
    if(!req) return true;
    return Object.entries(req).every(([id,n])=>disciplineRating(state,id)>=Number(n));
  }
  function eligiblePowers(state,disciplineId){
    const d=getDiscipline(disciplineId), rating=disciplineRating(state,disciplineId); if(!d||rating<1) return [];
    return d.powers.filter(p=>p.level<=rating&&requirementsMet(state,p.requires));
  }
  function powerEntryEligible(state,disciplineId,p){
    if(!p) return false; if(p.manual) return !!String(p.name||"").trim();
    const d=getDiscipline(disciplineId), def=d?.powers.find(x=>x.id===p.id); return !!def&&def.level<=disciplineRating(state,disciplineId)&&requirementsMet(state,def.requires);
  }
  function setPowerAt(state,disciplineId,slot,value,manualName=""){
    const rating=disciplineRating(state,disciplineId); slot=Number(slot); if(rating<1||slot<0||slot>=rating) return false;
    state.disciplines.powers[disciplineId]=state.disciplines.powers[disciplineId]||[];
    let entry=null;
    if(value==="__manual__"){
      const name=String(manualName||"").trim(); if(!name)return false; entry={id:null,name,manual:true};
    }else{
      const p=eligiblePowers(state,disciplineId).find(x=>x.id===value); if(!p)return false; entry={id:p.id,name:p.name,manual:false};
    }
    const arr=state.disciplines.powers[disciplineId];
    if(arr.some((p,i)=>i!==slot&&String(p.name).toLowerCase()===String(entry.name).toLowerCase())) return false;
    arr[slot]=entry; return true;
  }
  function clearPowerAt(state,disciplineId,slot){ if(state.disciplines.powers[disciplineId]) state.disciplines.powers[disciplineId][slot]=null; }
  function reconcileDisciplines(state){
    const c=getClan(state.identity.clan); if(!c){state.disciplines=blankDisciplines();return;}
    const {primary,secondary}=state.disciplines;
    if(!primary&&!secondary)return;
    const allowed=c.id==="caitiff"?disciplineIds():clanDisciplineIds(state);
    if(!allowed.includes(primary)||!allowed.includes(secondary)||primary===secondary){state.disciplines=blankDisciplines();return;}
    state.disciplines.ratings={[primary]:2,[secondary]:1};
    for(const id of Object.keys(state.disciplines.powers||{})) if(![primary,secondary].includes(id)) delete state.disciplines.powers[id];
    for(const id of [primary,secondary]){
      const max=disciplineRating(state,id), arr=(state.disciplines.powers[id]||[]).slice(0,max);
      state.disciplines.powers[id]=arr.map(p=>powerEntryEligible(state,id,p)?p:null);
    }
  }

  function setMerit(state,id){ if(id&&!DATA.merits.some(m=>m.id===id))return false; state.merit=id||"";return true; }
  function addFlaw(state,name,description){ name=String(name||"").trim(); if(!name)return false; state.flaws.push({id:`flaw_${Date.now()}_${Math.random().toString(16).slice(2)}`,name,description:String(description||"").trim()});return true; }
  function removeFlaw(state,idOrIndex){ const i=typeof idOrIndex==="number"?idOrIndex:state.flaws.findIndex(f=>f.id===idOrIndex); if(i<0)return false;state.flaws.splice(i,1);return true; }

  function setHumanity(state,value){ value=Number(value); if(value<1||value>10)return false; state.humanity.value=value;return true; }
  function addConviction(state){ if(state.humanity.convictions.length>=DATA.rules.standard.maxConvictions)return false; state.humanity.convictions.push(makeConviction());return true; }
  function removeConviction(state,index){ if(state.humanity.convictions.length<=DATA.rules.standard.minConvictions)return false;state.humanity.convictions.splice(index,1);return true; }
  function setConvictionField(state,index,key,value){ const c=state.humanity.convictions[index]; if(!c||!["conviction","touchstone","relationship"].includes(key))return false;c[key]=String(value||"");return true; }

  function derived(state){
    const stamina=Number(state.attributes.stamina)||0, composure=Number(state.attributes.composure)||0, resolve=Number(state.attributes.resolve)||0;
    const gen=String(state.identity.generation||"");
    return {
      health: stamina?stamina+3:null,
      willpower: (composure&&resolve)?composure+resolve:null,
      bloodPotency: DATA.rules.generationBloodPotency[gen] ?? null,
      humanity:Number(state.humanity.value)||DATA.rules.standard.startingHumanity,
      stains:Number(state.humanity.stains)||0
    };
  }

  function reconcile(state){
    const removed=[];
    if(state.identity.young) state.lifepaths[1]=makeLpSlot();
    state.lifepaths.forEach((slot)=>{
      const lp=getLp(slot.id); const before=(slot.focuses||[]).length;
      slot.focuses=(slot.focuses||[]).filter(f=>lp&&lp.skills.includes(f.skill)&&totalSkill(state,f.skill)>=1);
      if(before!==slot.focuses.length) removed.push(`${before-slot.focuses.length} Lifepath Focus(es)`);
      if(lp){
        for(const sid of skillIds()) if(!lp.skills.includes(sid)) slot.skillDots[sid]=0;
        for(const k of Object.keys(slot.resourceDots||{})) if(!lp.resources.some(r=>r.key===k)) delete slot.resourceDots[k];
      }else{slot.skillDots=blankDots();slot.resourceDots={};slot.focuses=[];}
    });
    const bf=state.freeFocuses.length; state.freeFocuses=state.freeFocuses.filter(f=>totalSkill(state,f.skill)>=1);
    if(bf!==state.freeFocuses.length) removed.push(`${bf-state.freeFocuses.length} free Focus(es)`);
    for(const sid of skillIds()){
      while(focusCountOnSkill(state,sid)>DATA.rules.standard.maxFocusesPerSkill){
        let idx=state.freeFocuses.map(f=>f.skill).lastIndexOf(sid);
        if(idx>=0){state.freeFocuses.splice(idx,1);removed.push(`1 Focus on ${getSkill(sid)?.name||sid}`);continue;}
        let done=false;
        for(let li=state.lifepaths.length-1;li>=0&&!done;li--){idx=state.lifepaths[li].focuses.map(f=>f.skill).lastIndexOf(sid);if(idx>=0){state.lifepaths[li].focuses.splice(idx,1);removed.push(`1 Focus on ${getSkill(sid)?.name||sid}`);done=true;}}
        if(!done)break;
      }
    }
    reconcileDisciplines(state);
    if(removed.length) log(state,`Dependent choices reconciled: removed ${removed.join(", ")}.`);
  }

  function stepValidation(state,step){
    const issues=[];
    if(step==="clan"&&!getClan(state.identity.clan)) issues.push("Choose and confirm a Clan.");
    if(step==="attributes"&&!attributesComplete(state)) issues.push("Assign all nine Attribute slots using exactly 4×1, 3×3, 2×4, 1×1.");
    if(step==="lifepaths"){
      for(let i=0;i<activeLpCount(state);i++) if(!getLp(state.lifepaths[i].id)) issues.push(`Choose Lifepath ${i+1}.`);
    }
    if(step==="skills"){
      for(let i=0;i<activeLpCount(state);i++){
        const lp=getLp(state.lifepaths[i].id); if(!lp){issues.push(`Choose Lifepath ${i+1} first.`);continue;}
        const n=sumDots(state.lifepaths[i].skillDots); if(n!==DATA.rules.standard.lifepathSkillDots)issues.push(`${lp.name}: spend exactly ${DATA.rules.standard.lifepathSkillDots} Skill dots (${n} spent).`);
      }
      const f=sumDots(state.freeSkills); if(f!==DATA.rules.standard.freeSkillDots)issues.push(`Spend exactly ${DATA.rules.standard.freeSkillDots} free Skill dots (${f} spent).`);
    }
    if(step==="focuses"){
      for(let i=0;i<activeLpCount(state);i++){
        const lp=getLp(state.lifepaths[i].id); if(lp&&state.lifepaths[i].focuses.length!==DATA.rules.standard.lifepathFocuses)issues.push(`${lp.name}: choose exactly ${DATA.rules.standard.lifepathFocuses} Focuses.`);
      }
      if(state.freeFocuses.length!==DATA.rules.standard.freeFocuses)issues.push(`Choose exactly ${DATA.rules.standard.freeFocuses} free Focuses.`);
    }
    if(step==="resources"){
      for(let i=0;i<activeLpCount(state);i++){
        const lp=getLp(state.lifepaths[i].id); if(lp){const n=sumDots(state.lifepaths[i].resourceDots);if(n!==DATA.rules.standard.lifepathResourceDots)issues.push(`${lp.name}: spend exactly ${DATA.rules.standard.lifepathResourceDots} Resource dots (${n} spent).`);}
      }
      const n=state.freeResources.reduce((a,r)=>a+(Number(r.dots)||0),0);if(n!==DATA.rules.standard.freeResourceDots)issues.push(`Spend exactly ${DATA.rules.standard.freeResourceDots} free Resource dots (${n} spent).`);
    }
    if(step==="disciplines"){
      const c=getClan(state.identity.clan); if(!c)issues.push("Choose Clan first.");
      else if(!state.disciplines.primary||!state.disciplines.secondary)issues.push("Choose a 2-dot Discipline and a different 1-dot Discipline.");
      else for(const id of [state.disciplines.primary,state.disciplines.secondary]){
        const rating=disciplineRating(state,id), arr=state.disciplines.powers[id]||[];
        for(let i=0;i<rating;i++) if(!arr[i]?.name)issues.push(`${getDiscipline(id)?.name}: choose Power ${i+1} of ${rating}.`);
      }
    }
    if(step==="humanity"){
      const cs=state.humanity.convictions||[];
      if(cs.length<DATA.rules.standard.minConvictions||cs.length>DATA.rules.standard.maxConvictions)issues.push("Choose 1–3 Convictions.");
      cs.forEach((c,i)=>{if(!c.conviction.trim())issues.push(`Conviction ${i+1} is empty.`);if(!c.touchstone.trim())issues.push(`Touchstone ${i+1} is empty.`);});
    }
    return {ok:issues.length===0,issues};
  }
  function sumDots(o){return Object.values(o||{}).reduce((a,b)=>a+(Number(b)||0),0);}

  function validation(state){
    const issues=[],warnings=[];
    for(const step of ["clan","attributes","lifepaths","skills","focuses","resources","disciplines","humanity"]) issues.push(...stepValidation(state,step).issues);
    for(const [sid,v] of Object.entries(totalSkills(state))) if(v>DATA.rules.standard.skillCap)issues.push(`${getSkill(sid)?.name||sid} exceeds chargen cap ${DATA.rules.standard.skillCap}.`);
    if(!state.merit)warnings.push("No starting Merit selected. Baseline target is 1; the current Merit list remains provisional.");
    if(!state.identity.name.trim())warnings.push("Character name is empty.");
    if(!state.feedingPattern.trim())warnings.push("Feeding pattern is not described; Predator Type is intentionally not required.");
    return {issues:[...new Set(issues)],warnings,ok:issues.length===0};
  }

  function resourceSummary(state){
    const rows=[];
    state.lifepaths.slice(0,activeLpCount(state)).forEach(slot=>{const lp=getLp(slot.id);if(!lp)return;lp.resources.forEach(r=>{const dots=Number(slot.resourceDots[r.key])||0;if(dots)rows.push({source:lp.name,type:r.type,label:r.label||"",dots});});});
    state.freeResources.forEach(r=>rows.push({source:"Free",type:r.type,label:r.label||"",dots:Number(r.dots)||0}));
    return rows;
  }
  function aggregatedResources(state){
    const groups=new Map();
    for(const r of resourceSummary(state)){
      const key=r.type==="wealth"?"wealth":`${r.type}::${String(r.label||"").trim().toLowerCase()}`;
      if(!groups.has(key))groups.set(key,{type:r.type,label:r.label||"",dots:0,sources:[]});
      const g=groups.get(key);g.dots+=r.dots;g.sources.push({source:r.source,dots:r.dots});
    }
    return [...groups.values()];
  }

  function migrateState(raw){
    const base=newState(), s=raw&&typeof raw==="object"?clone(raw):{};
    s.identity={...base.identity,...(s.identity||{})};
    if(s.identity.clan&&!getClan(s.identity.clan)){const byName=DATA.clans.find(c=>c.name.toLowerCase()===String(s.identity.clan).toLowerCase());s.identity.clan=byName?byName.id:"";}
    if(![10,11,12,13].includes(Number(s.identity.generation)))s.identity.generation=13;else s.identity.generation=Number(s.identity.generation);
    s.attributes={...blankAttrs(),...(s.attributes||{})}; for(const id of attrIds){const v=Number(s.attributes[id]);s.attributes[id]=[1,2,3,4].includes(v)?v:null;}
    if(!Array.isArray(s.lifepaths))s.lifepaths=[];while(s.lifepaths.length<2)s.lifepaths.push(makeLpSlot());s.lifepaths=s.lifepaths.slice(0,2).map(slot=>({id:slot?.id||"",skillDots:{...blankDots(),...(slot?.skillDots||{})},focuses:Array.isArray(slot?.focuses)?slot.focuses:[],resourceDots:slot?.resourceDots||{}}));
    s.freeSkills={...blankDots(),...(s.freeSkills||{})};s.freeFocuses=Array.isArray(s.freeFocuses)?s.freeFocuses:[];s.freeResources=Array.isArray(s.freeResources)?s.freeResources:[];
    s.disciplines=s.disciplines&&typeof s.disciplines==="object"?{...blankDisciplines(),...s.disciplines,ratings:s.disciplines.ratings||{},powers:s.disciplines.powers||{}}:blankDisciplines();
    s.merit=typeof s.merit==="string"?s.merit:"";s.flaws=Array.isArray(s.flaws)?s.flaws.map((f,i)=>({...f,id:f.id||`legacy_flaw_${i}`})):[];
    s.humanity=s.humanity&&typeof s.humanity==="object"?{...base.humanity,...s.humanity}:clone(base.humanity);if(!Array.isArray(s.humanity.convictions)||!s.humanity.convictions.length)s.humanity.convictions=[makeConviction()];s.humanity.convictions=s.humanity.convictions.slice(0,DATA.rules.standard.maxConvictions).map(c=>({...makeConviction(),...c}));
    s.feedingPattern=typeof s.feedingPattern==="string"?s.feedingPattern:"";s.notes=typeof s.notes==="string"?s.notes:"";s.changeLog=Array.isArray(s.changeLog)?s.changeLog:[];
    s.schemaVersion=3;reconcile(s);return s;
  }
  const exportState = state => JSON.stringify(state,null,2);
  const importState = text => migrateState(JSON.parse(text));

  global.VTM_MODEL={newState,migrateState,clone,getLp,getClan,getSkill,getDiscipline,disciplineIdByName,activeLpCount,totalSkill,totalSkills,allFocuses,focusCountOnSkill,setClan,setIdentityField,setGeneration,setYoung,attributeCounts,attributeSlotsLeft,setAttribute,attributesComplete,setLifepath,setLpSkillDot,setFreeSkillDot,addLpFocus,addFreeFocus,removeFocus,setLpResourceDot,addFreeResource,removeFreeResource,clanDisciplineIds,disciplineRating,setDisciplineAllocation,eligiblePowers,setPowerAt,clearPowerAt,setMerit,addFlaw,removeFlaw,setHumanity,addConviction,removeConviction,setConvictionField,derived,reconcile,stepValidation,validation,resourceSummary,aggregatedResources,exportState,importState};
})(window);
