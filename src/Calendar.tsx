import styled from 'styled-components';
import { Header } from './components/Header';
import { useCalendarContext } from './context/CalendarContext';
import { getCalendarGridDays } from './utils';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
`;

const Cell = styled.div<{ $isToday?: boolean; $isOutside?: boolean }>`
  border: 1px solid #ddd;
  padding: 6px;
  min-height: 130px;
  font-size: 12px;
  color: ${({ $isOutside }) => ($isOutside ? '#aaa' : 'black')};
  background-color: ${({ $isOutside }) => ($isOutside ? '#fafafa' : 'white')};
  border-radius: 6px;

  ${({ $isToday }) =>
    $isToday &&
    `
    border: 2px solid #0070f3;
    font-weight: bold;
  `}
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
  const { currentMonth, currentYear, setCurrentMonth, setCurrentYear } =
    useCalendarContext();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const days = getCalendarGridDays(currentMonth, currentYear);

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

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
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
        {days.map((day) => (
          <Cell
            key={day.date}
            $isToday={day.date === today}
            $isOutside={day.isOutside}
          >
            <div>{day.dayOfMonth}</div>
          </Cell>
        ))}
      </Grid>
    </div>
  );
};
