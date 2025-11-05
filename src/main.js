// Enhanced Interactive US Map Script
const tooltip = document.getElementById('tooltip');
const stateInfoPanel = document.getElementById('state-info');

// Store county election data
let countyElectionData = {};
let isDataLoaded = false;

// District map state management
const districtMapState = {
  isLoaded: false,
  svgDocs: {}, // Store loaded state SVGs
  currentState: null,
  originalMapContainer: null
};

// Load election data from JSON
async function loadElectionData() {
  if (isDataLoaded) return;
  
  try {
    const response = await fetch('data/us-county-numbers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Transform array into lookup object grouped by county
    rawData.forEach(record => {
      const key = `${record.state}_${record.county.replace(/\s+/g, '_')}`;
      
      if (!countyElectionData[key]) {
        countyElectionData[key] = {
          state: record.state,
          county: record.county,
          totalVotes: record.totalvotes,
          candidates: []
        };
      }
      
      countyElectionData[key].candidates.push({
        name: record.candidate,
        party: record.party === 'democratic' ? 'Democrat' : 
               record.party === 'republican' ? 'Republican' : 
               record.party.charAt(0).toUpperCase() + record.party.slice(1),
        votes: record.candidatevotes
      });
    });
    
    isDataLoaded = true;
    console.log(`Loaded election data for ${Object.keys(countyElectionData).length} counties`);
  } catch (error) {
    console.error('Failed to load election data:', error);
    alert('Election data file not found. Please ensure us-county-numbers.json exists in data/ folder.');
  }
}

// Call this on page load
loadElectionData();

// Calculate election results for a county
function calculateCountyResults(countyData) {
  if (!countyData || countyData.candidates.length < 2) return null;
  
  const dem = countyData.candidates.find(c => c.party === 'Democrat');
  const gop = countyData.candidates.find(c => c.party === 'Republican');
  
  if (!dem || !gop) return null;
  
  const demPercent = ((dem.votes / countyData.totalVotes) * 100).toFixed(1);
  const gopPercent = ((gop.votes / countyData.totalVotes) * 100).toFixed(1);
  
  const winner = dem.votes > gop.votes ? dem : gop;
  const margin = Math.abs(dem.votes - gop.votes);
  const marginPercent = ((margin / countyData.totalVotes) * 100).toFixed(1);
  
  return {
    dem: { ...dem, percent: demPercent },
    gop: { ...gop, percent: gopPercent },
    winner: winner.party,
    margin: marginPercent,
    totalVotes: countyData.totalVotes
  };
}

// Get county election data by state code and county name
// REPLACE THIS FUNCTION
function getCountyElectionData(stateAbbr, countyName) {
  if (!countyElectionData) return null;

  const normalizedCountyName = countyName
    .replace(/\s+/g, '_')
    .replace(/\./g, '')
    .replace(/County|Parish|City|Borough|Census_Area|Municipality|District/gi, '')
    .trim();

  // Build correct key using state abbreviation
  const key = `${stateAbbr}_${normalizedCountyName}`;
  const data = countyElectionData[key];

  return data || null;
}


// State-specific stroke widths
const STATE_STROKE_WIDTHS = {
  // Small states that need thinner strokes when zoomed
  
  'DEFAULT': 2
};

const stateNames = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia'
};

// Normalize county names for consistent matching
function normalizeCountyName(name) {
  return name.replace(/\s+/g, '_'); // convert spaces to underscores
}

