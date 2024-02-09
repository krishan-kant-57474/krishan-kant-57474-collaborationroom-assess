// todoReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataSourcee: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setDataSourcee: (state, action) => {
      state.dataSourcee = action.payload;
    },
    addTodo: (state, action) => {
      state.dataSourcee.unshift(action.payload);
    },
    deleteTodo: (state, action) => {
      state.dataSourcee = state.dataSourcee.filter(
        (todo) => todo.id !== action.payload.id
      );
    },
    updateTodo: (state, action) => {
      const index = state.dataSourcee.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.dataSourcee[index] = action.payload;
    },
  },
});

export const { setDataSourcee, addTodo, deleteTodo, updateTodo } =
  todoSlice.actions;
export default todoSlice.reducer;
