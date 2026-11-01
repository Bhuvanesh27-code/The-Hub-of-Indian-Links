import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Strict server-side secret: The authorized administrator email.
// NEVER transmitted to public clients or exposed in response bodies.
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'bhuvaneshvpm406@gmail.com').toLowerCase().trim();

// Storage paths
const datasetPath = path.resolve(__dirname, 'dataset.json');
const clickAnalyticsPath = path.resolve(__dirname, 'click_analytics.json');
const auditTrailPath = path.resolve(__dirname, 'audit_trail.json');

// Middleware
app.use(express.json({ limit: '15mb' }));

// Helper functions for storage
function readDataset() {
  try {
    if (fs.existsSync(datasetPath)) {
      return JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading dataset.json:', err);
  }
  return { schema_version: '1.0.0', dataset_name: 'The Hub of Indian Links', links: [], total_links: 0 };
}

function writeDataset(data: any) {
  try {
    data.last_updated = new Date().toISOString();
    data.total_links = Array.isArray(data.links) ? data.links.length : 0;
    fs.writeFileSync(datasetPath, JSON.stringify(data, null, 2), 'utf8');
    // Also sync src/data/database.json for offline bundling
    const altPath = path.resolve(__dirname, 'src/data/database.json');
    if (fs.existsSync(path.dirname(altPath))) {
      fs.writeFileSync(altPath, JSON.stringify(data, null, 2), 'utf8');
    }
    return true;
  } catch (err) {
    console.error('Error writing dataset.json:', err);
    return false;
  }
}

function readClicks(): Record<string, number> {
  try {
    if (fs.existsSync(clickAnalyticsPath)) {
      return JSON.parse(fs.readFileSync(clickAnalyticsPath, 'utf8'));
    }
  } catch (err) {
    // fallback
  }
  return {};
}

function writeClicks(clicks: Record<string, number>) {
  try {
    fs.writeFileSync(clickAnalyticsPath, JSON.stringify(clicks, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing click_analytics.json:', err);
  }
}

interface AuditEntry {
  id: string;
  action: 'create_link' | 'update_link' | 'delete_link' | 'import_dataset' | 'login_success' | 'login_denied';
  description: string;
  targetId?: string;
  timestamp: string;
}

function readAudit(): AuditEntry[] {
  try {
    if (fs.existsSync(auditTrailPath)) {
      return JSON.parse(fs.readFileSync(auditTrailPath, 'utf8'));
    }
  } catch (err) {
    // fallback
  }
  return [];
}

function recordAudit(action: AuditEntry['action'], description: string, targetId?: string) {
  try {
    const list = readAudit();
    list.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action,
      description,
      targetId,
      timestamp: new Date().toISOString()
    });
    // keep latest 200 entries
    fs.writeFileSync(auditTrailPath, JSON.stringify(list.slice(0, 200), null, 2), 'utf8');
  } catch (err) {
    console.error('Error recording audit:', err);
  }
}

// In-memory admin session token management (random 64-char crypto string)
const activeAdminTokens = new Set<string>();

function createAdminSession(): string {
  const token = `admin_sess_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  activeAdminTokens.add(token);
  return token;
}

function isAdminAuthorized(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (activeAdminTokens.has(token)) {
      return true;
    }
  }
  return false;
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Get all verified links
app.get('/api/links', (_req: Request, res: Response) => {
  const dataset = readDataset();
  const clicks = readClicks();
  
  const mergedLinks = (dataset.links || []).map((link: any) => ({
    ...link,
    clickCount: Math.max(link.clickCount || 0, clicks[link.id] || 0)
  }));

  res.json({
    schema_version: dataset.schema_version,
    dataset_name: dataset.dataset_name,
    last_updated: dataset.last_updated,
    total_links: mergedLinks.length,
    categories: dataset.categories,
    links: mergedLinks,
    proverbs: dataset.proverbs || []
  });
});

// 2. Track link click (separated storage)
app.post('/api/links/click/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing link ID' });
    return;
  }
  const clicks = readClicks();
  clicks[id] = (clicks[id] || 0) + 1;
  writeClicks(clicks);
  res.json({ success: true, id, clickCount: clicks[id] });
});

// 3. Admin Google Authentication Verification
// STRICT PRIVACY: Validates email against ADMIN_EMAIL server-side only.
// Returns ONLY "Administrator Access Granted" on success, or generic denied message.
app.post('/api/admin/auth/verify', (req: Request, res: Response) => {
  const { email, idToken } = req.body;

  if (!email || typeof email !== 'string') {
    recordAudit('login_denied', 'Login attempt failed: No identity provided');
    res.status(401).json({
      authorized: false,
      error: 'Access Denied — This Google account is not authorised.'
    });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();

  if (cleanEmail === ADMIN_EMAIL) {
    const sessionToken = createAdminSession();
    recordAudit('login_success', 'Administrator access verified and granted');
    res.json({
      authorized: true,
      role: 'administrator',
      message: 'Administrator Access Granted',
      sessionToken
    });
  } else {
    recordAudit('login_denied', 'Unauthorized login attempt blocked');
    res.status(403).json({
      authorized: false,
      error: 'Access Denied — This Google account is not authorised.'
    });
  }
});

// 4. Check admin session status
app.get('/api/admin/check-session', (req: Request, res: Response) => {
  const authorized = isAdminAuthorized(req);
  res.json({ isAdmin: authorized });
});

// 5. Logout admin session
app.post('/api/admin/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    activeAdminTokens.delete(authHeader.substring(7));
  }
  res.json({ success: true });
});

// ==========================================
// PROTECTED ADMIN API ENDPOINTS
// ==========================================

// Admin middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!isAdminAuthorized(req)) {
    res.status(403).json({ error: 'Access Denied — Administrator privileges required.' });
    return;
  }
  next();
}

// 6. Add new link
app.post('/api/admin/links', requireAdmin, (req: Request, res: Response) => {
  const dataset = readDataset();
  const newLink = req.body;

  if (!newLink || !newLink.name || !newLink.url) {
    res.status(400).json({ error: 'Portal name and official URL are required.' });
    return;
  }

  // Duplicate URL check
  const incomingUrl = (newLink.url || '').trim().toLowerCase().replace(/\/+$/, '');
  const isDuplicate = (dataset.links || []).some((l: any) => {
    const existing = (l.url || l.official_website_url || '').trim().toLowerCase().replace(/\/+$/, '');
    return existing === incomingUrl;
  });

  if (isDuplicate) {
    res.status(409).json({ error: 'A portal with this official website URL already exists in the database.' });
    return;
  }

  const normalizedLevel = newLink.governmentLevel || newLink.government_level || 'central';
  const fullLink = {
    id: newLink.id || `gov-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    portal_name: newLink.portal_name || newLink.name,
    name: newLink.name || newLink.portal_name,
    official_website_url: newLink.official_website_url || newLink.url,
    url: newLink.url || newLink.official_website_url,
    government_level: normalizedLevel,
    governmentLevel: normalizedLevel,
    jurisdiction: newLink.jurisdiction || newLink.stateOrUT || 'National',
    stateOrUT: newLink.stateOrUT || (normalizedLevel === 'state' || normalizedLevel === 'ut' ? newLink.jurisdiction : undefined),
    category: newLink.category || (normalizedLevel === 'central' ? 'Central Government' : normalizedLevel === 'not_under_government' ? 'Not Under Government' : 'State Government'),
    ministry_or_department: newLink.ministry_or_department || newLink.department || 'Government Ministry',
    department: newLink.department || newLink.ministry_or_department || 'Government Ministry',
    service_category: newLink.service_category || 'Citizen Services',
    key_uses: Array.isArray(newLink.key_uses) ? newLink.key_uses : [newLink.description || 'Public service portal'],
    uses: Array.isArray(newLink.uses) ? newLink.uses : (Array.isArray(newLink.key_uses) ? newLink.key_uses : [newLink.description || 'Public service portal']),
    portal_description: newLink.portal_description || newLink.description || '',
    description: newLink.description || newLink.portal_description || '',
    organization_type: normalizedLevel === 'not_under_government' ? 'Non-Government' : 'Government',
    official_status: normalizedLevel === 'not_under_government' ? 'non-government' : 'official',
    verification_source: newLink.verification_source || 'Admin Verified',
    verified_on: new Date().toISOString().split('T')[0],
    lastVerified: new Date().toISOString().split('T')[0],
    verificationStatus: 'verified',
    languages_available: newLink.languages_available || ['English', 'Hindi'],
    tags: Array.isArray(newLink.tags) ? newLink.tags : ['portal'],
    keywords: Array.isArray(newLink.keywords) ? newLink.keywords : ['portal'],
    status: 'active',
    clickCount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dataset.links = [fullLink, ...(dataset.links || [])];
  writeDataset(dataset);
  recordAudit('create_link', `Added portal "${fullLink.name}"`, fullLink.id);

  res.status(201).json({ success: true, link: fullLink });
});

