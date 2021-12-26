import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectTodos, deleteTodos } from '../../Store/todo.slice'

function CustomLink ({ children, to, ...props }) {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return <Link className={match ? 'selected' : ''} to={to} {...props}>{children}</Link>
}

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
        <strong data-testid="remaining">{remainingCount}</strong> item left
      </span>
      <ul className="filters">
        <li>
          <CustomLink data-testid="link-all" to="/" exact="true">All</CustomLink>
        </li>
        <li>
          <CustomLink data-testid="link-active" to="/active">Active</CustomLink>
        </li>
        <li>
          <CustomLink data-testid="link-completed" to="/completed">Completed</CustomLink>
        </li>
      </ul>
      {
        todos.some(t => t.isCompleted)
          ? <button data-testid="clear-completed" className="clear-completed" onClick={clearCompletedTodos}>Clear completed</button>
          : null
      }
      
    </footer>
  )
}

export default Footer
