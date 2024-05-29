import React from 'react'
import {
  Card,
  Button,
} from '@chakra-ui/react'
import ItemSlider from './Slider'
function CreateIndex() {
  const [adapters, setAdapters] = React.useState<String[]>(['adapter1']) // [adapter1, adapter2, adapter3
  const addAdapter = () => {
    console.log('adding adapter')
    setAdapters([...adapters, `adapter${adapters.length + 1}`])
  }
  return (
    <>
      <h2>
        Create Index:
      </h2>
      <Card variant="outline" px={16} py={16} bgColor="whiteAlpha.100">
        {adapters.map((adapter, index) => (
          <ItemSlider key={index} />
        ))}
        <Button colorScheme="green" size="lg" mt={4} onClick={addAdapter}>
          Add adapter +
        </Button>
      </Card>
    </>
  )
}

export default CreateIndex