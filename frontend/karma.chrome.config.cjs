const { existsSync } = require('node:fs');
const { execSync } = require('node:child_process');

const chromeBinByPlatform = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ],
  win32: [
    'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  ],
};

function commandExists(command) {
  try {
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';
    const resolved = execSync(`${whichCmd} ${command}`, {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    return resolved || null;
  } catch {
    return null;
  }
}

function resolveChromeBin(platform = process.platform) {
  const candidates = chromeBinByPlatform[platform] || [];
  const existingCandidate = candidates.find((path) => existsSync(path));
  if (existingCandidate) {
    return existingCandidate;
  }

  const commandCandidates =
    platform === 'win32'
      ? ['chrome', 'msedge']
      : [
          'google-chrome',
          'google-chrome-stable',
          'chromium',
          'chromium-browser',
        ];
  for (const command of commandCandidates) {
    const resolved = commandExists(command);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

module.exports = {
  resolveChromeBin,
};
