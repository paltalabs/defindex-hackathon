use soroban_sdk::{contracttype, Env, Address, String};

#[derive(Clone)]
#[contracttype]

enum DataKey {
    Initialized,
    SoroswapRouterAddress,
    BlendPoolAddress,
    XycloansPoolAddress
}

const DAY_IN_LEDGERS: u32 = 17280;
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

pub fn extend_instance_ttl(e: &Env) {
    e.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn set_initialized(e: &Env) {
    e.storage().instance().set(&DataKey::Initialized, &true);
}

pub fn is_initialized(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Initialized)
}

// Soroswap Router Address
pub fn set_soroswap_router_address(e: &Env, address: Address) {
    e.storage().instance().set(&DataKey::SoroswapRouterAddress, &address);
}

pub fn get_soroswap_router_address(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::SoroswapRouterAddress).unwrap()
}

// Blend Pool Address
pub fn set_blend_pool_address(e: &Env, address: Address) {
    e.storage().instance().set(&DataKey::BlendPoolAddress, &address);
}

pub fn get_blend_pool_address(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::BlendPoolAddress).unwrap()
}

// Xycloans Pool Address
pub fn set_xycloans_pool_address(e: &Env, address: Address) {
    e.storage().instance().set(&DataKey::XycloansPoolAddress, &address);
}

pub fn get_xycloans_pool_address(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::XycloansPoolAddress).unwrap()
}
