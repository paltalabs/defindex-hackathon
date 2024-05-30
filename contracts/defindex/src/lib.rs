#![no_std]
use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation},
    contract, contractimpl, vec, Address, Env, IntoVal, String, Symbol, Val, Vec,
};

mod adapter;
mod error;
mod models;
mod storage;

use adapter::DefIndexAdapterClient;
pub use error::ContractError;

use storage::{
    get_adapter, get_share, get_total_adapters, is_initialized, set_adapter, set_initialized,
    set_share, set_total_adapters,
};

use models::AdapterAddressPair;

fn check_initialized(e: &Env) -> Result<(), ContractError> {
    if is_initialized(e) {
        Ok(())
    } else {
        Err(ContractError::NotInitialized)
    }
}

pub trait AllocatorTrait {
    fn initialize(e: Env, adapters: Vec<AdapterAddressPair>) -> Result<(), ContractError>;

    fn deposit(e: Env, amount: i128, from: Address) -> Result<(), ContractError>;

    fn get_adapter_address(e: Env) -> Address;
}

#[contract]
pub struct Allocator;

#[contractimpl]
impl AllocatorTrait for Allocator {
    fn initialize(e: Env, adapters: Vec<AdapterAddressPair>) -> Result<(), ContractError> {
        if is_initialized(&e) {
            return Err(ContractError::AlreadyInitialized);
        }

        // should verify that shares are not more than 100%

        set_initialized(&e, true);
        set_total_adapters(&e, &adapters.len());

        for adapter in adapters.iter() {
            set_share(&e, adapter.index.clone(), adapter.share.clone());
            set_adapter(&e, adapter.index.clone(), &adapter.address);
        }

        Ok(())
    }

    fn deposit(e: Env, amount: i128, from: Address) -> Result<(), ContractError> {
        check_initialized(&e)?;
        from.require_auth();

        let total_adapters = get_total_adapters(&e);
        let mut total_amount_used: i128 = 0;

        for i in 0..total_adapters {
            let adapter_share = get_share(&e, i);

            let adapter_address = get_adapter(&e, i);
            let adapter_client = DefIndexAdapterClient::new(&e, &adapter_address);

            let adapter_amount = if i == (total_adapters - 1) {
                amount - total_amount_used
            } else {
                amount
                    .checked_mul(adapter_share.into())
                    .and_then(|prod| prod.checked_div(100))
                    .ok_or(ContractError::ArithmeticError)?
            };

            let response = adapter_client.deposit(&adapter_amount, &from);
            //should run deposit functions on adapters
        }

        Ok(())
    }

    fn get_adapter_address(e: Env) -> Address {
        get_adapter(&e, 0)
    }
}

mod test;