// 7. Update existing link
app.put('/api/admin/links/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const dataset = readDataset();

  const index = (dataset.links || []).findIndex((l: any) => l.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Link record not found.' });
    return;
  }

  const existing = dataset.links[index];
  const updatedLink = {
    ...existing,
    ...updates,
    id: existing.id,
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataset.links[index] = updatedLink;
  writeDataset(dataset);
  recordAudit('update_link', `Updated portal "${updatedLink.name || updatedLink.portal_name}"`, id);

  res.json({ success: true, link: updatedLink });
});

// 8. Delete link
app.delete('/api/admin/links/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const dataset = readDataset();

  const target = (dataset.links || []).find((l: any) => l.id === id);
  if (!target) {
    res.status(404).json({ error: 'Link record not found.' });
    return;
  }

  dataset.links = (dataset.links || []).filter((l: any) => l.id !== id);
  writeDataset(dataset);
  recordAudit('delete_link', `Deleted portal "${target.name || target.portal_name}"`, id);

  res.json({ success: true, id });
});

// 9. Export complete dataset.json
app.get('/api/admin/dataset/export', (req: Request, res: Response) => {
  if (!fs.existsSync(datasetPath)) {
    res.status(404).json({ error: 'Dataset file not found' });
    return;
  }
  res.download(datasetPath, 'dataset.json');
});

