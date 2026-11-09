import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-11-09T23:17:08.916Z · 350 players · ordered by adjusted consensus rank
export const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.33
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.33
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 5.67
  ["Christian McCaffrey","RB","SF"], // 5 · avg 7.67
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 7 · avg 9.67
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.33
  ["James Cook III","RB","BUF"], // 9 · avg 11.00
  ["A.J. Brown","WR","NE"], // 10 · avg 11.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 1.67 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.33
  ["Nico Collins","WR","HOU"], // 13 · avg 14.33
  ["Chase Brown","RB","CIN"], // 14 · avg 15.00
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Saquon Barkley","RB","PHI"], // 16 · avg 16.00
  ["De'Von Achane","RB","MIA"], // 17 · avg 19.00
  ["Chris Olave","WR","NO"], // 18 · avg 19.33
  ["Davante Adams","WR","LAR"], // 19 · avg 47.33 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Trey McBride","TE","ARI"], // 21 · avg 19.67
  ["Kenneth Walker III","RB","KC"], // 22 · avg 20.00
  ["Derrick Henry","RB","BAL"], // 23 · avg 22.00
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.00
  ["Josh Allen","QB","BUF"], // 25 · avg 24.33
  ["DeVonta Smith","WR","PHI"], // 26 · avg 24.67
  ["Malik Nabers","WR","NYG"], // 27 · avg 24.67
  ["Rashee Rice","WR","KC"], // 28 · avg 30.33
  ["Colston Loveland","TE","CHI"], // 29 · avg 31.00
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Javonte Williams","RB","DAL"], // 31 · avg 34.00
  ["Brock Bowers","TE","LV"], // 32 · avg 34.67
  ["Tee Higgins","WR","CIN"], // 33 · avg 34.67
  ["Kyren Williams","RB","LAR"], // 34 · avg 35.33
  ["Jaylen Waddle","WR","DEN"], // 35 · avg 36.67
  ["Ladd McConkey","WR","LAC"], // 36 · avg 38.00
  ["Drake Maye","QB","NE"], // 37 · avg 38.33
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.33
  ["Tetairoa McMillan","WR","CAR"], // 39 · avg 39.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 27.67 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 44.67
  ["D'Andre Swift","RB","CHI"], // 43 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 44 · avg 26.00 · adj +22
  ["Luther Burden III","WR","CHI"], // 45 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.00 · adj +12
  ["Jameson Williams","WR","DET"], // 47 · avg 49.33
  ["Terry McLaurin","WR","WAS"], // 48 · avg 49.67
  ["Bucky Irving","RB","TB"], // 49 · avg 52.00
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.67 · adj +12
  ["DJ Moore","WR","BUF"], // 51 · avg 53.00
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 41.33 · adj +12
  ["Christian Watson","WR","GB"], // 53 · avg 53.67
  ["Jalen Hurts","QB","PHI"], // 54 · avg 54.33
  ["Cam Skattebo","RB","NYG"], // 55 · avg 55.67
  ["David Montgomery","RB","HOU"], // 56 · avg 55.67
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.33
  ["Jayden Daniels","QB","WAS"], // 58 · avg 60.00
  ["Rome Odunze","WR","CHI"], // 59 · avg 60.67
  ["Parker Washington","WR","JAC"], // 60 · avg 61.00
  ["Jadarian Price","RB","SEA"], // 61 · avg 61.33
  ["Mike Evans","WR","SF"], // 62 · avg 63.33
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.67
  ["Tyler Warren","TE","IND"], // 64 · avg 52.33 · adj +12
  ["Caleb Williams","QB","CHI"], // 65 · avg 64.67
  ["Rhamondre Stevenson","RB","NE"], // 66 · avg 66.00
  ["Marvin Harrison Jr.","WR","HOU"], // 67 · avg 68.33
  ["Justin Herbert","QB","LAC"], // 68 · avg 68.67
  ["Jaylen Warren","RB","PIT"], // 69 · avg 70.00
  ["Trevor Lawrence","QB","JAC"], // 70 · avg 70.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 73.00
  ["TreVeyon Henderson","RB","NE"], // 72 · avg 73.33
  ["DK Metcalf","WR","PIT"], // 73 · avg 74.00
  ["Dak Prescott","QB","DAL"], // 74 · avg 75.00
  ["Rico Dowdle","RB","PIT"], // 75 · avg 77.00
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 78.00
  ["Tony Pollard","RB","TEN"], // 77 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 80.00
  ["Kyle Pitts Sr.","TE","ATL"], // 79 · avg 81.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.67 · adj +12
  ["Harold Fannin Jr.","TE","CLE"], // 81 · avg 81.67
  ["Courtland Sutton","WR","DEN"], // 82 · avg 85.00
  ["Jonathon Brooks","RB","CAR"], // 83 · avg 85.33
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.33
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.67
  ["Michael Wilson","WR","ARI"], // 86 · avg 90.33
  ["Alec Pierce","WR","IND"], // 87 · avg 90.67
  ["Blake Corum","RB","LAR"], // 88 · avg 91.00
  ["Sam LaPorta","TE","DET"], // 89 · avg 79.33 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 90 · avg 92.33
  ["Brock Purdy","QB","SF"], // 91 · avg 93.33
  ["Bo Nix","QB","DEN"], // 92 · avg 96.00
  ["Stefon Diggs","WR","WAS"], // 93 · avg 97.33
  ["MarShawn Lloyd","RB","GB"], // 94 · avg 97.67
  ["Jordan Mason","RB","MIN"], // 95 · avg 98.67
  ["Jaxson Dart","QB","NYG"], // 96 · avg 99.00
  ["RJ Harvey","RB","DEN"], // 97 · avg 99.33
  ["Jayden Reed","WR","GB"], // 98 · avg 100.00
  ["George Kittle","TE","SF"], // 99 · avg 89.33 · adj +12
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 101.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 101 · avg 102.33
  ["Mike Washington Jr.","RB","LV"], // 102 · avg 140.33 · adj -38
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 130.67 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 104 · avg 90.67 · adj +12
  ["Travis Kelce","TE","KC"], // 105 · avg 102.67
  ["Jared Goff","QB","DET"], // 106 · avg 103.67
  ["Kenny Gainwell","RB","TB"], // 107 · avg 103.67
  ["Jordan Addison","WR","MIN"], // 108 · avg 104.00
  ["Matthew Stafford","QB","LAR"], // 109 · avg 105.33
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 106.00
  ["Wan'Dale Robinson","WR","TEN"], // 111 · avg 107.67
  ["Josh Downs","WR","IND"], // 112 · avg 97.67 · adj +12
  ["Kyler Murray","QB","MIN"], // 113 · avg 111.00
  ["Rachaad White","RB","WAS"], // 114 · avg 112.67
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["De'Zhaun Stribling","WR","SF"], // 116 · avg 116.33
  ["KC Concepcion Jr.","WR","CLE"], // 117 · avg 116.33
  ["Makai Lemon","WR","PHI"], // 118 · avg 116.33
  ["Jordan Love","QB","GB"], // 119 · avg 117.67
  ["Isaiah Likely","TE","NYG"], // 120 · avg 118.33
  ["Jakobi Meyers","WR","JAC"], // 121 · avg 118.67
  ["Baker Mayfield","QB","TB"], // 122 · avg 120.33
  ["Aaron Jones Sr.","RB","MIN"], // 123 · avg 120.67
  ["Matthew Golden","WR","GB"], // 124 · avg 122.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 123.33
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.67
  ["Xavier Worthy","WR","KC"], // 127 · avg 127.00
  ["Tyler Shough","QB","NO"], // 128 · avg 128.00
  ["Juwan Johnson","TE","NO"], // 129 · avg 128.67
  ["Mark Andrews","TE","BAL"], // 130 · avg 129.00
  ["Jake Ferguson","TE","DAL"], // 131 · avg 129.67
  ["Woody Marks","RB","HOU"], // 132 · avg 130.00
  ["Jalen Coker","WR","CAR"], // 133 · avg 130.67
  ["Malik Willis","QB","MIA"], // 134 · avg 131.67
  ["Braelon Allen","RB","NYJ"], // 135 · avg 161.33 · adj -28
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 135.33
  ["Jalen McMillan","WR","TB"], // 138 · avg 163.33 · adj -28
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 138.33
  ["Deebo Samuel Sr.","WR","SF"], // 140 · avg 139.00
  ["Jonah Coleman","RB","DEN"], // 141 · avg 139.00
  ["Sam Darnold","QB","SEA"], // 142 · avg 139.00
  ["Tyjae Spears","RB","TEN"], // 143 · avg 139.00
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.33
  ["Daniel Jones","QB","IND"], // 145 · avg 143.33
  ["Keaton Mitchell","RB","LAC"], // 146 · avg 143.67
  ["Josh Jacobs","RB","GB"], // 147 · avg 144.00
  ["Tank Bigsby","RB","PHI"], // 148 · avg 146.67
  ["Denzel Boston","WR","CLE"], // 149 · avg 148.67
  ["Tre Tucker","WR","LV"], // 150 · avg 149.00
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.00
  ["Dylan Sampson","RB","CLE"], // 152 · avg 150.00
  ["Hunter Henry","TE","NE"], // 153 · avg 150.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 154.67
  ["Cam Ward","QB","TEN"], // 155 · avg 156.33
  ["Dalton Schultz","TE","HOU"], // 156 · avg 157.33
  ["Kayshon Boutte","WR","HOU"], // 157 · avg 157.67
  ["Brian Robinson Jr.","RB","ATL"], // 158 · avg 158.00
  ["Adonai Mitchell","WR","NYJ"], // 159 · avg 159.33
  ["Emmett Johnson","RB","KC"], // 160 · avg 161.00
  ["Dontayvion Wicks","WR","PHI"], // 161 · avg 166.67
  ["Bryce Young","QB","CAR"], // 162 · avg 168.33
  ["Jalen Nailor","WR","LV"], // 163 · avg 169.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 164 · avg 170.33
  ["Terrance Ferguson","TE","LAR"], // 165 · avg 173.33
  ["Ray Davis","RB","BUF"], // 166 · avg 173.67
  ["Tre' Harris","WR","LAC"], // 167 · avg 173.67
  ["Jauan Jennings","WR","MIN"], // 168 · avg 174.00
  ["Jerry Jeudy","WR","CLE"], // 169 · avg 174.00
  ["Keenan Allen","WR","IND"], // 170 · avg 179.00
  ["Ryan Flournoy","WR","DAL"], // 171 · avg 179.00
  ["AJ Barner","TE","SEA"], // 172 · avg 181.33
  ["T.J. Hockenson","TE","MIN"], // 173 · avg 181.33
  ["Brandon Aubrey","K","DAL"], // 174 · avg 183.67
  ["Pat Bryant","WR","DEN"], // 175 · avg 184.33
  ["Omar Cooper Jr.","WR","NYJ"], // 176 · avg 185.33
  ["Malik Washington","WR","MIA"], // 177 · avg 188.00
  ["Zach Charbonnet","RB","SEA"], // 178 · avg 155.00 · adj +35
  ["Ja'Kobi Lane","WR","BAL"], // 179 · avg 190.00
  ["Jacoby Brissett","QB","BAL"], // 180 · avg 190.00
  ["Ka'imi Fairbairn","K","HOU"], // 181 · avg 190.00
  ["Cameron Dicker","K","LAC"], // 182 · avg 191.33
  ["Kaelon Black","RB","SF"], // 183 · avg 192.33
  ["Kimani Vidal","RB","LAC"], // 184 · avg 194.67
  ["Calvin Ridley","WR","TEN"], // 185 · avg 196.67
  ["Cam Little","K","JAC"], // 186 · avg 197.67
  ["Aaron Rodgers","QB","PIT"], // 187 · avg 198.67
  ["Kenyon Sadiq","TE","NYJ"], // 188 · avg 198.67
  ["Malik Davis","RB","DAL"], // 189 · avg 200.00
  ["Sean Tucker","RB","TB"], // 190 · avg 201.67
  ["Jason Myers","K","SEA"], // 191 · avg 202.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 161.33 · adj +45
  ["Chris Bell","WR","MIA"], // 193 · avg 206.67
  ["Eddy Pineiro","K","SF"], // 194 · avg 208.33
  ["Nicholas Singleton","RB","TEN"], // 195 · avg 209.00
  ["Jaylin Noel","WR","HOU"], // 196 · avg 210.00
  ["Pat Freiermuth","TE","PIT"], // 197 · avg 211.00
  ["Rashod Bateman","WR","BAL"], // 198 · avg 212.67
  ["Travis Hunter","WR","JAC"], // 199 · avg 212.67
  ["Oronde Gadsden II","TE","LAC"], // 200 · avg 215.00
  ["Malachi Fields","WR","NYG"], // 201 · avg 215.67
  ["Gunnar Helm","TE","TEN"], // 202 · avg 216.00
  ["Tyler Loop","K","BAL"], // 203 · avg 217.00
  ["Kaytron Allen","RB","MIA"], // 204 · avg 217.33
  ["Jake Bates","K","DET"], // 205 · avg 218.33
  ["Geno Smith","QB","NYJ"], // 206 · avg 218.67
  ["Najee Harris","RB","FA"], // 207 · avg 220.33
  ["Kendre Miller","RB","FA"], // 208 · avg 271.00 · adj -50
  ["Isaac TeSlaa","WR","DET"], // 209 · avg 223.00
  ["Justice Hill","RB","BAL"], // 210 · avg 223.00
  ["Cade Otton","TE","TB"], // 211 · avg 225.33
  ["Cooper Kupp","WR","SEA"], // 212 · avg 225.33
  ["George Holani","RB","SEA"], // 213 · avg 226.67
  ["Darnell Mooney","WR","NYG"], // 214 · avg 227.33
  ["Zachariah Branch","WR","ATL"], // 215 · avg 228.00
  ["Evan McPherson","K","CIN"], // 216 · avg 229.33
  ["Isiah Pacheco","RB","DET"], // 217 · avg 229.67
  ["James Conner","RB","ARI"], // 218 · avg 245.67 · adj -16
  ["Cairo Santos","K","CHI"], // 219 · avg 230.00
  ["Chase McLaughlin","K","TB"], // 220 · avg 230.67
  ["Jaylen Wright","RB","MIA"], // 221 · avg 231.00
  ["Greg Dulcich","TE","MIA"], // 222 · avg 231.67
  ["Caleb Douglas","WR","MIA"], // 223 · avg 232.33
  ["Devaughn Vele","WR","NO"], // 224 · avg 233.33
  ["Harrison Mevis","K","FA"], // 225 · avg 235.67
  ["Kaleb Johnson","RB","GB"], // 226 · avg 236.00
  ["Germie Bernard","WR","PIT"], // 227 · avg 239.00
  ["Isaiah Davis","RB","NYJ"], // 228 · avg 268.67 · adj -28
  ["Andy Borregales","K","NE"], // 229 · avg 241.67
  ["Samaje Perine","RB","CIN"], // 230 · avg 242.00
  ["Ted Hurst III","WR","TB"], // 231 · avg 246.33
  ["Emanuel Wilson","RB","SEA"], // 232 · avg 246.67
  ["Evan Engram","TE","DEN"], // 233 · avg 247.67
  ["Jordyn Tyson","WR","NO"], // 234 · avg 149.00 · adj +100
  ["Troy Franklin","WR","DEN"], // 235 · avg 249.00
  ["Chris Brooks","RB","GB"], // 236 · avg 249.67
  ["Fernando Mendoza","QB","LV"], // 237 · avg 250.33
  ["Harrison Butker","K","KC"], // 238 · avg 250.67
  ["Chris Boswell","K","PIT"], // 239 · avg 254.33
  ["Demond Claiborne","RB","MIN"], // 240 · avg 254.67
  ["David Njoku","TE","LAC"], // 241 · avg 255.33
  ["Ollie Gordon II","RB","MIA"], // 242 · avg 258.00
  ["Jack Bech","WR","LV"], // 243 · avg 261.00
  ["Tyquan Thornton","WR","KC"], // 244 · avg 263.00
  ["Colby Parkinson","TE","LAR"], // 245 · avg 264.00
  ["Seth McGowan","RB","IND"], // 246 · avg 264.00
  ["Will Reichard","K","MIN"], // 247 · avg 264.00
  ["Keon Coleman","WR","BUF"], // 248 · avg 252.67 · adj +12
  ["Cyrus Allen","WR","KC"], // 249 · avg 264.67
  ["Jordan James","RB","SF"], // 250 · avg 265.33
  ["Ty Johnson","RB","BUF"], // 251 · avg 266.33
  ["Devin Neal","RB","WAS"], // 252 · avg 317.00 · adj -50
  ["Wil Lutz","K","DEN"], // 253 · avg 268.00
  ["Tank Dell","WR","HOU"], // 254 · avg 269.00
  ["Tua Tagovailoa","QB","ATL"], // 255 · avg 270.00
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 271.67
  ["Elic Ayomanor","WR","TEN"], // 257 · avg 272.00
  ["Tory Horton","WR","SEA"], // 258 · avg 272.33
  ["Xavier Legette","WR","CAR"], // 259 · avg 273.33
  ["Chimere Dike","WR","TEN"], // 260 · avg 275.67
  ["Kirk Cousins","QB","LV"], // 261 · avg 275.67
  ["Mason Taylor","TE","NYJ"], // 262 · avg 278.33
  ["Marvin Mims Jr.","WR","DEN"], // 263 · avg 280.00
  ["Deshaun Watson","QB","CLE"], // 264 · avg 280.33
  ["Kyle Williams","WR","NE"], // 265 · avg 282.33
  ["Brashard Smith","RB","KC"], // 266 · avg 283.33
  ["Michael Penix Jr.","QB","ATL"], // 267 · avg 272.00 · adj +12
  ["Elijah Sarratt","WR","BAL"], // 268 · avg 286.00
  ["Shedeur Sanders","QB","CLE"], // 269 · avg 286.33
  ["DJ Giddens","RB","IND"], // 270 · avg 286.67
  ["Theo Johnson","TE","NYG"], // 271 · avg 288.00
  ["Devin Singletary","RB","NYG"], // 272 · avg 290.00
  ["Andrei Iosivas","WR","CIN"], // 273 · avg 292.67
  ["Adam Randall","RB","BAL"], // 274 · avg 294.00
  ["Hollywood Brown","WR","PHI"], // 275 · avg 294.33
  ["Darius Slayton","WR","FA"], // 276 · avg 296.00
  ["Christian Kirk","WR","SF"], // 277 · avg 296.33
  ["Emari Demercado","RB","HOU"], // 278 · avg 297.33
  ["Mike Gesicki","TE","CIN"], // 279 · avg 298.00
  ["Eli Stowers","TE","PHI"], // 280 · avg 298.33
  ["Skyler Bell","WR","BUF"], // 281 · avg 299.33
  ["DeMario Douglas","WR","NE"], // 282 · avg 300.33
  ["Mack Hollins","WR","NE"], // 283 · avg 300.33
  ["Darren Waller","TE","CAR"], // 284 · avg 303.00
  ["Michael Mayer","TE","LV"], // 285 · avg 304.33
  ["Isaiah Bond","WR","CLE"], // 286 · avg 306.33
  ["Tahj Brooks","RB","CIN"], // 287 · avg 306.67
  ["Jaydon Blue","RB","PHI"], // 288 · avg 307.67
  ["Charlie Kolar","TE","LAC"], // 289 · avg 309.33
  ["Jahan Dotson","WR","ATL"], // 290 · avg 309.33
  ["Trevor Etienne","RB","CAR"], // 291 · avg 311.33
  ["Will Shipley","RB","PHI"], // 292 · avg 312.33
  ["Audric Estime","RB","NO"], // 293 · avg 312.67
  ["Tez Johnson","WR","TB"], // 294 · avg 341.67 · adj -28
  ["Jake Tonges","TE","SF"], // 295 · avg 314.67
  ["Jacob Saylors","RB","DET"], // 296 · avg 315.67
  ["Darnell Washington","TE","PIT"], // 297 · avg 317.33
  ["Isaac Guerendo","RB","SF"], // 298 · avg 318.33
  ["Jaleel McLaughlin","RB","CLE"], // 299 · avg 318.33
  ["Elijah Arroyo","TE","SEA"], // 300 · avg 322.33
  ["Xavier Hutchinson","WR","HOU"], // 301 · avg 323.00
  ["Kareem Hunt","RB","FA"], // 302 · avg 324.00
  ["Bryce Lance","WR","NO"], // 303 · avg 326.33
  ["Jalen Tolbert","WR","MIA"], // 304 · avg 327.00
  ["Jarquez Hunter","RB","NO"], // 305 · avg 327.67
  ["Oscar Delp","TE","NO"], // 306 · avg 327.67
  ["Jake Elliott","K","PHI"], // 307 · avg 328.67
  ["Kendrick Bourne","WR","ARI"], // 308 · avg 332.33
  ["Carson Beck","QB","ARI"], // 309 · avg 334.00
  ["Jerome Ford","RB","ARI"], // 310 · avg 335.00
  ["Cole Kmet","TE","CHI"], // 311 · avg 335.67
  ["Brandon Aiyuk","WR","SF"], // 312 · avg 336.00
  ["Dawson Knox","TE","BUF"], // 313 · avg 336.33
  ["Joshua Palmer","WR","BUF"], // 314 · avg 337.67
  ["Charlie Smyth","K","NO"], // 315 · avg 339.67
  ["Eli Raridon","TE","NE"], // 316 · avg 339.67
  ["Erick All Jr.","TE","CIN"], // 317 · avg 340.00
  ["Tyreek Hill","WR","FA"], // 318 · avg 340.00
  ["Roschon Johnson","RB","CHI"], // 319 · avg 340.33
  ["Olamide Zaccheaus","WR","ATL"], // 320 · avg 342.00
  ["Bam Knight","RB","ARI"], // 321 · avg 344.67
  ["Malik Benson","WR","LV"], // 322 · avg 346.33
  ["Tyler Higbee","TE","LAR"], // 323 · avg 346.67
  ["Brenen Thompson","WR","LAC"], // 324 · avg 347.67
  ["Zavion Thomas","WR","CHI"], // 325 · avg 348.33
  ["Tyler Bass","K","BUF"], // 326 · avg 349.67
  ["Treylon Burks","WR","WAS"], // 327 · avg 350.33
  ["Trey Smack","K","GB"], // 328 · avg 353.33
  ["Noah Gray","TE","KC"], // 329 · avg 354.33
  ["Roman Wilson","WR","PIT"], // 330 · avg 354.33
  ["KaVontae Turpin","WR","DAL"], // 331 · avg 357.00
  ["Luke McCaffrey","WR","WAS"], // 332 · avg 358.67
  ["Mac Jones","QB","SF"], // 333 · avg 359.33
  ["Kalif Raymond","WR","CHI"], // 334 · avg 359.67
  ["Jalen Royals","WR","KC"], // 335 · avg 361.00
  ["J.J. McCarthy","QB","NYG"], // 336 · avg 362.33
  ["Sione Vaki","RB","DET"], // 337 · avg 363.33
  ["Max Klare","TE","LAR"], // 338 · avg 366.00
  ["Odell Beckham Jr.","WR","MIN"], // 339 · avg 366.00
  ["Eli Heidenreich","RB","PIT"], // 340 · avg 366.33
  ["Raheim Sanders","RB","CLE"], // 341 · avg 366.33
  ["Konata Mumpfield","WR","LAR"], // 342 · avg 367.00
  ["Ja'Tavion Sanders","TE","CAR"], // 343 · avg 368.00
  ["Cedric Tillman","WR","NO"], // 344 · avg 369.00
  ["Justin Fields","QB","KC"], // 345 · avg 371.00
  ["Rasheen Ali","RB","BAL"], // 346 · avg 371.67
  ["Jordan Whittington","WR","LAR"], // 347 · avg 401.33 · adj -28
  ["Kevin Coleman Jr.","WR","MIA"], // 348 · avg 375.67
  ["Joe Mixon","RB","FA"], // 349 · avg 376.00
  ["Noah Fant","TE","NO"], // 350 · avg 376.67
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
