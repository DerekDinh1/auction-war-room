import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-06T16:43:23.712Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Christian McCaffrey","RB","SF"], // 5 · avg 7.67
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 9.33
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.33
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.00
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 16.00
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.00
  ["Brock Bowers","TE","LV"], // 17 · avg 18.00
  ["George Pickens","WR","DAL"], // 18 · avg 19.33
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 48.00 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.33
  ["Chris Olave","WR","NO"], // 22 · avg 21.00
  ["Trey McBride","TE","ARI"], // 23 · avg 21.33
  ["Omarion Hampton","RB","LAC"], // 24 · avg 21.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 22.67
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["DeVonta Smith","WR","PHI"], // 27 · avg 26.00
  ["Josh Allen","QB","BUF"], // 28 · avg 26.33
  ["Rashee Rice","WR","KC"], // 29 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.00
  ["Tee Higgins","WR","CIN"], // 31 · avg 34.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.67
  ["Javonte Williams","RB","DAL"], // 33 · avg 35.67
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.00
  ["Ladd McConkey","WR","LAC"], // 35 · avg 37.33
  ["Tetairoa McMillan","WR","CAR"], // 36 · avg 37.33
  ["Drake Maye","QB","NE"], // 37 · avg 38.00
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.00
  ["Colston Loveland","TE","CHI"], // 39 · avg 38.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.67
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 48.00
  ["Luther Burden III","WR","CHI"], // 45 · avg 48.33
  ["Ashton Jeanty","RB","LV"], // 46 · avg 26.67 · adj +22
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.33 · adj +12
  ["Jameson Williams","WR","DET"], // 48 · avg 49.33
  ["Bucky Irving","RB","TB"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["DJ Moore","WR","BUF"], // 51 · avg 52.67
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 41.33 · adj +12
  ["Cam Skattebo","RB","NYG"], // 53 · avg 53.33
  ["Christian Watson","WR","GB"], // 54 · avg 54.33
  ["Quinshon Judkins","RB","CLE"], // 55 · avg 56.33
  ["David Montgomery","RB","HOU"], // 56 · avg 56.67
  ["Jalen Hurts","QB","PHI"], // 57 · avg 56.67
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.33
  ["Jayden Daniels","QB","WAS"], // 59 · avg 60.00
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.67
  ["Parker Washington","WR","JAC"], // 61 · avg 61.67
  ["Jadarian Price","RB","SEA"], // 62 · avg 62.00
  ["Mike Evans","WR","SF"], // 63 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.67
  ["Tyler Warren","TE","IND"], // 66 · avg 56.00 · adj +12
  ["Rhamondre Stevenson","RB","NE"], // 67 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.33
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 69.33
  ["Jaylen Warren","RB","PIT"], // 70 · avg 71.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 71.67
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 72.00
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.00
  ["DK Metcalf","WR","PIT"], // 74 · avg 76.33
  ["Tony Pollard","RB","TEN"], // 75 · avg 76.33
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 78.00
  ["Rico Dowdle","RB","PIT"], // 77 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 79.33
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.33
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.33 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.33
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 82.33
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.67
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.67
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.33
  ["Michael Wilson","WR","ARI"], // 86 · avg 91.00
  ["Alec Pierce","WR","IND"], // 87 · avg 92.00
  ["Blake Corum","RB","LAR"], // 88 · avg 92.33
  ["Brock Purdy","QB","SF"], // 89 · avg 92.67
  ["Sam LaPorta","TE","DET"], // 90 · avg 82.33 · adj +12
  ["Bo Nix","QB","DEN"], // 91 · avg 94.67
  ["Chuba Hubbard","RB","CAR"], // 92 · avg 95.67
  ["MarShawn Lloyd","RB","GB"], // 93 · avg 96.33
  ["Jaxson Dart","QB","NYG"], // 94 · avg 96.67
  ["Stefon Diggs","WR","WAS"], // 95 · avg 98.00
  ["RJ Harvey","RB","DEN"], // 96 · avg 98.33
  ["Jayden Reed","WR","GB"], // 97 · avg 101.00
  ["Jordan Mason","RB","MIN"], // 98 · avg 101.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 99 · avg 102.00
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 102.33
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 90.67 · adj +12
  ["Travis Kelce","TE","KC"], // 102 · avg 103.00
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.00 · adj -28
  ["George Kittle","TE","SF"], // 104 · avg 91.33 · adj +12
  ["Wan'Dale Robinson","WR","TEN"], // 105 · avg 104.00
  ["Jared Goff","QB","DET"], // 106 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 107 · avg 104.33
  ["Jordan Addison","WR","MIN"], // 108 · avg 105.00
  ["Matthew Stafford","QB","LAR"], // 109 · avg 105.33
  ["Mike Washington Jr.","RB","LV"], // 110 · avg 143.67 · adj -38
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 107.33
  ["Josh Downs","WR","IND"], // 112 · avg 98.67 · adj +12
  ["Makai Lemon","WR","PHI"], // 113 · avg 110.67
  ["Rachaad White","RB","WAS"], // 114 · avg 111.67
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 114.33
  ["Isaiah Likely","TE","NYG"], // 116 · avg 114.67
  ["KC Concepcion","WR","CLE"], // 117 · avg 115.33
  ["Kyler Murray","QB","MIN"], // 118 · avg 116.00
  ["Dallas Goedert","TE","PHI"], // 119 · avg 116.67
  ["De'Zhaun Stribling","WR","SF"], // 120 · avg 118.00
  ["Jordan Love","QB","GB"], // 121 · avg 118.33
  ["Aaron Jones Sr.","RB","MIN"], // 122 · avg 119.67
  ["Baker Mayfield","QB","TB"], // 123 · avg 120.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 125.00
  ["Matthew Golden","WR","GB"], // 125 · avg 125.00
  ["Mark Andrews","TE","BAL"], // 126 · avg 126.33
  ["Romeo Doubs","WR","NE"], // 127 · avg 127.00
  ["Xavier Worthy","WR","KC"], // 128 · avg 127.33
  ["Jake Ferguson","TE","DAL"], // 129 · avg 127.67
  ["Tyler Shough","QB","NO"], // 130 · avg 127.67
  ["Juwan Johnson","TE","NO"], // 131 · avg 129.67
  ["Jalen Coker","WR","CAR"], // 132 · avg 130.00
  ["Woody Marks","RB","HOU"], // 133 · avg 131.67
  ["Malik Willis","QB","MIA"], // 134 · avg 132.00
  ["Braelon Allen","RB","NYJ"], // 135 · avg 161.33 · adj -28
  ["Jalen McMillan","WR","TB"], // 136 · avg 161.67 · adj -28
  ["Kyle Monangai","RB","CHI"], // 137 · avg 112.33 · adj +22
  ["Khalil Shakir","WR","BUF"], // 138 · avg 135.67
  ["Jonah Coleman","RB","DEN"], // 139 · avg 137.67
  ["Sam Darnold","QB","SEA"], // 140 · avg 138.00
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 138.33
  ["Deebo Samuel Sr.","WR","SF"], // 142 · avg 141.00
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.00
  ["Keaton Mitchell","RB","LAC"], // 144 · avg 143.67
  ["C.J. Stroud","QB","HOU"], // 145 · avg 144.33
  ["Daniel Jones","QB","IND"], // 146 · avg 146.33
  ["Josh Jacobs","RB","GB"], // 147 · avg 147.67
  ["Denzel Boston","WR","CLE"], // 148 · avg 148.00
  ["Tank Bigsby","RB","PHI"], // 149 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 150 · avg 150.67
  ["Hunter Henry","TE","NE"], // 151 · avg 150.67
  ["Tre Tucker","WR","LV"], // 152 · avg 151.33
  ["Brenton Strange","TE","JAC"], // 153 · avg 153.00
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 153.67
  ["Cam Ward","QB","TEN"], // 155 · avg 154.00
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 158.33
  ["Kayshon Boutte","WR","HOU"], // 157 · avg 158.33
  ["Dalton Schultz","TE","HOU"], // 158 · avg 159.33
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 161.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 160 · avg 164.00
  ["Emmett Johnson","RB","KC"], // 161 · avg 165.33
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 165.67
  ["Dontayvion Wicks","WR","PHI"], // 163 · avg 166.67
  ["Bryce Young","QB","CAR"], // 164 · avg 167.67
  ["Jauan Jennings","WR","MIN"], // 165 · avg 169.00
  ["Omar Cooper Jr.","WR","NYJ"], // 166 · avg 174.00
  ["Ray Davis","RB","BUF"], // 167 · avg 174.00
  ["Tre' Harris","WR","LAC"], // 168 · avg 175.00
  ["Jalen Nailor","WR","LV"], // 169 · avg 175.33
  ["Ryan Flournoy","WR","DAL"], // 170 · avg 175.33
  ["Zach Charbonnet","RB","SEA"], // 171 · avg 144.33 · adj +35
  ["Pat Bryant","WR","DEN"], // 172 · avg 179.33
  ["Terrance Ferguson","TE","LAR"], // 173 · avg 179.33
  ["Malik Washington","WR","MIA"], // 174 · avg 184.00
  ["AJ Barner","TE","SEA"], // 175 · avg 184.33
  ["T.J. Hockenson","TE","MIN"], // 176 · avg 185.67
  ["Kimani Vidal","RB","LAC"], // 177 · avg 187.33
  ["Keenan Allen","WR","IND"], // 178 · avg 187.67
  ["Isiah Pacheco","RB","DET"], // 179 · avg 189.00
  ["Calvin Ridley","WR","TEN"], // 180 · avg 191.33
  ["Brandon Aubrey","K","DAL"], // 181 · avg 192.00
  ["Jacoby Brissett","QB","ARI"], // 182 · avg 192.33
  ["Kenyon Sadiq","TE","NYJ"], // 183 · avg 195.33
  ["Jaylin Noel","WR","HOU"], // 184 · avg 196.67
  ["Cameron Dicker","K","LAC"], // 185 · avg 198.67
  ["Sean Tucker","RB","TB"], // 186 · avg 199.00
  ["Travis Hunter","WR","JAC"], // 187 · avg 199.00
  ["Ka'imi Fairbairn","K","HOU"], // 188 · avg 202.00
  ["Oronde Gadsden II","TE","LAC"], // 189 · avg 202.00
  ["Nicholas Singleton","RB","TEN"], // 190 · avg 203.00
  ["Ja'Kobi Lane","WR","BAL"], // 191 · avg 205.33
  ["Kaelon Black","RB","SF"], // 192 · avg 205.33
  ["Cam Little","K","JAC"], // 193 · avg 205.67
  ["Malik Davis","RB","DAL"], // 194 · avg 206.67
  ["Alvin Kamara","RB","NO"], // 195 · avg 162.00 · adj +45
  ["Aaron Rodgers","QB","PIT"], // 196 · avg 207.67
  ["Jason Myers","K","SEA"], // 197 · avg 209.00
  ["Rashod Bateman","WR","BAL"], // 198 · avg 209.67
  ["Gunnar Helm","TE","TEN"], // 199 · avg 210.67
  ["Pat Freiermuth","TE","PIT"], // 200 · avg 211.33
  ["Malachi Fields","WR","NYG"], // 201 · avg 212.67
  ["Eddy Pineiro","K","SF"], // 202 · avg 215.33
  ["Kaytron Allen","RB","WAS"], // 203 · avg 215.67
  ["Chris Bell","WR","MIA"], // 204 · avg 216.00
  ["Isaac TeSlaa","WR","DET"], // 205 · avg 216.33
  ["Tyler Loop","K","BAL"], // 206 · avg 217.67
  ["James Conner","RB","ARI"], // 207 · avg 234.67 · adj -16
  ["Zachariah Branch","WR","ATL"], // 208 · avg 219.67
  ["Jake Bates","K","DET"], // 209 · avg 221.33
  ["Geno Smith","QB","NYJ"], // 210 · avg 222.00
  ["Cooper Kupp","WR","SEA"], // 211 · avg 223.00
  ["Kendre Miller","RB","NO"], // 212 · avg 273.67 · adj -50
  ["Darnell Mooney","WR","NYG"], // 213 · avg 224.67
  ["Jaylen Wright","RB","MIA"], // 214 · avg 225.33
  ["George Holani","RB","SEA"], // 215 · avg 226.33
  ["Cade Otton","TE","TB"], // 216 · avg 227.00
  ["Najee Harris","RB","NYG"], // 217 · avg 228.00
  ["Cairo Santos","K","CHI"], // 218 · avg 233.33
  ["Evan McPherson","K","CIN"], // 219 · avg 233.33
  ["Emanuel Wilson","RB","SEA"], // 220 · avg 233.67
  ["Isaiah Davis","RB","NYJ"], // 221 · avg 263.00 · adj -28
  ["Justice Hill","RB","BAL"], // 222 · avg 235.67
  ["Harrison Mevis","K","LAR"], // 223 · avg 237.33
  ["Andy Borregales","K","NE"], // 224 · avg 237.67
  ["Jordyn Tyson","WR","NO"], // 225 · avg 138.33 · adj +100
  ["Germie Bernard","WR","PIT"], // 226 · avg 238.33
  ["Troy Franklin","WR","DEN"], // 227 · avg 238.33
  ["Caleb Douglas","WR","MIA"], // 228 · avg 239.33
  ["Kaleb Johnson","RB","GB"], // 229 · avg 242.33
  ["Chris Brooks","RB","GB"], // 230 · avg 242.67
  ["Chase McLaughlin","K","TB"], // 231 · avg 243.00
  ["Devaughn Vele","WR","NO"], // 232 · avg 244.67
  ["Tank Dell","WR","HOU"], // 233 · avg 244.67
  ["Ted Hurst III","WR","TB"], // 234 · avg 244.67
  ["Greg Dulcich","TE","MIA"], // 235 · avg 248.00
  ["Evan Engram","TE","DEN"], // 236 · avg 248.33
  ["Demond Claiborne","RB","MIN"], // 237 · avg 249.00
  ["Samaje Perine","RB","CIN"], // 238 · avg 252.33
  ["David Njoku","TE","LAC"], // 239 · avg 253.00
  ["Devin Neal","RB","FA"], // 240 · avg 303.33 · adj -50
  ["Harrison Butker","K","KC"], // 241 · avg 256.33
  ["Jack Bech","WR","LV"], // 242 · avg 256.67
  ["Ollie Gordon II","RB","MIA"], // 243 · avg 257.00
  ["Fernando Mendoza","QB","LV"], // 244 · avg 258.67
  ["Chris Boswell","K","PIT"], // 245 · avg 259.67
  ["Keon Coleman","WR","BUF"], // 246 · avg 250.00 · adj +12
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 262.67
  ["Colby Parkinson","TE","LAR"], // 248 · avg 263.67
  ["Jordan James","RB","SF"], // 249 · avg 263.67
  ["Chimere Dike","WR","TEN"], // 250 · avg 267.00
  ["Tory Horton","WR","SEA"], // 251 · avg 267.00
  ["Seth McGowan","RB","IND"], // 252 · avg 267.33
  ["Ty Johnson","RB","BUF"], // 253 · avg 267.33
  ["Cyrus Allen","WR","KC"], // 254 · avg 268.00
  ["Tyquan Thornton","WR","KC"], // 255 · avg 268.33
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 269.00
  ["Wil Lutz","K","DEN"], // 257 · avg 273.00
  ["Tua Tagovailoa","QB","ATL"], // 258 · avg 273.67
  ["Darius Slayton","WR","NYG"], // 259 · avg 275.67
  ["Will Reichard","K","MIN"], // 260 · avg 277.00
  ["Xavier Legette","WR","CAR"], // 261 · avg 278.00
  ["Elijah Sarratt","WR","BAL"], // 262 · avg 278.33
  ["Kirk Cousins","QB","LV"], // 263 · avg 279.00
  ["DJ Giddens","RB","IND"], // 264 · avg 279.33
  ["Marvin Mims Jr.","WR","DEN"], // 265 · avg 280.33
  ["Mason Taylor","TE","NYJ"], // 266 · avg 282.33
  ["Christian Kirk","WR","SF"], // 267 · avg 283.67
  ["Deshaun Watson","QB","CLE"], // 268 · avg 284.33
  ["Theo Johnson","TE","NYG"], // 269 · avg 284.67
  ["Kyle Williams","WR","NE"], // 270 · avg 287.33
  ["Shedeur Sanders","QB","CLE"], // 271 · avg 289.67
  ["Michael Penix Jr.","QB","ATL"], // 272 · avg 278.00 · adj +12
  ["Brashard Smith","RB","KC"], // 273 · avg 291.67
  ["Eli Stowers","TE","PHI"], // 274 · avg 292.33
  ["Devin Singletary","RB","NYG"], // 275 · avg 294.00
  ["Adam Randall","RB","BAL"], // 276 · avg 295.00
  ["Jaydon Blue","RB","PHI"], // 277 · avg 296.33
  ["Emari Demercado","RB","DAL"], // 278 · avg 296.67
  ["Hollywood Brown","WR","PHI"], // 279 · avg 296.67
  ["Skyler Bell","WR","BUF"], // 280 · avg 297.00
  ["Mack Hollins","WR","NE"], // 281 · avg 298.00
  ["Mike Gesicki","TE","CIN"], // 282 · avg 299.00
  ["Isaiah Bond","WR","CLE"], // 283 · avg 302.33
  ["Darren Waller","TE","CAR"], // 284 · avg 308.00
  ["Trevor Etienne","RB","CAR"], // 285 · avg 308.00
  ["Jake Tonges","TE","SF"], // 286 · avg 308.33
  ["DeMario Douglas","WR","NE"], // 287 · avg 309.33
  ["Andrei Iosivas","WR","CIN"], // 288 · avg 309.67
  ["Tahj Brooks","RB","CIN"], // 289 · avg 310.67
  ["Tez Johnson","WR","TB"], // 290 · avg 339.33 · adj -28
  ["Brandon Aiyuk","WR","SF"], // 291 · avg 312.33
  ["Audric Estime","RB","NO"], // 292 · avg 313.67
  ["Isaac Guerendo","RB","SF"], // 293 · avg 314.67
  ["Will Shipley","RB","PHI"], // 294 · avg 315.33
  ["Charlie Kolar","TE","LAC"], // 295 · avg 317.00
  ["Darnell Washington","TE","PIT"], // 296 · avg 317.33
  ["Michael Mayer","TE","LV"], // 297 · avg 319.00
  ["Jerome Ford","RB","WAS"], // 298 · avg 319.33
  ["Jahan Dotson","WR","ATL"], // 299 · avg 320.00
  ["Jaleel McLaughlin","RB","CLE"], // 300 · avg 322.00
  ["Oscar Delp","TE","NO"], // 301 · avg 322.67
  ["Charlie Smyth","K","NO"], // 302 · avg 324.00
  ["Jarquez Hunter","RB","FA"], // 303 · avg 324.00
  ["Bryce Lance","WR","NO"], // 304 · avg 325.67
  ["Tyreek Hill","WR","FA"], // 305 · avg 326.00
  ["Xavier Hutchinson","WR","HOU"], // 306 · avg 326.67
  ["Kareem Hunt","RB","FA"], // 307 · avg 328.33
  ["Elijah Arroyo","TE","SEA"], // 308 · avg 329.33
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 330.67
  ["Carson Beck","QB","ARI"], // 310 · avg 333.33
  ["Dawson Knox","TE","BUF"], // 311 · avg 334.67
  ["Cole Kmet","TE","CHI"], // 312 · avg 335.33
  ["Eli Raridon","TE","NE"], // 313 · avg 335.33
  ["Jacob Saylors","RB","DET"], // 314 · avg 337.00
  ["Bam Knight","RB","ARI"], // 315 · avg 338.00
  ["Tyler Higbee","TE","LAR"], // 316 · avg 338.67
  ["Kendrick Bourne","WR","ARI"], // 317 · avg 340.00
  ["Erick All Jr.","TE","CIN"], // 318 · avg 341.67
  ["Jake Elliott","K","PHI"], // 319 · avg 343.67
  ["Joshua Palmer","WR","BUF"], // 320 · avg 344.00
  ["Luke McCaffrey","WR","WAS"], // 321 · avg 348.00
  ["Malik Benson","WR","LV"], // 322 · avg 348.67
  ["Max Klare","TE","LAR"], // 323 · avg 350.00
  ["Noah Gray","TE","KC"], // 324 · avg 350.33
  ["Brenen Thompson","WR","LAC"], // 325 · avg 350.67
  ["Olamide Zaccheaus","WR","ATL"], // 326 · avg 350.67
  ["Tyler Bass","K","BUF"], // 327 · avg 351.33
  ["J.J. McCarthy","QB","MIN"], // 328 · avg 352.00
  ["Konata Mumpfield","WR","LAR"], // 329 · avg 352.33
  ["Jalen Royals","WR","KC"], // 330 · avg 353.67
  ["Treylon Burks","WR","WAS"], // 331 · avg 353.67
  ["Mac Jones","QB","SF"], // 332 · avg 354.33
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 355.33
  ["Zavion Thomas","WR","CHI"], // 334 · avg 358.33
  ["Roman Wilson","WR","PIT"], // 335 · avg 362.00
  ["Joe Mixon","RB","FA"], // 336 · avg 363.00
  ["Justin Fields","QB","KC"], // 337 · avg 363.67
  ["Cedric Tillman","WR","NO"], // 338 · avg 365.67
  ["Kalif Raymond","WR","CHI"], // 339 · avg 365.67
  ["Eli Heidenreich","RB","PIT"], // 340 · avg 366.00
  ["KaVontae Turpin","WR","DAL"], // 341 · avg 366.33
  ["Kevin Coleman Jr.","WR","MIA"], // 342 · avg 367.33
  ["Roschon Johnson","RB","CHI"], // 343 · avg 367.33
  ["Trey Smack","K","GB"], // 344 · avg 367.67
  ["Raheim Sanders","RB","CLE"], // 345 · avg 368.67
  ["Ty Simpson","QB","LAR"], // 346 · avg 375.00
  ["Tutu Atwell","WR","LAR"], // 347 · avg 377.00
  ["Colbie Young","WR","CIN"], // 348 · avg 378.00
  ["Michael Carter","RB","TEN"], // 349 · avg 378.00
  ["Demarcus Robinson","WR","SF"], // 350 · avg 378.67
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
