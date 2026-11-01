import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchLinks,
  highlightMatch,
  validateGovernmentLink,
  detectDuplicates,
  getSearchSuggestions,
} from './directory.ts';
import type { GovernmentLink } from '../types/index.ts';

const SAMPLE_LINKS: GovernmentLink[] = [
  {
    id: 'uidai',
    name: 'UIDAI - Aadhaar Portal',
    url: 'https://myaadhaar.uidai.gov.in',
    governmentLevel: 'central',
    department: 'UIDAI',
    category: 'Identity and Documentation',
    description: 'Official self-service portal for Aadhaar download and address update',
    uses: ['Download e-Aadhaar', 'Update address'],
    keywords: ['aadhaar', 'uidai', 'identity'],
    verificationStatus: 'verified',
    featured: true,
  },
  {
    id: 'passport',
    name: 'Passport Seva Portal',
    url: 'https://www.passportindia.gov.in',
    governmentLevel: 'central',
    department: 'MEA',
    category: 'Citizen Services',
    description: 'Official platform to apply for fresh passport and renewals',
    uses: ['Apply for passport', 'Schedule appointment'],
    keywords: ['passport', 'travel'],
    verificationStatus: 'verified',
  },
  {
    id: 'tn-esevai',
    name: 'Tamil Nadu e-Sevai',
    url: 'https://www.tnesevai.tn.gov.in',
    governmentLevel: 'state',
    stateOrUT: 'Tamil Nadu',
    department: 'TNeGA',
    category: 'Citizen Services',
    description: 'Integrated citizen service portal for Community, Nativity, and Patta certificates',
    uses: ['Apply for Community certificate', 'Download Patta/Chitta'],
    keywords: ['tamil nadu', 'esevai', 'patta'],
    verificationStatus: 'verified',
  },
];

test('searchLinks filters by keyword correctly', () => {
  const results = searchLinks(SAMPLE_LINKS, {
    query: 'passport',
    level: 'all',
    stateOrUT: 'all',
    category: 'all',
    department: 'all',
    verificationStatus: 'all',
    sortBy: 'relevance',
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'passport');
});

test('searchLinks filters by state correctly', () => {
  const results = searchLinks(SAMPLE_LINKS, {
    query: '',
    level: 'all',
    stateOrUT: 'Tamil Nadu',
    category: 'all',
    department: 'all',
    verificationStatus: 'all',
    sortBy: 'relevance',
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'tn-esevai');
});

test('highlightMatch correctly marks matching substrings', () => {
  const chunks = highlightMatch('UIDAI - Aadhaar Portal', 'aadhaar');
  const matchedChunk = chunks.find((c) => c.match);
  assert.ok(matchedChunk);
  assert.equal(matchedChunk?.text.toLowerCase(), 'aadhaar');
});

test('validateGovernmentLink catches missing fields and invalid URLs', () => {
  const invalid = validateGovernmentLink({
    name: '',
    url: 'not-a-url',
    governmentLevel: 'central',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = validateGovernmentLink({
    name: 'Official Portal',
    url: 'https://example.gov.in',
    governmentLevel: 'central',
    category: 'Citizen Services',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

test('detectDuplicates identifies matching URLs and names', () => {
  const incoming = [
    { name: 'Duplicate UIDAI', url: 'https://myaadhaar.uidai.gov.in' },
    { name: 'Brand New Portal', url: 'https://brandnew.gov.in' },
  ];
  const { duplicates, unique } = detectDuplicates(incoming, SAMPLE_LINKS);
  assert.equal(duplicates.length, 1);
  assert.equal(unique.length, 1);
  assert.equal(unique[0].name, 'Brand New Portal');
});

test('getSearchSuggestions returns matching suggestion items', () => {
  const suggestions = getSearchSuggestions(SAMPLE_LINKS, 'aadhaar');
  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0].title, 'UIDAI - Aadhaar Portal');
});
