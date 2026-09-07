import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-07T18:37:07.444Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Christian McCaffrey","RB","SF"], // 5 · avg 7.67
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 9.67
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.33
  ["Nico Collins","WR","HOU"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Chase Brown","RB","CIN"], // 15 · avg 15.67
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["George Pickens","WR","DAL"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Chris Olave","WR","NO"], // 21 · avg 20.67
  ["Kenneth Walker III","RB","KC"], // 22 · avg 20.67
  ["Trey McBride","TE","ARI"], // 23 · avg 21.67
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.00
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.00
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.33
  ["DeVonta Smith","WR","PHI"], // 27 · avg 25.67
  ["Josh Allen","QB","BUF"], // 28 · avg 26.33
  ["Rashee Rice","WR","KC"], // 29 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Kyren Williams","RB","LAR"], // 31 · avg 34.67
  ["Tee Higgins","WR","CIN"], // 32 · avg 34.67
  ["Javonte Williams","RB","DAL"], // 33 · avg 35.67
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.00
  ["Ladd McConkey","WR","LAC"], // 35 · avg 36.67
  ["Drake Maye","QB","NE"], // 36 · avg 37.33
  ["Tetairoa McMillan","WR","CAR"], // 37 · avg 37.67
  ["Colston Loveland","TE","CHI"], // 38 · avg 38.33
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 44.00
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 48.33
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.67 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.00 · adj +12
  ["Luther Burden III","WR","CHI"], // 47 · avg 49.33
  ["Jameson Williams","WR","DET"], // 48 · avg 50.00
  ["Bucky Irving","RB","TB"], // 49 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.33 · adj +12
  ["DJ Moore","WR","BUF"], // 51 · avg 52.33
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 41.00 · adj +12
  ["Christian Watson","WR","GB"], // 53 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 54 · avg 55.00
  ["David Montgomery","RB","HOU"], // 55 · avg 55.67
  ["Jalen Hurts","QB","PHI"], // 56 · avg 55.67
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.33
  ["Rome Odunze","WR","CHI"], // 58 · avg 59.00
  ["Jayden Daniels","QB","WAS"], // 59 · avg 59.33
  ["Jadarian Price","RB","SEA"], // 60 · avg 61.33
  ["Bhayshul Tuten","RB","JAC"], // 61 · avg 62.00
  ["Parker Washington","WR","JAC"], // 62 · avg 62.33
  ["Mike Evans","WR","SF"], // 63 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.33
  ["Tyler Warren","TE","IND"], // 66 · avg 56.33 · adj +12
  ["Rhamondre Stevenson","RB","NE"], // 67 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.33
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 69.33
  ["Jaylen Warren","RB","PIT"], // 70 · avg 71.00
  ["Trevor Lawrence","QB","JAC"], // 71 · avg 72.00
  ["Carnell Tate","WR","TEN"], // 72 · avg 72.33
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.00
  ["DK Metcalf","WR","PIT"], // 74 · avg 75.67
  ["Tony Pollard","RB","TEN"], // 75 · avg 76.33
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 78.00
  ["Rico Dowdle","RB","PIT"], // 77 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 80.00
  ["Kyle Pitts Sr.","TE","ATL"], // 79 · avg 81.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.33 · adj +12
  ["Harold Fannin Jr.","TE","CLE"], // 81 · avg 81.67
  ["Courtland Sutton","WR","DEN"], // 82 · avg 83.00
  ["Jonathon Brooks","RB","CAR"], // 83 · avg 85.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 86.00
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.33
  ["Michael Wilson","WR","ARI"], // 86 · avg 90.67
  ["Alec Pierce","WR","IND"], // 87 · avg 91.00
  ["Sam LaPorta","TE","DET"], // 88 · avg 80.67 · adj +12
  ["Blake Corum","RB","LAR"], // 89 · avg 92.67
  ["Brock Purdy","QB","SF"], // 90 · avg 94.00
  ["Chuba Hubbard","RB","CAR"], // 91 · avg 94.00
  ["Bo Nix","QB","DEN"], // 92 · avg 95.00
  ["Jaxson Dart","QB","NYG"], // 93 · avg 96.67
  ["Stefon Diggs","WR","WAS"], // 94 · avg 97.00
  ["MarShawn Lloyd","RB","GB"], // 95 · avg 99.33
  ["RJ Harvey","RB","DEN"], // 96 · avg 99.33
  ["Jordan Mason","RB","MIN"], // 97 · avg 100.67
  ["Jayden Reed","WR","GB"], // 98 · avg 101.00
  ["George Kittle","TE","SF"], // 99 · avg 89.33 · adj +12
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 101.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 101 · avg 101.67
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.33 · adj +12
  ["Travis Kelce","TE","KC"], // 103 · avg 103.00
  ["Jordan Addison","WR","MIN"], // 104 · avg 103.33
  ["Tyler Allgeier","RB","ARI"], // 105 · avg 131.33 · adj -28
  ["Mike Washington Jr.","RB","LV"], // 106 · avg 141.33 · adj -38
  ["Wan'Dale Robinson","WR","TEN"], // 107 · avg 104.00
  ["Jared Goff","QB","DET"], // 108 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 109 · avg 105.00
  ["Matthew Stafford","QB","LAR"], // 110 · avg 105.33
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 108.33
  ["Josh Downs","WR","IND"], // 112 · avg 97.33 · adj +12
  ["Rachaad White","RB","WAS"], // 113 · avg 111.00
  ["Makai Lemon","WR","PHI"], // 114 · avg 113.00
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 115.00
  ["Kyler Murray","QB","MIN"], // 116 · avg 115.00
  ["Isaiah Likely","TE","NYG"], // 117 · avg 115.33
  ["KC Concepcion","WR","CLE"], // 118 · avg 115.33
  ["Dallas Goedert","TE","PHI"], // 119 · avg 115.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.33
  ["De'Zhaun Stribling","WR","SF"], // 121 · avg 118.67
  ["Aaron Jones Sr.","RB","MIN"], // 122 · avg 119.67
  ["Baker Mayfield","QB","TB"], // 123 · avg 120.67
  ["Matthew Golden","WR","GB"], // 124 · avg 123.67
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 124.00
  ["Mark Andrews","TE","BAL"], // 126 · avg 124.67
  ["Romeo Doubs","WR","NE"], // 127 · avg 127.00
  ["Xavier Worthy","WR","KC"], // 128 · avg 127.33
  ["Jake Ferguson","TE","DAL"], // 129 · avg 127.67
  ["Tyler Shough","QB","NO"], // 130 · avg 128.33
  ["Jalen Coker","WR","CAR"], // 131 · avg 129.67
  ["Juwan Johnson","TE","NO"], // 132 · avg 130.00
  ["Woody Marks","RB","HOU"], // 133 · avg 131.67
  ["Malik Willis","QB","MIA"], // 134 · avg 132.00
  ["Braelon Allen","RB","NYJ"], // 135 · avg 162.67 · adj -28
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.67 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 135.67
  ["Jalen McMillan","WR","TB"], // 138 · avg 163.67 · adj -28
  ["Jonah Coleman","RB","DEN"], // 139 · avg 138.67
  ["Sam Darnold","QB","SEA"], // 140 · avg 138.67
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 139.33
  ["Deebo Samuel Sr.","WR","SF"], // 142 · avg 140.33
  ["Tyjae Spears","RB","TEN"], // 143 · avg 140.33
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.00
  ["Daniel Jones","QB","IND"], // 145 · avg 144.00
  ["Keaton Mitchell","RB","LAC"], // 146 · avg 144.00
  ["Josh Jacobs","RB","GB"], // 147 · avg 146.67
  ["Tank Bigsby","RB","PHI"], // 148 · avg 148.00
  ["Denzel Boston","WR","CLE"], // 149 · avg 150.00
  ["Dylan Sampson","RB","CLE"], // 150 · avg 150.33
  ["Hunter Henry","TE","NE"], // 151 · avg 150.67
  ["Tre Tucker","WR","LV"], // 152 · avg 152.33
  ["Brenton Strange","TE","JAC"], // 153 · avg 153.00
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 153.00
  ["Cam Ward","QB","TEN"], // 155 · avg 155.33
  ["Dalton Schultz","TE","HOU"], // 156 · avg 158.00
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 158.67
  ["Kayshon Boutte","WR","HOU"], // 158 · avg 158.67
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 160.00
  ["Emmett Johnson","RB","KC"], // 160 · avg 163.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 161 · avg 164.33
  ["Bryce Young","QB","CAR"], // 162 · avg 165.67
  ["Jerry Jeudy","WR","CLE"], // 163 · avg 166.33
  ["Dontayvion Wicks","WR","PHI"], // 164 · avg 168.67
  ["Jauan Jennings","WR","MIN"], // 165 · avg 171.33
  ["Jalen Nailor","WR","LV"], // 166 · avg 174.00
  ["Tre' Harris","WR","LAC"], // 167 · avg 174.00
  ["Ray Davis","RB","BUF"], // 168 · avg 174.33
  ["Omar Cooper Jr.","WR","NYJ"], // 169 · avg 178.00
  ["Terrance Ferguson","TE","LAR"], // 170 · avg 179.00
  ["Zach Charbonnet","RB","SEA"], // 171 · avg 144.67 · adj +35
  ["Pat Bryant","WR","DEN"], // 172 · avg 181.33
  ["Ryan Flournoy","WR","DAL"], // 173 · avg 181.33
  ["Keenan Allen","WR","IND"], // 174 · avg 182.00
  ["AJ Barner","TE","SEA"], // 175 · avg 182.67
  ["T.J. Hockenson","TE","MIN"], // 176 · avg 182.67
  ["Malik Washington","WR","MIA"], // 177 · avg 186.67
  ["Brandon Aubrey","K","DAL"], // 178 · avg 188.33
  ["Jacoby Brissett","QB","ARI"], // 179 · avg 190.00
  ["Calvin Ridley","WR","TEN"], // 180 · avg 190.67
  ["Kimani Vidal","RB","LAC"], // 181 · avg 191.00
  ["Isiah Pacheco","RB","DET"], // 182 · avg 192.33
  ["Kenyon Sadiq","TE","NYJ"], // 183 · avg 196.00
  ["Cameron Dicker","K","LAC"], // 184 · avg 196.33
  ["Ja'Kobi Lane","WR","BAL"], // 185 · avg 198.67
  ["Ka'imi Fairbairn","K","HOU"], // 186 · avg 198.67
  ["Jaylin Noel","WR","HOU"], // 187 · avg 200.00
  ["Oronde Gadsden II","TE","LAC"], // 188 · avg 202.00
  ["Sean Tucker","RB","TB"], // 189 · avg 202.33
  ["Aaron Rodgers","QB","PIT"], // 190 · avg 202.67
  ["Cam Little","K","JAC"], // 191 · avg 202.67
  ["Kaelon Black","RB","SF"], // 192 · avg 205.33
  ["Jason Myers","K","SEA"], // 193 · avg 206.00
  ["Travis Hunter","WR","JAC"], // 194 · avg 207.00
  ["Alvin Kamara","RB","NO"], // 195 · avg 162.33 · adj +45
  ["Malik Davis","RB","DAL"], // 196 · avg 208.33
  ["Nicholas Singleton","RB","TEN"], // 197 · avg 208.67
  ["Rashod Bateman","WR","BAL"], // 198 · avg 208.67
  ["Gunnar Helm","TE","TEN"], // 199 · avg 211.33
  ["Pat Freiermuth","TE","PIT"], // 200 · avg 211.33
  ["Kaytron Allen","RB","WAS"], // 201 · avg 214.00
  ["Eddy Pineiro","K","SF"], // 202 · avg 215.00
  ["Geno Smith","QB","NYJ"], // 203 · avg 217.33
  ["Isaac TeSlaa","WR","DET"], // 204 · avg 217.33
  ["Tyler Loop","K","BAL"], // 205 · avg 217.33
  ["Jake Bates","K","DET"], // 206 · avg 219.67
  ["Chris Bell","WR","MIA"], // 207 · avg 220.33
  ["Malachi Fields","WR","NYG"], // 208 · avg 221.00
  ["Kendre Miller","RB","NO"], // 209 · avg 271.00 · adj -50
  ["Najee Harris","RB","NYG"], // 210 · avg 222.33
  ["Jaylen Wright","RB","MIA"], // 211 · avg 222.67
  ["Cade Otton","TE","TB"], // 212 · avg 223.33
  ["James Conner","RB","ARI"], // 213 · avg 240.67 · adj -16
  ["Zachariah Branch","WR","ATL"], // 214 · avg 226.33
  ["Darnell Mooney","WR","NYG"], // 215 · avg 227.67
  ["Cooper Kupp","WR","SEA"], // 216 · avg 228.33
  ["Evan McPherson","K","CIN"], // 217 · avg 230.67
  ["Cairo Santos","K","CHI"], // 218 · avg 231.33
  ["George Holani","RB","SEA"], // 219 · avg 231.33
  ["Kaleb Johnson","RB","GB"], // 220 · avg 233.33
  ["Emanuel Wilson","RB","SEA"], // 221 · avg 236.33
  ["Chase McLaughlin","K","TB"], // 222 · avg 237.00
  ["Justice Hill","RB","BAL"], // 223 · avg 237.00
  ["Harrison Mevis","K","LAR"], // 224 · avg 237.33
  ["Andy Borregales","K","NE"], // 225 · avg 237.67
  ["Isaiah Davis","RB","NYJ"], // 226 · avg 266.00 · adj -28
  ["Caleb Douglas","WR","MIA"], // 227 · avg 239.33
  ["Germie Bernard","WR","PIT"], // 228 · avg 240.33
  ["Greg Dulcich","TE","MIA"], // 229 · avg 242.00
  ["Jordyn Tyson","WR","NO"], // 230 · avg 143.33 · adj +100
  ["Devaughn Vele","WR","NO"], // 231 · avg 245.33
  ["Troy Franklin","WR","DEN"], // 232 · avg 245.33
  ["Evan Engram","TE","DEN"], // 233 · avg 246.00
  ["Tank Dell","WR","HOU"], // 234 · avg 247.00
  ["Chris Brooks","RB","GB"], // 235 · avg 248.33
  ["Demond Claiborne","RB","MIN"], // 236 · avg 248.67
  ["Samaje Perine","RB","CIN"], // 237 · avg 249.00
  ["Ted Hurst III","WR","TB"], // 238 · avg 249.00
  ["David Njoku","TE","LAC"], // 239 · avg 252.33
  ["Harrison Butker","K","KC"], // 240 · avg 254.33
  ["Fernando Mendoza","QB","LV"], // 241 · avg 254.67
  ["Devin Neal","RB","FA"], // 242 · avg 305.67 · adj -50
  ["Ollie Gordon II","RB","MIA"], // 243 · avg 257.67
  ["Chris Boswell","K","PIT"], // 244 · avg 258.00
  ["Jack Bech","WR","LV"], // 245 · avg 258.33
  ["Colby Parkinson","TE","LAR"], // 246 · avg 262.00
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 263.33
  ["Keon Coleman","WR","BUF"], // 248 · avg 252.00 · adj +12
  ["Jordan James","RB","SF"], // 249 · avg 265.00
  ["Seth McGowan","RB","IND"], // 250 · avg 266.67
  ["Cyrus Allen","WR","KC"], // 251 · avg 267.33
  ["Tory Horton","WR","SEA"], // 252 · avg 268.33
  ["Tyquan Thornton","WR","KC"], // 253 · avg 268.67
  ["Chimere Dike","WR","TEN"], // 254 · avg 269.00
  ["Tua Tagovailoa","QB","ATL"], // 255 · avg 270.00
  ["Wil Lutz","K","DEN"], // 256 · avg 270.67
  ["Ty Johnson","RB","BUF"], // 257 · avg 271.00
  ["LeQuint Allen Jr.","RB","JAC"], // 258 · avg 273.00
  ["Will Reichard","K","MIN"], // 259 · avg 276.00
  ["Xavier Legette","WR","CAR"], // 260 · avg 276.00
  ["Kirk Cousins","QB","LV"], // 261 · avg 278.00
  ["Darius Slayton","WR","NYG"], // 262 · avg 278.33
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.67
  ["Marvin Mims Jr.","WR","DEN"], // 264 · avg 281.67
  ["DJ Giddens","RB","IND"], // 265 · avg 282.67
  ["Elijah Sarratt","WR","BAL"], // 266 · avg 283.33
  ["Deshaun Watson","QB","CLE"], // 267 · avg 284.33
  ["Christian Kirk","WR","SF"], // 268 · avg 285.00
  ["Theo Johnson","TE","NYG"], // 269 · avg 285.33
  ["Shedeur Sanders","QB","CLE"], // 270 · avg 286.00
  ["Kyle Williams","WR","NE"], // 271 · avg 287.00
  ["Michael Penix Jr.","QB","ATL"], // 272 · avg 275.33 · adj +12
  ["Brashard Smith","RB","KC"], // 273 · avg 289.00
  ["Eli Stowers","TE","PHI"], // 274 · avg 292.33
  ["Devin Singletary","RB","NYG"], // 275 · avg 293.00
  ["Mike Gesicki","TE","CIN"], // 276 · avg 295.00
  ["Adam Randall","RB","BAL"], // 277 · avg 296.00
  ["Hollywood Brown","WR","PHI"], // 278 · avg 296.00
  ["Emari Demercado","RB","DAL"], // 279 · avg 300.00
  ["Skyler Bell","WR","BUF"], // 280 · avg 300.00
  ["Mack Hollins","WR","NE"], // 281 · avg 301.33
  ["Jaydon Blue","RB","PHI"], // 282 · avg 302.33
  ["Darren Waller","TE","CAR"], // 283 · avg 303.33
  ["Andrei Iosivas","WR","CIN"], // 284 · avg 304.67
  ["Isaiah Bond","WR","CLE"], // 285 · avg 304.67
  ["DeMario Douglas","WR","NE"], // 286 · avg 305.00
  ["Jake Tonges","TE","SF"], // 287 · avg 307.67
  ["Tez Johnson","WR","TB"], // 288 · avg 338.33 · adj -28
  ["Tahj Brooks","RB","CIN"], // 289 · avg 310.67
  ["Trevor Etienne","RB","CAR"], // 290 · avg 311.67
  ["Brandon Aiyuk","WR","SF"], // 291 · avg 312.67
  ["Isaac Guerendo","RB","SF"], // 292 · avg 315.00
  ["Charlie Kolar","TE","LAC"], // 293 · avg 315.33
  ["Darnell Washington","TE","PIT"], // 294 · avg 315.33
  ["Will Shipley","RB","PHI"], // 295 · avg 315.67
  ["Audric Estime","RB","NO"], // 296 · avg 316.33
  ["Jahan Dotson","WR","ATL"], // 297 · avg 318.33
  ["Michael Mayer","TE","LV"], // 298 · avg 319.33
  ["Jerome Ford","RB","WAS"], // 299 · avg 320.67
  ["Jaleel McLaughlin","RB","CLE"], // 300 · avg 321.33
  ["Charlie Smyth","K","NO"], // 301 · avg 324.00
  ["Bryce Lance","WR","NO"], // 302 · avg 325.33
  ["Jarquez Hunter","RB","FA"], // 303 · avg 325.33
  ["Oscar Delp","TE","NO"], // 304 · avg 326.00
  ["Xavier Hutchinson","WR","HOU"], // 305 · avg 326.33
  ["Tyreek Hill","WR","FA"], // 306 · avg 327.33
  ["Elijah Arroyo","TE","SEA"], // 307 · avg 327.67
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 328.67
  ["Kareem Hunt","RB","FA"], // 309 · avg 329.33
  ["Jacob Saylors","RB","DET"], // 310 · avg 332.00
  ["Carson Beck","QB","ARI"], // 311 · avg 334.00
  ["Cole Kmet","TE","CHI"], // 312 · avg 335.33
  ["Dawson Knox","TE","BUF"], // 313 · avg 336.67
  ["Eli Raridon","TE","NE"], // 314 · avg 336.67
  ["Kendrick Bourne","WR","ARI"], // 315 · avg 338.33
  ["Tyler Higbee","TE","LAR"], // 316 · avg 341.33
  ["Joshua Palmer","WR","BUF"], // 317 · avg 342.00
  ["Bam Knight","RB","ARI"], // 318 · avg 342.33
  ["Jake Elliott","K","PHI"], // 319 · avg 343.33
  ["Erick All Jr.","TE","CIN"], // 320 · avg 343.67
  ["Olamide Zaccheaus","WR","ATL"], // 321 · avg 347.00
  ["Luke McCaffrey","WR","WAS"], // 322 · avg 347.33
  ["Noah Gray","TE","KC"], // 323 · avg 347.67
  ["Malik Benson","WR","LV"], // 324 · avg 348.33
  ["Tyler Bass","K","BUF"], // 325 · avg 348.67
  ["Brenen Thompson","WR","LAC"], // 326 · avg 351.67
  ["J.J. McCarthy","QB","MIN"], // 327 · avg 352.33
  ["Roschon Johnson","RB","CHI"], // 328 · avg 352.33
  ["Max Klare","TE","LAR"], // 329 · avg 352.67
  ["Jalen Royals","WR","KC"], // 330 · avg 353.67
  ["Konata Mumpfield","WR","LAR"], // 331 · avg 354.00
  ["Treylon Burks","WR","WAS"], // 332 · avg 354.67
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 356.67
  ["Mac Jones","QB","SF"], // 334 · avg 357.67
  ["Zavion Thomas","WR","CHI"], // 335 · avg 358.67
  ["Kalif Raymond","WR","CHI"], // 336 · avg 361.00
  ["Roman Wilson","WR","PIT"], // 337 · avg 361.33
  ["Cedric Tillman","WR","NO"], // 338 · avg 363.00
  ["Raheim Sanders","RB","CLE"], // 339 · avg 364.67
  ["Justin Fields","QB","KC"], // 340 · avg 366.33
  ["KaVontae Turpin","WR","DAL"], // 341 · avg 366.67
  ["Eli Heidenreich","RB","PIT"], // 342 · avg 367.00
  ["Trey Smack","K","GB"], // 343 · avg 367.00
  ["Kevin Coleman Jr.","WR","MIA"], // 344 · avg 368.33
  ["Joe Mixon","RB","FA"], // 345 · avg 369.33
  ["Jordan Whittington","WR","LAR"], // 346 · avg 400.67 · adj -28
  ["Anthony Richardson Sr.","QB","IND"], // 347 · avg 376.00
  ["Demarcus Robinson","WR","SF"], // 348 · avg 376.00
  ["Colbie Young","WR","CIN"], // 349 · avg 376.33
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 377.00
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
