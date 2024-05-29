import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ChainMetadata } from '@soroban-react/types'
// Define a type for the slice state
interface WalletState {
  address: string;
  selectedChain: ChainMetadata;
}

// Define the initial state using that type
const initialState: WalletState = {
  address: '',
  selectedChain: {
    id: '',
    networkPassphrase: '',
    network: '',
    networkUrl: '',
  }
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    setChain: (state, action: PayloadAction<ChainMetadata>) => {
      state.selectedChain = action.payload
    },
    resetWallet: (state) => {
      state.address = ''
      state.selectedChain = {
        id: '',
        networkPassphrase: '',
        network: '',
        networkUrl: '',
      }
    }
  },
})

export const { setAddress, setChain, resetWallet } = walletSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.wallet.address
export const selectChainMetadata = (state: RootState) => state.wallet.selectedChain

export default walletSlice.reducer