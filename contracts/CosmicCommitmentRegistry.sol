// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * Cosmic Commitment Registry (宇宙承諾記錄)
 *
 * Cryptographic anchoring for the Plum Blossom Computer.
 * Stores tamper-evident commitments of deterministic cosmological computation.
 *
 * The computation is fully reproducible off-chain:
 *   1. Deterministic cosmology (VSOP87, hexagrams, pillars, macro cycles)
 *   2. Symbolic mapping (element correspondences, operational scales)
 *   3. Reasoning synthesis (bias signals from rule-based graph)
 *
 * This contract stores hashes + readable signal data so anyone can:
 *   - Verify a commitment was made at a specific time
 *   - Read the bias signal on-chain (for downstream DeFi integration)
 *   - Recompute off-chain and verify hashes match
 *
 * Ancient oracles relied on ritual to prevent revision.
 * This one relies on cryptography.
 */
contract CosmicCommitmentRegistry {
    struct Commitment {
        bytes32 cosmologyHash;       // keccak256 of deterministic cosmology result
        bytes32 reasoningHash;       // keccak256 of reasoning synthesis
        uint8 bias;                  // 0=neutral, 1=act, 2=observe, 3=avoid
        uint8 confidence;            // 0-100
        uint8 hexagramNumber;        // 1-64 (King Wen sequence)
        uint8 movingLine;            // 1-6
        uint256 computationTimestamp;// unix timestamp of the cosmology input
        uint256 commitTimestamp;     // block.timestamp when committed
        address committer;
    }

    Commitment[] public commitments;

    event CommitmentMade(
        uint256 indexed id,
        address indexed committer,
        bytes32 cosmologyHash,
        bytes32 reasoningHash,
        uint8 bias,
        uint8 confidence,
        uint8 hexagramNumber,
        uint256 computationTimestamp
    );

    /**
     * Commit a Plum Blossom Computer result on-chain.
     * Anyone can commit — provenance is tracked by msg.sender.
     */
    function commit(
        bytes32 cosmologyHash,
        bytes32 reasoningHash,
        uint8 bias,
        uint8 confidence,
        uint8 hexagramNumber,
        uint8 movingLine,
        uint256 computationTimestamp
    ) external returns (uint256 id) {
        require(bias <= 3, "Invalid bias");
        require(confidence <= 100, "Invalid confidence");
        require(hexagramNumber >= 1 && hexagramNumber <= 64, "Invalid hexagram");
        require(movingLine >= 1 && movingLine <= 6, "Invalid moving line");

        id = commitments.length;
        commitments.push(Commitment({
            cosmologyHash: cosmologyHash,
            reasoningHash: reasoningHash,
            bias: bias,
            confidence: confidence,
            hexagramNumber: hexagramNumber,
            movingLine: movingLine,
            computationTimestamp: computationTimestamp,
            commitTimestamp: block.timestamp,
            committer: msg.sender
        }));

        emit CommitmentMade(
            id,
            msg.sender,
            cosmologyHash,
            reasoningHash,
            bias,
            confidence,
            hexagramNumber,
            computationTimestamp
        );
    }

    /** Get the latest commitment */
    function getLatestCommitment() external view returns (
        uint256 id,
        bytes32 cosmologyHash,
        bytes32 reasoningHash,
        uint8 bias,
        uint8 confidence,
        uint8 hexagramNumber,
        uint8 movingLine,
        uint256 computationTimestamp,
        uint256 commitTimestamp,
        address committer
    ) {
        require(commitments.length > 0, "No commitments yet");
        id = commitments.length - 1;
        Commitment storage c = commitments[id];
        return (
            id,
            c.cosmologyHash,
            c.reasoningHash,
            c.bias,
            c.confidence,
            c.hexagramNumber,
            c.movingLine,
            c.computationTimestamp,
            c.commitTimestamp,
            c.committer
        );
    }

    /** Total number of commitments */
    function commitmentCount() external view returns (uint256) {
        return commitments.length;
    }

    /** Verify a commitment matches expected hashes */
    function verify(
        uint256 id,
        bytes32 expectedCosmologyHash,
        bytes32 expectedReasoningHash
    ) external view returns (bool) {
        require(id < commitments.length, "Invalid commitment ID");
        Commitment storage c = commitments[id];
        return c.cosmologyHash == expectedCosmologyHash
            && c.reasoningHash == expectedReasoningHash;
    }
}
