import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadTodos, selectTodos, updateTodos } from '../../Store/todo.slice'
import TodoItem from './Item'
import { useLocation } from 'react-router-dom'

function Main() {
  const dispatch = useDispatch()

  // const todos = useSelector(state => state[TODOS_FEATURE_KEY].entities)
  const todos = useSelector(selectTodos)
  const location = useLocation()

  useEffect(() => {
    dispatch(loadTodos('http://localhost:5000/todos'))
  }, [dispatch])

  const filterTodos = useMemo(
    () => {
      const { pathname } = location
      switch (pathname) {
        case '/active':
          return todos.filter(t => !t.isCompleted)
        case '/completed':
          return todos.filter(t => t.isCompleted)
        default:
          return todos
      }
    },
    [todos, location]
  )

  const toggleAllState = useMemo(
    () => todos.every(t => t.isCompleted),
    [todos]
  )

  const toggleAll = (checked) => {
    let payload = []
    todos.forEach(t => {
      payload.push({
        id: t.cid,
        changes: { ...t, isCompleted: checked }
      })
    })
    dispatch(updateTodos(payload))
  }
  
  return (
    <section className="main">
      <span>{toggleAllState}</span>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={toggleAllState}
          data-testid="toggle-all"
          onChange={(e) => toggleAll(e.target.checked)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {
          filterTodos.map(todo => (
            <TodoItem todo={todo} key={todo.cid} />
          ))
        }
      </ul>
    </section>
  )
}

export default Main
