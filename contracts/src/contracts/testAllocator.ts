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
export async function testAllocator(
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

    const allocatorInitParams: xdr.ScVal[] = [adapterAddressesScVal];

    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "initialize",
      allocatorInitParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", scValToNative(result.returnValue));
  } catch (error) {
    console.log("error:", error);
    console.log("Already initialized:");
  }

  const usdc_address =
    "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75";
  const xlm_address =
    "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA";
  const pair_address =
    "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP";

  //TESTNET
  // const usdc_address =
  //   "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA";
  // const xlm_address =
  //   "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
  // const pair_address =
  //   "CAAXGP7LTPV4A57LSKDWTSPPJUGFGNU34KQ3FYIPYUUP2SLFGVMTYKYU";

  console.log("-------------------------------------------------------");
  console.log("Starting Balances");
  console.log("-------------------------------------------------------");
  let usdcUserBalance = await invokeCustomContract(
    usdc_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log(
    "USDC USER BALANCE:",
    scValToNative(usdcUserBalance.result.retval)
  );
  let xlmUserBalance = await invokeCustomContract(
    xlm_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log("XLM USER BALANCE:", scValToNative(xlmUserBalance.result.retval));
  let lpUserBalance = await invokeCustomContract(
    pair_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log("LP USER BALANCE:", scValToNative(lpUserBalance.result.retval));

  // console.log("-------------------------------------------------------");
  // console.log("Testing Print Method");
  // console.log("-------------------------------------------------------");
  // try {
  //   const result = await invokeCustomContract(
  //     addressBook.getContractId(contractKey),
  //     "print",
  //     [],
  //     loadedConfig.admin
  //   );
  //   console.log("🚀 « result:", scValToNative(result.returnValue));
  // } catch (error) {
  //   console.log("🚀 « error:", error);
  // }

  console.log("-------------------------------------------------------");
  console.log("Testing Deposit Method");
  console.log("-------------------------------------------------------");
  try {
    const depositParams = [
      nativeToScVal(100000000, { type: "i128" }),
      new Address(loadedConfig.admin.publicKey()).toScVal(),
    ];

    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "deposit",
      depositParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
  } catch (error) {
    console.log("🚀 « error:", error);
  }

  console.log("-------------------------------------------------------");
  console.log("Ending Balances");
  console.log("-------------------------------------------------------");
  usdcUserBalance = await invokeCustomContract(
    usdc_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log(
    "USDC USER BALANCE:",
    scValToNative(usdcUserBalance.result.retval)
  );
  xlmUserBalance = await invokeCustomContract(
    xlm_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log("XLM USER BALANCE:", scValToNative(xlmUserBalance.result.retval));
  lpUserBalance = await invokeCustomContract(
    pair_address,
    "balance",
    [new Address(loadedConfig.admin.publicKey()).toScVal()],
    loadedConfig.admin,
    true
  );
  console.log("LP USER BALANCE:", scValToNative(lpUserBalance.result.retval));

  console.log("-------------------------------------------------------");
  console.log("Testing Balance Method");
  console.log("-------------------------------------------------------");
  try {
    const balanceParams = [
      new Address(loadedConfig.admin.publicKey()).toScVal(),
    ];

    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "balance",
      balanceParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
    console.log("🚀 « returnValue:", scValToNative(result.returnValue));
  } catch (error) {
    console.log("🚀 « error:", error);
  }

  console.log("-------------------------------------------------------");
  console.log("Testing Withdraw Method");
  console.log("-------------------------------------------------------");
  try {
    const balanceParams = [
      new Address(loadedConfig.admin.publicKey()).toScVal(),
    ];

    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "withdraw",
      balanceParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
    console.log("🚀 « returnValue:", scValToNative(result.returnValue));
  } catch (error) {
    console.log("🚀 « error:", error);
  }

  console.log("-------------------------------------------------------");
  console.log("Testing Balance 2 Method");
  console.log("-------------------------------------------------------");
  try {
    const balanceParams = [
      new Address(loadedConfig.admin.publicKey()).toScVal(),
    ];

    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "balance",
      balanceParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
    console.log("🚀 « returnValue:", scValToNative(result.returnValue));
  } catch (error) {
    console.log("🚀 « error:", error);
  }
}

const network = process.argv[2];
const contractKey = process.argv[3];
const loadedConfig = config(network);
const addressBook = AddressBook.loadFromFile(network, loadedConfig);

try {
  await testAllocator(addressBook, contractKey);
} catch (e) {
  console.error(e);
}
