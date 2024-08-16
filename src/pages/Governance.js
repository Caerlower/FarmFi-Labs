import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import governanceAbi from '../abis/Governance.json'; // ABI for the Governance contract
import '../styles/governance.css'; // CSS for styling

const Governance = () => {
  const [account, setAccount] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState('');
  const [loading, setLoading] = useState(true);

  const governanceContractAddress = '0xYourGovernanceContractAddressHere';

  // Fetch proposals from the governance contract
  const fetchProposals = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      // Connect to the governance contract
      const governanceContract = new ethers.Contract(governanceContractAddress, governanceAbi, signer);

      // Fetch proposal count and loop to get proposal details
      const proposalCount = await governanceContract.getProposalCount();
      const proposalsData = [];

      for (let i = 0; i < proposalCount; i++) {
        const proposal = await governanceContract.getProposalState(i);
        const description = await governanceContract.proposalDescriptions(i);
        proposalsData.push({
          id: i,
          description,
          forVotes: proposal.forVotes.toString(),
          againstVotes: proposal.againstVotes.toString(),
          active: proposal.active,
        });
      }

      setProposals(proposalsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setLoading(false);
    }
  };

  // Vote on a proposal
  const voteOnProposal = async (proposalId, support) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const governanceContract = new ethers.Contract(governanceContractAddress, governanceAbi, signer);

      const tx = await governanceContract.vote(proposalId, support);
      await tx.wait();

      alert('Vote submitted successfully!');
      fetchProposals(); // Refresh proposals after voting
    } catch (error) {
      console.error('Error voting on proposal:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  // Create a new proposal
  const createProposal = async () => {
    if (!newProposal) {
      alert('Please enter a proposal description');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const governanceContract = new ethers.Contract(governanceContractAddress, governanceAbi, signer);

      const tx = await governanceContract.createProposal(newProposal);
      await tx.wait();

      alert('Proposal created successfully!');
      setNewProposal(''); // Clear the input field
      fetchProposals(); // Refresh proposals after creation
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="governance">
      <h2>Governance Dashboard</h2>
      {loading ? (
        <p>Loading proposals...</p>
      ) : (
        <div>
          <div className="proposals-list">
            <h3>Active Proposals</h3>
            {proposals.length === 0 ? (
              <p>No proposals available</p>
            ) : (
              proposals.map((proposal, index) => (
                <div className="proposal" key={index}>
                  <h4>Proposal #{proposal.id}</h4>
                  <p><strong>Description:</strong> {proposal.description}</p>
                  <p><strong>For Votes:</strong> {proposal.forVotes}</p>
                  <p><strong>Against Votes:</strong> {proposal.againstVotes}</p>
                  <button
                    className="btn btn-success"
                    onClick={() => voteOnProposal(proposal.id, 1)}
                    disabled={!proposal.active}
                  >
                    Vote For
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => voteOnProposal(proposal.id, 0)}
                    disabled={!proposal.active}
                  >
                    Vote Against
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="create-proposal">
            <h3>Create New Proposal</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Enter proposal description"
              value={newProposal}
              onChange={(e) => setNewProposal(e.target.value)}
            />
            <button className="btn btn-primary" onClick={createProposal}>Submit Proposal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;