const stateData = {
  AL: {
    name: 'Alabama',
    governor: 'Kay Ivey (R)',
    senators: ['Tommy Tuberville (R)', 'Katie Britt (R)'],
    electoralVotes: 9,
    lastElection: { winner: 'Trump (R)', margin: '+30.5%', turnout: '63.2%' },
    campaignFinance: { total: '$125M', topDonor: 'Energy Industry', pacSpending: '$45M' }
  },
  AK: {
    name: 'Alaska',
    governor: 'Mike Dunleavy (R)',
    senators: ['Lisa Murkowski (R)', 'Dan Sullivan (R)'],
    electoralVotes: 3,
    lastElection: { winner: 'Trump (R)', margin: '+13.1%', turnout: '58.9%' },
    campaignFinance: { total: '$35M', topDonor: 'Oil & Gas', pacSpending: '$12M' }
  },
  AZ: {
    name: 'Arizona',
    governor: 'Katie Hobbs (D)',
    senators: ['Mark Kelly (D)', 'Kyrsten Sinema (I)'],
    electoralVotes: 11,
    lastElection: { winner: 'Trump (R)', margin: '+5.5%', turnout: '72.6%' },
    campaignFinance: { total: '$485M', topDonor: 'Tech Industry', pacSpending: '$165M' }
  },
  AR: {
    name: 'Arkansas',
    governor: 'Sarah Huckabee Sanders (R)',
    senators: ['John Boozman (R)', 'Tom Cotton (R)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+30.6%', turnout: '56.8%' },
    campaignFinance: { total: '$75M', topDonor: 'Agriculture', pacSpending: '$25M' }
  },
  CA: {
    name: 'California',
    governor: 'Gavin Newsom (D)',
    senators: ['Alex Padilla (D)', 'Laphonza Butler (D)'],
    electoralVotes: 54,
    lastElection: { winner: 'Harris (D)', margin: '+20.1%', turnout: '71.4%' },
    campaignFinance: { total: '$1.2B', topDonor: 'Tech Industry', pacSpending: '$450M' }
  },
  CO: {
    name: 'Colorado',
    governor: 'Jared Polis (D)',
    senators: ['Michael Bennet (D)', 'John Hickenlooper (D)'],
    electoralVotes: 10,
    lastElection: { winner: 'Harris (D)', margin: '+11.0%', turnout: '73.1%' },
    campaignFinance: { total: '$285M', topDonor: 'Tech Industry', pacSpending: '$95M' }
  },
  CT: {
    name: 'Connecticut',
    governor: 'Ned Lamont (D)',
    senators: ['Richard Blumenthal (D)', 'Chris Murphy (D)'],
    electoralVotes: 7,
    lastElection: { winner: 'Harris (D)', margin: '+14.5%', turnout: '65.4%' },
    campaignFinance: { total: '$145M', topDonor: 'Financial Services', pacSpending: '$55M' }
  },
  DE: {
    name: 'Delaware',
    governor: 'John Carney (D)',
    senators: ['Tom Carper (D)', 'Chris Coons (D)'],
    electoralVotes: 3,
    lastElection: { winner: 'Harris (D)', margin: '+14.7%', turnout: '66.8%' },
    campaignFinance: { total: '$45M', topDonor: 'Financial Services', pacSpending: '$18M' }
  },
  FL: {
    name: 'Florida',
    governor: 'Ron DeSantis (R)',
    senators: ['Marco Rubio (R)', 'Rick Scott (R)'],
    electoralVotes: 30,
    lastElection: { winner: 'Trump (R)', margin: '+13.1%', turnout: '77.3%' },
    campaignFinance: { total: '$675M', topDonor: 'Tourism Industry', pacSpending: '$280M' }
  },
  GA: {
    name: 'Georgia',
    governor: 'Brian Kemp (R)',
    senators: ['Jon Ossoff (D)', 'Raphael Warnock (D)'],
    electoralVotes: 16,
    lastElection: { winner: 'Trump (R)', margin: '+2.2%', turnout: '70.9%' },
    campaignFinance: { total: '$545M', topDonor: 'Real Estate', pacSpending: '$195M' }
  },
  HI: {
    name: 'Hawaii',
    governor: 'Josh Green (D)',
    senators: ['Brian Schatz (D)', 'Mazie Hirono (D)'],
    electoralVotes: 4,
    lastElection: { winner: 'Harris (D)', margin: '+23.1%', turnout: '54.6%' },
    campaignFinance: { total: '$55M', topDonor: 'Tourism Industry', pacSpending: '$20M' }
  },
  ID: {
    name: 'Idaho',
    governor: 'Brad Little (R)',
    senators: ['Mike Crapo (R)', 'James Risch (R)'],
    electoralVotes: 4,
    lastElection: { winner: 'Trump (R)', margin: '+36.5%', turnout: '59.8%' },
    campaignFinance: { total: '$65M', topDonor: 'Agriculture', pacSpending: '$22M' }
  },
  IL: {
    name: 'Illinois',
    governor: 'J.B. Pritzker (D)',
    senators: ['Dick Durbin (D)', 'Tammy Duckworth (D)'],
    electoralVotes: 19,
    lastElection: { winner: 'Harris (D)', margin: '+10.9%', turnout: '67.2%' },
    campaignFinance: { total: '$425M', topDonor: 'Financial Services', pacSpending: '$155M' }
  },
  IN: {
    name: 'Indiana',
    governor: 'Eric Holcomb (R)',
    senators: ['Todd Young (R)', 'Mike Braun (R)'],
    electoralVotes: 11,
    lastElection: { winner: 'Trump (R)', margin: '+19.0%', turnout: '61.5%' },
    campaignFinance: { total: '$185M', topDonor: 'Manufacturing', pacSpending: '$65M' }
  },
  IA: {
    name: 'Iowa',
    governor: 'Kim Reynolds (R)',
    senators: ['Chuck Grassley (R)', 'Joni Ernst (R)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+13.2%', turnout: '71.8%' },
    campaignFinance: { total: '$175M', topDonor: 'Agriculture', pacSpending: '$62M' }
  },
  KS: {
    name: 'Kansas',
    governor: 'Laura Kelly (D)',
    senators: ['Jerry Moran (R)', 'Roger Marshall (R)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+16.1%', turnout: '64.2%' },
    campaignFinance: { total: '$125M', topDonor: 'Agriculture', pacSpending: '$45M' }
  },
  KY: {
    name: 'Kentucky',
    governor: 'Andy Beshear (D)',
    senators: ['Mitch McConnell (R)', 'Rand Paul (R)'],
    electoralVotes: 8,
    lastElection: { winner: 'Trump (R)', margin: '+30.5%', turnout: '59.4%' },
    campaignFinance: { total: '$165M', topDonor: 'Coal Industry', pacSpending: '$58M' }
  },
  LA: {
    name: 'Louisiana',
    governor: 'Jeff Landry (R)',
    senators: ['Bill Cassidy (R)', 'John Kennedy (R)'],
    electoralVotes: 8,
    lastElection: { winner: 'Trump (R)', margin: '+22.0%', turnout: '67.9%' },
    campaignFinance: { total: '$145M', topDonor: 'Oil & Gas', pacSpending: '$52M' }
  },
  ME: {
    name: 'Maine',
    governor: 'Janet Mills (D)',
    senators: ['Susan Collins (R)', 'Angus King (I)'],
    electoralVotes: 4,
    lastElection: { winner: 'Harris (D)', margin: '+6.9%', turnout: '72.8%' },
    campaignFinance: { total: '$85M', topDonor: 'Healthcare', pacSpending: '$32M' }
  },
  MD: {
    name: 'Maryland',
    governor: 'Wes Moore (D)',
    senators: ['Ben Cardin (D)', 'Chris Van Hollen (D)'],
    electoralVotes: 10,
    lastElection: { winner: 'Harris (D)', margin: '+28.5%', turnout: '69.3%' },
    campaignFinance: { total: '$225M', topDonor: 'Federal Contractors', pacSpending: '$85M' }
  },
  MA: {
    name: 'Massachusetts',
    governor: 'Maura Healey (D)',
    senators: ['Elizabeth Warren (D)', 'Ed Markey (D)'],
    electoralVotes: 11,
    lastElection: { winner: 'Harris (D)', margin: '+25.2%', turnout: '69.8%' },
    campaignFinance: { total: '$285M', topDonor: 'Tech Industry', pacSpending: '$105M' }
  },
  MI: {
    name: 'Michigan',
    governor: 'Gretchen Whitmer (D)',
    senators: ['Gary Peters (D)', 'Debbie Stabenow (D)'],
    electoralVotes: 15,
    lastElection: { winner: 'Trump (R)', margin: '+1.4%', turnout: '74.7%' },
    campaignFinance: { total: '$485M', topDonor: 'Auto Industry', pacSpending: '$175M' }
  },
  MN: {
    name: 'Minnesota',
    governor: 'Tim Walz (D)',
    senators: ['Amy Klobuchar (D)', 'Tina Smith (D)'],
    electoralVotes: 10,
    lastElection: { winner: 'Harris (D)', margin: '+4.2%', turnout: '76.4%' },
    campaignFinance: { total: '$325M', topDonor: 'Healthcare', pacSpending: '$115M' }
  },
  MS: {
    name: 'Mississippi',
    governor: 'Tate Reeves (R)',
    senators: ['Roger Wicker (R)', 'Cindy Hyde-Smith (R)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+22.9%', turnout: '59.7%' },
    campaignFinance: { total: '$95M', topDonor: 'Agriculture', pacSpending: '$35M' }
  },
  MO: {
    name: 'Missouri',
    governor: 'Mike Kehoe (R)',
    senators: ['Josh Hawley (R)', 'Eric Schmitt (R)'],
    electoralVotes: 10,
    lastElection: { winner: 'Trump (R)', margin: '+18.4%', turnout: '67.1%' },
    campaignFinance: { total: '$245M', topDonor: 'Agriculture', pacSpending: '$88M' }
  },
  MT: {
    name: 'Montana',
    governor: 'Greg Gianforte (R)',
    senators: ['Steve Daines (R)', 'Tim Sheehy (R)'],
    electoralVotes: 4,
    lastElection: { winner: 'Trump (R)', margin: '+19.9%', turnout: '71.2%' },
    campaignFinance: { total: '$125M', topDonor: 'Energy Industry', pacSpending: '$45M' }
  },
  NE: {
    name: 'Nebraska',
    governor: 'Pete Ricketts (R)',
    senators: ['Deb Fischer (R)', 'Pete Ricketts (R)'],
    electoralVotes: 5,
    lastElection: { winner: 'Trump (R)', margin: '+20.5%', turnout: '68.4%' },
    campaignFinance: { total: '$95M', topDonor: 'Agriculture', pacSpending: '$35M' }
  },
  NV: {
    name: 'Nevada',
    governor: 'Joe Lombardo (R)',
    senators: ['Catherine Cortez Masto (D)', 'Jacky Rosen (D)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+3.1%', turnout: '73.2%' },
    campaignFinance: { total: '$285M', topDonor: 'Gaming Industry', pacSpending: '$105M' }
  },
  NH: {
    name: 'New Hampshire',
    governor: 'Chris Sununu (R)',
    senators: ['Jeanne Shaheen (D)', 'Maggie Hassan (D)'],
    electoralVotes: 4,
    lastElection: { winner: 'Harris (D)', margin: '+2.8%', turnout: '74.4%' },
    campaignFinance: { total: '$125M', topDonor: 'Manufacturing', pacSpending: '$45M' }
  },
  NJ: {
    name: 'New Jersey',
    governor: 'Phil Murphy (D)',
    senators: ['Cory Booker (D)', 'Andy Kim (D)'],
    electoralVotes: 14,
    lastElection: { winner: 'Harris (D)', margin: '+5.9%', turnout: '65.8%' },
    campaignFinance: { total: '$385M', topDonor: 'Financial Services', pacSpending: '$145M' }
  },
  NM: {
    name: 'New Mexico',
    governor: 'Michelle Lujan Grisham (D)',
    senators: ['Martin Heinrich (D)', 'Ben Ray Luján (D)'],
    electoralVotes: 5,
    lastElection: { winner: 'Harris (D)', margin: '+6.0%', turnout: '62.5%' },
    campaignFinance: { total: '$125M', topDonor: 'Energy Industry', pacSpending: '$45M' }
  },
  NY: {
    name: 'New York',
    governor: 'Kathy Hochul (D)',
    senators: ['Chuck Schumer (D)', 'Kirsten Gillibrand (D)'],
    electoralVotes: 28,
    lastElection: { winner: 'Harris (D)', margin: '+12.6%', turnout: '58.6%' },
    campaignFinance: { total: '$785M', topDonor: 'Financial Services', pacSpending: '$295M' }
  },
  NC: {
    name: 'North Carolina',
    governor: 'Josh Stein (D)',
    senators: ['Thom Tillis (R)', 'Ted Budd (R)'],
    electoralVotes: 16,
    lastElection: { winner: 'Trump (R)', margin: '+3.2%', turnout: '73.7%' },
    campaignFinance: { total: '$485M', topDonor: 'Banking', pacSpending: '$175M' }
  },
  ND: {
    name: 'North Dakota',
    governor: 'Doug Burgum (R)',
    senators: ['John Hoeven (R)', 'Kevin Cramer (R)'],
    electoralVotes: 3,
    lastElection: { winner: 'Trump (R)', margin: '+36.4%', turnout: '55.4%' },
    campaignFinance: { total: '$45M', topDonor: 'Oil & Gas', pacSpending: '$18M' }
  },
  OH: {
    name: 'Ohio',
    governor: 'Mike DeWine (R)',
    senators: ['Sherrod Brown (D)', 'J.D. Vance (R)'],
    electoralVotes: 17,
    lastElection: { winner: 'Trump (R)', margin: '+11.2%', turnout: '69.8%' },
    campaignFinance: { total: '$485M', topDonor: 'Manufacturing', pacSpending: '$175M' }
  },
  OK: {
    name: 'Oklahoma',
    governor: 'Kevin Stitt (R)',
    senators: ['James Lankford (R)', 'Markwayne Mullin (R)'],
    electoralVotes: 7,
    lastElection: { winner: 'Trump (R)', margin: '+34.3%', turnout: '56.3%' },
    campaignFinance: { total: '$125M', topDonor: 'Oil & Gas', pacSpending: '$45M' }
  },
  OR: {
    name: 'Oregon',
    governor: 'Tina Kotek (D)',
    senators: ['Ron Wyden (D)', 'Jeff Merkley (D)'],
    electoralVotes: 8,
    lastElection: { winner: 'Harris (D)', margin: '+14.3%', turnout: '69.4%' },
    campaignFinance: { total: '$225M', topDonor: 'Tech Industry', pacSpending: '$85M' }
  },
  PA: {
    name: 'Pennsylvania',
    governor: 'Josh Shapiro (D)',
    senators: ['Bob Casey Jr. (D)', 'John Fetterman (D)'],
    electoralVotes: 19,
    lastElection: { winner: 'Trump (R)', margin: '+1.7%', turnout: '70.9%' },
    campaignFinance: { total: '$685M', topDonor: 'Energy Industry', pacSpending: '$245M' }
  },
  RI: {
    name: 'Rhode Island',
    governor: 'Dan McKee (D)',
    senators: ['Jack Reed (D)', 'Sheldon Whitehouse (D)'],
    electoralVotes: 4,
    lastElection: { winner: 'Harris (D)', margin: '+13.8%', turnout: '64.7%' },
    campaignFinance: { total: '$55M', topDonor: 'Healthcare', pacSpending: '$22M' }
  },
  SC: {
    name: 'South Carolina',
    governor: 'Henry McMaster (R)',
    senators: ['Lindsey Graham (R)', 'Tim Scott (R)'],
    electoralVotes: 9,
    lastElection: { winner: 'Trump (R)', margin: '+17.9%', turnout: '68.5%' },
    campaignFinance: { total: '$185M', topDonor: 'Manufacturing', pacSpending: '$68M' }
  },
  SD: {
    name: 'South Dakota',
    governor: 'Kristi Noem (R)',
    senators: ['John Thune (R)', 'Mike Rounds (R)'],
    electoralVotes: 3,
    lastElection: { winner: 'Trump (R)', margin: '+29.2%', turnout: '69.1%' },
    campaignFinance: { total: '$45M', topDonor: 'Agriculture', pacSpending: '$18M' }
  },
  TN: {
    name: 'Tennessee',
    governor: 'Bill Lee (R)',
    senators: ['Marsha Blackburn (R)', 'Bill Hagerty (R)'],
    electoralVotes: 11,
    lastElection: { winner: 'Trump (R)', margin: '+29.7%', turnout: '59.2%' },
    campaignFinance: { total: '$225M', topDonor: 'Healthcare', pacSpending: '$85M' }
  },
  TX: {
    name: 'Texas',
    governor: 'Greg Abbott (R)',
    senators: ['John Cornyn (R)', 'Ted Cruz (R)'],
    electoralVotes: 40,
    lastElection: { winner: 'Trump (R)', margin: '+13.7%', turnout: '66.7%' },
    campaignFinance: { total: '$890M', topDonor: 'Oil & Gas', pacSpending: '$320M' }
  },
  UT: {
    name: 'Utah',
    governor: 'Spencer Cox (R)',
    senators: ['Mike Lee (R)', 'Mitt Romney (R)'],
    electoralVotes: 6,
    lastElection: { winner: 'Trump (R)', margin: '+21.6%', turnout: '62.8%' },
    campaignFinance: { total: '$125M', topDonor: 'Tech Industry', pacSpending: '$45M' }
  },
  VT: {
    name: 'Vermont',
    governor: 'Phil Scott (R)',
    senators: ['Patrick Leahy (D)', 'Bernie Sanders (I)'],
    electoralVotes: 3,
    lastElection: { winner: 'Harris (D)', margin: '+31.5%', turnout: '65.4%' },
    campaignFinance: { total: '$35M', topDonor: 'Tourism Industry', pacSpending: '$15M' }
  },
  VA: {
    name: 'Virginia',
    governor: 'Glenn Youngkin (R)',
    senators: ['Mark Warner (D)', 'Tim Kaine (D)'],
    electoralVotes: 13,
    lastElection: { winner: 'Harris (D)', margin: '+5.8%', turnout: '73.8%' },
    campaignFinance: { total: '$385M', topDonor: 'Federal Contractors', pacSpending: '$145M' }
  },
  WA: {
    name: 'Washington',
    governor: 'Bob Ferguson (D)',
    senators: ['Patty Murray (D)', 'Maria Cantwell (D)'],
    electoralVotes: 12,
    lastElection: { winner: 'Harris (D)', margin: '+18.2%', turnout: '67.9%' },
    campaignFinance: { total: '$285M', topDonor: 'Tech Industry', pacSpending: '$105M' }
  },
  WV: {
    name: 'West Virginia',
    governor: 'Patrick Morrisey (R)',
    senators: ['Joe Manchin (I)', 'Shelley Moore Capito (R)'],
    electoralVotes: 4,
    lastElection: { winner: 'Trump (R)', margin: '+42.9%', turnout: '54.2%' },
    campaignFinance: { total: '$85M', topDonor: 'Coal Industry', pacSpending: '$32M' }
  },
  WI: {
    name: 'Wisconsin',
    governor: 'Tony Evers (D)',
    senators: ['Ron Johnson (R)', 'Tammy Baldwin (D)'],
    electoralVotes: 10,
    lastElection: { winner: 'Trump (R)', margin: '+0.9%', turnout: '76.4%' },
    campaignFinance: { total: '$485M', topDonor: 'Manufacturing', pacSpending: '$175M' }
  },
  WY: {
    name: 'Wyoming',
    governor: 'Mark Gordon (R)',
    senators: ['John Barrasso (R)', 'Cynthia Lummis (R)'],
    electoralVotes: 3,
    lastElection: { winner: 'Trump (R)', margin: '+45.8%', turnout: '57.1%' },
    campaignFinance: { total: '$35M', topDonor: 'Energy Industry', pacSpending: '$15M' }
  }
};

