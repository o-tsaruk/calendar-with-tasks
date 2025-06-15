// context/CalendarContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PublicHoliday, Country } from '../types';

export interface CalendarContextType {
  currentMonth: number;
  currentYear: number;
  currentCountryCode: string;
  availableCountries: Country[];
  holidayData: Record<number, PublicHoliday[]>;

  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setCurrentCountryCode: (code: string) => void;
  setAvailableCountries: (countries: Country[]) => void;
  setHolidayData: (year: number, data: PublicHoliday[]) => void;
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
  const [holidayData, setHolidayDataState] = useState<
    Record<number, PublicHoliday[]>
  >({});

  useEffect(() => {
    fetch('https://date.nager.at/api/v3/AvailableCountries')
      .then((res) => res.json())
      .then((data) => setAvailableCountries(data))
      .catch(console.error);
  }, []);

  const setHolidayData = (year: number, data: PublicHoliday[]) => {
    setHolidayDataState((prev) => ({ ...prev, [year]: data }));
  };

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
