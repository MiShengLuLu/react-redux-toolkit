import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTodo, updateTodo } from '../../Store/todo.slice'
import classNames from 'classnames'

function TodoItem ({ todo }) {
  const dispatch = useDispatch()
  const inputEl = useRef()

  const [isEdit, setIsEdit] = useState(false)

  const saveEdit = e => {
    const value = e.target.value.trim()
    if (value) {
      dispatch(updateTodo({ ...todo, title: value }))
    } else {
      dispatch(deleteTodo(todo))
    }
    setIsEdit(false)
  }

  const cancelEdit = e => {
    setIsEdit(false)
    e.target.value = todo.title
  }
  return (
    <li data-testid="todo-item" className={classNames({
      completed: todo.isCompleted,
      editing: isEdit
    })}>
      <div className="view">
        <input
          data-testid="todo-done"
          className="toggle"
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => dispatch(updateTodo({
            ...todo,
            isCompleted: !todo.isCompleted
          }))}
        />
        <label
          data-testid="todo-text"
          onDoubleClick={() => {
            setIsEdit(true)
            setTimeout(() => {
              inputEl.current.focus()
            }, 0);
          }}
        >{todo.title}</label>
        <button data-testid="destroy" className="destroy" onClick={() => dispatch(deleteTodo(todo))} />
      </div>
      <input
        ref={inputEl}
        data-testid="todo-edit"
        className="edit"
        autoFocus
        defaultValue={todo.title}
        onBlur={saveEdit}
        onKeyUp={e => {
          if (e.key === 'Enter') { // 保存编辑
            saveEdit(e)
          } else if (e.key === 'Escape') { // 取消编辑
            cancelEdit(e)
          }
        }}
      />
    </li>
  )
}

export default TodoItem