// County/District map state management
const countyMapState = {
  isLoaded: false,
  svgDoc: null,
  currentState: null,
  originalMapContainer: null
};

// State-specific sizing configuration
const STATE_SIZE_CONFIG = {
  'TX': { scale: 1.0, padding: 0.00, rotation: -3, offsetX: -1, offsetY: 0 },
  'CA': { scale: 1.2, padding: 0.05, rotation: -15, offsetX: 0, offsetY: 50 },
  'MT': { scale: 1.5, padding: 0.00, rotation: -8, offsetX: 0, offsetY: 30 },
  'AK': { scale: 1.2, padding: 0.00, rotation: 15, offsetX: 0, offsetY: 20 },
  'NM': { scale: 1.4, padding: 0.05, rotation: -6, offsetX: 0, offsetY: 30 },
  'AZ': { scale: 1.4, padding: 0.05, rotation: -9, offsetX: 0, offsetY: 30 },
  'NV': { scale: 1.1, padding: 0.05, rotation: -12, offsetX: 0, offsetY: 20 },
  'CO': { scale: 1.4, padding: 0.05, rotation: -6, offsetX:0, offsetY: 30 },
  'OR': { scale: 1.3, padding: 0.05, rotation: -15, offsetX: 0, offsetY: 35},
  'WY': { scale: 1.2, padding: 0.05, rotation: -7, offsetX: 0, offsetY: 35 },
  'MI': { scale: 1.3, padding: 0.00, rotation: 5, offsetX: 0, offsetY: 15 },
  'MN': { scale: 1.3, padding: 0.05, rotation: 1, offsetX: 0, offsetY: 20 },
  'UT': { scale: 1.2, padding: 0.05, rotation: -9, offsetX: 0, offsetY: 20 },
  'ID': { scale: 1.1, padding: 0.05, rotation: -11, offsetX: 0, offsetY: 20 },
  'KS': { scale: 1.7, padding: 0.05, rotation: -2, offsetX: 0, offsetY: 25 },
  'NE': { scale: 1.6, padding: 0.05, rotation: -3, offsetX: 0, offsetY: 25 },
  'WA': { scale: 1.5, padding: 0.08, rotation: -14, offsetX: 0, offsetY: 25 },
  'SD': { scale: 1.5, padding: 0.05, rotation: -3, offsetX: 0, offsetY: 15 },
  'ND': { scale: 1.5, padding: 0.05, rotation: -2, offsetX: 0, offsetY: 15 },
  'OK': { scale: 1.6, padding: 0.05, rotation: -2, offsetX: 0, offsetY: 10 },
  'MO': { scale: 1.3, padding: 0.05, rotation: 2, offsetX: 0, offsetY: 10 },
  'FL': { scale: 1.0, padding: 0.05, rotation: 5, offsetX: 0, offsetY: 5 },
  'WI': { scale: 1.3, padding: 0.05, rotation: 3, offsetX: 0, offsetY: 20 },
  'GA': { scale: 1.3, padding: 0.05, rotation: 6, offsetX: 0, offsetY: 20 },
  'IL': { scale: 1.2, padding: 0.05, rotation: 3, offsetX: 0, offsetY: 15 },
  'IA': { scale: 1.5, padding: 0.05, rotation: 1, offsetX: 0, offsetY: 20 },
  'NY': { scale: 1.5, padding: 0.05, rotation: 11, offsetX: 0, offsetY: 25 },
  'NC': { scale: 1.6, padding: 0.00, rotation: 9, offsetX: 0, offsetY: 10 },
  'AR': { scale: 1.3, padding: 0.05, rotation: 2, offsetX: 0, offsetY: 10 },
  'AL': { scale: 1.0, padding: 0.05, rotation: 5 },
  'LA': { scale: 1.2, padding: 0.05, rotation: 1, offsetX: 0, offsetY: 7 },
  'MS': { scale: 1.0, padding: 0.05, rotation: 3 },
  'PA': { scale: 1.4, padding: 0.05, rotation: 11, offsetX: 0, offsetY: 15 },
  'OH': { scale: 1.2, padding: 0.05, rotation: 8, offsetX: 0, offsetY: 8 },
  'VA': { scale: 1.4, padding: 0.08, rotation: 10, offsetX: 0, offsetY: 15 },
  'TN': { scale: 2.0, padding: 0.00, rotation: 5, offsetX: 10, offsetY: 15 },
  'KY': { scale: 1.5, padding: 0.08, rotation: 8, offsetX: 0, offsetY: 10 },
  'IN': { scale: 1.2, padding: 0.05, rotation: 6, offsetX: 0, offsetY: 15 },
  'ME': { scale: 1.1, padding: 0.05, rotation: 14 },
  'SC': { scale: 1.3, padding: 0.08, rotation: 0 },
  'WV': { scale: 1.2, padding: 0.05, rotation: 5, offsetX: 0, offsetY: 10 },
  'MD': { scale: 1.7, padding: 0.08, rotation: 11, offsetX: 0, offsetY: 10 },
  'HI': { scale: 1.5, padding: 0.08, rotation: 0, offsetX: 0, offsetY: 20 },
  'VT': { scale: 1.1, padding: 0.12, rotation: 11, offsetX: 0, offsetY: 10 },
  'NH': { scale: 1.1, padding: 0.12, rotation: 12, offsetX: 0, offsetY: 10 },
  'MA': { scale: 1.5, padding: 0.08, rotation: 13, offsetX: 0, offsetY: 15 },
  'NJ': { scale: 1.0, padding: 0.08, rotation: 10, offsetX: -0.5, offsetY: 0 },
  'CT': { scale: 1.4, padding: 0.05, rotation: 12.5, offsetX: 0, offsetY: 10 },
  'DE': { scale: 1.2, padding: 0.15, rotation: 13, offsetX: 0, offsetY: 5 },
  'RI': { scale: 1.2, padding: 0.15, rotation: 14, offsetX: 0, offsetY: 5 },
  'DC': { scale: 1.3, padding: 0.20, rotation: 0, offsetX: 0, offsetY: 1 },
  'DEFAULT': { scale: 1.0, padding: 0.10, rotation: 0, offsetX: 0, offsetY: 0, strokeScale: 1.0 }
};

