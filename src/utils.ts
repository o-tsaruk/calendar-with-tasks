export function getCalendarGridDays(year: number, month: number) {
  const currentMonthDays = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();

  const leadingDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
    const day = prevMonthDays - firstDayOfMonth + i + 1;
    const date = new Date(prevYear, prevMonth, day);
    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay(),
      dayOfMonth: day,
      isOutside: true,
    };
  });

  const currentDays = Array.from({ length: currentMonthDays }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay(),
      dayOfMonth: day,
      isOutside: false,
    };
  });

  const allDays = [...leadingDays, ...currentDays];
  const totalCells = allDays.length;
  const totalGridCells = totalCells <= 35 ? 35 : 42;

  const trailingNeeded = totalGridCells - totalCells;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const trailingDays = Array.from({ length: trailingNeeded }, (_, i) => {
    const day = i + 1;
    const date = new Date(nextYear, nextMonth, day);
    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay(),
      dayOfMonth: day,
      isOutside: true,
    };
  });

  return [...allDays, ...trailingDays];
}
