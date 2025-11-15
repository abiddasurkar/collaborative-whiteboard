#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Automatically generates sitemap.xml for SEO
 * Usage: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://abiddasurkar.github.io/collaborative-whiteboard';
const OUTPUT_PATH = path.join(__dirname, 'public', 'sitemap.xml');

// Routes to include in sitemap
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/board/sample-board-1',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/board/sample-board-2',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/board/sample-board-3',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/features',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/about',
    priority: 0.5,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0],
  },
];

/**
 * Generate XML for a single URL entry
 * @param {Object} route - Route configuration
 * @returns {string} XML string for the URL
 */
function generateUrlEntry(route) {
  const url = `${BASE_URL}${route.path}`;
  const lastmod = route.lastmod || new Date().toISOString().split('T')[0];
  const changefreq = route.changefreq || 'weekly';
  const priority = route.priority || 0.5;

  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <mobile:mobile/>
  </url>`;
}

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Generate complete sitemap XML
 * @param {Array} routes - Array of routes
 * @returns {string} Complete sitemap XML
 */
function generateSitemap(routes) {
  const urlEntries = routes.map(generateUrlEntry).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.mobile.googlebot.com/schemas/mobile-1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urlEntries}

</urlset>`;
}

/**
 * Write sitemap to file
 * @param {string} content - Sitemap XML content
 */
function writeSitemap(content) {
  try {
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    console.log(`📄 Total URLs: ${routes.length}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
  } catch (error) {
    console.error('❌ Error writing sitemap:', error.message);
    process.exit(1);
  }
}

/**
 * Generate robots.txt with sitemap reference
 */
function generateRobotsTxt() {
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  const robotsContent = `# Collaborative Whiteboard - robots.txt
# Rules for web crawlers and search engine bots

# Allow all bots
User-agent: *
Allow: /collaborative-whiteboard/
Allow: /collaborative-whiteboard/board/
Disallow: /collaborative-whiteboard/admin/

# Google specific
User-agent: Googlebot
Allow: /collaborative-whiteboard/
Crawl-delay: 0

# Bing specific
User-agent: Bingbot
Allow: /collaborative-whiteboard/
Crawl-delay: 1

# Yahoo specific
User-agent: Slurp
Allow: /collaborative-whiteboard/
Crawl-delay: 1

# DuckDuckGo
User-agent: DuckDuckBot
Allow: /collaborative-whiteboard/

# Yandex
User-agent: YandexBot
Allow: /collaborative-whiteboard/

# Baidu
User-agent: Baiduspider
Allow: /collaborative-whiteboard/

# Default crawl delay for all bots
Crawl-delay: 1

# Request rate (pages per second)
Request-rate: 1/1s

# Sitemap location - IMPORTANT for SEO
Sitemap: ${BASE_URL}/sitemap.xml

# Allow robots to access CSS, JS, and images
Allow: *.js
Allow: *.css
Allow: *.jpg
Allow: *.jpeg
Allow: *.png
Allow: *.gif
Allow: *.svg
Allow: *.webp`;

  try {
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');
    console.log('✅ Robots.txt updated successfully!');
  } catch (error) {
    console.error('❌ Error writing robots.txt:', error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Generating sitemap...\n');

  try {
    // Generate sitemap
    const sitemap = generateSitemap(routes);
    writeSitemap(sitemap);

    // Generate/Update robots.txt
    generateRobotsTxt();

    console.log('\n✨ Done! Your SEO files are ready.');
    console.log('\nNext steps:');
    console.log('1. Verify sitemap.xml in public/ folder');
    console.log('2. Verify robots.txt in public/ folder');
    console.log('3. Deploy to GitHub Pages: npm run deploy');
    console.log('4. Submit sitemap to Google Search Console');
    console.log('5. Submit sitemap to Bing Webmaster Tools\n');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();

module.exports = {
  generateSitemap,
  generateUrlEntry,
  escapeXml,
};