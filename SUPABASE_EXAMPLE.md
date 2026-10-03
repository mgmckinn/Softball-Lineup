<!-- @format -->

# Supabase Implementation Example: BattingOrder Component

## Step 1: Create Supabase Client

Create a new file: `src/lib/supabase.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Add to `.env`:

```
REACT_APP_SUPABASE_URL=your_url_from_supabase
REACT_APP_SUPABASE_ANON_KEY=your_key_from_supabase
```

---

## Step 2: Database Schema (Supabase SQL)

```sql
-- Users table (auto-created by Supabase Auth)

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  team_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Batting orders table
CREATE TABLE batting_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  players JSONB NOT NULL DEFAULT '[]',  -- [{id, name}, ...]
  primary_color TEXT DEFAULT '#FF6600',
  text_color TEXT DEFAULT '#FFFFFF',
  sponsor_logo TEXT,  -- base64 image
  team_logo TEXT,     -- base64 image
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable Real-Time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE batting_orders;
```

---

## Step 3: Convert BattingOrder Component

### BEFORE (localStorage):

```javascript
const [players, setPlayers] = useLocalStorage(
  "battingOrderPlayers",
  defaultPlayers.map((name, index) => ({ id: index + 1, name })),
);
```

### AFTER (Supabase with real-time):

```javascript
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function BattingOrder() {
  const [players, setPlayers] = useState([]);
  const [primaryColor, setPrimaryColor] = useState("#FF6600");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [sponsorLogo, setSponsorLogo] = useState(null);
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamName, setTeamName] = useState("Sunny D's Batting Order");
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(teamName);
  const [teamId, setTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultPlayers = [
    "Elizabeth",
    "Dakota",
    "Hadley",
    "Madelyn O",
    "Camille",
    "Charley",
    "Braelynn",
    "Madelyn M",
  ];

  // On mount: get current user & load team data
  useEffect(() => {
    const getCurrentUserTeam = async () => {
      try {
        // Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user logged in");
          setLoading(false);
          return;
        }

        // Get or create user's team
        let { data: team, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("owner_id", user.id)
          .single();

        if (teamError && teamError.code === "PGRST116") {
          // No team yet, create one
          const { data: newTeam } = await supabase
            .from("teams")
            .insert([
              { owner_id: user.id, team_name: "Sunny D's Batting Order" },
            ])
            .select()
            .single();
          team = newTeam;
        }

        setTeamId(team.id);
        setTeamName(team.team_name);

        // Load batting order data
        let { data: battingData } = await supabase
          .from("batting_orders")
          .select("*")
          .eq("team_id", team.id)
          .single();

        if (!battingData) {
          // Create default batting order
          const defaultData = {
            team_id: team.id,
            players: defaultPlayers.map((name, i) => ({ id: i + 1, name })),
            primary_color: "#FF6600",
            text_color: "#FFFFFF",
          };
          await supabase
            .from("batting_orders")
            .insert([defaultData])
            .select()
            .then((res) => (battingData = res.data[0]));
        }

        setPlayers(battingData.players || []);
        setPrimaryColor(battingData.primary_color);
        setTextColor(battingData.text_color);
        setSponsorLogo(battingData.sponsor_logo);
        setTeamLogo(battingData.team_logo);

        setLoading(false);
      } catch (error) {
        console.error("Error loading team:", error);
        setLoading(false);
      }
    };

    getCurrentUserTeam();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!teamId) return;

    const subscription = supabase
      .from("batting_orders")
      .on("*", (payload) => {
        if (payload.new.team_id === teamId) {
          setPlayers(payload.new.players);
          setPrimaryColor(payload.new.primary_color);
          setTextColor(payload.new.text_color);
          setSponsorLogo(payload.new.sponsor_logo);
          setTeamLogo(payload.new.team_logo);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [teamId]);

  // Save players to database
  const saveBattingOrder = async (newPlayers) => {
    if (!teamId) return;

    const { error } = await supabase
      .from("batting_orders")
      .update({ players: newPlayers, updated_at: new Date() })
      .eq("team_id", teamId);

    if (error) console.error("Error saving players:", error);
  };

  const addName = () => {
    const playerName = newName.trim();
    if (playerName) {
      const newPlayers = [
        ...players,
        { id: players.length + Date.now(), name: playerName },
      ];
      setPlayers(newPlayers);
      saveBattingOrder(newPlayers);
      setNewName("");
    }
  };

  const removeName = (id) => {
    const player = players.find((p) => p.id === id);
    if (player && window.confirm(`Remove ${player.name}?`)) {
      const newPlayers = players.filter((p) => p.id !== id);
      setPlayers(newPlayers);
      saveBattingOrder(newPlayers);
    }
  };

  const handleTeamNameSave = async () => {
    const newName = teamNameInput.trim();
    if (newName && teamId) {
      const { error } = await supabase
        .from("teams")
        .update({ team_name: newName })
        .eq("id", teamId);

      if (!error) {
        setTeamName(newName);
      }
      setIsEditingTeamName(false);
    }
  };

  const handlePrimaryColorChange = async (newColor) => {
    setPrimaryColor(newColor);
    if (teamId) {
      await supabase
        .from("batting_orders")
        .update({ primary_color: newColor })
        .eq("team_id", teamId);
    }
  };

  const handleTextColorChange = async (newColor) => {
    setTextColor(newColor);
    if (teamId) {
      await supabase
        .from("batting_orders")
        .update({ text_color: newColor })
        .eq("team_id", teamId);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='batting-order-page'>
      {/* Rest of JSX stays the same, but update event handlers */}
      {/* ... */}
    </div>
  );
}

export default BattingOrder;
```

---

## Step 4: Key Differences Explained

| Aspect             | localStorage                                           | Supabase                   |
| ------------------ | ------------------------------------------------------ | -------------------------- |
| **Persistence**    | Browser only                                           | Cloud database             |
| **Real-time**      | Manual refresh needed                                  | Auto-sync via subscription |
| **Multiple users** | Each has separate data                                 | All share & see updates    |
| **Code change**    | `useLocalStorage()` → `useState()` + `supabase.from()` |
| **Network**        | None                                                   | HTTP/WebSocket             |
| **Init time**      | Instant                                                | ~500ms (one-time fetch)    |

---

## Step 5: What Happens When Multiple Users Access

### Scenario: Two people on the same team

1. **User A** clicks to remove a player
   - Updates database: `batting_orders.players`
   - Supabase broadcasts change via WebSocket

2. **User B's app** receives update instantly
   - Real-time subscription triggers
   - `setPlayers()` re-renders with new data
   - User B sees player removed without refreshing

3. **User A updates team name**
   - Updates database: `teams.team_name`
   - User B sees new name in real-time

---

## Next Steps to Implement

1. Create Supabase free account (supabase.com)
2. Run the SQL schema above in the SQL editor
3. Get your URL & API key from Settings
4. Update `.env` file
5. Start converting each component (LineupGenerator, RotationLog, etc.)
6. Add login screen using Supabase Auth

---

## Common Patterns You'll Use Everywhere

**Fetch data:**

```javascript
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("team_id", teamId);
```

**Insert data:**

```javascript
await supabase.from("table_name").insert([
  {
    /* fields */
  },
]);
```

**Update data:**

```javascript
await supabase.from("table_name").update({ field: value }).eq("id", id);
```

**Real-time subscribe:**

```javascript
supabase
  .from("table_name")
  .on("*", (payload) => {
    // Handle update
  })
  .subscribe();
```

---

## Want to See More?

- Authentication setup example
- LineupGenerator conversion
- Full error handling
- Team sharing/permissions
- Conflict resolution for simultaneous edits
