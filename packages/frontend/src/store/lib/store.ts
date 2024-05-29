import { configureStore } from '@reduxjs/toolkit'
import  walletSlice  from './features/walletStore'

export const makeStore = () => {
  return configureStore({
    reducer: {
      wallet: walletSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']