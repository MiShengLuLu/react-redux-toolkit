import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectTodos, deleteTodos } from '../../Store/todo.slice'

function Footer() {
  const dispatch = useDispatch()

  const todos = useSelector(selectTodos)

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.isCompleted).length,
    [ todos ]
  )

  const clearCompletedTodos = () => {
    const list = []
    for (let key in todos) {
      const t = todos[key]
      if (t.isCompleted) {
        list.push(t.cid)
      }
    }
    dispatch(deleteTodos(list))
  }
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> item left
      </span>
      <ul className="filters">
        <li>
          <Link className="selected" to="/" exact="true">All</Link>
        </li>
        <li>
          <Link to="/active">Active</Link>
        </li>
        <li>
          <Link to="/completed">Completed</Link>
        </li>
      </ul>
      {
        todos.some(t => t.isCompleted)
          ? <button className="clear-completed" onClick={clearCompletedTodos}>Clear completed</button>
          : null
      }
      
    </footer>
  )
}

export default Footer
