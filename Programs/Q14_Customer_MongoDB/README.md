# Q14: Customer MongoDB

See [QUESTION.md](QUESTION.md) for the exact question and requirements.

Open two terminals in this folder.

Terminal 1:
```powershell
cd server
npm.cmd install
npm.cmd start
```

Terminal 2:
```powershell
cd client
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. The frontend proxies `/api` requests to port 3000.

Start MongoDB before starting the server. The default database URI is in `server/.env.example`. To override it in PowerShell, set `$env:MONGODB_URI="your connection URI"` before running the server. The example file is documentation; it is not loaded automatically.

Verification: Submit valid and invalid entries and check displayed messages. Exercise every navigation link or record action available.

Use only one practical server on port 3000 at a time.

Quick start on this computer: double-click `START.cmd`. Dependencies are installed separately by the root `INSTALL-ALL.cmd`. Close both terminals for full-stack apps before starting another practical.
