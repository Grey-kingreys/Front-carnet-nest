import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';

// Gestion des chemins de manière cross-platform
const getDirname = (url) => {
  const __filename = fileURLToPath(url);
  return dirname(__filename);
};

const __dirname = getDirname(import.meta.url);

// Liste des routes de votre application
const routes = [
  '/',
  '/accueil',
  '/login',
  '/register',
  '/contacts/all',
  '/profile'
];

const BASE_URL = 'http://localhost:8000';
const DATE = format(new Date(), 'yyyy-MM-dd');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => `
    <url>
      <loc>${`${BASE_URL}${route}`}</loc>
      <lastmod>${DATE}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`)
    .join('')}
</urlset>`;

try {
  // Créer le dossier public s'il n'existe pas
  const publicDir = join(__dirname, '..', 'public');
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Écrire le fichier sitemap.xml
  const sitemapPath = join(publicDir, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap);
  
  console.log(`Sitemap généré avec succès : ${sitemapPath}`);
} catch (error) {
  console.error('Erreur lors de la génération du sitemap:', error);
  process.exit(1);
}
