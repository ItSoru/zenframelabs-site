# zenframelabs.com

The Zenframe Labs website. Plain HTML, CSS and JavaScript, no build step.

- `public/` is the whole site: `index.html` is the page.
- `public/site.js` reads the latest Zenframe Assistant release from GitHub, so the version number, download button and changelog update on their own.
- `public/assets/` holds the logo and the Zeni animation.

Zeni's character and artwork, the Zenframe and Zenframe Labs names and the Zenframe logo belong to Zenframe Labs. All rights reserved.
- `wrangler.jsonc` tells Cloudflare to serve the `public` folder.
