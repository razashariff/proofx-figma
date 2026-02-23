# ProofX Figma Plugin — Deployment Guide

## Prerequisites

- A Figma account (free or paid)
- Node.js 18+ and npm
- A ProofX account with a creator ID (sign up at https://proofx.co.uk)

## Local Development

### 1. Install dependencies

```bash
cd proofx-figma
npm install
```

### 2. Build the plugin

```bash
npm run build
```

This compiles `code.ts` to `code.js`. The plugin files Figma needs are:

- `manifest.json` — plugin configuration
- `code.js` — compiled plugin backend
- `ui.html` — plugin UI (single file, no external dependencies)

### 3. Watch mode (optional)

```bash
npm run watch
```

Re-compiles `code.ts` on every save.

### 4. Load in Figma

1. Open Figma Desktop (the desktop app, not the browser)
2. Open any file
3. Go to **Plugins > Development > Import plugin from manifest...**
4. Select the `manifest.json` file from this directory
5. The plugin appears under **Plugins > Development > ProofX — Content Protection**

## Publishing to Figma Community

### 1. Prepare assets

Before submitting, you need:

- **Icon**: 128x128 PNG with the ProofX shield logo
- **Cover image**: 1920x960 PNG showing the plugin in action
- **Description**: Use the text from README.md
- **Tags**: content protection, watermark, copyright, signature, hash, security

### 2. Submit the plugin

1. Open Figma Desktop
2. Go to **Plugins > Development > ProofX — Content Protection**
3. Click the **"..."** menu next to the plugin name
4. Select **Publish**
5. Fill in the required fields:
   - Name: `ProofX — Content Protection`
   - Tagline: `Protect your designs with cryptographic signatures`
   - Description: (see README.md)
   - Icon: upload 128x128 PNG
   - Cover: upload 1920x960 PNG
   - Categories: Utilities
   - Tags: content protection, watermark, copyright, digital signature
6. Click **Submit for Review**

### 3. Review process

Figma reviews plugins within 5-10 business days. Common rejection reasons:

- Plugin name includes trademarked terms
- Network requests to unlisted domains (ensure `networkAccess` in manifest covers all domains)
- Plugin crashes on empty selection
- Missing error handling

This plugin handles all of these cases.

## Updating the Plugin

1. Make changes to `code.ts` or `ui.html`
2. Run `npm run build`
3. In Figma, the development version auto-reloads
4. For published plugins: go to Plugins > Manage Plugins > Update

## Plugin ID

After first publishing, Figma assigns a numeric plugin ID. Update `manifest.json` with the real ID:

```json
{
  "id": "1234567890"
}
```

## Network Access

The plugin only communicates with `https://api.proofx.co.uk`. This is declared in `manifest.json` under `networkAccess.allowedDomains`. Figma enforces this at runtime — the plugin cannot make requests to any other domain.

## File Structure

| File | Purpose | Loaded by Figma |
|------|---------|-----------------|
| `manifest.json` | Plugin config | Yes |
| `code.js` | Backend (sandbox) | Yes |
| `ui.html` | UI (iframe) | Yes |
| `code.ts` | TypeScript source | No (dev only) |
| `package.json` | npm config | No (dev only) |
| `tsconfig.json` | TS config | No (dev only) |
