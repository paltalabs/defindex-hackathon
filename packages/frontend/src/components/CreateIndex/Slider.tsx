import React from 'react'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Tooltip,
  Grid,
  GridItem
} from '@chakra-ui/react'

function ItemSlider() {
  const [sliderValue, setSliderValue] = React.useState(5)
  const [showTooltip, setShowTooltip] = React.useState(false)

  const setMax = () => {
    console.log('setting 100%')
    setSliderValue(100)
  }

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={2} alignItems={'center'} my={4}>
      <GridItem colSpan={6}>
        <h3>Soroswap</h3>
      </GridItem>
      <GridItem colSpan={6} justifySelf={'end'}>
        <h3>{sliderValue}%</h3>
      </GridItem>
      <GridItem colSpan={12}>
        <Slider
          aria-label='slider-ex-5'
          id='slider'
          defaultValue={sliderValue}
          value={sliderValue}
          min={0}
          max={100}
          colorScheme='green'
          maxWidth={'100%'}
          onChange={(v) => setSliderValue(v)}
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
            label={`${sliderValue}%`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </GridItem>
      <GridItem colSpan={12} justifySelf={'end'}>
        <Button
          onClick={setMax}
          colorScheme={'green'}
        >
          Set Max
        </Button>
      </GridItem>
    </Grid>
  )
}

export default ItemSlider