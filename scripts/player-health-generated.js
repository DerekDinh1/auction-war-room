// Player health — updated 2026-08-24T03:31:42.188Z
// Sources: FantasyPros injury news (8/23); Yahoo Sports training camp tracker; Fantasy Alarm weekend injury roundup (8/23); CBS Sports camp tracker; Adam Schefter / team beat reporters
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
  [norm("Jeremiyah Love")]: { status: "Q", note: "High-ankle sprain — multi-week; Week 1 in doubt", sources: ["Fantasy Alarm","Yahoo Sports"], updatedAt: "2026-08-21" },
  [norm("Emeka Egbuka")]: { status: "Q", note: "Turf toe sprain — Week 1 availability in doubt", sources: ["Fantasy Alarm","Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Sam LaPorta")]: { status: "Q", note: "Hip/undisclosed — missed recent practice", sources: ["FantasyPros","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Puka Nacua")]: { status: "Q", note: "Groin soreness — minor per McVay, monitoring", sources: ["Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Kyle Monangai")]: { status: "D", note: "Hyperextended knee — multiple weeks, Week 1 in doubt", sources: ["Yahoo Sports","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Michael Pittman Jr.")]: { status: "Q", note: "Hamstring — minor, expected ready Week 1", sources: ["FantasyPros"], updatedAt: "2026-08-21" },
  [norm("George Kittle")]: { status: "Q", note: "Working back from Achilles; limited in camp", sources: ["AS USA"], updatedAt: "2026-08-20" },
};

