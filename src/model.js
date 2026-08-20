(function(global){
  const DATA = global.VTM_DATA;
  const skillIds = () => DATA.skills.map(s=>s.id);
  const blankDots = () => Object.fromEntries(skillIds().map(id=>[id,0]));
  const defaultAttrs = () => ({strength:2,dexterity:3,stamina:2,charisma:2,manipulation:1,composure:3,intelligence:3,wits:2,resolve:4});
  const clone = v => JSON.parse(JSON.stringify(v));

  function newState(){
    return {
      schemaVersion:1,
      identity:{name:"",concept:"",clan:"Brujah",generation:13,young:false},
      attributes:defaultAttrs(),
      lifepaths:[makeLpSlot(),makeLpSlot()],
      freeSkills:blankDots(),
      freeFocuses:[],
      freeResources:[],
      merit:"",
      flaws:[],
      feedingPattern:"",
      notes:"",
      changeLog:[]
    };
  }
  function makeLpSlot(){ return {id:"",skillDots:blankDots(),focuses:[],resourceDots:{}}; }
  function getLp(id){ return DATA.lifepaths.find(x=>x.id===id) || null; }
  function totalSkill(state,id){
    return state.lifepaths.reduce((n,lp)=>n+(lp.skillDots[id]||0),0)+(state.freeSkills[id]||0);
  }
  function totalSkills(state){ return Object.fromEntries(skillIds().map(id=>[id,totalSkill(state,id)])); }
  function allFocuses(state){ return [...state.lifepaths.flatMap(x=>x.focuses),...state.freeFocuses]; }
  function focusCountOnSkill(state,skill){ return allFocuses(state).filter(f=>f.skill===skill).length; }
  function lpFocusBudget(state,index){ return DATA.rules.standard.lifepathFocuses; }
  function activeLpCount(state){ return state.identity.young ? 1 : DATA.rules.standard.lifepaths; }
  function log(state,msg){ state.changeLog.unshift({at:new Date().toISOString(),msg}); state.changeLog=state.changeLog.slice(0,12); }

  function setYoung(state,young){
    if(state.identity.young===young) return;
    state.identity.young=young;
    if(young){
      const lp=state.lifepaths[1];
      if(lp.id || Object.values(lp.skillDots).some(Boolean) || lp.focuses.length || Object.values(lp.resourceDots).some(Boolean)){
        state.lifepaths[1]=makeLpSlot();
        log(state,"Young character enabled: Lifepath 2 and all dependent choices from it were cleared.");
      }
    }
    reconcile(state);
  }

  function setLifepath(state,index,id){
    const old=state.lifepaths[index];
    if(old.id===id) return;
    const had=old.id || Object.values(old.skillDots).some(Boolean) || old.focuses.length || Object.values(old.resourceDots).some(Boolean);
    state.lifepaths[index]=makeLpSlot();
    state.lifepaths[index].id=id;
    if(had) log(state,`Lifepath ${index+1} changed: its Skill dots, Focuses, and Resource dots were cleared to prevent stale dependent choices.`);
    reconcile(state);
  }

  function setLpSkillDot(state,index,skill,value){
    const lp=getLp(state.lifepaths[index].id); if(!lp || !lp.skills.includes(skill)) return false;
    value=Math.max(0,Math.min(DATA.rules.standard.lifepathSkillDots,Number(value)||0));
    const old=state.lifepaths[index].skillDots[skill]||0;
    const lpSpent=Object.values(state.lifepaths[index].skillDots).reduce((a,b)=>a+b,0)-old+value;
    if(lpSpent>DATA.rules.standard.lifepathSkillDots) return false;
    const otherTotal=totalSkill(state,skill)-old;
    if(otherTotal+value>DATA.rules.standard.skillCap) return false;
    state.lifepaths[index].skillDots[skill]=value;
    reconcile(state);
    return true;
  }

  function setFreeSkillDot(state,skill,value){
    value=Math.max(0,Math.min(DATA.rules.standard.freeSkillDots,Number(value)||0));
    const old=state.freeSkills[skill]||0;
    const spent=Object.values(state.freeSkills).reduce((a,b)=>a+b,0)-old+value;
    if(spent>DATA.rules.standard.freeSkillDots) return false;
    const other=totalSkill(state,skill)-old;
    if(other+value>DATA.rules.standard.skillCap) return false;
    state.freeSkills[skill]=value;
    reconcile(state);
    return true;
  }

  function normalizeFocusName(x){ return (x||"").trim().replace(/\s+/g," "); }
  function canAddFocus(state,skill){ return totalSkill(state,skill)>=1 && focusCountOnSkill(state,skill)<DATA.rules.standard.maxFocusesPerSkill; }
  function addLpFocus(state,index,skill,name){
    const lp=getLp(state.lifepaths[index].id); name=normalizeFocusName(name);
    if(!lp || !lp.skills.includes(skill) || !name || !canAddFocus(state,skill)) return false;
    if(state.lifepaths[index].focuses.length>=DATA.rules.standard.lifepathFocuses) return false;
    if(allFocuses(state).some(f=>f.skill===skill && f.name.toLowerCase()===name.toLowerCase())) return false;
    state.lifepaths[index].focuses.push({skill,name}); return true;
  }
  function addFreeFocus(state,skill,name){
    name=normalizeFocusName(name);
    if(!name || !canAddFocus(state,skill) || state.freeFocuses.length>=DATA.rules.standard.freeFocuses) return false;
    if(allFocuses(state).some(f=>f.skill===skill && f.name.toLowerCase()===name.toLowerCase())) return false;
    state.freeFocuses.push({skill,name}); return true;
  }
  function removeFocus(state,scope,index,focusIndex){
    if(scope==="free") state.freeFocuses.splice(focusIndex,1); else state.lifepaths[index].focuses.splice(focusIndex,1);
  }

  function setLpResourceDot(state,index,key,value){
    const lp=getLp(state.lifepaths[index].id); if(!lp || !lp.resources.some(r=>r.key===key)) return false;
    value=Math.max(0,Math.min(5,Number(value)||0));
    const old=state.lifepaths[index].resourceDots[key]||0;
    const spent=Object.values(state.lifepaths[index].resourceDots).reduce((a,b)=>a+b,0)-old+value;
    if(spent>DATA.rules.standard.lifepathResourceDots) return false;
    state.lifepaths[index].resourceDots[key]=value; return true;
  }
  function addFreeResource(state,type,label,dots){
    dots=Math.max(1,Math.min(3,Number(dots)||1));
    const spent=state.freeResources.reduce((n,r)=>n+r.dots,0);
    if(spent+dots>DATA.rules.standard.freeResourceDots) return false;
    state.freeResources.push({id:`free_${Date.now()}_${Math.random().toString(16).slice(2)}`,type,label:(label||"").trim(),dots}); return true;
  }

  function reconcile(state){
    const removed=[];
    // Inactive second lifepath.
    if(state.identity.young) state.lifepaths[1]=makeLpSlot();
    // Remove LP focuses that no longer belong or whose total skill fell to 0.
    state.lifepaths.forEach((slot,i)=>{
      const lp=getLp(slot.id);
      const before=slot.focuses.length;
      slot.focuses=slot.focuses.filter(f=>lp && lp.skills.includes(f.skill) && totalSkill(state,f.skill)>=1);
      if(before!==slot.focuses.length) removed.push(`${before-slot.focuses.length} Lifepath Focus(es)`);
      if(lp){
        for(const sid of skillIds()) if(!lp.skills.includes(sid)) slot.skillDots[sid]=0;
        for(const k of Object.keys(slot.resourceDots)) if(!lp.resources.some(r=>r.key===k)) delete slot.resourceDots[k];
      } else {
        slot.skillDots=blankDots(); slot.resourceDots={}; slot.focuses=[];
      }
    });
    const bf=state.freeFocuses.length;
    state.freeFocuses=state.freeFocuses.filter(f=>totalSkill(state,f.skill)>=1);
    if(bf!==state.freeFocuses.length) removed.push(`${bf-state.freeFocuses.length} free Focus(es)`);
    // Enforce global max Focuses/Skill by dropping newest free, then LP2, then LP1.
    for(const sid of skillIds()){
      while(focusCountOnSkill(state,sid)>DATA.rules.standard.maxFocusesPerSkill){
        let idx=state.freeFocuses.map(f=>f.skill).lastIndexOf(sid);
        if(idx>=0){state.freeFocuses.splice(idx,1);removed.push(`1 Focus on ${sid}`);continue;}
        let done=false;
        for(let li=state.lifepaths.length-1;li>=0&&!done;li--){
          idx=state.lifepaths[li].focuses.map(f=>f.skill).lastIndexOf(sid);
          if(idx>=0){state.lifepaths[li].focuses.splice(idx,1);removed.push(`1 Focus on ${sid}`);done=true;}
        }
        if(!done) break;
      }
    }
    if(removed.length) log(state,`Dependent choices reconciled: removed ${removed.join(", ")}.`);
  }

  function validation(state){
    const issues=[]; const warnings=[];
    const attrs=Object.values(state.attributes); const dist=DATA.rules.attributes.chargenDistribution;
    for(const [rating,count] of Object.entries(dist)) if(attrs.filter(v=>v===Number(rating)).length!==count) issues.push(`Attributes must contain exactly ${count} rating ${rating}.`);
    const n=activeLpCount(state);
    for(let i=0;i<n;i++){
      const slot=state.lifepaths[i], lp=getLp(slot.id);
      if(!lp){issues.push(`Choose Lifepath ${i+1}.`);continue;}
      const ss=Object.values(slot.skillDots).reduce((a,b)=>a+b,0);
      if(ss!==DATA.rules.standard.lifepathSkillDots) issues.push(`${lp.name}: spend exactly ${DATA.rules.standard.lifepathSkillDots} Lifepath Skill dots (${ss} spent).`);
      if(slot.focuses.length!==DATA.rules.standard.lifepathFocuses) issues.push(`${lp.name}: choose exactly ${DATA.rules.standard.lifepathFocuses} Lifepath Focuses (${slot.focuses.length} chosen).`);
      const rs=Object.values(slot.resourceDots).reduce((a,b)=>a+b,0);
      if(rs!==DATA.rules.standard.lifepathResourceDots) issues.push(`${lp.name}: spend exactly ${DATA.rules.standard.lifepathResourceDots} Resource dots (${rs} spent).`);
    }
    const free=Object.values(state.freeSkills).reduce((a,b)=>a+b,0); if(free!==DATA.rules.standard.freeSkillDots) issues.push(`Spend exactly ${DATA.rules.standard.freeSkillDots} free Skill dots (${free} spent).`);
    if(state.freeFocuses.length!==DATA.rules.standard.freeFocuses) issues.push(`Choose exactly ${DATA.rules.standard.freeFocuses} free Focuses (${state.freeFocuses.length} chosen).`);
    const fr=state.freeResources.reduce((n,r)=>n+r.dots,0); if(fr!==DATA.rules.standard.freeResourceDots) issues.push(`Spend exactly ${DATA.rules.standard.freeResourceDots} free Resource dots (${fr} spent).`);
    for(const [sid,v] of Object.entries(totalSkills(state))) if(v>DATA.rules.standard.skillCap) issues.push(`${sid} exceeds chargen cap ${DATA.rules.standard.skillCap}.`);
    if(!state.merit) warnings.push("No starting Merit selected. Baseline target is 1, but the Merit list is deliberately provisional.");
    if(!state.identity.name.trim()) warnings.push("Character name is empty.");
    if(!state.feedingPattern.trim()) warnings.push("Feeding pattern is not described; Predator Type is intentionally not required.");
    return {issues,warnings,ok:issues.length===0};
  }

  function resourceSummary(state){
    const rows=[];
    state.lifepaths.forEach((slot,i)=>{ const lp=getLp(slot.id); if(!lp) return; lp.resources.forEach(r=>{const dots=slot.resourceDots[r.key]||0;if(dots)rows.push({source:lp.name,type:r.type,label:r.label,dots});});});
    state.freeResources.forEach(r=>rows.push({source:"Free",type:r.type,label:r.label,dots:r.dots}));
    return rows;
  }

  function exportState(state){ return JSON.stringify(state,null,2); }
  function importState(text){ const s=JSON.parse(text); reconcile(s); return s; }

  global.VTM_MODEL={newState,getLp,totalSkill,totalSkills,allFocuses,focusCountOnSkill,activeLpCount,setYoung,setLifepath,setLpSkillDot,setFreeSkillDot,addLpFocus,addFreeFocus,removeFocus,setLpResourceDot,addFreeResource,reconcile,validation,resourceSummary,exportState,importState,clone};
})(window);
