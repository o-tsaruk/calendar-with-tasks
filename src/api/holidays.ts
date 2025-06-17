import type { PublicHoliday } from '../types';
import { API_BASE_URL } from './config';

export async function fetchPublicHolidays(
  year: number,
  countryCode: string,
): Promise<PublicHoliday[]> {
  const res = await fetch(
    `${API_BASE_URL}/PublicHolidays/${year}/${countryCode}`,
  );
  if (!res.ok) throw new Error('Failed to fetch public holidays');
  const data: PublicHoliday[] = await res.json();

  return data.map(({ date, name }) => ({ date, name }));
}
