# How to Git Push Using the SSH Wrapper (`docs/ssh_git_wrapper_v3.py`)

Push commits to the GitHub remote (`git@github.com:nordeim/event-spark-2.git`) via the
Paramiko-based SSH wrapper when OpenSSH's `ssh` client is not installed on the host —
the situation in the restricted sandbox where this repository was built and verified.

The wrapper script is **included in this repository** at `docs/ssh_git_wrapper_v3.py`
(the canonical copy). It implements the `ssh` CLI contract well enough to serve as
Git's SSH transport: it parses the flags Git passes (`-i`, `-o`, `-p`, `-l`, …),
connects to GitHub over Paramiko with the specified private key, executes the remote
command (`git-upload-pack` / `git-receive-pack`), and streams stdin/stdout/stderr
bidirectionally.

---

## When to Use

Use this method when **any** of the following is true:

1. `which ssh` fails or returns nothing (no `openssh-client` on the host).
2. `git push` / `git fetch` / `git ls-remote` fails with
   `git@github.com: Permission denied (publickey)` or `cannot run ssh: No such file or directory`.

If a working `ssh` binary exists, skip the wrapper and push directly — the remote URL
is already in SSH form.

---

## Prerequisites

| Requirement | Check | Fix if missing |
| --- | --- | --- |
| Python 3.10+ | `python3 --version` | install Python ≥ 3.10 |
| `paramiko` in **that** Python | `python3 -c "import paramiko; print(paramiko.__version__)"` | `python3 -m pip install paramiko` (watch for PEP 668: `--break-system-packages`) |
| GitHub SSH private key | key file exists, starts with `-----BEGIN OPENSSH PRIVATE KEY-----` | obtain the deploy key; keep it **outside the repo** (`.ssh/` is gitignored) |
| Key permissions | `stat -c %a <key>` → `600` | `chmod 600 <key>` — Paramiko rejects group/other-readable keys |
| Wrapper executable | `ls -la docs/ssh_git_wrapper_v3.py` → `-rwxr-xr-x` | `chmod +x docs/ssh_git_wrapper_v3.py` |

**Critical gotcha:** the `python3` on `PATH` (used by the wrapper's shebang
`#!/usr/bin/env python3`) may be a different interpreter than the one `pip` installs
into. Always verify with the import check above; if it fails, install paramiko into
the interpreter that `which python3` resolves to.

---

## Procedure (verified in this repository)

```bash
cd /path/to/event-spark-2

# 1. Confirm the remote URL is SSH (not HTTPS)
git remote -v
#    origin  git@github.com:nordeim/event-spark-2.git (fetch/push)
# If HTTPS: git remote set-url origin git@github.com:nordeim/event-spark-2.git

# 2. Confirm what would be pushed (main only — no side branches in this repo)
git branch --show-current                 # main
git log --oneline origin/main..HEAD       # commits ahead of the remote

# 3. Push via the wrapper
GIT_SSH_COMMAND="/path/to/event-spark-2/docs/ssh_git_wrapper_v3.py \
  -i /path/to/key -o StrictHostKeyChecking=accept-new" git push origin main

# 4. Verify
git status -sb                            # ## main...origin/main  (no ahead/behind)
GIT_SSH_COMMAND="... wrapper ... -i key ..." git ls-remote origin   # HEAD == local main
```

---

## Flag Reference

| Flag | Purpose |
| --- | --- |
| `-i <path>` | Private key path (supports `~` expansion) |
| `-o StrictHostKeyChecking=accept-new` | **Recommended default** — auto-accepts GitHub's host key on first contact, rejects *changed* keys (MITM protection). Use `=` form, never space-separated |
| `-o StrictHostKeyChecking=no` | Testing only — accepts any host key |
| `-p <port>` / `-p<port>` | Non-standard SSH port (GitHub also listens on 443: `-p 443`) |
| `-v` / `-vv` / `-vvv` | Verbosity (WARNING / INFO / DEBUG) — append to diagnose auth or IO failures |

---

## Troubleshooting (real incidents, in frequency order)

1. **`Invalid command: 'git-receive-pack '"'"'nordeim/event-spark-2.git'"'"''`** —
   the notorious single-string command quoting bug. Fixed in this v3 copy at the
   `shlex.join(shlex.split(...))` normalization (search the script for
   `config["command"]`). Never substitute an older wrapper that re-quotes Git's
   command argument.

2. **`ModuleNotFoundError: No module named 'paramiko'`** — paramiko was installed
   into a different Python than the wrapper's shebang resolves to. Fix per the
   prerequisites table.

3. **`Permission denied (publickey)`** — (a) key file not mode 600; (b) wrong key
   path in `-i`; (c) the public key is not registered on the GitHub account/repo.

4. **`HOST KEY VERIFICATION FAILED`** — GitHub's recorded host key changed relative
   to `~/.ssh/known_hosts`. Remove the `github.com` line and retry with
   `accept-new`.

5. **`Fatal Python error: _enter_buffered_busy` at exit** — a known transient race
   in the wrapper's IO-drain shutdown path. Retry the push; the refs either moved
   completely or not at all (verify with `ls-remote` before retrying).

---

## Repository Rules That Govern Pushes From This Repo

- **`main` only.** All commits land on `main`; never create side branches (owner's
  standing instruction; also the repo's documented trunk-based convention).
- **Linear history, Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`).
- **Never commit secrets.** The deploy key lives in gitignored `.ssh/` (or any
  path outside the tree); audit staged files (`git diff --cached --name-only`)
  for key material before every push.
- The owner's own commits (e.g. `3fd74fb`, `a8ce8a4`, `dde7734`) are preserved
  via rebase — never overwritten or force-pushed away.

---

## Provenance

This wrapper and procedure were exercised to push every commit of this repository
(`0fa109b`, `fa7d9a1`, `3f60081`, `57bf649`, …). The script originates from the
`how-to-git-push-using-ssh-wrapper` skill of the
[`nordeim/home-financing`](https://github.com/nordeim/home-financing) foundation
repo (skills library), vendored here at the canonical `docs/` path so the
repository is self-contained for future maintainers on restricted hosts.
