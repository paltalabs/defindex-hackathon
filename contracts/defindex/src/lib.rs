#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol, Vec};

mod adapter;
mod error;
mod storage;

use adapter::DefIndexAdapterClient;
pub use error::ContractError;

use storage::{
    get_adapter, get_share, get_total_adapters, is_initialized, set_adapter, set_initialized,
    set_share, set_total_adapters,
};

fn check_initialized(e: &Env) -> Result<(), ContractError> {
    if is_initialized(e) {
        Ok(())
    } else {
        Err(ContractError::NotInitialized)
    }
}

pub trait AllocatorTrait {
    fn initialize(e: Env, shares: Vec<u32>, adapters: Vec<Address>) -> Result<(), ContractError>;

    fn deposit(e: Env, amount: i128, from: Address) -> Result<(), ContractError>;

    fn print(e: Env) -> u32;
}

#[contract]
pub struct Allocator;

#[contractimpl]
impl Allocator {
    fn initialize(e: Env, shares: Vec<u32>, adapters: Vec<Address>) -> Result<(), ContractError> {
        check_initialized(&e)?;
        set_initialized(&e, true);

        // shares lenght = adapters length
        set_total_adapters(&e, &shares.len());

        for (index, share) in shares.iter().enumerate() {
            set_share(&e, index.try_into().unwrap(), share);
            set_adapter(
                &e,
                index.try_into().unwrap(),
                &adapters.get(index.try_into().unwrap()).unwrap(),
            )
        }
        Ok(())
    }

    fn deposit(e: Env, amount: i128, from: Address) -> Result<(), ContractError> {
        check_initialized(&e)?;

        let total_adapters = get_total_adapters(&e);
        let mut total_amount_used: i128 = 0;

        for i in 0..total_adapters {
            let adapter_share = get_share(&e, i);

            let adapter_address = get_adapter(&e, i);
            let adapter_client = DefIndexAdapterClient::new(&e, &adapter_address);

            // let adapter_amount = if i == (distribution.len() - 1).try_into().unwrap() {
            //     // For the last iteration, swap whatever remains
            //     amount - total_swapped
            // } else {
            //     // Calculate part of the total amount based on distribution parts
            //     amount.checked_mul(dist.parts)
            //         .and_then(|prod| prod.checked_div(total_parts))
            //         .ok_or(AggregatorError::ArithmeticError)?
            // };

            let response = adapter_client.deposit(&amount, &from);
            //should run deposit functions on adapters
        }

        Ok(())
    }

    fn print(e: Env) -> u32 {
        get_total_adapters(&e)
    }
}

mod test;
