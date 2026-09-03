import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-03T17:33:30.147Z · 350 players · ordered by adjusted consensus rank
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
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 15.67
  ["Saquon Barkley","RB","PHI"], // 16 · avg 16.67
  ["Brock Bowers","TE","LV"], // 17 · avg 18.67
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.00
  ["George Pickens","WR","DAL"], // 19 · avg 19.33
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.67
  ["Omarion Hampton","RB","LAC"], // 22 · avg 21.33
  ["Chris Olave","WR","NO"], // 23 · avg 21.67
  ["Trey McBride","TE","ARI"], // 24 · avg 21.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 26.00
  ["DeVonta Smith","WR","PHI"], // 28 · avg 26.33
  ["Rashee Rice","WR","KC"], // 29 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 32.00
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.67
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Javonte Williams","RB","DAL"], // 33 · avg 36.00
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.00
  ["Ladd McConkey","WR","LAC"], // 35 · avg 36.33
  ["Tetairoa McMillan","WR","CAR"], // 36 · avg 36.67
  ["Colston Loveland","TE","CHI"], // 37 · avg 37.33
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 37.67
  ["Drake Maye","QB","NE"], // 39 · avg 38.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.67 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.33
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.33 · adj +22
  ["Jameson Williams","WR","DET"], // 46 · avg 48.67
  ["Luther Burden III","WR","CHI"], // 47 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 48 · avg 37.33 · adj +12
  ["Bucky Irving","RB","TB"], // 49 · avg 52.00
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.33 · adj +12
  ["Christian Watson","WR","GB"], // 51 · avg 53.00
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 41.33 · adj +12
  ["DJ Moore","WR","BUF"], // 53 · avg 54.67
  ["Cam Skattebo","RB","NYG"], // 54 · avg 55.00
  ["David Montgomery","RB","HOU"], // 55 · avg 56.67
  ["Jayden Daniels","QB","WAS"], // 56 · avg 57.00
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.67
  ["Jalen Hurts","QB","PHI"], // 58 · avg 58.00
  ["Rome Odunze","WR","CHI"], // 59 · avg 58.33
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.67
  ["Jadarian Price","RB","SEA"], // 61 · avg 62.00
  ["Mike Evans","WR","SF"], // 62 · avg 62.00
  ["Parker Washington","WR","JAC"], // 63 · avg 63.00
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.33
  ["Tyler Warren","TE","IND"], // 66 · avg 55.67 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 67 · avg 69.00
  ["Rhamondre Stevenson","RB","NE"], // 68 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Carnell Tate","WR","TEN"], // 70 · avg 71.00
  ["Jaylen Warren","RB","PIT"], // 71 · avg 71.33
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 72.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 73.67
  ["Brian Thomas Jr.","WR","JAC"], // 74 · avg 76.33
  ["DK Metcalf","WR","PIT"], // 75 · avg 77.33
  ["Tony Pollard","RB","TEN"], // 76 · avg 77.33
  ["Chris Godwin Jr.","WR","TB"], // 77 · avg 78.67
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.67
  ["Tucker Kraft","TE","GB"], // 79 · avg 68.33 · adj +12
  ["Rico Dowdle","RB","PIT"], // 80 · avg 81.00
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 82.00
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 83.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 84.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 86.00
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.00
  ["Alec Pierce","WR","IND"], // 86 · avg 91.00
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.33
  ["Brock Purdy","QB","SF"], // 88 · avg 93.00
  ["Sam LaPorta","TE","DET"], // 89 · avg 81.33 · adj +12
  ["Blake Corum","RB","LAR"], // 90 · avg 94.00
  ["MarShawn Lloyd","RB","GB"], // 91 · avg 94.33
  ["Jaxson Dart","QB","NYG"], // 92 · avg 94.67
  ["Bo Nix","QB","DEN"], // 93 · avg 95.00
  ["Chuba Hubbard","RB","CAR"], // 94 · avg 96.00
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.00
  ["Stefon Diggs","WR","WAS"], // 96 · avg 99.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 97 · avg 101.33
  ["Travis Kelce","TE","KC"], // 98 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 99 · avg 101.67
  ["Jordan Mason","RB","MIN"], // 100 · avg 102.00
  ["Jayden Reed","WR","GB"], // 101 · avg 102.33
  ["Tyler Allgeier","RB","ARI"], // 102 · avg 130.33 · adj -28
  ["Mike Washington Jr.","RB","LV"], // 103 · avg 140.67 · adj -38
  ["Michael Pittman Jr.","WR","PIT"], // 104 · avg 91.00 · adj +12
  ["Wan'Dale Robinson","WR","TEN"], // 105 · avg 103.33
  ["George Kittle","TE","SF"], // 106 · avg 92.00 · adj +12
  ["Jared Goff","QB","DET"], // 107 · avg 104.33
  ["Jordan Addison","WR","MIN"], // 108 · avg 104.67
  ["Dalton Kincaid","TE","BUF"], // 109 · avg 106.00
  ["Kenny Gainwell","RB","TB"], // 110 · avg 106.00
  ["Matthew Stafford","QB","LAR"], // 111 · avg 106.00
  ["Makai Lemon","WR","PHI"], // 112 · avg 108.00
  ["Josh Downs","WR","IND"], // 113 · avg 99.00 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 112.33
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 113.33
  ["Isaiah Likely","TE","NYG"], // 116 · avg 113.67
  ["Kyler Murray","QB","MIN"], // 117 · avg 115.00
  ["KC Concepcion","WR","CLE"], // 118 · avg 116.00
  ["Dallas Goedert","TE","PHI"], // 119 · avg 116.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.00
  ["Aaron Jones Sr.","RB","MIN"], // 121 · avg 120.33
  ["De'Zhaun Stribling","WR","SF"], // 122 · avg 120.33
  ["Baker Mayfield","QB","TB"], // 123 · avg 120.67
  ["Matthew Golden","WR","GB"], // 124 · avg 124.67
  ["Jake Ferguson","TE","DAL"], // 125 · avg 125.33
  ["Xavier Worthy","WR","KC"], // 126 · avg 125.67
  ["Chris Rodriguez Jr.","RB","JAC"], // 127 · avg 126.67
  ["Mark Andrews","TE","BAL"], // 128 · avg 127.33
  ["Braelon Allen","RB","NYJ"], // 129 · avg 155.67 · adj -28
  ["Romeo Doubs","WR","NE"], // 130 · avg 127.67
  ["Tyler Shough","QB","NO"], // 131 · avg 129.33
  ["Juwan Johnson","TE","NO"], // 132 · avg 130.33
  ["Jalen Coker","WR","CAR"], // 133 · avg 131.00
  ["Woody Marks","RB","HOU"], // 134 · avg 131.33
  ["Malik Willis","QB","MIA"], // 135 · avg 131.67
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 134.33
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 136.67
  ["Jalen McMillan","WR","TB"], // 139 · avg 165.67 · adj -28
  ["Rashid Shaheed","WR","SEA"], // 140 · avg 139.00
  ["Sam Darnold","QB","SEA"], // 141 · avg 139.00
  ["Jonah Coleman","RB","DEN"], // 142 · avg 139.33
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.33
  ["Keaton Mitchell","RB","LAC"], // 144 · avg 144.33
  ["C.J. Stroud","QB","HOU"], // 145 · avg 144.67
  ["Daniel Jones","QB","IND"], // 146 · avg 146.33
  ["Dylan Sampson","RB","CLE"], // 147 · avg 148.67
  ["Josh Jacobs","RB","GB"], // 148 · avg 149.67
  ["Tank Bigsby","RB","PHI"], // 149 · avg 149.67
  ["Hunter Henry","TE","NE"], // 150 · avg 150.33
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.67
  ["Denzel Boston","WR","CLE"], // 152 · avg 151.67
  ["Tre Tucker","WR","LV"], // 153 · avg 154.00
  ["Cam Ward","QB","TEN"], // 154 · avg 154.33
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 155.00
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 158.00
  ["Dalton Schultz","TE","HOU"], // 157 · avg 159.33
  ["Kayshon Boutte","WR","HOU"], // 158 · avg 160.00
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 160.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 160 · avg 162.00
  ["Emmett Johnson","RB","KC"], // 161 · avg 163.67
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 166.00
  ["Bryce Young","QB","CAR"], // 163 · avg 169.67
  ["Jauan Jennings","WR","MIN"], // 164 · avg 170.33
  ["Dontayvion Wicks","WR","PHI"], // 165 · avg 171.67
  ["Tre' Harris","WR","LAC"], // 166 · avg 171.67
  ["Ray Davis","RB","BUF"], // 167 · avg 174.00
  ["Omar Cooper Jr.","WR","NYJ"], // 168 · avg 175.00
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 177.00
  ["Pat Bryant","WR","DEN"], // 170 · avg 178.00
  ["Terrance Ferguson","TE","LAR"], // 171 · avg 178.67
  ["Isiah Pacheco","RB","DET"], // 172 · avg 179.00
  ["Zach Charbonnet","RB","SEA"], // 173 · avg 144.67 · adj +35
  ["Jalen Nailor","WR","LV"], // 174 · avg 182.00
  ["Malik Washington","WR","MIA"], // 175 · avg 186.33
  ["AJ Barner","TE","SEA"], // 176 · avg 186.67
  ["Keenan Allen","WR","IND"], // 177 · avg 188.00
  ["Kimani Vidal","RB","LAC"], // 178 · avg 188.00
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 189.67
  ["Brandon Aubrey","K","DAL"], // 180 · avg 190.00
  ["Calvin Ridley","WR","TEN"], // 181 · avg 192.67
  ["Travis Hunter","WR","JAC"], // 182 · avg 193.33
  ["Jacoby Brissett","QB","ARI"], // 183 · avg 194.33
  ["Jaylin Noel","WR","HOU"], // 184 · avg 195.33
  ["Kenyon Sadiq","TE","NYJ"], // 185 · avg 196.00
  ["Cameron Dicker","K","LAC"], // 186 · avg 197.00
  ["Ka'imi Fairbairn","K","HOU"], // 187 · avg 198.33
  ["Oronde Gadsden II","TE","LAC"], // 188 · avg 198.67
  ["Nicholas Singleton","RB","TEN"], // 189 · avg 201.00
  ["Sean Tucker","RB","TB"], // 190 · avg 201.00
  ["Ja'Kobi Lane","WR","BAL"], // 191 · avg 205.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 160.67 · adj +45
  ["Cam Little","K","JAC"], // 193 · avg 205.67
  ["James Conner","RB","ARI"], // 194 · avg 221.67 · adj -16
  ["Jason Myers","K","SEA"], // 195 · avg 207.00
  ["Rashod Bateman","WR","BAL"], // 196 · avg 207.33
  ["Gunnar Helm","TE","TEN"], // 197 · avg 208.67
  ["Aaron Rodgers","QB","PIT"], // 198 · avg 211.00
  ["Kaelon Black","RB","SF"], // 199 · avg 211.33
  ["Pat Freiermuth","TE","PIT"], // 200 · avg 211.33
  ["Eddy Pineiro","K","SF"], // 201 · avg 215.33
  ["Isaac TeSlaa","WR","DET"], // 202 · avg 215.33
  ["Kaytron Allen","RB","WAS"], // 203 · avg 216.67
  ["Malik Davis","RB","DAL"], // 204 · avg 216.67
  ["Tyler Loop","K","BAL"], // 205 · avg 218.67
  ["Cooper Kupp","WR","SEA"], // 206 · avg 221.67
  ["Jake Bates","K","DET"], // 207 · avg 221.67
  ["Malachi Fields","WR","NYG"], // 208 · avg 222.33
  ["Chris Bell","WR","MIA"], // 209 · avg 222.67
  ["Kendre Miller","RB","NO"], // 210 · avg 274.00 · adj -50
  ["Geno Smith","QB","NYJ"], // 211 · avg 224.33
  ["Darnell Mooney","WR","NYG"], // 212 · avg 226.00
  ["Jaylen Wright","RB","MIA"], // 213 · avg 226.33
  ["Najee Harris","RB","NYG"], // 214 · avg 226.67
  ["Cade Otton","TE","TB"], // 215 · avg 228.00
  ["Emanuel Wilson","RB","SEA"], // 216 · avg 228.33
  ["Zachariah Branch","WR","ATL"], // 217 · avg 228.33
  ["Cairo Santos","K","CHI"], // 218 · avg 229.33
  ["Evan McPherson","K","CIN"], // 219 · avg 230.67
  ["George Holani","RB","SEA"], // 220 · avg 231.00
  ["Harrison Mevis","K","LAR"], // 221 · avg 233.33
  ["Germie Bernard","WR","PIT"], // 222 · avg 236.33
  ["Troy Franklin","WR","DEN"], // 223 · avg 236.33
  ["Isaiah Davis","RB","NYJ"], // 224 · avg 265.00 · adj -28
  ["Jordyn Tyson","WR","NO"], // 225 · avg 138.67 · adj +100
  ["Andy Borregales","K","NE"], // 226 · avg 238.67
  ["Tank Dell","WR","HOU"], // 227 · avg 238.67
  ["Chase McLaughlin","K","TB"], // 228 · avg 239.00
  ["Justice Hill","RB","BAL"], // 229 · avg 241.00
  ["Caleb Douglas","WR","MIA"], // 230 · avg 242.33
  ["Kaleb Johnson","RB","GB"], // 231 · avg 243.67
  ["Devaughn Vele","WR","NO"], // 232 · avg 246.33
  ["Ted Hurst III","WR","TB"], // 233 · avg 246.33
  ["Chris Brooks","RB","GB"], // 234 · avg 247.00
  ["Evan Engram","TE","DEN"], // 235 · avg 248.67
  ["Devin Neal","RB","NO"], // 236 · avg 298.67 · adj -50
  ["David Njoku","TE","LAC"], // 237 · avg 249.00
  ["Samaje Perine","RB","CIN"], // 238 · avg 249.67
  ["Demond Claiborne","RB","MIN"], // 239 · avg 250.33
  ["Greg Dulcich","TE","MIA"], // 240 · avg 250.33
  ["Fernando Mendoza","QB","LV"], // 241 · avg 255.00
  ["Jack Bech","WR","LV"], // 242 · avg 255.67
  ["Harrison Butker","K","KC"], // 243 · avg 256.67
  ["Ollie Gordon II","RB","MIA"], // 244 · avg 257.00
  ["Chris Boswell","K","PIT"], // 245 · avg 258.00
  ["Colby Parkinson","TE","LAR"], // 246 · avg 260.33
  ["Jordan James","RB","SF"], // 247 · avg 261.33
  ["Keon Coleman","WR","BUF"], // 248 · avg 250.33 · adj +12
  ["Elic Ayomanor","WR","TEN"], // 249 · avg 263.67
  ["Chimere Dike","WR","TEN"], // 250 · avg 266.00
  ["Tyquan Thornton","WR","KC"], // 251 · avg 266.00
  ["Tory Horton","WR","SEA"], // 252 · avg 268.00
  ["Ty Johnson","RB","BUF"], // 253 · avg 268.00
  ["Cyrus Allen","WR","KC"], // 254 · avg 270.33
  ["LeQuint Allen Jr.","RB","JAC"], // 255 · avg 270.33
  ["Seth McGowan","RB","IND"], // 256 · avg 271.00
  ["Wil Lutz","K","DEN"], // 257 · avg 271.33
  ["Will Reichard","K","MIN"], // 258 · avg 274.67
  ["Elijah Sarratt","WR","BAL"], // 259 · avg 276.67
  ["Tua Tagovailoa","QB","ATL"], // 260 · avg 277.00
  ["Darius Slayton","WR","NYG"], // 261 · avg 277.33
  ["DJ Giddens","RB","IND"], // 262 · avg 278.00
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.67
  ["Kirk Cousins","QB","LV"], // 264 · avg 280.33
  ["Christian Kirk","WR","SF"], // 265 · avg 281.00
  ["Xavier Legette","WR","CAR"], // 266 · avg 281.00
  ["Marvin Mims Jr.","WR","DEN"], // 267 · avg 282.67
  ["Theo Johnson","TE","NYG"], // 268 · avg 285.00
  ["Kyle Williams","WR","NE"], // 269 · avg 286.67
  ["Deshaun Watson","QB","CLE"], // 270 · avg 287.33
  ["Michael Penix Jr.","QB","ATL"], // 271 · avg 275.67 · adj +12
  ["Eli Stowers","TE","PHI"], // 272 · avg 288.67
  ["Shedeur Sanders","QB","CLE"], // 273 · avg 289.00
  ["Jaydon Blue","RB","PHI"], // 274 · avg 292.33
  ["Brashard Smith","RB","KC"], // 275 · avg 292.67
  ["Devin Singletary","RB","NYG"], // 276 · avg 293.00
  ["Adam Randall","RB","BAL"], // 277 · avg 294.33
  ["Emari Demercado","RB","DAL"], // 278 · avg 295.67
  ["Mack Hollins","WR","NE"], // 279 · avg 298.33
  ["Hollywood Brown","WR","PHI"], // 280 · avg 299.00
  ["Mike Gesicki","TE","CIN"], // 281 · avg 299.00
  ["Skyler Bell","WR","BUF"], // 282 · avg 299.00
  ["Isaiah Bond","WR","CLE"], // 283 · avg 302.67
  ["Trevor Etienne","RB","CAR"], // 284 · avg 305.67
  ["Darren Waller","TE","CAR"], // 285 · avg 308.00
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 308.33
  ["Jake Tonges","TE","SF"], // 287 · avg 309.00
  ["Andrei Iosivas","WR","CIN"], // 288 · avg 312.00
  ["Tez Johnson","WR","TB"], // 289 · avg 340.00 · adj -28
  ["Tahj Brooks","RB","CIN"], // 290 · avg 312.67
  ["Darnell Washington","TE","PIT"], // 291 · avg 313.33
  ["Isaac Guerendo","RB","SF"], // 292 · avg 313.67
  ["DeMario Douglas","WR","NE"], // 293 · avg 314.00
  ["Jerome Ford","RB","WAS"], // 294 · avg 315.00
  ["Audric Estime","RB","NO"], // 295 · avg 316.00
  ["Tyreek Hill","WR","FA"], // 296 · avg 316.67
  ["Jarquez Hunter","RB","FA"], // 297 · avg 319.67
  ["Michael Mayer","TE","LV"], // 298 · avg 320.67
  ["Charlie Kolar","TE","LAC"], // 299 · avg 321.67
  ["Jahan Dotson","WR","ATL"], // 300 · avg 322.33
  ["Oscar Delp","TE","NO"], // 301 · avg 322.33
  ["Will Shipley","RB","PHI"], // 302 · avg 322.67
  ["Jaleel McLaughlin","RB","CLE"], // 303 · avg 323.33
  ["Charlie Smyth","K","NO"], // 304 · avg 324.33
  ["Xavier Hutchinson","WR","HOU"], // 305 · avg 326.67
  ["Bryce Lance","WR","NO"], // 306 · avg 328.00
  ["Elijah Arroyo","TE","SEA"], // 307 · avg 330.00
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.67
  ["Carson Beck","QB","ARI"], // 309 · avg 331.33
  ["Kareem Hunt","RB","FA"], // 310 · avg 331.67
  ["Dawson Knox","TE","BUF"], // 311 · avg 333.67
  ["Eli Raridon","TE","NE"], // 312 · avg 333.67
  ["Cole Kmet","TE","CHI"], // 313 · avg 338.33
  ["Tyler Higbee","TE","LAR"], // 314 · avg 338.33
  ["Konata Mumpfield","WR","LAR"], // 315 · avg 339.67
  ["Kendrick Bourne","WR","ARI"], // 316 · avg 340.00
  ["Erick All Jr.","TE","CIN"], // 317 · avg 343.00
  ["Luke McCaffrey","WR","WAS"], // 318 · avg 343.33
  ["Jalen Royals","WR","KC"], // 319 · avg 343.67
  ["J.J. McCarthy","QB","MIN"], // 320 · avg 344.00
  ["Joe Mixon","RB","FA"], // 321 · avg 344.00
  ["Olamide Zaccheaus","WR","ATL"], // 322 · avg 344.00
  ["Brenen Thompson","WR","LAC"], // 323 · avg 345.00
  ["Max Klare","TE","LAR"], // 324 · avg 345.67
  ["Joshua Palmer","WR","BUF"], // 325 · avg 348.33
  ["Noah Gray","TE","KC"], // 326 · avg 350.33
  ["Bam Knight","RB","ARI"], // 327 · avg 351.00
  ["Mac Jones","QB","SF"], // 328 · avg 352.33
  ["Tyler Bass","K","BUF"], // 329 · avg 353.00
  ["Jake Elliott","K","PHI"], // 330 · avg 356.67
  ["Roman Wilson","WR","PIT"], // 331 · avg 357.67
  ["Cedric Tillman","WR","NO"], // 332 · avg 358.00
  ["Treylon Burks","WR","WAS"], // 333 · avg 358.33
  ["Ja'Tavion Sanders","TE","CAR"], // 334 · avg 358.67
  ["Malik Benson","WR","LV"], // 335 · avg 359.00
  ["Jacob Saylors","RB","DET"], // 336 · avg 360.67
  ["Eli Heidenreich","RB","PIT"], // 337 · avg 362.00
  ["Justin Fields","QB","KC"], // 338 · avg 363.00
  ["Kalif Raymond","WR","CHI"], // 339 · avg 365.67
  ["Ty Simpson","QB","LAR"], // 340 · avg 365.67
  ["Roschon Johnson","RB","CHI"], // 341 · avg 368.33
  ["Trey Smack","K","GB"], // 342 · avg 368.33
  ["Zavion Thomas","WR","CHI"], // 343 · avg 368.33
  ["KaVontae Turpin","WR","DAL"], // 344 · avg 373.67
  ["Michael Carter","RB","TEN"], // 345 · avg 374.00
  ["Kevin Coleman Jr.","WR","MIA"], // 346 · avg 374.67
  ["Anthony Richardson Sr.","QB","IND"], // 347 · avg 375.33
  ["Savion Williams","WR","GB"], // 348 · avg 375.67
  ["Raheim Sanders","RB","CLE"], // 349 · avg 376.67
  ["Demarcus Robinson","WR","SF"], // 350 · avg 378.00
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
