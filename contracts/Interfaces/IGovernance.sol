// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IGovernance
 * @dev Interface for the governance system in FarmFi Labs.
 * This interface outlines the required functions for creating proposals, voting, and executing proposals.
 */
interface IGovernance {

    /**
     * @dev Emitted when a new proposal is created.
     * @param proposalId The ID of the proposal.
     * @param proposer The address of the proposer.
     * @param description A short description of the proposal.
     */
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);

    /**
     * @dev Emitted when a vote is cast on a proposal.
     * @param voter The address of the voter.
     * @param proposalId The ID of the proposal being voted on.
     * @param support The support value (1 = for, 0 = against).
     * @param weight The weight of the vote.
     */
    event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight);

    /**
     * @dev Emitted when a proposal is executed.
     * @param proposalId The ID of the executed proposal.
     */
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @dev Function to create a new governance proposal.
     * @param description A short description of the proposal.
     * @return The ID of the newly created proposal.
     */
    function createProposal(string memory description) external returns (uint256);

    /**
     * @dev Function to vote on a specific proposal.
     * @param proposalId The ID of the proposal being voted on.
     * @param support Whether to vote for (1) or against (0) the proposal.
     */
    function vote(uint256 proposalId, uint8 support) external;

    /**
     * @dev Function to execute a proposal after the voting period has ended.
     * Can only be executed if the proposal has passed.
     * @param proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 proposalId) external;

    /**
     * @dev Function to retrieve the current state of a proposal.
     * @param proposalId The ID of the proposal to query.
     * @return A tuple containing the proposal state (forVotes, againstVotes, startBlock, endBlock, executed).
     */
    function getProposalState(uint256 proposalId) external view returns (
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startBlock,
        uint256 endBlock,
        bool executed
    );
}
