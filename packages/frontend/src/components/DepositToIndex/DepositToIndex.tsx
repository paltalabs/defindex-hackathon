import { DefindexMethod, useDefindexCallback } from '@/hooks/useDefindex'
import { Button, Card, Input } from '@chakra-ui/react'
import { useSorobanReact } from '@soroban-react/core'
import { Address, nativeToScVal, xdr } from '@stellar/stellar-sdk'
import React, { useState } from 'react'

function DepositToIndex() {
  const [defindex_address, set_defindex_address] = useState<string>(String)
  const [amount, set_amount] = useState<number>(0)

  const {address} = useSorobanReact();
  const defindex = useDefindexCallback()

  const depositDefindex = async () => {
    if (!address || !amount) return;

    const depositParams: xdr.ScVal[] = [
      nativeToScVal((amount * Math.pow(10, 7)), { type: "i128" }),
      new Address(address).toScVal()
    ];

    console.log('deploying Defindex')
    const result = await defindex(
      DefindexMethod.DEPOSIT,
      defindex_address,
      depositParams,
      true,
    )
    console.log('🚀 ~ deployDefindex ~ result:', result);
    return result;
  }

  return (
    <>
      <h2>DepositToIndex</h2>
      <Card variant="outline" px={16} py={16} bgColor="whiteAlpha.100">
        <Input my={4} type="text" onChange={(e) => set_defindex_address(e.target.value)} placeholder='Defindex address' value={defindex_address} />
        <Input my={4} type="text" onChange={(e) => set_amount(Number(e.target.value))} placeholder='Amount' value={amount} />
        <Button my={4} colorScheme='green' onClick={depositDefindex}>Deposit</Button>
      </Card>
    </>
  )
}

export default DepositToIndex