# Native Land Digital relay: how the API key is kept secret

The site shows Native Land Digital (NLD) territory and language information live, at view time. Nothing from NLD is stored in this repository, the build, or any cache.

## Why a relay

A static website cannot keep a secret: any key placed in its JavaScript can be read by every visitor. So the browser never sees the key. It calls a tiny function, `relay/`, deployed on Vercel at `https://api.landback.land/api/lookup?lat=..&lng=..&maps=territories,languages`. The function:

- answers only requests from `https://landback.land` (and `localhost` for development);
- rounds coordinates to two decimals (about 1 km) and allows only the `territories` and `languages` layers;
- adds the key on the server and returns NLD's answer **byte for byte**, with `Cache-Control: no-store`;
- stores and logs nothing; has a kill switch (`NLD_ENABLED=false`); reports a revoked key as `410`.

## Where the key lives

The key lives in the Vercel project's **encrypted environment variable `NLD_KEY`** (project `landback-nld-relay`, production). It never enters the repository or the website. Vercel's GitHub integration redeploys `relay/` on every push to `main`. The relay is served at `https://api.landback.land`.

Claims and corrections from the site's forms are saved as JSON files in a **private Vercel Blob store** (`landback-claims`), reachable only with the project's credentials. Read them with `npm run claims` (run `cd relay && vercel env pull` once first).

## One-time setup (owner)

Run this in your own terminal and paste the key at the prompt. Never paste a key into a chat, an issue, or a file.

```sh
cd relay
vercel env add NLD_KEY production      # paste your Native Land Digital API key
vercel deploy --prod                   # or just push to main
```

Optional GitHub route: keep the key in the GitHub secret `NLD_API_KEY`, add a `VERCEL_TOKEN` secret (create at https://vercel.com/account/tokens), and run the `relay` workflow by hand; it copies the secret into Vercel.

To rotate the key: `vercel env update NLD_KEY production`, then redeploy. To switch the feature off at once: set `NLD_ENABLED=false` in the Vercel project's environment, or remove the secret and rerun.

## Terms

NLD's terms ask for written permission before API data is stored or redistributed; this relay stores nothing and passes data through unchanged, which is the owner's chosen approach (decision log, 2026-10-17). Sending NLD the courtesy note in `docs/design/J2-native-land-integration-spec.md` s.7 is still recommended.
