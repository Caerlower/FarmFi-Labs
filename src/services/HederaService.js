import {
    Client,
    AccountBalanceQuery,
    Hbar,
    PrivateKey,
    TransferTransaction,
    ContractCallQuery,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractId
  } from '@hashgraph/sdk';
  
  // Load environment variables (optional)
  const myAccountId = process.env.HEDERA_ACCOUNT_ID;
  const myPrivateKey = process.env.HEDERA_PRIVATE_KEY;
  
  // Create Hedera client
  export const createHederaClient = () => {
    if (!myAccountId || !myPrivateKey) {
      throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present");
    }
  
    return Client.forTestnet().setOperator(myAccountId, myPrivateKey); // Use Client.forMainnet() for production
  };
  
  // Get Account Balance
  export const getAccountBalance = async (accountId) => {
    const client = createHederaClient();
  
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
  
      return balance.hbars.toString(); // Return balance in HBAR
    } catch (error) {
      console.error("Error fetching account balance:", error);
      throw error;
    }
  };
  
  // Transfer HBAR
  export const transferHbar = async (fromPrivateKey, toAccountId, amount) => {
    const client = createHederaClient();
  
    try {
      const transferTransaction = new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-amount)) // Sender
        .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount)); // Receiver
  
      const transactionResponse = await transferTransaction.execute(client);
      const receipt = await transactionResponse.getReceipt(client);
  
      return receipt.status.toString(); // Return transaction status
    } catch (error) {
      console.error("Error transferring HBAR:", error);
      throw error;
    }
  };
  
  // Interact with Smart Contracts
  export const callContractFunction = async (contractId, functionName, params = []) => {
    const client = createHederaClient();
  
    try {
      const contractFunctionParams = new ContractFunctionParameters();
      params.forEach(param => {
        if (typeof param === 'string') {
          contractFunctionParams.addString(param);
        } else if (typeof param === 'number') {
          contractFunctionParams.addUint256(param);
        }
      });
  
      const callQuery = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setFunction(functionName, contractFunctionParams)
        .setGas(100000); // Set appropriate gas
  
      const result = await callQuery.execute(client);
      return result.getString(0); // Assuming a string return, adjust accordingly for different return types
    } catch (error) {
      console.error("Error calling contract function:", error);
      throw error;
    }
  };
  
  // Execute Contract Function
  export const executeContractFunction = async (contractId, functionName, params = []) => {
    const client = createHederaClient();
  
    try {
      const contractFunctionParams = new ContractFunctionParameters();
      params.forEach(param => {
        if (typeof param === 'string') {
          contractFunctionParams.addString(param);
        } else if (typeof param === 'number') {
          contractFunctionParams.addUint256(param);
        }
      });
  
      const executeTransaction = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(contractId))
        .setFunction(functionName, contractFunctionParams)
        .setGas(100000); // Set appropriate gas
  
      const transactionResponse = await executeTransaction.execute(client);
      const receipt = await transactionResponse.getReceipt(client);
  
      return receipt.status.toString(); // Return transaction status
    } catch (error) {
      console.error("Error executing contract function:", error);
      throw error;
    }
  };
  