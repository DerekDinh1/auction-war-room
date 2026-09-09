import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-09T17:36:50.993Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.33
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 5.67
  ["Christian McCaffrey","RB","SF"], // 5 · avg 7.67
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 9.67
  ["James Cook III","RB","BUF"], // 8 · avg 10.33
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.33
  ["A.J. Brown","WR","NE"], // 10 · avg 11.67
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.67
  ["Nico Collins","WR","HOU"], // 13 · avg 14.67
  ["Chase Brown","RB","CIN"], // 14 · avg 15.00
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 16.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["Davante Adams","WR","LAR"], // 19 · avg 47.67 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 20.00
  ["Chris Olave","WR","NO"], // 21 · avg 20.33
  ["Kenneth Walker III","RB","KC"], // 22 · avg 21.00
  ["Omarion Hampton","RB","LAC"], // 23 · avg 22.33
  ["Trey McBride","TE","ARI"], // 24 · avg 23.00
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.33
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["DeVonta Smith","WR","PHI"], // 27 · avg 25.67
  ["Josh Allen","QB","BUF"], // 28 · avg 25.67
  ["Rashee Rice","WR","KC"], // 29 · avg 30.67
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 34.33
  ["Javonte Williams","RB","DAL"], // 32 · avg 35.00
  ["Kyren Williams","RB","LAR"], // 33 · avg 35.33
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 35.67
  ["Colston Loveland","TE","CHI"], // 35 · avg 36.67
  ["Drake Maye","QB","NE"], // 36 · avg 37.67
  ["Garrett Wilson","WR","NYJ"], // 37 · avg 38.00
  ["Ladd McConkey","WR","LAC"], // 38 · avg 38.33
  ["Tetairoa McMillan","WR","CAR"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.00 · adj +12
  ["Joe Burrow","QB","CIN"], // 41 · avg 44.33
  ["Travis Etienne Jr.","RB","NO"], // 42 · avg 44.33
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Luther Burden III","WR","CHI"], // 44 · avg 48.00
  ["Ashton Jeanty","RB","LV"], // 45 · avg 27.00 · adj +22
  ["Jameson Williams","WR","DET"], // 46 · avg 49.00
  ["Terry McLaurin","WR","WAS"], // 47 · avg 49.00
  ["Breece Hall","RB","NYJ"], // 48 · avg 37.33 · adj +12
  ["Bucky Irving","RB","TB"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 41.00 · adj +12
  ["Christian Watson","WR","GB"], // 52 · avg 53.00
  ["DJ Moore","WR","BUF"], // 53 · avg 53.00
  ["Cam Skattebo","RB","NYG"], // 54 · avg 55.00
  ["Jalen Hurts","QB","PHI"], // 55 · avg 55.00
  ["David Montgomery","RB","HOU"], // 56 · avg 56.33
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.33
  ["Jayden Daniels","QB","WAS"], // 58 · avg 59.33
  ["Rome Odunze","WR","CHI"], // 59 · avg 59.67
  ["Jadarian Price","RB","SEA"], // 60 · avg 60.67
  ["Parker Washington","WR","JAC"], // 61 · avg 61.33
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 62.67
  ["Mike Evans","WR","SF"], // 63 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["Rhamondre Stevenson","RB","NE"], // 65 · avg 67.00
  ["TreVeyon Henderson","RB","NE"], // 66 · avg 68.00
  ["Tyler Warren","TE","IND"], // 67 · avg 56.33 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.67
  ["Jaylen Warren","RB","PIT"], // 70 · avg 71.33
  ["Trevor Lawrence","QB","JAC"], // 71 · avg 71.33
  ["Carnell Tate","WR","TEN"], // 72 · avg 72.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.33
  ["DK Metcalf","WR","PIT"], // 74 · avg 75.00
  ["Tony Pollard","RB","TEN"], // 75 · avg 77.00
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 77.33
  ["Rico Dowdle","RB","PIT"], // 77 · avg 78.33
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 79.33
  ["Kyle Pitts Sr.","TE","ATL"], // 79 · avg 81.67
  ["Tucker Kraft","TE","GB"], // 80 · avg 70.33 · adj +12
  ["Harold Fannin Jr.","TE","CLE"], // 81 · avg 82.67
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 85.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 85.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.67
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.33
  ["Alec Pierce","WR","IND"], // 86 · avg 90.33
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.00
  ["Blake Corum","RB","LAR"], // 88 · avg 91.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 80.33 · adj +12
  ["Brock Purdy","QB","SF"], // 90 · avg 93.67
  ["Chuba Hubbard","RB","CAR"], // 91 · avg 93.67
  ["Bo Nix","QB","DEN"], // 92 · avg 96.00
  ["Stefon Diggs","WR","WAS"], // 93 · avg 97.00
  ["Jaxson Dart","QB","NYG"], // 94 · avg 97.67
  ["MarShawn Lloyd","RB","GB"], // 95 · avg 97.67
  ["RJ Harvey","RB","DEN"], // 96 · avg 100.00
  ["Jordan Mason","RB","MIN"], // 97 · avg 100.33
  ["Jayden Reed","WR","GB"], // 98 · avg 100.67
  ["George Kittle","TE","SF"], // 99 · avg 89.33 · adj +12
  ["Jacory Croskey-Merritt","RB","WAS"], // 100 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 101 · avg 102.00
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.33 · adj +12
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.00 · adj -28
  ["Jordan Addison","WR","MIN"], // 104 · avg 103.67
  ["Travis Kelce","TE","KC"], // 105 · avg 103.67
  ["Kenny Gainwell","RB","TB"], // 106 · avg 104.00
  ["Mike Washington Jr.","RB","LV"], // 107 · avg 142.00 · adj -38
  ["Jared Goff","QB","DET"], // 108 · avg 104.33
  ["Wan'Dale Robinson","WR","TEN"], // 109 · avg 104.33
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 105.33
  ["Matthew Stafford","QB","LAR"], // 111 · avg 105.67
  ["Josh Downs","WR","IND"], // 112 · avg 97.33 · adj +12
  ["Kyler Murray","QB","MIN"], // 113 · avg 112.00
  ["Rachaad White","RB","WAS"], // 114 · avg 112.67
  ["Dallas Goedert","TE","PHI"], // 115 · avg 114.00
  ["Makai Lemon","WR","PHI"], // 116 · avg 114.33
  ["KC Concepcion","WR","CLE"], // 117 · avg 116.00
  ["Isaiah Likely","TE","NYG"], // 118 · avg 116.67
  ["Jakobi Meyers","WR","JAC"], // 119 · avg 117.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.33
  ["Aaron Jones Sr.","RB","MIN"], // 121 · avg 120.33
  ["Matthew Golden","WR","GB"], // 122 · avg 120.67
  ["Baker Mayfield","QB","TB"], // 123 · avg 121.00
  ["De'Zhaun Stribling","WR","SF"], // 124 · avg 121.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 122.33
  ["Romeo Doubs","WR","NE"], // 126 · avg 126.33
  ["Xavier Worthy","WR","KC"], // 127 · avg 126.33
  ["Tyler Shough","QB","NO"], // 128 · avg 128.33
  ["Mark Andrews","TE","BAL"], // 129 · avg 128.67
  ["Jake Ferguson","TE","DAL"], // 130 · avg 129.00
  ["Juwan Johnson","TE","NO"], // 131 · avg 129.00
  ["Jalen Coker","WR","CAR"], // 132 · avg 129.67
  ["Woody Marks","RB","HOU"], // 133 · avg 130.33
  ["Malik Willis","QB","MIA"], // 134 · avg 132.00
  ["Braelon Allen","RB","NYJ"], // 135 · avg 161.33 · adj -28
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.00 · adj +22
  ["Jalen McMillan","WR","TB"], // 137 · avg 163.00 · adj -28
  ["Khalil Shakir","WR","BUF"], // 138 · avg 135.33
  ["Deebo Samuel Sr.","WR","SF"], // 139 · avg 138.00
  ["Sam Darnold","QB","SEA"], // 140 · avg 138.33
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 139.00
  ["Jonah Coleman","RB","DEN"], // 142 · avg 139.33
  ["Tyjae Spears","RB","TEN"], // 143 · avg 139.67
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.00
  ["Keaton Mitchell","RB","LAC"], // 145 · avg 142.67
  ["Daniel Jones","QB","IND"], // 146 · avg 144.00
  ["Josh Jacobs","RB","GB"], // 147 · avg 145.33
  ["Tank Bigsby","RB","PHI"], // 148 · avg 146.67
  ["Denzel Boston","WR","CLE"], // 149 · avg 149.00
  ["Tre Tucker","WR","LV"], // 150 · avg 149.33
  ["Dylan Sampson","RB","CLE"], // 151 · avg 150.67
  ["Hunter Henry","TE","NE"], // 152 · avg 151.67
  ["Brenton Strange","TE","JAC"], // 153 · avg 152.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 155.00
  ["Cam Ward","QB","TEN"], // 155 · avg 155.33
  ["Dalton Schultz","TE","HOU"], // 156 · avg 157.33
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 159.00
  ["Kayshon Boutte","WR","HOU"], // 158 · avg 159.00
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 160.33
  ["Emmett Johnson","RB","KC"], // 160 · avg 160.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 161 · avg 167.00
  ["Dontayvion Wicks","WR","PHI"], // 162 · avg 167.67
  ["Jerry Jeudy","WR","CLE"], // 163 · avg 169.33
  ["Bryce Young","QB","CAR"], // 164 · avg 170.67
  ["Jalen Nailor","WR","LV"], // 165 · avg 172.00
  ["Jauan Jennings","WR","MIN"], // 166 · avg 173.00
  ["Tre' Harris","WR","LAC"], // 167 · avg 173.00
  ["Ray Davis","RB","BUF"], // 168 · avg 174.00
  ["Terrance Ferguson","TE","LAR"], // 169 · avg 174.67
  ["Ryan Flournoy","WR","DAL"], // 170 · avg 179.33
  ["Keenan Allen","WR","IND"], // 171 · avg 180.00
  ["AJ Barner","TE","SEA"], // 172 · avg 180.33
  ["Pat Bryant","WR","DEN"], // 173 · avg 181.00
  ["T.J. Hockenson","TE","MIN"], // 174 · avg 182.33
  ["Omar Cooper Jr.","WR","NYJ"], // 175 · avg 183.00
  ["Brandon Aubrey","K","DAL"], // 176 · avg 184.33
  ["Zach Charbonnet","RB","SEA"], // 177 · avg 149.67 · adj +35
  ["Malik Washington","WR","MIA"], // 178 · avg 188.67
  ["Kimani Vidal","RB","LAC"], // 179 · avg 189.67
  ["Jacoby Brissett","QB","ARI"], // 180 · avg 192.33
  ["Cameron Dicker","K","LAC"], // 181 · avg 193.33
  ["Calvin Ridley","WR","TEN"], // 182 · avg 193.67
  ["Ka'imi Fairbairn","K","HOU"], // 183 · avg 196.00
  ["Kenyon Sadiq","TE","NYJ"], // 184 · avg 197.00
  ["Ja'Kobi Lane","WR","BAL"], // 185 · avg 197.67
  ["Kaelon Black","RB","SF"], // 186 · avg 197.67
  ["Sean Tucker","RB","TB"], // 187 · avg 198.33
  ["Cam Little","K","JAC"], // 188 · avg 199.67
  ["Malik Davis","RB","DAL"], // 189 · avg 201.33
  ["Aaron Rodgers","QB","PIT"], // 190 · avg 201.67
  ["Jason Myers","K","SEA"], // 191 · avg 202.33
  ["Alvin Kamara","RB","NO"], // 192 · avg 160.33 · adj +45
  ["Jaylin Noel","WR","HOU"], // 193 · avg 205.33
  ["Oronde Gadsden II","TE","LAC"], // 194 · avg 208.00
  ["Nicholas Singleton","RB","TEN"], // 195 · avg 209.33
  ["Rashod Bateman","WR","BAL"], // 196 · avg 209.33
  ["Eddy Pineiro","K","SF"], // 197 · avg 210.67
  ["Travis Hunter","WR","JAC"], // 198 · avg 210.67
  ["Isiah Pacheco","RB","DET"], // 199 · avg 214.00
  ["Tyler Loop","K","BAL"], // 200 · avg 215.33
  ["Chris Bell","WR","MIA"], // 201 · avg 215.67
  ["Gunnar Helm","TE","TEN"], // 202 · avg 215.67
  ["Pat Freiermuth","TE","PIT"], // 203 · avg 216.00
  ["Isaac TeSlaa","WR","DET"], // 204 · avg 217.00
  ["Malachi Fields","WR","NYG"], // 205 · avg 217.67
  ["Kaytron Allen","RB","WAS"], // 206 · avg 218.33
  ["Najee Harris","RB","NYG"], // 207 · avg 219.00
  ["Jake Bates","K","DET"], // 208 · avg 219.33
  ["Geno Smith","QB","NYJ"], // 209 · avg 220.67
  ["Kendre Miller","RB","NO"], // 210 · avg 272.00 · adj -50
  ["Zachariah Branch","WR","ATL"], // 211 · avg 225.00
  ["James Conner","RB","ARI"], // 212 · avg 241.00 · adj -16
  ["Cade Otton","TE","TB"], // 213 · avg 225.67
  ["Cooper Kupp","WR","SEA"], // 214 · avg 227.00
  ["Evan McPherson","K","CIN"], // 215 · avg 227.67
  ["Darnell Mooney","WR","NYG"], // 216 · avg 228.00
  ["Cairo Santos","K","CHI"], // 217 · avg 228.67
  ["George Holani","RB","SEA"], // 218 · avg 228.67
  ["Jaylen Wright","RB","MIA"], // 219 · avg 229.33
  ["Justice Hill","RB","BAL"], // 220 · avg 231.33
  ["Kaleb Johnson","RB","GB"], // 221 · avg 232.67
  ["Chase McLaughlin","K","TB"], // 222 · avg 234.33
  ["Andy Borregales","K","NE"], // 223 · avg 236.00
  ["Harrison Mevis","K","LAR"], // 224 · avg 236.33
  ["Greg Dulcich","TE","MIA"], // 225 · avg 238.33
  ["Isaiah Davis","RB","NYJ"], // 226 · avg 268.67 · adj -28
  ["Devaughn Vele","WR","NO"], // 227 · avg 241.00
  ["Germie Bernard","WR","PIT"], // 228 · avg 242.00
  ["Samaje Perine","RB","CIN"], // 229 · avg 242.33
  ["Emanuel Wilson","RB","SEA"], // 230 · avg 244.67
  ["Troy Franklin","WR","DEN"], // 231 · avg 244.67
  ["Jordyn Tyson","WR","NO"], // 232 · avg 145.33 · adj +100
  ["Caleb Douglas","WR","MIA"], // 233 · avg 246.00
  ["Evan Engram","TE","DEN"], // 234 · avg 248.00
  ["Chris Brooks","RB","GB"], // 235 · avg 250.33
  ["Demond Claiborne","RB","MIN"], // 236 · avg 252.00
  ["Ted Hurst III","WR","TB"], // 237 · avg 252.00
  ["Harrison Butker","K","KC"], // 238 · avg 252.33
  ["Chris Boswell","K","PIT"], // 239 · avg 253.33
  ["Fernando Mendoza","QB","LV"], // 240 · avg 253.67
  ["David Njoku","TE","LAC"], // 241 · avg 254.00
  ["Ollie Gordon II","RB","MIA"], // 242 · avg 256.33
  ["Jack Bech","WR","LV"], // 243 · avg 259.33
  ["Devin Neal","RB","FA"], // 244 · avg 310.00 · adj -50
  ["Colby Parkinson","TE","LAR"], // 245 · avg 260.67
  ["Tank Dell","WR","HOU"], // 246 · avg 262.00
  ["Seth McGowan","RB","IND"], // 247 · avg 263.00
  ["Tyquan Thornton","WR","KC"], // 248 · avg 264.33
  ["Jordan James","RB","SF"], // 249 · avg 265.00
  ["Keon Coleman","WR","BUF"], // 250 · avg 254.00 · adj +12
  ["Elic Ayomanor","WR","TEN"], // 251 · avg 266.67
  ["Cyrus Allen","WR","KC"], // 252 · avg 267.33
  ["Tory Horton","WR","SEA"], // 253 · avg 268.00
  ["Will Reichard","K","MIN"], // 254 · avg 268.33
  ["Tua Tagovailoa","QB","ATL"], // 255 · avg 270.00
  ["Wil Lutz","K","DEN"], // 256 · avg 270.00
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 271.67
  ["Chimere Dike","WR","TEN"], // 258 · avg 272.33
  ["Ty Johnson","RB","BUF"], // 259 · avg 272.67
  ["Xavier Legette","WR","CAR"], // 260 · avg 274.33
  ["Kirk Cousins","QB","LV"], // 261 · avg 277.67
  ["Mason Taylor","TE","NYJ"], // 262 · avg 278.67
  ["Marvin Mims Jr.","WR","DEN"], // 263 · avg 279.67
  ["Kyle Williams","WR","NE"], // 264 · avg 282.00
  ["Deshaun Watson","QB","CLE"], // 265 · avg 282.67
  ["Elijah Sarratt","WR","BAL"], // 266 · avg 283.67
  ["DJ Giddens","RB","IND"], // 267 · avg 284.00
  ["Theo Johnson","TE","NYG"], // 268 · avg 285.00
  ["Michael Penix Jr.","QB","ATL"], // 269 · avg 273.33 · adj +12
  ["Brashard Smith","RB","KC"], // 270 · avg 287.00
  ["Shedeur Sanders","QB","CLE"], // 271 · avg 288.33
  ["Darius Slayton","WR","FA"], // 272 · avg 289.67
  ["Devin Singletary","RB","NYG"], // 273 · avg 291.67
  ["Christian Kirk","WR","SF"], // 274 · avg 292.67
  ["Adam Randall","RB","BAL"], // 275 · avg 293.00
  ["Eli Stowers","TE","PHI"], // 276 · avg 293.00
  ["Hollywood Brown","WR","PHI"], // 277 · avg 295.00
  ["Emari Demercado","RB","DAL"], // 278 · avg 297.67
  ["Skyler Bell","WR","BUF"], // 279 · avg 298.67
  ["Mike Gesicki","TE","CIN"], // 280 · avg 299.33
  ["Mack Hollins","WR","NE"], // 281 · avg 299.67
  ["Andrei Iosivas","WR","CIN"], // 282 · avg 301.67
  ["DeMario Douglas","WR","NE"], // 283 · avg 302.00
  ["Isaiah Bond","WR","CLE"], // 284 · avg 303.67
  ["Jaydon Blue","RB","PHI"], // 285 · avg 305.33
  ["Darren Waller","TE","CAR"], // 286 · avg 305.67
  ["Tahj Brooks","RB","CIN"], // 287 · avg 308.33
  ["Charlie Kolar","TE","LAC"], // 288 · avg 309.00
  ["Trevor Etienne","RB","CAR"], // 289 · avg 309.33
  ["Audric Estime","RB","NO"], // 290 · avg 311.00
  ["Jake Tonges","TE","SF"], // 291 · avg 311.67
  ["Will Shipley","RB","PHI"], // 292 · avg 311.67
  ["Tez Johnson","WR","TB"], // 293 · avg 340.00 · adj -28
  ["Jahan Dotson","WR","ATL"], // 294 · avg 313.00
  ["Isaac Guerendo","RB","SF"], // 295 · avg 314.67
  ["Michael Mayer","TE","LV"], // 296 · avg 317.33
  ["Darnell Washington","TE","PIT"], // 297 · avg 317.67
  ["Jaleel McLaughlin","RB","CLE"], // 298 · avg 318.67
  ["Jacob Saylors","RB","DET"], // 299 · avg 322.33
  ["Brandon Aiyuk","WR","SF"], // 300 · avg 322.67
  ["Xavier Hutchinson","WR","HOU"], // 301 · avg 323.67
  ["Jarquez Hunter","RB","FA"], // 302 · avg 324.67
  ["Kareem Hunt","RB","FA"], // 303 · avg 325.00
  ["Elijah Arroyo","TE","SEA"], // 304 · avg 325.67
  ["Oscar Delp","TE","NO"], // 305 · avg 326.33
  ["Bryce Lance","WR","NO"], // 306 · avg 328.00
  ["Jerome Ford","RB","WAS"], // 307 · avg 330.00
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.33
  ["Tyreek Hill","WR","FA"], // 309 · avg 331.00
  ["Charlie Smyth","K","NO"], // 310 · avg 333.00
  ["Carson Beck","QB","ARI"], // 311 · avg 333.67
  ["Jake Elliott","K","PHI"], // 312 · avg 334.00
  ["Cole Kmet","TE","CHI"], // 313 · avg 337.00
  ["Dawson Knox","TE","BUF"], // 314 · avg 338.00
  ["Kendrick Bourne","WR","ARI"], // 315 · avg 338.67
  ["Erick All Jr.","TE","CIN"], // 316 · avg 339.00
  ["Joshua Palmer","WR","BUF"], // 317 · avg 340.00
  ["Eli Raridon","TE","NE"], // 318 · avg 340.67
  ["Bam Knight","RB","ARI"], // 319 · avg 343.33
  ["Tyler Higbee","TE","LAR"], // 320 · avg 345.33
  ["Roschon Johnson","RB","CHI"], // 321 · avg 346.00
  ["Malik Benson","WR","LV"], // 322 · avg 347.33
  ["Olamide Zaccheaus","WR","ATL"], // 323 · avg 347.67
  ["Luke McCaffrey","WR","WAS"], // 324 · avg 348.33
  ["Noah Gray","TE","KC"], // 325 · avg 350.67
  ["Tyler Bass","K","BUF"], // 326 · avg 351.67
  ["Zavion Thomas","WR","CHI"], // 327 · avg 351.67
  ["Brenen Thompson","WR","LAC"], // 328 · avg 352.33
  ["Jalen Royals","WR","KC"], // 329 · avg 353.67
  ["J.J. McCarthy","QB","MIN"], // 330 · avg 355.67
  ["Mac Jones","QB","SF"], // 331 · avg 356.33
  ["Konata Mumpfield","WR","LAR"], // 332 · avg 356.67
  ["Max Klare","TE","LAR"], // 333 · avg 359.00
  ["Treylon Burks","WR","WAS"], // 334 · avg 359.00
  ["Roman Wilson","WR","PIT"], // 335 · avg 359.67
  ["Trey Smack","K","GB"], // 336 · avg 363.00
  ["Ja'Tavion Sanders","TE","CAR"], // 337 · avg 363.33
  ["KaVontae Turpin","WR","DAL"], // 338 · avg 364.00
  ["Cedric Tillman","WR","NO"], // 339 · avg 365.00
  ["Kalif Raymond","WR","CHI"], // 340 · avg 365.00
  ["Eli Heidenreich","RB","PIT"], // 341 · avg 366.67
  ["Raheim Sanders","RB","CLE"], // 342 · avg 366.67
  ["Odell Beckham Jr.","WR","NYG"], // 343 · avg 368.33
  ["Sione Vaki","RB","DET"], // 344 · avg 368.67
  ["Justin Fields","QB","KC"], // 345 · avg 369.33
  ["Jordan Whittington","WR","LAR"], // 346 · avg 400.33 · adj -28
  ["Joe Mixon","RB","FA"], // 347 · avg 372.67
  ["Colbie Young","WR","CIN"], // 348 · avg 374.33
  ["Kevin Coleman Jr.","WR","MIA"], // 349 · avg 374.67
  ["Ty Simpson","QB","LAR"], // 350 · avg 374.67
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
