# Inventory API (AWS RDS PostgreSQL)

Credentials live only in `server/.env` on EC2 — never in frontend code.

## Run on EC2

```bash
# 1. Install Node 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs   # Amazon Linux
# (Ubuntu: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs)

# 2. Configure
cd server
cp .env.example .env
nano .env            # set DATABASE_URL
chmod 600 .env

# 3. Install, migrate, seed
npm install
npm run migrate
npm run seed

# 4. Build the frontend so the API serves it (optional, from project root)
cd .. && npm install && VITE_API_URL=same-origin npm run build && cd server

# 5. Start
npm start            # http://EC2_PUBLIC_IP:3000

# Keep it running
sudo npm i -g pm2 && pm2 start index.js --name inventory-api && pm2 save && pm2 startup
```

Open port 3000 in the EC2 security group (or put Nginx in front on 80/443).

## Frontend modes
- `VITE_API_URL` unset → uses built-in sample data (Lovable preview).
- `VITE_API_URL=same-origin` → calls `/api/...` on the same host.
- `VITE_API_URL=http://EC2_IP:3000` → calls that API.

## Endpoints
- `GET /api/items`
- `POST /api/items` `{ name, quantity }`
- `PATCH /api/items/:id` `{ quantity }`
