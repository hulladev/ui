# Commit current work

Inspect all current repository changes, divide them into coherent commits, write messages that match
the repository's established commit format, and create the commits.

Arguments (optional): `--check`

- With no arguments, plan and create the commits without asking for confirmation.
- With `--check`, present the complete commit plan and wait for the user's approval before changing
  the index or creating a commit. This is a confirmation mode, not a dry run: after approval, create
  the planned commits.
- Reject unknown arguments and explain the supported usage.

## Safety rules

- Never discard, overwrite, or rewrite working-tree changes.
- Never push, amend, rebase, reset, or force anything.
- Never use `--no-verify`, `--no-gpg-sign`, `git add .`, or `git add -A`.
- Stage explicit paths only, using `git add -- <path...>` so filenames cannot be parsed as options.
- Do not add a `Co-Authored-By` or AI-generated trailer.
- Never stage files that may contain secrets, including `.env*`, `*credentials*`, `*.pem`, `*.key`,
  private keys, tokens, or credential exports. Do not print their contents. Skip them and warn the
  user.
- Stop before making commits if the repository is in the middle of a merge, rebase, cherry-pick, or
  revert, has unresolved conflicts, or has no commits yet and the repository rules cannot be
  determined safely.
- Preserve changes that appear while the command is running. Only commit changes included in the
  original inventory; report newly appearing changes at the end.
- Do not include ignored files.

## Process

1. Parse `$ARGUMENTS`. Enable confirmation mode only when the exact `--check` flag is present.
2. Locate the repository root and inspect its state:
   - Run `git status --short` without `-uall`.
   - Run `git diff`, `git diff --cached`, and `git ls-files --others --exclude-standard`.
   - Check for an in-progress Git operation and unresolved files.
   - If there are no staged, unstaged, or untracked changes, say so and stop.
3. Determine the commit rules before proposing messages:
   - Read repository instructions that govern the changed files, including applicable `AGENTS.md`
     files.
   - Inspect commit tooling and documentation such as `commitlint.config.*`, `package.json`,
     `.gitmessage`, `CONTRIBUTING*`, and relevant Husky hooks when they exist.
   - Inspect recent subjects with `git log --format=%s -30`.
   - Treat configured validation as authoritative, then use recent history to resolve style choices.
     Do not impose generic Conventional Commits when this repository uses another format.
4. Understand every change:
   - Read the full staged and unstaged diffs.
   - Read each untracked file that is eligible to commit. For large or binary files, inspect enough
     metadata and surrounding references to classify them safely.
   - Identify generated files and pair them with the source or configuration change that produced
     them. Keep a lockfile with the manifest changes that caused it.
   - Note any suspicious, accidental, debug-only, unrelated, or secret-like files and exclude them
     rather than silently committing them.
5. Build the commit plan:
   - Make one commit per logical change, not one commit per file and not one catch-all commit.
   - Keep implementation, its tests, documentation, required generated output, and directly related
     dependency metadata together.
   - Separate unrelated features, fixes, documentation, configuration, cleanup, and release work.
   - Treat each file as one staging unit. When a file supports multiple related changes, place it in
     the smallest coherent group and mention the overlap in `--check` mode.
   - Order foundational configuration or refactors before features that depend on them, and put
     follow-up documentation or cleanup afterward.
   - Give every group an exact commit subject that passes the discovered rules. Subjects should be
     concise, specific, imperative, and consistent with recent history.
6. In `--check` mode, show the user:
   - Each proposed subject in execution order.
   - The exact files included in each commit.
   - A short reason for any non-obvious grouping.
   - Every skipped or suspicious file and why it was skipped.

   Then wait for explicit approval. Do not stage or commit anything before approval. If the user
   changes the plan, apply their requested grouping or messages. Immediately before execution,
   re-run the inventory; if any planned file changed or the repository gained new changes, present
   the revised plan and ask again.

7. Create the commits:
   - If changes were already staged, list their exact paths and unstage only those paths with
     `git restore --staged -- <path...>`. This changes only the index and allows all inventoried files
     to be regrouped consistently.
   - For each group, stage only its explicit paths.
   - Inspect `git diff --cached --name-status` and `git diff --cached` before committing. Confirm that
     the index contains exactly that group and that no skipped or newly appearing changes slipped
     in.
   - Run `git commit -m "<subject>"`. Add a body only when the change genuinely needs context, using
     a second `-m` argument and matching the repository's body style.
   - If a hook or commit validation fails, never bypass it. Diagnose the failure. Correct a proposed
     message and retry when the commit was not created; otherwise stop and explain what must be
     fixed. Do not make unrelated code changes merely to force a commit through.
   - After each successful commit, record its hash and subject and verify that the next group's files
     still match the inventory.
8. Verify the result with `git status --short` and
   `git log --oneline -<number-of-created-commits>`.
9. Report:
   - The created commit hashes and subjects.
   - Any files intentionally left uncommitted.
   - Any failures or newly appearing changes.
   - Do not push.

## Current repository message format

Always rediscover the format from the repository because it may evolve. At the time this command was
added, `package.json`, `commitlint.config.ts`, and recent history define these subject prefixes:

- `:white_check_mark: feat:` — new functionality
- `:lady_beetle: fix:` — bug fixes
- `:wrench: update:` — code changes that are neither features nor fixes
- `:books: docs:` — documentation
- `:test_tube: tests:` — tests
- `:screwdriver: config:` — configuration
- `:robot: devops:` — CI/CD and automation
- `:recycle: cleanup:` — cleanup
- `:package: release:` — releases

Example:

```text
:white_check_mark: feat: add commit command
```
