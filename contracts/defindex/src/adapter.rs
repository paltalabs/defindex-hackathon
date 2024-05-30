soroban_sdk::contractimport!(
    file =
        "../soroswap_adapter/target/wasm32-unknown-unknown/release/soroswap_adapter.optimized.wasm"
);
pub type DefIndexAdapterClient<'a> = Client<'a>;
