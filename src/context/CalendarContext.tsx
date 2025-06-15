// context/CalendarContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { PublicHoliday } from '../types';

export interface CalendarContextType {
  currentCountryCode: string;
  currentYear: number;
  currentMonth: number;
  holidayData: Record<number, PublicHoliday[]>;

  setCurrentCountryCode: (code: string) => void;
  setCurrentYear: (year: number) => void;
  setCurrentMonth: (month: number) => void;
  setHolidayData: (year: number, data: PublicHoliday[]) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const now = new Date();

  const [currentCountryCode, setCurrentCountryCode] = useState<string>('UA');
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [holidayData, setHolidayDataState] = useState<
    Record<number, PublicHoliday[]>
  >({});

  const setHolidayData = (year: number, data: PublicHoliday[]) => {
    setHolidayDataState((prev) => ({ ...prev, [year]: data }));
  };

  return (
    <CalendarContext.Provider
      value={{
        currentCountryCode,
        currentYear,
        currentMonth,
        holidayData,
        setCurrentCountryCode,
        setCurrentYear,
        setCurrentMonth,
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
