import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import axios from 'axios'

// 实体适配器
const todosAdapter = createEntityAdapter({
  selectId: todo => todo.cid
})
// console.log(todosAdapter.getInitialState())

export const TODOS_FEATURE_KEY = 'todos'

// 异步操作的第一种方式
// export const loadTodos = createAsyncThunk('todos/loadshTodos', (payload, thunkAPI) => {
//   axios
//     .get(payload)
//     .then(response => thunkAPI.dispatch(setTodos(response.data)))
// })
export const loadTodos = createAsyncThunk('todos/loadshTodos', (payload) => 
  axios.get(payload).then(response => response.data)
)

// export const deleteTodoThunk = createAsyncThunk('todos/delete') 

const { reducer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  // initialState: [],
  initialState: todosAdapter.getInitialState(),
  reducers: {
    addTodo: {
      // reducer: (state, action) => {
      //   // state.push(action.payload)
      //   todosAdapter.addOne(state, action.payload)
      // },
      /**
       * 简化实体适配器
       */
      reducer: todosAdapter.addOne,
      prepare: todo => {
        return {
          payload: {
            cid: Math.random(),
            ...todo
          }
        }
      }
    },
    updateTodo: {
      reducer: todosAdapter.updateOne,
      prepare: todo => ({
        payload: {
          id: todo.cid,
          changes: todo
        }
      })
    },
    updateTodos: {
      reducer: todosAdapter.updateMany,
      prepare: payload => ({ payload })
    },
    deleteTodo: {
      reducer: todosAdapter.removeOne,
      prepare: todo => ({
        payload: todo.cid
      })
    },
    deleteTodos: {
      reducer: todosAdapter.removeMany,
      prepare: ids => ({
        payload: ids
      })
    },
    // setTodos: (state, action) => {
    //   // action.payload.forEach(todo => state.push(todo))
    //   todosAdapter.addMany(state, action.payload)
    // }
    /**
     * 简化实体适配器
     */
    setTodos: todosAdapter.addMany
  },
  // 异步操作的第二种方式
  extraReducers: {
    // [loadTodos.fulfilled]: (state, action) => {
    //   // action.payload.forEach(todo => state.push(todo))
    //   todosAdapter.addMany(state, action.payload)
    // }
    /**
     * 简化实体适配器
     */
    [loadTodos.fulfilled]: todosAdapter.addMany
  }
})

const { selectAll } = todosAdapter.getSelectors()
export const selectTodos = createSelector(state => state[TODOS_FEATURE_KEY], selectAll)

export const { addTodo, setTodos, deleteTodo, deleteTodos, updateTodo, updateTodos } = actions
export default TodosReducer
