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
pub struct PaginatedSignatureInfoList {
    #[serde(
        rename = "cursor",
        default,
        with = "::serde_with::rust::double_option",
        skip_serializing_if = "Option::is_none"
    )]
    pub cursor: Option<Option<String>>,
    #[serde(rename = "items")]
    pub items: Vec<models::SignatureInfo>,
}

impl PaginatedSignatureInfoList {
    pub fn new(items: Vec<models::SignatureInfo>) -> PaginatedSignatureInfoList {
        PaginatedSignatureInfoList {
            cursor: None,
            items,
        }
    }
}
