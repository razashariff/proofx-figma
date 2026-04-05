# ProofX — Content Protection for Figma

Protect your Figma designs with cryptographic signatures and tamper-proof timestamps. Each protected frame gets a unique content ID, SHA-256 hash, and ECDSA digital signature anchored to your creator identity.

## Features

### Protect
Select any frame or component in Figma and protect it with one click. The plugin:
1. Exports the selected frame as a 2x PNG
2. Computes a SHA-256 hash of the exported image
3. Sends the hash to the ProofX API for cryptographic signing
4. Stores the protection record (content ID, hash, signature, timestamp) on the frame as plugin data

Protected frames show a green "Protected" badge with full protection details.

### Verify
Enter any ProofX content ID to verify its protection status. The plugin queries the ProofX API and displays:
- Creator name and ID
- Content title and type
- Protection timestamp
- Content hash and signature

### Settings
Save your ProofX creator ID for use across all Figma files. The ID is stored in Figma's client storage and persists between sessions.

## How It Works

ProofX uses ECDSA P-256 digital signatures backed by Google Cloud KMS. When you protect a frame:

1. The frame is exported as a high-resolution PNG entirely within Figma
2. A SHA-256 hash is computed client-side using the Web Crypto API
3. The hash (not the image) is sent to the ProofX API
4. The API signs the hash with your creator's private key and returns a signature + content ID
5. The protection metadata is stored on the Figma node as plugin data

Your design files never leave Figma. Only a cryptographic hash is sent to ProofX.

## Setup

1. Install the plugin from Figma Community (or load locally for development)
2. Open the plugin: **Plugins > ProofX — Content Protection**
3. Go to the **Settings** tab
4. Enter your ProofX creator ID (find it at https://proofx.co.uk/dashboard)
5. Click **Save Settings**
6. Switch to the **Protect** tab, select a frame, and click **Protect This Frame**

## Development

```bash
npm install
npm run build    # compile code.ts -> code.js
npm run watch    # watch mode
```

Load in Figma Desktop: **Plugins > Development > Import plugin from manifest...**

See [DEPLOY.md](./DEPLOY.md) for full publishing instructions.

## Technical Details

- **Plugin backend** (`code.ts`): Runs in Figma's sandbox. Handles frame export, node plugin data, client storage, and message passing.
- **Plugin UI** (`ui.html`): Single HTML file with inline CSS and JavaScript. Handles SHA-256 hashing, API calls, and the three-tab interface.
- **API**: All network calls go to `https://api.proofx.co.uk` (declared in manifest.json).
- **Storage**: Creator ID is stored in `figma.clientStorage`. Protection records are stored on each node via `setPluginData`.

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/content/sign-hash` | POST | Sign a content hash |
| `/api/content/{content_id}` | GET | Verify content by ID |

## Privacy

- Design files never leave Figma
- Only SHA-256 hashes are sent to the ProofX API
- No telemetry or analytics
- Creator ID is stored locally in Figma's client storage

## License

BSL 1.1

## Links

- [ProofX Website](https://proofx.co.uk)
- [ProofX Dashboard](https://proofx.co.uk/dashboard)
- [ProofX API Documentation](https://api.proofx.co.uk/docs)
