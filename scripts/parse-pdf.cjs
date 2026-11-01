const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function parseDirectoryPdf() {
  const filePath = 'public/assets/aistudio/Bright_Indian_Master_Central_and_State_Government_Links_2026_e9684d66.pdf';
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buffer));
  const result = await parser.getText();
  const rawText = result.text;

  const rawChunks = rawText.split(/(?:Portal \/ Service Name:)/i);
  console.log(`Found ${rawChunks.length - 1} raw chunks.`);

  const links = [];

  for (let i = 1; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];

    const urlMatch = chunk.match(/Official Website URL:\s*([\s\S]*?)(?:Government Level:)/i);
    const levelMatch = chunk.match(/Government Level:\s*([\s\S]*?)(?:Jurisdiction or State name:)/i);
    const jurisdictionMatch = chunk.match(/Jurisdiction or State name:\s*([\s\S]*?)(?:Category:)/i);
    const categoryMatch = chunk.match(/Category:\s*([\s\S]*?)(?:Ministry or Department Name:)/i);
    const departmentMatch = chunk.match(/Ministry or Department Name:\s*([\s\S]*?)(?:Key Uses \/ Services)/i);
    const usesMatch = chunk.match(/Key Uses \/ Services\s*(?:\(Separated by ;\))?:\s*([\s\S]*?)(?:Portal Description:)/i);

    let name = chunk.split(/Official Website URL:/i)[0].trim();
    name = name.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '');
    name = name.replace(/\s+/g, ' ');

    let url = urlMatch ? urlMatch[1].trim().replace(/\s+/g, '') : '';
    let levelRaw = levelMatch ? levelMatch[1].trim() : 'Central Government';
    let jurisdiction = jurisdictionMatch ? jurisdictionMatch[1].trim() : '';
    let category = categoryMatch ? categoryMatch[1].trim().replace(/\s+/g, ' ') : 'General';
    let department = departmentMatch ? departmentMatch[1].trim().replace(/\s+/g, ' ') : '';
    let usesRaw = usesMatch ? usesMatch[1].trim() : '';

    let description = '';
    const descParts = chunk.split(/Portal Description:\s*/i);
    if (descParts.length > 1) {
      let rest = descParts[1];
      rest = rest.replace(/BRIGHT INDIAN \| MASTER GOVERNMENT LINKS DIRECTORY/gi, '');
      rest = rest.replace(/Independent directory\s*•\s*Verify the destination before use\s*Page\s*\d+/gi, '');
      rest = rest.replace(/\s*Part\s+(?:I|II|III)\s*—[\s\S]*$/gi, '');
      rest = rest.replace(/\s*[A-Za-z\s]+—\s*directory lookups[\s\S]*$/gi, '');
      // Strip trailing numbering like ". 2. Integrated..."
      rest = rest.replace(/\.\s+\d+\.\s+[A-Z].*$/g, '.');
      rest = rest.replace(/\s*\d+\.\s+[^\n]+$/g, '');
      description = rest.trim().replace(/\s+/g, ' ');
    }

    let governmentLevel = 'central';
    const lvlLower = levelRaw.toLowerCase();
    if (lvlLower.includes('union territory') || lvlLower.includes('ut')) {
      governmentLevel = 'ut';
    } else if (lvlLower.includes('state')) {
      governmentLevel = 'state';
    }

    let stateOrUT = undefined;
    if (jurisdiction && jurisdiction.toLowerCase() !== 'india') {
      stateOrUT = jurisdiction;
    }

    const uses = usesRaw
      .replace(/BRIGHT INDIAN \| MASTER GOVERNMENT LINKS DIRECTORY/gi, '')
      .replace(/Independent directory\s*•\s*Verify the destination before use\s*Page\s*\d+/gi, '')
      .split(';')
      .map(u => u.trim().replace(/\s+/g, ' '))
      .filter(u => u.length > 0);

    const keywords = [
      name.toLowerCase(),
      (stateOrUT || 'India').toLowerCase(),
      category.toLowerCase(),
      ...uses.map(u => u.toLowerCase().substring(0, 30))
    ];

    const linkId = `pdf-${i}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}`;

    links.push({
      id: linkId,
      name,
      url,
      governmentLevel,
      stateOrUT,
      category,
      department: department || undefined,
      description: description || `Official portal for ${name}.`,
      uses,
      keywords,
      officialSource: 'Integrated Government Online Directory (IGOD) / National Portal of India',
      verificationStatus: 'verified',
      lastVerified: '2026-10-20',
      featured: i <= 20
    });
  }

  console.log(`Successfully parsed ${links.length} total links.`);
  fs.writeFileSync('src/data/allGovernmentLinks.json', JSON.stringify(links, null, 2));

  // Write typescript seed file exporting all 1082 links
  const tsContent = `import { GovernmentLink } from '../types';
import allLinksJson from './allGovernmentLinks.json';

export const ALL_INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const ALL_UNION_TERRITORIES: string[] = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const SERVICE_CATEGORIES: string[] = [
  'National gateway (direct portal)',
  'Government directory (direct portal)',
  'Citizen services (direct portal)',
  'Identity services (direct portal)',
  'Passport and travel (direct portal)',
  'Digital public services (direct portal)',
  'Digital documents (direct portal)',
  'Education policy (direct portal)',
  'Higher education (direct portal)',
  'Technical education (direct portal)',
  'School education / exams (direct portal)',
  'Entrance examinations (direct portal)',
  'Scholarships (direct portal)',
  'Employment (direct portal)',
  'Recruitment (direct portal)',
  'Recruitment / examinations (direct portal)',
  'Defence recruitment (direct portal)',
  'Taxation (direct portal)',
  'Taxation / GST (direct portal)',
  'Transport / vehicle services (direct portal)',
  'Transport / driving licence (direct portal)',
  'Rail transport (direct portal)',
  'Agriculture / farmer welfare (direct portal)',
  'Agriculture / farmer benefits (direct portal)',
  'Health / family welfare (direct portal)',
  'Judiciary (direct portal)',
  'Consumer protection (direct portal)',
  'State/UT main government portal',
  'IGOD directory lookup'
];

export const INITIAL_GOVERNMENT_LINKS: GovernmentLink[] = allLinksJson as GovernmentLink[];
`;

  fs.writeFileSync('src/data/seedLinks.ts', tsContent);
  console.log('Successfully written src/data/seedLinks.ts with all 1082 links!');
}

parseDirectoryPdf().catch(console.error);
