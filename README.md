# Metamancer: An Autonomous GameFi Agent on Aptos

Welcome to Metamancer, a cutting-edge, AI-empowered autonomous agent crafted for the Biggest Move AI Hackathon, organized by Metamove and Joule Finance with official backing from the Aptos Foundation. This project exemplifies the fusion of blockchain technology and artificial intelligence, leveraging the Aptos blockchain’s Move programming language and the Move AI Agent Kit to orchestrate a sophisticated GameFi ecosystem. Metamancer transcends traditional NFT trading paradigms by integrating dynamic, AI-driven decision-making into a play-to-earn framework, optimizing asset management and economic interactions within a decentralized gaming environment.

## Project Overview

Metamancer is engineered to operate within the GameFi track of the hackathon, harnessing the power of the Move AI Agent Kit to execute intelligent NFT trading strategies and maximize play-to-earn rewards. The agent autonomously evaluates market conditions, manages a portfolio of non-fungible tokens (NFTs), and accrues value through strategic buy/sell operations—all constrained by a meticulously designed 60-second trade cooldown to emulate realistic gaming dynamics. This implementation not only showcases technical prowess but also explores the potential of AI-augmented economic agents in Web3.

### Technical Architecture

- **Backend**: A Move-based smart contract deployed on the Aptos devnet, utilizing the `AptosFramework` and `AptosTokenObjects` for core blockchain interactions, augmented by the `MoveAIAgentKit` for AI-driven decision-making.
- **Frontend**: A lightweight, performant HTML/CSS/JavaScript interface, interfacing with the Aptos blockchain via the Aptos JavaScript SDK, providing real-time interaction and state visualization.
- **AI Integration**: The Move AI Agent Kit’s oracle module delivers dynamic pricing thresholds, replacing static logic with adaptive, off-chain AI computations seamlessly integrated into on-chain execution.

## Backend Setup

The backend is a Move module named `metamancer`, encapsulating the agent’s logic within the `hackathon_agent` namespace. Below are the prerequisites and steps for compilation and deployment:

### Prerequisites
- **Aptos CLI**: Version 4.x.x or later, installed via precompiled binaries or Cargo (see [Aptos CLI Installation](#aptos-cli-installation)).
- **Git**: For dependency management.
- **Petra Wallet**: Configured for devnet interaction.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/metamancer.git
   cd move-ai-hackathon-gamefi
