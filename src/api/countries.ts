import { API_BASE_URL } from './config';

export async function fetchAvailableCountries(): Promise<
  { countryCode: string; name: string }[]
> {
  const res = await fetch(`${API_BASE_URL}/AvailableCountries`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}
