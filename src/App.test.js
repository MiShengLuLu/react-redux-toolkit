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

describe('切换所有任务的完成状态', () => {
  test('点击切换所有按钮，所有的任务应该随之改变', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const toggleAll = screen.getByTestId('toggle-all')
    const todoDones = screen.getAllByTestId('todo-done')

    // 全选验证
    userEvent.click(toggleAll)
    todoDones.forEach(t => {
      expect(t.checked).toBeTruthy()
    })

    // 反选验证
    userEvent.click(toggleAll)
    todoDones.forEach(t => {
      expect(t.checked).toBeFalsy()
    })
  })

  test('点击切换所有按钮，所有的任务应该随之改变', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const toggleAll = screen.getByTestId('toggle-all')
    const todoDones = screen.getAllByTestId('todo-done')

    userEvent.click(toggleAll)
    expect(toggleAll.checked).toBeTruthy()

    userEvent.click(todoDones[0])
    expect(toggleAll.checked).toBeFalsy()
  })
})

describe('编辑任务', () => {
  test('双击任务项文本，应该获得编辑状态', async () => {

    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoItems = screen.getAllByTestId('todo-item')
    const todoTexts = screen.getAllByTestId('todo-text')
    const todoEdits = screen.getAllByTestId('todo-edit')

    userEvent.dblClick(todoTexts[0])
    expect(todoItems[0]).toHaveClass('editing')

    fireEvent.blur(todoEdits[0])
    expect(todoItems[0]).not.toHaveClass('editing')
  })

  test('修改任务项文本敲回车之后，应该保存修改以及取消编辑状态', async () => {

    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoItems = screen.getAllByTestId('todo-item')
    const todoTexts = screen.getAllByTestId('todo-text')
    const todoEdits = screen.getAllByTestId('todo-edit')

    userEvent.dblClick(todoTexts[0])
    userEvent.clear(todoEdits[0])
    userEvent.type(todoEdits[0], 'hello world{enter}')

    expect(screen.getByText('hello world')).toBeInTheDocument()
    expect(todoItems[0]).not.toHaveClass('editing')
  })

  test('清空任务项文本，保存编辑应该删除任务项', async () => {

    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoTexts = screen.getAllByTestId('todo-text')
    const todoEdits = screen.getAllByTestId('todo-edit')

    userEvent.dblClick(todoTexts[0])
    userEvent.clear(todoEdits[0])
    userEvent.type(todoEdits[0], '{enter}')

    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems.length).toBe(2)
  })

  test('修改任务项文本按下 ESC 后，应该取消编辑状态以及任务项文本保持不变', async () => {

    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoItems = screen.getAllByTestId('todo-item')
    const todoTexts = screen.getAllByTestId('todo-text')
    const todoEdits = screen.getAllByTestId('todo-edit')

    userEvent.dblClick(todoTexts[0])
    userEvent.type(todoEdits[0], 'abc{esc}')

    expect(screen.queryByText('吃饭')).not.toBeNull()
    expect(todoItems[0]).not.toHaveClass('editing')
  })
})

describe('删除所有已完成任务', () => {
  test('如果所有任务未完成，清除按钮应该不展示，否则展示', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(screen.queryByTestId('clear-completed')).toBeNull()

    userEvent.click(screen.getAllByTestId('todo-done')[0])
    expect(screen.queryByTestId('clear-completed')).not.toBeNull()
  })

  test('点击清除按钮，应该删除所有已完成任务', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const todoDones = screen.getAllByTestId('todo-done')
    userEvent.click(todoDones[0])

    const clearComplted = screen.queryByTestId('clear-completed')
    userEvent.click(clearComplted)

    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems.length).toBe(2)
    expect(screen.getByText('打豆豆')).toBeInTheDocument()
  })
})

describe('展示剩余任务的数量', () => {
  test('展示所有剩余未完成任务数量', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const todoDones = screen.getAllByTestId('todo-done')
    userEvent.click(todoDones[1])
    expect(screen.getByTestId('remaining').textContent).toBe('2')
  })
})

describe('数据筛选', () => {
  test('点击 all 链接，应该展示所有任务，并且 all 链接应该高亮', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoItems = screen.getAllByTestId('todo-item')
    const linkAll = screen.getByTestId('link-all')
    userEvent.click(linkAll)
    expect(todoItems.length).toBe(3)
  })

  test('点击 active 链接，应该展示所有未完成状态任务，并且 active 链接应该高亮', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoDones = screen.getAllByTestId('todo-done')
    userEvent.click(todoDones[1])
    
    const linkActive = screen.getByTestId('link-active')
    userEvent.click(linkActive)

    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems.length).toBe(2)
  })

  test('点击 completed 链接，应该展示所有已完成状态任务，并且 completed 链接应该高亮', async () => {
    await fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const todoDones = screen.getAllByTestId('todo-done')
    userEvent.click(todoDones[0])
    
    const linkCompleted = screen.getByTestId('link-completed')
    userEvent.click(linkCompleted)

    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems.length).toBe(1)
  })
})
