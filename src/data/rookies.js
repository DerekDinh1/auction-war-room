import { norm } from "../lib/names.js";

/**
 * 2026 NFL Draft class — skill / fantasy-relevant rookies on (or near) the board.
 * Keep in sync when refreshing rankings; sophomores (2025 class) stay unmarked.
 */
const ROOKIE_NAMES = [
  "Jeremiyah Love",
  "Jadarian Price",
  "Carnell Tate",
  "Jordyn Tyson",
  "Makai Lemon",
  "KC Concepcion",
  "De'Zhaun Stribling",
  "Jonah Coleman",
  "Mike Washington Jr.",
  "Denzel Boston",
  "Omar Cooper Jr.",
  "Fernando Mendoza",
  "Caleb Douglas",
  "Kenyon Sadiq",
  "Eli Stowers",
  "Emmett Johnson",
  "Germie Bernard",
  "Chris Bell",
  "Nicholas Singleton",
  "Kaelon Black",
  "Adam Randall",
  "Demond Claiborne",
  "Ty Simpson",
  "Carson Beck",
  "Zachariah Branch",
  "Ja'Kobi Lane",
  "Oscar Delp",
  "Malachi Fields",
  "Max Klare",
  // Out / limited but still first-year — useful if they reappear on the board
  "Chris Brazzell II",
  "Jayden Higgins",
];

const ROOKIE_KEYS = new Set(ROOKIE_NAMES.map((n) => norm(n)));

export const isRookie = (name) => ROOKIE_KEYS.has(norm(name));
