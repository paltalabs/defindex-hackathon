import {
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { AddressBook } from "../../utils/address_book.js";
import { invokeCustomContract } from "../../utils/contract.js";
import { config } from "../../utils/env_config.js";

/**
 * Executes a series of test operations on the allocator contract.
 * @param addressBook - The address book containing contract IDs.
 * @param contractKey - The key of the contract in the address book.
 */
export async function testFactory(
  addressBook: AddressBook,
  contractKey: string
) {
  let account = await loadedConfig.horizonRpc.loadAccount(
    loadedConfig.admin.publicKey()
  );
  let balance = account.balances[0].balance;
  console.log("Current Admin account balance:", balance);
  console.log("-------------------------------------------------------");
  console.log(`Initialize ${contractKey} Contract`);
  console.log("-------------------------------------------------------");
  try {
    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "initialize",
      [nativeToScVal(Buffer.from(addressBook.getWasmHash("defindex"), "hex"))],
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
    console.log("🚀 « result:", scValToNative(result.returnValue));
  } catch (error) {
    console.log("error:", error);
    console.log("Already initialized:");
  }
  console.log("-------------------------------------------------------");
  console.log(`Deploying a Defindex Contract`);
  console.log("-------------------------------------------------------");

  const adapterAddressPair = [
    {
      share: 100,
      address: new Address(addressBook.getContractId("soroswap_adapter")),
    },
  ];
  const adapterAddressPairScVal = adapterAddressPair.map((adapter, index) => {
    return xdr.ScVal.scvMap([
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol("address"),
        val: adapter.address.toScVal(),
      }),
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol("index"),
        val: xdr.ScVal.scvU32(index),
      }),
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol("share"),
        val: xdr.ScVal.scvU32(adapter.share),
      }),
    ]);
  });

  const adapterAddressesScVal = xdr.ScVal.scvVec(adapterAddressPairScVal);

  const createDefindexParams: xdr.ScVal[] = [adapterAddressesScVal];


  try {
    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "create_defindex",
      createDefindexParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", scValToNative(result.returnValue));

  } catch (error) {
    console.log("error:", error);
  }
}

const network = process.argv[2];
const contractKey = process.argv[3];
const loadedConfig = config(network);
const addressBook = AddressBook.loadFromFile(network, loadedConfig);

try {
  await testFactory(addressBook, contractKey);
} catch (e) {
  console.error(e);
}
