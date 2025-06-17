import styled from 'styled-components';
import { useCalendarContext } from '../context/CalendarContext';

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
`;

export const CountrySelect = () => {
  const { availableCountries, currentCountry, setCurrentCountry } =
    useCalendarContext();

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
