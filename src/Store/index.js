import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import TodosReducer, { TODOS_FEATURE_KEY } from './todo.slice'
import logger from 'redux-logger'

export default configureStore({
  reducer: {
    [TODOS_FEATURE_KEY]: TodosReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
  /**
   * 配置中间件
   * 需先引入 @reduxjs/toolkit 默认的中间件
   */
  middleware: [...getDefaultMiddleware(), logger]
})