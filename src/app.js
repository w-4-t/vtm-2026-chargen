(function(){
  const D=window.VTM_DATA, M=window.VTM_MODEL;
  const steps=[
    ['clan','Clan'],['identity','Identity'],['attributes','Attributes'],['lifepaths','Lifepaths'],
    ['skills','Skills'],['focuses','Focuses'],['resources','Resources'],['disciplines','Disciplines'],
    ['traits','Merits / Flaws'],['humanity','Humanity'],['feeding','Feeding'],['review','Review']
  ];
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sum=o=>Object.values(o||{}).reduce((a,b)=>a+(Number(b)||0),0);
  const skill=id=>D.skills.find(x=>x.id===id), clan=id=>D.clans.find(x=>x.id===id), rtype=id=>D.resourceTypes.find(x=>x.id===id), disc=id=>D.disciplines.find(x=>x.id===id);
  const attrLabels={strength:'Strength',dexterity:'Dexterity',stamina:'Stamina',charisma:'Charisma',manipulation:'Manipulation',composure:'Composure',intelligence:'Intelligence',wits:'Wits',resolve:'Resolve'};
  const attrGroups=[['Physical',['strength','dexterity','stamina']],['Social',['charisma','manipulation','composure']],['Mental',['intelligence','wits','resolve']]];

  let state=loadLocal()||M.newState(), current=0, clanView='list', previewClanId=state.identity.clan||'', lastLogCount=state.changeLog.length;
  let focusSelections={lp0:'',lp1:'',free:''};

  function loadLocal(){try{const x=localStorage.getItem('vtm_v5v6_chargen');return x?M.importState(x):null}catch(e){return null}}
  function autosave(){try{localStorage.setItem('vtm_v5v6_chargen',M.exportState(state))}catch(e){}}
  function saveLocal(){autosave();flash('Character state saved locally on this device.','good');}
  function flash(msg,kind='info'){const f=$('#flash');if(!f)return;f.className=`notice ${kind} flash show`;f.textContent=msg;clearTimeout(f._t);f._t=setTimeout(()=>f.classList.remove('show'),5000)}
  function maybeLog(){if(state.changeLog.length>lastLogCount){flash(state.changeLog[0].msg,'warn');lastLogCount=state.changeLog.length;}}
  function activeKey(){return steps[current][0]}

  function renderProgress(){
    const p=$('#progress'), oldX=p.scrollLeft;
    p.innerHTML=steps.map((s,i)=>`<button class="stepbtn ${i===current?'active':''}" data-goto="${i}">${i+1}. ${esc(s[1])}</button>`).join('');
    $$('#progress [data-goto]').forEach(b=>b.onclick=()=>navigate(Number(b.dataset.goto)));
    const active=p.querySelector('.stepbtn.active');
    if(active) p.scrollLeft=Math.max(0,active.offsetLeft-(p.clientWidth-active.clientWidth)/2); else p.scrollLeft=oldX;
  }
  function setActiveSection(){
    $$('.section').forEach(el=>el.classList.toggle('active',el.dataset.step===activeKey()));
    $('#backBtn').disabled=current===0&&clanView!=='detail';
    $('#nextBtn').textContent=current===steps.length-1?'Готово':'Далі →';
  }
  function renderCurrent(preserve=false){
    const y=window.scrollY, key=activeKey();
    const fn={clan:renderClan,identity:renderIdentity,attributes:renderAttributes,lifepaths:renderLifepaths,skills:renderSkills,focuses:renderFocuses,resources:renderResources,disciplines:renderDisciplines,traits:renderTraits,humanity:renderHumanity,feeding:renderFeeding,review:renderReview}[key];
    fn(); renderProgress(); setActiveSection(); maybeLog(); autosave();
    if(preserve)requestAnimationFrame(()=>window.scrollTo(0,y));
  }
  function navigate(target){
    target=Math.max(0,Math.min(steps.length-1,target));
    if(target>current){
      for(let i=current;i<target;i++){
        const v=M.stepValidation(state,steps[i][0]); if(!v.ok){flash(v.issues[0],'danger');return;}
      }
    }
    current=target; clanView='list'; renderCurrent(false); window.scrollTo(0,0);
  }
  function next(){
    const v=M.stepValidation(state,activeKey()); if(!v.ok){flash(v.issues[0],'danger');return;}
    if(current<steps.length-1)navigate(current+1); else flash('Character sheet is ready for review/export.','good');
  }
  function back(){
    if(current===0&&clanView==='detail'){clanView='list';renderCurrent(true);return;}
    if(current>0)navigate(current-1);
  }

  function renderClan(){
    const root=$('#clanUI');
    if(clanView==='detail'){
      const c=clan(previewClanId); if(!c){clanView='list';return renderClan();}
      root.innerHTML=`<div class="card clanheroCard">
        <div class="clanhero"><div class="clansigil">${esc(c.short)}</div><div><h2>${esc(c.name)}</h2><div class="clantag">${esc(c.tagline)}</div><div class="disciplines">${c.disciplines.map(x=>`<span class="discipline">${esc(x)}</span>`).join('')}</div></div></div>
        <p class="clanbody">${esc(c.description)}</p>
        <div class="traitgrid"><div class="traitbox"><div class="traitlabel">Bane</div><div class="traitname">${esc(c.bane.name)}</div><div class="small">${esc(c.bane.summary)}</div></div><div class="traitbox"><div class="traitlabel">Compulsion</div><div class="traitname">${esc(c.compulsion.name)}</div><div class="small">${esc(c.compulsion.summary)}</div></div></div>
        <div class="clanactions"><button class="btn" id="clanListBack">← All Clans</button><button class="btn primary" id="chooseClan">${state.identity.clan===c.id?'Selected':'Choose '+esc(c.name)}</button></div>
      </div>`;
      $('#clanListBack').onclick=()=>{clanView='list';renderCurrent(true)};
      $('#chooseClan').onclick=()=>{M.setClan(state,c.id);autosave();maybeLog();renderClan();renderProgress();};
      return;
    }
    root.innerHTML=`<div class="clanintro"><h1>Choose your Clan</h1><p class="small">Clan is the first upstream choice. It defines the character's vampiric lineage and determines the available clan Disciplines. Open a Clan to review it before confirming.</p></div><div class="clangrid">${D.clans.map(c=>`<button class="clancard ${state.identity.clan===c.id?'selected':''}" data-clan="${c.id}"><div class="clansigil">${esc(c.short)}</div><div><div class="clanname">${esc(c.name)}</div><div class="clantag">${esc(c.tagline)}</div><div class="clandisc">${esc(c.disciplines.join(' · '))}</div>${state.identity.clan===c.id?'<div class="selectedMark">✓ Selected</div>':''}</div></button>`).join('')}</div>`;
    $$('#clanUI [data-clan]').forEach(b=>b.onclick=()=>{previewClanId=b.dataset.clan;clanView='detail';renderCurrent(true)});
  }

  function field(label,key,type='text',placeholder=''){
    const val=state.identity[key]??'';
    return `<div class="field"><label>${esc(label)}</label><input data-identity="${key}" type="${type}" value="${esc(val)}" placeholder="${esc(placeholder)}"></div>`;
  }
  function area(label,key,placeholder=''){
    return `<div class="field"><label>${esc(label)}</label><textarea data-identity="${key}" placeholder="${esc(placeholder)}">${esc(state.identity[key]||'')}</textarea></div>`;
  }
  function renderIdentity(){
    const d=M.derived(state), c=clan(state.identity.clan);
    $('#identityUI').innerHTML=`<div class="card"><h2>Identity & Character Details</h2><div class="small">These fields describe the person around the mechanics. Most are informational and can be completed later.</div>
      <div class="grid2">${field('Name','name')}${field('Aliases','aliases')}${field('Concept','concept')}${field('Chronicle','chronicle')}${field('Sire','sire')}</div>
      <div class="grid2"><div class="field"><label>Generation</label><select id="generation">${[10,11,12,13].map(n=>`<option value="${n}" ${state.identity.generation===n?'selected':''}>${n}th Generation</option>`).join('')}</select><div class="fieldhint" id="bpHint">Starting Blood Potency: ${d.bloodPotency??'—'}</div></div><div class="field"><label>Clan</label><div class="readonly">${esc(c?.name||'—')}</div></div></div>
      <div class="switchrow"><input type="checkbox" id="young" ${state.identity.young?'checked':''}><div><b>Young / one-Lifepath character</b><div class="small">Starts genuinely less experienced; no chargen compensation. Catch-up advancement is ×2 actual XP awarded by the ST.</div></div></div>
      <h3>Age & Embrace</h3><div class="grid3">${field('Apparent Age','apparentAge')}${field('Actual Age','actualAge')}${field('Age at Embrace','ageAtEmbrace')}</div><div class="grid2">${field('Embrace Date / Year','embraceDate')}${field('Nostalgic Decade','nostalgicDecade')}</div>
      <h3>Presentation</h3>${area('Appearance','appearance','Build, clothing, general presentation…')}${area('Distinguishing Features','distinguishingFeatures','Scars, tattoos, voice, mannerisms…')}
      <h3>Drives</h3><div class="grid2">${area('Ambition','ambition')}${area('Desire','desire')}</div>
    </div>`;
    $$('#identityUI [data-identity]').forEach(el=>el.oninput=()=>{M.setIdentityField(state,el.dataset.identity,el.value);autosave()});
    $('#generation').onchange=e=>{M.setGeneration(state,e.target.value);$('#bpHint').textContent=`Starting Blood Potency: ${M.derived(state).bloodPotency??'—'}`;autosave()};
    $('#young').onchange=e=>{const had=state.lifepaths[1]?.id;if(e.target.checked&&had&&!confirm('Enabling Young Character will clear Lifepath 2 and all choices sourced from it. Continue?')){e.target.checked=false;return;}M.setYoung(state,e.target.checked);autosave();maybeLog();};
  }

  function renderAttributes(){
    $('#attributesUI').innerHTML=`<div class="card"><h2>Attributes</h2><div class="small">V5 chargen distribution is enforced directly. Select exactly one 4, three 3s, four 2s, and one 1. Ratings whose slots are already used become unavailable.</div>
      <div class="quotaBar" id="attrQuota"></div>
      ${attrGroups.map(([group,ids])=>`<h3>${group}</h3><div class="attrgrid">${ids.map(id=>`<div class="attrpick" data-attrrow="${id}"><div class="attrname">${attrLabels[id]}</div><div class="ratingbuttons">${[1,2,3,4].map(r=>`<button class="ratingbtn" data-attr="${id}" data-rating="${r}">${r}</button>`).join('')}<button class="ratingbtn clear" data-attr="${id}" data-rating="">×</button></div></div>`).join('')}</div>`).join('')}
      <div class="derivedPreview"><div><span>Health</span><b id="attrHealth">—</b><small>Stamina + 3</small></div><div><span>Willpower</span><b id="attrWP">—</b><small>Composure + Resolve</small></div></div>
    </div>`;
    $$('#attributesUI [data-attr]').forEach(b=>b.onclick=()=>{const id=b.dataset.attr,r=b.dataset.rating===''?null:Number(b.dataset.rating);if(!M.setAttribute(state,id,state.attributes[id]===r?null:r)){flash(`No ${r}-dot Attribute slots remain. Change another Attribute first.`,'danger');return;}updateAttributeUI();autosave();});
    updateAttributeUI();
  }
  function updateAttributeUI(){
    const left=M.attributeSlotsLeft(state);
    $('#attrQuota').innerHTML=[4,3,2,1].map(r=>`<span class="quota ${left[r]===0?'done':''}">${r} dots: <b>${left[r]}</b> left</span>`).join('');
    $$('#attributesUI [data-attr]').forEach(b=>{const id=b.dataset.attr,raw=b.dataset.rating,r=raw===''?null:Number(raw),sel=r!==null&&state.attributes[id]===r;b.classList.toggle('selected',sel);if(r!==null)b.disabled=!sel&&left[r]<=0;});
    $$('#attributesUI [data-attrrow]').forEach(row=>row.classList.toggle('unset',state.attributes[row.dataset.attrrow]==null));
    const d=M.derived(state);$('#attrHealth').textContent=d.health??'—';$('#attrWP').textContent=d.willpower??'—';
  }

  function renderLifepaths(){
    const n=M.activeLpCount(state);
    $('#lifepathsUI').innerHTML=`<div class="card"><h2>Lifepaths</h2><div class="small">Each Lifepath represents a meaningful period of lived experience and later supplies 5 Skill dots, 2 Focuses, and 3 Resource dots.</div>${[0,1].slice(0,n).map(i=>{
      const slot=state.lifepaths[i],lp=M.getLp(slot.id);return `<div class="lpselect"><div class="field"><label>Lifepath ${i+1}</label><select data-lpselect="${i}"><option value="">— Choose —</option>${D.lifepaths.map(x=>`<option value="${x.id}" ${x.id===slot.id?'selected':''}>${esc(x.name)} · ${x.type}</option>`).join('')}</select></div>${lp?`<div class="lifepathDetail"><b>${esc(lp.name)}</b><p>${esc(lp.description)}</p><div class="miniLabel">Skills</div><div class="chiprow">${lp.skills.map(id=>`<span class="chip">${esc(skill(id).name)}</span>`).join('')}</div><div class="miniLabel">Focus tips from V6 Lifepath</div><div class="small">${lp.focusHints.length?lp.focusHints.map(h=>`${esc(skill(h.skill)?.name||h.skill)} → ${esc(h.name)}`).join(' · '):'None listed.'}</div><div class="miniLabel">Resources</div><div class="small">${lp.resources.map(r=>`${esc(rtype(r.type)?.name||r.type)}${r.label?`: ${esc(r.label)}`:''}`).join(' · ')}</div></div>`:''}</div>`;}).join('')}</div>`;
    $$('#lifepathsUI [data-lpselect]').forEach(s=>s.onchange=()=>{if(!s.value)return;M.setLifepath(state,Number(s.dataset.lpselect),s.value);renderCurrent(true)});
  }

  function stepper(scope,index,sid,value){return `<div class="stepper" data-stepper data-scope="${scope}" data-index="${index??''}" data-skill="${sid}"><button data-dir="-1">−</button><span class="n">${value}</span><button data-dir="1">+</button></div>`}
  function renderSkills(){
    const n=M.activeLpCount(state); let html=`<div class="card"><h2>Skills</h2><div class="small">The UI enforces each budget and the final chargen cap of ${D.rules.standard.skillCap}. Attribute choice does not affect Skill allocation.</div>`;
    for(let i=0;i<n;i++){
      const lp=M.getLp(state.lifepaths[i].id);if(!lp){html+=`<div class="notice danger">Choose Lifepath ${i+1} first.</div>`;continue;}
      html+=`<h3>${esc(lp.name)} · 5 dots</h3><div class="budget"><span class="pill" id="skillBudgetLp${i}"></span></div>${lp.skills.map(sid=>`<div class="row"><div><div class="rowname">${esc(skill(sid).name)}</div><div class="rowmeta">Final rating: <b data-finalskill="${sid}">${M.totalSkill(state,sid)}</b> / ${D.rules.standard.skillCap}</div></div>${stepper('lp',i,sid,state.lifepaths[i].skillDots[sid]||0)}</div>`).join('')}`;
    }
    html+=`<h3>Free Skills · 8 dots</h3><div class="budget"><span class="pill" id="skillBudgetFree"></span></div>${D.skills.map(s=>`<div class="row"><div><div class="rowname">${esc(s.name)}</div><div class="rowmeta">Final rating: <b data-finalskill="${s.id}">${M.totalSkill(state,s.id)}</b> / ${D.rules.standard.skillCap}</div></div>${stepper('free','',s.id,state.freeSkills[s.id]||0)}</div>`).join('')}</div>`;
    $('#skillsUI').innerHTML=html;
    $$('#skillsUI [data-stepper] button').forEach(b=>b.onclick=()=>{const w=b.closest('[data-stepper]'),sid=w.dataset.skill,dir=Number(b.dataset.dir),scope=w.dataset.scope;const old=scope==='free'?state.freeSkills[sid]:state.lifepaths[Number(w.dataset.index)].skillDots[sid];const ok=scope==='free'?M.setFreeSkillDot(state,sid,old+dir):M.setLpSkillDot(state,Number(w.dataset.index),sid,old+dir);if(!ok){flash('That change would exceed this allocation budget or the final Skill cap of 3.','danger');return;}updateSkillUI();autosave();maybeLog();});
    updateSkillUI();
  }
  function updateSkillUI(){
    for(let i=0;i<M.activeLpCount(state);i++){const el=$(`#skillBudgetLp${i}`);if(el){const n=sum(state.lifepaths[i].skillDots);el.textContent=`${n} / ${D.rules.standard.lifepathSkillDots} spent`;el.className=`pill ${n===D.rules.standard.lifepathSkillDots?'good':'warn'}`;}}
    const free=sum(state.freeSkills),f=$('#skillBudgetFree');if(f){f.textContent=`${free} / ${D.rules.standard.freeSkillDots} spent`;f.className=`pill ${free===D.rules.standard.freeSkillDots?'good':'warn'}`;}
    $$('#skillsUI [data-stepper]').forEach(w=>{const sid=w.dataset.skill,scope=w.dataset.scope,val=scope==='free'?state.freeSkills[sid]:state.lifepaths[Number(w.dataset.index)].skillDots[sid];w.querySelector('.n').textContent=val;const buttons=w.querySelectorAll('button');buttons[0].disabled=val<=0;buttons[1].disabled=M.totalSkill(state,sid)>=D.rules.standard.skillCap;});
    $$('#skillsUI [data-finalskill]').forEach(el=>el.textContent=M.totalSkill(state,el.dataset.finalskill));
  }

  function focusTags(list,scope,index){return list.length?list.map((f,i)=>`<div class="tag"><div><b>${esc(skill(f.skill)?.name||f.skill)}</b> · ${esc(f.name)} <span class="focusBonus">+${D.rules.standard.focusBonus}</span></div><button class="x" data-removefocus="${scope}" data-index="${index??''}" data-fi="${i}" aria-label="Remove">×</button></div>`).join(''):'<div class="emptyLine">No Focuses selected yet.</div>'}
  function focusBucket(scope,index,title,allowed,hints,list,budget){
    const key=scope==='free'?'free':`lp${index}`, valid=allowed.filter(id=>M.totalSkill(state,id)>=1); if(!focusSelections[key]||!valid.includes(focusSelections[key]))focusSelections[key]=valid[0]||'';
    return `<div class="focusBucket" data-focusbucket="${key}" data-scope="${scope}" data-index="${index??''}"><div class="bucketHead"><div><h3>${esc(title)}</h3><div class="small">${list.length} / ${budget} selected</div></div></div>${hints?.length?`<div class="tips"><b>V6 Lifepath tips:</b> ${hints.map(h=>`${esc(skill(h.skill)?.name||h.skill)} → ${esc(h.name)}`).join(' · ')}</div>`:''}<div class="selectedFocuses">${focusTags(list,scope,index)}</div><div class="field"><label>Skill</label><select data-focusskill>${valid.length?valid.map(id=>`<option value="${id}" ${id===focusSelections[key]?'selected':''}>${esc(skill(id).name)} ${M.totalSkill(state,id)} dots</option>`).join(''):'<option value="">No eligible Skills</option>'}</select></div><div class="miniLabel">RAW V6 Focuses for this Skill</div><div class="focusChips" data-focuschips></div><div class="customFocus"><input type="text" data-customfocus placeholder="Custom Focus"><button class="btn" data-addcustom>Add custom</button></div></div>`;
  }
  function renderFocuses(){
    let html=`<div class="card"><h2>Focuses</h2><div class="notice info">In this adaptation a Focus grants <b>+${D.rules.standard.focusBonus} dice</b>. The complete current RAW V6 example list for the selected Skill is shown here. Lifepath tips are shown separately; Custom remains allowed because the final Focus lists are still an open design question.</div>`;
    for(let i=0;i<M.activeLpCount(state);i++){const lp=M.getLp(state.lifepaths[i].id);if(lp)html+=focusBucket('lp',i,lp.name,lp.skills,lp.focusHints,state.lifepaths[i].focuses,D.rules.standard.lifepathFocuses);}
    html+=focusBucket('free',null,'Free Focuses',D.skills.map(s=>s.id),[],state.freeFocuses,D.rules.standard.freeFocuses)+`</div>`;
    $('#focusesUI').innerHTML=html;
    $$('#focusesUI [data-focusbucket]').forEach(updateFocusChoiceArea);
    $$('#focusesUI [data-focusskill]').forEach(s=>s.onchange=()=>{const b=s.closest('[data-focusbucket]');focusSelections[b.dataset.focusbucket]=s.value;updateFocusChoiceArea(b)});
    $$('#focusesUI [data-addcustom]').forEach(b=>b.onclick=()=>{const box=b.closest('[data-focusbucket]'),input=box.querySelector('[data-customfocus]'),sid=box.querySelector('[data-focusskill]').value;if(addFocusFromBucket(box,sid,input.value)){input.value='';renderCurrent(true)}});
    $$('#focusesUI [data-removefocus]').forEach(b=>b.onclick=()=>{M.removeFocus(state,b.dataset.removefocus,b.dataset.index===''?null:Number(b.dataset.index),Number(b.dataset.fi));renderCurrent(true)});
  }
  function updateFocusChoiceArea(box){
    const sid=box.querySelector('[data-focusskill]')?.value, area=box.querySelector('[data-focuschips]');if(!area)return;
    const s=skill(sid); if(!s){area.innerHTML='<span class="small">Choose an eligible Skill.</span>';return;}
    const bucketList=box.dataset.scope==='free'?state.freeFocuses:state.lifepaths[Number(box.dataset.index)].focuses;
    const bucketBudget=box.dataset.scope==='free'?D.rules.standard.freeFocuses:D.rules.standard.lifepathFocuses;
    area.innerHTML=s.focuses.map(name=>{const chosen=M.allFocuses(state).some(f=>f.skill===sid&&f.name.toLowerCase()===name.toLowerCase());const blocked=chosen||bucketList.length>=bucketBudget||M.focusCountOnSkill(state,sid)>=D.rules.standard.maxFocusesPerSkill;return `<button class="focusChip ${chosen?'chosen':''}" data-rawfocus="${esc(name)}" ${blocked?'disabled':''}>${esc(name)}</button>`}).join('');
    area.querySelectorAll('[data-rawfocus]').forEach(b=>b.onclick=()=>{if(addFocusFromBucket(box,sid,b.dataset.rawfocus))renderCurrent(true)});
  }
  function addFocusFromBucket(box,sid,name){
    const scope=box.dataset.scope,index=box.dataset.index===''?null:Number(box.dataset.index);const ok=scope==='free'?M.addFreeFocus(state,sid,name):M.addLpFocus(state,index,sid,name);if(!ok){flash('Focus could not be added: check the source budget, final Skill rating, duplicate Focus, and the maximum of 2 Focuses per Skill.','danger');return false;}autosave();return true;
  }

  function resourceStepper(index,key,val){return `<div class="stepper resStep" data-resstep data-index="${index}" data-key="${key}"><button data-dir="-1">−</button><span class="n">${val}</span><button data-dir="1">+</button></div>`}
  function renderResources(){
    let html=`<div class="card"><h2>Resources</h2><div class="small">V6 Resources are retained as a separate chargen subsystem. Runtime depletion/recovery mechanics remain deferred.</div>`;
    for(let i=0;i<M.activeLpCount(state);i++){
      const lp=M.getLp(state.lifepaths[i].id);if(!lp)continue;html+=`<h3>${esc(lp.name)} · 3 dots</h3><div class="budget"><span class="pill" id="resBudgetLp${i}"></span></div>${lp.resources.map(r=>`<div class="row"><div><div class="rowname">${esc(rtype(r.type)?.name||r.type)}${r.label?`: ${esc(r.label)}`:''}</div><div class="rowmeta">${esc(rtype(r.type)?.category||'')}</div></div>${resourceStepper(i,r.key,state.lifepaths[i].resourceDots[r.key]||0)}</div>`).join('')}`;
    }
    const spent=state.freeResources.reduce((a,r)=>a+(Number(r.dots)||0),0);
    html+=`<h3>Free Resources · 3 dots</h3><div class="budget"><span class="pill ${spent===D.rules.standard.freeResourceDots?'good':'warn'}">${spent} / ${D.rules.standard.freeResourceDots} spent</span></div><div class="resadd"><div class="field"><label>Type</label><select id="freeResType">${D.resourceTypes.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></div><div class="field wide"><label>Label / specific asset</label><input id="freeResLabel" type="text" placeholder="Old storage, Fencer, Local scene…"></div><div class="field"><label>Dots</label><select id="freeResDots"><option>1</option><option>2</option><option>3</option></select></div><button class="btn" id="addFreeRes">Add</button></div>${state.freeResources.map(r=>`<div class="tag"><div><b>${esc(rtype(r.type)?.name||r.type)}${r.label?`: ${esc(r.label)}`:''}</b> · ${r.dots}</div><button class="x" data-removeres="${r.id}">×</button></div>`).join('')||'<div class="emptyLine">No free Resources added.</div>'}<h3>Final Resource summary</h3><div class="summaryList">${M.aggregatedResources(state).map(r=>`<div class="kv"><span>${esc(rtype(r.type)?.name||r.type)}${r.label?`: ${esc(r.label)}`:''}</span><b>${r.dots}</b><small>${r.sources.map(s=>`${esc(s.source)} ${s.dots}`).join(' + ')}</small></div>`).join('')||'<div class="small">No Resources allocated yet.</div>'}</div></div>`;
    $('#resourcesUI').innerHTML=html;
    $$('#resourcesUI [data-resstep] button').forEach(b=>b.onclick=()=>{const w=b.closest('[data-resstep]'),i=Number(w.dataset.index),key=w.dataset.key,old=state.lifepaths[i].resourceDots[key]||0;if(!M.setLpResourceDot(state,i,key,old+Number(b.dataset.dir))){flash('That change would exceed the 3-dot Lifepath Resource budget.','danger');return;}updateResourceUI();autosave();});
    $('#addFreeRes').onclick=()=>{if(!M.addFreeResource(state,$('#freeResType').value,$('#freeResLabel').value,$('#freeResDots').value)){flash('That Resource would exceed the 3 free Resource dots.','danger');return;}renderCurrent(true)};
    $$('#resourcesUI [data-removeres]').forEach(b=>b.onclick=()=>{M.removeFreeResource(state,b.dataset.removeres);renderCurrent(true)});
    updateResourceUI();
  }
  function updateResourceUI(){
    for(let i=0;i<M.activeLpCount(state);i++){const el=$(`#resBudgetLp${i}`);if(el){const n=sum(state.lifepaths[i].resourceDots);el.textContent=`${n} / ${D.rules.standard.lifepathResourceDots} spent`;el.className=`pill ${n===D.rules.standard.lifepathResourceDots?'good':'warn'}`;}}
    $$('#resourcesUI [data-resstep]').forEach(w=>{const i=Number(w.dataset.index),key=w.dataset.key,val=state.lifepaths[i].resourceDots[key]||0;w.querySelector('.n').textContent=val;const btn=w.querySelectorAll('button');btn[0].disabled=val<=0;btn[1].disabled=sum(state.lifepaths[i].resourceDots)>=D.rules.standard.lifepathResourceDots;});
  }

  function renderDisciplines(){
    const c=clan(state.identity.clan); if(!c){$('#disciplinesUI').innerHTML='<div class="card"><div class="notice danger">Choose a Clan first.</div></div>';return;}
    const allowed=c.id==='caitiff'?D.disciplines.map(d=>d.id):M.clanDisciplineIds(state);
    const primary=state.disciplines.primary||'',secondary=state.disciplines.secondary||'';
    const options=(selected,exclude)=>`<option value="">— Choose —</option>${allowed.filter(id=>id!==exclude).map(id=>`<option value="${id}" ${id===selected?'selected':''}>${esc(disc(id).name)}</option>`).join('')}`;
    let html=`<div class="card"><h2>Disciplines</h2><div class="notice info">V5 neonate baseline without mandatory Predator Type: choose two ${c.id==='caitiff'?'Disciplines':'Clan Disciplines'}, with <b>2 dots</b> in one and <b>1 dot</b> in the other. Choose one Power per dot.</div><div class="grid2"><div class="field"><label>2-dot Discipline</label><select id="discPrimary">${options(primary,secondary)}</select></div><div class="field"><label>1-dot Discipline</label><select id="discSecondary">${options(secondary,primary)}</select></div></div>`;
    if(primary&&secondary){
      for(const id of [primary,secondary]){
        const d=disc(id),rating=M.disciplineRating(state,id),powers=state.disciplines.powers[id]||[],eligible=M.eligiblePowers(state,id);
        html+=`<div class="disciplineCard"><div class="discHead"><div><h3>${esc(d.name)} <span class="dots">${'●'.repeat(rating)}</span></h3><div class="small">${esc(d.summary)}</div></div></div>${d.note?`<div class="notice warn">${esc(d.note)}</div>`:''}${Array.from({length:rating},(_,slot)=>{const p=powers[slot];return `<div class="powerSlot" data-powerslot data-disc="${id}" data-slot="${slot}"><div class="slotLabel">Power ${slot+1} / ${rating}</div><select data-powerselect><option value="">— Choose power —</option>${eligible.map(x=>`<option value="${x.id}" ${p?.id===x.id?'selected':''}>${esc(x.name)} · Level ${x.level}</option>`).join('')}</select><div class="manualPower"><input type="text" data-manualpower placeholder="Manual / supplement power" value="${p?.manual?esc(p.name):''}"><button class="btn" data-savemanual>Use manual</button></div>${p?`<div class="chosenPower">Selected: <b>${esc(p.name)}</b>${p.manual?' · manual':''}</div>`:''}</div>`;}).join('')}</div>`;
      }
    }else html+=`<div class="emptyState">Select both Discipline allocations to reveal Power slots.</div>`;
    html+='</div>';$('#disciplinesUI').innerHTML=html;
    const alloc=()=>{const p=$('#discPrimary').value,s=$('#discSecondary').value;if(!p||!s)return;if(!M.setDisciplineAllocation(state,p,s)){flash('Choose two different valid Disciplines.','danger');return;}renderCurrent(true)};
    $('#discPrimary').onchange=alloc;$('#discSecondary').onchange=alloc;
    $$('#disciplinesUI [data-powerselect]').forEach(sel=>sel.onchange=()=>{if(!sel.value)return;const box=sel.closest('[data-powerslot]');if(!M.setPowerAt(state,box.dataset.disc,Number(box.dataset.slot),sel.value)){flash('That Power is not eligible or duplicates another selected Power.','danger');sel.value='';return;}const chosen=box.querySelector('.chosenPower');if(chosen)chosen.innerHTML=`Selected: <b>${esc(disc(box.dataset.disc).powers.find(p=>p.id===sel.value)?.name||'')}</b>`;autosave();});
    $$('#disciplinesUI [data-savemanual]').forEach(btn=>btn.onclick=()=>{const box=btn.closest('[data-powerslot]'),input=box.querySelector('[data-manualpower]');if(!M.setPowerAt(state,box.dataset.disc,Number(box.dataset.slot),'__manual__',input.value)){flash('Enter a unique manual Power name.','danger');return;}renderCurrent(true)});
  }

  function renderTraits(){
    $('#traitsUI').innerHTML=`<div class="card"><h2>Merits & Flaws</h2><div class="notice warn">The Merit list is deliberately provisional. V6 Merits that conflict with V5 Disciplines, Hunger/Blood, Blood Bond, damage, or other core V5 mechanics remain excluded pending individual audit.</div><div class="field"><label>Starting Merit (baseline: 1)</label><select id="merit"><option value="">— None / defer —</option>${D.merits.map(m=>`<option value="${m.id}" ${state.merit===m.id?'selected':''}>${esc(m.name)}</option>`).join('')}</select></div>${state.merit?`<div class="small">${esc(D.merits.find(m=>m.id===state.merit)?.description||'')}</div>`:''}<h3>Flaws</h3><div class="small">Freeform narrative/gameplay hooks. They grant no point compensation.</div><div class="grid2"><div class="field"><label>Name</label><input id="flawName" type="text" placeholder="Addicted"></div><div class="field"><label>Description</label><input id="flawDesc" type="text" placeholder="How it complicates the character"></div></div><button class="btn" id="addFlaw">Add Flaw</button>${state.flaws.map((f,i)=>`<div class="tag"><div><b>${esc(f.name)}</b>${f.description?`<div class="small">${esc(f.description)}</div>`:''}</div><button class="x" data-removeflaw="${f.id||i}">×</button></div>`).join('')||'<div class="emptyLine">No Flaws added.</div>'}</div>`;
    $('#merit').onchange=e=>{M.setMerit(state,e.target.value);autosave()};$('#addFlaw').onclick=()=>{if(!M.addFlaw(state,$('#flawName').value,$('#flawDesc').value)){flash('Flaw needs a name.','danger');return;}renderCurrent(true)};$$('#traitsUI [data-removeflaw]').forEach(b=>b.onclick=()=>{M.removeFlaw(state,b.dataset.removeflaw);renderCurrent(true)});
  }

  function renderHumanity(){
    const h=state.humanity;
    $('#humanityUI').innerHTML=`<div class="card"><h2>Humanity & Convictions</h2><div class="notice info">This generator keeps the V5 morality structure: Humanity, Convictions, Touchstones, Stains, and Remorse. V6 Humanity Scale is not used.</div><div class="grid2"><div class="field"><label>Starting Humanity</label><select id="humanity"><option value="7" ${h.value===7?'selected':''}>7 · standard V5 start</option><option value="8" ${h.value===8?'selected':''}>8 · ST-approved fledgling start</option></select></div><div class="field"><label>Starting Stains</label><div class="readonly">0</div></div></div><h3>Convictions & linked Touchstones</h3><div class="small">Choose 1–3. Each Conviction is stored together with the mortal Touchstone who embodies or anchors it.</div>${h.convictions.map((c,i)=>`<div class="conviction" data-conv="${i}"><div class="convHead"><b>Conviction ${i+1}</b>${h.convictions.length>1?`<button class="x" data-removeconv="${i}">×</button>`:''}</div><div class="field"><label>Conviction</label><input data-convfield="conviction" value="${esc(c.conviction)}" placeholder="Never abandon someone under your protection"></div><div class="grid2"><div class="field"><label>Touchstone</label><input data-convfield="touchstone" value="${esc(c.touchstone)}" placeholder="Name"></div><div class="field"><label>Relationship / why they matter</label><input data-convfield="relationship" value="${esc(c.relationship)}" placeholder="Former comrade, sibling, student…"></div></div></div>`).join('')}<button class="btn" id="addConv" ${h.convictions.length>=D.rules.standard.maxConvictions?'disabled':''}>+ Add Conviction</button><div class="notice small">Remorse is resolved during play when Stains are present; the generator records the starting Humanity structure and starts with 0 Stains.</div></div>`;
    $('#humanity').onchange=e=>{M.setHumanity(state,e.target.value);autosave()};$$('#humanityUI [data-convfield]').forEach(el=>el.oninput=()=>{const row=el.closest('[data-conv]');M.setConvictionField(state,Number(row.dataset.conv),el.dataset.convfield,el.value);autosave()});$('#addConv').onclick=()=>{if(M.addConviction(state))renderCurrent(true)};$$('#humanityUI [data-removeconv]').forEach(b=>b.onclick=()=>{M.removeConviction(state,Number(b.dataset.removeconv));renderCurrent(true)});
  }

  function renderFeeding(){
    $('#feedingUI').innerHTML=`<div class="card"><h2>Feeding</h2><div class="notice info">Predator Type is intentionally not mandatory in this adaptation. Describe the character's normal feeding pattern; specific advantages, limits, Merits, or Flaws can be represented elsewhere when relevant.</div><div class="field"><label>Feeding pattern</label><textarea id="feedingPattern" placeholder="Who do they usually feed from, how do they gain access, and what limits do they observe?">${esc(state.feedingPattern)}</textarea></div><div class="field"><label>Notes / equipment / unresolved character details</label><textarea id="notes">${esc(state.notes)}</textarea></div></div>`;
    $('#feedingPattern').oninput=e=>{state.feedingPattern=e.target.value;autosave()};$('#notes').oninput=e=>{state.notes=e.target.value;autosave()};
  }

  function dots(n){return n?'●'.repeat(n):'—'}
  function renderReview(){
    const v=M.validation(state),d=M.derived(state),c=clan(state.identity.clan),skills=M.totalSkills(state),foci=M.allFocuses(state),res=M.aggregatedResources(state);
    $('#reviewUI').innerHTML=`<div class="card"><div class="reviewTitle"><div><h2>${esc(state.identity.name||'Unnamed Character')}</h2><div class="small">${esc(c?.name||'No Clan')} · ${state.identity.generation}th Generation · ${esc(state.identity.concept||'No concept')}</div></div><span class="status ${v.ok?'ok':'bad'}">${v.ok?'Mechanically complete':`${v.issues.length} issue(s)`}</span></div>
      <div class="statstrip"><div><span>Health</span><b>${d.health??'—'}</b></div><div><span>Willpower</span><b>${d.willpower??'—'}</b></div><div><span>Blood Potency</span><b>${d.bloodPotency??'—'}</b></div><div><span>Humanity</span><b>${d.humanity}</b></div><div><span>Stains</span><b>${d.stains}</b></div></div>
      ${v.issues.length?`<div class="notice danger"><b>Required fixes</b>${v.issues.map(x=>`<div class="issue">${esc(x)}</div>`).join('')}</div>`:''}${v.warnings.length?`<div class="notice warn"><b>Warnings</b>${v.warnings.map(x=>`<div class="issue">${esc(x)}</div>`).join('')}</div>`:''}
      <div class="reviewgrid"><div><h3>Identity</h3>${[['Clan',c?.name],['Generation',state.identity.generation],['Sire',state.identity.sire],['Apparent Age',state.identity.apparentAge],['Actual Age',state.identity.actualAge],['Age at Embrace',state.identity.ageAtEmbrace],['Embrace',state.identity.embraceDate],['Nostalgic Decade',state.identity.nostalgicDecade],['Ambition',state.identity.ambition],['Desire',state.identity.desire]].filter(x=>x[1]).map(([k,x])=>`<div class="kv"><span>${esc(k)}</span><b>${esc(x)}</b></div>`).join('')}</div><div><h3>Attributes</h3>${attrGroups.map(([g,ids])=>`<div class="miniLabel">${g}</div>${ids.map(id=>`<div class="kv"><span>${attrLabels[id]}</span><b>${state.attributes[id]??'—'}</b></div>`).join('')}`).join('')}</div></div>
      <h3>Skills & Focuses</h3><div class="skillReview">${D.skills.filter(s=>skills[s.id]>0).map(s=>{const ff=foci.filter(f=>f.skill===s.id);return `<div class="kv"><span>${esc(s.name)} <b>${skills[s.id]}</b></span><small>${ff.length?ff.map(f=>`${esc(f.name)} (+${D.rules.standard.focusBonus})`).join(' · '):'—'}</small></div>`}).join('')||'<div class="small">No Skills allocated.</div>'}</div>
      <div class="reviewgrid"><div><h3>Lifepaths</h3>${state.lifepaths.slice(0,M.activeLpCount(state)).map(x=>M.getLp(x.id)?.name).filter(Boolean).map(x=>`<div class="kv"><b>${esc(x)}</b></div>`).join('')}</div><div><h3>Resources</h3>${res.map(r=>`<div class="kv"><span>${esc(rtype(r.type)?.name||r.type)}${r.label?`: ${esc(r.label)}`:''}</span><b>${r.dots}</b><small>${r.sources.map(s=>`${esc(s.source)} ${s.dots}`).join(' + ')}</small></div>`).join('')||'<div class="small">—</div>'}</div></div>
      <h3>Disciplines</h3><div class="reviewgrid">${[state.disciplines.primary,state.disciplines.secondary].filter(Boolean).map(id=>`<div class="traitbox"><div class="traitname">${esc(disc(id)?.name)} ${dots(M.disciplineRating(state,id))}</div><div class="small">${(state.disciplines.powers[id]||[]).filter(Boolean).map(p=>esc(p.name)).join(' · ')||'No powers chosen'}</div></div>`).join('')||'<div class="small">—</div>'}</div>
      <div class="reviewgrid"><div><h3>Merit / Flaws</h3><div class="kv"><span>Merit</span><b>${esc(D.merits.find(m=>m.id===state.merit)?.name||'—')}</b></div>${state.flaws.map(f=>`<div class="kv"><span>${esc(f.name)}</span><small>${esc(f.description||'')}</small></div>`).join('')}</div><div><h3>Humanity</h3>${state.humanity.convictions.map(c=>`<div class="traitbox"><div class="traitname">${esc(c.conviction||'—')}</div><div class="small">Touchstone: ${esc(c.touchstone||'—')}${c.relationship?` · ${esc(c.relationship)}`:''}</div></div>`).join('')}</div></div>
      ${state.identity.appearance||state.identity.distinguishingFeatures?`<h3>Appearance</h3><p>${esc(state.identity.appearance)}</p><p class="small">${esc(state.identity.distinguishingFeatures)}</p>`:''}<h3>Feeding</h3><p>${esc(state.feedingPattern||'—')}</p>
      <div class="reviewActions"><button class="btn primary" id="exportBtn">Export JSON</button><button class="btn" id="importBtn">Import JSON</button><button class="btn" id="copyJson">Copy JSON</button></div>
      <details><summary>Change log</summary><div class="mono">${state.changeLog.map(x=>`${esc(x.at)} — ${esc(x.msg)}`).join('\n')||'No upstream reconciliations recorded.'}</div></details>
    </div>`;
    $('#exportBtn').onclick=exportJson;$('#importBtn').onclick=()=>$('#importFile').click();$('#copyJson').onclick=async()=>{try{await navigator.clipboard.writeText(M.exportState(state));flash('JSON copied.','good')}catch(e){flash('Clipboard access unavailable. Use Export JSON.','warn')}};
  }

  function exportJson(){const blob=new Blob([M.exportState(state)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${(state.identity.name||'vtm_character').replace(/[^a-z0-9_-]+/gi,'_')}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function importFile(file){const r=new FileReader();r.onload=()=>{try{state=M.importState(r.result);lastLogCount=state.changeLog.length;clanView='list';previewClanId=state.identity.clan;autosave();flash('Character JSON imported and migrated to schema v3.','good');renderCurrent(false)}catch(e){flash(`Import failed: ${e.message}`,'danger')}};r.readAsText(file)}

  $('#backBtn').onclick=back;$('#nextBtn').onclick=next;$('#saveBtn').onclick=saveLocal;$('#importFile').onchange=e=>{if(e.target.files[0])importFile(e.target.files[0]);e.target.value=''};
  window.addEventListener('beforeunload',autosave);
  renderCurrent(false);
})();
