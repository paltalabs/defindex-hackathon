#![no_std]
use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation}, contract, contractimpl, vec, Address, Env, IntoVal, String, Symbol, Val, Vec};
use soroban_sdk::token::Client as TokenClient;

mod event;
mod storage;
mod soroswap_pair;

use storage::{
    extend_instance_ttl, 
    set_initialized, 
    is_initialized, 
    set_soroswap_pair_address, 
    get_soroswap_pair_address,
};
use soroswap_pair::SoroswapPairClient;
use defindex_adapter_interface::{DefIndexAdapterTrait, AdapterError};

pub fn check_nonnegative_amount(amount: i128) -> Result<(), AdapterError> {
    if amount < 0 {
        Err(AdapterError::NegativeNotAllowed)
    } else {
        Ok(())
    }
}

fn check_initialized(e: &Env) -> Result<(), AdapterError> {
    if is_initialized(e) {
        Ok(())
    } else {
        Err(AdapterError::NotInitialized)
    }
}

#[contract]
struct SoroswapAdapter;

#[contractimpl]
impl DefIndexAdapterTrait for SoroswapAdapter {
    /// Initializes the contract and sets the phoenix multihop address
    fn initialize(
        e: Env,
        protocol_address: Address,
    ) -> Result<(), AdapterError> {
        if is_initialized(&e) {
            return Err(AdapterError::AlreadyInitialized);
        }
    
        set_initialized(&e);
        set_soroswap_pair_address(&e, protocol_address);

        event::initialized(&e, true);
        extend_instance_ttl(&e);
        Ok(())
    }

    fn deposit(
        e: Env,
        amount: i128,
        from: Address,
    ) -> Result<(), AdapterError> {
        from.require_auth();
        check_initialized(&e)?;
        check_nonnegative_amount(amount)?;
        extend_instance_ttl(&e);

        let usdc_address = Address::from_string(&String::from_str(&e, "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA"));
        let xlm_address = Address::from_string(&String::from_str(&e, "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"));

        // Setting up Soroswap router client
        let soroswap_pair_address = get_soroswap_pair_address(&e);
        let soroswap_pair_client = SoroswapPairClient::new(&e, &soroswap_pair_address);

        let swap_amount = amount.checked_div(2).unwrap();

        
        TokenClient::new(&e, &usdc_address).transfer(&from, &soroswap_pair_address, &swap_amount);

        let (reserve_0, reserve_1) = soroswap_pair_client.get_reserves();

        let fee = (swap_amount.checked_mul(3).unwrap()).checked_ceiling_div(1000).unwrap();
        let amount_in_less_fee = swap_amount.checked_sub(fee).unwrap();
        let numerator = amount_in_less_fee.checked_mul(reserve_1).unwrap();
        let denominator = reserve_0.checked_add(amount_in_less_fee).unwrap();
        let amount_1_out = numerator.checked_div(denominator).unwrap();
        let amount_0_out = 0_i128;

        soroswap_pair_client.swap(
            &amount_0_out,
            &amount_1_out,
            &from,
        );

        // TokenClient::new(&e, &usdc_address).transfer(&from, &soroswap_pair_address, &swap_amount);
        // TokenClient::new(&e, &xlm_address).transfer(&from, &soroswap_pair_address, &amount_1_out);

        // soroswap_pair_client.deposit(&from);

        Ok(())
    }
}

pub trait CheckedCeilingDiv {
    fn checked_ceiling_div(self, divisor: i128) -> Option<i128>;
}

impl CheckedCeilingDiv for i128 {
    fn checked_ceiling_div(self, divisor: i128) -> Option<i128> {
        let result = self.checked_div(divisor)?;
        if self % divisor != 0 {
            result.checked_add(1)
        } else {
            Some(result)
        }
    }
}