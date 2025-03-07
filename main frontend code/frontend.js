import React, { useState } from "react";
import {
  AptosClient,
  Types,
} from "aptos";
import {
  useWallet,
  WalletProvider,
  AptosWalletAdapter,
} from "@aptos-labs/wallet-adapter-react";
import { Button, Spin } from "antd";

const MODULE_ADDRESS = "0x<your-account-address>"; // Replace with your deployed address
const MODULE_NAME = "nft_trading_agent";
const DEVNET_NODE = "https://fullnode.devnet.aptoslabs.com/v1";

const client = new AptosClient(DEVNET_NODE);

function App() {
  const { account, signAndSubmitTransaction, connect, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ coins: 0, nftCount: 0 });

  // Fetch player state
  const fetchState = async () => {
    if (!account) return;
    try {
      const [coins, nftCount] = await client.view({
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_state`,
        type_arguments: [],
        arguments: [account.address],
      });
      setState({ coins: Number(coins), nftCount: Number(nftCount) });
    } catch (e) {
      console.error("Error fetching state:", e);
    }
  };

  // Initialize player
  const initPlayer = async () => {
    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::init_player`,
        type_arguments: [],
        arguments: [],
      };
      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      fetchState();
    } catch (e) {
      console.error("Init failed:", e);
    }
    setLoading(false);
  };

  // Buy NFT
  const buyNFT = async () => {
    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::buy_nft`,
        type_arguments: [],
        arguments: [MODULE_ADDRESS, "MyGame", "Sword", "150"], // Creator = self for demo
      };
      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      fetchState();
    } catch (e) {
      console.error("Buy failed:", e);
    }
    setLoading(false);
  };

  // Sell NFT
  const sellNFT = async () => {
    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::sell_nft`,
        type_arguments: [],
        arguments: [MODULE_ADDRESS, "MyGame", "Sword", "350"], // Buyer = self for demo
      };
      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      fetchState();
    } catch (e) {
      console.error("Sell failed:", e);
    }
    setLoading(false);
  };

  // Earn rewards
  const earnRewards = async () => {
    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::earn_rewards`,
        type_arguments: [],
        arguments: [],
      };
      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      fetchState();
    } catch (e) {
      console.error("Earn failed:", e);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>NFT Trading Agent Demo</h1>
      {!account ? (
        <Button type="primary" onClick={() => connect("Petra")}>
          Connect Petra Wallet
        </Button>
      ) : (
        <>
          <p>Address: {account.address}</p>
          <Button onClick={disconnect}>Disconnect</Button>
          <div style={{ margin: "20px 0" }}>
            <Button onClick={initPlayer} disabled={loading}>
              Initialize Player
            </Button>
            <Button onClick={buyNFT} disabled={loading} style={{ marginLeft: 10 }}>
              Buy NFT (150 APT)
            </Button>
            <Button onClick={sellNFT} disabled={loading} style={{ marginLeft: 10 }}>
              Sell NFT (350 APT)
            </Button>
            <Button onClick={earnRewards} disabled={loading} style={{ marginLeft: 10 }}>
              Earn Rewards
            </Button>
          </div>
          {loading && <Spin />}
          <div>
            <p>Coins: {state.coins} APT</p>
            <p>NFTs Owned: {state.nftCount}</p>
          </div>
        </>
      )}
    </div>
  );
}

const AppWithProvider = () => (
  <WalletProvider
    wallets={[new AptosWalletAdapter()]}
    autoConnect={false}
  >
    <App />
  </WalletProvider>
);

export default AppWithProvider;