// Map toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const statesMapContainer = document.getElementById('states-map-container');
  const districtMapContainer = document.getElementById('district-map-container');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      
      // Update active states
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Toggle map views with animation
      if (view === 'states') {
        if (districtMapContainer) districtMapContainer.classList.remove('active');
        setTimeout(() => {
          statesMapContainer.classList.add('active');
          initializeStateInteractions();
        }, 100);
      } else if (view === 'districts') {
        statesMapContainer.classList.remove('active');
        setTimeout(() => {
          if (districtMapContainer) {
            districtMapContainer.classList.add('active');
            initializeDistrictInteractions();
          }
        }, 100);
      }
      
      // Clear state info when switching
      if (stateInfoPanel) {
        stateInfoPanel.innerHTML = '<div class="no-selection"></div>';
      }
    });
  });
  
  // Initialize state interactions on load
  initializeStateInteractions();
  
  // Apply custom stroke widths to state paths
  applyCustomStrokeWidths();
});

// Apply custom stroke widths based on state
function applyCustomStrokeWidths() {
  const statePaths = document.querySelectorAll('.state-path');
  
  statePaths.forEach(path => {
    const stateCode = path.id;
    const strokeWidth = STATE_STROKE_WIDTHS[stateCode] || STATE_STROKE_WIDTHS['DEFAULT'];
    path.style.strokeWidth = strokeWidth;
    
    // Store original stroke width for hover effects
    path.dataset.originalStroke = strokeWidth;
  });
}

