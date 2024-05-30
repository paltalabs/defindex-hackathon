import { Address, nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import { AddressBook } from "../../utils/address_book.js";
import { invokeCustomContract } from "../../utils/contract.js";
import { config } from "../../utils/env_config.js";

export async function liquidityTimelock(
  addressBook: AddressBook,
  contractKey: string
) {
  let account = await loadedConfig.horizonRpc.loadAccount(
    loadedConfig.admin.publicKey()
  );
  let balance = account.balances.filter((item) => item.asset_type == "native");
  console.log("Current Admin account balance:", balance[0].balance);

  const soroswap_pair =
    "CAAXGP7LTPV4A57LSKDWTSPPJUGFGNU34KQ3FYIPYUUP2SLFGVMTYKYU";
  const usdc_address =
    "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA";
  const xlm_address =
    "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

  console.log("-------------------------------------------------------");
  console.log("Initialize Soroswap Adapter Contract");
  console.log("-------------------------------------------------------");
  try {
    const initParams = [new Address(soroswap_pair).toScVal()];
    const result = await invokeCustomContract(
      addressBook.getContractId(contractKey),
      "initialize",
      initParams,
      loadedConfig.admin
    );
    console.log("🚀 « result:", result);
  } catch (error) {
    console.log("🚀 « error:", error);
    console.log("Already initialized:");
  }

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

  console.log("-------------------------------------------------------");
  console.log("Testing Deposit Method");
  console.log("-------------------------------------------------------");
  try {
    const depositParams = [
      nativeToScVal(1000000000, { type: "i128" }),
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
}

const network = process.argv[2];
const contractKey = process.argv[3];
const loadedConfig = config(network);
const addressBook = AddressBook.loadFromFile(network, loadedConfig);

try {
  await liquidityTimelock(addressBook, contractKey);
} catch (e) {
  console.error(e);
}
