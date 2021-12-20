import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Store'
import configureMockStore from 'redux-mock-store'

beforeEach(() => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
})

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

describe('切换单个任务完成状态', () => {
  test('切换任务完成状态按钮，任务的完成样式也跟随改变', () => {

    const todoItem = screen.getByTestId('todo-item')
    const todoDone = screen.getByTestId('todo-done')

    expect(todoDone.checked).toBeFalsy()
    expect(todoItem).not.toHaveClass('completed')
    // expect(todoItem.classList.contains('completed')).toBeFalsy()

    userEvent.click(todoDone)
    expect(todoDone.checked).toBeTruthy()
    expect(todoItem).toHaveClass('completed')
  })
})

describe('删除任务', () => {
  test('点击删除按钮，任务项应该被移除', () => {
    // 找到删除按钮
    const button = screen.getByTestId('destroy')
    // 点击删除按钮
    userEvent.click(button)
    // 断言：
    //   页面中没有删除的任务项了
    expect(screen.queryByText('吃饭')).toBeNull()
  })
})