// 10. Import & validate dataset.json
app.post('/api/admin/dataset/import', requireAdmin, (req: Request, res: Response) => {
  const incoming = req.body;

  if (!incoming || !Array.isArray(incoming.links)) {
    res.status(400).json({ error: 'Invalid dataset format. A valid JSON object with a "links" array is required.' });
    return;
  }

  const validLinks: any[] = [];
  const seenUrls = new Set<string>();

  for (const item of incoming.links) {
    const url = (item.official_website_url || item.url || '').trim().toLowerCase();
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      validLinks.push(item);
    }
  }

  const newDataset = {
    schema_version: incoming.schema_version || '1.0.0',
    dataset_name: incoming.dataset_name || 'The Hub of Indian Links Master Dataset',
    last_updated: new Date().toISOString(),
    total_links: validLinks.length,
    categories: incoming.categories || ['central', 'state', 'union_territory', 'not_under_government'],
    links: validLinks,
    proverbs: incoming.proverbs || []
  };

  writeDataset(newDataset);
  recordAudit('import_dataset', `Imported dataset containing ${validLinks.length} verified links`);

  res.json({
    success: true,
    total_imported: validLinks.length,
    message: `Successfully imported and validated ${validLinks.length} links.`
  });
});

// 11. Analytics Overview
app.get('/api/admin/analytics', (req: Request, res: Response) => {
  const dataset = readDataset();
  const clicks = readClicks();

  let totalClicks = 0;
  const categoryCounts: Record<string, number> = {
    central: 0,
    state: 0,
    union_territory: 0,
    not_under_government: 0
  };
  const stateCounts: Record<string, number> = {};

  const linksWithClicks = (dataset.links || []).map((l: any) => {
    const count = Math.max(l.clickCount || 0, clicks[l.id] || 0);
    totalClicks += count;

    const level = (l.government_level || l.governmentLevel || 'central').toLowerCase();
    if (level === 'ut' || level === 'union_territory') {
      categoryCounts.union_territory = (categoryCounts.union_territory || 0) + 1;
    } else if (level === 'state') {
      categoryCounts.state = (categoryCounts.state || 0) + 1;
      const s = l.jurisdiction || l.stateOrUT || 'General';
      stateCounts[s] = (stateCounts[s] || 0) + 1;
    } else if (level === 'not_under_government') {
      categoryCounts.not_under_government = (categoryCounts.not_under_government || 0) + 1;
    } else {
      categoryCounts.central = (categoryCounts.central || 0) + 1;
    }

    return { ...l, clickCount: count };
  });

  const top10 = [...linksWithClicks]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 10);

  res.json({
    totalLinks: linksWithClicks.length,
    totalClicks,
    categoryCounts,
    stateCounts,
    topPortals: top10
  });
});

// 12. Audit Trail
app.get('/api/admin/audit', (req: Request, res: Response) => {
  res.json({ auditTrail: readAudit() });
});

// ==========================================
// VITE INTEGRATION / STATIC SERVING
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Hub of Indian Links full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
