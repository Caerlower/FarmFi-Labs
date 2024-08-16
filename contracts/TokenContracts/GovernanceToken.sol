// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/governance/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/extensions/ERC20Permit.sol";

/**
 * @title GovernanceToken
 * @dev Governance token contract for FarmFi Labs, allowing holders to vote on platform decisions.
 * This contract follows the ERC20Votes and ERC20Permit standards from OpenZeppelin.
 */
contract GovernanceToken is ERC20, ERC20Votes, Ownable {

    // Event emitted when a proposal is created
    event ProposalCreated(uint256 proposalId, address proposer, string description);

    // Event emitted when a vote is cast
    event VoteCast(address voter, uint256 proposalId, uint8 support, uint256 weight);

    // Event emitted when a proposal is executed
    event ProposalExecuted(uint256 proposalId);

    // Struct to represent a governance proposal
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }

    // Array to store all proposals
    Proposal[] public proposals;

    // Voting duration in blocks (e.g., 1 week)
    uint256 public votingDuration = 40320; // Assuming 1 block per 3 seconds, this is roughly 1 week.

    /**
     * @dev Constructor to initialize the GovernanceToken contract with name, symbol, and initial supply.
     * @param initialSupply The initial supply of governance tokens to mint.
     */
    constructor(uint256 initialSupply) ERC20("FarmFi Governance Token", "FGT") ERC20Permit("FarmFi Governance Token") {
        // Mint the initial supply of governance tokens to the deployer (owner)
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Create a new governance proposal.
     * @param description A description of the proposal.
     */
    function createProposal(string memory description) external returns (uint256) {
        uint256 proposalId = proposals.length;
        proposals.push(Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            startBlock: block.number,
            endBlock: block.number + votingDuration,
            forVotes: 0,
            againstVotes: 0,
            executed: false
        }));
        
        emit ProposalCreated(proposalId, msg.sender, description);

        return proposalId;
    }

    /**
     * @dev Cast a vote for a specific proposal.
     * @param proposalId The ID of the proposal to vote on.
     * @param support Whether the vote is in favor (1) or against (0).
     */
    function vote(uint256 proposalId, uint8 support) external {
        require(proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.startBlock, "Voting has not started yet");
        require(block.number <= proposal.endBlock, "Voting period has ended");

        uint256 weight = getVotes(msg.sender);

        if (support == 1) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit VoteCast(msg.sender, proposalId, support, weight);
    }

    /**
     * @dev Execute a proposal if it has passed.
     * @param proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 proposalId) external {
        require(proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "Voting period has not ended");
        require(!proposal.executed, "Proposal has already been executed");

        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");

        // Execute proposal logic here (e.g., changing protocol parameters)
        // For now, we just mark the proposal as executed.
        proposal.executed = true;

        emit ProposalExecuted(proposalId);
    }

    // Override functions required by Solidity for ERC20Votes

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address from, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(from, amount);
    }
}
