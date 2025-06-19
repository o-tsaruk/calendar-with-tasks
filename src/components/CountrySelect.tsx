import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAvailableCountries } from '../api/countries';
import { useCalendarContext } from '../context/CalendarContext';
import type { Country } from '../types';

const Select = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid var(--border-control);
  background: var(--bg-primary);

  &:focus {
    outline: none;
    border-color: var(--border-control);
  }
`;

const initialCountry = {
  countryCode: 'UA',
  name: 'Ukraine',
};

export const CountrySelect = () => {
  const [availableCountries, setAvailableCountries] = useState<Country[]>([
    initialCountry,
  ]);
  const { currentCountry, setCurrentCountry } = useCalendarContext();

  useEffect(() => {
    fetchAvailableCountries().then(setAvailableCountries).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentCountry(e.target.value);
  };

  return (
    <Select value={currentCountry} onChange={handleChange}>
      {availableCountries.map((country) => (
        <option key={country.countryCode} value={country.countryCode}>
          {country.name}
        </option>
      ))}
    </Select>
  );
};
