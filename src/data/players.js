import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-04T17:23:56.111Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Jonathan Taylor","RB","IND"], // 5 · avg 8.00
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.67
  ["Christian McCaffrey","RB","SF"], // 7 · avg 9.00
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.00
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Nico Collins","WR","HOU"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Saquon Barkley","RB","PHI"], // 16 · avg 16.67
  ["Brock Bowers","TE","LV"], // 17 · avg 18.67
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.00
  ["George Pickens","WR","DAL"], // 19 · avg 19.33
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.33
  ["Chris Olave","WR","NO"], // 22 · avg 21.67
  ["Omarion Hampton","RB","LAC"], // 23 · avg 21.67
  ["Trey McBride","TE","ARI"], // 24 · avg 21.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.33
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 26.67
  ["Rashee Rice","WR","KC"], // 29 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 34.00
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Javonte Williams","RB","DAL"], // 33 · avg 36.00
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.00
  ["Ladd McConkey","WR","LAC"], // 35 · avg 36.67
  ["Tetairoa McMillan","WR","CAR"], // 36 · avg 37.00
  ["Colston Loveland","TE","CHI"], // 37 · avg 37.33
  ["Drake Maye","QB","NE"], // 38 · avg 38.33
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.67
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 47.00
  ["Luther Burden III","WR","CHI"], // 44 · avg 48.00
  ["Terry McLaurin","WR","WAS"], // 45 · avg 48.00
  ["Ashton Jeanty","RB","LV"], // 46 · avg 26.33 · adj +22
  ["Jameson Williams","WR","DET"], // 47 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 48 · avg 37.00 · adj +12
  ["Bucky Irving","RB","TB"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.33 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 41.00 · adj +12
  ["Cam Skattebo","RB","NYG"], // 52 · avg 53.67
  ["Christian Watson","WR","GB"], // 53 · avg 53.67
  ["DJ Moore","WR","BUF"], // 54 · avg 54.00
  ["David Montgomery","RB","HOU"], // 55 · avg 57.00
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 57.00
  ["Jalen Hurts","QB","PHI"], // 57 · avg 58.00
  ["Jayden Daniels","QB","WAS"], // 58 · avg 58.33
  ["Rome Odunze","WR","CHI"], // 59 · avg 58.33
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.33
  ["Jadarian Price","RB","SEA"], // 61 · avg 62.00
  ["Mike Evans","WR","SF"], // 62 · avg 62.00
  ["Parker Washington","WR","JAC"], // 63 · avg 62.67
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.67
  ["Tyler Warren","TE","IND"], // 66 · avg 56.00 · adj +12
  ["Rhamondre Stevenson","RB","NE"], // 67 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.00
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 69.33
  ["Carnell Tate","WR","TEN"], // 70 · avg 71.33
  ["Jaylen Warren","RB","PIT"], // 71 · avg 71.33
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 72.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.00
  ["Tony Pollard","RB","TEN"], // 74 · avg 76.33
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 77.00
  ["DK Metcalf","WR","PIT"], // 76 · avg 77.00
  ["Chris Godwin Jr.","WR","TB"], // 77 · avg 79.33
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.67
  ["Rico Dowdle","RB","PIT"], // 79 · avg 80.67
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.00 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.67
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 83.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.67
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.67
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.00
  ["Michael Wilson","WR","ARI"], // 86 · avg 90.67
  ["Alec Pierce","WR","IND"], // 87 · avg 91.67
  ["Brock Purdy","QB","SF"], // 88 · avg 92.33
  ["Blake Corum","RB","LAR"], // 89 · avg 93.33
  ["Sam LaPorta","TE","DET"], // 90 · avg 81.67 · adj +12
  ["Bo Nix","QB","DEN"], // 91 · avg 95.00
  ["Jaxson Dart","QB","NYG"], // 92 · avg 95.33
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 95.67
  ["RJ Harvey","RB","DEN"], // 94 · avg 98.00
  ["MarShawn Lloyd","RB","GB"], // 95 · avg 98.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 97 · avg 101.67
  ["Jordan Mason","RB","MIN"], // 98 · avg 102.00
  ["Jayden Reed","WR","GB"], // 99 · avg 102.33
  ["Stefon Diggs","WR","WAS"], // 100 · avg 102.33
  ["Travis Kelce","TE","KC"], // 101 · avg 102.33
  ["Tyler Allgeier","RB","ARI"], // 102 · avg 130.33 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 103 · avg 90.67 · adj +12
  ["Wan'Dale Robinson","WR","TEN"], // 104 · avg 103.00
  ["George Kittle","TE","SF"], // 105 · avg 91.67 · adj +12
  ["Jared Goff","QB","DET"], // 106 · avg 104.33
  ["Jordan Addison","WR","MIN"], // 107 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 108 · avg 105.33
  ["Matthew Stafford","QB","LAR"], // 109 · avg 105.33
  ["Mike Washington Jr.","RB","LV"], // 110 · avg 143.33 · adj -38
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 106.00
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.33
  ["Josh Downs","WR","IND"], // 113 · avg 98.33 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 112.33
  ["Isaiah Likely","TE","NYG"], // 115 · avg 113.33
  ["Jakobi Meyers","WR","JAC"], // 116 · avg 113.33
  ["Kyler Murray","QB","MIN"], // 117 · avg 114.33
  ["KC Concepcion","WR","CLE"], // 118 · avg 114.67
  ["Dallas Goedert","TE","PHI"], // 119 · avg 115.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.00
  ["De'Zhaun Stribling","WR","SF"], // 121 · avg 119.67
  ["Baker Mayfield","QB","TB"], // 122 · avg 120.33
  ["Aaron Jones Sr.","RB","MIN"], // 123 · avg 120.67
  ["Matthew Golden","WR","GB"], // 124 · avg 124.67
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 125.33
  ["Jake Ferguson","TE","DAL"], // 126 · avg 126.33
  ["Xavier Worthy","WR","KC"], // 127 · avg 126.67
  ["Mark Andrews","TE","BAL"], // 128 · avg 127.00
  ["Romeo Doubs","WR","NE"], // 129 · avg 127.33
  ["Tyler Shough","QB","NO"], // 130 · avg 129.33
  ["Juwan Johnson","TE","NO"], // 131 · avg 130.00
  ["Jalen Coker","WR","CAR"], // 132 · avg 130.33
  ["Braelon Allen","RB","NYJ"], // 133 · avg 159.00 · adj -28
  ["Malik Willis","QB","MIA"], // 134 · avg 132.00
  ["Woody Marks","RB","HOU"], // 135 · avg 132.00
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.33 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 134.33
  ["Jalen McMillan","WR","TB"], // 138 · avg 163.67 · adj -28
  ["Deebo Samuel Sr.","WR","SF"], // 139 · avg 138.00
  ["Sam Darnold","QB","SEA"], // 140 · avg 138.00
  ["Jonah Coleman","RB","DEN"], // 141 · avg 138.67
  ["Rashid Shaheed","WR","SEA"], // 142 · avg 138.67
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.67
  ["Keaton Mitchell","RB","LAC"], // 144 · avg 143.33
  ["C.J. Stroud","QB","HOU"], // 145 · avg 144.67
  ["Daniel Jones","QB","IND"], // 146 · avg 147.33
  ["Dylan Sampson","RB","CLE"], // 147 · avg 148.67
  ["Denzel Boston","WR","CLE"], // 148 · avg 149.33
  ["Tank Bigsby","RB","PHI"], // 149 · avg 149.33
  ["Brenton Strange","TE","JAC"], // 150 · avg 150.67
  ["Hunter Henry","TE","NE"], // 151 · avg 150.67
  ["Josh Jacobs","RB","GB"], // 152 · avg 152.33
  ["Tre Tucker","WR","LV"], // 153 · avg 153.00
  ["Cam Ward","QB","TEN"], // 154 · avg 154.00
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 155.33
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 156.67
  ["Kayshon Boutte","WR","HOU"], // 157 · avg 158.33
  ["Dalton Schultz","TE","HOU"], // 158 · avg 160.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 159 · avg 162.00
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 162.67
  ["Emmett Johnson","RB","KC"], // 161 · avg 165.33
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 165.67
  ["Bryce Young","QB","CAR"], // 163 · avg 169.33
  ["Dontayvion Wicks","WR","PHI"], // 164 · avg 169.33
  ["Jauan Jennings","WR","MIN"], // 165 · avg 170.00
  ["Tre' Harris","WR","LAC"], // 166 · avg 173.33
  ["Omar Cooper Jr.","WR","NYJ"], // 167 · avg 174.00
  ["Ray Davis","RB","BUF"], // 168 · avg 174.33
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 176.33
  ["Pat Bryant","WR","DEN"], // 170 · avg 177.33
  ["Terrance Ferguson","TE","LAR"], // 171 · avg 177.67
  ["Zach Charbonnet","RB","SEA"], // 172 · avg 144.67 · adj +35
  ["Jalen Nailor","WR","LV"], // 173 · avg 181.00
  ["Isiah Pacheco","RB","DET"], // 174 · avg 182.33
  ["Malik Washington","WR","MIA"], // 175 · avg 186.33
  ["AJ Barner","TE","SEA"], // 176 · avg 186.67
  ["Kimani Vidal","RB","LAC"], // 177 · avg 189.00
  ["Keenan Allen","WR","IND"], // 178 · avg 189.33
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 189.33
  ["Brandon Aubrey","K","DAL"], // 180 · avg 191.33
  ["Calvin Ridley","WR","TEN"], // 181 · avg 191.67
  ["Travis Hunter","WR","JAC"], // 182 · avg 192.67
  ["Jacoby Brissett","QB","ARI"], // 183 · avg 194.33
  ["Jaylin Noel","WR","HOU"], // 184 · avg 194.33
  ["Kenyon Sadiq","TE","NYJ"], // 185 · avg 195.33
  ["Oronde Gadsden II","TE","LAC"], // 186 · avg 198.67
  ["Cameron Dicker","K","LAC"], // 187 · avg 199.00
  ["Ka'imi Fairbairn","K","HOU"], // 188 · avg 200.33
  ["Sean Tucker","RB","TB"], // 189 · avg 200.67
  ["Nicholas Singleton","RB","TEN"], // 190 · avg 202.00
  ["Rashod Bateman","WR","BAL"], // 191 · avg 205.67
  ["Alvin Kamara","RB","NO"], // 192 · avg 161.33 · adj +45
  ["Cam Little","K","JAC"], // 193 · avg 207.00
  ["Gunnar Helm","TE","TEN"], // 194 · avg 208.00
  ["Jason Myers","K","SEA"], // 195 · avg 208.00
  ["Ja'Kobi Lane","WR","BAL"], // 196 · avg 208.33
  ["James Conner","RB","ARI"], // 197 · avg 225.67 · adj -16
  ["Aaron Rodgers","QB","PIT"], // 198 · avg 210.33
  ["Pat Freiermuth","TE","PIT"], // 199 · avg 211.33
  ["Kaelon Black","RB","SF"], // 200 · avg 212.00
  ["Isaac TeSlaa","WR","DET"], // 201 · avg 213.00
  ["Malik Davis","RB","DAL"], // 202 · avg 214.33
  ["Eddy Pineiro","K","SF"], // 203 · avg 216.33
  ["Malachi Fields","WR","NYG"], // 204 · avg 217.00
  ["Kaytron Allen","RB","WAS"], // 205 · avg 217.67
  ["Tyler Loop","K","BAL"], // 206 · avg 219.67
  ["Chris Bell","WR","MIA"], // 207 · avg 221.00
  ["Jake Bates","K","DET"], // 208 · avg 221.33
  ["Cooper Kupp","WR","SEA"], // 209 · avg 222.67
  ["Zachariah Branch","WR","ATL"], // 210 · avg 223.33
  ["Darnell Mooney","WR","NYG"], // 211 · avg 224.00
  ["Kendre Miller","RB","NO"], // 212 · avg 274.67 · adj -50
  ["Geno Smith","QB","NYJ"], // 213 · avg 225.33
  ["Cade Otton","TE","TB"], // 214 · avg 226.00
  ["Jaylen Wright","RB","MIA"], // 215 · avg 226.67
  ["Najee Harris","RB","NYG"], // 216 · avg 227.67
  ["Emanuel Wilson","RB","SEA"], // 217 · avg 228.00
  ["George Holani","RB","SEA"], // 218 · avg 229.00
  ["Cairo Santos","K","CHI"], // 219 · avg 231.00
  ["Evan McPherson","K","CIN"], // 220 · avg 233.67
  ["Germie Bernard","WR","PIT"], // 221 · avg 235.00
  ["Troy Franklin","WR","DEN"], // 222 · avg 235.00
  ["Andy Borregales","K","NE"], // 223 · avg 235.33
  ["Harrison Mevis","K","LAR"], // 224 · avg 235.33
  ["Isaiah Davis","RB","NYJ"], // 225 · avg 264.00 · adj -28
  ["Jordyn Tyson","WR","NO"], // 226 · avg 137.33 · adj +100
  ["Tank Dell","WR","HOU"], // 227 · avg 237.67
  ["Justice Hill","RB","BAL"], // 228 · avg 238.67
  ["Chase McLaughlin","K","TB"], // 229 · avg 239.33
  ["Caleb Douglas","WR","MIA"], // 230 · avg 244.00
  ["Kaleb Johnson","RB","GB"], // 231 · avg 245.00
  ["Ted Hurst III","WR","TB"], // 232 · avg 245.00
  ["Devaughn Vele","WR","NO"], // 233 · avg 245.67
  ["Chris Brooks","RB","GB"], // 234 · avg 247.00
  ["Evan Engram","TE","DEN"], // 235 · avg 248.00
  ["Devin Neal","RB","FA"], // 236 · avg 299.33 · adj -50
  ["David Njoku","TE","LAC"], // 237 · avg 249.33
  ["Demond Claiborne","RB","MIN"], // 238 · avg 250.67
  ["Samaje Perine","RB","CIN"], // 239 · avg 253.00
  ["Fernando Mendoza","QB","LV"], // 240 · avg 254.33
  ["Jack Bech","WR","LV"], // 241 · avg 254.33
  ["Greg Dulcich","TE","MIA"], // 242 · avg 254.67
  ["Ollie Gordon II","RB","MIA"], // 243 · avg 256.33
  ["Harrison Butker","K","KC"], // 244 · avg 257.00
  ["Colby Parkinson","TE","LAR"], // 245 · avg 258.67
  ["Chris Boswell","K","PIT"], // 246 · avg 259.33
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 260.00
  ["Keon Coleman","WR","BUF"], // 248 · avg 249.67 · adj +12
  ["Jordan James","RB","SF"], // 249 · avg 263.33
  ["Chimere Dike","WR","TEN"], // 250 · avg 264.33
  ["Tyquan Thornton","WR","KC"], // 251 · avg 265.67
  ["Tory Horton","WR","SEA"], // 252 · avg 267.00
  ["Ty Johnson","RB","BUF"], // 253 · avg 268.33
  ["LeQuint Allen Jr.","RB","JAC"], // 254 · avg 269.33
  ["Seth McGowan","RB","IND"], // 255 · avg 269.33
  ["Cyrus Allen","WR","KC"], // 256 · avg 271.33
  ["Wil Lutz","K","DEN"], // 257 · avg 271.33
  ["Will Reichard","K","MIN"], // 258 · avg 275.67
  ["Darius Slayton","WR","NYG"], // 259 · avg 276.00
  ["Tua Tagovailoa","QB","ATL"], // 260 · avg 276.67
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 277.00
  ["DJ Giddens","RB","IND"], // 262 · avg 279.67
  ["Mason Taylor","TE","NYJ"], // 263 · avg 279.67
  ["Christian Kirk","WR","SF"], // 264 · avg 280.67
  ["Xavier Legette","WR","CAR"], // 265 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 266 · avg 281.67
  ["Marvin Mims Jr.","WR","DEN"], // 267 · avg 281.67
  ["Theo Johnson","TE","NYG"], // 268 · avg 283.67
  ["Deshaun Watson","QB","CLE"], // 269 · avg 286.67
  ["Kyle Williams","WR","NE"], // 270 · avg 286.67
  ["Michael Penix Jr.","QB","ATL"], // 271 · avg 276.33 · adj +12
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 288.67
  ["Eli Stowers","TE","PHI"], // 273 · avg 289.33
  ["Brashard Smith","RB","KC"], // 274 · avg 291.67
  ["Devin Singletary","RB","NYG"], // 275 · avg 293.33
  ["Adam Randall","RB","BAL"], // 276 · avg 294.33
  ["Jaydon Blue","RB","PHI"], // 277 · avg 295.33
  ["Emari Demercado","RB","DAL"], // 278 · avg 296.00
  ["Mack Hollins","WR","NE"], // 279 · avg 297.33
  ["Hollywood Brown","WR","PHI"], // 280 · avg 298.00
  ["Skyler Bell","WR","BUF"], // 281 · avg 298.33
  ["Isaiah Bond","WR","CLE"], // 282 · avg 302.00
  ["Mike Gesicki","TE","CIN"], // 283 · avg 303.00
  ["Trevor Etienne","RB","CAR"], // 284 · avg 305.33
  ["Brandon Aiyuk","WR","SF"], // 285 · avg 307.00
  ["Darren Waller","TE","CAR"], // 286 · avg 309.67
  ["Jake Tonges","TE","SF"], // 287 · avg 311.00
  ["Tahj Brooks","RB","CIN"], // 288 · avg 311.33
  ["Tez Johnson","WR","TB"], // 289 · avg 340.00 · adj -28
  ["Andrei Iosivas","WR","CIN"], // 290 · avg 312.33
  ["Isaac Guerendo","RB","SF"], // 291 · avg 313.00
  ["Audric Estime","RB","NO"], // 292 · avg 313.33
  ["DeMario Douglas","WR","NE"], // 293 · avg 313.33
  ["Jerome Ford","RB","WAS"], // 294 · avg 316.67
  ["Darnell Washington","TE","PIT"], // 295 · avg 317.33
  ["Will Shipley","RB","PHI"], // 296 · avg 318.00
  ["Jarquez Hunter","RB","FA"], // 297 · avg 319.00
  ["Tyreek Hill","WR","FA"], // 298 · avg 319.67
  ["Charlie Kolar","TE","LAC"], // 299 · avg 320.33
  ["Jaleel McLaughlin","RB","CLE"], // 300 · avg 321.00
  ["Michael Mayer","TE","LV"], // 301 · avg 321.00
  ["Oscar Delp","TE","NO"], // 302 · avg 321.67
  ["Jahan Dotson","WR","ATL"], // 303 · avg 324.33
  ["Charlie Smyth","K","NO"], // 304 · avg 325.33
  ["Bryce Lance","WR","NO"], // 305 · avg 327.67
  ["Xavier Hutchinson","WR","HOU"], // 306 · avg 328.00
  ["Kareem Hunt","RB","FA"], // 307 · avg 328.33
  ["Elijah Arroyo","TE","SEA"], // 308 · avg 329.67
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 330.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.33
  ["Dawson Knox","TE","BUF"], // 311 · avg 334.00
  ["Eli Raridon","TE","NE"], // 312 · avg 334.33
  ["Cole Kmet","TE","CHI"], // 313 · avg 337.00
  ["Bam Knight","RB","ARI"], // 314 · avg 337.67
  ["Kendrick Bourne","WR","ARI"], // 315 · avg 339.33
  ["Erick All Jr.","TE","CIN"], // 316 · avg 339.67
  ["Tyler Higbee","TE","LAR"], // 317 · avg 339.67
  ["Konata Mumpfield","WR","LAR"], // 318 · avg 343.67
  ["Brenen Thompson","WR","LAC"], // 319 · avg 345.33
  ["Joe Mixon","RB","FA"], // 320 · avg 345.67
  ["Max Klare","TE","LAR"], // 321 · avg 345.67
  ["Jalen Royals","WR","KC"], // 322 · avg 346.00
  ["Luke McCaffrey","WR","WAS"], // 323 · avg 347.00
  ["Olamide Zaccheaus","WR","ATL"], // 324 · avg 347.33
  ["Noah Gray","TE","KC"], // 325 · avg 348.00
  ["J.J. McCarthy","QB","MIN"], // 326 · avg 349.33
  ["Joshua Palmer","WR","BUF"], // 327 · avg 350.33
  ["Jake Elliott","K","PHI"], // 328 · avg 351.00
  ["Jacob Saylors","RB","DET"], // 329 · avg 353.33
  ["Tyler Bass","K","BUF"], // 330 · avg 355.00
  ["Mac Jones","QB","SF"], // 331 · avg 355.67
  ["Malik Benson","WR","LV"], // 332 · avg 356.33
  ["Roman Wilson","WR","PIT"], // 333 · avg 358.67
  ["Ja'Tavion Sanders","TE","CAR"], // 334 · avg 360.67
  ["Cedric Tillman","WR","NO"], // 335 · avg 361.00
  ["Treylon Burks","WR","WAS"], // 336 · avg 361.33
  ["Eli Heidenreich","RB","PIT"], // 337 · avg 362.00
  ["Trey Smack","K","GB"], // 338 · avg 363.67
  ["Justin Fields","QB","KC"], // 339 · avg 364.00
  ["Kalif Raymond","WR","CHI"], // 340 · avg 365.67
  ["Zavion Thomas","WR","CHI"], // 341 · avg 366.00
  ["Roschon Johnson","RB","CHI"], // 342 · avg 368.33
  ["Ty Simpson","QB","LAR"], // 343 · avg 368.67
  ["Michael Carter","RB","TEN"], // 344 · avg 369.00
  ["Raheim Sanders","RB","CLE"], // 345 · avg 372.00
  ["KaVontae Turpin","WR","DAL"], // 346 · avg 373.67
  ["Kevin Coleman Jr.","WR","MIA"], // 347 · avg 374.67
  ["Demarcus Robinson","WR","SF"], // 348 · avg 375.33
  ["Savion Williams","WR","GB"], // 349 · avg 377.00
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 379.67
];

