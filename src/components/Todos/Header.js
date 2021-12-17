import { addTodo } from '../../Store/todo.slice'
import { useDispatch } from 'react-redux'

function Header() {
  // const todos = useSelector(selectTodos)
  const dispatch = useDispatch()

  const handleNewTodo = e => {
    if (e.keyCode !== 13) return
    const value = e.target.value.trim()
    if(!value) return

    dispatch(addTodo({
      title: value,
      isCompleted: false
    }))

    // 将输入框置空
    e.target.value = ''
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        data-testid="new-todo"
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onKeyUp={handleNewTodo}
      />
    </header>
  )
}

export default Header
