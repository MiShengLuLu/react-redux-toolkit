import { render, screen } from '@testing-library/react'
import TodoFooter from '../Footer'

describe('TodoFooter', () => {
  test('render footer component', () => {
    render(<TodoFooter />)
    console.log(document.body.innerHTML)
  })
})
