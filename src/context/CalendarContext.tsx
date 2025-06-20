import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPublicHolidays } from '../api/holidays';
import type { CountryHolidayMap, Task } from '../types';

export interface CalendarContextType {
  currentMonth: number;
  currentYear: number;
  currentCountry: string;
  holidays: CountryHolidayMap;
  tasks: Task[];

  setCurrentDate: (month: number, year: number) => void;
  setCurrentCountry: (code: string) => void;
  setHolidays: (data: CountryHolidayMap) => void;
  setTasks: (tasks: Task[]) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentCountry, setCurrentCountry] = useState<string>('UA');
  const [holidays, setHolidaysState] = useState<CountryHolidayMap>({});
  const [tasks, setTasks] = useState<Task[]>([]);

  const setCurrentDate = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const setHolidays = async () => {
    if (holidays[currentCountry]?.[currentYear]) return;

    try {
      const parsedData = await fetchPublicHolidays(currentYear, currentCountry);
      setHolidaysState((prev) => ({
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
    if (!currentCountry || !currentYear) return;
    setHolidays();
  }, [currentYear, currentCountry]);

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        currentYear,
        currentCountry,
        holidays,
        tasks,
        setCurrentDate,
        setCurrentCountry,
        setHolidays,
        setTasks,
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
