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
pub struct MerkleContextWithNewAddressProof {
    /// A Solana public key represented as a base58 string.
    #[serde(rename = "address")]
    pub address: String,
    /// A Solana public key represented as a base58 string.
    #[serde(rename = "higherRangeAddress")]
    pub higher_range_address: String,
    #[serde(rename = "leafIndex")]
    pub leaf_index: i32,
    #[serde(rename = "lowElementLeafIndex")]
    pub low_element_leaf_index: i32,
    /// A Solana public key represented as a base58 string.
    #[serde(rename = "lowerRangeAddress")]
    pub lower_range_address: String,
    /// A Solana public key represented as a base58 string.
    #[serde(rename = "merkleTree")]
    pub merkle_tree: String,
    #[serde(rename = "proof")]
    pub proof: Vec<String>,
    /// A 32-byte hash represented as a base58 string.
    #[serde(rename = "root")]
    pub root: String,
    #[serde(rename = "rootSeq")]
    pub root_seq: i32,
}

impl MerkleContextWithNewAddressProof {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        address: String,
        higher_range_address: String,
        leaf_index: i32,
        low_element_leaf_index: i32,
        lower_range_address: String,
        merkle_tree: String,
        proof: Vec<String>,
        root: String,
        root_seq: i32,
    ) -> MerkleContextWithNewAddressProof {
        MerkleContextWithNewAddressProof {
            address,
            higher_range_address,
            leaf_index,
            low_element_leaf_index,
            lower_range_address,
            merkle_tree,
            proof,
            root,
            root_seq,
        }
    }
}
