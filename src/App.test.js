import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, fireEvent } from './test-utils'
import userEvent from '@testing-library/user-event'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const todos = [
  {
    cid: 1,
    title: '吃饭',
    isCompleted: false
  },
  {
    cid: 2,
    title: '睡觉',
    isCompleted: false
  },
  {
    cid: 3,
    title: '打豆豆',
    isCompleted: false
  }
]

export const handlers = [
  rest.get('http://localhost:5000/todos', (req, res, ctx) => {
   return res(
     ctx.status(200),
     ctx.json(todos),
     ctx.delay(150)
   )
  })
]
const server = setupServer(...handlers)

beforeAll(() => server.listen())
beforeEach(() => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('添加任务', () => {
  test('输入内容敲回车，内容被添加到任务列表中，输入框被清空', () => {
    // 找到输入框
    const input = screen.getByTestId('new-todo')
    // 输入内容敲回车
    userEvent.type(input, 'Hello World{enter}')
    // 断言：
      // - 列表中有添加的内容
    expect(screen.getByText('Hello World')).toBeInTheDocument()
      // - 输入框被清空
    expect(input.value).toBe('')
  })
})

describe('删除任务', () => {
  test('点击删除按钮，任务项应该被移除', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    // 找到删除按钮
    const buttons = screen.getAllByTestId('destroy')
    // 点击删除按钮
    userEvent.click(buttons[0])
    // 断言：
    //   页面中没有删除的任务项了
    expect(screen.queryByText('吃饭')).toBeNull()
    //   余下任务项为2
    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems.length).toBe(2)
  })
})

describe('切换单个任务完成状态', () => {
  test('切换任务完成状态按钮，任务的完成样式也跟随改变', async () => {

    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // 任务项
    const todoItems = screen.getAllByTestId('todo-item')
    // 任务状态按钮
    const todoDones = screen.getAllByTestId('todo-done')

    // 初始任务状态断言
    todoDones.forEach(t => {
      expect(t.checked).toBeFalsy()
    })
    // 遍历任务项
    todoItems.forEach(t => {
      // 断言：
      //    每项任务状态都不包含类名 completed
      expect(t).not.toHaveClass('completed')
      expect(t.classList.contains('completed')).toBeFalsy()
    })
    // 点击第一项任务，修改任务状态
    userEvent.click(todoDones[0])
    
    // 断言：
    //    第一项任务状态为 true
    expect(todoDones[0].checked).toBeTruthy()
    //    第一项任务包含类名 completed
    expect(todoItems[0]).toHaveClass('completed')
  })
})
