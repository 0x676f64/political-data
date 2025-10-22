// Enhanced Interactive US Map Script
const tooltip = document.getElementById('tooltip');
const stateInfoPanel = document.getElementById('state-info');

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

const stateData = {
  AL: {
    name: 'Alabama',
    governor: 'Kay Ivey (R)',
    senators: ['Tommy Tuberville (R)', 'Katie Britt (R)'],
    electoralVotes: 9,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+25.4%',
      turnout: '63.2%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Energy Industry',
      pacSpending: '$45M'
    }
  },
  AK: {
    name: 'Alaska',
    governor: 'Mike Dunleavy (R)',
    senators: ['Lisa Murkowski (R)', 'Dan Sullivan (R)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+14.7%',
      turnout: '58.9%'
    },
    campaignFinance: {
      total: '$35M',
      topDonor: 'Oil & Gas',
      pacSpending: '$12M'
    }
  },
  AZ: {
    name: 'Arizona',
    governor: 'Katie Hobbs (D)',
    senators: ['Mark Kelly (D)', 'Kyrsten Sinema (I)'],
    electoralVotes: 11,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+5.5%',
      turnout: '72.6%'
    },
    campaignFinance: {
      total: '$485M',
      topDonor: 'Tech Industry',
      pacSpending: '$165M'
    }
  },
  AR: {
    name: 'Arkansas',
    governor: 'Sarah Huckabee Sanders (R)',
    senators: ['John Boozman (R)', 'Tom Cotton (R)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+28.0%',
      turnout: '56.8%'
    },
    campaignFinance: {
      total: '$75M',
      topDonor: 'Agriculture',
      pacSpending: '$25M'
    }
  },
  CA: {
    name: 'California',
    governor: 'Gavin Newsom (D)',
    senators: ['Alex Padilla (D)', 'Laphonza Butler (D)'],
    electoralVotes: 54,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+20.1%',
      turnout: '71.4%'
    },
    campaignFinance: {
      total: '$1.2B',
      topDonor: 'Tech Industry',
      pacSpending: '$450M'
    }
  },
  CO: {
    name: 'Colorado',
    governor: 'Jared Polis (D)',
    senators: ['Michael Bennet (D)', 'John Hickenlooper (D)'],
    electoralVotes: 10,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+13.7%',
      turnout: '73.1%'
    },
    campaignFinance: {
      total: '$285M',
      topDonor: 'Tech Industry',
      pacSpending: '$95M'
    }
  },
  CT: {
    name: 'Connecticut',
    governor: 'Ned Lamont (D)',
    senators: ['Richard Blumenthal (D)', 'Chris Murphy (D)'],
    electoralVotes: 7,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+13.8%',
      turnout: '65.4%'
    },
    campaignFinance: {
      total: '$145M',
      topDonor: 'Financial Services',
      pacSpending: '$55M'
    }
  },
  DE: {
    name: 'Delaware',
    governor: 'John Carney (D)',
    senators: ['Tom Carper (D)', 'Chris Coons (D)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+12.4%',
      turnout: '66.8%'
    },
    campaignFinance: {
      total: '$45M',
      topDonor: 'Financial Services',
      pacSpending: '$18M'
    }
  },
  FL: {
    name: 'Florida',
    governor: 'Ron DeSantis (R)',
    senators: ['Marco Rubio (R)', 'Rick Scott (R)'],
    electoralVotes: 30,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+13.1%',
      turnout: '77.3%'
    },
    campaignFinance: {
      total: '$675M',
      topDonor: 'Tourism Industry',
      pacSpending: '$280M'
    }
  },
  GA: {
    name: 'Georgia',
    governor: 'Brian Kemp (R)',
    senators: ['Jon Ossoff (D)', 'Raphael Warnock (D)'],
    electoralVotes: 16,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+2.2%',
      turnout: '70.9%'
    },
    campaignFinance: {
      total: '$545M',
      topDonor: 'Real Estate',
      pacSpending: '$195M'
    }
  },
  HI: {
    name: 'Hawaii',
    governor: 'Josh Green (D)',
    senators: ['Brian Schatz (D)', 'Mazie Hirono (D)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+25.2%',
      turnout: '54.6%'
    },
    campaignFinance: {
      total: '$55M',
      topDonor: 'Tourism Industry',
      pacSpending: '$20M'
    }
  },
  ID: {
    name: 'Idaho',
    governor: 'Brad Little (R)',
    senators: ['Mike Crapo (R)', 'James Risch (R)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+30.2%',
      turnout: '59.8%'
    },
    campaignFinance: {
      total: '$65M',
      topDonor: 'Agriculture',
      pacSpending: '$22M'
    }
  },
  IL: {
    name: 'Illinois',
    governor: 'J.B. Pritzker (D)',
    senators: ['Dick Durbin (D)', 'Tammy Duckworth (D)'],
    electoralVotes: 19,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+12.1%',
      turnout: '67.2%'
    },
    campaignFinance: {
      total: '$425M',
      topDonor: 'Financial Services',
      pacSpending: '$155M'
    }
  },
  IN: {
    name: 'Indiana',
    governor: 'Eric Holcomb (R)',
    senators: ['Todd Young (R)', 'Mike Braun (R)'],
    electoralVotes: 11,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+17.8%',
      turnout: '61.5%'
    },
    campaignFinance: {
      total: '$185M',
      topDonor: 'Manufacturing',
      pacSpending: '$65M'
    }
  },
  IA: {
    name: 'Iowa',
    governor: 'Kim Reynolds (R)',
    senators: ['Chuck Grassley (R)', 'Joni Ernst (R)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+13.2%',
      turnout: '71.8%'
    },
    campaignFinance: {
      total: '$175M',
      topDonor: 'Agriculture',
      pacSpending: '$62M'
    }
  },
  KS: {
    name: 'Kansas',
    governor: 'Laura Kelly (D)',
    senators: ['Jerry Moran (R)', 'Roger Marshall (R)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+14.7%',
      turnout: '64.2%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Agriculture',
      pacSpending: '$45M'
    }
  },
  KY: {
    name: 'Kentucky',
    governor: 'Andy Beshear (D)',
    senators: ['Mitch McConnell (R)', 'Rand Paul (R)'],
    electoralVotes: 8,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+25.9%',
      turnout: '59.4%'
    },
    campaignFinance: {
      total: '$165M',
      topDonor: 'Coal Industry',
      pacSpending: '$58M'
    }
  },
  LA: {
    name: 'Louisiana',
    governor: 'Jeff Landry (R)',
    senators: ['Bill Cassidy (R)', 'John Kennedy (R)'],
    electoralVotes: 8,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+22.1%',
      turnout: '67.9%'
    },
    campaignFinance: {
      total: '$145M',
      topDonor: 'Oil & Gas',
      pacSpending: '$52M'
    }
  },
  ME: {
    name: 'Maine',
    governor: 'Janet Mills (D)',
    senators: ['Susan Collins (R)', 'Angus King (I)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+8.9%',
      turnout: '72.8%'
    },
    campaignFinance: {
      total: '$85M',
      topDonor: 'Healthcare',
      pacSpending: '$32M'
    }
  },
  MD: {
    name: 'Maryland',
    governor: 'Wes Moore (D)',
    senators: ['Ben Cardin (D)', 'Chris Van Hollen (D)'],
    electoralVotes: 10,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+25.4%',
      turnout: '69.3%'
    },
    campaignFinance: {
      total: '$225M',
      topDonor: 'Federal Contractors',
      pacSpending: '$85M'
    }
  },
  MA: {
    name: 'Massachusetts',
    governor: 'Maura Healey (D)',
    senators: ['Elizabeth Warren (D)', 'Ed Markey (D)'],
    electoralVotes: 11,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+25.2%',
      turnout: '69.8%'
    },
    campaignFinance: {
      total: '$285M',
      topDonor: 'Tech Industry',
      pacSpending: '$105M'
    }
  },
  MI: {
    name: 'Michigan',
    governor: 'Gretchen Whitmer (D)',
    senators: ['Gary Peters (D)', 'Debbie Stabenow (D)'],
    electoralVotes: 15,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+1.4%',
      turnout: '74.7%'
    },
    campaignFinance: {
      total: '$485M',
      topDonor: 'Auto Industry',
      pacSpending: '$175M'
    }
  },
  MN: {
    name: 'Minnesota',
    governor: 'Tim Walz (D)',
    senators: ['Amy Klobuchar (D)', 'Tina Smith (D)'],
    electoralVotes: 10,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+4.2%',
      turnout: '76.4%'
    },
    campaignFinance: {
      total: '$325M',
      topDonor: 'Healthcare',
      pacSpending: '$115M'
    }
  },
  MS: {
    name: 'Mississippi',
    governor: 'Tate Reeves (R)',
    senators: ['Roger Wicker (R)', 'Cindy Hyde-Smith (R)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+16.5%',
      turnout: '59.7%'
    },
    campaignFinance: {
      total: '$95M',
      topDonor: 'Agriculture',
      pacSpending: '$35M'
    }
  },
  MO: {
    name: 'Missouri',
    governor: 'Mike Kehoe (R)',
    senators: ['Josh Hawley (R)', 'Eric Schmitt (R)'],
    electoralVotes: 10,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+18.4%',
      turnout: '67.1%'
    },
    campaignFinance: {
      total: '$245M',
      topDonor: 'Agriculture',
      pacSpending: '$88M'
    }
  },
  MT: {
    name: 'Montana',
    governor: 'Greg Gianforte (R)',
    senators: ['Steve Daines (R)', 'Tim Sheehy (R)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+20.1%',
      turnout: '71.2%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Energy Industry',
      pacSpending: '$45M'
    }
  },
  NE: {
    name: 'Nebraska',
    governor: 'Pete Ricketts (R)',
    senators: ['Deb Fischer (R)', 'Pete Ricketts (R)'],
    electoralVotes: 5,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+19.8%',
      turnout: '68.4%'
    },
    campaignFinance: {
      total: '$95M',
      topDonor: 'Agriculture',
      pacSpending: '$35M'
    }
  },
  NV: {
    name: 'Nevada',
    governor: 'Joe Lombardo (R)',
    senators: ['Catherine Cortez Masto (D)', 'Jacky Rosen (D)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+3.1%',
      turnout: '73.2%'
    },
    campaignFinance: {
      total: '$285M',
      topDonor: 'Gaming Industry',
      pacSpending: '$105M'
    }
  },
  NH: {
    name: 'New Hampshire',
    governor: 'Chris Sununu (R)',
    senators: ['Jeanne Shaheen (D)', 'Maggie Hassan (D)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+2.8%',
      turnout: '74.4%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Manufacturing',
      pacSpending: '$45M'
    }
  },
  NJ: {
    name: 'New Jersey',
    governor: 'Phil Murphy (D)',
    senators: ['Cory Booker (D)', 'Andy Kim (D)'],
    electoralVotes: 14,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+5.7%',
      turnout: '65.8%'
    },
    campaignFinance: {
      total: '$385M',
      topDonor: 'Financial Services',
      pacSpending: '$145M'
    }
  },
  NM: {
    name: 'New Mexico',
    governor: 'Michelle Lujan Grisham (D)',
    senators: ['Martin Heinrich (D)', 'Ben Ray Luján (D)'],
    electoralVotes: 5,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+6.1%',
      turnout: '62.5%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Energy Industry',
      pacSpending: '$45M'
    }
  },
  NY: {
    name: 'New York',
    governor: 'Kathy Hochul (D)',
    senators: ['Chuck Schumer (D)', 'Kirsten Gillibrand (D)'],
    electoralVotes: 28,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+11.8%',
      turnout: '58.6%'
    },
    campaignFinance: {
      total: '$785M',
      topDonor: 'Financial Services',
      pacSpending: '$295M'
    }
  },
  NC: {
    name: 'North Carolina',
    governor: 'Josh Stein (D)',
    senators: ['Thom Tillis (R)', 'Ted Budd (R)'],
    electoralVotes: 16,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+3.4%',
      turnout: '73.7%'
    },
    campaignFinance: {
      total: '$485M',
      topDonor: 'Banking',
      pacSpending: '$175M'
    }
  },
  ND: {
    name: 'North Dakota',
    governor: 'Doug Burgum (R)',
    senators: ['John Hoeven (R)', 'Kevin Cramer (R)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+33.1%',
      turnout: '55.4%'
    },
    campaignFinance: {
      total: '$45M',
      topDonor: 'Oil & Gas',
      pacSpending: '$18M'
    }
  },
  OH: {
    name: 'Ohio',
    governor: 'Mike DeWine (R)',
    senators: ['Sherrod Brown (D)', 'J.D. Vance (R)'],
    electoralVotes: 17,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+11.5%',
      turnout: '69.8%'
    },
    campaignFinance: {
      total: '$485M',
      topDonor: 'Manufacturing',
      pacSpending: '$175M'
    }
  },
  OK: {
    name: 'Oklahoma',
    governor: 'Kevin Stitt (R)',
    senators: ['James Lankford (R)', 'Markwayne Mullin (R)'],
    electoralVotes: 7,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+32.9%',
      turnout: '56.3%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Oil & Gas',
      pacSpending: '$45M'
    }
  },
  OR: {
    name: 'Oregon',
    governor: 'Tina Kotek (D)',
    senators: ['Ron Wyden (D)', 'Jeff Merkley (D)'],
    electoralVotes: 8,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+11.2%',
      turnout: '69.4%'
    },
    campaignFinance: {
      total: '$225M',
      topDonor: 'Tech Industry',
      pacSpending: '$85M'
    }
  },
  PA: {
    name: 'Pennsylvania',
    governor: 'Josh Shapiro (D)',
    senators: ['Bob Casey Jr. (D)', 'John Fetterman (D)'],
    electoralVotes: 19,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+1.2%',
      turnout: '70.9%'
    },
    campaignFinance: {
      total: '$685M',
      topDonor: 'Energy Industry',
      pacSpending: '$245M'
    }
  },
  RI: {
    name: 'Rhode Island',
    governor: 'Dan McKee (D)',
    senators: ['Jack Reed (D)', 'Sheldon Whitehouse (D)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+14.1%',
      turnout: '64.7%'
    },
    campaignFinance: {
      total: '$55M',
      topDonor: 'Healthcare',
      pacSpending: '$22M'
    }
  },
  SC: {
    name: 'South Carolina',
    governor: 'Henry McMaster (R)',
    senators: ['Lindsey Graham (R)', 'Tim Scott (R)'],
    electoralVotes: 9,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+11.7%',
      turnout: '68.5%'
    },
    campaignFinance: {
      total: '$185M',
      topDonor: 'Manufacturing',
      pacSpending: '$68M'
    }
  },
  SD: {
    name: 'South Dakota',
    governor: 'Kristi Noem (R)',
    senators: ['John Thune (R)', 'Mike Rounds (R)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+28.4%',
      turnout: '69.1%'
    },
    campaignFinance: {
      total: '$45M',
      topDonor: 'Agriculture',
      pacSpending: '$18M'
    }
  },
  TN: {
    name: 'Tennessee',
    governor: 'Bill Lee (R)',
    senators: ['Marsha Blackburn (R)', 'Bill Hagerty (R)'],
    electoralVotes: 11,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+24.9%',
      turnout: '59.2%'
    },
    campaignFinance: {
      total: '$225M',
      topDonor: 'Healthcare',
      pacSpending: '$85M'
    }
  },
  TX: {
    name: 'Texas',
    governor: 'Greg Abbott (R)',
    senators: ['John Cornyn (R)', 'Ted Cruz (R)'],
    electoralVotes: 40,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+13.8%',
      turnout: '66.7%'
    },
    campaignFinance: {
      total: '$890M',
      topDonor: 'Oil & Gas',
      pacSpending: '$320M'
    }
  },
  UT: {
    name: 'Utah',
    governor: 'Spencer Cox (R)',
    senators: ['Mike Lee (R)', 'Mitt Romney (R)'],
    electoralVotes: 6,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+20.5%',
      turnout: '62.8%'
    },
    campaignFinance: {
      total: '$125M',
      topDonor: 'Tech Industry',
      pacSpending: '$45M'
    }
  },
  VT: {
    name: 'Vermont',
    governor: 'Phil Scott (R)',
    senators: ['Patrick Leahy (D)', 'Bernie Sanders (I)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+32.6%',
      turnout: '65.4%'
    },
    campaignFinance: {
      total: '$35M',
      topDonor: 'Tourism Industry',
      pacSpending: '$15M'
    }
  },
  VA: {
    name: 'Virginia',
    governor: 'Glenn Youngkin (R)',
    senators: ['Mark Warner (D)', 'Tim Kaine (D)'],
    electoralVotes: 13,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+5.2%',
      turnout: '73.8%'
    },
    campaignFinance: {
      total: '$385M',
      topDonor: 'Federal Contractors',
      pacSpending: '$145M'
    }
  },
  WA: {
    name: 'Washington',
    governor: 'Bob Ferguson (D)',
    senators: ['Patty Murray (D)', 'Maria Cantwell (D)'],
    electoralVotes: 12,
    lastElection: {
      winner: 'Harris (D)',
      margin: '+18.1%',
      turnout: '67.9%'
    },
    campaignFinance: {
      total: '$285M',
      topDonor: 'Tech Industry',
      pacSpending: '$105M'
    }
  },
  WV: {
    name: 'West Virginia',
    governor: 'Patrick Morrisey (R)',
    senators: ['Joe Manchin (I)', 'Shelley Moore Capito (R)'],
    electoralVotes: 4,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+42.2%',
      turnout: '54.2%'
    },
    campaignFinance: {
      total: '$85M',
      topDonor: 'Coal Industry',
      pacSpending: '$32M'
    }
  },
  WI: {
    name: 'Wisconsin',
    governor: 'Tony Evers (D)',
    senators: ['Ron Johnson (R)', 'Tammy Baldwin (D)'],
    electoralVotes: 10,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+0.9%',
      turnout: '76.4%'
    },
    campaignFinance: {
      total: '$485M',
      topDonor: 'Manufacturing',
      pacSpending: '$175M'
    }
  },
  WY: {
    name: 'Wyoming',
    governor: 'Mark Gordon (R)',
    senators: ['John Barrasso (R)', 'Cynthia Lummis (R)'],
    electoralVotes: 3,
    lastElection: {
      winner: 'Trump (R)',
      margin: '+43.8%',
      turnout: '57.1%'
    },
    campaignFinance: {
      total: '$35M',
      topDonor: 'Energy Industry',
      pacSpending: '$15M'
    }
  }
};