export const DEF_NAMES = {
  ARI:"Cardinals", ATL:"Falcons", BAL:"Ravens", BUF:"Bills", CAR:"Panthers", CHI:"Bears",
  CIN:"Bengals", CLE:"Browns", DAL:"Cowboys", DEN:"Broncos", DET:"Lions", GB:"Packers",
  HOU:"Texans", IND:"Colts", JAX:"Jaguars", KC:"Chiefs", LV:"Raiders", LAC:"Chargers",
  LAR:"Rams", MIA:"Dolphins", MIN:"Vikings", NE:"Patriots", NO:"Saints", NYG:"Giants",
  NYJ:"Jets", PHI:"Eagles", PIT:"Steelers", SF:"49ers", SEA:"Seahawks", TB:"Buccaneers",
  TEN:"Titans", WAS:"Commanders",
};
export const PLAYER_DB = [
  ...RAW_DB,
  ...TEAMS.map((t) => [`${DEF_NAMES[t]} D/ST`, "DEF", t]),
].map(([name, pos, team], i) => ({ id: `db${i}`, name, pos, team, bye: TEAM_BYES[team] }));

/* ---------- estimated auction values (12-team, $200; DB is roughly rank-ordered) ---------- */
export const POS_LISTS = {};
PLAYER_DB.forEach((p) => { (POS_LISTS[p.pos] = POS_LISTS[p.pos] || []).push(p); });
export const POS_RANK = {};
Object.values(POS_LISTS).forEach((list) => list.forEach((p, i) => { POS_RANK[norm(p.name)] = i + 1; }));
export const OVERALL_RANK = {};
RAW_DB.forEach(([name], i) => { OVERALL_RANK[norm(name)] = i + 1; }); // 1–350 consensus board order (1QB)
