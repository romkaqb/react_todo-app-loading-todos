/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  toggleTodoCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  toggleTodoCompleted,
  deleteTodo,
  updateTodoTitle,
}) => {
  const [editingId, setEditingId] = useState<number>();
  const [editInput, setEditInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const editor = (todo: Todo) => {
    setEditingId(todo.id);
    setEditInput(todo.title);
  };

  const handleSave = useCallback(() => {
    if (editingId !== undefined) {
      const trimmed = editInput.trim();

      if (trimmed) {
        updateTodoTitle(editingId, trimmed); // виклик оновлення через пропси
      }

      setEditingId(undefined);
      setEditInput('');
    }
  }, [editInput, editingId, updateTodoTitle]);

  useEffect(() => {
    if (editingId !== undefined && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingId !== undefined &&
        inputRef.current &&
        event.target instanceof HTMLElement &&
        !inputRef.current.contains(event.target)
      ) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, editInput, handleSave]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodoCompleted(todo.id)}
            />
          </label>

          {editingId === todo.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editInput}
                onChange={e => setEditInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => editor(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          {isLoading && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
