import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, loadTodos, selectTodos } from '../../Store/todo.slice'

function Main() {
  const dispatch = useDispatch()
  // const todos = useSelector(state => state[TODOS_FEATURE_KEY].entities)
  const todos = useSelector(selectTodos)
  useEffect(() => {
    dispatch(loadTodos('http://localhost:5000/todos'))
  }, [dispatch])
  return (
    <section className="main">
      <button onClick={() => dispatch(addTodo({title: '测试'}))}>
        添加任务
      </button>
      <ul className="todo-list">
        {
          // Object.values(todos).map(todo => (
          todos.map(todo => (
            <li key={todo.cid}>
              <div className="view">
                <input className="toggle" type="checkbox" />
                <label>{todo.title}</label>
                <button className="destroy" />
              </div>
              <input className="edit" />
            </li>
          ))
        }
      </ul>
    </section>
  )
}

export default Main
