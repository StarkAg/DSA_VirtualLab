# Deployment

Live: **https://dsa-virtual-lab.vercel.app** · Admin: **/admin**

Two pieces: the **frontend + execution proxy** on Vercel, and the **Convex backend**.

## Backend → Convex

```bash
npx convex dev          # first run: creates the project + dev deployment, writes .env.local
npx convex deploy -y    # push functions to the PRODUCTION deployment, prints its URL
npx convex env set ADMIN_PASSCODE "your-passcode"          # dev
npx convex env set ADMIN_PASSCODE "your-passcode" --prod   # production
```
Seed demo students (optional): `npx convex run seed:demo --prod`.

Tables: `users`, `solves`, `quizScores`, `submissions`. The admin passcode lives in the
Convex env var `ADMIN_PASSCODE` (default `dsalab-admin` if unset).

## Frontend → Vercel

Set the production Convex URL so the build can reach the backend:
```bash
vercel env add VITE_CONVEX_URL production    # paste the prod URL from `convex deploy`
vercel deploy --prod --yes --name dsa-virtual-lab
```
The SPA, the `/api/execute` proxy and `convex/_generated` deploy together. Execution
defaults to the free **Wandbox** engine (no key). `VITE_EXEC_MODE=mock` disables it.

---

## Code execution backends

`/api/execute` picks its backend from **server-side env vars** (set in
Vercel → Project → Settings → Environment Variables). The frontend never changes.

| Backend | When used | Cost / limits |
|---|---|---|
| **Wandbox** (default) | nothing set | Free public API, shared/rate-limited |
| **Self-hosted Judge0** | `JUDGE0_URL` set | Free, unlimited, private — needs a VM |

### Optional Wandbox overrides
If a default compiler version is retired, override it:
`WANDBOX_C`, `WANDBOX_CPP`, `WANDBOX_JAVA`, `WANDBOX_PYTHON`
(see live list at https://wandbox.org/api/list.json).

---

## Unlimited & private: self-host Judge0

> ⚠️ Judge0's sandbox needs **privileged containers + cgroup v1 memory control**.
> It does **NOT** run on Railway / Vercel / Render / Fly. Use a real Linux **VM**
> where you control Docker (Oracle Cloud Always-Free ARM, Hetzner, DigitalOcean, EC2…).

1. **Provision a VM** (Ubuntu 22.04, 2+ GB RAM). For cgroup v1, boot the kernel with:
   ```
   # /etc/default/grub →  GRUB_CMDLINE_LINUX="... systemd.unified_cgroup_hierarchy=0"
   sudo update-grub && sudo reboot
   ```
2. **Install Docker + Compose**, then copy the `judge0/` folder to the VM.
3. **Edit `judge0/judge0.conf`** — set strong `POSTGRES_PASSWORD` and `REDIS_PASSWORD`
   (and optionally `AUTHN_TOKEN`).
4. **Start it:**
   ```bash
   cd judge0
   docker compose up -d db redis
   sleep 10
   docker compose up -d
   ```
   Judge0 is now at `http://<vm-ip>:2358` (test: `curl http://<vm-ip>:2358/about`).
5. **Point the app at it** — in Vercel env vars:
   ```
   JUDGE0_URL = http://<vm-ip>:2358
   JUDGE0_TOKEN = <only if you set AUTHN_TOKEN>
   ```
   Redeploy. Submissions now run on your own Judge0 with no rate limits.

> For production, put Judge0 behind HTTPS (Caddy/Nginx + a domain) and restrict the
> firewall to the Vercel proxy. The proxy already calls Judge0 server-side, so the
> browser never touches it directly.
