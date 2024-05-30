import React from 'react'
import {
  Card,
  Button,
} from '@chakra-ui/react'
import ItemSlider from './Slider'
import { useAppDispatch, useAppSelector } from '@/store/lib/storeHooks'
import { pushAdapter } from '@/store/lib/features/adaptersStore'
function CreateIndex() {
  const adapters = useAppSelector(state => state.adapters.adapters)
  const dispatch = useAppDispatch();
  const addAdapter = async () => {
    console.log('adding adapter')
    await dispatch(pushAdapter({ address: `Soroswap adapter ${adapters.length + 1}`, value: 0 }))
  }
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
        <Button colorScheme="green" size="lg" mt={4} onClick={addAdapter}>
          Add adapter +
        </Button>
      </Card>
    </>
  )
}

export default CreateIndex