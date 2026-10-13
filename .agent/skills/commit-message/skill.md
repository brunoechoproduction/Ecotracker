---
name: commit-message
description: >
  Drafts clear, conventional commit messages from the current git changes
  (staged or unstaged) without ever committing, staging, or modifying repo
  state. Use when the user asks for a commit message, says "antigravity" /
  "call antigravity" / "run antigravity", asks to "summarize my changes",
  "write a commit message for this", or wants to review what changed before
  committing. Invoke after implementation/QA is done and before the user
  (or Code Review Agent) finalizes the commit — this skill only proposes,
  it never commits.
---

# Commit Message

*(Also invokable by the alias "antigravity" — call it either way.)*

Read-only git assistant. Inspects staged/unstaged changes and drafts a
commit message for the user to review and run themselves. Does not commit,
stage, unstage, or modify any files — not implementation (→ Backend / UI/UX)
or code review (→ Code Review Agent).

## Invoke When

- User asks for a commit message, or to "summarize my changes"
- User says "antigravity", "call antigravity", "run antigravity"
- User wants to see what's staged/unstaged before committing
- User explicitly says they do NOT want to commit yet, just see the message

## Do Not Invoke For

- Actually running `git commit` (only on a separate, explicit follow-up request)
- Staging or unstaging files (`git add`, `git reset`, `git restore`)
- Writing code, fixing bugs, or resolving merge conflicts (→ Backend / UI/UX)
- PR descriptions or release notes (different scope — ask if that's wanted instead)

## Core Rule (non-negotiable)

**Never run `git commit`, `git add`, `git reset`, or `git restore`.** This
skill is strictly read-only with respect to git state — it reads `git
status`/`git diff` and outputs text. If the user says "now commit it" after
seeing the draft, treat that as a new, distinct request and confirm before
running any git command that changes state.

## Workflow

1. **Check repo state**
   ```bash
   git status
   ```
2. **Gather diffs**
   ```bash
   git diff --staged   # staged changes
   git diff             # unstaged changes
   ```
   Note any untracked files from `git status`; `cat` them briefly if their
   content is needed to understand the change.
3. **Resolve staged vs. unstaged ambiguity**
   - Default to the **staged** diff (that's what `git commit` would capture).
   - If unstaged changes also exist, flag them explicitly so nothing is
     silently left out of the message.
   - If nothing is staged, draft from the unstaged diff and say so.
4. **Draft the message** (see format below).
5. **Present, don't act** — output the message only; do not run it.
6. **No changes at all** → say so plainly instead of inventing a message.

## Commit Message Format

- Summary line: imperative mood, ~50 chars ("Add", "Fix", "Refactor" — not
  "Added"/"Fixes")
- Optional body: bullet points covering *what* and *why*, when inferable
- If the diff mixes unrelated changes (e.g. a fix + unrelated formatting),
  say so and suggest splitting into separate commits rather than forcing
  one message to cover everything

## Response Guide

| User request | Deliver |
|---|---|
| "Write a commit message" | Message drafted from staged diff (or unstaged, if nothing staged) |
| "Summarize my changes" | Plain-language summary + drafted message |
| "antigravity" | Same flow — status check, diff, drafted message |
| "What's staged right now?" | `git status` summary, no message draft needed unless asked |
| "Now commit it" | Confirm intent, then (only if confirmed) run the commit |

## Troubleshooting

| Symptom | Action |
|---|---|
| Both staged and unstaged changes present | Base message on staged diff; explicitly call out what's left unstaged |
| Diff spans unrelated changes | Recommend splitting into separate commits |
| `git status` is clean | State plainly that there's nothing to commit |
| Untracked files relevant to the change | List them from `git status`; skim content with `cat` if needed for context |

## Output Expectations

- One line noting what was inspected (e.g. "3 files staged, 1 file with
  unstaged changes")
- The drafted message in a code block, ready to copy:
  ```bash
  git commit -m "Short summary line" -m "Longer body if needed"
  ```
- A closing reminder that nothing has been committed yet