// context/CalendarContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAvailableCountries } from '../api/countries';
import { fetchPublicHolidays } from '../api/holidays';
import type { Country, CountryHolidayMap } from '../types';

export interface CalendarContextType {
  currentMonth: number;
  currentYear: number;
  currentCountryCode: string;
  availableCountries: Country[];
  holidayData: CountryHolidayMap;

  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setCurrentCountryCode: (code: string) => void;
  setAvailableCountries: (countries: Country[]) => void;
  setHolidayData: (data: CountryHolidayMap) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const now = new Date();
  const initialCountry = {
    countryCode: 'UA',
    name: 'Ukraine',
  };

  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentCountryCode, setCurrentCountryCode] = useState<string>('UA');
  const [availableCountries, setAvailableCountries] = useState<Country[]>([
    initialCountry,
  ]);
  const [holidayData, setHolidayDataState] = useState<CountryHolidayMap>({});

  const setHolidayData = async () => {
    if (holidayData[currentCountryCode]?.[currentYear]) return;

    try {
      const parsedData = await fetchPublicHolidays(
        currentYear,
        currentCountryCode,
      );
      setHolidayDataState((prev) => ({
        ...prev,
        [currentCountryCode]: {
          ...prev[currentCountryCode],
          [currentYear]: parsedData,
        },
      }));
    } catch (error) {
      console.error('Error fetching holiday data:', error);
    }
  };

  useEffect(() => {
    fetchAvailableCountries().then(setAvailableCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentCountryCode || !currentYear) return;
    setHolidayData();
  }, [currentYear, currentCountryCode]);

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        currentYear,
        currentCountryCode,
        availableCountries,
        holidayData,
        setCurrentMonth,
        setCurrentYear,
        setCurrentCountryCode,
        setAvailableCountries,
        setHolidayData,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('CalendarProvider not found');
  return context;
};
