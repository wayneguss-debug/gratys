const SUPABASE_URL="https://jbwrnvmidjvcnkexjsqj.supabase.co";
const SUPABASE_KEY="sb_publishable_1pAbktJsG3fwkPUCZBAbJw_JqYRPqXm";
const state={posts:[],events:[],locations:[],transport:[],locationFilter:"all"};
const escapeHTML=(value="")=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

async function from(table,query=""){
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`,{
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}
  });
  if(!response.ok) throw new Error(`Falha ao carregar ${table}`);
  return response.json();
}

function typeLabel(type){
  return ({news:"Notícia",notice:"Aviso",orientation:"Orientação",event:"Evento",deadline:"Prazo"})[type]||"Informativo";
}
function formatDate(date){
  return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(date));
}

function renderPosts(filter=""){
  const grid=document.querySelector("#postsGrid");
  const term=filter.trim().toLowerCase();
  const posts=state.posts.filter(post=>[post.title,post.excerpt,post.type].join(" ").toLowerCase().includes(term));
  if(!posts.length){
    grid.innerHTML='<div class="empty-state">Nenhum informativo encontrado.</div>';
    return;
  }
  grid.innerHTML=posts.map(post=>`
    <article class="news-card ${post.featured?"featured":""}">
      <div class="meta"><span>${typeLabel(post.type)}</span><span>${post.published_at?formatDate(post.published_at):""}</span></div>
      <h3>${escapeHTML(post.title)}</h3>
      <p>${escapeHTML(post.excerpt)}</p>
      <span class="read-more">Conteúdo verificado pela equipe</span>
    </article>
  `).join("");
}

function renderEvents(){
  const list=document.querySelector("#eventsList");
  if(!state.events.length){
    list.innerHTML='<div class="empty-state">Ainda não há eventos ou prazos publicados. Quando a equipe cadastrar dados reais, eles aparecerão aqui automaticamente.</div>';
    return;
  }
  list.innerHTML=state.events.map(event=>{
    const date=new Date(event.starts_at);
    return `<article class="timeline-item">
      <div class="date-box"><strong>${String(date.getDate()).padStart(2,"0")}</strong><span>${date.toLocaleDateString("pt-BR",{month:"short"})}</span></div>
      <div><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description||event.location||"")}</p></div>
      <span class="type-pill">${typeLabel(event.kind)}</span>
    </article>`;
  }).join("");
}

function renderLocations(){
  const list=document.querySelector("#locationsList");
  const items=state.locationFilter==="all"?state.locations:state.locations.filter(item=>item.category===state.locationFilter);
  if(!items.length){
    list.innerHTML='<div class="empty-state">Nenhum local cadastrado nesta categoria ainda. O guia será preenchido somente com informações confirmadas do campus.</div>';
    return;
  }
  list.innerHTML=items.map(item=>`
    <article class="location-item">
      <div><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML([item.building,item.floor,item.reference].filter(Boolean).join(" • ")||item.description)}</p></div>
      <span class="location-tag">${escapeHTML(item.category)}</span>
    </article>
  `).join("");
}

function renderTransport(){
  const list=document.querySelector("#transportList");
  if(!state.transport.length){
    list.innerHTML='<div class="empty-state">Horários de transporte ainda não foram cadastrados. Esta área evita exibir horários não confirmados ou desatualizados.</div>';
    return;
  }
  list.innerHTML=state.transport.map(item=>`
    <article class="transport-card">
      <time>${escapeHTML(String(item.departure_time).slice(0,5))}</time>
      <strong>${escapeHTML(item.line_name)}</strong>
      <span>${escapeHTML(item.direction)}${item.note?" • "+escapeHTML(item.note):""}</span>
    </article>
  `).join("");
}

async function loadContent(){
  try{
    const [posts,events,locations,transport]=await Promise.all([
      from("posts","select=*&status=eq.published&order=featured.desc,published_at.desc"),
      from("events","select=*&is_published=eq.true&order=starts_at.asc"),
      from("campus_locations","select=*&is_active=eq.true&order=name.asc"),
      from("transport_schedules","select=*&is_active=eq.true&order=departure_time.asc")
    ]);
    state.posts=posts;state.events=events;state.locations=locations;state.transport=transport;
  }catch(error){
    console.error(error);
    state.posts=[{
      title:"Bem-vindo ao Campus Agora",
      excerpt:"Um espaço acadêmico para reunir avisos, orientações, eventos e informações úteis do campus.",
      type:"notice",featured:true,published_at:new Date().toISOString()
    }];
  }
  renderPosts();renderEvents();renderLocations();renderTransport();
}

document.querySelector("#postSearch").addEventListener("input",event=>renderPosts(event.target.value));

document.querySelectorAll("[data-location-filter]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-location-filter]").forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  state.locationFilter=button.dataset.locationFilter;
  renderLocations();
}));

const menuButton=document.querySelector("#menuButton");
const mainNav=document.querySelector("#mainNav");
menuButton.addEventListener("click",()=>{
  const open=mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(open));
});
mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded","false");
}));

loadContent();