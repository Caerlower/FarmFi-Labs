// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IToken
 * @dev Interface for FarmFi Labs tokens including ERC20-compatible functions and custom functionalities such as minting, burning, and staking.
 */
interface IToken {
    
    /**
     * @dev Emitted when `value` tokens are transferred from one account (`from`) to another (`to`).
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Emitted when `amount` of tokens are minted to the `account`.
     */
    event Mint(address indexed account, uint256 amount);

    /**
     * @dev Emitted when `amount` of tokens are burned from the `account`.
     */
    event Burn(address indexed account, uint256 amount);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Mints `amount` tokens to the `account`.
     * Can only be called by the owner or authorized minters.
     *
     * Emits a {Mint} event and a {Transfer} event from the zero address.
     */
    function mint(address account, uint256 amount) external;

    /**
     * @dev Burns `amount` tokens from the `account`.
     * Can only be called by the owner or authorized burners.
     *
     * Emits a {Burn} event and a {Transfer} event to the zero address.
     */
    function burn(address account, uint256 amount) external;

    /**
     * @dev Stakes a specific `amount` of tokens from the caller.
     *
     * Emits a {Transfer} event from the caller to the staking contract.
     */
    function stake(uint256 amount) external;

    /**
     * @dev Unstakes a specific `amount` of tokens from the staking contract.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event from the staking contract to the caller.
     */
    function unstake(uint256 amount) external returns (bool);
}
