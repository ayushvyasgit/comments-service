# 📖 Setup Instructions - Comments Service

Complete step-by-step guide to run the Comments Service on Windows.

---

## 🎯 What You'll Get

After following this guide, you'll have:
- ✅ Comments Service running locally
- ✅ PostgreSQL database with test data
- ✅ Redis caching layer active
- ✅ All tests passing (30+ tests)
- ✅ API accessible at http://localhost:3000

**Time Required:** 10-15 minutes

---

## ✅ Prerequisites (Install First)

### 1. Node.js 20 LTS

**Check if installed:**
```powershell
node --version
# Should show: v20.x.x
```

**Install if needed:**
- Download from: https://nodejs.org/
- Or use winget:
```powershell
winget install OpenJS.NodeJS.LTS
```

**Verify installation:**
```powershell
node --version
npm --version
```

---

### 2. Docker Desktop

**Check if installed:**
```powershell
docker --version
docker-compose --version
```

**Install if needed:**
- Download from: https://www.docker.com/products/docker-desktop/
- Or use winget:
```powershell
winget install Docker.DockerDesktop
```

**Important:** 
- Restart your computer after installing Docker
- Start Docker Desktop from Start Menu
- Wait for Docker to be "Running" (check system tray icon)

---

### 3. Git 

**Check if installed:**
```powershell
git --version
```

**Install if needed:**
```powershell
winget install Git.Git
```

---

## 🚀 Installation Steps

### Step 1: Navigate to Project

```powershell
# If you extracted the archive
cd C:\path\to\comments-service

# Or if you cloned from Git
git clone <repository-url>
cd comments-service
```

---

### Step 2: Install Dependencies

```powershell
npm install
```

**Expected Output:**
```
added 500+ packages in 2m
```

**If this fails:**
```powershell
# Clear cache and try again
npm cache clean --force
npm install
```

---

### Step 3: Configure Environment

```powershell
# Copy environment template
Copy-Item .env.example .env

# View the file (optional)
notepad .env
```

\

### Step 4: Start Docker Services

```powershell
# Start PostgreSQL and Redis
docker-compose up -d
```

**Expected Output:**
```
✔ Container comments-db     Started
✔ Container comments-redis  Started
```

**Verify containers are running:**
```powershell
docker-compose ps
```

**Expected Output:**
```
NAME             STATUS
comments-db      Up (healthy)
comments-redis   Up (healthy)
```


### Step 5: Setup Database

```powershell
# Generate Prisma client
npm run prisma:generate
```

**Expected Output:**
```
✔ Generated Prisma Client
```

```powershell
# Run database migrations
npm run prisma:migrate
```

**Expected Output:**
```
✔ Migrations applied
Your database is now in sync with your schema.
```



### Step 6: Start the Application

```powershell
npm run start:dev
```









### View Database

```powershell
# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Opens in browser at http://localhost:5555
```

---


## 📊 What's Running

After successful setup:

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Comments API** | 3000 | http://localhost:3000 | Main application |
| **PostgreSQL** | 5432 | localhost:5432 | Database |
| **Redis** | 6379 | localhost:6379 | Cache & rate limiting |
| **Prisma Studio** | 5555 | http://localhost:5555 | Database viewer (when started) |

---

## 🎯 Next Steps

1. ✅ Try the test script: `.\test-complete-system.ps1`