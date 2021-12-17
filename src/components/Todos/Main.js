import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, loadTodos, selectTodos } from '../../Store/todo.slice'
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
  
  return (
    <section className="main">
      <button onClick={() => dispatch(addTodo({title: '测试'}))}>
        添加任务
      </button>
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
