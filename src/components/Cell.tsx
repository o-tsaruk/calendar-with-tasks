import { useState } from 'react';
import styled from 'styled-components';
import { useCalendarContext } from '../context/CalendarContext';
import type { Task } from '../types';

const StyledCell = styled.div<{ $isToday?: boolean; $isOutside?: boolean }>`
  position: relative;
  border: 1px solid var(--border-secondary);
  padding: 6px;
  min-height: 140px;
  font-size: 12px;
  color: ${({ $isOutside }) =>
    $isOutside ? 'var(--text-secondary)' : 'var(--text-primary)'};
  background-color: ${({ $isOutside }) =>
    $isOutside ? 'var(--bg-secondary)' : 'var(--bg-primary)'};
  border-radius: 6px;

  box-sizing: border-box;
  overflow: hidden;

  ${({ $isToday }) =>
    $isToday &&
    `
    border: 2px solid var(--border-active);
    font-weight: bold;
  `}

  &:hover button.add-task-button {
    opacity: 1;
    pointer-events: auto;
  }
`;

const AddTaskButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  width: calc(100% - 12px);
  padding: 2px 0;
  font-size: 12px;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;

  &:hover {
    filter: brightness(105%);
  }
`;

const TaskInput = styled.textarea`
  width: 100%;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid var(--border-control);
  padding: 4px;
  resize: none;
  margin-top: 4px;
`;

const TaskList = styled.ul`
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const TaskItem = styled.li<{ expanded: boolean }>`
  font-size: 12px;
  background: var(--bg-task);
  border: 1px solid var(--border-task);
  border-radius: 4px;
  padding: 2px 4px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.2s ease;

  overflow: hidden;
  white-space: ${({ expanded }) => (expanded ? 'normal' : 'nowrap')};
  text-overflow: ${({ expanded }) => (expanded ? 'unset' : 'ellipsis')};
`;

interface CellProps {
  day: {
    date: string;
    dayOfWeek: number;
    dayOfMonth: number;
    isOutside: boolean;
  };
  today: string;
  todaysTasks: Task[];
}

export const Cell = ({ day, today, todaysTasks }: CellProps) => {
  const { tasks, setTasks } = useCalendarContext();
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [expandedTaskIndex, setExpandedTaskIndex] = useState<number | null>(
    null,
  );

  const handleToggle = (index: number) => {
    setExpandedTaskIndex((prev) => (prev === index ? null : index));
  };

  const handleAdd = () => {
    if (draft.trim()) {
      let newTask: Task = { date: day.date, text: draft.trim() };
      setTasks(tasks.concat(newTask));
    }
    setDraft('');
    setIsAdding(false);
  };

  return (
    <StyledCell $isToday={day.date === today} $isOutside={day.isOutside}>
      <div>{day.dayOfMonth}</div>

      <TaskList>
        {todaysTasks.map((task, index) => (
          <TaskItem
            key={index}
            expanded={expandedTaskIndex === index}
            onClick={() => handleToggle(index)}
            title={task.text}
          >
            {task.text}
          </TaskItem>
        ))}
      </TaskList>

      {!day.isOutside && !isAdding && (
        <AddTaskButton
          onClick={() => setIsAdding(true)}
          className='add-task-button'
        >
          + Add task
        </AddTaskButton>
      )}

      {isAdding && (
        <TaskInput
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
      )}
    </StyledCell>
  );
};
