import {
    Client,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenAssociateTransaction,
    TokenInfoQuery,
    AccountBalanceQuery,
    TransferTransaction,
    PrivateKey,
    Hbar,
  } from '@hashgraph/sdk';
  
  // Environment variables for operator account
  const myAccountId = process.env.HEDERA_ACCOUNT_ID;
  const myPrivateKey = process.env.HEDERA_PRIVATE_KEY;
  
  // Create Hedera Client
  export const createHederaClient = () => {
    if (!myAccountId || !myPrivateKey) {
      throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present");
    }
  
    return Client.forTestnet().setOperator(myAccountId, myPrivateKey); // Use Client.forMainnet() for production
  };
  
  // Create a Fungible Token
  export const createFungibleToken = async (tokenName, tokenSymbol, initialSupply, decimals) => {
    const client = createHederaClient();
  
    try {
      const tx = await new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(myAccountId)
        .execute(client);
  
      const receipt = await tx.getReceipt(client);
      const tokenId = receipt.tokenId;
  
      console.log(`Token created with ID: ${tokenId}`);
      return tokenId.toString();
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };
  
  // Mint Additional Tokens
  export const mintTokens = async (tokenId, amount) => {
    const client = createHederaClient();
  
    try {
      const tx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .execute(client);
  
      const receipt = await tx.getReceipt(client);
      console.log(`Minted ${amount} tokens to ${tokenId}`);
      return receipt.status.toString();
    } catch (error) {
      console.error("Error minting tokens:", error);
      throw error;
    }
  };
  
  // Associate an Account with a Token
  export const associateToken = async (accountId, privateKey, tokenId) => {
    const client = createHederaClient();
    const key = PrivateKey.fromString(privateKey);
  
    try {
      const tx = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(key);
  
      const receipt = await tx.execute(client).getReceipt(client);
      console.log(`Associated account ${accountId} with token ${tokenId}`);
      return receipt.status.toString();
    } catch (error) {
      console.error("Error associating token:", error);
      throw error;
    }
  };
  
  // Transfer Tokens
  export const transferTokens = async (tokenId, senderId, senderPrivateKey, receiverId, amount) => {
    const client = createHederaClient();
    const senderKey = PrivateKey.fromString(senderPrivateKey);
  
    try {
      const tx = await new TransferTransaction()
        .addTokenTransfer(tokenId, senderId, -amount)
        .addTokenTransfer(tokenId, receiverId, amount)
        .freezeWith(client)
        .sign(senderKey);
  
      const receipt = await tx.execute(client).getReceipt(client);
      console.log(`Transferred ${amount} tokens from ${senderId} to ${receiverId}`);
      return receipt.status.toString();
    } catch (error) {
      console.error("Error transferring tokens:", error);
      throw error;
    }
  };
  
  // Query Token Information
  export const queryTokenInfo = async (tokenId) => {
    const client = createHederaClient();
  
    try {
      const tokenInfo = await new TokenInfoQuery()
        .setTokenId(tokenId)
        .execute(client);
  
      return tokenInfo;
    } catch (error) {
      console.error("Error querying token info:", error);
      throw error;
    }
  };
  
  // Get Account Balance for a Token
  export const getAccountTokenBalance = async (accountId, tokenId) => {
    const client = createHederaClient();
  
    try {
      const balanceQuery = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
  
      const balance = balanceQuery.tokens._map.get(tokenId.toString());
  
      return balance ? balance.toString() : "0";
    } catch (error) {
      console.error("Error querying account balance:", error);
      throw error;
    }
  };
  