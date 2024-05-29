#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, String, Symbol};

const TITLE: Symbol = symbol_short!("TITLE");

pub trait AllocatorTrait {
    fn initialize(
        e: Env,
        currency: Address,
        shares: Vec<i128>,
        proxy: Vec<Address>,
    ) -> Result<(), ContractError>;
    fn set_title(e: Env, title: String);
    fn read_title(e: Env) -> String;
}

#[contract]
pub struct Allocator;

#[contractimpl]
impl Allocator {
    fn initialize(
        e: Env,
        currency: Address,
        shares: Vec<i128>,
        proxys: Vec<Address>,
    ) -> Result<(), ContractError> {
        check_initialized(&e)?;
        set_initialized(&e, true);
        set_currency(&e, currency);
        set_shares(&e, shares);
        set_proxys(&e, proxys);
        Ok(())
    }

    pub fn set_title(env: Env, _title: String) {
        env.storage().instance().set(
            &TITLE,
            &"You will never be able to change this title anymmore",
        )
    }

    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
}

mod test;
