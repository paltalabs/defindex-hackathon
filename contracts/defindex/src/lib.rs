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
impl AllocatorTrait for Allocator {
    fn initialize(e: Env, shares: Vec<u32>, adapters: Vec<Address>) -> Result<(), ContractError> {
        // Ensure shares and adapters have the same length
        if shares.len() != adapters.len() {
            return Err(ContractError::LengthMismatch);
        }
    
        set_initialized(&e, true);
        set_total_adapters(&e, &shares.len());
    
        let total_adapters = shares.len().clone();
        let zero: u32 = 0;
        let share = shares.get(zero);
        
        // for i in 0..total_adapters {
            // let share = shares.get(i.into());
            // set_share(&e, i.try_into().unwrap(), share);
            // let adapter = adapters.get(i.try_into().unwrap()).unwrap();
            // set_adapter(&e, i, &adapter);   
        // }

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


            let adapter_amount = if i == (total_adapters - 1) {
                amount - total_amount_used
            } else {
                amount.checked_mul(adapter_share.into())
                    .and_then(|prod| prod.checked_div(100))
                    .ok_or(ContractError::ArithmeticError)?
            };

            let response = adapter_client.deposit(&adapter_amount, &from);
            //should run deposit functions on adapters
        }

        Ok(())
    }

    fn print(e: Env) -> u32 {
        get_total_adapters(&e)
    }
}

mod test;
