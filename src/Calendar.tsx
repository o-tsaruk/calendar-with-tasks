import { useMemo } from 'react';
import styled from 'styled-components';
import { Cell } from './components/Cell';
import { Header } from './components/Header';
import { useCalendarContext } from './context/CalendarContext';
import type { Task } from './types';
import { getCalendarGridDays } from './utils';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
`;

const DayNamesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
`;

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar = () => {
  const { currentMonth, currentYear, setCurrentDate, tasks } =
    useCalendarContext();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const days = getCalendarGridDays(currentMonth, currentYear);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  const handleMonthChange = (direction: 'next' | 'prev') => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === 'next') {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    } else {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    }

    setCurrentDate(newMonth, newYear);
  };

  const handleSearch = () => {
    // todo
  };

  return (
    <div>
      <Header
        month={currentMonth}
        year={currentYear}
        onPrev={() => handleMonthChange('prev')}
        onNext={() => handleMonthChange('next')}
        onSearch={handleSearch}
      />
      <DayNamesRow>
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </DayNamesRow>
      <Grid>
        {days.map((day) => {
          const todaysTasks = tasksByDate[day.date] || [];
          return (
            <Cell
              key={day.date}
              day={day}
              today={today}
              todaysTasks={todaysTasks}
            />
          );
        })}
      </Grid>
    </div>
  );
};
