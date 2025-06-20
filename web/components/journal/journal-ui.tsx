"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
// import { useMemo } from 'react';
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useJournalProgram,
  useJournalProgramAccount,
} from "./journal-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function JournalCreate() {
  const { createEntry } = useJournalProgram();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="textarea textarea-bordered w-full max-w-xs"
      />
      <br></br>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
      >
        Create Journal Entry {createEntry.isPending && "..."}
      </button>
    </div>
  );
}

export function JournalList() {
  const { accounts, getProgramAccount } = useJournalProgram();

  console.log("JournalList accounts:", accounts.data);
  console.log("JournalList getProgramAccount:", getProgramAccount.data);
  console.log(
    "JournalList accounts.data?.data:",
    accounts.data?.data.journalEntryCreated
  );

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.data.journalEntryCreated.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.data?.data.journalEntryCreated.map(
            (journalCreatedEntry) => (
              <JournalCard
                key={journalCreatedEntry.entry_id}
                account={new PublicKey(journalCreatedEntry.entry_id)}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function JournalCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useJournalProgramAccount({
    account,
  });
  const { publicKey } = useWallet();
  const [message, setMessage] = useState("");
  console.log("JournalCard accountQuery:", accountQuery.data);
  const entryData = accountQuery.data;
  if (!entryData) {
    return <p>Loading...</p>;
  }
  const [journalEntryCreation, journalEntryUpdates] = entryData;
  // get updates from most recent to oldest
  let tmpMessageHistory = journalEntryUpdates
    .sort((a, b) => b.blockHeight - a.blockHeight)
    .map((update) => update.message);
  console.log("tmpMessageHistory:", tmpMessageHistory);
  const { title, message: initialEntryMessage } = journalEntryCreation;
  tmpMessageHistory.push(initialEntryMessage);
  const [currentMessage, messageHistory] = [
    tmpMessageHistory[0],
    tmpMessageHistory.slice(1).reverse(),
  ];

  const isFormValid = message.trim() !== "";

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {title}
          </h2>
          <p>Message: {currentMessage}</p>
          {journalEntryUpdates.length > 0 ? (
            <div>
              Past Messages:{" "}
              {messageHistory.map((message, index) => (
                <p key={index}>
                  {index === 0 ? (
                    <>Initial message: {message}</>
                  ) : (
                    <>
                      Update {index}: {message}
                    </>
                  )}
                </p>
              ))}
            </div>
          ) : undefined}
          <div className="card-actions justify-around">
            <textarea
              placeholder="Update message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updateEntry.isPending || !isFormValid}
            >
              Update Journal Entry {updateEntry.isPending && "..."}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to close this account?"
                  )
                ) {
                  return;
                }
                if (title) {
                  return deleteEntry.mutateAsync(title);
                }
              }}
              disabled={deleteEntry.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