// County map state management
const countyMapState = {
  isLoaded: false,
  svgDoc: null,
  currentState: null,
  originalMapContainer: null
};

// Load the county SVG file once
async function loadCountySVG() {
  if (countyMapState.isLoaded) return countyMapState.svgDoc;
  
  try {
    // Adjust this path to match your actual file location
    const response = await fetch('assets/svg-items/Usa_counties_large.svg');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    // Check for parsing errors
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

// Extract and display counties for a specific state
async function showCountyMap(stateCode) {
  const stateName = stateNames[stateCode];
  if (!stateName) return;

  // Load county SVG if not already loaded
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

  // Create county map display
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

  // Get container size (used to normalize state size)
  const containerRect = container.getBoundingClientRect();

  // Target fill ratio (percentage of container that the state should occupy)
  const fillPercentage = 0.50;

  // Calculate how much to scale this state relative to the container size
  const scaleX = (containerRect.width * fillPercentage) / bbox.width;
  const scaleY = (containerRect.height * fillPercentage) / bbox.height;

  // Choose the smaller of the two so it fits fully in both directions
  const scaleFactor = Math.min(scaleX, scaleY);

  // Calculate new viewBox dimensions based on scaled size
  const viewBoxWidth = bbox.width / scaleFactor;
  const viewBoxHeight = bbox.height / scaleFactor;

  // Center the state in the viewBox
  const viewBoxX = bbox.x - (viewBoxWidth - bbox.width) / 2;
  const viewBoxY = bbox.y - (viewBoxHeight - bbox.height) / 2;

  console.log('BBox:', bbox);
  console.log('Scale factor:', scaleFactor);
  console.log('ViewBox:', viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight);
  
  // Create new SVG for county display
  const countyMapHTML = `
    <div class="county-map-wrapper">
      <div class="county-map-header">
        <button id="back-to-states" class="back-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
          Back
        </button>
      </div>
      <svg id="county-map" class="county-svg"
           viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}"
           preserveAspectRatio="xMidYMid meet">
        ${stateGroup.outerHTML}
      </svg>
      <div id="county-tooltip" class="county-tooltip"></div>
    </div>
  `;

  // Rest of function stays the same...
  container.innerHTML = countyMapHTML;
  setupCountyInteractions(stateCode);
  document.getElementById('back-to-states').addEventListener('click', returnToStatesMap);
  updateStateInfoForCounties(stateCode, stateName);
}


// Set up hover and click interactions for counties
function setupCountyInteractions(stateCode) {
  const countyPaths = document.querySelectorAll('#county-map path');
  const countyTooltip = document.getElementById('county-tooltip');

  countyPaths.forEach(path => {
    const countyId = path.id;
    const countyTitle = path.querySelector('title')?.textContent || 'Unknown County';

    // Hover effects
    path.addEventListener('mouseenter', (e) => {
      path.style.fill = '#4A90E2';
      path.style.stroke = '#2171b5';
      path.style.strokeWidth = '2';
      
      countyTooltip.innerHTML = `
        <div class="tooltip-header">${countyTitle}</div>
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-label">County ID:</span>
            <span class="tooltip-value">${countyId}</span>
          </div>
        </div>
      `;
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
    });

    // Click to show county details
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      showCountyDetails(countyTitle, countyId, stateCode);
    });
  });
}

