// Player health — updated 2026-08-31T19:50:56.168Z
// Sources: FantasyPros injury news (8/23); Yahoo Sports training camp tracker; Fantasy Alarm weekend injury roundup (8/23); CBS Sports camp tracker; Adam Schefter / team beat reporters; ESPN (8/25–26); CBS / NFL Network (8/26)
// Regenerate via: npm run refresh-board
const PLAYER_HEALTH = {
  [norm("Ashton Jeanty")]: { status: "D", note: "Right knee — helped off practice 8/23, unable to bear weight; team paused practice; awaiting MRI", sources: ["FantasyPros","Fantasy Alarm","Adam Schefter"], updatedAt: "2026-08-23" },
  [norm("Ricky Pearsall")]: { status: "OFS", note: "PCL surgery — out for 2026", sources: ["Yahoo Sports","CBS Sports"], updatedAt: "2026-08-20" },
  [norm("Chris Brazzell II")]: { status: "OFS", note: "LCL tear — out for 2026", sources: ["Yahoo Sports"], updatedAt: "2026-08-18" },
  [norm("Jayden Higgins")]: { status: "OFS", note: "Torn ACL — out for 2026 (Ian Rapoport)", sources: ["FantasyPros","Yahoo Sports"], updatedAt: "2026-08-20" },
  [norm("Jordyn Tyson")]: { status: "IR", note: "Hamstring — expected ~2 months, may start on IR", sources: ["Yahoo Sports","Fantasy Alarm","AS USA"], updatedAt: "2026-08-22" },
  [norm("Alvin Kamara")]: { status: "OUT", note: "MCL sprain — expected out ~1 month", sources: ["Fantasy Alarm"], updatedAt: "2026-08-22" },
  [norm("Zach Charbonnet")]: { status: "PUP", note: "ACL recovery — has not returned to practice (active/PUP)", sources: ["Yahoo Sports","Fantasy Alarm","AS USA"], updatedAt: "2026-08-22" },
  [norm("Breece Hall")]: { status: "Q", note: "Groin — expected out 2–3 weeks; team hopeful for Week 1", sources: ["AS USA","Fantasy Alarm"], updatedAt: "2026-08-22" },
  [norm("Jeremiyah Love")]: { status: "Q", note: "High-ankle sprain — light agility work 8/26; multi-week, Week 1 in doubt", sources: ["ESPN","Fantasy Alarm","Arizona Republic"], updatedAt: "2026-08-26" },
  [norm("Emeka Egbuka")]: { status: "Q", note: "Turf toe sprain — Week 1 availability in doubt", sources: ["Fantasy Alarm","Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Sam LaPorta")]: { status: "Q", note: "Hip/undisclosed — missed recent practice", sources: ["FantasyPros","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Puka Nacua")]: { status: "Q", note: "Groin soreness — minor per McVay, monitoring", sources: ["Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Kyle Monangai")]: { status: "D", note: "Hyperextended knee — multiple weeks, Week 1 in doubt", sources: ["Yahoo Sports","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Michael Pittman Jr.")]: { status: "Q", note: "Hamstring — minor, expected ready Week 1", sources: ["FantasyPros"], updatedAt: "2026-08-21" },
  [norm("George Kittle")]: { status: "Q", note: "Working back from Achilles; limited in camp", sources: ["AS USA"], updatedAt: "2026-08-20" },
  [norm("Ja'Marr Chase")]: { status: "Q", note: "Left knee hyperextension — limped off 8/25 practice; held out 8/26 precaution; says he's fine, unlikely for preseason finale", sources: ["ESPN","Cincy Jungle","WCPO"], updatedAt: "2026-08-26" },
  [norm("Zay Flowers")]: { status: "Q", note: "Undisclosed — held out of 8/26 practice precaution; expected ready for Week 1", sources: ["ESPN","Baltimore Sun"], updatedAt: "2026-08-26" },
  [norm("Tyler Warren")]: { status: "Q", note: "Groin — expected out through this week; load-managed for Week 1", sources: ["CBS Sports","Colts beat"], updatedAt: "2026-08-26" },
  [norm("James Conner")]: { status: "Q", note: "Foot — coach says too early to tell on Week 1 availability (8/26)", sources: ["ESPN","Arizona Republic"], updatedAt: "2026-08-26" },
  [norm("Keon Coleman")]: { status: "Q", note: "Sprained foot/toe — injured in Bills preseason opener", sources: ["NFL Network","CBS Sports"], updatedAt: "2026-08-26" },
  [norm("Michael Penix Jr.")]: { status: "Q", note: "Knee — won't play preseason finale; hopeful for Week 1 at Pittsburgh", sources: ["ESPN","Falcons beat"], updatedAt: "2026-08-26" },
  [norm("Trey Benson")]: { status: "IR", note: "Knee — reverted to IR 8/25", sources: ["CBS Sports","ESPN"], updatedAt: "2026-08-25" },
  [norm("Josh Downs")]: { status: "Q", note: "Calf — minor; believes he'll resume practicing soon (8/26)", sources: ["ESPN","Colts beat"], updatedAt: "2026-08-26" },
  [norm("Tucker Kraft")]: { status: "Q", note: "Knee — returned to team drills 8/26; still monitoring", sources: ["NFL.com","ESPN"], updatedAt: "2026-08-26" },
};

