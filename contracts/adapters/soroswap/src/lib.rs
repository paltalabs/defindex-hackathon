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
    set_blend_pool_address,
    get_blend_pool_address,
    set_xycloans_pool_address,
    get_xycloans_pool_address,
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
        usdc_amount: i128,
        from: Address,
    ) -> Result<(), AdapterError> {
        check_initialized(&e)?;
        check_nonnegative_amount(usdc_amount)?;
        extend_instance_ttl(&e);
        from.require_auth();

        // let usdc_address = Address::from_string(&String::from_str(&e, "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"));
        // let xlm_address = Address::from_string(&String::from_str(&e, "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"));
        let usdc_address = Address::from_string(&String::from_str(&e, "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVK2BZA"));
        let xlm_address = Address::from_string(&String::from_str(&e, "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"));
        let pair_address = Address::from_string(&String::from_str(&e, "CAAXGP7LTPV4A57LSKDWTSPPJUGFGNU34KQ3FYIPYUUP2SLFGVMTYKYU"));

        // Setting up Soroswap router client
        let soroswap_router_address = get_soroswap_router_address(&e);
        let soroswap_router_client = SoroswapRouterClient::new(&e, &soroswap_router_address);

        let mut path: Vec<Address> = Vec::new(&e);
        path.push_back(usdc_address.clone());
        path.push_back(xlm_address.clone());

        let mut args: Vec<Val> = vec![&e];
        args.push_back(from.into_val(&e));
        args.push_back(pair_address.into_val(&e));
        args.push_back(usdc_amount.into_val(&e));

        e.authorize_as_current_contract(vec![
            &e,
            InvokerContractAuthEntry::Contract( SubContractInvocation {
                context: ContractContext {
                    contract: usdc_address.clone(),
                    fn_name: Symbol::new(&e, "transfer"),
                    args: args.clone(),
                },
                sub_invocations: vec![&e]
            })
        ]);

        // let swap_amount = usdc_amount/2;
        // e.current_contract_address().require_auth();
        let res = soroswap_router_client.swap_exact_tokens_for_tokens(
            &usdc_amount,
            &0,
            &path,
            &from,
            &u64::MAX,
        );

        let total_swapped_amount = res.last().unwrap();
        Ok(())
        // let xlm_balance = TokenClient::new(&e, &xlm_address).balance(&from) - 100_000_000;

        // Xycloans Deposit XLM (WORKING)
        // let xycloans_address = get_xycloans_pool_address(&e);
        // let xycloans_pool_client = XycloansPoolClient::new(&e, &xycloans_address);
        // xycloans_pool_client.deposit(&from, &xlm_balance);


        // // Blend Capital Deposit USDC
        // let blend_pool_address = get_blend_pool_address(&e);
        // let blend_pool_client = BlendPoolClient::new(&e, &blend_pool_address);
        // let blen_result = blend_pool_client.submit(&from, spender, to, requests)

        // Soroswap Deposit XLM/USDC Pair

        // let result = soroswap_router_client.add_liquidity(
        //     &token_a,
        //     &token_b,
        //     &amount_a,
        //     &amount_b,
        //     &amount_a_min,
        //     &amount_b_min,
        //     &e.current_contract_address(),
        //     &deadline,
        // );

    }
}
