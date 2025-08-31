/* =========================
   Dynamic Sitemap Generator
   ========================= */

import { CONFIG } from './config.js';

/**
 * Generate sitemap URLs based on current content
 */
export class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://3dime.com';
    this.lastmod = new Date().toISOString();
  }

  /**
   * Extract dynamic content for sitemap generation
   */
  async extractContent() {
    try {
      // Load structured data for content extraction
      const response = await fetch('./structured-data.jsonld');
      const structuredData = response.ok ? await response.json() : null;
      
      // Extract URLs from current page content
      const contentUrls = this.extractContentUrls();
      
      return {
        structuredData,
        contentUrls,
        lastmod: this.lastmod
      };
    } catch (error) {
      console.warn('Sitemap Generator: Could not extract all content:', error);
      return {
        structuredData: null,
        contentUrls: this.extractContentUrls(),
        lastmod: this.lastmod
      };
    }
  }

  /**
   * Extract URLs from page content sections
   */
  extractContentUrls() {
    const urls = new Set();
    
    // Extract from technology links
    document.querySelectorAll('[aria-label="technologies"] a[href^="http"]').forEach(link => {
      urls.add(link.href);
    });
    
    // Extract from experience/project links
    document.querySelectorAll('[aria-label="experience"] a[href^="http"]').forEach(link => {
      urls.add(link.href);
    });
    
    // Extract from education links  
    document.querySelectorAll('[aria-label="education"] a[href^="http"]').forEach(link => {
      urls.add(link.href);
    });
    
    // Extract from social media links
    document.querySelectorAll('[aria-label="profile"] a[href^="http"]').forEach(link => {
      urls.add(link.href);
    });
    
    return Array.from(urls);
  }

  /**
   * Generate XML sitemap content
   */
  generateSitemapXML(content) {
    const { structuredData, contentUrls, lastmod } = content;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Main homepage -->
  <url>
    <loc>${this.baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <mobile:mobile/>
    <image:image>
      <image:loc>${this.baseUrl}/assets/logo.png</image:loc>
      <image:title>3dime Logo - Personal Social Hub</image:title>
      <image:caption>Logo for Idriss Mohamady's personal social hub showcasing development skills</image:caption>
    </image:image>
    <image:image>
      <image:loc>${this.baseUrl}/assets/background.jpg</image:loc>
      <image:title>3dime Background</image:title>
      <image:caption>Modern glass-morphism design background for 3dime website</image:caption>
    </image:image>
  </url>

  <!-- Multilingual alternatives -->
  <url>
    <loc>${this.baseUrl}/?lang=en</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
    <xhtml:link rel="alternate" hreflang="fr" href="${this.baseUrl}/?lang=fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${this.baseUrl}/"/>
  </url>

  <url>
    <loc>${this.baseUrl}/?lang=fr</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
    <xhtml:link rel="alternate" hreflang="en" href="${this.baseUrl}/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${this.baseUrl}/"/>
  </url>

  <!-- PWA Resources -->
  <url>
    <loc>${this.baseUrl}/assets/manifest.json</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Structured Data -->
  <url>
    <loc>${this.baseUrl}/structured-data.jsonld</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>`;

    // Add dynamic content URLs if available
    if (contentUrls && contentUrls.length > 0) {
      xml += `
  
  <!-- Referenced External Content -->`;
      
      contentUrls.forEach(url => {
        xml += `
  <url>
    <loc>${this.escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>`;
      });
    }

    xml += `
</urlset>`;

    return xml;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Generate and download sitemap
   */
  async generateAndDownload() {
    try {
      const content = await this.extractContent();
      const xml = this.generateSitemapXML(content);
      
      // Create downloadable blob
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `sitemap-generated-${new Date().toISOString().split('T')[0]}.xml`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Sitemap Generator: Sitemap generated and downloaded successfully');
      return xml;
    } catch (error) {
      console.error('Sitemap Generator: Failed to generate sitemap:', error);
      throw error;
    }
  }

  /**
   * Display sitemap info in console for debugging
   */
  async logSitemapInfo() {
    try {
      const content = await this.extractContent();
      console.log('Sitemap Generator: Content analysis', {
        structuredDataAvailable: !!content.structuredData,
        contentUrls: content.contentUrls.length,
        lastModified: content.lastmod,
        sampleUrls: content.contentUrls.slice(0, 5)
      });
    } catch (error) {
      console.error('Sitemap Generator: Failed to analyze content:', error);
    }
  }
}

// Export for development/debugging
if (typeof window !== 'undefined') {
  window.SitemapGenerator = SitemapGenerator;
}