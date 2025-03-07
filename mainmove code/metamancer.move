module hackathon_agent::metamancer {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_token_objects::token::{Self, Token};
    // Mock Move AI Agent Kit import (replace with real kit module)
    use hackathon_agent::ai_oracle; // Placeholder—swap with kit's module

    // Player's game state
    struct PlayerState has key {
        coins: u64,              // Play-to-earn coin balance
        owned_nfts: vector<NFT>, // List of owned NFTs
        last_trade: u64,         // Timestamp of last trade (for cooldown)
    }

    // NFT metadata for tracking
    struct NFT has store, drop {
        collection: String,
        name: String,
        value: u64, // Current market value (simulated)
    }

    // Initialize player state
    public entry fun init_player(account: &signer) {
        let state = PlayerState {
            coins: 1000, // Starting coins
            owned_nfts: vector::empty<NFT>(),
            last_trade: timestamp::now_seconds()
        };
        move_to(account, state);
    }

    // AI Agent: Buy an NFT with AI-driven logic
    public entry fun buy_nft(
        account: &signer,
        creator: address,
        collection: String,
        name: String,
        price: u64
    ) acquires PlayerState {
        let addr = signer::address_of(account);
        let state = borrow_global_mut<PlayerState>(addr);
        let now = timestamp::now_seconds();

        // Cooldown check: 60-second wait between trades
        assert!(now >= state.last_trade + 60, 1);

        // Call Move AI Agent Kit for AI decision
        let ai_threshold = ai_oracle::get_ai_decision(addr, price);
        if (price <= ai_threshold || state.coins > 2000) { // AI decides buy threshold
            coin::transfer<AptosCoin>(account, creator, price);
            token::transfer(account, creator, collection, name, 1);
            let nft = NFT { collection, name, value: price };
            vector::push_back(&mut state.owned_nfts, nft);
            state.coins = state.coins - price;
            state.last_trade = now;
        }
    }

    // AI Agent: Sell an NFT with profit check
    public entry fun sell_nft(
        account: &signer,
        buyer: address,
        collection: String,
        name: String,
        offer_price: u64
    ) acquires PlayerState {
        let addr = signer::address_of(account);
        let state = borrow_global_mut<PlayerState>(addr);
        let now = timestamp::now_seconds();

        // Cooldown check: 60-second wait between trades
        assert!(now >= state.last_trade + 60, 1);

        // Find and remove NFT, check AI-driven sell condition
        let i = 0;
        let len = vector::length(&state.owned_nfts);
        while (i < len) {
            let nft = vector::borrow(&state.owned_nfts, i);
            if (nft.collection == collection && nft.name == name) {
                // AI decides sell threshold
                let ai_sell_threshold = ai_oracle::get_ai_decision(addr, offer_price);
                if (offer_price >= ai_sell_threshold) { // Sell if AI approves
                    token::transfer(account, buyer, collection, name, 1);
                    coin::transfer<AptosCoin>(buyer, addr, offer_price);
                    state.coins = state.coins + offer_price;
                    state.last_trade = now;
                    vector::remove(&mut state.owned_nfts, i);
                };
                break
            };
            i = i + 1;
        }
    }

    // Play-to-earn: Earn coins based on NFT count
    public entry fun earn_rewards(account: &signer) acquires PlayerState {
        let state = borrow_global_mut<PlayerState>(signer::address_of(account));
        let nft_count = vector::length(&state.owned_nfts);
        let reward = nft_count * 50; // 50 coins per NFT owned
        state.coins = state.coins + reward;
    }

    #[view]
    public fun get_state(addr: address): (u64, u64) acquires PlayerState {
        let state = borrow_global<PlayerState>(addr);
        (state.coins, vector::length(&state.owned_nfts))
    }
}
