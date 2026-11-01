import type { FilterOptions, GovernmentLink } from '../types/index.ts';

/**
 * Normalizes query string for robust searching
 */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Splits text into highlighted chunks based on matched search terms
 */
export function highlightMatch(text: string, query: string): { text: string; match: boolean }[] {
  const q = normalizeQuery(query);
  if (!q || !text) return [{ text, match: false }];

  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      match: part.toLowerCase() === q,
    }));
}

/**
 * Returns true if the link URL contains the word "igod" (case-insensitive)
 */
export function isIgodLink(link: { url?: string } | null | undefined): boolean {
  if (!link || !link.url) return false;
  return link.url.toLowerCase().includes('igod');
}

/**
 * Filter and sort government links according to current filter options
 */
export function searchLinks(links: GovernmentLink[], options: FilterOptions): GovernmentLink[] {
  const q = normalizeQuery(options.query);

  let filtered = links.filter((link) => {
    // 0. Exclude any link whose official link contains "igod"
    if (isIgodLink(link)) {
      return false;
    }

    // 1. Text Search matching across all relevant fields
    if (q.length > 0) {
      const matchName = link.name.toLowerCase().includes(q);
      const matchDesc = link.description.toLowerCase().includes(q);
      const matchDept = link.department ? link.department.toLowerCase().includes(q) : false;
      const matchCat = link.category.toLowerCase().includes(q);
      const matchState = link.stateOrUT ? link.stateOrUT.toLowerCase().includes(q) : false;
      const matchUses = link.uses ? link.uses.some((use) => use.toLowerCase().includes(q)) : false;
      const matchKeywords = link.keywords
        ? link.keywords.some((kw) => kw.toLowerCase().includes(q))
        : false;
      const matchUrl = link.url.toLowerCase().includes(q);

      const matchesQuery =
        matchName ||
        matchDesc ||
        matchDept ||
        matchCat ||
        matchState ||
        matchUses ||
        matchKeywords ||
        matchUrl;

      if (!matchesQuery) return false;
    }

    // 2. Level Filter
    if (options.level !== 'all') {
      const linkLvl = (link.governmentLevel || link.government_level || '').toLowerCase();
      const normLinkLvl = linkLvl === 'union_territory' ? 'ut' : linkLvl;
      const optLvl = (options.level || '').toLowerCase();
      const normOptLvl = optLvl === 'union_territory' ? 'ut' : optLvl;

      if (normOptLvl === 'state') {
        if (normLinkLvl !== 'state') return false;
      } else if (normOptLvl === 'ut') {
        if (normLinkLvl !== 'ut') return false;
      } else if (normOptLvl === 'not_under_government') {
        if (normLinkLvl !== 'not_under_government' && link.organization_type !== 'Non-Government') return false;
      } else if (normLinkLvl !== normOptLvl) {
        return false;
      }
    }

    // 3. State / UT Filter
    if (options.stateOrUT && options.stateOrUT !== 'all') {
      const opt = options.stateOrUT.toLowerCase();
      const linkSt = (link.stateOrUT || '').toLowerCase();
      const isDelhi = opt.includes('delhi') && linkSt.includes('delhi');
      const isDaman = opt.includes('daman') && linkSt.includes('daman');
      const isAndaman = opt.includes('andaman') && linkSt.includes('andaman');
      if (!isDelhi && !isDaman && !isAndaman && linkSt !== opt) {
        return false;
      }
    }

    // 4. Category Filter
    if (options.category && options.category !== 'all') {
      if (link.category.toLowerCase() !== options.category.toLowerCase()) return false;
    }

    // 5. Department Filter
    if (options.department && options.department !== 'all') {
      if (!link.department || link.department.toLowerCase() !== options.department.toLowerCase()) {
        return false;
      }
    }

    // 6. Verification Status Filter
    if (options.verificationStatus && options.verificationStatus !== 'all') {
      if (link.verificationStatus !== options.verificationStatus) return false;
    }

    return true;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (options.sortBy === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    if (options.sortBy === 'popular') {
      const aClicks = a.clickCount || 0;
      const bClicks = b.clickCount || 0;
      if (bClicks !== aClicks) return bClicks - aClicks;
      return a.name.localeCompare(b.name);
    }
    if (options.sortBy === 'recently_verified') {
      const dateA = a.lastVerified || '';
      const dateB = b.lastVerified || '';
      return dateB.localeCompare(dateA);
    }
    // 'relevance' (featured first, then exact matches in name, then alphabetical)
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    if (q.length > 0) {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
    }

    return a.name.localeCompare(b.name);
  });

  return filtered;
}

/**
 * Returns instant search suggestions for the dropdown
 */
export function getSearchSuggestions(
  links: GovernmentLink[],
  query: string,
  limit: number = 6
): {
  id: string;
  title: string;
  subtitle: string;
  type: 'link' | 'category' | 'state';
  link?: GovernmentLink;
}[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const results: {
    id: string;
    title: string;
    subtitle: string;
    type: 'link' | 'category' | 'state';
    link?: GovernmentLink;
  }[] = [];

  for (const link of links) {
    if (results.length >= limit) break;
    if (isIgodLink(link)) continue;

    const matchName = link.name.toLowerCase().includes(q);
    const matchKeywords = link.keywords && link.keywords.some((kw) => kw.toLowerCase().includes(q));

    if (matchName || matchKeywords) {
      results.push({
        id: link.id,
        title: link.name,
        subtitle: link.department || link.category,
        type: 'link',
        link,
      });
    }
  }

  return results;
}

/**
 * Validate a government link object
 */
export function validateGovernmentLink(link: Partial<GovernmentLink>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!link.name || link.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (link.name.length > 200) {
    errors.push('Name exceeds 200 characters');
  }

  if (!link.url || link.url.trim().length === 0) {
    errors.push('URL is required');
  } else {
    try {
      const parsed = new URL(link.url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.push('URL must use http or https protocol');
      }
      if (parsed.href.toLowerCase().includes('igod')) {
        errors.push('Links containing "igod" are not permitted');
      }
    } catch {
      errors.push('Invalid URL format');
    }
  }

  if (!link.governmentLevel || !['central', 'state', 'ut'].includes(link.governmentLevel)) {
    errors.push('Government level must be central, state, or ut');
  }

  if (!link.category || link.category.trim().length === 0) {
    errors.push('Category is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Detect duplicates between incoming dataset and existing records
 */
export function detectDuplicates(
  incoming: Partial<GovernmentLink>[],
  existing: GovernmentLink[]
): {
  duplicates: Partial<GovernmentLink>[];
  unique: Partial<GovernmentLink>[];
} {
  const getCanonicalUrl = (rawUrl?: string) => {
    if (!rawUrl) return '';
    return rawUrl
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/+$/, '');
  };

  const existingUrls = new Set(existing.map((item) => getCanonicalUrl(item.url)));
  const existingNames = new Set(existing.map((item) => item.name.toLowerCase().trim()));
  const seenInBatch = new Set<string>();

  const duplicates: Partial<GovernmentLink>[] = [];
  const unique: Partial<GovernmentLink>[] = [];

  for (const item of incoming) {
    if (!item) continue;
    const itemUrl = getCanonicalUrl(item.url);
    const itemName = item.name ? item.name.toLowerCase().trim() : '';

    if (!itemUrl && !itemName) {
      continue;
    }

    const batchKey = `${itemUrl}:::${itemName}`;
    if (existingUrls.has(itemUrl) || existingNames.has(itemName) || seenInBatch.has(batchKey)) {
      duplicates.push(item);
    } else {
      seenInBatch.add(batchKey);
      if (itemUrl) existingUrls.add(itemUrl);
      if (itemName) existingNames.add(itemName);
      unique.push(item);
    }
  }

  return { duplicates, unique };
}

/**
 * Exports link array to clean CSV format
 */
export function exportLinksToCSV(links: GovernmentLink[]): string {
  const headers = [
    'name',
    'url',
    'governmentLevel',
    'stateOrUT',
    'department',
    'category',
    'description',
    'uses',
    'clicks',
  ];

  const rows = links.map((link) => {
    return [
      `"${(link.name || '').replace(/"/g, '""')}"`,
      `"${(link.url || '').replace(/"/g, '""')}"`,
      link.governmentLevel,
      `"${(link.stateOrUT || '').replace(/"/g, '""')}"`,
      `"${(link.department || '').replace(/"/g, '""')}"`,
      `"${(link.category || '').replace(/"/g, '""')}"`,
      `"${(link.description || '').replace(/"/g, '""')}"`,
      `"${(link.uses || []).join('; ').replace(/"/g, '""')}"`,
      link.clickCount || 0,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Robust CSV parser that handles quotes, escaped quotes, commas, and linebreaks
 */
export function parseCSVToLinks(csvText: string): Partial<GovernmentLink>[] {
  const parseRows = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentCell += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  const rows = parseRows(csvText);
  if (rows.length < 2) return [];

  // Match headers case-insensitively
  const rawHeaders = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const findColIndex = (...candidates: string[]): number => {
    for (const c of candidates) {
      const idx = rawHeaders.findIndex((h) => h === c.toLowerCase().replace(/[^a-z0-9]/g, ''));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const nameIdx = findColIndex('name', 'portalname', 'websitename', 'title', 'organization');
  const urlIdx = findColIndex('url', 'link', 'website', 'address', 'portalurl');
  const levelIdx = findColIndex('governmentlevel', 'level', 'type');
  const stateIdx = findColIndex('stateorut', 'state', 'ut', 'unionterritory', 'region');
  const deptIdx = findColIndex('department', 'ministry', 'authority');
  const catIdx = findColIndex('category', 'servicecategory', 'sector');
  const descIdx = findColIndex('description', 'desc', 'details', 'about');
  const usesIdx = findColIndex('uses', 'services', 'features', 'actions');
  const clicksIdx = findColIndex('clicks', 'clickcount', 'visits', 'popularity', 'views');

  const results: Partial<GovernmentLink>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = nameIdx !== -1 ? row[nameIdx] : row[1] || '';
    const rawUrl = urlIdx !== -1 ? row[urlIdx] : row[2] || '';

    if (!name && !rawUrl) continue;

    let url = rawUrl.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let levelStr = (levelIdx !== -1 ? row[levelIdx] : '').toLowerCase();
    let level: 'central' | 'state' | 'ut' = 'central';
    if (levelStr.includes('ut') || levelStr.includes('union territory')) {
      level = 'ut';
    } else if (levelStr.includes('state')) {
      level = 'state';
    } else if (levelStr.includes('central') || levelStr.includes('national')) {
      level = 'central';
    } else if (stateIdx !== -1 && row[stateIdx]?.trim()) {
      level = 'state';
    }

    const stateOrUT = stateIdx !== -1 && row[stateIdx] ? row[stateIdx].trim() : undefined;
    const department = deptIdx !== -1 && row[deptIdx] ? row[deptIdx].trim() : undefined;
    const category = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : 'Citizen Services';
    const description = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : '';
    const rawUses = usesIdx !== -1 && row[usesIdx] ? row[usesIdx] : '';
    const uses = rawUses
      ? rawUses
          .split(/;|\n|\|/)
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    const clickCount =
      clicksIdx !== -1 && !isNaN(Number(row[clicksIdx])) ? Math.max(0, parseInt(row[clicksIdx], 10)) : 0;

    results.push({
      name: name.trim(),
      url,
      governmentLevel: level,
      stateOrUT,
      department,
      category,
      description,
      uses,
      clickCount,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Normalizes an array of incoming JSON objects or CSV objects into GovernmentLink records
 */
export function normalizeIncomingDataset(data: any): Partial<GovernmentLink>[] {
  let list: any[] = [];
  if (Array.isArray(data)) {
    list = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.links)) {
      list = data.links;
    } else if (Array.isArray(data.data)) {
      list = data.data;
    } else {
      list = [data];
    }
  }

  return list.map((item) => {
    let url = (item.url || item.link || item.website || '').trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let levelStr = (item.governmentLevel || item.level || '').toLowerCase();
    let level: 'central' | 'state' | 'ut' = 'central';
    if (levelStr === 'ut' || levelStr.includes('territory')) {
      level = 'ut';
    } else if (levelStr === 'state') {
      level = 'state';
    } else if (item.stateOrUT) {
      level = 'state';
    }

    let uses: string[] = [];
    if (Array.isArray(item.uses)) {
      uses = item.uses.map(String);
    } else if (typeof item.uses === 'string') {
      uses = item.uses.split(/;|\n|\|/).map((u: string) => u.trim()).filter(Boolean);
    }

    const clickCount =
      typeof item.clickCount === 'number' && !isNaN(item.clickCount)
        ? Math.max(0, item.clickCount)
        : typeof item.clicks === 'number' && !isNaN(item.clicks)
        ? Math.max(0, item.clicks)
        : 0;

    return {
      id: item.id || `gov-import-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: (item.name || item.title || item.portalName || '').trim(),
      url,
      governmentLevel: level,
      stateOrUT: item.stateOrUT || item.state || undefined,
      department: item.department || item.ministry || undefined,
      category: item.category || 'Citizen Services',
      description: item.description || item.desc || '',
      uses,
      keywords: Array.isArray(item.keywords) ? item.keywords : [],
      clickCount,
      verificationStatus: item.verificationStatus || 'verified',
      lastVerified: item.lastVerified || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
  });
}
