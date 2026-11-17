const fs=require('fs');
const people=[['Gaurav Saxena','Deputy Manager'],['Suraj Kumar Chaudhary','Deputy Manager'],['Vishal Jaiswal','Associate'],['Vivek Dhoundiyal','Sr. Associate'],['Sumegh Yadav','Assistant Manager'],['Mithlesh','Sr. Associate']];
const person=(name,role,extra='')=>'<div class="ops-person '+extra+'"><strong>'+name+'</strong><span>'+role+'</span></div>';
const chart='<section id="ops-org" class="ops-org" aria-labelledby="ops-org-title" hidden><h3 id="ops-org-title">IT Operations · Team structure</h3><ul class="ops-tree" aria-label="IT Operations reporting hierarchy"><li>'+person('Prasoon Prashant','Sr. Manager','ops-manager')+'<ul class="ops-reports" aria-label="Reports to Prasoon Prashant">'+people.map(([name,role])=>'<li>'+person(name,role)+'</li>').join('')+'</ul></li></ul></section>';
for(const file of ['index.html','build-home.cjs']){
 let html=fs.readFileSync(file,'utf8');
 html=html.replace('<div id="p-people">','<div id="p-people">'+chart);
 html=html.replace('<link rel="stylesheet" href="products.css">','<link rel="stylesheet" href="products.css"><link rel="stylesheet" href="ops-chart.css">');
 fs.writeFileSync(file,html);
}
