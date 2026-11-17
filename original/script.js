var D={
director:["Director","Sets the direction for the company’s technology and security. The CISO reports to the Director, who approves budgets, major risk decisions and long-term plans."],
ciso:["CISO (Chief Information Security Officer)","Leads all IT and cyber security work. Owns the security strategy, policies and risk reporting. Every IT department below reports to the CISO, who then reports to the Director."],
soc:["SOC Team (Security Operations Centre)","Watches the company’s systems around the clock for threats. Investigates alerts, responds to incidents such as malware or suspicious logins, and reviews logs to stop attacks early."],
noc:["NOC Team (Network Operations Centre)","Keeps the network, internet links, firewalls and servers healthy and online. Tracks performance and outages, and fixes network problems before staff notice them."],
ops:["IT Operations","Runs day-to-day IT: user accounts, laptops and desktops, software installs, patching, backups and the help desk. Makes sure employees have working, up-to-date systems."],
dpo:["DPO (Data Protection Officer)","Makes sure personal data is handled lawfully. Advises on privacy rules, reviews how data is collected and stored, handles data requests and reports data breaches to the right authorities."],
misc:["Miscellaneous","Covers other IT functions that support the main teams, such as vendor and asset management, audits and compliance paperwork, training and special projects."]};
var NAMES={director:"Director",ciso:"CISO",soc:"SOC Team",noc:"NOC Team",ops:"IT Operations",dpo:"DPO",misc:"Miscellaneous"};
var ST={todo:"To do",prog:"In progress",done:"Done",block:"Blocked"};
var TS={todo:"To do",prog:"In progress",done:"Done"},ORDER=["todo","prog","done"];
var info=document.getElementById("info"),chart=document.getElementById("chart"),msg=document.getElementById("msg");
var DATA={team:[],tasks:[],logs:[]},cols={},sel="soc",editing=null,editingTask=null,tab="people";
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function note(t){msg.textContent=t||""}
function iso(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function fmt(s){if(!s)return"";var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
function today(){return fmt(iso())}
function daysLate(t){if(!t.due||t.status==="done")return 0;return Math.round((new Date(iso()+"T00:00:00")-new Date(t.due+"T00:00:00"))/864e5)}
function isAlert(t){return t.status!=="done"&&(t.blocked||daysLate(t)>0)}
function members(k){return DATA.team.filter(function(p){return p.dept===k})}
function nameOf(id){var p=DATA.team.filter(function(x){return x.id===id})[0];return p?p.name:null}
function show(k){var d=D[k];info.innerHTML="<h3></h3><p></p>";info.firstChild.textContent=d[0];info.lastChild.textContent=d[1];chart.classList.add("hot")}
var nodes=document.querySelectorAll(".node");
nodes.forEach(function(n){
n.appendChild(el("em","alr","0"));n.appendChild(el("em","cnt","0"));
n.addEventListener("mouseenter",function(){show(n.dataset.k)});
n.addEventListener("focus",function(){show(n.dataset.k)});
n.addEventListener("click",function(){location.hash=n.dataset.k});
n.addEventListener("mouseleave",function(){chart.classList.remove("hot")});
n.addEventListener("blur",function(){chart.classList.remove("hot")});
});
function fail(){note("Couldn’t save. You may have view-only access to this page.")}
function localSave(n){try{localStorage.setItem("it_"+n,JSON.stringify(DATA[n]))}catch(e){}}
function save(name,obj){
note("");var data=Object.assign({},obj);delete data.id;
if(cols[name]){var ref=obj.id?cols[name].doc(obj.id):cols[name].doc();return ref.set(data).catch(fail)}
if(obj.id){DATA[name]=DATA[name].map(function(x){return x.id===obj.id?Object.assign({id:obj.id},data):x})}
else{DATA[name]=DATA[name].concat([Object.assign({id:"x"+Date.now()+Math.random().toString(36).slice(2,6)},data)])}
localSave(name);render();
}
function del(name,id){
note("");
if(cols[name]){cols[name].doc(id).delete().catch(fail);return}
DATA[name]=DATA[name].filter(function(x){return x.id!==id});localSave(name);render();
}
function btn(t,c,fn){var b=el("button",c||"b",t);b.type="button";b.addEventListener("click",fn);return b}
function fillSelect(s,items,blank){
var v=s.value;s.innerHTML="";
if(blank){var o=el("option","",blank);o.value="";s.appendChild(o)}
items.forEach(function(p){var o=el("option","",p.name+" ("+p.role+")");o.value=p.id;s.appendChild(o)});
s.value=v;if(s.selectedIndex<0)s.selectedIndex=0;
}
/* ---- home ---- */
function renderHome(){
var od=0,bl=0;
DATA.tasks.forEach(function(t){if(t.status==="done")return;if(t.blocked)bl++;if(daysLate(t)>0)od++});
nodes.forEach(function(n){var k=n.dataset.k,a=DATA.tasks.filter(function(t){return t.dept===k&&isAlert(t)}).length,b=n.querySelector(".alr");
n.classList.toggle("sel",k===sel&&!$("dept").hidden);
n.querySelector(".cnt").textContent=members(k).length;
b.textContent=a;b.hidden=!a;b.title=a+" overdue or blocked";n.classList.toggle("warn",a>0)});
var box=$("alerts");box.innerHTML="";box.hidden=!(od||bl);
if(od||bl){box.appendChild(el("b","","Attention: "+od+" overdue and "+bl+" blocked task"+(od+bl===1?"":"s")+"."));
Object.keys(NAMES).forEach(function(k){var n=DATA.tasks.filter(function(t){return t.dept===k&&isAlert(t)}).length;if(n){var a=el("a","",NAMES[k]+": "+n);a.href="#"+k;box.appendChild(a)}})}
}
/* ---- people ---- */
function resetForm(){$("f").reset();$("fh").textContent="Add a team member";$("fc").hidden=true}
function renderPeople(){
var list=members(sel).sort(function(a,b){return (a.name||"").localeCompare(b.name||"")});
var sum=$("sum");sum.innerHTML="";
Object.keys(ST).forEach(function(k){var n=list.filter(function(p){return p.status===k}).length;sum.appendChild(el("span","st-"+k,ST[k]+": "+n))});
var cards=$("cards");cards.innerHTML="";
if(!list.length)cards.appendChild(el("div","empty","No one has been added to "+NAMES[sel]+" yet. Use the form below to add the first team member."));
list.forEach(function(p){
var c=el("article","card st-"+p.status);
c.appendChild(el("h4","",p.name));c.appendChild(el("div","role",p.role));
var dl=el("dl");
dl.appendChild(el("dt","","Responsibilities"));dl.appendChild(el("dd","",p.workflow||"Not added yet"));
dl.appendChild(el("dt","","Working on now"));dl.appendChild(el("dd","",p.task||"Not added yet"));
c.appendChild(dl);
var f=el("footer");
var s=el("select");Object.keys(ST).forEach(function(k){var o=el("option","",ST[k]);o.value=k;if(k===p.status)o.selected=true;s.appendChild(o)});
s.setAttribute("aria-label","Status for "+p.name);
s.addEventListener("change",function(){save("team",Object.assign({},p,{status:s.value,updated:today()}))});
f.appendChild(s);
f.appendChild(btn("Edit","b",function(){editing=p;$("fn").value=p.name;$("fr").value=p.role;$("fw").value=p.workflow||"";$("ft").value=p.task||"";$("fs").value=p.status;$("fh").textContent="Edit "+p.name;$("fc").hidden=false;$("fn").focus()}));
f.appendChild(btn("Remove","b d",function(){if(confirm("Remove "+p.name+" from "+NAMES[sel]+"?"))del("team",p.id)}));
if(p.updated)f.appendChild(el("small","","Updated "+p.updated));
c.appendChild(f);cards.appendChild(c);
});
}
$("f").addEventListener("submit",function(ev){
ev.preventDefault();
var name=$("fn").value.trim(),role=$("fr").value.trim();if(!name||!role)return;
save("team",{id:editing?editing.id:null,dept:editing?editing.dept:sel,name:name,role:role,workflow:$("fw").value.trim(),task:$("ft").value.trim(),status:$("fs").value,updated:today()});
editing=null;resetForm();
});
$("fc").addEventListener("click",function(){editing=null;resetForm()});
/* ---- tasks ---- */
function resetTask(){$("tf").reset();$("tfh").textContent="Add a task";$("tfc").hidden=true}
function taskCard(t){
var late=daysLate(t),blocked=t.blocked&&t.status!=="done";
var c=el("article","tcard"+(blocked?" blocked":"")+(late>0?" late":""));
c.appendChild(el("h5","",t.title));
c.appendChild(el("div","meta","Assigned to: "+(nameOf(t.assigneeId)||"Unassigned")));
if(t.due){c.appendChild(el("div","meta"+(late>0?" bad":""),"Due: "+fmt(t.due)+(t.status==="done"?"":late>0?" · Overdue by "+late+(late===1?" day":" days"):late===0?" · Due today":"")))}
if(blocked)c.appendChild(el("div","flag","Blocked"));
var i=ORDER.indexOf(t.status),tb=el("div","tb");
var l=btn("←","",function(){save("tasks",Object.assign({},t,{status:ORDER[i-1]}))});l.disabled=i<1;l.title="Move back";
var r=btn("→","",function(){save("tasks",Object.assign({},t,{status:ORDER[i+1]}))});r.disabled=i>1;r.title="Move forward";
tb.appendChild(l);tb.appendChild(r);
tb.appendChild(btn(t.blocked?"Unblock":"Block","",function(){save("tasks",Object.assign({},t,{blocked:!t.blocked}))}));
tb.appendChild(btn("Edit","",function(){editingTask=t;$("tn").value=t.title;$("tas").value=t.assigneeId||"";$("tdu").value=t.due||"";$("tst").value=t.status;$("tbl").checked=!!t.blocked;$("tfh").textContent="Edit task";$("tfc").hidden=false;$("tn").focus()}));
tb.appendChild(btn("Remove","d",function(){if(confirm("Remove this task?"))del("tasks",t.id)}));
c.appendChild(tb);return c;
}
function renderTasks(){
var tasks=DATA.tasks.filter(function(t){return t.dept===sel});
fillSelect($("tas"),members(sel),"Unassigned");
var od=tasks.filter(function(t){return daysLate(t)>0}).length,bl=tasks.filter(function(t){return t.blocked&&t.status!=="done"}).length;
var sum=$("tsum");sum.innerHTML="";
sum.appendChild(el("span","st-block","Overdue: "+od));sum.appendChild(el("span","st-block","Blocked: "+bl));
var board=$("board");board.innerHTML="";
ORDER.forEach(function(s){
var c=el("div","bcol"),list=tasks.filter(function(t){return t.status===s}).sort(function(a,b){return (a.due||"9999").localeCompare(b.due||"9999")});
c.appendChild(el("h4","",TS[s]+" ("+list.length+")"));
if(!list.length)c.appendChild(el("div","bempty","No tasks"));
list.forEach(function(t){c.appendChild(taskCard(t))});
board.appendChild(c);
});
}
$("tf").addEventListener("submit",function(ev){
ev.preventDefault();var title=$("tn").value.trim();if(!title)return;
save("tasks",{id:editingTask?editingTask.id:null,dept:editingTask?editingTask.dept:sel,title:title,assigneeId:$("tas").value,due:$("tdu").value,status:$("tst").value,blocked:$("tbl").checked,updated:iso()});
editingTask=null;resetTask();
});
$("tfc").addEventListener("click",function(){editingTask=null;resetTask()});
/* ---- daily log ---- */
function renderLogs(){
var m=members(sel);fillSelect($("lp"),m);
if(!$("ld").value)$("ld").value=iso();
var f=$("lf").value;
var list=DATA.logs.filter(function(l){return l.dept===sel&&(!f||l.date===f)}).sort(function(a,b){return b.date.localeCompare(a.date)||(b.created||0)-(a.created||0)});
var td=iso(),done=DATA.logs.filter(function(l){return l.dept===sel&&l.date===td}).map(function(l){return l.personId});
var miss=m.filter(function(p){return done.indexOf(p.id)<0}).map(function(p){return p.name});
$("lpend").textContent=m.length?(miss.length?"No update yet today: "+miss.join(", "):"Everyone has posted an update today."):"Add people in the People tab first, then log their daily updates here.";
var box=$("llist");box.innerHTML="";
if(!list.length)box.appendChild(el("div","empty",f?"No updates for "+fmt(f)+".":"No daily updates have been logged for "+NAMES[sel]+" yet."));
var last="";
list.forEach(function(l){
if(l.date!==last){box.appendChild(el("h4","ldate",fmt(l.date)));last=l.date}
var e=el("div","lentry"),p=DATA.team.filter(function(x){return x.id===l.personId})[0];
var h=el("div");h.appendChild(el("b","",p?p.name:"Former member"));if(p)h.appendChild(el("small","",p.role));
e.appendChild(h);e.appendChild(el("p","",l.text));
e.appendChild(btn("Remove","",function(){if(confirm("Remove this update?"))del("logs",l.id)}));
box.appendChild(e);
});
}
$("lfm").addEventListener("submit",function(ev){
ev.preventDefault();var t=$("lt").value.trim();if(!t||!$("lp").value||!$("ld").value)return;
save("logs",{dept:sel,personId:$("lp").value,date:$("ld").value,text:t,created:Date.now()});$("lt").value="";
});
$("lf").addEventListener("change",renderLogs);
$("lfa").addEventListener("click",function(){$("lf").value="";renderLogs()});
/* ---- tabs and routing ---- */
function setTab(t){tab=t;document.querySelectorAll(".tab").forEach(function(b){var on=b.dataset.t===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",on)});
["people","tasks","logs"].forEach(function(k){$("p-"+k).hidden=k!==t})}
document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){setTab(b.dataset.t)})});
function render(){
renderHome();
if($("dept").hidden)return;
$("tt").textContent=NAMES[sel];$("dd").textContent=D[sel][1];
var tc=DATA.tasks.filter(function(t){return t.dept===sel}).length;
var tabs=document.querySelectorAll(".tab");
tabs[0].textContent="People ("+members(sel).length+")";tabs[1].textContent="Task board ("+tc+")";tabs[2].textContent="Daily log";
renderPeople();renderTasks();renderLogs();
}
function route(){
var k=location.hash.slice(1);
if(NAMES[k]){sel=k;editing=null;editingTask=null;resetForm();resetTask();$("lf").value="";setTab("people");$("home").hidden=true;$("dept").hidden=false;document.title=NAMES[k]+" | Innovatiview India Limited";window.scrollTo(0,0)}
else{$("dept").hidden=true;$("home").hidden=false;document.title="Innovatiview India Limited (IT Infra and Cyber Security)"}
render();
}
window.addEventListener("hashchange",route);
route();
(async function(){
var db=null;
try{if(typeof claude!=="undefined")db=await claude.use("db")}catch(e){}
var names=["team","tasks","logs"];
if(db){
var timer=setTimeout(function(){note("Team data can’t be reached yet. What you see may be out of date.")},10000);
names.forEach(function(n){
cols[n]=db.collection(n);
cols[n].onSnapshot(function(snap){
clearTimeout(timer);if(!snap.metadata||!snap.metadata.fromCache)note("");
DATA[n]=snap.docs.map(function(d){return Object.assign({id:d.id},d.data())});render();
},function(){clearTimeout(timer);note("Team data can’t be loaded right now.")});
});
}else{
names.forEach(function(n){try{DATA[n]=JSON.parse(localStorage.getItem("it_"+n)||"[]")}catch(e){DATA[n]=[]}});
render();
}
})();
