# INF552 Data Visualization - Project

## Topic

- "Game performance during a Counter Strike Global Offensive match"

Counter-Strike Global Offensive (CS:GO) is a 5v5 shooter, with a focus on team strategy, positioning, and managing in-game economy.

The developer of CS:GO would like to get a 'feel' for how their game plays, and if any modifications is required to fine-tune the game. Therefore, they have conducted a study of a professional game.

About CS:GO's ruleset: Matches are in a 'best-of-30' format, meaning that the first team to reach 16 rounds wins the round. In case of a 15-15 draw, the game goes into overtime until enough rounds a won by one of the team. Matches usually last around 40 minutes.

There are two 5 players team, which take the role of either "Counter-Terrorists" (CTs) or "Terrorists" (Ts), with roles being switched at halftime (i.e. once round 15 is reached). For the Terrorist team, the goal is to plant the bomb in one of the two sites available (A and B), and defend the bomb until it explodes. For the Counter-Terrorist team, the goal is to eliminate the Terrorist team and defuse the bomb if it has been planted.

Players receive monetary compensation after certain events, such as round ends, planting the bomb,or kills. This money must be managed carefully, as it is used in investing in weaponry or equipment, and a wrongful financial decisions can impact how well equipped a team is for several rounds.

The game locations, or "maps", are selected beforehand by players. 

## Data

CS:GO matches are available online as demo files, and have been parsed into CSV data using the open-source Python package [awpy](https://github.com/pnxenopoulos/awpy). CS:GO samples demo data at 64 hz, or 64 "ticks per second".

The CSV data includes keys with the following information:

| bombEvents.csv                                         | damages.csv                                              | grenades.csv                                         | kills.csv                                                | playerFrames.csv                          | rounds.csv                                  |
| ------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| Event Number (No key)                                  | Event Number (No key)                                    | Event Number (No key)                                | Event Number (No key)                                    | Event Number (No key)                     | Event Number (No key)                       |
| Round Number where event occurs ("roundNumber")        | Round Number where event occurs ("roundNumber")          | Round Number where event occurs ("roundNumber")      | Round Number ("roundNumber")                             | Round Number ("roundNumber")              | Round Number ("roundNumber")                |
| Bomb Event Start Tick ("tick")                         | Attack Event Start Tick ("tick")                         | ThrowEvent Start Tick ("throwTick")                  | Kill Tick ("tick")                                       | Current Tick ("tick")                     | Map name ("mapName")                        |
| Bomb Event time in the round ("seconds")               | Attack Event time in the round ("seconds")               | Throw Event time in the round ("throwSeconds")       | Kill Round time ("seconds")                              | Current Round time ("seconds")            | Match ID ("matchID")                        |
| Player doing the bomb event ("playerName")             | Attacker doing the damage ("attackerName")               | Thrower name ("throwerName")                         | Attacker doing the damage ("attackerName")               | Player name ("name")                      | Terrorist Team ("tTeam")                    |
| Team of the player doing the bomb event ("playerTeam") | Attacker Team ("attackerTeam")                           | Thrower position  ("greandeX","grenadeY","grenadeZ") | Attacker Team ("attackerTeam")                           | Player team ("team")                      | Counter-Terrorist team ("ctTeam")           |
| Player position during bomb event ("x","y","z")        | Attacker position  ("attackerX","attackerY","attackerZ") | Grenade type ("grenadeType")                         | Attacker position  ("attackerX","attackerY","attackerZ") | Player position ('x', 'y', 'z')           | Round End Reason ("roundEndReason")         |
| Bomb event type ("bombAction")                         | Victim receiving the damage ("victimName")               |                                                      | Victim dying ("victimName")                              | Is player Alive ('isAlive')               | Winning Team ("winningTeam")                |
| Site where the action occurs ("bombSite")              | Victim Team ("victimTeam")                               |                                                      | VictimTeam ("victimTeam")                                | Has the Bomb ('hasBomb')                  | T Money Spent ("tRoundSpendMoney")          |
| Map name ("mapName")                                   | Victimposition  ("victimX","victimY","victimZ")          |                                                      | Victim position  ("victimX","victimY","victimZ")         | 2D rotation ('viewX', 'viewY')            | T Equipment Value ("tFreezeTimeEndEqVal")   |
| Match ID ("matchID")                                   | Weapon used ("weapon")                                   |                                                      | Weapon used ("weapon")                                   | Current Money ('cash')                    | Winning Side ("winningSide")                |
|                                                        | HP damage ("hpDamage")                                   |                                                      | Is this a trade Kill ('isTrade')                         | Current Equipment Value ('equpmentValue') | CT Money Spent ("ctRoundSpendMoney")        |
|                                                        | Hit Body part ("hitGroup")                               |                                                      | Distance between players ('distance')                    | Active Weapon ('activeWeapon')            | CT Equipment Value ("ctFreezeTimeEndEqVal") |
|                                                        | Distance ("distance")                                    |                                                      | Is this the first kill ('isFirstKill')                   | Health Points ('hp')                      |                                             |
|                                                        | Map name ("mapName")                                     |                                                      |                                                          |                                           |                                             |
|                                                        | Match ID ("matchID")                                     |                                                      |                                                          |                                           |                                             |

Information we would like to visualize includes:

| CSV File         | Information to Visualize                                     | On which basis | Data Visualization format |
| ---------------- | ------------------------------------------------------------ | -------------- | ------------------------- |
| bombEvents.csv   | Bomb events for each round, by whom and when; Overview of bomb events for each players; Heatmap of bomb events on the map; Best defuser; best Planter | Game basis     |                           |
| damages.csv      | Total damage done per round per player; Total damage received per round per player; Heatmap of Attackers and Victims; Weapon most used; Body group hit the most by player | Game basis     |                           |
| grenades.csv     | Heatmap of thrown utility, which can be separated based on nature of utility | Game basis     |                           |
| kills.csv        | Heatmap of Kills; Total kills done per player; Total deaths per player; Weapon most used; Most trade kills | Game basis     |                           |
| playerFrames.csv | Live player location (position, rotation) if alive; Health points; Active weapon; Current Money; Has the bomb; Current Equipment value | Live Basis     |                           |
| rounds.csv       | Rounds score summary; Total money spent and equipment value  | Game basis     |                           |

---

## Proposed Visualizations

- Game Map (no data)

![de_dust2](C:\Users\Hadi\Desktop\de_dust2.png)

- Heatmap - All players encounters

![Capture](C:\Users\Hadi\Desktop\Capture.PNG)

- 2D Map - In-game utility usage

<img src="C:\Users\Hadi\Desktop\index.png" alt="index" style="zoom: 200%;" />

- Stacked Area Chart - In-game team economy

![area-charts-stacked-area-chart](C:\Users\Hadi\Desktop\area-charts-stacked-area-chart.png)

- Anatomy Diagram - Display where players inflicted most damage

![Capture2](C:\Users\Hadi\Desktop\Capture2.PNG)

- Bar Chart - Different type of game results (Most kills, most deaths, most bombs planted, round results/Team win conditions, most damage inflicted..)

![Capture1](C:\Users\Hadi\Desktop\Capture1.PNG)

## Questions

- Tables for visualization ?
- Do we have to provide a web-based platform to view our project ? (Switching from D3JS to Python Flask).