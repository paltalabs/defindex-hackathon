import React from 'react'
import {
  Card,
  Button,
} from '@chakra-ui/react'
import ItemSlider from './Slider'
import { useAppSelector } from '@/store/lib/storeHooks'
import AddNewAdapterButton from './AddNewAdapterButton'
function CreateIndex() {
  const adapters = useAppSelector(state => state.adapters.adapters)
  const totalValues = useAppSelector(state => state.adapters.totalValues)

  return (
    <>
      <h2>
        Create Index:
      </h2>
      <Card variant="outline" px={16} py={16} bgColor="whiteAlpha.100">
        {adapters.map((adapter, index) => (
          <ItemSlider key={index} address={adapter.address} value={adapter.value} />
        ))}
        <div>
          <h2>Total: {totalValues}%</h2>
        </div>
        <AddNewAdapterButton />
      </Card>
    </>
  )
}

export default CreateIndex