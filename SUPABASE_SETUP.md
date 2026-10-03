<!-- @format -->

# Supabase Setup Guide - Step by Step

## Part 1: Create Supabase Account & Project (5 minutes)

### Step 1.1: Create Account

1. Go to https://supabase.com
2. Click **"Sign Up"** (top right)
3. Use GitHub, Google, or email to sign up
4. Verify your email

### Step 1.2: Create a New Project

1. Click **"New Project"** in the dashboard
2. Fill in:
   - **Project name**: `Softball-Lineup` (or whatever you want)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
3. Click **"Create new project"**
4. Wait ~2 minutes for project to spin up

### Step 1.3: Get Your API Keys

Once the project loads:

1. Go to **Settings** (bottom left sidebar)
2. Click **"API"**
3. You'll see:
   ```
   Project URL: https://xxxxx.supabase.co
   anon key: eyJxxxxx...
   service_role key: eyJxxxxx...
   ```
4. **Copy these somewhere safe** (you'll need them next)

---

## Part 2: Set Up Database Tables (5 minutes)

### Step 2.1: Open SQL Editor

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**

### Step 2.2: Create Teams Table

Copy and paste this, then click **"Run"**:

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Only users can see their own team
CREATE POLICY "Users can view their own team" ON teams
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can update their own team" ON teams
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own team" ON teams
  FOR DELETE USING (owner_id = auth.uid());
```

✅ You should see "Executed successfully"

### Step 2.3: Create Batting Orders Table

Click **"New Query"** again, paste this:

```sql
CREATE TABLE batting_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  players JSONB DEFAULT '[]',
  primary_color TEXT DEFAULT '#FF6600',
  text_color TEXT DEFAULT '#FFFFFF',
  sponsor_logo BYTEA,
  team_logo BYTEA,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_batting_orders_team_id ON batting_orders(team_id);

ALTER TABLE batting_orders ENABLE ROW LEVEL SECURITY;

-- Users can see/edit batting orders for their team
CREATE POLICY "Users can view their team's batting order" ON batting_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = batting_orders.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their team's batting order" ON batting_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = batting_orders.team_id
      AND teams.owner_id = auth.uid()
    )
  );
```

### Step 2.4: Create Lineups Table

Click **"New Query"** again:

```sql
CREATE TABLE lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  inning_number INT NOT NULL,
  players JSONB,
  positions JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lineups_team_id ON lineups(team_id);

ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team's lineups" ON lineups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = lineups.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their team's lineups" ON lineups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = lineups.team_id
      AND teams.owner_id = auth.uid()
    )
  );
```

### Step 2.5: Create Saved Rotations Table

Click **"New Query"** again:

```sql
CREATE TABLE saved_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  rotation_name TEXT NOT NULL,
  inning_count INT NOT NULL,
  innings JSONB,
  positions JSONB,
  date_saved TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_saved_rotations_team_id ON saved_rotations(team_id);

ALTER TABLE saved_rotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team's saved rotations" ON saved_rotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = saved_rotations.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their team's saved rotations" ON saved_rotations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = saved_rotations.team_id
      AND teams.owner_id = auth.uid()
    )
  );
```

✅ All tables should show "Executed successfully"

---

## Part 3: Enable Real-Time Subscriptions (2 minutes)

### Step 3.1: Enable Real-Time for Tables

1. Go to **"Replication"** (left sidebar under Database)
2. Under **"Tables in replication"**, toggle ON:
   - ✅ `batting_orders`
   - ✅ `lineups`
   - ✅ `saved_rotations`
   - ✅ `teams` (optional, for team name changes)

3. Click **"Save"**

---

## Part 4: Update Your React App (5 minutes)

### Step 4.1: Install Supabase

In your terminal:

```bash
npm install @supabase/supabase-js
```

### Step 4.2: Create `.env` File

In your project root (`/Users/mitchellmckinney/Softball-Lineup/`), create a file named `.env`:

```
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJxxxxx...
```

Replace `xxxxx` and `eyJxxxxx...` with your actual values from Step 1.3

### Step 4.3: Create Supabase Client

Create this file: `src/lib/supabase.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Step 4.4: Restart Your App

```bash
npm start
```

If you see errors about missing env vars, make sure:

1. `.env` file exists in project root (NOT in `src/`)
2. You restarted `npm start` after adding `.env`
3. Variable names are **exactly** `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

---

## Part 5: Test the Connection (2 minutes)

### Step 5.1: Create Test Component

Create `src/components/SupabaseTest.js`:

```javascript
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function SupabaseTest() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    const test = async () => {
      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .limit(1);
        if (error) {
          setStatus(`❌ Error: ${error.message}`);
        } else {
          setStatus("✅ Connected to Supabase!");
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err.message}`);
      }
    };
    test();
  }, []);

  return <div style={{ padding: "20px", fontSize: "18px" }}>{status}</div>;
}

export default SupabaseTest;
```

### Step 5.2: Add to App.js (Temporarily)

In `src/App.js`, add this to your routes:

```javascript
import SupabaseTest from "./components/SupabaseTest";

// Add to <Routes>:
<Route path='/test' element={<SupabaseTest />} />;
```

### Step 5.3: Visit `/test`

Go to http://localhost:3000/test

You should see: **✅ Connected to Supabase!**

(Remove this test component once verified)

---

## Part 6: Summary of What You Now Have

| Component              | What It Does                                            |
| ---------------------- | ------------------------------------------------------- |
| **Supabase Account**   | Cloud backend to store all data                         |
| **4 Database Tables**  | `teams`, `batting_orders`, `lineups`, `saved_rotations` |
| **Real-Time**          | Changes from one user appear instantly for all users    |
| **Row-Level Security** | Users can only see/edit their own team's data           |
| **React Connection**   | Your app can now read/write to database                 |

---

## What's Next?

You're now ready to:

1. ✅ **Add Authentication** - Let users sign up and log in
2. ✅ **Convert BattingOrder** - Replace localStorage with Supabase queries
3. ✅ **Convert LineupGenerator** - Same pattern for lineup data
4. ✅ **Add Real-Time Sync** - Multiple users see changes instantly
5. ✅ **Deploy** - Host on Vercel, Netlify, or Heroku

---

## Troubleshooting

### "Missing environment variables"

- Make sure `.env` is in project root, not in `src/`
- Restart `npm start` after adding `.env`
- Check spelling: `REACT_APP_SUPABASE_URL` (not `supabaseUrl`)

### "Connection failed"

- Go to Supabase Settings → API
- Copy URL and keys again
- Make sure they're in `.env` exactly

### "Row Level Security error"

- This means you're not authenticated yet
- Next step is to add login (see Part 7 below for preview)

---

## (Optional) Part 7: Add Authentication Preview

When ready, you can add login by installing:

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

Then in your App:

```javascript
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./lib/supabase";

function Login() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google", "github"]}
    />
  );
}
```

---

**You're ready! Let me know when you complete each part.**
