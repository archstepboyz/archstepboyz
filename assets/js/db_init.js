const DB_URL = "https://qeuvposbesblckyuflbd.supabase.co";
const ANON_API_KEY = "sb_publishable_mZVo1bfw-ChB9iCx1V5QwA_UUKrCx8o";

export const db_client = supabase.createClient(DB_URL, ANON_API_KEY);

/* TODO: Remove existing MOCK_DB */
export const PICKERS = [
  { uuid: 'a6a59bf1-97d5-4a9b-b1df-f4439bc9c4e9', id: 'FE', username: 'fearthebeak', color: '#6c5ce7' }, // Purple
  { uuid: 'c310b6e4-1827-4df6-a65d-42e6f7523f58', id: 'GA', username: 'Gayson Tatum', color: '#00cec9' }, // Teal
  { uuid: '61e46342-e00e-4ed6-ab69-cd3b060e54cd', id: 'NO', username: 'notflorida', color: '#fab1a0' }, // Peach
  { uuid: '0372871d-2f06-444b-835b-599383550980', id: 'BI', color: '#fdcb6e' }, // Yellow
  { uuid: 'fa3d35cd-6495-4893-a704-cad39542533f', id: 'CO', username: 'cookedbycapjack', color: '#d63031' },  // Red
  { uuid: '1bca9cd2-5e27-4942-97d7-29c2e0bc70cc', id: 'CB', color: '#0984e3' },  // Blue
  { uuid: '72cee94c-8f10-4005-94df-c21995d44bae', id: 'JO', color: '#00b894' },  // Green
  /* unused */
  { uuid: 'f5d64492-737d-48a7-939a-d75449e21ca2', id: 'CR', color: '#e17055', }, //icon: 'fa-solid fa-user-astronaut' },  // Orange
  { uuid: '', id: 'BOOTS', username: 'Boots Radford', color: '#e84393', icon: 'fa-solid fa-shoe-prints' },  // Pink
];
