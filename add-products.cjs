const fs=require('fs');
const section='<section class="products-section" id="products" aria-labelledby="products-title"><div class="shell"><p class="eyebrow">OUR TECHNOLOGY TOOLKIT</p><div class="section-heading"><h2 id="products-title">Products We Use</h2><p class="products-intro">Meet the technology used at Innovatiview to support our IT and cyber security teams.</p></div><div class="product-grid" id="product-grid"></div><noscript><p>We use Seqrite and Cisco Duo. Visit <a href="https://www.seqrite.com/">Seqrite</a> or <a href="https://duo.com/">Cisco Duo</a> to learn more.</p></noscript></div></section>\n';
for(const file of ['index.html','build-home.cjs']) {
  let html=fs.readFileSync(file,'utf8');
  html=html.replace('<section class="growth">',section+'<section class="growth">');
  html=html.replace('<link rel="stylesheet" href="director.css">','<link rel="stylesheet" href="director.css"><link rel="stylesheet" href="products.css">');
  html=html.replace('<script src="site.js"></script>','<script src="site.js"></script><script src="products.js"></script>');
  html=html.replace('<a href="https://www.hcl-software.com/">HCLSoftware</a>','<a href="#products">Products</a>');
  html=html.replace('<a href="#services">What we do <span>↗</span></a>','<a href="#services">What we do <span>↗</span></a><a href="#products">Products we use <span>↗</span></a>');
  html=html.replace('<div class="footer-links">','<div class="footer-links"><a href="#products">Products we use</a>');
  fs.writeFileSync(file,html);
}
let reference=fs.readFileSync('update-reference.cjs','utf8');
reference=reference.replace('<a href="https://www.hcl-software.com/">HCLSoftware</a>','<a href="#products">Products</a>');
fs.writeFileSync('update-reference.cjs',reference);
