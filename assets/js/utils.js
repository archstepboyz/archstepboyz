export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

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
