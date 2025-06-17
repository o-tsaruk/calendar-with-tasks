import { Calendar } from './Calendar';
import { CalendarProvider } from './context/CalendarContext';

function App() {
  return (
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  );
}

export default App;
