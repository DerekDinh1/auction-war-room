// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-30T17:56:52.168Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 5 · avg 8.00
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.67
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.00
  ["James Cook III","RB","BUF"], // 9 · avg 10.67
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Drake London","WR","ATL"], // 11 · avg 13.67
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 15.67
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.00
  ["Brock Bowers","TE","LV"], // 17 · avg 18.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["George Pickens","WR","DAL"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.33
  ["Omarion Hampton","RB","LAC"], // 22 · avg 21.33
  ["Chris Olave","WR","NO"], // 23 · avg 21.67
  ["Trey McBride","TE","ARI"], // 24 · avg 22.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.67
  ["Rashee Rice","WR","KC"], // 29 · avg 29.00
  ["Lamar Jackson","QB","BAL"], // 30 · avg 32.67
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.00
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Ladd McConkey","WR","LAC"], // 33 · avg 36.00
  ["Colston Loveland","TE","CHI"], // 34 · avg 36.67
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.67
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 36.67
  ["Tetairoa McMillan","WR","CAR"], // 37 · avg 36.67
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.00
  ["Drake Maye","QB","NE"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.67 · adj +12
  ["Josh Jacobs","RB","GB"], // 41 · avg 43.33
  ["Travis Etienne Jr.","RB","NO"], // 42 · avg 45.00
  ["Joe Burrow","QB","CIN"], // 43 · avg 45.67
  ["Ashton Jeanty","RB","LV"], // 44 · avg 25.67 · adj +22
  ["Terry McLaurin","WR","WAS"], // 45 · avg 48.00
  ["Luther Burden III","WR","CHI"], // 46 · avg 49.33
  ["D'Andre Swift","RB","CHI"], // 47 · avg 49.67
  ["Breece Hall","RB","NYJ"], // 48 · avg 38.00 · adj +12
  ["Jameson Williams","WR","DET"], // 49 · avg 50.33
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 42.00 · adj +12
  ["Jayden Daniels","QB","WAS"], // 52 · avg 54.33
  ["Christian Watson","WR","GB"], // 53 · avg 55.00
  ["DJ Moore","WR","BUF"], // 54 · avg 55.00
  ["Cam Skattebo","RB","NYG"], // 55 · avg 56.00
  ["Bucky Irving","RB","TB"], // 56 · avg 56.67
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.67
  ["Jalen Hurts","QB","PHI"], // 58 · avg 58.33
  ["Rome Odunze","WR","CHI"], // 59 · avg 58.33
  ["Mike Evans","WR","SF"], // 60 · avg 58.67
  ["David Montgomery","RB","HOU"], // 61 · avg 59.67
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 63.33
  ["Caleb Williams","QB","CHI"], // 63 · avg 65.67
  ["Parker Washington","WR","JAC"], // 64 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 65 · avg 66.33
  ["TreVeyon Henderson","RB","NE"], // 66 · avg 67.00
  ["Tyler Warren","TE","IND"], // 67 · avg 55.67 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Rhamondre Stevenson","RB","NE"], // 70 · avg 71.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 71.67
  ["Jaylen Warren","RB","PIT"], // 72 · avg 74.33
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.67
  ["Trevor Lawrence","QB","JAC"], // 74 · avg 75.00
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 76.00
  ["Tony Pollard","RB","TEN"], // 76 · avg 77.33
  ["DK Metcalf","WR","PIT"], // 77 · avg 78.00
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 79 · avg 81.00
  ["Rico Dowdle","RB","PIT"], // 80 · avg 82.33
  ["Tucker Kraft","TE","GB"], // 81 · avg 71.00 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 82 · avg 83.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.33
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 83.33
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.00
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 90.00
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.33
  ["Alec Pierce","WR","IND"], // 88 · avg 92.00
  ["Brock Purdy","QB","SF"], // 89 · avg 92.67
  ["Sam LaPorta","TE","DET"], // 90 · avg 82.00 · adj +12
  ["Blake Corum","RB","LAR"], // 91 · avg 94.33
  ["Jaxson Dart","QB","NYG"], // 92 · avg 94.33
  ["Bo Nix","QB","DEN"], // 93 · avg 95.33
  ["Chuba Hubbard","RB","CAR"], // 94 · avg 95.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.00
  ["Patrick Mahomes II","QB","KC"], // 96 · avg 101.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 97 · avg 101.33
  ["Travis Kelce","TE","KC"], // 98 · avg 102.00
  ["Wan'Dale Robinson","WR","TEN"], // 99 · avg 102.33
  ["Jordan Mason","RB","MIN"], // 100 · avg 102.67
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 91.00 · adj +12
  ["Jordan Addison","WR","MIN"], // 102 · avg 103.33
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.33 · adj -28
  ["George Kittle","TE","SF"], // 104 · avg 92.67 · adj +12
  ["Matthew Stafford","QB","LAR"], // 105 · avg 104.67
  ["Jayden Reed","WR","GB"], // 106 · avg 105.00
  ["Kenny Gainwell","RB","TB"], // 107 · avg 105.00
  ["Jared Goff","QB","DET"], // 108 · avg 106.67
  ["Dalton Kincaid","TE","BUF"], // 109 · avg 107.00
  ["Stefon Diggs","WR","WAS"], // 110 · avg 108.33
  ["Makai Lemon","WR","PHI"], // 111 · avg 108.67
  ["Josh Downs","WR","IND"], // 112 · avg 98.00 · adj +12
  ["Jakobi Meyers","WR","JAC"], // 113 · avg 110.33
  ["Rachaad White","RB","WAS"], // 114 · avg 112.00
  ["Kyler Murray","QB","MIN"], // 115 · avg 114.00
  ["Dallas Goedert","TE","PHI"], // 116 · avg 115.33
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.33
  ["Isaiah Likely","TE","NYG"], // 118 · avg 117.67
  ["Baker Mayfield","QB","TB"], // 119 · avg 118.00
  ["Jordan Love","QB","GB"], // 120 · avg 119.00
  ["Mike Washington Jr.","RB","LV"], // 121 · avg 158.67 · adj -38
  ["Jake Ferguson","TE","DAL"], // 122 · avg 122.67
  ["KC Concepcion","WR","CLE"], // 123 · avg 122.67
  ["Romeo Doubs","WR","NE"], // 124 · avg 124.33
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 126 · avg 125.33
  ["Mark Andrews","TE","BAL"], // 127 · avg 126.33
  ["Tyler Shough","QB","NO"], // 128 · avg 126.33
  ["Matthew Golden","WR","GB"], // 129 · avg 126.67
  ["Jalen Coker","WR","CAR"], // 130 · avg 128.33
  ["Braelon Allen","RB","NYJ"], // 131 · avg 156.33 · adj -28
  ["Woody Marks","RB","HOU"], // 132 · avg 130.33
  ["Khalil Shakir","WR","BUF"], // 133 · avg 131.67
  ["Kyle Monangai","RB","CHI"], // 134 · avg 109.67 · adj +22
  ["Malik Willis","QB","MIA"], // 135 · avg 132.67
  ["Juwan Johnson","TE","NO"], // 136 · avg 133.33
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.00 · adj -28
  ["De'Zhaun Stribling","WR","SF"], // 138 · avg 137.67
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 139.00
  ["Tyjae Spears","RB","TEN"], // 140 · avg 139.00
  ["Sam Darnold","QB","SEA"], // 141 · avg 139.67
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 140.67
  ["Deebo Samuel Sr.","WR","SF"], // 143 · avg 141.00
  ["Jonah Coleman","RB","DEN"], // 144 · avg 143.67
  ["C.J. Stroud","QB","HOU"], // 145 · avg 145.00
  ["Tank Bigsby","RB","PHI"], // 146 · avg 147.00
  ["Daniel Jones","QB","IND"], // 147 · avg 148.33
  ["Hunter Henry","TE","NE"], // 148 · avg 148.67
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.00
  ["Isiah Pacheco","RB","DET"], // 150 · avg 150.33
  ["Brenton Strange","TE","JAC"], // 151 · avg 152.00
  ["Cam Ward","QB","TEN"], // 152 · avg 152.00
  ["Denzel Boston","WR","CLE"], // 153 · avg 153.67
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 155.00
  ["MarShawn Lloyd","RB","GB"], // 155 · avg 155.33
  ["Tre Tucker","WR","LV"], // 156 · avg 155.67
  ["Brian Robinson Jr.","RB","ATL"], // 157 · avg 157.00
  ["Dalton Schultz","TE","HOU"], // 158 · avg 157.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 159 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 160 · avg 158.67
  ["Kayshon Boutte","WR","HOU"], // 161 · avg 165.00
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 165.33
  ["Bryce Young","QB","CAR"], // 163 · avg 168.00
  ["Jauan Jennings","WR","MIN"], // 164 · avg 168.67
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.67
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 172.67
  ["Zach Charbonnet","RB","SEA"], // 167 · avg 138.33 · adj +35
  ["Emmett Johnson","RB","KC"], // 168 · avg 177.33
  ["Ray Davis","RB","BUF"], // 169 · avg 177.33
  ["Ryan Flournoy","WR","DAL"], // 170 · avg 177.33
  ["Terrance Ferguson","TE","LAR"], // 171 · avg 177.67
  ["Omar Cooper Jr.","WR","NYJ"], // 172 · avg 179.67
  ["Kimani Vidal","RB","LAC"], // 173 · avg 182.33
  ["Pat Bryant","WR","DEN"], // 174 · avg 183.33
  ["Jalen Nailor","WR","LV"], // 175 · avg 183.67
  ["AJ Barner","TE","SEA"], // 176 · avg 184.33
  ["Calvin Ridley","WR","TEN"], // 177 · avg 185.67
  ["Brandon Aubrey","K","DAL"], // 178 · avg 186.33
  ["Oronde Gadsden II","TE","LAC"], // 179 · avg 187.33
  ["T.J. Hockenson","TE","MIN"], // 180 · avg 187.67
  ["Jacoby Brissett","QB","ARI"], // 181 · avg 189.67
  ["Travis Hunter","WR","JAC"], // 182 · avg 189.67
  ["Malik Washington","WR","MIA"], // 183 · avg 190.67
  ["Cameron Dicker","K","LAC"], // 184 · avg 196.00
  ["Nicholas Singleton","RB","TEN"], // 185 · avg 196.00
  ["Kenyon Sadiq","TE","NYJ"], // 186 · avg 196.67
  ["James Conner","RB","ARI"], // 187 · avg 213.00 · adj -16
  ["Keenan Allen","WR","IND"], // 188 · avg 197.33
  ["Sean Tucker","RB","TB"], // 189 · avg 197.67
  ["Ka'imi Fairbairn","K","HOU"], // 190 · avg 198.33
  ["Jaylin Noel","WR","HOU"], // 191 · avg 200.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 156.00 · adj +45
  ["Cam Little","K","JAC"], // 193 · avg 203.33
  ["Jason Myers","K","SEA"], // 194 · avg 206.33
  ["Jaydon Blue","RB","DAL"], // 195 · avg 208.00
  ["Rashod Bateman","WR","BAL"], // 196 · avg 210.00
  ["Gunnar Helm","TE","TEN"], // 197 · avg 210.33
  ["Tyler Loop","K","BAL"], // 198 · avg 212.67
  ["Kaytron Allen","RB","WAS"], // 199 · avg 213.00
  ["Eddy Pineiro","K","SF"], // 200 · avg 213.67
  ["Darnell Mooney","WR","NYG"], // 201 · avg 216.33
  ["Isaac TeSlaa","WR","DET"], // 202 · avg 216.67
  ["Cooper Kupp","WR","SEA"], // 203 · avg 217.00
  ["Pat Freiermuth","TE","PIT"], // 204 · avg 217.67
  ["Tank Dell","WR","HOU"], // 205 · avg 218.00
  ["Aaron Rodgers","QB","PIT"], // 206 · avg 218.67
  ["Jake Bates","K","DET"], // 207 · avg 218.67
  ["Emanuel Wilson","RB","SEA"], // 208 · avg 219.00
  ["Geno Smith","QB","NYJ"], // 209 · avg 219.67
  ["George Holani","RB","SEA"], // 210 · avg 221.33
  ["Jaylen Wright","RB","MIA"], // 211 · avg 226.00
  ["Cairo Santos","K","CHI"], // 212 · avg 226.33
  ["Troy Franklin","WR","DEN"], // 213 · avg 228.00
  ["Cade Otton","TE","TB"], // 214 · avg 228.33
  ["Evan McPherson","K","CIN"], // 215 · avg 228.67
  ["Kaelon Black","RB","SF"], // 216 · avg 229.00
  ["Harrison Mevis","K","LAR"], // 217 · avg 229.67
  ["Isaiah Davis","RB","NYJ"], // 218 · avg 257.67 · adj -28
  ["Chase McLaughlin","K","TB"], // 219 · avg 232.00
  ["Kendre Miller","RB","NO"], // 220 · avg 283.67 · adj -50
  ["Jordyn Tyson","WR","NO"], // 221 · avg 134.00 · adj +100
  ["Devin Neal","RB","NO"], // 222 · avg 284.33 · adj -50
  ["Andy Borregales","K","NE"], // 223 · avg 234.33
  ["Germie Bernard","WR","PIT"], // 224 · avg 235.67
  ["Zachariah Branch","WR","ATL"], // 225 · avg 237.33
  ["Justice Hill","RB","BAL"], // 226 · avg 239.33
  ["David Njoku","TE","LAC"], // 227 · avg 240.33
  ["Antonio Williams","WR","WAS"], // 228 · avg 241.00
  ["Ja'Kobi Lane","WR","BAL"], // 229 · avg 241.00
  ["Chris Bell","WR","MIA"], // 230 · avg 247.00
  ["Demond Claiborne","RB","MIN"], // 231 · avg 247.33
  ["Malachi Fields","WR","NYG"], // 232 · avg 247.67
  ["Najee Harris","RB","NYG"], // 233 · avg 247.67
  ["Devaughn Vele","WR","NO"], // 234 · avg 250.00
  ["Greg Dulcich","TE","MIA"], // 235 · avg 250.33
  ["Evan Engram","TE","DEN"], // 236 · avg 251.33
  ["Harrison Butker","K","KC"], // 237 · avg 251.33
  ["Caleb Douglas","WR","MIA"], // 238 · avg 253.33
  ["Chris Boswell","K","PIT"], // 239 · avg 253.67
  ["Jack Bech","WR","LV"], // 240 · avg 254.33
  ["Ollie Gordon II","RB","MIA"], // 241 · avg 254.67
  ["Keon Coleman","WR","BUF"], // 242 · avg 244.00 · adj +12
  ["Jordan James","RB","SF"], // 243 · avg 256.00
  ["Fernando Mendoza","QB","LV"], // 244 · avg 256.33
  ["Ted Hurst III","WR","TB"], // 245 · avg 256.33
  ["Samaje Perine","RB","CIN"], // 246 · avg 257.00
  ["Colby Parkinson","TE","LAR"], // 247 · avg 259.00
  ["Malik Davis","RB","DAL"], // 248 · avg 261.00
  ["Chimere Dike","WR","TEN"], // 249 · avg 262.00
  ["Chris Brooks","RB","GB"], // 250 · avg 262.67
  ["Ty Johnson","RB","BUF"], // 251 · avg 263.33
  ["Elic Ayomanor","WR","TEN"], // 252 · avg 263.67
  ["Tyquan Thornton","WR","KC"], // 253 · avg 264.67
  ["Tory Horton","WR","SEA"], // 254 · avg 267.00
  ["Wil Lutz","K","DEN"], // 255 · avg 267.00
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 269.67
  ["Tua Tagovailoa","QB","ATL"], // 257 · avg 270.67
  ["Will Reichard","K","MIN"], // 258 · avg 273.00
  ["Darius Slayton","WR","NYG"], // 259 · avg 273.33
  ["Christian Kirk","WR","SF"], // 260 · avg 275.00
  ["Seth McGowan","RB","IND"], // 261 · avg 276.33
  ["Cyrus Allen","WR","KC"], // 262 · avg 277.00
  ["DJ Giddens","RB","IND"], // 263 · avg 277.00
  ["Mason Taylor","TE","NYJ"], // 264 · avg 278.00
  ["Elijah Sarratt","WR","BAL"], // 265 · avg 281.00
  ["Xavier Legette","WR","CAR"], // 266 · avg 281.00
  ["Marvin Mims Jr.","WR","DEN"], // 267 · avg 282.00
  ["Theo Johnson","TE","NYG"], // 268 · avg 282.67
  ["Kirk Cousins","QB","LV"], // 269 · avg 285.67
  ["Eli Stowers","TE","PHI"], // 270 · avg 288.33
  ["Deshaun Watson","QB","CLE"], // 271 · avg 289.00
  ["Adam Randall","RB","BAL"], // 272 · avg 289.67
  ["Emari Demercado","RB","KC"], // 273 · avg 290.67
  ["Shedeur Sanders","QB","CLE"], // 274 · avg 291.00
  ["Kyle Williams","WR","NE"], // 275 · avg 291.33
  ["Michael Penix Jr.","QB","ATL"], // 276 · avg 280.00 · adj +12
  ["Brashard Smith","RB","KC"], // 277 · avg 295.00
  ["Devin Singletary","RB","NYG"], // 278 · avg 295.67
  ["Hollywood Brown","WR","PHI"], // 279 · avg 297.67
  ["Mike Gesicki","TE","CIN"], // 280 · avg 298.00
  ["Kaleb Johnson","RB","PIT"], // 281 · avg 301.33
  ["Mack Hollins","WR","NE"], // 282 · avg 301.67
  ["Trevor Etienne","RB","CAR"], // 283 · avg 304.00
  ["Isaiah Bond","WR","CLE"], // 284 · avg 306.00
  ["Skyler Bell","WR","BUF"], // 285 · avg 306.67
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 307.33
  ["Jake Tonges","TE","SF"], // 287 · avg 309.67
  ["Jerome Ford","RB","WAS"], // 288 · avg 310.33
  ["Jarquez Hunter","RB","MIA"], // 289 · avg 311.67
  ["Tez Johnson","WR","TB"], // 290 · avg 339.67 · adj -28
  ["Darren Waller","TE","CAR"], // 291 · avg 312.00
  ["Isaac Guerendo","RB","SF"], // 292 · avg 312.00
  ["Tahj Brooks","RB","CIN"], // 293 · avg 312.67
  ["Charlie Smyth","K","NO"], // 294 · avg 315.00
  ["Andrei Iosivas","WR","CIN"], // 295 · avg 316.00
  ["Audric Estime","RB","NO"], // 296 · avg 316.00
  ["Jaleel McLaughlin","RB","DEN"], // 297 · avg 316.33
  ["Darnell Washington","TE","PIT"], // 298 · avg 317.00
  ["Tyreek Hill","WR","FA"], // 299 · avg 318.00
  ["DeMario Douglas","WR","NE"], // 300 · avg 318.33
  ["Will Shipley","RB","PHI"], // 301 · avg 322.33
  ["Jahan Dotson","WR","ATL"], // 302 · avg 322.67
  ["Michael Mayer","TE","LV"], // 303 · avg 323.00
  ["Oscar Delp","TE","NO"], // 304 · avg 324.00
  ["Charlie Kolar","TE","LAC"], // 305 · avg 325.33
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.00
  ["Bryce Lance","WR","NO"], // 307 · avg 328.67
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.33
  ["Xavier Hutchinson","WR","HOU"], // 309 · avg 330.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.33
  ["Cole Kmet","TE","CHI"], // 311 · avg 333.00
  ["Eli Raridon","TE","NE"], // 312 · avg 334.33
  ["Erick All Jr.","TE","CIN"], // 313 · avg 335.00
  ["Tyler Higbee","TE","LAR"], // 314 · avg 337.67
  ["Konata Mumpfield","WR","LAR"], // 315 · avg 338.00
  ["Kareem Hunt","RB","FA"], // 316 · avg 338.67
  ["J.J. McCarthy","QB","MIN"], // 317 · avg 340.00
  ["Luke McCaffrey","WR","WAS"], // 318 · avg 341.33
  ["Dawson Knox","TE","BUF"], // 319 · avg 341.67
  ["Joe Mixon","RB","FA"], // 320 · avg 342.00
  ["Brenen Thompson","WR","LAC"], // 321 · avg 346.33
  ["Cedric Tillman","WR","FA"], // 322 · avg 346.33
  ["Olamide Zaccheaus","WR","ATL"], // 323 · avg 346.33
  ["Jalen Royals","WR","KC"], // 324 · avg 346.67
  ["Kendrick Bourne","WR","ARI"], // 325 · avg 347.33
  ["Max Klare","TE","LAR"], // 326 · avg 347.33
  ["Noah Gray","TE","KC"], // 327 · avg 348.00
  ["Joshua Palmer","WR","BUF"], // 328 · avg 351.33
  ["Bam Knight","RB","ARI"], // 329 · avg 352.33
  ["Mac Jones","QB","SF"], // 330 · avg 353.00
  ["Ja'Tavion Sanders","TE","CAR"], // 331 · avg 355.00
  ["Jake Elliott","K","PHI"], // 332 · avg 356.00
  ["Treylon Burks","WR","WAS"], // 333 · avg 356.33
  ["Eli Heidenreich","RB","PIT"], // 334 · avg 358.67
  ["Michael Carter","RB","TEN"], // 335 · avg 360.33
  ["Tyler Bass","K","BUF"], // 336 · avg 360.67
  ["Justin Fields","QB","KC"], // 337 · avg 361.00
  ["Jawhar Jordan","RB","HOU"], // 338 · avg 363.33
  ["Justin Joly","TE","DEN"], // 339 · avg 365.33
  ["Ty Simpson","QB","LAR"], // 340 · avg 367.00
  ["Roman Wilson","WR","PIT"], // 341 · avg 368.00
  ["KaVontae Turpin","WR","DAL"], // 342 · avg 369.33
  ["Savion Williams","WR","GB"], // 343 · avg 370.00
  ["Trey Smack","K","GB"], // 344 · avg 370.33
  ["Malik Benson","WR","LV"], // 345 · avg 372.00
  ["Dont'e Thornton Jr.","WR","LV"], // 346 · avg 373.33
  ["Raheim Sanders","RB","CLE"], // 347 · avg 373.33
  ["Kalif Raymond","WR","CHI"], // 348 · avg 374.00
  ["Jordan Whittington","WR","LAR"], // 349 · avg 402.00 · adj -28
  ["Kevin Coleman Jr.","WR","MIA"], // 350 · avg 377.33
];

