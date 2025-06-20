"use client";

import { Journal, JournalIDL } from "@journal/anchor";
import { Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import {
  ApolloQueryResult,
  gql,
  useQuery as useApolloQuery,
} from "@apollo/client";
import { createApolloClient } from "../gql/apollo-client";

interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

interface JournalEntryCreated {
  blockHeight: number;
  uuid: string;
  transactionHash: string;
  owner: string;
  title: string;
  message: string;
  entry_id: string;
}

interface JournalEntryUpdated {
  blockHeight: number;
  uuid: string;
  transactionHash: string;
  owner: string;
  message: string;
  entry_id: string;
}

async function getCreatedJournalEntries(): Promise<
  ApolloQueryResult<{ journalEntryCreated: JournalEntryCreated[] }>
> {
  console.log("Fetching created journal entries");
  const client = createApolloClient();
  const query = gql`
    query {
      journalEntryCreated {
        blockHeight
        uuid
        transactionHash
        owner
        title
        message
        entry_id
      }
    }
  `;
  return await client.query({
    query,
  });
}

async function getUpdatedJournalEntries(): Promise<
  ApolloQueryResult<{ journalEntryUpdated: JournalEntryUpdated[] }>
> {
  const client = createApolloClient();
  const query = gql`
    query {
      journalEntryUpdated {
        blockHeight
        uuid
        transactionHash
        owner
        message
        entry_id
      }
    }
  `;
  return await client.query({
    query,
  });
}

async function getCreationAndUpdateForJournalEntry(
  entryId: string
): Promise<[JournalEntryCreated, JournalEntryUpdated[]] | undefined> {
  const createdEntries = (await getCreatedJournalEntries()).data
    .journalEntryCreated;
  const updatedEntries = (await getUpdatedJournalEntries()).data
    .journalEntryUpdated;

  const createdEntry = createdEntries.find(
    (entry) => entry.entry_id === entryId
  );
  const updatedEntriesForId = updatedEntries.filter(
    (entry) => entry.entry_id === entryId
  );

  if (!createdEntry) {
    return undefined;
  }
  return [createdEntry, updatedEntriesForId];
}

export function useJournalProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = new Program<Journal>(JournalIDL, provider);
  const programId = program.programId;

  const accounts = useQuery({
    queryKey: ["journal", "all", { cluster }],
    queryFn: async () => {
      return await getCreatedJournalEntries();
    },
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["journalEntry", "create", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );

      console.log("Creating journal entry at:", journalEntryAddress.toBase58());
      return program.methods
        .createJournalEntry(title, message)
        .accountsPartial({
          journalEntry: journalEntryAddress,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  };
}

export function useJournalProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useJournalProgram();
  const programId = program.programId;

  const accountQuery = useQuery({
    queryKey: ["journal", "fetch", { cluster, account }],
    queryFn: async () =>
      await getCreationAndUpdateForJournalEntry(account.toBase58()),
  });

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["journalEntry", "update", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );

      console.log("Updating journal entry at:", journalEntryAddress.toBase58());
      return program.methods
        .updateJournalEntry(title, message)
        .accountsPartial({
          journalEntry: journalEntryAddress,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      console.log("Journal entry updated successfully:", signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationKey: ["journal", "deleteEntry", { cluster, account }],
    mutationFn: (title: string) =>
      program.methods
        .deleteJournalEntry(title)
        .accountsPartial({ journalEntry: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  };
}
