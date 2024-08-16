// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the OpenZeppelin ERC20 contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Cryptograin
 * @dev ERC20 Token representing grain reserves, with minting and burning controlled by the PoGR system.
 */
contract Cryptograin is ERC20, Ownable, Pausable {
    // Mapping to store proof of grain reserves (PoGR) for each token holder
    mapping(address => uint256) private grainReserves;

    // Event emitted when new tokens are minted
    event TokensMinted(address indexed account, uint256 amount, uint256 grainReserve);

    // Event emitted when tokens are burned
    event TokensBurned(address indexed account, uint256 amount, uint256 grainReleased);

    // Constructor to initialize the Cryptograin token with a name and symbol
    constructor() ERC20("Cryptograin", "CGT") {
        // Initial minting or other setup logic can be added here if necessary
    }

    /**
     * @dev Mint tokens based on the proof of grain reserve (PoGR).
     * Only the owner (PoGR certifier) can mint tokens.
     * @param account The account to receive the minted tokens.
     * @param amount The amount of tokens to mint.
     * @param grainReserve The corresponding amount of grain reserve backing these tokens.
     */
    function mint(address account, uint256 amount, uint256 grainReserve) external onlyOwner whenNotPaused {
        // Mint new tokens
        _mint(account, amount);
        // Store the grain reserve for the account
        grainReserves[account] += grainReserve;

        emit TokensMinted(account, amount, grainReserve);
    }

    /**
     * @dev Burn tokens and release the corresponding grain reserve.
     * Only the owner (PoGR certifier) can burn tokens.
     * @param account The account whose tokens will be burned.
     * @param amount The amount of tokens to burn.
     * @param grainReleased The amount of grain released from the reserve.
     */
    function burn(address account, uint256 amount, uint256 grainReleased) external onlyOwner whenNotPaused {
        // Burn the specified amount of tokens
        _burn(account, amount);
        // Deduct the corresponding grain reserve
        require(grainReserves[account] >= grainReleased, "Insufficient grain reserve");
        grainReserves[account] -= grainReleased;

        emit TokensBurned(account, amount, grainReleased);
    }

    /**
     * @dev Get the grain reserve associated with an account.
     * @param account The account to check.
     * @return The amount of grain reserve backing the account's tokens.
     */
    function getGrainReserve(address account) external view returns (uint256) {
        return grainReserves[account];
    }

    /**
     * @dev Pause the contract, disabling minting, burning, and transfers.
     * Only the owner can pause the contract.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract, enabling minting, burning, and transfers.
     * Only the owner can unpause the contract.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Override ERC20 transfer function to check for pauses
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
