/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/journal.json`.
 */
export type Journal = {
  "address": "EZB64BQPMPzGNEV6XvrxTSPcQHCXaRF7aXMgunxQ6LNh",
  "metadata": {
    "name": "journal",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createJournalEntry",
      "discriminator": [
        48,
        65,
        201,
        186,
        25,
        41,
        127,
        0
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteJournalEntry",
      "discriminator": [
        156,
        50,
        93,
        5,
        157,
        97,
        188,
        114
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateJournalEntry",
      "discriminator": [
        113,
        164,
        49,
        62,
        43,
        83,
        194,
        172
      ],
      "accounts": [
        {
          "name": "journalEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "journalEntryState",
      "discriminator": [
        113,
        86,
        110,
        124,
        140,
        14,
        58,
        66
      ]
    }
  ],
  "events": [
    {
      "name": "journalEntryCreated",
      "discriminator": [
        126,
        173,
        152,
        196,
        221,
        250,
        113,
        175
      ]
    },
    {
      "name": "journalEntryDeleted",
      "discriminator": [
        168,
        226,
        83,
        105,
        167,
        47,
        228,
        13
      ]
    },
    {
      "name": "journalEntryUpdated",
      "discriminator": [
        36,
        218,
        186,
        216,
        237,
        105,
        107,
        243
      ]
    }
  ],
  "types": [
    {
      "name": "journalEntryCreated",
      "docs": [
        "Represents a journal entry creation event."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "The public key of the owner of the journal entry."
            ],
            "type": "pubkey"
          },
          {
            "name": "title",
            "docs": [
              "The title of the journal entry."
            ],
            "type": "string"
          },
          {
            "name": "message",
            "docs": [
              "The content of the journal entry."
            ],
            "type": "string"
          },
          {
            "name": "entryId",
            "docs": [
              "The unique identifier for the journal entry."
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "journalEntryDeleted",
      "docs": [
        "Represents a journal entry deletion event."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "The public key of the owner of the journal entry."
            ],
            "type": "pubkey"
          },
          {
            "name": "entryId",
            "docs": [
              "The unique identifier for the journal entry."
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "journalEntryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "journalEntryUpdated",
      "docs": [
        "Represents a journal entry update event."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "The public key of the owner of the journal entry."
            ],
            "type": "pubkey"
          },
          {
            "name": "message",
            "docs": [
              "The updated message of the journal entry."
            ],
            "type": "string"
          },
          {
            "name": "entryId",
            "docs": [
              "The unique identifier for the journal entry."
            ],
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
