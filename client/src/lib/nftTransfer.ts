import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const INTAKE_WALLET_ADDRESS = import.meta.env.VITE_INTAKE_WALLET || "J6wu13dKzy2PU7qQbmxkjauf8NtysUMfmVSdN36V95Mx";
const INTAKE_WALLET = new PublicKey(INTAKE_WALLET_ADDRESS);

export interface TransferResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export async function createNFTTransferTransaction(
  connection: Connection,
  fromWallet: PublicKey,
  nftMints: string[]
): Promise<Transaction> {
  const transaction = new Transaction();
  const instructions: TransactionInstruction[] = [];

  for (const mintAddress of nftMints) {
    const mint = new PublicKey(mintAddress);
    
    const fromTokenAccount = await getAssociatedTokenAddress(
      mint,
      fromWallet,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mint,
      INTAKE_WALLET,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toAccountInfo = await connection.getAccountInfo(toTokenAccount);
    if (!toAccountInfo) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          toTokenAccount,
          INTAKE_WALLET,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    instructions.push(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromWallet,
        1,
        [],
        TOKEN_PROGRAM_ID
      )
    );
  }

  transaction.add(...instructions);
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromWallet;
  transaction.lastValidBlockHeight = lastValidBlockHeight;

  return transaction;
}

export function getIntakeWallet(): string {
  return INTAKE_WALLET.toBase58();
}
