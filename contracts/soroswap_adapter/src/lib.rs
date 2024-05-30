#![no_std]
use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation}, contract, contractimpl, vec, Address, Env, IntoVal, String, Symbol, Val, Vec};
use soroban_sdk::token::Client as TokenClient;

mod event;
mod storage;
mod soroswap_router;

use storage::{
    extend_instance_ttl, 
    set_initialized, 
    is_initialized, 
    set_soroswap_router_address, 
    get_soroswap_router_address,
};
use soroswap_router::SoroswapRouterClient;
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
        set_soroswap_router_address(&e, protocol_address);

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

        // let usdc_address = Address::from_string(&String::from_str(&e, "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"));
        // let xlm_address = Address::from_string(&String::from_str(&e, "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"));
        let usdc_address = Address::from_string(&String::from_str(&e, "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA"));
        let xlm_address = Address::from_string(&String::from_str(&e, "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"));

        // Setting up Soroswap router client
        let soroswap_router_address = get_soroswap_router_address(&e);
        let soroswap_router_client = SoroswapRouterClient::new(&e, &soroswap_router_address);

        let pair_address = soroswap_router_client.router_pair_for(&usdc_address, &xlm_address);

        let swap_amount = amount.checked_div(2).unwrap();

        let mut path: Vec<Address> = Vec::new(&e);
        path.push_back(usdc_address.clone());
        path.push_back(xlm_address.clone());

        let mut swap_args: Vec<Val> = vec![&e];
        swap_args.push_back(from.into_val(&e));
        swap_args.push_back(pair_address.into_val(&e));
        swap_args.push_back(swap_amount.into_val(&e));

        e.authorize_as_current_contract(vec![
            &e,
            InvokerContractAuthEntry::Contract( SubContractInvocation {
                context: ContractContext {
                    contract: usdc_address.clone(),
                    fn_name: Symbol::new(&e, "transfer"),
                    args: swap_args.clone(),
                },
                sub_invocations: vec![&e]
            })
        ]);


        let swap_result = soroswap_router_client.swap_exact_tokens_for_tokens(
            &swap_amount,
            &0,
            &path,
            &from,
            &u64::MAX,
        );

        let total_swapped_amount = swap_result.last().unwrap();

        // Add liquidity
        let result = soroswap_router_client.add_liquidity(
            &usdc_address,
            &xlm_address,
            &swap_amount,
            &total_swapped_amount,
            &0,
            &0,
            &from,
            &u64::MAX,
        );

        Ok(())
    }
}
