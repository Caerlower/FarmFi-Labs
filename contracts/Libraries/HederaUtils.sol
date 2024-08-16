// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@hashgraph/sdk/contracts/HederaTokenService.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HederaUtils
 * @dev A utility contract that provides common functions for interacting with the Hedera Token Service (HTS).
 * This contract leverages Hedera's native token services for token management and transaction utilities.
 */
contract HederaUtils is Ownable {
    /**
     * @dev Mints new tokens using Hedera Token Service (HTS).
     * Only the token's treasury or an authorized minter can call this function.
     * @param tokenId The ID of the token to mint.
     * @param amount The amount of tokens to mint.
     */
    function mintHederaTokens(address tokenId, uint64 amount) external onlyOwner {
        int responseCode = HederaTokenService.mintToken(tokenId, amount, new bytes );
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: minting failed");
    }

    /**
     * @dev Burns tokens using Hedera Token Service (HTS).
     * Only the token's treasury or an authorized burner can call this function.
     * @param tokenId The ID of the token to burn.
     * @param amount The amount of tokens to burn.
     */
    function burnHederaTokens(address tokenId, uint64 amount) external onlyOwner {
        int responseCode = HederaTokenService.burnToken(tokenId, amount, new int64 );
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: burning failed");
    }

    /**
     * @dev Transfers Hedera tokens from one account to another.
     * Uses the HTS transfer function.
     * @param tokenId The ID of the token to transfer.
     * @param from The address to transfer tokens from.
     * @param to The address to transfer tokens to.
     * @param amount The amount of tokens to transfer.
     */
    function transferHederaTokens(address tokenId, address from, address to, int64 amount) external onlyOwner {
        HederaTokenService.TokenTransferList;
        transfers);

        transfers[0].transfers[0] = HederaTokenService.AccountAmount(from, -amount);
        transfers[0].transfers[1] = HederaTokenService.AccountAmount(to, amount);

        int responseCode = HederaTokenService.cryptoTransfer(transfers);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: transfer failed");
    }

    /**
     * @dev Associates a Hedera token with an account.
     * Hedera tokens need to be associated with an account before they can be transferred or used.
     * @param tokenId The ID of the token to associate with the account.
     * @param account The account to associate the token with.
     */
    function associateHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.associateToken(account, tokenId);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: association failed");
    }

    /**
     * @dev Dissociates a Hedera token from an account.
     * Dissociating a token removes it from the account and prevents any further interaction with it.
     * @param tokenId The ID of the token to dissociate from the account.
     * @param account The account to dissociate the token from.
     */
    function dissociateHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.dissociateToken(account, tokenId);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: dissociation failed");
    }

    /**
     * @dev Grants KYC (Know Your Customer) approval to an account for a specific token.
     * Some tokens may require KYC approval before they can be transferred.
     * @param tokenId The ID of the token for which to grant KYC.
     * @param account The account to grant KYC approval to.
     */
    function grantKYCHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.grantTokenKyc(tokenId, account);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: KYC grant failed");
    }

    /**
     * @dev Revokes KYC (Know Your Customer) approval from an account for a specific token.
     * @param tokenId The ID of the token for which to revoke KYC.
     * @param account The account to revoke KYC approval from.
     */
    function revokeKYCHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.revokeTokenKyc(tokenId, account);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: KYC revoke failed");
    }

    /**
     * @dev Freezes an account's ability to transfer a specific Hedera token.
     * @param tokenId The ID of the token to freeze.
     * @param account The account to freeze.
     */
    function freezeHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.freezeToken(tokenId, account);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: freeze failed");
    }

    /**
     * @dev Unfreezes an account's ability to transfer a specific Hedera token.
     * @param tokenId The ID of the token to unfreeze.
     * @param account The account to unfreeze.
     */
    function unfreezeHederaToken(address tokenId, address account) external onlyOwner {
        int responseCode = HederaTokenService.unfreezeToken(tokenId, account);
        require(responseCode == HederaTokenService.SUCCESS, "HederaUtils: unfreeze failed");
    }
}
