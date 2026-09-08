import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-08T17:46:35.088Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.33
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 5.67
  ["Christian McCaffrey","RB","SF"], // 5 · avg 7.67
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 9.67
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.00
  ["James Cook III","RB","BUF"], // 9 · avg 10.33
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.33
  ["Chase Brown","RB","CIN"], // 13 · avg 15.00
  ["Nico Collins","WR","HOU"], // 14 · avg 15.00
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 16.33
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.33
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["Davante Adams","WR","LAR"], // 19 · avg 47.67 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 20.00
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.67
  ["Chris Olave","WR","NO"], // 22 · avg 21.00
  ["Omarion Hampton","RB","LAC"], // 23 · avg 22.00
  ["Trey McBride","TE","ARI"], // 24 · avg 22.00
  ["Derrick Henry","RB","BAL"], // 25 · avg 22.67
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["DeVonta Smith","WR","PHI"], // 27 · avg 26.00
  ["Josh Allen","QB","BUF"], // 28 · avg 26.33
  ["Rashee Rice","WR","KC"], // 29 · avg 30.67
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 34.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 35.00
  ["Javonte Williams","RB","DAL"], // 33 · avg 35.33
  ["Jaylen Waddle","WR","DEN"], // 34 · avg 36.00
  ["Drake Maye","QB","NE"], // 35 · avg 37.33
  ["Colston Loveland","TE","CHI"], // 36 · avg 38.00
  ["Ladd McConkey","WR","LAC"], // 37 · avg 38.00
  ["Tetairoa McMillan","WR","CAR"], // 38 · avg 38.33
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.67
  ["Zay Flowers","WR","BAL"], // 40 · avg 28.33 · adj +12
  ["Joe Burrow","QB","CIN"], // 41 · avg 44.33
  ["Travis Etienne Jr.","RB","NO"], // 42 · avg 44.33
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 48.33
  ["Luther Burden III","WR","CHI"], // 45 · avg 49.00
  ["Ashton Jeanty","RB","LV"], // 46 · avg 27.33 · adj +22
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.33 · adj +12
  ["Jameson Williams","WR","DET"], // 48 · avg 50.00
  ["Bucky Irving","RB","TB"], // 49 · avg 50.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 40.00 · adj +12
  ["DJ Moore","WR","BUF"], // 52 · avg 53.00
  ["Christian Watson","WR","GB"], // 53 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 54 · avg 55.00
  ["David Montgomery","RB","HOU"], // 55 · avg 55.67
  ["Jalen Hurts","QB","PHI"], // 56 · avg 55.67
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.33
  ["Jayden Daniels","QB","WAS"], // 58 · avg 59.00
  ["Rome Odunze","WR","CHI"], // 59 · avg 59.67
  ["Jadarian Price","RB","SEA"], // 60 · avg 60.67
  ["Bhayshul Tuten","RB","JAC"], // 61 · avg 62.00
  ["Parker Washington","WR","JAC"], // 62 · avg 62.33
  ["Mike Evans","WR","SF"], // 63 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 64 · avg 65.00
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.33
  ["Rhamondre Stevenson","RB","NE"], // 66 · avg 68.33
  ["Tyler Warren","TE","IND"], // 67 · avg 56.67 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Jaylen Warren","RB","PIT"], // 70 · avg 71.00
  ["Trevor Lawrence","QB","JAC"], // 71 · avg 71.33
  ["Carnell Tate","WR","TEN"], // 72 · avg 72.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.33
  ["DK Metcalf","WR","PIT"], // 74 · avg 75.67
  ["Tony Pollard","RB","TEN"], // 75 · avg 76.00
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 79.00
  ["Rico Dowdle","RB","PIT"], // 77 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 80.67
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.67
  ["Tucker Kraft","TE","GB"], // 80 · avg 70.00 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 82.00
  ["Courtland Sutton","WR","DEN"], // 82 · avg 84.33
  ["Jonathon Brooks","RB","CAR"], // 83 · avg 84.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.67
  ["Alec Pierce","WR","IND"], // 85 · avg 89.33
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 89.33
  ["Sam LaPorta","TE","DET"], // 87 · avg 79.67 · adj +12
  ["Michael Wilson","WR","ARI"], // 88 · avg 92.00
  ["Blake Corum","RB","LAR"], // 89 · avg 93.67
  ["Brock Purdy","QB","SF"], // 90 · avg 94.00
  ["Chuba Hubbard","RB","CAR"], // 91 · avg 94.33
  ["Jaxson Dart","QB","NYG"], // 92 · avg 95.33
  ["Bo Nix","QB","DEN"], // 93 · avg 96.67
  ["Stefon Diggs","WR","WAS"], // 94 · avg 97.67
  ["MarShawn Lloyd","RB","GB"], // 95 · avg 98.67
  ["RJ Harvey","RB","DEN"], // 96 · avg 100.00
  ["George Kittle","TE","SF"], // 97 · avg 88.33 · adj +12
  ["Jordan Mason","RB","MIN"], // 98 · avg 100.33
  ["Jayden Reed","WR","GB"], // 99 · avg 101.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 100 · avg 101.67
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 90.00 · adj +12
  ["Patrick Mahomes II","QB","KC"], // 102 · avg 102.67
  ["Jordan Addison","WR","MIN"], // 103 · avg 103.00
  ["Travis Kelce","TE","KC"], // 104 · avg 103.33
  ["Tyler Allgeier","RB","ARI"], // 105 · avg 131.33 · adj -28
  ["Kenny Gainwell","RB","TB"], // 106 · avg 104.00
  ["Mike Washington Jr.","RB","LV"], // 107 · avg 142.00 · adj -38
  ["Jared Goff","QB","DET"], // 108 · avg 104.33
  ["Wan'Dale Robinson","WR","TEN"], // 109 · avg 104.67
  ["Matthew Stafford","QB","LAR"], // 110 · avg 105.67
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 106.67
  ["Josh Downs","WR","IND"], // 112 · avg 97.00 · adj +12
  ["Rachaad White","RB","WAS"], // 113 · avg 110.67
  ["Makai Lemon","WR","PHI"], // 114 · avg 113.00
  ["Dallas Goedert","TE","PHI"], // 115 · avg 114.33
  ["Isaiah Likely","TE","NYG"], // 116 · avg 115.00
  ["KC Concepcion","WR","CLE"], // 117 · avg 115.00
  ["Kyler Murray","QB","MIN"], // 118 · avg 115.67
  ["Jakobi Meyers","WR","JAC"], // 119 · avg 117.00
  ["De'Zhaun Stribling","WR","SF"], // 120 · avg 118.00
  ["Jordan Love","QB","GB"], // 121 · avg 119.33
  ["Aaron Jones Sr.","RB","MIN"], // 122 · avg 120.33
  ["Baker Mayfield","QB","TB"], // 123 · avg 121.67
  ["Matthew Golden","WR","GB"], // 124 · avg 121.67
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 123.33
  ["Romeo Doubs","WR","NE"], // 126 · avg 126.33
  ["Xavier Worthy","WR","KC"], // 127 · avg 126.33
  ["Jake Ferguson","TE","DAL"], // 128 · avg 128.00
  ["Mark Andrews","TE","BAL"], // 129 · avg 128.00
  ["Tyler Shough","QB","NO"], // 130 · avg 128.33
  ["Jalen Coker","WR","CAR"], // 131 · avg 129.33
  ["Juwan Johnson","TE","NO"], // 132 · avg 129.33
  ["Woody Marks","RB","HOU"], // 133 · avg 130.67
  ["Malik Willis","QB","MIA"], // 134 · avg 131.67
  ["Kyle Monangai","RB","CHI"], // 135 · avg 112.33 · adj +22
  ["Braelon Allen","RB","NYJ"], // 136 · avg 162.67 · adj -28
  ["Jalen McMillan","WR","TB"], // 137 · avg 162.67 · adj -28
  ["Khalil Shakir","WR","BUF"], // 138 · avg 135.67
  ["Sam Darnold","QB","SEA"], // 139 · avg 138.33
  ["Deebo Samuel Sr.","WR","SF"], // 140 · avg 138.67
  ["Jonah Coleman","RB","DEN"], // 141 · avg 139.00
  ["Rashid Shaheed","WR","SEA"], // 142 · avg 139.33
  ["Tyjae Spears","RB","TEN"], // 143 · avg 140.67
  ["C.J. Stroud","QB","HOU"], // 144 · avg 141.33
  ["Keaton Mitchell","RB","LAC"], // 145 · avg 142.33
  ["Daniel Jones","QB","IND"], // 146 · avg 143.33
  ["Josh Jacobs","RB","GB"], // 147 · avg 146.33
  ["Tank Bigsby","RB","PHI"], // 148 · avg 147.33
  ["Denzel Boston","WR","CLE"], // 149 · avg 149.33
  ["Dylan Sampson","RB","CLE"], // 150 · avg 150.33
  ["Hunter Henry","TE","NE"], // 151 · avg 151.00
  ["Tre Tucker","WR","LV"], // 152 · avg 151.33
  ["Chig Okonkwo","TE","WAS"], // 153 · avg 152.67
  ["Brenton Strange","TE","JAC"], // 154 · avg 153.00
  ["Cam Ward","QB","TEN"], // 155 · avg 155.33
  ["Dalton Schultz","TE","HOU"], // 156 · avg 157.67
  ["Kayshon Boutte","WR","HOU"], // 157 · avg 158.67
  ["Adonai Mitchell","WR","NYJ"], // 158 · avg 159.00
  ["Brian Robinson Jr.","RB","ATL"], // 159 · avg 160.33
  ["Emmett Johnson","RB","KC"], // 160 · avg 163.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 161 · avg 165.00
  ["Bryce Young","QB","CAR"], // 162 · avg 166.00
  ["Dontayvion Wicks","WR","PHI"], // 163 · avg 166.67
  ["Jerry Jeudy","WR","CLE"], // 164 · avg 167.00
  ["Jauan Jennings","WR","MIN"], // 165 · avg 170.33
  ["Jalen Nailor","WR","LV"], // 166 · avg 172.67
  ["Tre' Harris","WR","LAC"], // 167 · avg 173.00
  ["Ray Davis","RB","BUF"], // 168 · avg 175.33
  ["Terrance Ferguson","TE","LAR"], // 169 · avg 175.67
  ["Omar Cooper Jr.","WR","NYJ"], // 170 · avg 176.33
  ["Ryan Flournoy","WR","DAL"], // 171 · avg 181.00
  ["Keenan Allen","WR","IND"], // 172 · avg 181.33
  ["Pat Bryant","WR","DEN"], // 173 · avg 181.67
  ["AJ Barner","TE","SEA"], // 174 · avg 182.00
  ["T.J. Hockenson","TE","MIN"], // 175 · avg 183.33
  ["Zach Charbonnet","RB","SEA"], // 176 · avg 148.67 · adj +35
  ["Malik Washington","WR","MIA"], // 177 · avg 187.00
  ["Brandon Aubrey","K","DAL"], // 178 · avg 189.00
  ["Jacoby Brissett","QB","ARI"], // 179 · avg 189.67
  ["Kimani Vidal","RB","LAC"], // 180 · avg 190.67
  ["Calvin Ridley","WR","TEN"], // 181 · avg 192.00
  ["Ja'Kobi Lane","WR","BAL"], // 182 · avg 193.33
  ["Kenyon Sadiq","TE","NYJ"], // 183 · avg 194.33
  ["Cameron Dicker","K","LAC"], // 184 · avg 197.00
  ["Ka'imi Fairbairn","K","HOU"], // 185 · avg 199.33
  ["Jaylin Noel","WR","HOU"], // 186 · avg 200.33
  ["Kaelon Black","RB","SF"], // 187 · avg 200.33
  ["Oronde Gadsden II","TE","LAC"], // 188 · avg 201.00
  ["Sean Tucker","RB","TB"], // 189 · avg 202.33
  ["Aaron Rodgers","QB","PIT"], // 190 · avg 203.67
  ["Cam Little","K","JAC"], // 191 · avg 203.67
  ["Isiah Pacheco","RB","DET"], // 192 · avg 204.33
  ["Travis Hunter","WR","JAC"], // 193 · avg 206.00
  ["Alvin Kamara","RB","NO"], // 194 · avg 161.67 · adj +45
  ["Jason Myers","K","SEA"], // 195 · avg 206.67
  ["Malik Davis","RB","DAL"], // 196 · avg 206.67
  ["Rashod Bateman","WR","BAL"], // 197 · avg 208.67
  ["Nicholas Singleton","RB","TEN"], // 198 · avg 211.33
  ["Pat Freiermuth","TE","PIT"], // 199 · avg 211.33
  ["Gunnar Helm","TE","TEN"], // 200 · avg 212.33
  ["Chris Bell","WR","MIA"], // 201 · avg 214.00
  ["Isaac TeSlaa","WR","DET"], // 202 · avg 214.33
  ["Kaytron Allen","RB","WAS"], // 203 · avg 215.67
  ["Eddy Pineiro","K","SF"], // 204 · avg 216.00
  ["Tyler Loop","K","BAL"], // 205 · avg 216.00
  ["Geno Smith","QB","NYJ"], // 206 · avg 217.00
  ["Jake Bates","K","DET"], // 207 · avg 220.00
  ["Kendre Miller","RB","NO"], // 208 · avg 270.00 · adj -50
  ["Malachi Fields","WR","NYG"], // 209 · avg 220.33
  ["Cade Otton","TE","TB"], // 210 · avg 221.33
  ["Zachariah Branch","WR","ATL"], // 211 · avg 223.33
  ["Jaylen Wright","RB","MIA"], // 212 · avg 224.33
  ["Najee Harris","RB","NYG"], // 213 · avg 224.33
  ["James Conner","RB","ARI"], // 214 · avg 241.00 · adj -16
  ["Cooper Kupp","WR","SEA"], // 215 · avg 228.67
  ["Darnell Mooney","WR","NYG"], // 216 · avg 229.00
  ["Evan McPherson","K","CIN"], // 217 · avg 231.00
  ["Kaleb Johnson","RB","GB"], // 218 · avg 231.33
  ["George Holani","RB","SEA"], // 219 · avg 231.67
  ["Cairo Santos","K","CHI"], // 220 · avg 233.67
  ["Germie Bernard","WR","PIT"], // 221 · avg 235.67
  ["Chase McLaughlin","K","TB"], // 222 · avg 236.33
  ["Justice Hill","RB","BAL"], // 223 · avg 236.33
  ["Isaiah Davis","RB","NYJ"], // 224 · avg 265.33 · adj -28
  ["Greg Dulcich","TE","MIA"], // 225 · avg 238.67
  ["Harrison Mevis","K","LAR"], // 226 · avg 238.67
  ["Andy Borregales","K","NE"], // 227 · avg 240.67
  ["Caleb Douglas","WR","MIA"], // 228 · avg 240.67
  ["Emanuel Wilson","RB","SEA"], // 229 · avg 243.00
  ["Devaughn Vele","WR","NO"], // 230 · avg 244.67
  ["Jordyn Tyson","WR","NO"], // 231 · avg 145.33 · adj +100
  ["Evan Engram","TE","DEN"], // 232 · avg 246.33
  ["Samaje Perine","RB","CIN"], // 233 · avg 246.67
  ["Troy Franklin","WR","DEN"], // 234 · avg 246.67
  ["Chris Brooks","RB","GB"], // 235 · avg 248.00
  ["Ted Hurst III","WR","TB"], // 236 · avg 249.33
  ["Demond Claiborne","RB","MIN"], // 237 · avg 250.33
  ["David Njoku","TE","LAC"], // 238 · avg 250.67
  ["Fernando Mendoza","QB","LV"], // 239 · avg 252.67
  ["Tank Dell","WR","HOU"], // 240 · avg 252.67
  ["Harrison Butker","K","KC"], // 241 · avg 255.67
  ["Ollie Gordon II","RB","MIA"], // 242 · avg 256.33
  ["Jack Bech","WR","LV"], // 243 · avg 258.33
  ["Devin Neal","RB","FA"], // 244 · avg 308.67 · adj -50
  ["Chris Boswell","K","PIT"], // 245 · avg 259.67
  ["Colby Parkinson","TE","LAR"], // 246 · avg 260.67
  ["Jordan James","RB","SF"], // 247 · avg 262.67
  ["Seth McGowan","RB","IND"], // 248 · avg 264.00
  ["Elic Ayomanor","WR","TEN"], // 249 · avg 265.67
  ["Keon Coleman","WR","BUF"], // 250 · avg 254.33 · adj +12
  ["Tyquan Thornton","WR","KC"], // 251 · avg 267.33
  ["Cyrus Allen","WR","KC"], // 252 · avg 267.67
  ["Tua Tagovailoa","QB","ATL"], // 253 · avg 268.33
  ["Chimere Dike","WR","TEN"], // 254 · avg 270.33
  ["Tory Horton","WR","SEA"], // 255 · avg 270.33
  ["Ty Johnson","RB","BUF"], // 256 · avg 273.00
  ["Wil Lutz","K","DEN"], // 257 · avg 273.33
  ["Xavier Legette","WR","CAR"], // 258 · avg 273.33
  ["Will Reichard","K","MIN"], // 259 · avg 274.33
  ["LeQuint Allen Jr.","RB","JAC"], // 260 · avg 276.00
  ["Kirk Cousins","QB","LV"], // 261 · avg 278.00
  ["Mason Taylor","TE","NYJ"], // 262 · avg 278.33
  ["Marvin Mims Jr.","WR","DEN"], // 263 · avg 280.67
  ["Deshaun Watson","QB","CLE"], // 264 · avg 283.33
  ["DJ Giddens","RB","IND"], // 265 · avg 283.33
  ["Elijah Sarratt","WR","BAL"], // 266 · avg 284.33
  ["Theo Johnson","TE","NYG"], // 267 · avg 284.33
  ["Michael Penix Jr.","QB","ATL"], // 268 · avg 272.67 · adj +12
  ["Christian Kirk","WR","SF"], // 269 · avg 286.00
  ["Kyle Williams","WR","NE"], // 270 · avg 286.33
  ["Shedeur Sanders","QB","CLE"], // 271 · avg 286.67
  ["Darius Slayton","WR","FA"], // 272 · avg 287.33
  ["Brashard Smith","RB","KC"], // 273 · avg 288.33
  ["Eli Stowers","TE","PHI"], // 274 · avg 292.00
  ["Devin Singletary","RB","NYG"], // 275 · avg 294.00
  ["Mike Gesicki","TE","CIN"], // 276 · avg 295.67
  ["Adam Randall","RB","BAL"], // 277 · avg 296.00
  ["Hollywood Brown","WR","PHI"], // 278 · avg 296.33
  ["DeMario Douglas","WR","NE"], // 279 · avg 299.67
  ["Emari Demercado","RB","DAL"], // 280 · avg 299.67
  ["Skyler Bell","WR","BUF"], // 281 · avg 299.67
  ["Mack Hollins","WR","NE"], // 282 · avg 301.00
  ["Jaydon Blue","RB","PHI"], // 283 · avg 301.33
  ["Andrei Iosivas","WR","CIN"], // 284 · avg 303.67
  ["Isaiah Bond","WR","CLE"], // 285 · avg 304.33
  ["Darren Waller","TE","CAR"], // 286 · avg 305.00
  ["Jake Tonges","TE","SF"], // 287 · avg 308.33
  ["Trevor Etienne","RB","CAR"], // 288 · avg 309.67
  ["Tez Johnson","WR","TB"], // 289 · avg 338.00 · adj -28
  ["Tahj Brooks","RB","CIN"], // 290 · avg 310.67
  ["Charlie Kolar","TE","LAC"], // 291 · avg 313.00
  ["Will Shipley","RB","PHI"], // 292 · avg 313.33
  ["Jahan Dotson","WR","ATL"], // 293 · avg 315.33
  ["Darnell Washington","TE","PIT"], // 294 · avg 315.67
  ["Audric Estime","RB","NO"], // 295 · avg 316.00
  ["Isaac Guerendo","RB","SF"], // 296 · avg 316.00
  ["Brandon Aiyuk","WR","SF"], // 297 · avg 316.67
  ["Michael Mayer","TE","LV"], // 298 · avg 319.00
  ["Jaleel McLaughlin","RB","CLE"], // 299 · avg 319.67
  ["Xavier Hutchinson","WR","HOU"], // 300 · avg 324.00
  ["Jerome Ford","RB","WAS"], // 301 · avg 324.67
  ["Oscar Delp","TE","NO"], // 302 · avg 324.67
  ["Jacob Saylors","RB","DET"], // 303 · avg 326.00
  ["Elijah Arroyo","TE","SEA"], // 304 · avg 326.33
  ["Bryce Lance","WR","NO"], // 305 · avg 326.67
  ["Jarquez Hunter","RB","FA"], // 306 · avg 327.33
  ["Charlie Smyth","K","NO"], // 307 · avg 327.67
  ["Tyreek Hill","WR","FA"], // 308 · avg 328.67
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 329.00
  ["Kareem Hunt","RB","FA"], // 310 · avg 330.00
  ["Carson Beck","QB","ARI"], // 311 · avg 335.00
  ["Dawson Knox","TE","BUF"], // 312 · avg 335.00
  ["Cole Kmet","TE","CHI"], // 313 · avg 337.33
  ["Eli Raridon","TE","NE"], // 314 · avg 337.33
  ["Jake Elliott","K","PHI"], // 315 · avg 338.67
  ["Joshua Palmer","WR","BUF"], // 316 · avg 339.33
  ["Kendrick Bourne","WR","ARI"], // 317 · avg 340.00
  ["Tyler Higbee","TE","LAR"], // 318 · avg 341.67
  ["Bam Knight","RB","ARI"], // 319 · avg 343.00
  ["Erick All Jr.","TE","CIN"], // 320 · avg 343.67
  ["Noah Gray","TE","KC"], // 321 · avg 345.67
  ["Olamide Zaccheaus","WR","ATL"], // 322 · avg 346.00
  ["Malik Benson","WR","LV"], // 323 · avg 347.67
  ["Tyler Bass","K","BUF"], // 324 · avg 349.33
  ["Luke McCaffrey","WR","WAS"], // 325 · avg 349.67
  ["Roschon Johnson","RB","CHI"], // 326 · avg 350.33
  ["Brenen Thompson","WR","LAC"], // 327 · avg 352.67
  ["J.J. McCarthy","QB","MIN"], // 328 · avg 353.33
  ["Konata Mumpfield","WR","LAR"], // 329 · avg 355.00
  ["Treylon Burks","WR","WAS"], // 330 · avg 356.33
  ["Jalen Royals","WR","KC"], // 331 · avg 356.67
  ["Mac Jones","QB","SF"], // 332 · avg 357.00
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 357.33
  ["Max Klare","TE","LAR"], // 334 · avg 357.33
  ["Zavion Thomas","WR","CHI"], // 335 · avg 358.33
  ["Cedric Tillman","WR","NO"], // 336 · avg 359.67
  ["Roman Wilson","WR","PIT"], // 337 · avg 361.00
  ["Kalif Raymond","WR","CHI"], // 338 · avg 361.33
  ["Trey Smack","K","GB"], // 339 · avg 363.67
  ["Justin Fields","QB","KC"], // 340 · avg 364.33
  ["KaVontae Turpin","WR","DAL"], // 341 · avg 365.33
  ["Raheim Sanders","RB","CLE"], // 342 · avg 365.33
  ["Eli Heidenreich","RB","PIT"], // 343 · avg 366.00
  ["Kevin Coleman Jr.","WR","MIA"], // 344 · avg 369.33
  ["Jordan Whittington","WR","LAR"], // 345 · avg 397.33 · adj -28
  ["Joe Mixon","RB","FA"], // 346 · avg 372.00
  ["Colbie Young","WR","CIN"], // 347 · avg 374.33
  ["Anthony Richardson Sr.","QB","IND"], // 348 · avg 375.33
  ["Tutu Atwell","WR","LAR"], // 349 · avg 376.67
  ["Noah Fant","TE","NO"], // 350 · avg 377.67
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
