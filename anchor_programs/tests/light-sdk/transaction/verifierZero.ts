import { verifierProgramZero } from "../idls/verifier_program_zero";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

exports class verifierZero {
  constructor() {
    this.verifierProgram = anchor.workspace.VerifierProgramZero as Program<VerifierProgramZero>;
    this.wtnsGenPath = "./Light_circuits/build/circuits/transactionMasp2_js/transactionMasp2";
    this.zkeyPath = `./Light_circuits/build/circuits/transactionMasp2`

  }
}

export  async function sendTransaction(insert = true){
  if (publicInputsBytes.length == 9) {
      publicInputs = {
       root:         publicInputsBytes[0],
       publicAmount: publicInputsBytes[1],
       extDataHash:  publicInputsBytes[2],
       feeAmount:    publicInputsBytes[3],
       mintPubkey:   publicInputsBytes[4],
       nullifiers:   [publicInputsBytes[5], publicInputsBytes[6]],
       leaves:     [publicInputsBytes[7], publicInputsBytes[8]]
     };
  } else {
    throw `publicInputsBytes.length invalid ${publicInputsBytes.length} != 9`;

  }
    try {
      this.recipientBalancePriorTx = (await getAccount(
        this.provider.connection,
        this.recipient,
        TOKEN_PROGRAM_ID
      )).amount;
    } catch(e) {
        // covers the case of the recipient being a native sol address not a spl token address
        try {
          this.recipientBalancePriorTx = await this.provider.connection.getBalance(this.recipient);
        } catch(e) {

        }
    }
    this.recipientFeeBalancePriorTx = await this.provider.connection.getBalance(this.recipientFee);
    // console.log("recipientBalancePriorTx: ", this.recipientBalancePriorTx);
    // console.log("recipientFeeBalancePriorTx: ", this.recipientFeeBalancePriorTx);
    // console.log("sender_fee: ", this.senderFee);
    this.senderFeeBalancePriorTx = await this.provider.connection.getBalance(this.senderFee);
    this.relayerRecipientAccountBalancePriorLastTx = await this.provider.connection.getBalance(this.relayerRecipient);

    // console.log("signingAddress:     ", this.relayerPubkey)
    // console.log("systemProgram:      ", SystemProgram.programId)
    // console.log("programMerkleTree:  ", this.merkleTreeProgram.programId)
    // console.log("rent:               ", DEFAULT_PROGRAMS.rent)
    // console.log("merkleTree:         ", this.merkleTreePubkey)
    // console.log("preInsertedLeavesInd", this.preInsertedLeavesIndex)
    // console.log("authority:          ", this.signerAuthorityPubkey)
    // console.log("tokenProgram:       ", TOKEN_PROGRAM_ID)
    // console.log("sender:             ", this.sender)
    // console.log("recipient:          ", this.recipient)
    // console.log("senderFee:          ", this.senderFee)
    // console.log("recipientFee:       ", this.recipientFee)
    // console.log("relayerRecipient:   ", this.relayerRecipient)
    // console.log("escrow:             ", this.escrow)
    // console.log("tokenAuthority:     ", this.tokenAuthority)
    // console.log("registeredVerifierPd",this.registeredVerifierPda)
    // console.log("encryptedOutputs len ", this.proofData.encryptedOutputs.length);
    // console.log("this.proofData.encryptedOutputs[0], ", this.proofData.encryptedOutputs);

    const ix = await this.verifierProgram.methods.shieldedTransferInputs(
      Buffer.from(this.proofData.proofBytes),
      Buffer.from(this.proofData.publicInputs.publicAmount),
      this.proofData.publicInputs.nullifiers,
      this.proofData.publicInputs.leaves,
      Buffer.from(this.proofData.publicInputs.feeAmount),
      new anchor.BN(this.root_index.toString()),
      new anchor.BN(this.relayerFee.toString()),
      Buffer.from(this.proofData.encryptedOutputs.slice(0,174)) // remaining bytes can be used once tx sizes increase
    ).accounts(
      {
        signingAddress:     this.relayerPubkey,
        systemProgram:      SystemProgram.programId,
        programMerkleTree:  this.merkleTreeProgram.programId,
        rent:               DEFAULT_PROGRAMS.rent,
        merkleTree:         this.merkleTreePubkey,
        preInsertedLeavesIndex: this.preInsertedLeavesIndex,
        authority:          this.signerAuthorityPubkey,
        tokenProgram:       TOKEN_PROGRAM_ID,
        sender:             this.sender,
        recipient:          this.recipient,
        senderFee:          this.senderFee,
        recipientFee:       this.recipientFee,
        relayerRecipient:   this.relayerRecipient,
        escrow:             this.escrow,
        tokenAuthority:     this.tokenAuthority,
        registeredVerifierPda: this.registeredVerifierPda
      }
    )
    .remainingAccounts([
      { isSigner: false, isWritable: true, pubkey: this.nullifierPdaPubkeys[0]},
      { isSigner: false, isWritable: true, pubkey: this.nullifierPdaPubkeys[1]},
      { isSigner: false, isWritable: true, pubkey: this.leavesPdaPubkeys[0]}
    ])
    .signers([this.payer]).instruction()
    console.log("this.payer: ", this.payer);

    let recentBlockhash = (await this.provider.connection.getRecentBlockhash(("finalized"))).blockhash;
    let txMsg = new TransactionMessage({
          payerKey: this.payer.publicKey,
          instructions: [
            ComputeBudgetProgram.setComputeUnitLimit({units:1_400_000}),
            ix
          ],
          recentBlockhash: recentBlockhash})

    let lookupTableAccount = await this.provider.connection.getAccountInfo(this.lookupTable, "confirmed");

    let unpackedLookupTableAccount = AddressLookupTableAccount.deserialize(lookupTableAccount.data);

    let compiledTx = txMsg.compileToV0Message([{state: unpackedLookupTableAccount}]);
    compiledTx.addressTableLookups[0].accountKey = this.lookupTable

    let transaction = new VersionedTransaction(compiledTx);
    let retries = 3;
    let res
    while (retries > 0) {
      transaction.sign([this.payer])
      recentBlockhash = (await this.provider.connection.getRecentBlockhash(("finalized"))).blockhash;
      transaction.message.recentBlockhash = recentBlockhash;
      let serializedTx = transaction.serialize();

      try {
        console.log("serializedTx: ");

        res = await sendAndConfirmRawTransaction(this.provider.connection, serializedTx,
          {
            commitment: 'finalized',
            preflightCommitment: 'finalized',
          }
        );
        retries = 0;

      } catch (e) {
        retries--;
        if (retries == 0 || e.logs != undefined) {
          console.log(e);
          return e;
        }
      }

    }

    // storing utxos
    this.outputUtxos.map((utxo) => {
      if (utxo.amounts[1] != 0 && utxo.assets[1] != this.feeAsset) {
          this.utxos.push(utxo)
      }
      if (utxo.amounts[0] != 0 && utxo.assets[0].toString() == this.feeAsset.toString()) {
        this.feeUtxos.push(utxo)
      }
    })
    this.inIndices = null;
    // inserting output utxos into merkle tree
    if (insert != "NOINSERT") {
      for (var i = 0; i<this.outputUtxos.length; i++) {
        this.merkleTree.update(this.merkleTreeLeavesIndex, this.outputUtxos[i].getCommitment())
        this.merkleTreeLeavesIndex++;
      }
    }

    return res;
  }
