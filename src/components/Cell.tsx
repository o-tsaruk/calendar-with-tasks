import { useState } from 'react';
import styled from 'styled-components';
import { useCalendarContext } from '../context/CalendarContext';
import type { Task } from '../types';

const StyledCell = styled.div<{ $isToday?: boolean; $isOutside?: boolean }>`
  position: relative;
  border: 1px solid var(--border-secondary);
  padding: 4px 6px 24px 6px;
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
  `}

  &:hover button.add-task-button {
    opacity: 1;
    pointer-events: auto;
  }

  &.drag-over {
    border: 2px dashed var(--border-active);
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
  border-radius: 4px;
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
  margin: 2px 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const TaskItem = styled.li<{ expanded: boolean }>`
  position: relative;
  font-size: 12px;
  background: var(--bg-task);
  border: 1px solid var(--border-task);
  border-radius: 4px;
  padding: 2px 4px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.2s ease;

  overflow: hidden;

  &:hover .remove-task-button {
    display: inline-block;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  display: none;
  margin-left: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-control);
  border-radius: 3px;
  width: 18px;
  height: 18px;
  font-weight: bold;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  text-align: center;
  user-select: none;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: darkred;
    color: white;
  }
`;

type DropData = {
  task: Task;
  from: string;
  fromIndex: number;
};

const handleTaskDrop = (
  e: React.DragEvent<HTMLElement>,
  dropIndex: number | null,
  dayDate: string,
  tasks: Task[],
  todaysTasks: Task[],
  setTasks: (tasks: Task[]) => void,
) => {
  e.preventDefault();

  const data = e.dataTransfer.getData('application/json');
  if (!data) return;

  const { task, from, fromIndex }: DropData = JSON.parse(data);

  // Reorder in the same cell, or move to another
  if (from === dayDate && dropIndex !== null) {
    const updated = [...todaysTasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(dropIndex, 0, moved);

    const otherTasks = tasks.filter((t) => t.date !== dayDate);
    setTasks([...otherTasks, ...updated]);
  } else if (from !== dayDate) {
    const updated = [
      ...tasks.filter((t) => !(t.date === from && t.text === task.text)),
      { ...task, date: dayDate },
    ];
    setTasks(updated);
  }
};

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

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

  const handleRemove = (index: number) => {
    const taskToRemove = todaysTasks[index];
    const filteredTasks = tasks.filter(
      (t) => !(t.date === day.date && t.text === taskToRemove.text),
    );
    setTasks(filteredTasks);
    setExpandedTaskIndex(null);
    setEditingIndex(null);
  };

  const handleTaskEdit = (index: number) => {
    const trimmed = editingText.trim();

    if (trimmed.length === 0) {
      setEditingIndex(null);
      setEditingText('');
      return;
    }

    const task = todaysTasks[index];
    const updatedTask = { ...task, text: trimmed };

    const updatedTodays = [...todaysTasks];
    updatedTodays[index] = updatedTask;

    const otherTasks = tasks.filter((t) => t.date !== day.date);
    setTasks([...otherTasks, ...updatedTodays]);

    setEditingIndex(null);
  };

  const TaskItemContent = (props: { index: number; text: string }) =>
    editingIndex === props.index ? (
      <TaskInput
        autoFocus
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onBlur={() => {
          handleTaskEdit(props.index);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTaskEdit(props.index);
          }
          if (e.key === 'Escape') {
            setEditingIndex(null);
          }
        }}
      />
    ) : (
      <>
        {props.text}
        <RemoveButton
          className='remove-task-button'
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(props.index);
          }}
          aria-label='Delete task'
          title='Delete task'
        >
          ×
        </RemoveButton>
      </>
    );

  return (
    <StyledCell
      $isToday={day.date === today}
      $isOutside={day.isOutside}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) =>
        handleTaskDrop(e, null, day.date, tasks, todaysTasks, setTasks)
      }
    >
      <div>{day.dayOfMonth}</div>

      <TaskList>
        {todaysTasks.map((task, index) => (
          <TaskItem
            key={index}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                'application/json',
                JSON.stringify({ task, from: day.date, fromIndex: index }),
              );
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              handleTaskDrop(e, index, day.date, tasks, todaysTasks, setTasks);
            }}
            expanded={expandedTaskIndex === index}
            onClick={() => {
              handleToggle(index);
              setEditingIndex(index);
              setEditingText(task.text);
            }}
            title={task.text}
          >
            <TaskItemContent index={index} text={task.text} />
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
