# Native Land Digital relay: how the API key is kept secret

The site shows Native Land Digital (NLD) territory and language information live, at view time. Nothing from NLD is stored in this repository, the build, or any cache.

## Why a relay

A static website cannot keep a secret: any key placed in its JavaScript can be read by every visitor. So the browser never sees the key. It calls a tiny function, `relay/`, deployed on Vercel at `https://landback-nld-relay.vercel.app/api/lookup?lat=..&lng=..&maps=territories,languages`. The function:

- answers only requests from `https://landback.land` (and `localhost` for development);
- rounds coordinates to two decimals (about 1 km) and allows only the `territories` and `languages` layers;
- adds the key on the server and returns NLD's answer **byte for byte**, with `Cache-Control: no-store`;
- stores and logs nothing; has a kill switch (`NLD_ENABLED=false`); reports a revoked key as `410`.

## Where the key lives

The key's only source of truth is the GitHub repository secret **`NLD_API_KEY`**. The `relay` workflow copies it into the Vercel project's encrypted environment (`NLD_KEY`) and redeploys. GitHub masks secrets in logs.

## One-time setup (owner)

Run these in your own terminal. Never paste a key into a chat, an issue, or a file.

```sh
# 1. Your Native Land Digital API key (from your NLD account's API page):
gh secret set NLD_API_KEY --repo omniharmonic/treaty-land-atlas
# 2. A Vercel token so GitHub can deploy the relay (create at https://vercel.com/account/tokens,
#    scope: the omniharmonic team, expiry as you prefer):
gh secret set VERCEL_TOKEN --repo omniharmonic/treaty-land-atlas
# 3. Deploy:
gh workflow run relay --repo omniharmonic/treaty-land-atlas
```

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are already set as repository variables (they are identifiers, not secrets).

To rotate the key: set `NLD_API_KEY` again and rerun the workflow. To switch the feature off at once: set `NLD_ENABLED=false` in the Vercel project's environment, or remove the secret and rerun.

## Terms

NLD's terms ask for written permission before API data is stored or redistributed; this relay stores nothing and passes data through unchanged, which is the owner's chosen approach (decision log, 2026-10-17). Sending NLD the courtesy note in `docs/design/J2-native-land-integration-spec.md` s.7 is still recommended.
