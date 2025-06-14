import styled from "styled-components";
import { getCalendarGridDays } from "./utils"; 

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
`;

const Cell = styled.div<{ isToday?: boolean; isOutside?: boolean }>`
  border: 1px solid #ddd;
  padding: 8px;
  min-height: 80px;
  text-align: center;
  font-size: 14px;
  color: ${({ isOutside }) => (isOutside ? "#aaa" : "black")};
  background-color: ${({ isOutside }) => (isOutside ? "#fafafa" : "white")};
  border-radius: 6px;

  ${({ isToday }) =>
    isToday &&
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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.toISOString().split("T")[0];
  const days = getCalendarGridDays(year, month);

  return (
    <div>
     <h2>
        {now.toLocaleString("default", { month: "long" })} {year}
      </h2>
      <DayNamesRow>
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </DayNamesRow>
      <Grid>
        {days.map((day) => (
          <Cell
            key={day.date}
            isToday={day.date === today}
            isOutside={day.isOutside}
          >
            {day.dayOfMonth}
          </Cell>
        ))}
      </Grid>
    </div>
  );
};
