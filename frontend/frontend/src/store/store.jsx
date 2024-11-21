import { configureStore } from '@reduxjs/toolkit'
import authreducer  from './authslice'

export const store = configureStore({
  reducer: {
    auth:authreducer
  },
})