// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TokenUtils
 * @dev A utility library for interacting with ERC20 tokens.
 * This contract includes helper functions for common token operations like safe transfers, allowance checks, and balance validation.
 */
library TokenUtils {
    using SafeERC20 for IERC20;

    /**
     * @dev Safely transfers tokens from the caller's account to the specified recipient.
     * Reverts if the transfer fails.
     * @param token The ERC20 token contract.
     * @param to The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function safeTransferTokens(IERC20 token, address to, uint256 amount) internal {
        require(to != address(0), "TokenUtils: transfer to the zero address");
        require(amount > 0, "TokenUtils: transfer amount must be greater than zero");
        
        token.safeTransfer(to, amount);
    }

    /**
     * @dev Safely transfers tokens from one account to another using allowance.
     * Reverts if the transfer fails or if the allowance is insufficient.
     * @param token The ERC20 token contract.
     * @param from The address of the sender.
     * @param to The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 amount) internal {
        require(to != address(0), "TokenUtils: transfer to the zero address");
        require(amount > 0, "TokenUtils: transfer amount must be greater than zero");

        token.safeTransferFrom(from, to, amount);
    }

    /**
     * @dev Checks whether the `spender` has enough allowance from the `owner` to transfer `amount` of tokens.
     * Reverts if the allowance is insufficient.
     * @param token The ERC20 token contract.
     * @param owner The address of the token owner.
     * @param spender The address of the spender.
     * @param amount The amount of tokens to check allowance for.
     */
    function checkAllowance(IERC20 token, address owner, address spender, uint256 amount) internal view {
        uint256 currentAllowance = token.allowance(owner, spender);
        require(currentAllowance >= amount, "TokenUtils: insufficient allowance");
    }

    /**
     * @dev Checks whether an account has at least `amount` tokens.
     * Reverts if the account balance is insufficient.
     * @param token The ERC20 token contract.
     * @param account The address of the account.
     * @param amount The amount of tokens to check.
     */
    function checkBalance(IERC20 token, address account, uint256 amount) internal view {
        uint256 balance = token.balanceOf(account);
        require(balance >= amount, "TokenUtils: insufficient balance");
    }

    /**
     * @dev Increases the allowance for a given spender.
     * @param token The ERC20 token contract.
     * @param spender The address of the spender.
     * @param amount The amount to increase the allowance by.
     */
    function increaseAllowance(IERC20 token, address spender, uint256 amount) internal {
        token.safeIncreaseAllowance(spender, amount);
    }

    /**
     * @dev Decreases the allowance for a given spender.
     * Reverts if the resulting allowance would be negative.
     * @param token The ERC20 token contract.
     * @param spender The address of the spender.
     * @param amount The amount to decrease the allowance by.
     */
    function decreaseAllowance(IERC20 token, address spender, uint256 amount) internal {
        token.safeDecreaseAllowance(spender, amount);
    }
}
