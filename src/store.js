// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './reducers/todoReducer.js'; // Create a reducer file

const store = configureStore({
  reducer: {
    todos: todoReducer, // Provide your reducer here
  },
});

export default store;
