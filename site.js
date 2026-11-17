const menuToggle=document.getElementById('menu-toggle'), menu=document.getElementById('mega-menu');
function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false')}
menuToggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuToggle.setAttribute('aria-expanded',String(!menu.hidden))});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuToggle.focus()}});
window.addEventListener('hashchange',closeMenu);
const siteHeader=document.querySelector('.reference-header');
let scrollEndTimer;
window.addEventListener('scroll',()=>{
  if(menu.hidden&&window.scrollY>0)siteHeader.classList.add('is-scrolling');
  clearTimeout(scrollEndTimer);
  scrollEndTimer=setTimeout(()=>siteHeader.classList.remove('is-scrolling'),180);
},{passive:true});
document.getElementById('search-toggle').addEventListener('click',()=>{location.hash='search-section';requestAnimationFrame(()=>document.getElementById('directory-query').focus())});
const searchForm=document.getElementById('directory-search'), searchResults=document.getElementById('search-results');
searchForm.addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('directory-query').value.trim().toLowerCase();searchResults.replaceChildren();searchResults.hidden=false;if(!q){searchResults.textContent='Enter a team name or responsibility to search.';return}const matches=Object.entries(D).filter(([k,v])=>(k+' '+v.join(' ')).toLowerCase().includes(q));if(!matches.length){searchResults.textContent='No matching teams. Try security, network, support or data.';return}matches.forEach(([key,value])=>{const a=document.createElement('a');a.href='#'+key;a.textContent=value[0]+' →';searchResults.append(a)})});


