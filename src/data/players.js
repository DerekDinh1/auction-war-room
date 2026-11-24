import { norm } from "../lib/names.js";
import { TEAMS, TEAM_BYES } from "../lib/league.js";

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-11-24T01:29:32.696Z · 350 players · ordered by adjusted consensus rank
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
  ["A.J. Brown","WR","NE"], // 10 · avg 11.33
  ["Ja'Marr Chase","WR","CIN"], // 11 · avg 2.00 · adj +12
  ["Drake London","WR","ATL"], // 12 · avg 14.33
  ["Nico Collins","WR","HOU"], // 13 · avg 14.33
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Saquon Barkley","RB","PHI"], // 16 · avg 16.00
  ["De'Von Achane","RB","MIA"], // 17 · avg 19.00
  ["Trey McBride","TE","ARI"], // 18 · avg 19.33
  ["Davante Adams","WR","LAR"], // 19 · avg 47.33 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Chris Olave","WR","NO"], // 21 · avg 20.00
  ["Kenneth Walker III","RB","KC"], // 22 · avg 20.00
  ["Derrick Henry","RB","BAL"], // 23 · avg 22.00
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.00
  ["Josh Allen","QB","BUF"], // 25 · avg 24.33
  ["DeVonta Smith","WR","PHI"], // 26 · avg 24.67
  ["Malik Nabers","WR","NYG"], // 27 · avg 24.67
  ["Rashee Rice","WR","KC"], // 28 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 29 · avg 30.67
  ["Colston Loveland","TE","CHI"], // 30 · avg 31.00
  ["Javonte Williams","RB","DAL"], // 31 · avg 34.33
  ["Brock Bowers","TE","LV"], // 32 · avg 34.67
  ["Tee Higgins","WR","CIN"], // 33 · avg 34.67
  ["Kyren Williams","RB","LAR"], // 34 · avg 35.00
  ["Jaylen Waddle","WR","DEN"], // 35 · avg 36.67
  ["Drake Maye","QB","NE"], // 36 · avg 37.67
  ["Ladd McConkey","WR","LAC"], // 37 · avg 38.00
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.33
  ["Tetairoa McMillan","WR","CAR"], // 39 · avg 39.33
  ["Zay Flowers","WR","BAL"], // 40 · avg 28.00 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.67
  ["Joe Burrow","QB","CIN"], // 42 · avg 44.67
  ["D'Andre Swift","RB","CHI"], // 43 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 44 · avg 26.00 · adj +22
  ["Breece Hall","RB","NYJ"], // 45 · avg 37.33 · adj +12
  ["Luther Burden III","WR","CHI"], // 46 · avg 49.33
  ["Terry McLaurin","WR","WAS"], // 47 · avg 49.33
  ["Jameson Williams","WR","DET"], // 48 · avg 49.67
  ["Bucky Irving","RB","TB"], // 49 · avg 52.00
  ["DJ Moore","WR","BUF"], // 50 · avg 52.67
  ["Emeka Egbuka","WR","TB"], // 51 · avg 41.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 41.33 · adj +12
  ["Christian Watson","WR","GB"], // 53 · avg 54.33
  ["Jalen Hurts","QB","PHI"], // 54 · avg 54.33
  ["Cam Skattebo","RB","NYG"], // 55 · avg 55.33
  ["David Montgomery","RB","HOU"], // 56 · avg 55.33
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.67
  ["Rome Odunze","WR","CHI"], // 58 · avg 60.33
  ["Jayden Daniels","QB","WAS"], // 59 · avg 60.67
  ["Parker Washington","WR","JAC"], // 60 · avg 60.67
  ["Jadarian Price","RB","SEA"], // 61 · avg 61.33
  ["Mike Evans","WR","SF"], // 62 · avg 63.00
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.33
  ["Tyler Warren","TE","IND"], // 64 · avg 52.33 · adj +12
  ["Caleb Williams","QB","CHI"], // 65 · avg 64.67
  ["Rhamondre Stevenson","RB","NE"], // 66 · avg 66.67
  ["Justin Herbert","QB","LAC"], // 67 · avg 68.67
  ["Marvin Harrison Jr.","WR","HOU"], // 68 · avg 68.67
  ["Jaylen Warren","RB","PIT"], // 69 · avg 70.00
  ["Trevor Lawrence","QB","JAC"], // 70 · avg 70.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 73.00
  ["TreVeyon Henderson","RB","NE"], // 72 · avg 73.33
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.33
  ["DK Metcalf","WR","PIT"], // 74 · avg 74.67
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 77.67
  ["Rico Dowdle","RB","PIT"], // 76 · avg 78.00
  ["Tony Pollard","RB","TEN"], // 77 · avg 78.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 80.00
  ["Kyle Pitts Sr.","TE","ATL"], // 79 · avg 81.00
  ["Harold Fannin Jr.","TE","CLE"], // 80 · avg 81.33
  ["Tucker Kraft","TE","GB"], // 81 · avg 69.67 · adj +12
  ["Courtland Sutton","WR","DEN"], // 82 · avg 84.67
  ["Quentin Johnston","WR","LAC"], // 83 · avg 85.33
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.67
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.33
  ["Michael Wilson","WR","ARI"], // 86 · avg 90.00
  ["Alec Pierce","WR","IND"], // 87 · avg 90.67
  ["Blake Corum","RB","LAR"], // 88 · avg 91.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 80.00 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 90 · avg 92.00
  ["Brock Purdy","QB","SF"], // 91 · avg 93.33
  ["Bo Nix","QB","DEN"], // 92 · avg 95.67
  ["Stefon Diggs","WR","WAS"], // 93 · avg 97.33
  ["MarShawn Lloyd","RB","GB"], // 94 · avg 98.00
  ["Jaxson Dart","QB","NYG"], // 95 · avg 98.67
  ["RJ Harvey","RB","DEN"], // 96 · avg 99.33
  ["Jordan Mason","RB","MIN"], // 97 · avg 99.67
  ["Jayden Reed","WR","GB"], // 98 · avg 100.33
  ["George Kittle","TE","SF"], // 99 · avg 89.67 · adj +12
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 101.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 101 · avg 102.33
  ["Tyler Allgeier","RB","ARI"], // 102 · avg 130.33 · adj -28
  ["Mike Washington Jr.","RB","LV"], // 103 · avg 140.67 · adj -38
  ["Travis Kelce","TE","KC"], // 104 · avg 102.67
  ["Michael Pittman Jr.","WR","PIT"], // 105 · avg 91.00 · adj +12
  ["Jared Goff","QB","DET"], // 106 · avg 103.33
  ["Jordan Addison","WR","MIN"], // 107 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 108 · avg 104.67
  ["Matthew Stafford","QB","LAR"], // 109 · avg 105.33
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 106.67
  ["Wan'Dale Robinson","WR","TEN"], // 111 · avg 106.67
  ["Josh Downs","WR","KC"], // 112 · avg 98.00 · adj +12
  ["Kyler Murray","QB","MIN"], // 113 · avg 110.67
  ["Rachaad White","RB","WAS"], // 114 · avg 111.00
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["Makai Lemon","WR","PHI"], // 116 · avg 116.00
  ["KC Concepcion Jr.","WR","CLE"], // 117 · avg 116.33
  ["De'Zhaun Stribling","WR","SF"], // 118 · avg 117.00
  ["Jordan Love","QB","GB"], // 119 · avg 118.00
  ["Isaiah Likely","TE","NYG"], // 120 · avg 118.33
  ["Jakobi Meyers","WR","JAC"], // 121 · avg 118.33
  ["Aaron Jones Sr.","RB","MIN"], // 122 · avg 120.33
  ["Baker Mayfield","QB","TB"], // 123 · avg 120.33
  ["Matthew Golden","WR","GB"], // 124 · avg 122.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 124.00
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.67
  ["Xavier Worthy","WR","KC"], // 127 · avg 127.00
  ["Tyler Shough","QB","NO"], // 128 · avg 128.00
  ["Juwan Johnson","TE","NO"], // 129 · avg 128.67
  ["Mark Andrews","TE","BAL"], // 130 · avg 128.67
  ["Jake Ferguson","TE","DAL"], // 131 · avg 130.00
  ["Woody Marks","RB","HOU"], // 132 · avg 130.00
  ["Jalen Coker","WR","CAR"], // 133 · avg 130.67
  ["Malik Willis","QB","MIA"], // 134 · avg 131.67
  ["Braelon Allen","RB","NYJ"], // 135 · avg 161.00 · adj -28
  ["Kyle Monangai","RB","CHI"], // 136 · avg 111.67 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 135.33
  ["Jalen McMillan","WR","TB"], // 138 · avg 163.33 · adj -28
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 138.33
  ["Tyjae Spears","RB","TEN"], // 140 · avg 138.67
  ["Deebo Samuel Sr.","WR","SF"], // 141 · avg 139.00
  ["Jonah Coleman","RB","DEN"], // 142 · avg 139.00
  ["Sam Darnold","QB","SEA"], // 143 · avg 139.00
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.00
  ["Daniel Jones","QB","FA"], // 145 · avg 143.00
  ["Josh Jacobs","RB","GB"], // 146 · avg 144.33
  ["Keaton Mitchell","RB","LAC"], // 147 · avg 144.33
  ["Tank Bigsby","RB","PHI"], // 148 · avg 147.00
  ["Denzel Boston","WR","CLE"], // 149 · avg 148.00
  ["Tre Tucker","WR","LV"], // 150 · avg 149.00
  ["Brenton Strange","TE","JAC"], // 151 · avg 149.67
  ["Dylan Sampson","RB","CLE"], // 152 · avg 150.00
  ["Hunter Henry","TE","NE"], // 153 · avg 150.00
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 154.67
  ["Cam Ward","QB","TEN"], // 155 · avg 156.33
  ["Brian Robinson Jr.","RB","ATL"], // 156 · avg 157.67
  ["Dalton Schultz","TE","HOU"], // 157 · avg 157.67
  ["Kayshon Boutte","WR","HOU"], // 158 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 159 · avg 159.00
  ["Emmett Johnson","RB","KC"], // 160 · avg 161.00
  ["Dontayvion Wicks","WR","PHI"], // 161 · avg 167.00
  ["Bryce Young","QB","CAR"], // 162 · avg 167.67
  ["Jalen Nailor","WR","LV"], // 163 · avg 169.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 164 · avg 170.00
  ["Jerry Jeudy","WR","CLE"], // 165 · avg 173.67
  ["Ray Davis","RB","BUF"], // 166 · avg 174.00
  ["Terrance Ferguson","TE","LAR"], // 167 · avg 174.33
  ["Jauan Jennings","WR","MIN"], // 168 · avg 174.67
  ["Tre' Harris","WR","LAC"], // 169 · avg 174.67
  ["Ryan Flournoy","WR","DAL"], // 170 · avg 179.00
  ["Keenan Allen","WR","SF"], // 171 · avg 179.33
  ["T.J. Hockenson","TE","MIN"], // 172 · avg 180.33
  ["AJ Barner","TE","SEA"], // 173 · avg 181.33
  ["Omar Cooper Jr.","WR","NYJ"], // 174 · avg 183.33
  ["Brandon Aubrey","K","DAL"], // 175 · avg 184.00
  ["Pat Bryant","WR","DEN"], // 176 · avg 184.67
  ["Malik Washington","WR","MIA"], // 177 · avg 187.33
  ["Zach Charbonnet","RB","SEA"], // 178 · avg 154.67 · adj +35
  ["Jacoby Brissett","QB","BAL"], // 179 · avg 190.00
  ["Ka'imi Fairbairn","K","HOU"], // 180 · avg 190.00
  ["Ja'Kobi Lane","WR","BAL"], // 181 · avg 191.00
  ["Cameron Dicker","K","LAC"], // 182 · avg 191.67
  ["Kimani Vidal","RB","LAC"], // 183 · avg 193.00
  ["Kaelon Black","RB","SF"], // 184 · avg 196.00
  ["Calvin Ridley","WR","TEN"], // 185 · avg 196.33
  ["Aaron Rodgers","QB","PIT"], // 186 · avg 197.00
  ["Kenyon Sadiq","TE","NYJ"], // 187 · avg 197.00
  ["Malik Davis","RB","DAL"], // 188 · avg 199.33
  ["Cam Little","K","JAC"], // 189 · avg 199.67
  ["Sean Tucker","RB","TB"], // 190 · avg 200.67
  ["Jason Myers","K","SEA"], // 191 · avg 203.00
  ["Chris Bell","WR","MIA"], // 192 · avg 206.33
  ["Alvin Kamara","RB","NO"], // 193 · avg 161.67 · adj +45
  ["Jaylin Noel","WR","HOU"], // 194 · avg 207.00
  ["Eddy Pineiro","K","SF"], // 195 · avg 208.33
  ["Nicholas Singleton","RB","TEN"], // 196 · avg 209.33
  ["Pat Freiermuth","TE","PIT"], // 197 · avg 210.00
  ["Rashod Bateman","WR","BAL"], // 198 · avg 212.00
  ["Oronde Gadsden II","TE","LAC"], // 199 · avg 213.67
  ["Gunnar Helm","TE","TEN"], // 200 · avg 214.67
  ["Kaytron Allen","RB","MIA"], // 201 · avg 214.67
  ["Malachi Fields","WR","NYG"], // 202 · avg 214.67
  ["Travis Hunter","WR","JAC"], // 203 · avg 214.67
  ["Geno Smith","QB","NYJ"], // 204 · avg 217.33
  ["Tyler Loop","K","BAL"], // 205 · avg 217.67
  ["Jake Bates","K","DET"], // 206 · avg 219.00
  ["Najee Harris","RB","FA"], // 207 · avg 220.00
  ["Kendre Miller","RB","DAL"], // 208 · avg 270.67 · adj -50
  ["Isaac TeSlaa","WR","DET"], // 209 · avg 221.67
  ["Cade Otton","TE","TB"], // 210 · avg 223.67
  ["Justice Hill","RB","BAL"], // 211 · avg 223.67
  ["Cooper Kupp","WR","SEA"], // 212 · avg 224.33
  ["George Holani","RB","SEA"], // 213 · avg 226.67
  ["Isiah Pacheco","RB","DET"], // 214 · avg 227.00
  ["Darnell Mooney","WR","NYG"], // 215 · avg 227.67
  ["Evan McPherson","K","CIN"], // 216 · avg 229.33
  ["James Conner","RB","ARI"], // 217 · avg 245.67 · adj -16
  ["Cairo Santos","K","CHI"], // 218 · avg 230.00
  ["Zachariah Branch","WR","ATL"], // 219 · avg 230.00
  ["Jaylen Wright","RB","MIA"], // 220 · avg 230.33
  ["Chase McLaughlin","K","TB"], // 221 · avg 232.00
  ["Kaleb Johnson","RB","GB"], // 222 · avg 233.33
  ["Devaughn Vele","WR","NO"], // 223 · avg 234.00
  ["Greg Dulcich","TE","MIA"], // 224 · avg 234.33
  ["Caleb Douglas","WR","MIA"], // 225 · avg 234.67
  ["Harrison Mevis","K","FA"], // 226 · avg 236.00
  ["Isaiah Davis","RB","NYJ"], // 227 · avg 267.00 · adj -28
  ["Germie Bernard","WR","PIT"], // 228 · avg 239.67
  ["Andy Borregales","K","NE"], // 229 · avg 242.00
  ["Samaje Perine","RB","CIN"], // 230 · avg 242.00
  ["Ted Hurst III","WR","TB"], // 231 · avg 245.00
  ["Evan Engram","TE","DEN"], // 232 · avg 245.33
  ["Emanuel Wilson","RB","SEA"], // 233 · avg 246.00
  ["Chris Brooks","RB","GB"], // 234 · avg 248.00
  ["Troy Franklin","WR","DEN"], // 235 · avg 248.00
  ["Fernando Mendoza","QB","LV"], // 236 · avg 249.00
  ["Jordyn Tyson","WR","NO"], // 237 · avg 149.33 · adj +100
  ["Harrison Butker","K","KC"], // 238 · avg 252.00
  ["Demond Claiborne","RB","MIN"], // 239 · avg 253.67
  ["David Njoku","TE","LAC"], // 240 · avg 254.67
  ["Chris Boswell","K","PIT"], // 241 · avg 255.00
  ["Ollie Gordon II","RB","MIA"], // 242 · avg 256.67
  ["Jack Bech","WR","LV"], // 243 · avg 261.00
  ["Tyquan Thornton","WR","KC"], // 244 · avg 262.67
  ["Colby Parkinson","TE","LAR"], // 245 · avg 263.67
  ["Keon Coleman","WR","BUF"], // 246 · avg 252.33 · adj +12
  ["Will Reichard","K","MIN"], // 247 · avg 265.00
  ["Cyrus Allen","WR","KC"], // 248 · avg 265.33
  ["Seth McGowan","RB","IND"], // 249 · avg 266.00
  ["Ty Johnson","RB","BUF"], // 250 · avg 266.00
  ["Devin Neal","RB","WAS"], // 251 · avg 316.00 · adj -50
  ["Jordan James","RB","SF"], // 252 · avg 266.67
  ["Tank Dell","WR","HOU"], // 253 · avg 269.00
  ["Tua Tagovailoa","QB","ATL"], // 254 · avg 269.33
  ["Wil Lutz","K","DEN"], // 255 · avg 269.33
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 270.33
  ["Elic Ayomanor","WR","TEN"], // 257 · avg 271.67
  ["Tory Horton","WR","SEA"], // 258 · avg 272.00
  ["Xavier Legette","WR","CAR"], // 259 · avg 273.67
  ["Kirk Cousins","QB","MIN"], // 260 · avg 275.67
  ["Chimere Dike","WR","TEN"], // 261 · avg 276.00
  ["Mason Taylor","TE","NYJ"], // 262 · avg 278.00
  ["Deshaun Watson","QB","CLE"], // 263 · avg 280.33
  ["Marvin Mims Jr.","WR","DEN"], // 264 · avg 280.67
  ["Kyle Williams","WR","NE"], // 265 · avg 282.33
  ["Brashard Smith","RB","KC"], // 266 · avg 283.00
  ["Michael Penix Jr.","QB","ATL"], // 267 · avg 272.33 · adj +12
  ["Elijah Sarratt","WR","BAL"], // 268 · avg 285.33
  ["DJ Giddens","RB","IND"], // 269 · avg 285.67
  ["Shedeur Sanders","QB","CLE"], // 270 · avg 285.67
  ["Theo Johnson","TE","NYG"], // 271 · avg 286.33
  ["Devin Singletary","RB","NYG"], // 272 · avg 290.00
  ["Hollywood Brown","WR","FA"], // 273 · avg 293.67
  ["Adam Randall","RB","BAL"], // 274 · avg 294.00
  ["Andrei Iosivas","WR","CIN"], // 275 · avg 294.00
  ["Darius Slayton","WR","FA"], // 276 · avg 294.00
  ["Christian Kirk","WR","SF"], // 277 · avg 295.67
  ["Emari Demercado","RB","HOU"], // 278 · avg 296.33
  ["Mike Gesicki","TE","CIN"], // 279 · avg 297.33
  ["Eli Stowers","TE","PHI"], // 280 · avg 298.00
  ["Mack Hollins","WR","NE"], // 281 · avg 298.67
  ["Skyler Bell","WR","BUF"], // 282 · avg 299.67
  ["DeMario Douglas","WR","NE"], // 283 · avg 302.67
  ["Darren Waller","TE","CAR"], // 284 · avg 304.67
  ["Isaiah Bond","WR","CLE"], // 285 · avg 305.00
  ["Michael Mayer","TE","LV"], // 286 · avg 305.33
  ["Tahj Brooks","RB","CIN"], // 287 · avg 305.33
  ["Jaydon Blue","RB","PHI"], // 288 · avg 308.33
  ["Jahan Dotson","WR","ATL"], // 289 · avg 309.67
  ["Charlie Kolar","TE","LAC"], // 290 · avg 310.33
  ["Trevor Etienne","RB","CAR"], // 291 · avg 311.00
  ["Audric Estime","RB","NO"], // 292 · avg 311.67
  ["Will Shipley","RB","PHI"], // 293 · avg 312.00
  ["Tez Johnson","WR","TB"], // 294 · avg 341.00 · adj -28
  ["Jake Tonges","TE","SF"], // 295 · avg 315.00
  ["Darnell Washington","TE","PIT"], // 296 · avg 317.00
  ["Jaleel McLaughlin","RB","CLE"], // 297 · avg 317.33
  ["Isaac Guerendo","RB","SF"], // 298 · avg 318.00
  ["Jacob Saylors","RB","DET"], // 299 · avg 318.67
  ["Elijah Arroyo","TE","SEA"], // 300 · avg 321.67
  ["Kareem Hunt","RB","FA"], // 301 · avg 323.67
  ["Xavier Hutchinson","WR","HOU"], // 302 · avg 324.00
  ["Bryce Lance","WR","NO"], // 303 · avg 325.00
  ["Jarquez Hunter","RB","FA"], // 304 · avg 326.67
  ["Jalen Tolbert","WR","MIA"], // 305 · avg 327.33
  ["Oscar Delp","TE","NO"], // 306 · avg 327.33
  ["Jake Elliott","K","PHI"], // 307 · avg 331.33
  ["Carson Beck","QB","ARI"], // 308 · avg 333.00
  ["Kendrick Bourne","WR","ARI"], // 309 · avg 333.00
  ["Cole Kmet","TE","CHI"], // 310 · avg 333.67
  ["Dawson Knox","TE","BUF"], // 311 · avg 335.00
  ["Jerome Ford","RB","ARI"], // 312 · avg 335.00
  ["Charlie Smyth","K","NO"], // 313 · avg 336.33
  ["Brandon Aiyuk","WR","FA"], // 314 · avg 337.67
  ["Joshua Palmer","WR","BUF"], // 315 · avg 338.33
  ["Eli Raridon","TE","NE"], // 316 · avg 340.00
  ["Tyreek Hill","WR","FA"], // 317 · avg 340.00
  ["Erick All Jr.","TE","CIN"], // 318 · avg 341.67
  ["Roschon Johnson","RB","CHI"], // 319 · avg 341.67
  ["Olamide Zaccheaus","WR","ATL"], // 320 · avg 343.00
  ["Bam Knight","RB","ARI"], // 321 · avg 343.33
  ["Tyler Higbee","TE","LAR"], // 322 · avg 345.67
  ["Brenen Thompson","WR","LAC"], // 323 · avg 346.67
  ["Malik Benson","WR","LV"], // 324 · avg 347.33
  ["Treylon Burks","WR","WAS"], // 325 · avg 348.67
  ["Zavion Thomas","WR","CHI"], // 326 · avg 349.67
  ["Noah Gray","TE","KC"], // 327 · avg 352.67
  ["Roman Wilson","WR","PIT"], // 328 · avg 355.00
  ["Tyler Bass","K","BUF"], // 329 · avg 355.00
  ["Luke McCaffrey","WR","WAS"], // 330 · avg 355.33
  ["Trey Smack","K","GB"], // 331 · avg 356.00
  ["Jalen Royals","WR","KC"], // 332 · avg 357.33
  ["Mac Jones","QB","SF"], // 333 · avg 358.00
  ["J.J. McCarthy","QB","NYG"], // 334 · avg 358.67
  ["KaVontae Turpin","WR","DAL"], // 335 · avg 360.00
  ["Kalif Raymond","WR","CHI"], // 336 · avg 360.67
  ["Max Klare","TE","LAR"], // 337 · avg 362.00
  ["Konata Mumpfield","WR","LAR"], // 338 · avg 365.00
  ["Raheim Sanders","RB","CLE"], // 339 · avg 365.67
  ["Sione Vaki","RB","DET"], // 340 · avg 365.67
  ["Ja'Tavion Sanders","TE","CAR"], // 341 · avg 366.00
  ["Odell Beckham Jr.","WR","MIN"], // 342 · avg 366.33
  ["Eli Heidenreich","RB","PIT"], // 343 · avg 367.00
  ["Cedric Tillman","WR","NO"], // 344 · avg 369.00
  ["Justin Fields","QB","KC"], // 345 · avg 369.33
  ["Rasheen Ali","RB","BAL"], // 346 · avg 372.67
  ["Jordan Whittington","WR","LAR"], // 347 · avg 401.00 · adj -28
  ["Kevin Coleman Jr.","WR","MIA"], // 348 · avg 374.67
  ["Joe Mixon","RB","FA"], // 349 · avg 375.67
  ["Noah Fant","TE","NO"], // 350 · avg 376.00
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
