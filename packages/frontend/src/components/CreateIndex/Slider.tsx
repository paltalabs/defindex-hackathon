import React from 'react'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Tooltip,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '@/store/lib/storeHooks'
import { selectTotalValues, setAdapterValue } from '@/store/lib/features/adaptersStore'
import { set } from 'react-hook-form'


function ItemSlider({
  address = 'Soroswap Address',
  value = 0,
}: {
  address: string,
  value: number,
}) {
  const dispatch = useAppDispatch()
  const [showTooltip, setShowTooltip] = React.useState(false)

  const totalValues = useAppSelector(state => state.adapters.totalValues)
  const [inputValue, setInputValue] = React.useState(value)

  const setVal = (val: number) => {
    const total = totalValues! - value + val
    if (total <= 100) {
      setInputValue(val)
      dispatch(setAdapterValue({ address, value: val }))
    } else {
      setMax(val)
    }
  }

  const setMax = async (val: number) => {
    const rest = 100 - totalValues!
    const newVal = value + rest
    setInputValue(newVal)
    dispatch(setAdapterValue({ address, value: newVal }))
  }

  const handleValueInput = (e: any) => {
    const val = parseInt(e.target.value)
    console.log(e.target.value)
    const parsedValue = parseInt(e.target.value.slice(1))
    //Si el valor es menor a 100 se actualiza
    if (val <= 100) {
      setVal(val)
    }
    //Si el valor es mayor a 100 se actualiza al maximo
    else if (val > 100) {
      setVal(val)
    }
    //Si el valor no es un numero se actualiza al valor actual
    else if (e.target.value == '') {
      setVal(parsedValue)
    }
    //Si el comienza con 0 se actualiza al valor menos el 0
    else if (value == 0) {
      setVal(parsedValue)
    }

  }

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={2} alignItems={'center'} my={4}>
      <GridItem colSpan={6}>
        <h3>{address}</h3>
      </GridItem>
      <GridItem colSpan={1} justifySelf={'end'} alignContent={'end'}>
        <InputGroup >
          <Input type='number' min={0} placeholder={value.toString()} onInput={(e) => { handleValueInput(e) }} value={inputValue} />
          <InputRightAddon>%</InputRightAddon>
        </InputGroup>
      </GridItem>
      <GridItem colSpan={12}>
        <Slider
          aria-label='slider-ex-5'
          id='slider'
          defaultValue={value}
          value={value}
          min={0}
          max={100}
          colorScheme='green'
          maxWidth={'100%'}
          onChange={(v) => { setVal(v) }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onChangeEnd={(val) => console.log(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg='green.500'
            color='white'
            placement='top'
            isOpen={showTooltip}
            label={`${value}%`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </GridItem>
      <GridItem colSpan={12} justifySelf={'end'}>
        <Button
          onClick={() => { setMax(value) }}
          colorScheme={'green'}
        >
          Set Max
        </Button>
      </GridItem>
    </Grid>
  )
}

export default ItemSlider