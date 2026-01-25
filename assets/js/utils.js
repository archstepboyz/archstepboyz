/* Sort by string length then alphabetically in case of tie */
export function idCompareSort(a, b) {
  const lengthComparison = a.length - b.length;
  if (lengthComparison !== 0) {
    return lengthComparison;
  }

  return a.localeCompare(b);
};


export async function getCityFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json");
    const data = await response.json();
    const city = data.city;
    const region = data.region;
    return `${city}/${region}`;
  } catch (e) {
    return "New York/New York";
  }
}
