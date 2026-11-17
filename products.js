// Add products here to extend the organisation's catalogue.
const organisationProducts = [
  {
    name: 'Cisco Meraki', vendor: 'CISCO', category: 'Networking & cloud management', theme: 'meraki', mark: 'M',
    description: 'Cloud-managed networking for connecting and managing network devices.',
    detail: 'Explore Cisco Meraki networking products and solutions.',
    url: 'https://meraki.cisco.com/'
  },
  {
    name: 'Seqrite XDR', vendor: 'SEQRITE', category: 'Extended detection & response', theme: 'seqrite-xdr', mark: 'X',
    description: 'Extended detection and response to help security teams detect and investigate threats.',
    detail: 'Explore Seqrite XDR security capabilities.',
    url: 'https://www.seqrite.com/'
  },
  {
    name: 'Seqrite EDR', vendor: 'SEQRITE', category: 'Endpoint detection & response', theme: 'seqrite-edr', mark: 'E',
    description: 'Endpoint detection and response for monitoring and responding to endpoint threats.',
    detail: 'Explore Seqrite endpoint security capabilities.',
    url: 'https://www.seqrite.com/endpoint-security/'
  },
  {
    name: 'Google Workspace', vendor: 'GOOGLE', category: 'Cloud productivity & collaboration', theme: 'workspace', mark: 'G',
    description: 'Cloud productivity and collaboration tools for communication and teamwork.',
    detail: 'Explore Google Workspace apps and services.',
    url: 'https://workspace.google.com/'
  },
  {
    name: 'Cisco ISE', vendor: 'CISCO', category: 'Network access control', theme: 'ise', mark: 'I',
    description: 'Network access control that helps manage access for users and devices.',
    detail: 'Explore Cisco Identity Services Engine.',
    url: 'https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html'
  }
];
const productGrid = document.getElementById('product-grid');
if (productGrid) {
  organisationProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card product-' + product.theme;
    const identity = document.createElement('div');
    identity.className = 'product-identity';
    const mark = document.createElement('span');
    mark.className = 'product-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = product.mark;
    const vendor = document.createElement('span');
    vendor.className = 'product-vendor';
    vendor.textContent = product.vendor;
    const badge = document.createElement('span');
    badge.className = 'product-badge';
    badge.textContent = 'Used at Innovatiview';
    identity.append(mark, vendor, badge);
    const content = document.createElement('div');
    content.className = 'product-content';
    const category = document.createElement('p');
    category.className = 'eyebrow';
    category.textContent = product.category;
    const title = document.createElement('h3');
    title.textContent = product.name;
    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description;
    const detail = document.createElement('p');
    detail.className = 'product-detail';
    detail.textContent = product.detail;
    const actions = document.createElement('div');
    actions.className = 'product-actions';
    const link = document.createElement('a');
    link.href = product.url;
    link.textContent = 'Explore ' + product.name + ' ↗';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.append(link);
    content.append(category, title, description, detail, actions);
    card.append(identity, content);
    productGrid.append(card);
  });

  const cards = Array.from(productGrid.children);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  cards.forEach(function(card) {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(function(link) { link.tabIndex = -1; });
    productGrid.append(clone);
  });

  let hovered = false;
  let focused = false;

  function updateMotion() {
    productGrid.classList.toggle('is-paused', hovered || focused || document.hidden || reducedMotion.matches);
  }

  productGrid.addEventListener('pointerover', function(event) {
    const card = event.target.closest('.product-card');
    if (card && !card.contains(event.relatedTarget)) {
      hovered = true;
      updateMotion();
    }
  });
  productGrid.addEventListener('pointerout', function(event) {
    const card = event.target.closest('.product-card');
    const nextCard = event.relatedTarget && event.relatedTarget.closest('.product-card');
    if (card && !nextCard) {
      hovered = false;
      updateMotion();
    }
  });
  productGrid.addEventListener('focusin', function() {
    focused = true;
    updateMotion();
  });
  productGrid.addEventListener('focusout', function() {
    requestAnimationFrame(function() {
      focused = !!productGrid.querySelector('.product-card:focus-within');
      updateMotion();
    });
  });
  document.addEventListener('visibilitychange', updateMotion);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateMotion);
  else reducedMotion.addListener(updateMotion);
  updateMotion();
}