// Show detailed county information
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
          <div class="data-item">
            <span class="data-label">FIPS Code:</span>
            <span class="data-value">${countyId}</span>
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

// Update state info panel for county view
function updateStateInfoForCounties(stateCode, stateName) {
  const infoPanel = document.getElementById('state-info');
  const data = stateData[stateCode];

  infoPanel.innerHTML = `
    <div class="state-info county-view">
      <h2 class="state-name">${stateName}</h2>
      <div class="data-section">
        <h3>State Information</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Governor:</span>
            <span class="data-value">${data.governor}</span>
          </div>
          <div class="data-item">
            <span class="data-label">2024 Winner:</span>
            <span class="data-value">${data.lastElection.winner}</span>
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
  const mapContainer = document.querySelector('.map-container');
  
  if (countyMapState.originalMapContainer) {
    // Add fade-out animation to county map
    mapContainer.style.opacity = '0';
    mapContainer.style.transition = 'opacity 0.3s ease-out';
    
    setTimeout(() => {
      // Restore original map
      mapContainer.innerHTML = countyMapState.originalMapContainer;
      
      // Fade in the states map
      mapContainer.style.opacity = '0';
      setTimeout(() => {
        mapContainer.style.opacity = '1';
        mapContainer.style.transition = 'opacity 0.4s ease-in';
      }, 50);
      
      // Re-initialize state interactions by calling the setup function
      initializeStateInteractions();
    }, 300);
  }
  
  // Clear state info panel with fade effect
  const stateInfoPanel = document.getElementById('state-info');
  stateInfoPanel.style.transition = 'opacity 0.3s ease-out';
  stateInfoPanel.style.opacity = '0';
  
  setTimeout(() => {
    stateInfoPanel.innerHTML = '<div class="no-selection"></div>';
    stateInfoPanel.style.opacity = '1';
  }, 300);
  
  countyMapState.currentState = null;
}

// Extract state interaction setup into a reusable function
function initializeStateInteractions() {
  const statePaths = document.querySelectorAll('.state-path');
  const tooltipElement = document.getElementById('tooltip');
  const stateInfoPanel = document.getElementById('state-info');

  if (!tooltipElement) {
    console.error('Tooltip element not found!');
    return;
  }

  statePaths.forEach(path => {
    const stateCode = path.id;

    // Optimized hover events
    path.addEventListener('mouseenter', (e) => {
      path.classList.add('hovered');
      updateTooltip(e, stateCode);
    });

    path.addEventListener('mousemove', (e) => {
      if (tooltipElement.style.display === 'block') {
        positionTooltip(e, tooltipElement);
      }
    });

    path.addEventListener('mouseleave', () => {
      path.classList.remove('hovered');
      tooltipElement.style.display = 'none';
      clearTimeout(tooltipTimeout);
    });

    // Click handling
    path.addEventListener('click', (e) => {
      e.preventDefault();

      const isActive = path.classList.contains('active');

      // Remove active class from all states
      statePaths.forEach(s => s.classList.remove('active'));

      if (!isActive) {
        // Activate the clicked state
        path.classList.add('active');
        displayStateInfo(stateCode);

        // Smooth scroll to info panel if it exists
        if (stateInfoPanel && stateInfoPanel.offsetTop) {
          stateInfoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // Deactivate (second click)
        tooltipElement.style.display = 'none';
        if (stateInfoPanel) stateInfoPanel.innerHTML = '';
      }

      // Hide tooltip after clicking
      tooltipElement.style.display = 'none';
    });
  });
}

// Enhanced state click handler - automatically shows county map
function enhancedDisplayStateInfo(stateCode) {
  const data = stateData[stateCode];
  const stateName = stateNames[stateCode] || stateCode;
  const stateInfoPanel = document.getElementById('state-info');
  
  if (!data) {
    stateInfoPanel.innerHTML = `
      <div class="state-info">
        <h2 class="state-name">${stateName}</h2>
        <div class="loading-message">
          <p>Loading state data...</p>
        </div>
      </div>
    `;
    return;
  }

  // Automatically trigger county map display
  showCountyMap(stateCode);
}

// Replace the original displayStateInfo with the enhanced version
window.displayStateInfo = enhancedDisplayStateInfo;

// Export functions for use in other modules if needed
window.countyMapFunctions = {
  showCountyMap,
  returnToStatesMap,
  loadCountySVG
};

// Improved tooltip positioning function
function positionTooltip(e, tooltip) {
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = e.clientX - tooltipRect.width - margin;
  let top = e.clientY - tooltipRect.height / 2;

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
      const winnerParty = data.lastElection.winner.includes('(D)') ? 'dem' : 'rep';
      tooltipContent += `
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-label">Governor:</span>
            <span class="tooltip-value">${data.governor}</span>
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

// Enhanced state info display with better error handling
function displayStateInfo(stateCode) {
  const data = stateData[stateCode];
  const stateName = stateNames[stateCode] || stateCode;
  
  if (!data) {
    stateInfoPanel.innerHTML = `
      <div class="state-info">
        <h2 class="state-name">${stateName}</h2>
        <div class="loading-message">
          <p>Loading state data...</p>
          <p class="help-text">Click on another state or try again later.</p>
        </div>
      </div>
    `;
    return;
  }

  const winnerClass = data.lastElection.winner.includes('(D)') ? 'party-dem' : 'party-rep';

  stateInfoPanel.innerHTML = `
    <div class="state-info">
      <h2 class="state-name">${data.name}</h2>
      
      <div class="data-section">
        <h3>Leadership</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Governor:</span>
            <span class="data-value ${data.governor.includes('(D)') ? 'party-dem' : 'party-rep'}">${data.governor}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Senior Senator:</span>
            <span class="data-value ${data.senators[0].includes('(D)') ? 'party-dem' : 'party-rep'}">${data.senators[0]}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Junior Senator:</span>
            <span class="data-value ${data.senators[1].includes('(D)') ? 'party-dem' : 'party-rep'}">${data.senators[1]}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Electoral Votes:</span>
            <span class="data-value electoral-votes">${data.electoralVotes}</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>2024 Election Results</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Winner:</span>
            <span class="data-value ${winnerClass}">${data.lastElection.winner}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Margin:</span>
            <span class="data-value margin">${data.lastElection.margin}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Voter Turnout:</span>
            <span class="data-value turnout">${data.lastElection.turnout}</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Campaign Finance</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">Total Raised:</span>
            <span class="data-value money">${data.campaignFinance.total}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Top Donor Industry:</span>
            <span class="data-value">${data.campaignFinance.topDonor}</span>
          </div>
          <div class="data-item">
            <span class="data-label">PAC Spending:</span>
            <span class="data-value money">${data.campaignFinance.pacSpending}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Enhanced event listeners with better performance
document.addEventListener('DOMContentLoaded', () => {
  initializeStateInteractions();
});

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
  }
});