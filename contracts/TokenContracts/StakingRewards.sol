// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StakingRewards
 * @dev A contract that allows users to stake tokens and earn rewards over time.
 * Supports staking of GovernanceTokens or Cryptograins and rewards distribution.
 */
contract StakingRewards is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;   // The token being staked (e.g., Cryptograin or GovernanceToken)
    IERC20 public rewardsToken;   // The token distributed as a reward (e.g., GovernanceToken or another reward token)
    
    uint256 public rewardRate;    // Rewards per block for staking
    uint256 public lastUpdateBlock; // Last block when the rewards were updated
    uint256 public rewardPerTokenStored; // Accumulated rewards per token

    mapping(address => uint256) public userRewards;   // User's earned rewards
    mapping(address => uint256) public userStakedBalance; // User's staked balance
    mapping(address => uint256) public userRewardPerTokenPaid; // Tracks the rewards paid to the user

    uint256 public totalStaked; // Total staked tokens

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    /**
     * @dev Constructor to initialize the staking and reward tokens.
     * @param _stakingToken Address of the token that will be staked.
     * @param _rewardsToken Address of the token that will be distributed as rewards.
     * @param _rewardRate Rate of rewards per block.
     */
    constructor(address _stakingToken, address _rewardsToken, uint256 _rewardRate) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        rewardRate = _rewardRate;
        lastUpdateBlock = block.number;
    }

    /**
     * @dev Modifier to update the rewards before any action.
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateBlock = block.number;

        if (account != address(0)) {
            userRewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /**
     * @dev Stake tokens to participate in staking and earn rewards.
     * @param amount The amount of tokens to stake.
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        totalStaked += amount;
        userStakedBalance[msg.sender] += amount;
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraw staked tokens from the contract.
     * @param amount The amount of tokens to withdraw.
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(userStakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        totalStaked -= amount;
        userStakedBalance[msg.sender] -= amount;

        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Claim earned rewards from staking.
     */
    function claimReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = userRewards[msg.sender];
        if (reward > 0) {
            userRewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);

            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @dev Withdraw staked tokens and claim rewards at the same time.
     */
    function exit() external {
        withdraw(userStakedBalance[msg.sender]);
        claimReward();
    }

    /**
     * @dev Calculate the reward per token based on the reward rate and the number of blocks since the last update.
     * @return The reward per token value.
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + ((block.number - lastUpdateBlock) * rewardRate * 1e18 / totalStaked);
    }

    /**
     * @dev Calculate the earned rewards for an account.
     * @param account The address of the account to calculate rewards for.
     * @return The amount of earned rewards.
     */
    function earned(address account) public view returns (uint256) {
        return (userStakedBalance[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18) + userRewards[account];
    }

    /**
     * @dev Update the reward rate. Only the owner can call this function.
     * @param newRewardRate The new reward rate.
     */
    function updateRewardRate(uint256 newRewardRate) external onlyOwner {
        rewardRate = newRewardRate;
    }

    /**
     * @dev Recover any ERC20 tokens sent to this contract by mistake.
     * @param token The address of the token to recover.
     * @param amount The amount of tokens to recover.
     */
    function recoverERC20(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
