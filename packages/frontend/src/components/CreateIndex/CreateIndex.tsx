import React from 'react'
import {
  Card,
  Button,
} from '@chakra-ui/react'
import ItemSlider from './Slider'
import AddNewAdapterButton from './AddNewAdapterButton'
import { useAppDispatch, useAppSelector } from '@/store/lib/storeHooks'
import { pushAdapter } from '@/store/lib/features/adaptersStore'
import { useFactoryCallback, FactoryMethod } from '@/hooks/useFactory'
import {
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

function CreateIndex() {
  const adapters = useAppSelector(state => state.adapters.adapters)

  const factory = useFactoryCallback()

  const deployDefindex = async () => {
    const adapterAddressPairScVal = adapters.map((adapter, index) => {
      console.log('🚀 ~ deployDefindex ~ adapter.address:', adapter.address);
      return xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("address"),
          val: (new Address(adapter.address)).toScVal(),

        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("index"),
          val: xdr.ScVal.scvU32(index),
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("share"),
          val: xdr.ScVal.scvU32(adapter.value),
        }),
      ]);
    });

    const adapterAddressesScVal = xdr.ScVal.scvVec(adapterAddressPairScVal);

    const createDefindexParams: xdr.ScVal[] = [adapterAddressesScVal];
      console.log('deploying Defindex')
    const result  = await factory(
      FactoryMethod.CREATE_DEFINDEX,
      createDefindexParams,
    )
    console.log('🚀 ~ deployDefindex ~ result:', result);
    
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
        <Button colorScheme="purple" size="lg" mt={4} onClick={deployDefindex}>
          Deploy DeFindex
        </Button>
        <AddNewAdapterButton />
      </Card>
    </>
  )
}

export default CreateIndex