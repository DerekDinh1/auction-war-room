// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-29T17:31:26.022Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 5 · avg 8.00
  ["Christian McCaffrey","RB","SF"], // 6 · avg 8.33
  ["Jonathan Taylor","RB","IND"], // 7 · avg 8.33
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.33
  ["James Cook III","RB","BUF"], // 9 · avg 10.67
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Drake London","WR","ATL"], // 11 · avg 13.33
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Nico Collins","WR","HOU"], // 13 · avg 15.00
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.33
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.33
  ["Davante Adams","WR","LAR"], // 18 · avg 47.00 · adj -28
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.33
  ["George Pickens","WR","DAL"], // 20 · avg 20.00
  ["Kenneth Walker III","RB","KC"], // 21 · avg 21.00
  ["Trey McBride","TE","ARI"], // 22 · avg 21.33
  ["Chris Olave","WR","NO"], // 23 · avg 21.67
  ["Omarion Hampton","RB","LAC"], // 24 · avg 23.00
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.67
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 26.00
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.67
  ["Rashee Rice","WR","KC"], // 29 · avg 28.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 32.67
  ["Kyren Williams","RB","LAR"], // 31 · avg 33.67
  ["Tee Higgins","WR","CIN"], // 32 · avg 33.67
  ["Ladd McConkey","WR","LAC"], // 33 · avg 35.67
  ["Tetairoa McMillan","WR","CAR"], // 34 · avg 35.67
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.33
  ["Colston Loveland","TE","CHI"], // 36 · avg 37.00
  ["Jaylen Waddle","WR","DEN"], // 37 · avg 37.33
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.00
  ["Drake Maye","QB","NE"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 30.00 · adj +12
  ["Josh Jacobs","RB","GB"], // 41 · avg 43.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 45.33
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.33
  ["Ashton Jeanty","RB","LV"], // 45 · avg 25.67 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 38.00 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.00
  ["Luther Burden III","WR","CHI"], // 49 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 50 · avg 39.67 · adj +12
  ["Jayden Daniels","QB","WAS"], // 51 · avg 54.67
  ["Jeremiyah Love","RB","ARI"], // 52 · avg 43.00 · adj +12
  ["Cam Skattebo","RB","NYG"], // 53 · avg 55.67
  ["DJ Moore","WR","BUF"], // 54 · avg 55.67
  ["Christian Watson","WR","GB"], // 55 · avg 56.00
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.33
  ["Bucky Irving","RB","TB"], // 57 · avg 56.67
  ["Jalen Hurts","QB","PHI"], // 58 · avg 57.33
  ["Rome Odunze","WR","CHI"], // 59 · avg 58.33
  ["David Montgomery","RB","HOU"], // 60 · avg 58.67
  ["Mike Evans","WR","SF"], // 61 · avg 58.67
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 63.67
  ["Caleb Williams","QB","CHI"], // 63 · avg 65.67
  ["Parker Washington","WR","JAC"], // 64 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 65 · avg 66.00
  ["Tyler Warren","TE","IND"], // 66 · avg 55.00 · adj +12
  ["TreVeyon Henderson","RB","NE"], // 67 · avg 67.00
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.33
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Rhamondre Stevenson","RB","NE"], // 70 · avg 70.67
  ["Carnell Tate","WR","TEN"], // 71 · avg 72.33
  ["Dak Prescott","QB","DAL"], // 72 · avg 74.00
  ["Jaylen Warren","RB","PIT"], // 73 · avg 74.00
  ["Trevor Lawrence","QB","JAC"], // 74 · avg 74.33
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 76.67
  ["DK Metcalf","WR","PIT"], // 76 · avg 78.00
  ["Tony Pollard","RB","TEN"], // 77 · avg 78.00
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 79 · avg 81.67
  ["Courtland Sutton","WR","DEN"], // 80 · avg 83.00
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 83.00
  ["Rico Dowdle","RB","PIT"], // 82 · avg 83.33
  ["Tucker Kraft","TE","GB"], // 83 · avg 72.00 · adj +12
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 84.00
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.00
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.67
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.00
  ["Alec Pierce","WR","IND"], // 88 · avg 92.33
  ["Brock Purdy","QB","SF"], // 89 · avg 92.67
  ["Sam LaPorta","TE","DET"], // 90 · avg 82.00 · adj +12
  ["Jaxson Dart","QB","NYG"], // 91 · avg 94.33
  ["Blake Corum","RB","LAR"], // 92 · avg 94.67
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 94.67
  ["Bo Nix","QB","DEN"], // 94 · avg 96.00
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 100.33
  ["Patrick Mahomes II","QB","KC"], // 97 · avg 100.67
  ["Wan'Dale Robinson","WR","TEN"], // 98 · avg 100.67
  ["Travis Kelce","TE","KC"], // 99 · avg 101.33
  ["Tyler Allgeier","RB","ARI"], // 100 · avg 130.00 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 91.00 · adj +12
  ["Jordan Addison","WR","MIN"], // 102 · avg 103.00
  ["Jordan Mason","RB","MIN"], // 103 · avg 103.33
  ["Jayden Reed","WR","GB"], // 104 · avg 104.67
  ["Matthew Stafford","QB","LAR"], // 105 · avg 105.00
  ["George Kittle","TE","SF"], // 106 · avg 93.33 · adj +12
  ["Kenny Gainwell","RB","TB"], // 107 · avg 105.67
  ["Jared Goff","QB","DET"], // 108 · avg 106.67
  ["Dalton Kincaid","TE","BUF"], // 109 · avg 107.33
  ["Makai Lemon","WR","PHI"], // 110 · avg 108.67
  ["Stefon Diggs","WR","WAS"], // 111 · avg 108.67
  ["Josh Downs","WR","IND"], // 112 · avg 97.33 · adj +12
  ["Jakobi Meyers","WR","JAC"], // 113 · avg 110.00
  ["Rachaad White","RB","WAS"], // 114 · avg 112.33
  ["Kyler Murray","QB","MIN"], // 115 · avg 114.00
  ["Dallas Goedert","TE","PHI"], // 116 · avg 114.33
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.33
  ["Isaiah Likely","TE","NYG"], // 118 · avg 118.00
  ["Baker Mayfield","QB","TB"], // 119 · avg 118.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.67
  ["Romeo Doubs","WR","NE"], // 121 · avg 124.00
  ["Mike Washington Jr.","RB","LV"], // 122 · avg 162.00 · adj -38
  ["Chris Rodriguez Jr.","RB","JAC"], // 123 · avg 124.33
  ["Mark Andrews","TE","BAL"], // 124 · avg 124.67
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.67
  ["Tyler Shough","QB","NO"], // 126 · avg 125.33
  ["Jake Ferguson","TE","DAL"], // 127 · avg 126.00
  ["Matthew Golden","WR","GB"], // 128 · avg 126.33
  ["KC Concepcion","WR","CLE"], // 129 · avg 126.67
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.33
  ["Woody Marks","RB","HOU"], // 131 · avg 130.00
  ["Kyle Monangai","RB","CHI"], // 132 · avg 109.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 133 · avg 131.00
  ["Malik Willis","QB","MIA"], // 134 · avg 131.33
  ["Braelon Allen","RB","NYJ"], // 135 · avg 159.67 · adj -28
  ["Juwan Johnson","TE","NO"], // 136 · avg 134.00
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.00 · adj -28
  ["De'Zhaun Stribling","WR","SF"], // 138 · avg 138.00
  ["Deebo Samuel Sr.","WR","SF"], // 139 · avg 138.67
  ["Tyjae Spears","RB","TEN"], // 140 · avg 138.67
  ["Sam Darnold","QB","SEA"], // 141 · avg 139.00
  ["Rashid Shaheed","WR","SEA"], // 142 · avg 139.67
  ["Keaton Mitchell","RB","LAC"], // 143 · avg 141.33
  ["C.J. Stroud","QB","HOU"], // 144 · avg 143.00
  ["Jonah Coleman","RB","DEN"], // 145 · avg 144.33
  ["Tank Bigsby","RB","PHI"], // 146 · avg 145.00
  ["Daniel Jones","QB","IND"], // 147 · avg 147.67
  ["Hunter Henry","TE","NE"], // 148 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.67
  ["Cam Ward","QB","TEN"], // 150 · avg 151.33
  ["Brenton Strange","TE","JAC"], // 151 · avg 151.67
  ["Denzel Boston","WR","CLE"], // 152 · avg 151.67
  ["Isiah Pacheco","RB","DET"], // 153 · avg 152.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 152.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 155 · avg 155.00
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 156.00
  ["MarShawn Lloyd","RB","GB"], // 157 · avg 156.00
  ["Tre Tucker","WR","LV"], // 158 · avg 156.67
  ["Dalton Schultz","TE","HOU"], // 159 · avg 157.00
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 159.67
  ["Jerry Jeudy","WR","CLE"], // 161 · avg 163.33
  ["Jauan Jennings","WR","MIN"], // 162 · avg 165.33
  ["Kayshon Boutte","WR","HOU"], // 163 · avg 167.00
  ["Bryce Young","QB","CAR"], // 164 · avg 168.33
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.67
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 172.00
  ["Emmett Johnson","RB","KC"], // 167 · avg 176.33
  ["Omar Cooper Jr.","WR","NYJ"], // 168 · avg 178.00
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 178.67
  ["Zach Charbonnet","RB","SEA"], // 170 · avg 144.00 · adj +35
  ["Ray Davis","RB","BUF"], // 171 · avg 179.00
  ["Terrance Ferguson","TE","LAR"], // 172 · avg 179.33
  ["AJ Barner","TE","SEA"], // 173 · avg 181.00
  ["Jalen Nailor","WR","LV"], // 174 · avg 184.33
  ["Pat Bryant","WR","DEN"], // 175 · avg 184.33
  ["Calvin Ridley","WR","TEN"], // 176 · avg 186.33
  ["Brandon Aubrey","K","DAL"], // 177 · avg 186.67
  ["Kimani Vidal","RB","LAC"], // 178 · avg 187.33
  ["Oronde Gadsden II","TE","LAC"], // 179 · avg 187.33
  ["T.J. Hockenson","TE","MIN"], // 180 · avg 187.67
  ["Jacoby Brissett","QB","ARI"], // 181 · avg 188.00
  ["Malik Washington","WR","MIA"], // 182 · avg 188.00
  ["Keenan Allen","WR","IND"], // 183 · avg 193.33
  ["Travis Hunter","WR","JAC"], // 184 · avg 194.00
  ["Cameron Dicker","K","LAC"], // 185 · avg 195.33
  ["Nicholas Singleton","RB","TEN"], // 186 · avg 196.33
  ["Kenyon Sadiq","TE","NYJ"], // 187 · avg 197.33
  ["Sean Tucker","RB","TB"], // 188 · avg 198.00
  ["Ka'imi Fairbairn","K","HOU"], // 189 · avg 198.67
  ["James Conner","RB","ARI"], // 190 · avg 216.33 · adj -16
  ["Alvin Kamara","RB","NO"], // 191 · avg 157.00 · adj +45
  ["Cam Little","K","JAC"], // 192 · avg 202.00
  ["Jaylin Noel","WR","HOU"], // 193 · avg 202.33
  ["Jason Myers","K","SEA"], // 194 · avg 205.33
  ["Gunnar Helm","TE","TEN"], // 195 · avg 208.00
  ["Rashod Bateman","WR","BAL"], // 196 · avg 208.00
  ["Jaydon Blue","RB","DAL"], // 197 · avg 208.33
  ["Tyler Loop","K","BAL"], // 198 · avg 211.67
  ["Eddy Pineiro","K","SF"], // 199 · avg 212.33
  ["Tank Dell","WR","HOU"], // 200 · avg 212.67
  ["Aaron Rodgers","QB","PIT"], // 201 · avg 214.67
  ["Kaytron Allen","RB","WAS"], // 202 · avg 215.00
  ["Geno Smith","QB","NYJ"], // 203 · avg 216.33
  ["Pat Freiermuth","TE","PIT"], // 204 · avg 216.67
  ["Isaac TeSlaa","WR","DET"], // 205 · avg 217.00
  ["Jake Bates","K","DET"], // 206 · avg 219.00
  ["Darnell Mooney","WR","NYG"], // 207 · avg 219.33
  ["Cooper Kupp","WR","SEA"], // 208 · avg 220.67
  ["Cairo Santos","K","CHI"], // 209 · avg 222.67
  ["Emanuel Wilson","RB","SEA"], // 210 · avg 223.00
  ["Cade Otton","TE","TB"], // 211 · avg 226.00
  ["George Holani","RB","SEA"], // 212 · avg 226.00
  ["Evan McPherson","K","CIN"], // 213 · avg 227.33
  ["Kaelon Black","RB","SF"], // 214 · avg 229.67
  ["Harrison Mevis","K","LAR"], // 215 · avg 230.33
  ["Troy Franklin","WR","DEN"], // 216 · avg 230.33
  ["Jaylen Wright","RB","MIA"], // 217 · avg 230.67
  ["Isaiah Davis","RB","NYJ"], // 218 · avg 258.67 · adj -28
  ["Chase McLaughlin","K","TB"], // 219 · avg 232.33
  ["Jordyn Tyson","WR","NO"], // 220 · avg 133.33 · adj +100
  ["Germie Bernard","WR","PIT"], // 221 · avg 234.33
  ["Ja'Kobi Lane","WR","BAL"], // 222 · avg 234.67
  ["Andy Borregales","K","NE"], // 223 · avg 235.00
  ["Zachariah Branch","WR","ATL"], // 224 · avg 235.33
  ["Kendre Miller","RB","NO"], // 225 · avg 286.00 · adj -50
  ["Devin Neal","RB","NO"], // 226 · avg 287.33 · adj -50
  ["Justice Hill","RB","BAL"], // 227 · avg 241.67
  ["Antonio Williams","WR","WAS"], // 228 · avg 242.67
  ["David Njoku","TE","LAC"], // 229 · avg 242.67
  ["Malachi Fields","WR","NYG"], // 230 · avg 243.33
  ["Devaughn Vele","WR","NO"], // 231 · avg 246.33
  ["Greg Dulcich","TE","MIA"], // 232 · avg 247.67
  ["Harrison Butker","K","KC"], // 233 · avg 248.67
  ["Evan Engram","TE","DEN"], // 234 · avg 249.00
  ["Najee Harris","RB","NYG"], // 235 · avg 249.67
  ["Caleb Douglas","WR","MIA"], // 236 · avg 252.67
  ["Ollie Gordon II","RB","MIA"], // 237 · avg 253.00
  ["Chris Bell","WR","MIA"], // 238 · avg 253.33
  ["Demond Claiborne","RB","MIN"], // 239 · avg 253.67
  ["Fernando Mendoza","QB","LV"], // 240 · avg 253.67
  ["Chris Boswell","K","PIT"], // 241 · avg 254.00
  ["Jack Bech","WR","LV"], // 242 · avg 254.67
  ["Ted Hurst III","WR","TB"], // 243 · avg 254.67
  ["Colby Parkinson","TE","LAR"], // 244 · avg 255.33
  ["Keon Coleman","WR","BUF"], // 245 · avg 246.00 · adj +12
  ["Jordan James","RB","SF"], // 246 · avg 258.33
  ["Samaje Perine","RB","CIN"], // 247 · avg 259.67
  ["Elic Ayomanor","WR","TEN"], // 248 · avg 260.67
  ["Chimere Dike","WR","TEN"], // 249 · avg 261.67
  ["Chris Brooks","RB","GB"], // 250 · avg 263.00
  ["Malik Davis","RB","DAL"], // 251 · avg 263.67
  ["Ty Johnson","RB","BUF"], // 252 · avg 266.00
  ["Tory Horton","WR","SEA"], // 253 · avg 266.33
  ["Wil Lutz","K","DEN"], // 254 · avg 267.33
  ["Tyquan Thornton","WR","KC"], // 255 · avg 267.67
  ["Tua Tagovailoa","QB","ATL"], // 256 · avg 269.33
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 272.67
  ["Will Reichard","K","MIN"], // 258 · avg 272.67
  ["Darius Slayton","WR","NYG"], // 259 · avg 273.33
  ["Cyrus Allen","WR","KC"], // 260 · avg 275.33
  ["Christian Kirk","WR","SF"], // 261 · avg 275.67
  ["Seth McGowan","RB","IND"], // 262 · avg 277.33
  ["Elijah Sarratt","WR","BAL"], // 263 · avg 278.00
  ["Mason Taylor","TE","NYJ"], // 264 · avg 279.00
  ["Theo Johnson","TE","NYG"], // 265 · avg 280.67
  ["DJ Giddens","RB","IND"], // 266 · avg 281.00
  ["Xavier Legette","WR","CAR"], // 267 · avg 282.00
  ["Kirk Cousins","QB","LV"], // 268 · avg 283.00
  ["Marvin Mims Jr.","WR","DEN"], // 269 · avg 283.67
  ["Deshaun Watson","QB","CLE"], // 270 · avg 286.67
  ["Eli Stowers","TE","PHI"], // 271 · avg 288.33
  ["Michael Penix Jr.","QB","ATL"], // 272 · avg 277.00 · adj +12
  ["Shedeur Sanders","QB","CLE"], // 273 · avg 290.00
  ["Adam Randall","RB","BAL"], // 274 · avg 292.00
  ["Emari Demercado","RB","KC"], // 275 · avg 292.67
  ["Kyle Williams","WR","NE"], // 276 · avg 293.00
  ["Brashard Smith","RB","KC"], // 277 · avg 295.67
  ["Hollywood Brown","WR","PHI"], // 278 · avg 297.00
  ["Devin Singletary","RB","NYG"], // 279 · avg 297.67
  ["Mike Gesicki","TE","CIN"], // 280 · avg 297.67
  ["Mack Hollins","WR","NE"], // 281 · avg 301.33
  ["Kaleb Johnson","RB","PIT"], // 282 · avg 302.00
  ["Trevor Etienne","RB","CAR"], // 283 · avg 304.00
  ["Isaiah Bond","WR","CLE"], // 284 · avg 304.67
  ["Skyler Bell","WR","BUF"], // 285 · avg 305.67
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 309.00
  ["Jerome Ford","RB","WAS"], // 287 · avg 310.33
  ["Darren Waller","TE","CAR"], // 288 · avg 310.67
  ["Jake Tonges","TE","SF"], // 289 · avg 311.67
  ["Jarquez Hunter","RB","MIA"], // 290 · avg 312.00
  ["Isaac Guerendo","RB","SF"], // 291 · avg 312.33
  ["Tez Johnson","WR","TB"], // 292 · avg 340.33 · adj -28
  ["Charlie Smyth","K","NO"], // 293 · avg 312.67
  ["Tahj Brooks","RB","CIN"], // 294 · avg 314.00
  ["Audric Estime","RB","NO"], // 295 · avg 314.67
  ["Andrei Iosivas","WR","CIN"], // 296 · avg 315.33
  ["Jaleel McLaughlin","RB","DEN"], // 297 · avg 317.00
  ["Darnell Washington","TE","PIT"], // 298 · avg 317.67
  ["DeMario Douglas","WR","NE"], // 299 · avg 318.67
  ["Tyreek Hill","WR","FA"], // 300 · avg 319.33
  ["Oscar Delp","TE","NO"], // 301 · avg 321.33
  ["Michael Mayer","TE","LV"], // 302 · avg 322.67
  ["Will Shipley","RB","PHI"], // 303 · avg 323.00
  ["Jahan Dotson","WR","ATL"], // 304 · avg 323.33
  ["Charlie Kolar","TE","LAC"], // 305 · avg 326.00
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 326.67
  ["Bryce Lance","WR","NO"], // 307 · avg 328.33
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.00
  ["Xavier Hutchinson","WR","HOU"], // 309 · avg 331.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.00
  ["Cole Kmet","TE","CHI"], // 311 · avg 333.33
  ["Eli Raridon","TE","NE"], // 312 · avg 334.00
  ["Erick All Jr.","TE","CIN"], // 313 · avg 334.00
  ["Tyler Higbee","TE","LAR"], // 314 · avg 336.67
  ["J.J. McCarthy","QB","MIN"], // 315 · avg 339.00
  ["Kareem Hunt","RB","FA"], // 316 · avg 339.67
  ["Konata Mumpfield","WR","LAR"], // 317 · avg 340.00
  ["Joe Mixon","RB","FA"], // 318 · avg 341.00
  ["Luke McCaffrey","WR","WAS"], // 319 · avg 341.00
  ["Dawson Knox","TE","BUF"], // 320 · avg 342.00
  ["Kendrick Bourne","WR","ARI"], // 321 · avg 345.00
  ["Brenen Thompson","WR","LAC"], // 322 · avg 345.33
  ["Cedric Tillman","WR","FA"], // 323 · avg 345.33
  ["Noah Gray","TE","KC"], // 324 · avg 346.67
  ["Olamide Zaccheaus","WR","ATL"], // 325 · avg 347.00
  ["Jalen Royals","WR","KC"], // 326 · avg 347.33
  ["Max Klare","TE","LAR"], // 327 · avg 348.67
  ["Joshua Palmer","WR","BUF"], // 328 · avg 352.00
  ["Bam Knight","RB","ARI"], // 329 · avg 352.67
  ["Mac Jones","QB","SF"], // 330 · avg 353.00
  ["Jake Elliott","K","PHI"], // 331 · avg 353.67
  ["Treylon Burks","WR","WAS"], // 332 · avg 355.33
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 357.00
  ["Eli Heidenreich","RB","PIT"], // 334 · avg 359.67
  ["Justin Fields","QB","KC"], // 335 · avg 360.67
  ["Tyler Bass","K","BUF"], // 336 · avg 360.67
  ["Jawhar Jordan","RB","HOU"], // 337 · avg 363.00
  ["Justin Joly","TE","DEN"], // 338 · avg 365.33
  ["Malik Benson","WR","LV"], // 339 · avg 366.00
  ["Michael Carter","RB","TEN"], // 340 · avg 368.00
  ["Roman Wilson","WR","PIT"], // 341 · avg 369.00
  ["Trey Smack","K","GB"], // 342 · avg 369.00
  ["Ty Simpson","QB","LAR"], // 343 · avg 369.33
  ["KaVontae Turpin","WR","DAL"], // 344 · avg 369.67
  ["Jordan Whittington","WR","LAR"], // 345 · avg 399.33 · adj -28
  ["Savion Williams","WR","GB"], // 346 · avg 371.67
  ["Kalif Raymond","WR","CHI"], // 347 · avg 374.00
  ["Raheim Sanders","RB","CLE"], // 348 · avg 374.33
  ["Kevin Coleman Jr.","WR","MIA"], // 349 · avg 377.00
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 377.33
];

