#![no_std]

use soroban_sdk::{contractclient, contractspecfn, Address, Env, Vec, String};
pub struct Spec;

mod error;
pub use error::AdapterError;

/// Interface for SoroswapAggregatorProxy
#[contractspecfn(name = "Spec", export = false)]
#[contractclient(name = "DefIndexAdapter")]

pub trait DefIndexAdapterTrait {
    fn initialize(e: Env, protocol_address: Address) -> Result<(), AdapterError>;

    fn deposit(
        env: Env,
        amount: i128,
        from: Address
    ) -> Result<(), AdapterError>;
}
