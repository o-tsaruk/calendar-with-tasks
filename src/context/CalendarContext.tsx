import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAvailableCountries } from '../api/countries';
import { fetchPublicHolidays } from '../api/holidays';
import type { Country, CountryHolidayMap } from '../types';

export interface CalendarContextType {
  currentMonth: number;
  currentYear: number;
  currentCountry: string;
  availableCountries: Country[];
  holidayData: CountryHolidayMap;

  setCurrentDate: (month: number, year: number) => void;
  setCurrentCountry: (code: string) => void;
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
  const [currentCountry, setCurrentCountry] = useState<string>('UA');
  const [availableCountries, setAvailableCountries] = useState<Country[]>([
    initialCountry,
  ]);
  const [holidayData, setHolidayDataState] = useState<CountryHolidayMap>({});

  const setCurrentDate = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const setHolidayData = async () => {
    if (holidayData[currentCountry]?.[currentYear]) return;

    try {
      const parsedData = await fetchPublicHolidays(currentYear, currentCountry);
      setHolidayDataState((prev) => ({
        ...prev,
        [currentCountry]: {
          ...prev[currentCountry],
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
    if (!currentCountry || !currentYear) return;
    setHolidayData();
  }, [currentYear, currentCountry]);

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        currentYear,
        currentCountry,
        availableCountries,
        holidayData,
        setCurrentDate,
        setCurrentCountry,
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
