import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import adapters from './adapters.json'

export interface Adapter {
  address: string;
  value: number;
  name?: string;
}

interface AdaptersState {
  adapters: Adapter[];
  totalValues?: number;
}


// Define the initial state using that type
const initialState: AdaptersState = {
  adapters: [
  ],
  totalValues: 0
}

//Filtrar adapters por network y retornar array de adapters
export const getDefaultAdapters = (network: string) => {
  const filteredAdapters = adapters.filter(adapter => {
    if(adapter.network === network){
      return adapter.adapters
    }})
    console.log('filteredAdapters', filteredAdapters[0].adapters)
  return filteredAdapters
}



export const adaptersSlice = createSlice({
  name: 'Adapters',
  initialState,
  reducers: {
    pushAdapter: (state, action: PayloadAction<Adapter>) => {
      state.adapters.push(action.payload)
      state.totalValues = state.adapters.reduce((acc, adapter) => acc + adapter.value, 0)
    },
    removeAdapter: (state, action: PayloadAction<Adapter>) => {
      state.adapters = state.adapters.filter(adapter => adapter.address !== action.payload.address)
    },
    setAdapterValue: (state, action: PayloadAction<Adapter>) => {
      state.adapters = state.adapters.map(adapter => {
        if (adapter.address === action.payload.address) {
          return {
            ...adapter,
            value: action.payload.value
          }
        }
        return adapter
      })
      state.totalValues = state.adapters.reduce((acc, adapter) => acc + adapter.value, 0)
    },
    resetAdapterValue: (state, action: PayloadAction<Adapter>) => {
      state.adapters = state.adapters.map(adapter => {
        if (adapter.address === action.payload.address) {
          return {
            ...adapter,
            value: 0
          }
        }
        return adapter
      })
      state.totalValues = state.adapters.reduce((acc, adapter) => acc + adapter.value, 0)
    },
  },
})

export const { pushAdapter, removeAdapter, setAdapterValue, resetAdapterValue } = adaptersSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAdapters = (state: RootState) => state.adapters.adapters
export const selectTotalValues = (state: RootState) => state.adapters.totalValues

export default adaptersSlice.reducer