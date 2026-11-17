# Innovatiview IT & Cyber Security

An HCLTech-style frontend integrated with the existing Innovatiview department portal. It uses the requested HCLTech header and hero with Innovatiview portal content below; it is not a pixel-identical copy of every page on hcltech.com.

## Open

Open `index.html` directly in your browser, or run `node server.cjs` and visit http://127.0.0.1:8080. No dependency installation or build is required.

## Included

- Responsive homepage, navigation menu, the original HCLTech magazine hero and searchable department directory.
- Existing organisation chart, seven department/leadership workspaces, people editor, task boards, overdue/blocked alerts and daily logs.
- Direct task/log routes such as `#ops/tasks` and `#noc/logs`.
- Local fonts and artwork in `assets/`; no remote asset requests are needed.

## Files

- `index.html`: complete homepage and integrated portal markup.
- `site.css`, `site.js`: new frontend styling and interactions.
- `style.css`, `script.js`: original portal styles and logic, with routing integration.
- `original/`: untouched backups of the three supplied files.

Data uses the original `it_team`, `it_tasks`, and `it_logs` localStorage keys. Storage is specific to a browser and origin. Opening the site at a different URL does not migrate data from the previous origin. The existing optional database adapter remains in place, but no shared backend or authentication has been configured.

Design reference: https://www.hcltech.com/. The locally bundled Roobert font files and abstract feature artwork came from the reference site. The original HCLTech logo and HBR banner are bundled locally. Capability graphics are implemented in CSS. This project has not been deployed publicly.


Current hero: Abhishek Agarwal, Whole-time Director, with his official Innovatiview portrait, supplied biography, official profile and LinkedIn links. The newspaper layout is HTML/CSS and adapts to mobile screens.

Products catalogue: edit organisationProducts in products.js to add or update products. The Products section features Cisco Meraki, Seqrite XDR, Seqrite EDR, Google Workspace and Cisco ISE in a continuously scrolling carousel. It pauses when a product is hovered or focused. Product badges indicate the tools supplied by the user, not live service health or deployment monitoring.
