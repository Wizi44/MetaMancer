const MODULE_ADDRESS = "0xf789e12a7249e0f93c3770d4cc4ec1d3ede34d02b8247d7003e0d7ebe8d93f95"; // Replace with your deployed address
const MODULE_NAME = "metamancer";
const DEVNET_NODE = "https://fullnode.devnet.aptoslabs.com/v1";

const client = new AptosClient(DEVNET_NODE);
let account = null;

const connectWalletBtn = document.getElementById("connect-wallet");
const disconnectWalletBtn = document.getElementById("disconnect-wallet");
const addressDisplay = document.getElementById("address");
const actionsDiv = document.getElementById("actions");
const initBtn = document.getElementById("init-player");
const buyBtn = document.getElementById("buy-nft");
const sellBtn = document.getElementById("sell-nft");
const earnBtn = document.getElementById("earn-rewards");
const coinsDisplay = document.getElementById("coins");
const nftCountDisplay = document.getElementById("nft-count");
const loadingDiv = document.getElementById("loading");

async function connectWallet() {
    if (!window.aptos) {
        alert("Please install Petra Wallet extension!");
        return;
    }
    try {
        const response = await window.aptos.connect();
        account = response;
        addressDisplay.textContent = account.address;
        connectWalletBtn.style.display = "none";
        disconnectWalletBtn.style.display = "inline";
        actionsDiv.style.display = "block";
        await fetchState();
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

async function disconnectWallet() {
    if (window.aptos) {
        await window.aptos.disconnect();
    }
    account = null;
    addressDisplay.textContent = "Not connected";
    connectWalletBtn.style.display = "inline";
    disconnectWalletBtn.style.display = "none";
    actionsDiv.style.display = "none";
    coinsDisplay.textContent = "0";
    nftCountDisplay.textContent = "0";
}

async function fetchState() {
    if (!account) return;
    try {
        const [coins, nftCount] = await client.view({
            function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_state`,
            type_arguments: [],
            arguments: [account.address],
        });
        coinsDisplay.textContent = coins;
        nftCountDisplay.textContent = nftCount;
    } catch (e) {
        console.error("Fetch state failed:", e);
    }
}

async function submitTransaction(functionName, args) {
    if (!account) return;
    loadingDiv.style.display = "block";
    try {
        const payload = {
            type: "entry_function_payload",
            function: `${MODULE_ADDRESS}::${MODULE_NAME}::${functionName}`,
            type_arguments: [],
            arguments: args,
        };
        const response = await window.aptos.signAndSubmitTransaction(payload);
        await client.waitForTransaction(response.hash);
        await fetchState();
    } catch (e) {
        console.error(`${functionName} failed:`, e);
    }
    loadingDiv.style.display = "none";
}

connectWalletBtn.addEventListener("click", connectWallet);
disconnectWalletBtn.addEventListener("click", disconnectWallet);
initBtn.addEventListener("click", () => submitTransaction("init_player", []));
buyBtn.addEventListener("click", () => submitTransaction("buy_nft", [MODULE_ADDRESS, "MyGame", "Sword", "150"]));
sellBtn.addEventListener("click", () => submitTransaction("sell_nft", [MODULE_ADDRESS, "MyGame", "Sword", "350"]));
earnBtn.addEventListener("click", () => submitTransaction("earn_rewards", []));