// Initialize district map interactions
function initializeDistrictInteractions() {
  const districtPaths = document.querySelectorAll('#district-map-container path, #district-map-container polygon');
  const tooltipElement = document.getElementById('tooltip');

  if (!tooltipElement) {
    console.error('Tooltip element not found!');
    return;
  }

  districtPaths.forEach(path => {
    const svgDistrictId = path.id; // e.g., "LA02"
    const districtId = formatDistrictId(svgDistrictId); // e.g., "LA-2"
    const memberData = houseMembers[districtId];
    
    // Get state name from district ID
    const stateCode = districtId.substring(0, 2);
    const stateName = getStateName(stateCode);
    const districtNumber = districtId.substring(3);
    const districtTitle = `${stateName} ${districtNumber}`;

     // 🚫 Skip state borders (non-district shapes)
    if (!districtId || districtId.toLowerCase().includes('border')) return;

    // Hover effects
    path.addEventListener('mouseenter', (e) => {
      path.style.stroke = '#e9d8df';
      path.style.strokeWidth = '2.5';
      
      updateDistrictTooltip(e, districtTitle, districtId, memberData);
    });

    path.addEventListener('mousemove', (e) => {
      if (tooltipElement.style.display === 'block') {
        positionTooltip(e, tooltipElement);
      }
    });

    path.addEventListener('mouseleave', () => {
    // Restore original party color
    const districtId = formatDistrictId(path.id);
    path.style.fill = getDistrictColor(districtId);
    path.style.stroke = '';
    path.style.strokeWidth = '';
    tooltipElement.style.display = 'none';
    clearTimeout(tooltipTimeout);
  });

    // Click to show district details and zoom into state view
    path.addEventListener('click', (e) => {
    e.stopPropagation();
    const stateCode = districtId.substring(0, 2);
    showDistrictStateMap(stateCode, districtId, memberData);
  });
  });
}



// Update tooltip for districts
function updateDistrictTooltip(e, districtName, districtId, memberData) {
  const tooltipElement = document.getElementById('tooltip');
  if (!tooltipElement) return;
  
  let tooltipContent = `<div class="tooltip-header">${districtName}</div>`;
  
  if (memberData) {
    const partyClass = getPartyClass(memberData.party);
    const partyName = getPartyFullName(memberData.party);
    
    tooltipContent += `
      <div class="tooltip-content">
        <div class="tooltip-row">
          <span class="tooltip-label">District:</span>
          <span class="tooltip-value">${districtId}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Rep:</span>
          <span class="tooltip-value ${partyClass}">${memberData.name}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Party:</span>
          <span class="tooltip-value ${partyClass}">${partyName}</span>
        </div>
      </div>
    `;
  } else {
    tooltipContent += `
      <div class="tooltip-content">
        <div class="tooltip-row">
          <span class="tooltip-label">District:</span>
          <span class="tooltip-value">${districtId}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Rep:</span>
          <span class="tooltip-value">Data not available</span>
        </div>
      </div>
    `;
  }
  
  tooltipElement.innerHTML = tooltipContent;
  tooltipElement.style.display = 'block';
  tooltipElement.style.fontSize = '0.80rem';
  positionTooltip(e, tooltipElement);
}

