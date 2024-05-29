use soroban_sdk::{contracttype, Address, Env, String};

#[derive(Clone)]
#[contracttype]

enum DataKey {
    Initialized,
    Currency,
    SharesNIndexed(u32),
    Shares(i128),
    Proxys(Address),
}
