import { Button, Card, Input } from '@chakra-ui/react'
import React from 'react'

function DepositToIndex() {
  const defaultDefindex = 'CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA'
  const handleDeposit = () => {
    console.log('Deposit')
  }
  const handleInput = (e: any) => {
    console.log(e.target.value)
  }
  return (
    <>
      <h2>DepositToIndex</h2>
      <Card variant="outline" px={16} py={16} bgColor="whiteAlpha.100">
        <Input my={4} type="text" onChange={handleInput} placeholder='Defindex address' value={defaultDefindex} />
        <Input my={4} type="text" onChange={handleInput} placeholder='Amount' value={13} />
        <Button my={4} colorScheme='green' onClick={handleDeposit}>Deposit</Button>
      </Card>
    </>
  )
}

export default DepositToIndex