// Show detailed district information
function showDistrictDetails(districtName, districtId, memberData) {
  const infoPanel = document.getElementById('state-info');
  
  if (!memberData) {
    infoPanel.innerHTML = `
      <div class="district-info">
        <h2 class="district-name">${districtName}</h2>
        <div class="data-section">
          <h3>Congressional District ${districtId}</h3>
          <div class="data-grid">
            <div class="data-item">
              <span class="data-label">District ID:</span>
              <span class="data-value">${districtId}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Status:</span>
              <span class="data-value">Data not available</span>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const partyClass = getPartyClass(memberData.party);
  const partyName = getPartyFullName(memberData.party);
  
  infoPanel.innerHTML = `
    <div class="district-info">
      <h2 class="district-name">${districtName}</h2>
      <div class="data-section">
        <h3>Congressional District ${districtId}</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Rep:</span>
            <span class="data-value ${partyClass}">${memberData.name}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Party:</span>
            <span class="data-value ${partyClass}">${partyName}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Election Year:</span>
            <span class="data-value">${memberData.electionYear}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Margin:</span>
            <span class="data-value">${memberData.margin}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Load state-level SVG for districts
async function loadStateDistrictSVG(stateName) {
  const svgPath = `assets/maps/${stateName}.svg`;
  try {
    const response = await fetch(svgPath);
    if (!response.ok) throw new Error(`SVG not found: ${stateName}`);
    return await response.text();
  } catch (err) {
    console.error(`Error loading state SVG: ${stateName}`, err);
    return null;
  }
}

// Show zoomed-in state view for the clicked district
async function showDistrictStateMap(stateCode, districtId, memberData) {
  const districtMapContainer = document.getElementById('district-map-container');
  const stateMapContainer = document.getElementById('state-map-container');

  // Hide national district map, show the state-level one
  districtMapContainer.classList.remove('active');
  stateMapContainer.classList.add('active');

  const stateName = getStateName(stateCode);
  const svgContent = await loadStateDistrictSVG(stateName);

  if (!svgContent) {
    console.warn(`State SVG not found for ${stateName}`);
    return;
  }

  // Insert the state SVG into the container
  stateMapContainer.innerHTML = svgContent;

  // Setup hover/click interactions for the state’s congressional districts
  initializeStateDistrictInteractions(stateCode);

  // Update right-side info panel
  showDistrictDetails(`${stateName} ${districtId}`, districtId, memberData);
}

// Handle hover + click on state-level districts
function initializeStateDistrictInteractions(stateCode) {
  const tooltipElement = document.getElementById('tooltip');
  const districtPaths = document.querySelectorAll('#state-map-container path');

  districtPaths.forEach(path => {
    const districtSvgId = path.id; // e.g., AL__1
    if (!districtSvgId) return;

    const districtId = formatDistrictId(districtSvgId.replace('__', '-')); // AL-1
    const memberData = houseMembers[districtId];
    const stateName = getStateName(stateCode);
    const districtName = `${stateName} ${districtId.substring(3)}`;

    // Hover
    path.addEventListener('mouseenter', (e) => {
      path.style.stroke = '#e9d8df';
      path.style.strokeWidth = '1.5';
      updateDistrictTooltip(e, districtName, districtId, memberData);
    });

    path.addEventListener('mousemove', (e) => positionTooltip(e, tooltipElement));

    path.addEventListener('mouseleave', () => {
      path.style.stroke = '';
      path.style.strokeWidth = '';
      tooltipElement.style.display = 'none';
    });

    // Click again (optional: zoom or reset)
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      showDistrictDetails(districtName, districtId, memberData);
    });
  });

  // Add back button to return to the full national view
  addDistrictBackButton();
}

// Add "Back to District Map" button
function addDistrictBackButton() {
  const stateMapContainer = document.getElementById('state-map-container');
  if (document.getElementById('back-to-districts')) return;

  const backBtn = document.createElement('button');
  backBtn.id = 'back-to-districts';
  backBtn.classList.add('back-button');
  backBtn.innerText = '← Back to District Map';

  backBtn.addEventListener('click', () => {
    document.getElementById('state-map-container').classList.remove('active');
    document.getElementById('district-map-container').classList.add('active');
  });

  stateMapContainer.insertAdjacentElement('afterbegin', backBtn);
}

// Load the County SVG file for state zoom view
async function loadCountySVG() {
  if (countyMapState.isLoaded) return countyMapState.svgDoc;
  
  try {
    // This loads the COUNTY map for when users click individual states
    const response = await fetch('assets/svg-items/Usa_counties_large.svg');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('SVG parsing error: ' + parserError.textContent);
    }
    
    countyMapState.svgDoc = svgDoc;
    countyMapState.isLoaded = true;
    return countyMapState.svgDoc;
  } catch (error) {
    console.error('Failed to load county map:', error);
    alert('County map file not found. Please ensure Usa_counties_large.svg exists in assets/svg-items/ folder.');
    return null;
  }
}

// Extract and display counties for a specific state (when clicking on States tab)
async function showCountyMap(stateCode) {
  const stateName = stateNames[stateCode];
  if (!stateName) return;

  // Load COUNTY SVG (not district) for state zoom view
  const countyDoc = await loadCountySVG();
  if (!countyDoc) {
    console.error('County map not available');
    return;
  }

  // Convert state name to SVG ID format (spaces to underscores)
  const stateGroupId = stateName.replace(/ /g, '_');
  
  // Find the state group in the county SVG
  const stateGroup = countyDoc.getElementById(stateGroupId);
  if (!stateGroup) {
    console.error(`No county data found for ${stateName} (looked for ID: ${stateGroupId})`);
    return;
  }

  // Store reference to original map container
  const mapContainer = document.querySelector('.map-container');
  if (!countyMapState.originalMapContainer) {
    countyMapState.originalMapContainer = mapContainer.innerHTML;
  }

  // Create county map display (counties for the clicked state)
  createCountyMapDisplay(mapContainer, stateGroup, stateCode, stateName);
}

function createCountyMapDisplay(container, stateGroup, stateCode, stateName) {
  // Clone the state group to avoid modifying the original
  const stateClone = stateGroup.cloneNode(true);
  
  // Create a temporary SVG to get proper bounding box
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tempSvg.style.position = 'absolute';
  tempSvg.style.visibility = 'visible';
  tempSvg.style.width = '10rem';
  tempSvg.style.height = '10rem';
  document.body.appendChild(tempSvg);
  tempSvg.appendChild(stateClone);
  
  // Get the bounding box with the element in the DOM
  const bbox = stateClone.getBBox();
  
  // Remove temporary SVG
  document.body.removeChild(tempSvg);

  // Get state-specific configuration
  const config = STATE_SIZE_CONFIG[stateCode] || STATE_SIZE_CONFIG['DEFAULT'];
  
  // Apply state-specific scaling and padding
  const scaledWidth = bbox.width * config.scale;
  const scaledHeight = bbox.height * config.scale;
  
  // Add padding around the state
  const paddedWidth = scaledWidth * (1 + config.padding * 2);
  const paddedHeight = scaledHeight * (1 + config.padding * 2);
  
  // Calculate centered position with padding, scaling, and offsets
  const viewBoxX = bbox.x - (paddedWidth - bbox.width) / 2 + (config.offsetX || 0);
  const viewBoxY = bbox.y - (paddedHeight - bbox.height) / 2 + (config.offsetY || 0);

  // Calculate the center of the bounding box for rotation
  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;
  
  // Build transform string with rotation if specified
  const rotationTransform = config.rotation !== 0 
    ? `transform="rotate(${config.rotation} ${centerX} ${centerY})"` 
    : '';

  const strokeScale = config.strokeScale || 1.0;
  stateClone.querySelectorAll('path, polygon, line').forEach(el => {
    const baseWidth = parseFloat(el.getAttribute('stroke-width')) || 1;
    el.setAttribute('stroke-width', baseWidth * strokeScale);
  });
  
  // Create new SVG for county display (showing counties within the state)
  const countyMapHTML = `
    <div class="county-map-wrapper">
      <div class="county-map-header">
        <button id="back-to-states" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580ZM480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Z"/></svg>
        </button>
      </div>
      <svg id="county-map"
           viewBox="${viewBoxX} ${viewBoxY} ${paddedWidth} ${paddedHeight}"
           preserveAspectRatio="xMidYMid meet"
           style="flex: 1; width: 100%; min-height: 0;">
        <g ${rotationTransform}>
          ${stateGroup.innerHTML}
        </g>
      </svg>
      <div id="county-tooltip" class="county-tooltip"></div>
    </div>
  `;

  container.innerHTML = countyMapHTML;
  setupCountyInteractions(stateCode);
  document.getElementById('back-to-states').addEventListener('click', returnToStatesMap);
  updateStateInfoForCounties(stateCode, stateName);
}


