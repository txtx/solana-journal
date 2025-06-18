use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("EZB64BQPMPzGNEV6XvrxTSPcQHCXaRF7aXMgunxQ6LNh");

#[program]
mod journal {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;
        emit_cpi!(JournalEntryCreated::new(
            ctx.accounts.owner.key(),
            &title,
            &message,
            journal_entry.key()
        ));
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Journal Entry Updated");
        msg!("Title: {}", title);
        msg!("Message: {}", message);


        emit_cpi!(JournalEntryUpdated::new(
            ctx.accounts.owner.key(),
            &message,
            ctx.accounts.journal_entry.key()
        ));

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;

        Ok(())
    }

    pub fn delete_journal_entry(ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        msg!("Journal entry titled {} deleted", title);
        emit_cpi!(JournalEntryDeleted::new(
            ctx.accounts.owner.key(),
            ctx.accounts.journal_entry.key()
        ));
        Ok(())
    }
}

#[account]
pub struct JournalEntryState {
    pub owner: Pubkey,
    pub title: String,
    pub message: String,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
#[event_cpi]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        payer = owner, 
        space = 8 + 32 + 4 + title.len() + 4 + message.len()
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
#[event_cpi]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        realloc = 8 + 32 + 4 + title.len() + 4 + message.len(),
        realloc::payer = owner, 
        realloc::zero = true, 
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
#[event_cpi]
pub struct DeleteEntry<'info> {
    #[account( 
        mut, 
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        close= owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[event]
/// Represents a journal entry creation event.
pub struct JournalEntryCreated {
    /// The public key of the owner of the journal entry.
    pub owner: Pubkey,
    /// The title of the journal entry.
    pub title: String,
    /// The content of the journal entry.
    pub message: String,
    /// The unique identifier for the journal entry.
    pub entry_id: Pubkey,
}

impl JournalEntryCreated {
    pub fn new(owner: Pubkey, title: &str, message: &str, entry_id: Pubkey) -> Self {
        Self {
            owner,
            title: title.to_string(),
            message: message.to_string(),
            entry_id,
        }
    }
}

#[event]
/// Represents a journal entry update event.
pub struct JournalEntryUpdated {
    /// The public key of the owner of the journal entry.
    pub owner: Pubkey,
    /// The updated message of the journal entry.
    pub message: String,
    /// The unique identifier for the journal entry.
    pub entry_id: Pubkey,
}

impl JournalEntryUpdated {
    pub fn new(owner: Pubkey, message: &str, entry_id: Pubkey) -> Self {
        Self {
            owner,
            message: message.to_string(),
            entry_id,
        }
    }
}

#[event]
/// Represents a journal entry deletion event.
pub struct JournalEntryDeleted {
    /// The public key of the owner of the journal entry.
    pub owner: Pubkey,
    /// The unique identifier for the journal entry.
    pub entry_id: Pubkey,
}

impl JournalEntryDeleted {
    pub fn new(owner: Pubkey, entry_id: Pubkey) -> Self {
        Self {
            owner,
            entry_id,
        }
    }
}
