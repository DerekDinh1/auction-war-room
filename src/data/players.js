import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-05T16:33:49.435Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Christian McCaffrey","RB","SF"], // 5 · avg 8.33
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 8.67
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.33
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.00
  ["Nico Collins","WR","HOU"], // 13 · avg 15.00
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.00
  ["Brock Bowers","TE","LV"], // 17 · avg 18.00
  ["George Pickens","WR","DAL"], // 18 · avg 19.33
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 48.33 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.67
  ["Chris Olave","WR","NO"], // 22 · avg 21.00
  ["Trey McBride","TE","ARI"], // 23 · avg 21.00
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.00
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.33
  ["Josh Allen","QB","BUF"], // 26 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 27 · avg 26.00
  ["Malik Nabers","WR","NYG"], // 28 · avg 26.00
  ["Rashee Rice","WR","KC"], // 29 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.00
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.67
  ["Javonte Williams","RB","DAL"], // 33 · avg 36.00
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.67
  ["Ladd McConkey","WR","LAC"], // 35 · avg 37.00
  ["Tetairoa McMillan","WR","CAR"], // 36 · avg 37.00
  ["Colston Loveland","TE","CHI"], // 37 · avg 38.00
  ["Drake Maye","QB","NE"], // 38 · avg 38.00
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.00 · adj +12
  ["Joe Burrow","QB","CIN"], // 41 · avg 43.33
  ["Travis Etienne Jr.","RB","NO"], // 42 · avg 44.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 48.00
  ["Luther Burden III","WR","CHI"], // 45 · avg 48.67
  ["Ashton Jeanty","RB","LV"], // 46 · avg 27.33 · adj +22
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.33 · adj +12
  ["Jameson Williams","WR","DET"], // 48 · avg 49.33
  ["Bucky Irving","RB","TB"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["Cam Skattebo","RB","NYG"], // 51 · avg 53.33
  ["DJ Moore","WR","BUF"], // 52 · avg 53.33
  ["Jeremiyah Love","RB","ARI"], // 53 · avg 41.67 · adj +12
  ["Christian Watson","WR","GB"], // 54 · avg 54.33
  ["David Montgomery","RB","HOU"], // 55 · avg 56.33
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.33
  ["Jalen Hurts","QB","PHI"], // 57 · avg 56.67
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.33
  ["Jayden Daniels","QB","WAS"], // 59 · avg 59.00
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.67
  ["Jadarian Price","RB","SEA"], // 61 · avg 62.00
  ["Mike Evans","WR","SF"], // 62 · avg 63.00
  ["Parker Washington","WR","JAC"], // 63 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.67
  ["Tyler Warren","TE","IND"], // 66 · avg 55.67 · adj +12
  ["Rhamondre Stevenson","RB","NE"], // 67 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.00
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 69.67
  ["Jaylen Warren","RB","PIT"], // 70 · avg 71.33
  ["Carnell Tate","WR","TEN"], // 71 · avg 71.67
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 72.00
  ["Dak Prescott","QB","DAL"], // 73 · avg 73.67
  ["Tony Pollard","RB","TEN"], // 74 · avg 76.33
  ["DK Metcalf","WR","PIT"], // 75 · avg 77.00
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 78.00
  ["Rico Dowdle","RB","PIT"], // 77 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 79.67
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.00 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.67
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 82.67
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.67
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.00
  ["Alec Pierce","WR","IND"], // 86 · avg 91.67
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.67
  ["Blake Corum","RB","LAR"], // 88 · avg 92.00
  ["Brock Purdy","QB","SF"], // 89 · avg 92.67
  ["Sam LaPorta","TE","DET"], // 90 · avg 81.67 · adj +12
  ["Bo Nix","QB","DEN"], // 91 · avg 94.00
  ["Chuba Hubbard","RB","CAR"], // 92 · avg 95.67
  ["Jaxson Dart","QB","NYG"], // 93 · avg 97.00
  ["MarShawn Lloyd","RB","GB"], // 94 · avg 97.00
  ["RJ Harvey","RB","DEN"], // 95 · avg 98.33
  ["Stefon Diggs","WR","WAS"], // 96 · avg 99.00
  ["Jordan Mason","RB","MIN"], // 97 · avg 100.67
  ["Patrick Mahomes II","QB","KC"], // 98 · avg 101.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 99 · avg 102.00
  ["Michael Pittman Jr.","WR","PIT"], // 100 · avg 90.33 · adj +12
  ["Travis Kelce","TE","KC"], // 101 · avg 102.33
  ["Jayden Reed","WR","GB"], // 102 · avg 102.67
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.00 · adj -28
  ["George Kittle","TE","SF"], // 104 · avg 92.00 · adj +12
  ["Wan'Dale Robinson","WR","TEN"], // 105 · avg 104.00
  ["Jared Goff","QB","DET"], // 106 · avg 104.33
  ["Jordan Addison","WR","MIN"], // 107 · avg 105.00
  ["Kenny Gainwell","RB","TB"], // 108 · avg 105.00
  ["Mike Washington Jr.","RB","LV"], // 109 · avg 143.00 · adj -38
  ["Matthew Stafford","QB","LAR"], // 110 · avg 105.33
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 107.33
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.67
  ["Josh Downs","WR","IND"], // 113 · avg 99.33 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 112.00
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 113.00
  ["Isaiah Likely","TE","NYG"], // 116 · avg 115.00
  ["KC Concepcion","WR","CLE"], // 117 · avg 115.33
  ["Kyler Murray","QB","MIN"], // 118 · avg 115.33
  ["Dallas Goedert","TE","PHI"], // 119 · avg 116.33
  ["De'Zhaun Stribling","WR","SF"], // 120 · avg 118.33
  ["Jordan Love","QB","GB"], // 121 · avg 118.33
  ["Aaron Jones Sr.","RB","MIN"], // 122 · avg 120.00
  ["Baker Mayfield","QB","TB"], // 123 · avg 120.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 124.33
  ["Matthew Golden","WR","GB"], // 125 · avg 125.33
  ["Mark Andrews","TE","BAL"], // 126 · avg 125.67
  ["Jake Ferguson","TE","DAL"], // 127 · avg 127.33
  ["Xavier Worthy","WR","KC"], // 128 · avg 127.33
  ["Romeo Doubs","WR","NE"], // 129 · avg 127.67
  ["Tyler Shough","QB","NO"], // 130 · avg 128.00
  ["Juwan Johnson","TE","NO"], // 131 · avg 129.00
  ["Braelon Allen","RB","NYJ"], // 132 · avg 158.67 · adj -28
  ["Jalen Coker","WR","CAR"], // 133 · avg 131.33
  ["Woody Marks","RB","HOU"], // 134 · avg 131.67
  ["Malik Willis","QB","MIA"], // 135 · avg 132.33
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.33 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 134.33
  ["Jalen McMillan","WR","TB"], // 138 · avg 163.67 · adj -28
  ["Sam Darnold","QB","SEA"], // 139 · avg 137.67
  ["Jonah Coleman","RB","DEN"], // 140 · avg 138.67
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 138.67
  ["Deebo Samuel Sr.","WR","SF"], // 142 · avg 139.00
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.00
  ["Keaton Mitchell","RB","LAC"], // 144 · avg 144.00
  ["C.J. Stroud","QB","HOU"], // 145 · avg 144.67
  ["Daniel Jones","QB","IND"], // 146 · avg 146.00
  ["Josh Jacobs","RB","GB"], // 147 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 148 · avg 148.67
  ["Tank Bigsby","RB","PHI"], // 149 · avg 148.67
  ["Denzel Boston","WR","CLE"], // 150 · avg 149.00
  ["Hunter Henry","TE","NE"], // 151 · avg 150.00
  ["Tre Tucker","WR","LV"], // 152 · avg 152.00
  ["Brenton Strange","TE","JAC"], // 153 · avg 152.33
  ["Cam Ward","QB","TEN"], // 154 · avg 154.67
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 155.33
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 158.00
  ["Kayshon Boutte","WR","HOU"], // 157 · avg 158.67
  ["Dalton Schultz","TE","HOU"], // 158 · avg 159.33
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 161.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 160 · avg 163.00
  ["Emmett Johnson","RB","KC"], // 161 · avg 164.67
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 166.33
  ["Bryce Young","QB","CAR"], // 163 · avg 167.33
  ["Jauan Jennings","WR","MIN"], // 164 · avg 167.67
  ["Dontayvion Wicks","WR","PHI"], // 165 · avg 169.33
  ["Tre' Harris","WR","LAC"], // 166 · avg 173.67
  ["Omar Cooper Jr.","WR","NYJ"], // 167 · avg 174.33
  ["Ray Davis","RB","BUF"], // 168 · avg 174.33
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 175.00
  ["Jalen Nailor","WR","LV"], // 170 · avg 177.67
  ["Pat Bryant","WR","DEN"], // 171 · avg 178.33
  ["Terrance Ferguson","TE","LAR"], // 172 · avg 178.67
  ["Zach Charbonnet","RB","SEA"], // 173 · avg 145.00 · adj +35
  ["AJ Barner","TE","SEA"], // 174 · avg 185.00
  ["Malik Washington","WR","MIA"], // 175 · avg 185.00
  ["Kimani Vidal","RB","LAC"], // 176 · avg 187.67
  ["Keenan Allen","WR","IND"], // 177 · avg 188.33
  ["T.J. Hockenson","TE","MIN"], // 178 · avg 188.33
  ["Isiah Pacheco","RB","DET"], // 179 · avg 189.00
  ["Calvin Ridley","WR","TEN"], // 180 · avg 189.67
  ["Brandon Aubrey","K","DAL"], // 181 · avg 190.00
  ["Jacoby Brissett","QB","ARI"], // 182 · avg 194.33
  ["Jaylin Noel","WR","HOU"], // 183 · avg 194.33
  ["Cameron Dicker","K","LAC"], // 184 · avg 197.67
  ["Travis Hunter","WR","JAC"], // 185 · avg 197.67
  ["Kenyon Sadiq","TE","NYJ"], // 186 · avg 198.00
  ["Sean Tucker","RB","TB"], // 187 · avg 200.00
  ["Oronde Gadsden II","TE","LAC"], // 188 · avg 200.33
  ["Ka'imi Fairbairn","K","HOU"], // 189 · avg 200.67
  ["Nicholas Singleton","RB","TEN"], // 190 · avg 202.00
  ["Alvin Kamara","RB","NO"], // 191 · avg 160.33 · adj +45
  ["Ja'Kobi Lane","WR","BAL"], // 192 · avg 205.33
  ["Rashod Bateman","WR","BAL"], // 193 · avg 205.33
  ["Cam Little","K","JAC"], // 194 · avg 207.67
  ["Jason Myers","K","SEA"], // 195 · avg 208.00
  ["Gunnar Helm","TE","TEN"], // 196 · avg 208.33
  ["Aaron Rodgers","QB","PIT"], // 197 · avg 209.00
  ["Kaelon Black","RB","SF"], // 198 · avg 209.33
  ["Malik Davis","RB","DAL"], // 199 · avg 209.67
  ["Isaac TeSlaa","WR","DET"], // 200 · avg 214.00
  ["Pat Freiermuth","TE","PIT"], // 201 · avg 214.33
  ["James Conner","RB","ARI"], // 202 · avg 231.67 · adj -16
  ["Eddy Pineiro","K","SF"], // 203 · avg 216.33
  ["Malachi Fields","WR","NYG"], // 204 · avg 217.33
  ["Kaytron Allen","RB","WAS"], // 205 · avg 217.67
  ["Chris Bell","WR","MIA"], // 206 · avg 218.67
  ["Tyler Loop","K","BAL"], // 207 · avg 218.67
  ["Zachariah Branch","WR","ATL"], // 208 · avg 220.33
  ["Jake Bates","K","DET"], // 209 · avg 222.00
  ["Darnell Mooney","WR","NYG"], // 210 · avg 222.67
  ["Geno Smith","QB","NYJ"], // 211 · avg 222.67
  ["Cooper Kupp","WR","SEA"], // 212 · avg 223.33
  ["Kendre Miller","RB","NO"], // 213 · avg 276.00 · adj -50
  ["Jaylen Wright","RB","MIA"], // 214 · avg 226.67
  ["Najee Harris","RB","NYG"], // 215 · avg 228.00
  ["Cade Otton","TE","TB"], // 216 · avg 228.33
  ["Emanuel Wilson","RB","SEA"], // 217 · avg 228.67
  ["George Holani","RB","SEA"], // 218 · avg 229.00
  ["Cairo Santos","K","CHI"], // 219 · avg 230.33
  ["Evan McPherson","K","CIN"], // 220 · avg 232.67
  ["Germie Bernard","WR","PIT"], // 221 · avg 234.33
  ["Troy Franklin","WR","DEN"], // 222 · avg 234.33
  ["Isaiah Davis","RB","NYJ"], // 223 · avg 263.00 · adj -28
  ["Andy Borregales","K","NE"], // 224 · avg 236.33
  ["Justice Hill","RB","BAL"], // 225 · avg 237.00
  ["Harrison Mevis","K","LAR"], // 226 · avg 237.33
  ["Jordyn Tyson","WR","NO"], // 227 · avg 139.67 · adj +100
  ["Chase McLaughlin","K","TB"], // 228 · avg 242.33
  ["Kaleb Johnson","RB","GB"], // 229 · avg 242.67
  ["Tank Dell","WR","HOU"], // 230 · avg 243.33
  ["Chris Brooks","RB","GB"], // 231 · avg 244.00
  ["Caleb Douglas","WR","MIA"], // 232 · avg 244.33
  ["Devaughn Vele","WR","NO"], // 233 · avg 245.33
  ["Ted Hurst III","WR","TB"], // 234 · avg 246.00
  ["Evan Engram","TE","DEN"], // 235 · avg 250.33
  ["David Njoku","TE","LAC"], // 236 · avg 251.00
  ["Demond Claiborne","RB","MIN"], // 237 · avg 251.00
  ["Samaje Perine","RB","CIN"], // 238 · avg 251.33
  ["Devin Neal","RB","FA"], // 239 · avg 302.33 · adj -50
  ["Greg Dulcich","TE","MIA"], // 240 · avg 253.00
  ["Jack Bech","WR","LV"], // 241 · avg 256.00
  ["Harrison Butker","K","KC"], // 242 · avg 257.00
  ["Ollie Gordon II","RB","MIA"], // 243 · avg 257.00
  ["Fernando Mendoza","QB","LV"], // 244 · avg 259.00
  ["Keon Coleman","WR","BUF"], // 245 · avg 248.67 · adj +12
  ["Chris Boswell","K","PIT"], // 246 · avg 261.00
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 261.33
  ["Jordan James","RB","SF"], // 248 · avg 263.33
  ["Colby Parkinson","TE","LAR"], // 249 · avg 263.67
  ["Chimere Dike","WR","TEN"], // 250 · avg 264.00
  ["Tyquan Thornton","WR","KC"], // 251 · avg 264.67
  ["Tory Horton","WR","SEA"], // 252 · avg 266.00
  ["Ty Johnson","RB","BUF"], // 253 · avg 266.00
  ["Seth McGowan","RB","IND"], // 254 · avg 268.33
  ["LeQuint Allen Jr.","RB","JAC"], // 255 · avg 270.33
  ["Cyrus Allen","WR","KC"], // 256 · avg 272.00
  ["Wil Lutz","K","DEN"], // 257 · avg 273.67
  ["Tua Tagovailoa","QB","ATL"], // 258 · avg 274.67
  ["Will Reichard","K","MIN"], // 259 · avg 275.33
  ["Darius Slayton","WR","NYG"], // 260 · avg 275.67
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 276.00
  ["Xavier Legette","WR","CAR"], // 262 · avg 278.00
  ["DJ Giddens","RB","IND"], // 263 · avg 279.00
  ["Kirk Cousins","QB","LV"], // 264 · avg 280.00
  ["Marvin Mims Jr.","WR","DEN"], // 265 · avg 280.00
  ["Mason Taylor","TE","NYJ"], // 266 · avg 281.67
  ["Christian Kirk","WR","SF"], // 267 · avg 283.33
  ["Theo Johnson","TE","NYG"], // 268 · avg 285.00
  ["Deshaun Watson","QB","CLE"], // 269 · avg 285.33
  ["Kyle Williams","WR","NE"], // 270 · avg 287.00
  ["Brashard Smith","RB","KC"], // 271 · avg 290.00
  ["Michael Penix Jr.","QB","ATL"], // 272 · avg 278.33 · adj +12
  ["Shedeur Sanders","QB","CLE"], // 273 · avg 290.33
  ["Eli Stowers","TE","PHI"], // 274 · avg 291.67
  ["Devin Singletary","RB","NYG"], // 275 · avg 294.00
  ["Emari Demercado","RB","DAL"], // 276 · avg 295.33
  ["Jaydon Blue","RB","PHI"], // 277 · avg 295.33
  ["Adam Randall","RB","BAL"], // 278 · avg 295.67
  ["Skyler Bell","WR","BUF"], // 279 · avg 296.00
  ["Mack Hollins","WR","NE"], // 280 · avg 297.33
  ["Hollywood Brown","WR","PHI"], // 281 · avg 298.00
  ["Mike Gesicki","TE","CIN"], // 282 · avg 300.67
  ["Isaiah Bond","WR","CLE"], // 283 · avg 301.33
  ["Trevor Etienne","RB","CAR"], // 284 · avg 306.67
  ["Darren Waller","TE","CAR"], // 285 · avg 308.67
  ["DeMario Douglas","WR","NE"], // 286 · avg 309.33
  ["Jake Tonges","TE","SF"], // 287 · avg 309.33
  ["Brandon Aiyuk","WR","SF"], // 288 · avg 310.67
  ["Andrei Iosivas","WR","CIN"], // 289 · avg 311.00
  ["Tez Johnson","WR","TB"], // 290 · avg 339.00 · adj -28
  ["Tahj Brooks","RB","CIN"], // 291 · avg 311.67
  ["Isaac Guerendo","RB","SF"], // 292 · avg 312.33
  ["Audric Estime","RB","NO"], // 293 · avg 314.33
  ["Will Shipley","RB","PHI"], // 294 · avg 314.67
  ["Darnell Washington","TE","PIT"], // 295 · avg 316.00
  ["Michael Mayer","TE","LV"], // 296 · avg 319.00
  ["Charlie Kolar","TE","LAC"], // 297 · avg 319.33
  ["Jerome Ford","RB","WAS"], // 298 · avg 319.33
  ["Jahan Dotson","WR","ATL"], // 299 · avg 321.00
  ["Tyreek Hill","WR","FA"], // 300 · avg 322.00
  ["Jaleel McLaughlin","RB","CLE"], // 301 · avg 322.33
  ["Jarquez Hunter","RB","FA"], // 302 · avg 322.33
  ["Oscar Delp","TE","NO"], // 303 · avg 323.33
  ["Charlie Smyth","K","NO"], // 304 · avg 325.33
  ["Xavier Hutchinson","WR","HOU"], // 305 · avg 326.67
  ["Bryce Lance","WR","NO"], // 306 · avg 327.00
  ["Kareem Hunt","RB","FA"], // 307 · avg 327.67
  ["Elijah Arroyo","TE","SEA"], // 308 · avg 329.67
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 330.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.67
  ["Cole Kmet","TE","CHI"], // 311 · avg 334.67
  ["Dawson Knox","TE","BUF"], // 312 · avg 335.00
  ["Bam Knight","RB","ARI"], // 313 · avg 335.33
  ["Eli Raridon","TE","NE"], // 314 · avg 335.67
  ["Tyler Higbee","TE","LAR"], // 315 · avg 338.67
  ["Kendrick Bourne","WR","ARI"], // 316 · avg 339.67
  ["Jacob Saylors","RB","DET"], // 317 · avg 340.67
  ["Erick All Jr.","TE","CIN"], // 318 · avg 341.33
  ["Konata Mumpfield","WR","LAR"], // 319 · avg 346.33
  ["Joshua Palmer","WR","BUF"], // 320 · avg 347.00
  ["Max Klare","TE","LAR"], // 321 · avg 348.00
  ["Brenen Thompson","WR","LAC"], // 322 · avg 348.33
  ["Luke McCaffrey","WR","WAS"], // 323 · avg 348.67
  ["Jake Elliott","K","PHI"], // 324 · avg 349.00
  ["Noah Gray","TE","KC"], // 325 · avg 349.33
  ["Olamide Zaccheaus","WR","ATL"], // 326 · avg 349.33
  ["J.J. McCarthy","QB","MIN"], // 327 · avg 350.00
  ["Jalen Royals","WR","KC"], // 328 · avg 350.00
  ["Tyler Bass","K","BUF"], // 329 · avg 352.00
  ["Malik Benson","WR","LV"], // 330 · avg 352.33
  ["Mac Jones","QB","SF"], // 331 · avg 352.67
  ["Joe Mixon","RB","FA"], // 332 · avg 355.33
  ["Treylon Burks","WR","WAS"], // 333 · avg 356.33
  ["Ja'Tavion Sanders","TE","CAR"], // 334 · avg 357.33
  ["Roman Wilson","WR","PIT"], // 335 · avg 360.33
  ["Zavion Thomas","WR","CHI"], // 336 · avg 362.33
  ["Cedric Tillman","WR","NO"], // 337 · avg 363.00
  ["Justin Fields","QB","KC"], // 338 · avg 363.33
  ["Kalif Raymond","WR","CHI"], // 339 · avg 363.33
  ["Eli Heidenreich","RB","PIT"], // 340 · avg 366.33
  ["Trey Smack","K","GB"], // 341 · avg 367.00
  ["KaVontae Turpin","WR","DAL"], // 342 · avg 367.33
  ["Roschon Johnson","RB","CHI"], // 343 · avg 367.67
  ["Raheim Sanders","RB","CLE"], // 344 · avg 369.33
  ["Ty Simpson","QB","LAR"], // 345 · avg 369.33
  ["Kevin Coleman Jr.","WR","MIA"], // 346 · avg 372.67
  ["Michael Carter","RB","TEN"], // 347 · avg 375.33
  ["Demarcus Robinson","WR","SF"], // 348 · avg 376.00
  ["Anthony Richardson Sr.","QB","IND"], // 349 · avg 377.67
  ["Sione Vaki","RB","DET"], // 350 · avg 377.67
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
