#!/usr/bin/env sh
# Cursor injects npm_config_devdir for its sandbox node-gyp cache. npm 10.9+ warns and
# a future npm major will reject it. Unset in shell entry points (pre-commit, CI) that
# may inherit the agent/sandbox env. Integrated terminals unset it via .vscode/settings.json.
unset NPM_CONFIG_DEVDIR npm_config_devdir 2>/dev/null || true
