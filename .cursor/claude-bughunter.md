# Claude-BugHunter, ported for Cursor

This vendors [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
(v2.1.0, MIT) so it works inside Cursor instead of the Claude Code `/plugin` system.

## Layout

- `.cursor/skills/` — the 83 `SKILL.md` bundles. Cursor auto-loads them by topic, same as Claude Code.
- `.cursor/commands/` — the 15 slash commands (`/hunt`, `/recon`, `/scope`, `/report`, …).
- `.cursor/mcp.json` — registers the keyless HackerOne MCP server.
- `claude-bughunter/` — the full upstream bundle (MCP server, `cbh` CLI, engine, docs). This is the
  authoritative copy; the MCP server reads `claude-bughunter/skills/offensive-osint/scripts/h1_reference.py`,
  so keep that tree intact. The copies under `.cursor/skills` and `.cursor/commands` are what Cursor discovers.

## HackerOne MCP

Public tools (`search_disclosed_reports`, `get_program`, `get_program_scope`) need no key.
For your private programs and reports, set `HACKERONE_API_USERNAME` / `HACKERONE_API_TOKEN` in
`.cursor/mcp.json`. `${workspaceFolder}` expands to the repo root; if your Cursor build doesn't expand
it, replace the arg with an absolute path to `claude-bughunter/mcp/hackerone/server.py`. Needs `python3` (tested on 3.12).

## Updating

Re-pull upstream into `claude-bughunter/`, then refresh the Cursor copies:

```bash
cp -a claude-bughunter/skills/.   .cursor/skills/
cp -a claude-bughunter/commands/. .cursor/commands/
```

## Authorized use only

This is an offensive-security toolkit. Only run it against targets you are authorized to test
(e.g. assets explicitly in scope for a bug-bounty program or a signed engagement).
