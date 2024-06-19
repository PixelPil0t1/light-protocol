/*
 * photon-indexer
 *
 * Solana indexer for general compression
 *
 * The version of the OpenAPI document: 0.25.0
 *
 * Generated by: https://openapi-generator.tech
 */

use crate::models;

#[derive(Clone, Default, Debug, PartialEq, Serialize, Deserialize)]
pub struct MerkleProofWithContext {
    /// A 32-byte hash represented as a base58 string.
    #[serde(rename = "hash")]
    pub hash: String,
    #[serde(rename = "leafIndex")]
    pub leaf_index: u32,
    /// A Solana public key represented as a base58 string.
    #[serde(rename = "merkleTree")]
    pub merkle_tree: String,
    #[serde(rename = "proof")]
    pub proof: Vec<String>,
    /// A 32-byte hash represented as a base58 string.
    #[serde(rename = "root")]
    pub root: String,
    #[serde(rename = "rootSeq")]
    pub root_seq: i64,
}

impl MerkleProofWithContext {
    pub fn new(
        hash: String,
        leaf_index: u32,
        merkle_tree: String,
        proof: Vec<String>,
        root: String,
        root_seq: i64,
    ) -> MerkleProofWithContext {
        MerkleProofWithContext {
            hash,
            leaf_index,
            merkle_tree,
            proof,
            root,
            root_seq,
        }
    }
}
