
const DATA = {};
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmtDate = d => {
  if(!d) return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Intl.DateTimeFormat('en',{year:'numeric',month:'short',day:'numeric'}).format(new Date(d+'T00:00:00'));
  if(/^\d{4}-\d{2}$/.test(d)) return new Intl.DateTimeFormat('en',{year:'numeric',month:'short'}).format(new Date(d+'-01T00:00:00'));
  return d;
};
async function loadJSON(name){
  if(DATA[name]) return DATA[name];
  const r = await fetch(`data/${name}.json`, {cache:'no-store'});
  if(!r.ok) throw new Error(`Could not load data/${name}.json`);
  return DATA[name] = await r.json();
}
function linkButton(label,url,cls='') { return url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>` : ''; }
function setActiveNav(){
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.site-nav a').forEach(a=>{ if(a.getAttribute('href')===page) a.setAttribute('aria-current','page'); });
  const btn=$('.nav-toggle'), nav=$('.site-nav');
  if(btn && nav) btn.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',String(open)); });
}
function renderFooter(p){
  const y = new Date().getFullYear();
  const footer=$('#site-footer'); if(!footer) return;
  footer.innerHTML=`<div class="footer-inner"><div><strong>${esc(p.name)}</strong><p>${esc(p.department)} · ${esc(p.institution)}</p><p>${esc(p.contact.emailDisplay)}</p><p class="data-status">Site content last updated ${esc(p.lastUpdated)} · Content is JSON-driven for easy maintenance.</p></div><div class="footer-links">${p.links.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join('')}</div></div>`;
}
function card(title, body, meta='', tags=[]){ return `<article class="card">${meta?`<div class="kicker">${esc(meta)}</div>`:''}<h3>${esc(title)}</h3><p>${body}</p>${tags?.length?`<div class="tag-list">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}</article>`; }
function renderProfileBits(p){
  $$('[data-profile-name]').forEach(e=>e.textContent=p.name);
  $$('[data-profile-tagline]').forEach(e=>e.textContent=p.tagline);
  $$('[data-last-updated]').forEach(e=>e.textContent=p.lastUpdated);
}
function pubHTML(p){
  const links=[];
  if(p.url) links.push(`<a href="${esc(p.url)}" target="_blank" rel="noopener">Paper</a>`);
  if(p.doi) links.push(`<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
  if(p.code) links.push(`<a href="${esc(p.code)}" target="_blank" rel="noopener">Code / data</a>`);
  return `<article class="pub" data-year="${p.year}" data-type="${esc(p.type)}" data-search="${esc((p.title+' '+p.authors+' '+p.venue).toLowerCase())}"><div class="pub-title">${esc(p.title)}</div><div class="pub-authors">${esc(p.authors)}</div><div class="pub-venue"><span class="tag">${esc(p.type)}</span> ${esc(p.venue||'')}${p.pages?`, ${esc(p.pages)}`:''}</div>${links.length?`<div class="pub-links">${links.join('')}</div>`:''}</article>`;
}
function timelineHTML(items){ return `<div class="timeline">${items.map(n=>`<div class="timeline-item"><div class="timeline-date">${esc(fmtDate(n.date))}</div><div class="timeline-content"><h3>${n.url?`<a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a>`:esc(n.title)}</h3><p>${esc(n.summary||'')}</p>${n.tags?.length?`<div class="tag-list">${n.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}</div></div>`).join('')}</div>`; }

async function renderHome(){
  const [p,n,pubs,r,s] = await Promise.all([loadJSON('profile'),loadJSON('news'),loadJSON('publications'),loadJSON('research'),loadJSON('students')]);
  $('#home-name').textContent=p.name; $('#home-tagline').textContent=p.tagline; $('#home-about').textContent=p.about;
  $('#home-roles').innerHTML=p.currentRoles.map(x=>`<li>${esc(x)}</li>`).join('');
  $('#home-links').innerHTML=p.links.slice(0,5).map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join('');
  $('#home-metrics').innerHTML=p.highlights.map(x=>`<div class="metric"><strong>${esc(x.label)}</strong><span>${esc(x.value)}</span></div>`).join('');
  $('#home-news').innerHTML=timelineHTML(n.slice(0,7));
  const fp=pubs.publications.filter(x=>x.featured).sort((a,b)=>b.year-a.year).slice(0,6); $('#home-pubs').innerHTML=fp.map(pubHTML).join('');
  $('#home-research').innerHTML=r.themes.slice(0,5).map(x=>card(x.title,esc(x.summary),'Research theme',x.keywords)).join('');
  const count=s.groups.reduce((a,g)=>a+g.students.length,0); $('#student-count').textContent=count;
}
async function renderPublications(){
  const d=await loadJSON('publications'), root=$('#publication-list');
  const years=[...new Set(d.publications.map(x=>x.year))].sort((a,b)=>b-a), types=[...new Set(d.publications.map(x=>x.type))].sort();
  $('#pub-year').innerHTML='<option value="">All years</option>'+years.map(y=>`<option>${y}</option>`).join('');
  $('#pub-type').innerHTML='<option value="">All types</option>'+types.map(t=>`<option>${esc(t)}</option>`).join('');
  const draw=()=>{ const q=$('#pub-search').value.trim().toLowerCase(), y=$('#pub-year').value, t=$('#pub-type').value; const arr=d.publications.filter(p=>(!q||(p.title+' '+p.authors+' '+p.venue).toLowerCase().includes(q))&&(!y||String(p.year)===y)&&(!t||p.type===t)); const groups=Object.groupBy?Object.groupBy(arr,p=>p.year):arr.reduce((a,p)=>((a[p.year]??=[]).push(p),a),{}); root.innerHTML=Object.keys(groups).sort((a,b)=>b-a).map(y=>`<h2 class="year-heading">${y}</h2>${groups[y].map(pubHTML).join('')}`).join('') || '<div class="empty-note">No publications match the current filters.</div>'; $('#pub-count').textContent=arr.length; };
  ['pub-search','pub-year','pub-type'].forEach(id=>$('#'+id).addEventListener(id==='pub-search'?'input':'change',draw)); draw();
  $('#monographs').innerHTML=d.monographs.map(x=>card(x.title,`${esc(x.role)} · ${esc(x.publisher)}${x.isbn?` · ISBN ${esc(x.isbn)}`:''}`,String(x.year))).join(''); if($('#technical-reports')) $('#technical-reports').innerHTML=(d.technicalReports||[]).map(x=>card('Technical report',esc(x.citation),String(x.year))).join('');
}
async function renderResearch(){ const d=await loadJSON('research'); $('#research-themes').innerHTML=d.themes.map(x=>card(x.title,esc(x.summary),'Theme',x.keywords)).join(''); $('#research-projects').innerHTML=d.projects.map(x=>card(x.title,`${esc(x.summary)}${x.url?` <a href="${esc(x.url)}" target="_blank" rel="noopener">Project/resource ↗</a>`:''}`,`${x.period} · ${x.status}`,x.tags)).join(''); $('#research-collabs').innerHTML=d.collaborations.map(x=>`<li>${esc(x)}</li>`).join(''); }
async function renderStudents(){ const d=await loadJSON('students'); $('#students-note').textContent=d.note; $('#student-groups').innerHTML=d.groups.map(g=>`<section class="degree-group"><div class="section-head"><h2>${esc(g.degree)}</h2><p>${g.students.length} ${g.students.length===1?'student':'students'}</p></div>${g.students.length?g.students.map(s=>`<div class="student-row"><div><div class="student-name">${esc(s.name)}</div><div class="meta">${esc(s.institution||'University of Jaffna')}</div></div><div><strong>${esc(s.title||'Research project')}</strong><div class="meta">${esc(s.role||'Supervisor')}</div></div><div><span class="tag">${esc(s.status||'')}</span><div class="meta">${esc(s.period||'')}</div></div></div>`).join(''):`<div class="empty-note">No verified entries are included yet. Add students to the ${esc(g.degree)} array in <code>data/students.json</code>.</div>`}</section>`).join(''); $('#examinations').innerHTML=d.examinations.map(x=>card(`${x.level} examiner — ${x.name}`,`${esc(x.institution)} · ${x.year}`,x.role)).join(''); }
async function renderGrants(){ const d=await loadJSON('grants'); $('#research-grants').innerHTML=d.research.map(x=>card(x.name,`${esc(x.detail)}<br><strong>Role:</strong> ${esc(x.role)}`,`${x.period} · ${x.funder}`)).join(''); $('#mobility-grants').innerHTML=d.mobility.map(x=>card(x.name,esc(x.detail),x.period)).join(''); $('#awards').innerHTML=d.awards.sort((a,b)=>b.year-a.year).map(x=>card(x.name,esc(x.detail),String(x.year))).join(''); }
async function renderResources(){ const d=await loadJSON('resources'); const draw=(id,arr)=>$(id).innerHTML=arr.map(x=>card(x.name,`${esc(x.description)}${x.url?` <a href="${esc(x.url)}" target="_blank" rel="noopener">Open ↗</a>`:''}`,x.status||'Resource')).join(''); draw('#tools',d.tools); draw('#datasets',d.datasets); draw('#grammars',d.grammars); draw('#models',d.models); }
async function renderTeaching(){ const d=await loadJSON('teaching'); $('#teaching-current').innerHTML=d.current.map(x=>card(x.course,esc(x.detail),`${x.level} · ${x.institution} · ${x.year}`)).join(''); $('#teaching-international').innerHTML=d.international.map(x=>card(x.course,esc(x.detail),`${x.institution} · ${x.year}`)).join(''); $('#teaching-undergrad').innerHTML=d.undergraduate.map(x=>`<li>${esc(x)}</li>`).join(''); $('#teaching-postgrad').innerHTML=d.postgraduate.map(x=>`<li>${esc(x)}</li>`).join(''); $('#teaching-training').innerHTML=d.training.map(x=>`<li>${esc(x)}</li>`).join(''); if($('#teaching-historical')) $('#teaching-historical').innerHTML=(d.historicalTeaching||[]).map(x=>card(x.course,esc(x.institution),x.period)).join(''); }
async function renderTalks(){ const d=await loadJSON('talks'); $('#talks-list').innerHTML=timelineHTML(d.map(x=>({date:x.date,title:x.title,summary:`${x.type} · ${x.event} · ${x.location}`,tags:[x.type]}))); }
async function renderService(){ const d=await loadJSON('service'); $('#leadership').innerHTML=d.leadership.map(x=>card(x.role,esc(x.organisation),x.period)).join(''); $('#academic-service').innerHTML=d.academicService.map(x=>card(x.role,esc(x.detail),'Academic service')).join(''); $('#editorial').innerHTML=d.editorial.map(x=>card(x.title,'',`${x.role} · ${x.year}`)).join(''); $('#opensource').innerHTML=d.openSource.map(x=>`<li>${esc(x)}</li>`).join(''); $('#community').innerHTML=d.community.map(x=>card(x.role,esc(x.detail),'Community & outreach')).join(''); if($('#memberships')) $('#memberships').innerHTML=(d.memberships||[]).map(x=>card(x.role,esc(x.organisation),x.period)).join(''); const list=(id,a)=>{const e=$(id); if(e)e.innerHTML=(a||[]).map(x=>`<li>${esc(x)}</li>`).join('')}; list('#resource-person',d.resourcePerson); list('#presentations',d.presentations); list('#workshops-seminars',d.workshopsSeminars); list('#creative-work',d.creativeWork); }
async function renderCV(){ const p=await loadJSON('profile'); $('#cv-roles').innerHTML=p.currentRoles.map(x=>`<li>${esc(x)}</li>`).join(''); $('#cv-education').innerHTML=p.education.map(x=>card(x.degree,esc(x.detail),`${x.period} · ${x.institution}`)).join(''); $('#cv-appointments').innerHTML=p.appointments.map(x=>card(x.role,esc(x.institution),`${x.period} · ${x.type}`)).join(''); }
async function renderSources(){ const d=await loadJSON('sources'); $('#sources-list').innerHTML=d.map(x=>card(x.label,`${esc(x.use)} <a href="${esc(x.url)}" target="_blank" rel="noopener">Source ↗</a>`,'Public source')).join(''); }
async function boot(){
  setActiveNav();
  try{ const p=await loadJSON('profile'); renderProfileBits(p); renderFooter(p); const page=document.body.dataset.page; const f={home:renderHome,publications:renderPublications,research:renderResearch,students:renderStudents,grants:renderGrants,resources:renderResources,teaching:renderTeaching,talks:renderTalks,service:renderService,cv:renderCV,sources:renderSources}[page]; if(f) await f(); }
  catch(err){ console.error(err); const m=$('#main'); if(m) m.insertAdjacentHTML('afterbegin',`<div class="container"><div class="notice"><strong>Data could not be loaded.</strong> If you opened this file directly from your computer, run the site through a local web server. See README.md. (${esc(err.message)})</div></div>`); }
}
document.addEventListener('DOMContentLoaded',boot);