// Set up hover and click interactions for counties within state zoom view
function setupCountyInteractions(stateCode) {
  const countyPaths = document.querySelectorAll('#county-map path, #county-map polygon');
  const countyTooltip = document.getElementById('county-tooltip');

  countyPaths.forEach(path => {
    const countyId = path.id;
    const countyTitle = path.querySelector('title')?.textContent || 'Unknown County';
    
    // Extract county name (remove state suffix like ", AL")
    const countyName = countyTitle.split(',')[0].trim();
    
    // Get election data for this county
    const electionData = getCountyElectionData(stateCode, countyName);
    const results = electionData ? calculateCountyResults(electionData) : null;

    // Hover effects
    path.addEventListener('mouseenter', (e) => {
    path.dataset.originalStroke = path.getAttribute('stroke') || '';
    path.style.stroke = '#e9d8df';
    path.style.strokeWidth = '1';
      
      // Build tooltip with election data
      let tooltipContent = `<div class="tooltip-header">${countyTitle}</div>`;
      
      if (results) {
        const winnerClass = results.winner === 'Democrat' ? 'party-dem' : 'party-rep';
        
        tooltipContent += `
          <div class="tooltip-content">
            <div class="tooltip-row">
              <span class="tooltip-label">${results.dem.candidate}:</span>
              <span class="tooltip-value party-dem">${results.dem.percent}%</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">${results.gop.candidate}:</span>
              <span class="tooltip-value party-rep">${results.gop.percent}%</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Winner:</span>
              <span class="tooltip-value ${winnerClass}">${results.winner === 'Democrat' ? results.dem.candidate : results.gop.candidate}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Margin:</span>
              <span class="tooltip-value">${results.margin}%</span>
            </div>
          </div>
        `;
      } else {
        tooltipContent += `
          <div class="tooltip-content">
            <div class="tooltip-row">
              <span class="tooltip-value">Election data not available</span>
            </div>
          </div>
        `;
      }
      
      countyTooltip.innerHTML = tooltipContent;
      countyTooltip.style.display = 'block';
      positionTooltip(e, countyTooltip);
    });

    path.addEventListener('mousemove', (e) => {
      positionTooltip(e, countyTooltip);
    });

    path.addEventListener('mouseleave', () => {
      path.style.fill = '';
      path.style.stroke = '';
      path.style.strokeWidth = '';
      countyTooltip.style.display = 'none';
      path.style.stroke = path.dataset.originalStroke;
    });

    // Click to show county details
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      showCountyDetails(countyTitle, countyId, stateCode, electionData, results);
    });
  });
}

// Show detailed county information in state zoom view
function showCountyDetails(countyName, countyId, stateCode) {
  const infoPanel = document.getElementById('state-info');
  
  infoPanel.innerHTML = `
    <div class="county-info">
      <h2 class="county-name">${countyName}</h2>
      <div class="data-section">
        <h3>County Information</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">State:</span>
            <span class="data-value">${stateNames[stateCode]}</span>
          </div>
        </div>
      </div>
      <div class="data-section">
        <p class="info-message">
          <em>Additional county data can be loaded here from your data source.</em>
        </p>
      </div>
    </div>
  `;
}

