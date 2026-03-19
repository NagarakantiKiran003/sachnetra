// India variant - sachnetra.com
import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';

// Re-export base config
export * from './base';

// Feeds for SachNetra — Indian news sources
import type { Feed } from '@/types';
import { rssProxyUrl } from '@/utils';
const rss = rssProxyUrl;

export const FEEDS: Record<string, Feed[]> = {
  // Tier 1 — Wire Services & Major Broadcasters
  politics: [
    { name: 'NDTV', url: rss('https://feeds.feedburner.com/ndtvnews-top-stories'), region: 'national' },
    { name: 'The Hindu', url: rss('https://www.thehindu.com/news/feeder/default.rss'), region: 'national' },
    { name: 'Indian Express', url: rss('https://news.google.com/rss/search?q=site:indianexpress.com+India&hl=en&gl=IN&ceid=IN:en'), region: 'national' },
    { name: 'ANI', url: rss('https://www.aninews.in/rss/india.xml'), region: 'national' },
    { name: 'Times of India', url: rss('https://timesofindia.indiatimes.com/rssfeedstopstories.cms'), region: 'national' },
    // Tier 2 — Established outlets
    { name: 'Hindustan Times', url: rss('https://news.google.com/rss/search?q=site:hindustantimes.com+India&hl=en&gl=IN&ceid=IN:en'), region: 'national' },
    { name: 'India Today', url: rss('https://www.indiatoday.in/rss/1206578'), region: 'national' },
    // Tier 2 — Quality independent journalism
    { name: 'The Wire', url: rss('https://thewire.in/feed'), region: 'national', propagandaRisk: 'low' },
    { name: 'Scroll', url: rss('https://scroll.in/feed'), region: 'national' },
    { name: 'The Print', url: rss('https://theprint.in/feed'), region: 'national' },
  ],

  disaster: [
    { name: 'NDTV India', url: rss('https://feeds.feedburner.com/ndtvnews-india-news'), region: 'national' },
    { name: 'The Hindu Environment', url: rss('https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss'), region: 'national' },
  ],

  economy: [
    { name: 'LiveMint', url: rss('https://news.google.com/rss/search?q=site:livemint.com&hl=en&gl=IN&ceid=IN:en'), region: 'national' },
    { name: 'Economic Times', url: rss('https://news.google.com/rss/search?q=site:economictimes.indiatimes.com&hl=en&gl=IN&ceid=IN:en'), region: 'national' },
    { name: 'Business Standard', url: rss('https://news.google.com/rss/search?q=site:business-standard.com&hl=en&gl=IN&ceid=IN:en'), region: 'national' },
  ],

  technology: [
    { name: 'YourStory', url: rss('https://yourstory.com/feed'), region: 'national' },
    { name: 'Inc42', url: rss('https://inc42.com/feed/'), region: 'national' },
  ],

  // State-affiliated sources — tagged for UI transparency
  government: [
    { name: 'DD News', url: rss('https://news.google.com/rss/search?q=site:ddnews.gov.in&hl=en&gl=IN&ceid=IN:en'), region: 'national', stateAffiliated: 'India' },
    { name: 'PIB', url: rss('https://news.google.com/rss/search?q=site:pib.gov.in&hl=en&gl=IN&ceid=IN:en'), region: 'national', stateAffiliated: 'India' },
  ],
};


export const DEFAULT_PANELS: Record<string, PanelConfig> = {
  'live-news': { name: 'India News', enabled: true, priority: 1 },
  // RSS article panels — keys must match FEEDS category keys
  'politics': { name: 'Politics', enabled: true, priority: 2 },
  'disaster': { name: 'Disaster & Environment', enabled: true, priority: 3 },
  'economy': { name: 'Economy', enabled: true, priority: 4 },
  'technology': { name: 'Technology', enabled: true, priority: 5 },
  'government': { name: 'Government', enabled: true, priority: 6 },
};

export const DEFAULT_MAP_LAYERS: MapLayers = {
  gpsJamming: false,
  satellites: false,
  conflicts: false,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: true,
  economic: false,
  waterways: false,
  outages: false,
  cyberThreats: false,
  datacenters: false,
  protests: false,
  flights: false,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech variant layers (not used in india variant)
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
  // Finance variant layers
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
  // Happy variant layers
  positiveEvents: false,
  kindness: false,
  happiness: false,
  speciesRecovery: false,
  renewableInstallations: false,
  tradeRoutes: false,
  iranAttacks: false,
  ciiChoropleth: false,
  dayNight: false,
  // Commodity variant layers
  miningSites: false,
  processingPlants: false,
  commodityPorts: false,
  webcams: false,
};

export const MOBILE_DEFAULT_MAP_LAYERS: MapLayers = {
  gpsJamming: false,
  satellites: false,
  conflicts: false,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: false,
  economic: false,
  waterways: false,
  outages: false,
  cyberThreats: false,
  datacenters: false,
  protests: false,
  flights: false,
  military: false,
  natural: false,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: false,
  climate: false,
  // Tech variant layers (not used in india variant)
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
  // Finance variant layers
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
  // Happy variant layers
  positiveEvents: false,
  kindness: false,
  happiness: false,
  speciesRecovery: false,
  renewableInstallations: false,
  tradeRoutes: false,
  iranAttacks: false,
  ciiChoropleth: false,
  dayNight: false,
  // Commodity variant layers
  miningSites: false,
  processingPlants: false,
  commodityPorts: false,
  webcams: false,
};

export const VARIANT_CONFIG: VariantConfig = {
  name: 'india',
  description: 'SachNetra — Indian news clarity tool',
  panels: DEFAULT_PANELS,
  mapLayers: DEFAULT_MAP_LAYERS,
  mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
};