// Update state info panel for county zoom view
function updateStateInfoForCounties(stateCode, stateName) {
  const infoPanel = document.getElementById('state-info');
  const data = stateData[stateCode];

  if (!data) {
    infoPanel.innerHTML = `<p>No data available for ${stateName}</p>`;
    return;
  }

  // ✅ Determine party class helper
  const getPartyClass = (text) => {
    if (text.includes('(D)')) return 'party-dem';
    if (text.includes('(R)')) return 'party-rep';
    if (text.includes('(I)')) return 'party-ind';
    return '';
  };

  // ✅ Format senators with party coloring
  const senatorList = data.senators
    ? data.senators
        .map((sen) => {
          const partyClass = getPartyClass(sen);
          return `<div class="senator-name ${partyClass}">${sen}</div>`;
        })
        .join('')
    : '<div class="senator-name">N/A</div>';

  // ✅ Color governor name by party
  const governorPartyClass = getPartyClass(data.governor);

  // ✅ Color winner by party (like tooltip)
  const winnerParty = data.lastElection.winner.includes('(D)')
    ? 'dem'
    : data.lastElection.winner.includes('(R)')
    ? 'rep'
    : 'ind';

  infoPanel.innerHTML = `
    <div class="state-info county-view">
      <h2 class="state-name">${stateName}</h2>
      <div class="data-section">
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Governor:</span>
            <span class="data-value ${governorPartyClass}">${data.governor}</span>
          </div>
          <div class="data-item senators-row">
            <span class="data-label">Senators:</span>
            <span class="data-value">${senatorList}</span>
          </div>
          <div class="data-item">
            <span class="data-label">2024 Winner:</span>
            <span class="data-value party-${winnerParty}">${data.lastElection.winner}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Electoral Votes:</span>
            <span class="data-value">${data.electoralVotes}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Return to the original states map
function returnToStatesMap() {
  // Simple solution: just refresh the page to reset everything
  location.reload();
}

// Extract state interaction setup into a reusable function
function initializeStateInteractions() {
  const statePaths = document.querySelectorAll('.state-path');
  const tooltipElement = document.getElementById('tooltip');

  if (!tooltipElement) {
    console.error('Tooltip element not found!');
    return;
  }

  statePaths.forEach(path => {
    const stateCode = path.id;
    const baseStroke = path.dataset.originalStroke || STATE_STROKE_WIDTHS[stateCode] || STATE_STROKE_WIDTHS['DEFAULT'];

    // Optimized hover events with custom stroke widths
    path.addEventListener('mouseenter', (e) => {
      path.classList.add('hovered');
      // Increase stroke width on hover (3x the base)
      path.style.strokeWidth = parseFloat(baseStroke) * 3;
      updateTooltip(e, stateCode);
    });

    path.addEventListener('mousemove', (e) => {
      if (tooltipElement.style.display === 'block') {
        positionTooltip(e, tooltipElement);
      }
    });

    path.addEventListener('mouseleave', () => {
      path.classList.remove('hovered');
      // Reset to original stroke width
      path.style.strokeWidth = baseStroke;
      tooltipElement.style.display = 'none';
      clearTimeout(tooltipTimeout);
    });

    // Click handling - shows district map for that state
    path.addEventListener('click', (e) => {
      e.preventDefault();

      const isActive = path.classList.contains('active');

      // Remove active class from all states
      statePaths.forEach(s => s.classList.remove('active'));

      if (!isActive) {
        // Activate the clicked state
        path.classList.add('active');
        // Show district map for this state
        showCountyMap(stateCode);

        // Smooth scroll to info panel if it exists
        if (stateInfoPanel && stateInfoPanel.offsetTop) {
          stateInfoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // Deactivate (second click)
        tooltipElement.style.display = 'none';
        if (stateInfoPanel) stateInfoPanel.innerHTML = '<div class="no-selection"></div>';
      }

      // Hide tooltip after clicking
      tooltipElement.style.display = 'none';
    });
  });
}

// Improved tooltip positioning function
function positionTooltip(e, tooltip) {
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = e.clientX - tooltipRect.width - margin;
  let top = e.clientY - tooltipRect.height / 2;

  // Keep tooltip within viewport bounds
  if (left < margin) {
    left = e.clientX + margin;
  }
  if (top < margin) {
    top = margin;
  }
  if (top + tooltipRect.height > viewportHeight - margin) {
    top = viewportHeight - tooltipRect.height - margin;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// Debounced tooltip update for better performance
let tooltipTimeout;
function updateTooltip(e, stateCode) {
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    const tooltipElement = document.getElementById('tooltip');
    if (!tooltipElement) return;

    const data = stateData[stateCode];
    const stateName = stateNames[stateCode] || stateCode;

    let tooltipContent = `<div class="tooltip-header">${stateName}</div>`;

    if (data) {
      // ✅ Party detection helper
      const getPartyClass = (text) => {
        if (text.includes('(D)')) return 'party-dem';
        if (text.includes('(R)')) return 'party-rep';
        if (text.includes('(I)')) return 'party-ind';
        return '';
      };

      // ✅ Format senators with correct color classes
      const senatorList = data.senators
        ? data.senators
            .map((sen) => {
              const partyClass = getPartyClass(sen);
              return `<div class="senator-name ${partyClass}">${sen}</div>`;
            })
            .join('')
        : '<div class="senator-name">N/A</div>';

      // ✅ Governor coloring
      const governorPartyClass = getPartyClass(data.governor);

      // ✅ Winner coloring
      const winnerParty = data.lastElection.winner.includes('(D)')
        ? 'dem'
        : data.lastElection.winner.includes('(R)')
        ? 'rep'
        : 'ind';

      // ✅ Color the map based on winner
      const statePath = document.getElementById(stateCode);
      if (statePath) {
        if (winnerParty === 'dem') {
          statePath.style.fill = '#264b82'; // blue for Dem
        } else if (winnerParty === 'rep') {
          statePath.style.fill = '#d9534f'; // red for Rep
        } else {
          statePath.style.fill = '#bbbbbb52'; // neutral/independent
        }
      }

      // ✅ Construct tooltip
      tooltipContent += `
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-label">Governor:</span>
            <span class="tooltip-value ${governorPartyClass}">${data.governor}</span>
          </div>
          <div class="tooltip-row senators-row">
            <span class="tooltip-label">Senators:</span>
            <span class="tooltip-value">${senatorList}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">2024 Winner:</span>
            <span class="tooltip-value party-${winnerParty}">${data.lastElection.winner}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Margin:</span>
            <span class="tooltip-value">${data.lastElection.margin}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Electoral Votes:</span>
            <span class="tooltip-value">${data.electoralVotes}</span>
          </div>
        </div>
      `;
    } else {
      tooltipContent += `<div class="tooltip-content"><em>Loading data...</em></div>`;
    }

    tooltipElement.innerHTML = tooltipContent;
    tooltipElement.style.display = 'block';
    tooltipElement.style.fontSize = '0.80rem';
    positionTooltip(e, tooltipElement);
  }, 6);
}

function colorStatesByWinner() {
  for (const stateCode in stateData) {
    // ✅ Get ALL elements with this state code (both paths and circles)
    const statePaths = document.querySelectorAll(`#${stateCode}, .${stateCode}`);
    if (!statePaths.length) continue;

    const winner = stateData[stateCode].lastElection.winner;

    // Determine party
    let winnerParty = 'neutral';
    if (winner.includes('(D)') && !winner.includes('(R)')) winnerParty = 'dem';
    else if (winner.includes('(R)') && !winner.includes('(D)')) winnerParty = 'rep';
    else if (winner.includes('(R)') && winner.includes('(D)')) winnerParty = 'split';

    // Apply fill to ALL matching elements
    statePaths.forEach(statePath => {
      if (winnerParty === 'dem') {
        statePath.style.fill = '#264b82';
      } else if (winnerParty === 'rep') {
        statePath.style.fill = '#d9534f';
      } else if (winnerParty === 'split') {
        // Create striped pattern for split states
        const patternId = `${stateCode}-pattern`;
        if (!document.getElementById(patternId)) {
          const svg = document.getElementById('svgdata');
          const defs = svg.querySelector('defs') || (() => {
            const d = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.prepend(d);
            return d;
          })();

          const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
          pattern.setAttribute('id', patternId);
          pattern.setAttribute('patternUnits', 'userSpaceOnUse');
          pattern.setAttribute('width', '10');
          pattern.setAttribute('height', '10');

          const rectBlue = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rectBlue.setAttribute('width', '5');
          rectBlue.setAttribute('height', '10');
          rectBlue.setAttribute('fill', '#264b82');

          const rectRed = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rectRed.setAttribute('x', '5');
          rectRed.setAttribute('width', '5');
          rectRed.setAttribute('height', '10');
          rectRed.setAttribute('fill', '#d9534f');

          pattern.appendChild(rectBlue);
          pattern.appendChild(rectRed);
          defs.appendChild(pattern);
        }

        statePath.style.fill = `url(#${patternId})`;
      } else {
        statePath.style.fill = '#bbbbbb52';
      }
    });
  }
}
// Call this once after your map and stateData are loaded
colorStatesByWinner();

// Helper function to get district party color
function getDistrictColor(districtId) {
  const memberData = houseMembers[districtId];
  
  if (memberData && memberData.party) {
    const partyClass = getPartyClass(memberData.party);
    if (partyClass === 'party-rep') return '#d9534f';
    if (partyClass === 'party-dem') return '#264b82';
    if (partyClass === 'party-ind') return '#9b59b6';
  }
  return '#bbbbbb52';
}

// Color congressional districts by party
function colorDistrictsByParty() {
  const districtPaths = document.querySelectorAll('#outlines path[id]');
  
  districtPaths.forEach(path => {
    const svgDistrictId = path.id; // e.g., "LA__2" or "LA02"
    const districtId = formatDistrictId(svgDistrictId); // e.g., "LA-2"
    
    // Skip state borders or invalid districts
    if (!districtId || districtId.toLowerCase().includes('border')) return;
    
    const memberData = houseMembers[districtId];
    
    if (memberData && memberData.party) {
      const partyClass = getPartyClass(memberData.party);
      
      // Apply colors based on party class
      if (partyClass === 'party-rep') {
        path.style.fill = '#d9534f'; // Red for Republican
      } else if (partyClass === 'party-dem') {
        path.style.fill = '#264b82'; // Blue for Democrat
      } else if (partyClass === 'party-ind') {
        path.style.fill = '#9b59b6'; // Purple for Independent
      } else {
        path.style.fill = '#bbbbbb52'; // Gray for unknown/other
      }
    } else {
      // No data available - use gray
      path.style.fill = '#bbbbbb52';
    }
  });
}

// Call this after district map and houseMembers data are loaded
colorDistrictsByParty();


// Handle window resize for tooltip positioning
window.addEventListener('resize', () => {
  const tooltipElement = document.getElementById('tooltip');
  if (tooltipElement && tooltipElement.style.display === 'block') {
    tooltipElement.style.display = 'none';
  }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const tooltipElement = document.getElementById('tooltip');
    if (tooltipElement) {
      tooltipElement.style.display = 'none';
    }
    document.querySelectorAll('.state-path.active').forEach(path => {
      path.classList.remove('active');
    });
    if (stateInfoPanel) {
      stateInfoPanel.innerHTML = '<div class="no-selection"></div>';
    }
  }
});