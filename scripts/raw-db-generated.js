// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-26T17:59:07.060Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Ja'Marr Chase","WR","CIN"], // 2 · avg 2.00
  ["Bijan Robinson","RB","ATL"], // 3 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 4 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 5 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.33
  ["Jonathan Taylor","RB","IND"], // 7 · avg 8.33
  ["Christian McCaffrey","RB","SF"], // 8 · avg 8.67
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["James Cook III","RB","BUF"], // 10 · avg 10.67
  ["A.J. Brown","WR","NE"], // 11 · avg 12.67
  ["Drake London","WR","ATL"], // 12 · avg 13.00
  ["Nico Collins","WR","HOU"], // 13 · avg 14.33
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 18.00
  ["Davante Adams","WR","LAR"], // 18 · avg 47.00 · adj -28
  ["George Pickens","WR","DAL"], // 19 · avg 19.67
  ["De'Von Achane","RB","MIA"], // 20 · avg 20.00
  ["Chris Olave","WR","NO"], // 21 · avg 21.00
  ["Trey McBride","TE","ARI"], // 22 · avg 22.00
  ["Kenneth Walker III","RB","KC"], // 23 · avg 22.67
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.33
  ["Josh Allen","QB","BUF"], // 26 · avg 25.00
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.67
  ["Rashee Rice","WR","KC"], // 28 · avg 26.33
  ["DeVonta Smith","WR","PHI"], // 29 · avg 27.33
  ["Zay Flowers","WR","BAL"], // 30 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 31 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 32 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 33 · avg 34.00
  ["Tetairoa McMillan","WR","CAR"], // 34 · avg 36.00
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.67
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 37.67
  ["Garrett Wilson","WR","NYJ"], // 37 · avg 38.00
  ["Ladd McConkey","WR","LAC"], // 38 · avg 38.00
  ["Colston Loveland","TE","CHI"], // 39 · avg 38.67
  ["Drake Maye","QB","NE"], // 40 · avg 39.00
  ["Josh Jacobs","RB","GB"], // 41 · avg 39.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.67
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.00 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.67 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 49 · avg 39.67 · adj +12
  ["Luther Burden III","WR","CHI"], // 50 · avg 52.00
  ["Jayden Daniels","QB","WAS"], // 51 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 52 · avg 54.33
  ["Jeremiyah Love","RB","ARI"], // 53 · avg 43.33 · adj +12
  ["Tyler Warren","TE","IND"], // 54 · avg 55.33
  ["Christian Watson","WR","GB"], // 55 · avg 56.00
  ["DJ Moore","WR","BUF"], // 56 · avg 56.00
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.67
  ["Bucky Irving","RB","TB"], // 58 · avg 57.33
  ["Jalen Hurts","QB","PHI"], // 59 · avg 57.33
  ["David Montgomery","RB","HOU"], // 60 · avg 58.00
  ["Mike Evans","WR","SF"], // 61 · avg 58.33
  ["Rome Odunze","WR","CHI"], // 62 · avg 58.67
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.67
  ["Caleb Williams","QB","CHI"], // 64 · avg 65.67
  ["Parker Washington","WR","JAC"], // 65 · avg 66.00
  ["Jadarian Price","RB","SEA"], // 66 · avg 66.33
  ["TreVeyon Henderson","RB","NE"], // 67 · avg 66.67
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Tucker Kraft","TE","GB"], // 70 · avg 69.67
  ["Carnell Tate","WR","TEN"], // 71 · avg 71.00
  ["Rhamondre Stevenson","RB","NE"], // 72 · avg 71.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 74.00
  ["Jaylen Warren","RB","PIT"], // 74 · avg 74.33
  ["Trevor Lawrence","QB","JAC"], // 75 · avg 74.33
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 76.00
  ["DK Metcalf","WR","PIT"], // 77 · avg 78.00
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 78.67
  ["Tony Pollard","RB","TEN"], // 79 · avg 78.67
  ["Chris Godwin Jr.","WR","TB"], // 80 · avg 81.00
  ["Courtland Sutton","WR","DEN"], // 81 · avg 83.00
  ["Rico Dowdle","RB","PIT"], // 82 · avg 83.00
  ["Kyle Pitts Sr.","TE","ATL"], // 83 · avg 83.67
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.00
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.67
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.00
  ["Brock Purdy","QB","SF"], // 87 · avg 91.33
  ["Michael Wilson","WR","ARI"], // 88 · avg 91.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 81.00 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 90 · avg 94.00
  ["Jaxson Dart","QB","NYG"], // 91 · avg 94.33
  ["Alec Pierce","WR","IND"], // 92 · avg 95.00
  ["Blake Corum","RB","LAR"], // 93 · avg 95.33
  ["Josh Downs","WR","IND"], // 94 · avg 96.67
  ["Bo Nix","QB","DEN"], // 95 · avg 99.00
  ["RJ Harvey","RB","DEN"], // 96 · avg 99.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 97 · avg 100.33
  ["Travis Kelce","TE","KC"], // 98 · avg 100.33
  ["Patrick Mahomes II","QB","KC"], // 99 · avg 100.67
  ["Wan'Dale Robinson","WR","TEN"], // 100 · avg 102.00
  ["Tyler Allgeier","RB","ARI"], // 101 · avg 130.00 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.67 · adj +12
  ["Jordan Addison","WR","MIN"], // 103 · avg 102.67
  ["Stefon Diggs","WR","WAS"], // 104 · avg 104.33
  ["Matthew Stafford","QB","LAR"], // 105 · avg 104.67
  ["Jayden Reed","WR","GB"], // 106 · avg 105.00
  ["Jordan Mason","RB","MIN"], // 107 · avg 105.33
  ["George Kittle","TE","SF"], // 108 · avg 93.67 · adj +12
  ["Kenny Gainwell","RB","TB"], // 109 · avg 106.33
  ["Jared Goff","QB","DET"], // 110 · avg 107.33
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 108.33
  ["Jakobi Meyers","WR","JAC"], // 112 · avg 109.00
  ["Makai Lemon","WR","PHI"], // 113 · avg 110.00
  ["Rachaad White","RB","WAS"], // 114 · avg 110.33
  ["Dallas Goedert","TE","PHI"], // 115 · avg 114.00
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.67
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 115.67
  ["Isaiah Likely","TE","NYG"], // 118 · avg 118.67
  ["Baker Mayfield","QB","TB"], // 119 · avg 119.33
  ["Jordan Love","QB","GB"], // 120 · avg 121.00
  ["KC Concepcion","WR","CLE"], // 121 · avg 121.67
  ["Mark Andrews","TE","BAL"], // 122 · avg 123.00
  ["Mike Washington Jr.","RB","LV"], // 123 · avg 161.00 · adj -38
  ["Xavier Worthy","WR","KC"], // 124 · avg 124.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 124.67
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.33
  ["Jake Ferguson","TE","DAL"], // 127 · avg 125.67
  ["Tyler Shough","QB","NO"], // 128 · avg 125.67
  ["Matthew Golden","WR","GB"], // 129 · avg 127.00
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.67
  ["Kyle Monangai","RB","CHI"], // 131 · avg 108.33 · adj +22
  ["Khalil Shakir","WR","BUF"], // 132 · avg 130.33
  ["Woody Marks","RB","HOU"], // 133 · avg 130.67
  ["Braelon Allen","RB","NYJ"], // 134 · avg 159.00 · adj -28
  ["Malik Willis","QB","MIA"], // 135 · avg 132.33
  ["Juwan Johnson","TE","NO"], // 136 · avg 136.33
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.33 · adj -28
  ["Sam Darnold","QB","SEA"], // 138 · avg 138.33
  ["De'Zhaun Stribling","WR","SF"], // 139 · avg 138.67
  ["Deebo Samuel Sr.","WR","SF"], // 140 · avg 139.00
  ["Tyjae Spears","RB","TEN"], // 141 · avg 139.33
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 141.00
  ["Rashid Shaheed","WR","SEA"], // 143 · avg 141.33
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.67
  ["Jonah Coleman","RB","DEN"], // 145 · avg 144.67
  ["Tank Bigsby","RB","PHI"], // 146 · avg 145.67
  ["Hunter Henry","TE","NE"], // 147 · avg 147.33
  ["Daniel Jones","QB","IND"], // 148 · avg 147.67
  ["Brenton Strange","TE","JAC"], // 149 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 150 · avg 149.67
  ["Isiah Pacheco","RB","DET"], // 151 · avg 149.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 152 · avg 150.33
  ["Denzel Boston","WR","CLE"], // 153 · avg 151.00
  ["Cam Ward","QB","TEN"], // 154 · avg 151.33
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 153.00
  ["Brian Robinson Jr.","RB","ATL"], // 156 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 158.00
  ["Dalton Schultz","TE","HOU"], // 158 · avg 159.00
  ["Tre Tucker","WR","LV"], // 159 · avg 159.00
  ["Jauan Jennings","WR","MIN"], // 160 · avg 161.67
  ["Jerry Jeudy","WR","CLE"], // 161 · avg 162.67
  ["MarShawn Lloyd","RB","GB"], // 162 · avg 163.00
  ["Bryce Young","QB","CAR"], // 163 · avg 167.33
  ["Tre' Harris","WR","LAC"], // 164 · avg 171.00
  ["Kayshon Boutte","WR","HOU"], // 165 · avg 171.67
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 174.00
  ["Emmett Johnson","RB","KC"], // 167 · avg 175.67
  ["Omar Cooper Jr.","WR","NYJ"], // 168 · avg 177.67
  ["Zach Charbonnet","RB","SEA"], // 169 · avg 143.33 · adj +35
  ["Jalen Nailor","WR","LV"], // 170 · avg 178.67
  ["AJ Barner","TE","SEA"], // 171 · avg 179.67
  ["Ray Davis","RB","BUF"], // 172 · avg 180.67
  ["Ryan Flournoy","WR","DAL"], // 173 · avg 180.67
  ["Oronde Gadsden II","TE","LAC"], // 174 · avg 183.33
  ["T.J. Hockenson","TE","MIN"], // 175 · avg 183.33
  ["Terrance Ferguson","TE","LAR"], // 176 · avg 183.67
  ["Kimani Vidal","RB","LAC"], // 177 · avg 185.00
  ["Pat Bryant","WR","DEN"], // 178 · avg 185.00
  ["Calvin Ridley","WR","TEN"], // 179 · avg 185.33
  ["James Conner","RB","ARI"], // 180 · avg 213.33 · adj -28
  ["Jacoby Brissett","QB","ARI"], // 181 · avg 186.00
  ["Malik Washington","WR","MIA"], // 182 · avg 186.33
  ["Travis Hunter","WR","JAC"], // 183 · avg 189.00
  ["Brandon Aubrey","K","DAL"], // 184 · avg 190.67
  ["Sean Tucker","RB","TB"], // 185 · avg 190.67
  ["Keenan Allen","WR","IND"], // 186 · avg 193.67
  ["Nicholas Singleton","RB","TEN"], // 187 · avg 194.00
  ["Cameron Dicker","K","LAC"], // 188 · avg 197.67
  ["Tank Dell","WR","HOU"], // 189 · avg 198.33
  ["Jaylin Noel","WR","HOU"], // 190 · avg 199.00
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 199.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 155.33 · adj +45
  ["Ka'imi Fairbairn","K","HOU"], // 193 · avg 201.67
  ["Cam Little","K","JAC"], // 194 · avg 204.67
  ["Gunnar Helm","TE","TEN"], // 195 · avg 206.67
  ["Jason Myers","K","SEA"], // 196 · avg 208.33
  ["Jaydon Blue","RB","DAL"], // 197 · avg 209.67
  ["Geno Smith","QB","NYJ"], // 198 · avg 210.00
  ["Rashod Bateman","WR","BAL"], // 199 · avg 210.00
  ["Isaac TeSlaa","WR","DET"], // 200 · avg 211.00
  ["Kaytron Allen","RB","WAS"], // 201 · avg 211.33
  ["Aaron Rodgers","QB","PIT"], // 202 · avg 213.00
  ["Pat Freiermuth","TE","PIT"], // 203 · avg 214.00
  ["Tyler Loop","K","BAL"], // 204 · avg 214.67
  ["Eddy Pineiro","K","SF"], // 205 · avg 215.00
  ["Emanuel Wilson","RB","SEA"], // 206 · avg 215.67
  ["Darnell Mooney","WR","NYG"], // 207 · avg 217.00
  ["Troy Franklin","WR","DEN"], // 208 · avg 220.00
  ["Cade Otton","TE","TB"], // 209 · avg 221.33
  ["Cooper Kupp","WR","SEA"], // 210 · avg 222.33
  ["Jake Bates","K","DET"], // 211 · avg 223.00
  ["Cairo Santos","K","CHI"], // 212 · avg 225.67
  ["Jaylen Wright","RB","MIA"], // 213 · avg 227.67
  ["Isaiah Davis","RB","NYJ"], // 214 · avg 256.33 · adj -28
  ["George Holani","RB","SEA"], // 215 · avg 229.00
  ["Germie Bernard","WR","PIT"], // 216 · avg 230.33
  ["Jordyn Tyson","WR","NO"], // 217 · avg 132.33 · adj +100
  ["Evan McPherson","K","CIN"], // 218 · avg 232.33
  ["Kaelon Black","RB","SF"], // 219 · avg 232.33
  ["Harrison Mevis","K","LAR"], // 220 · avg 232.67
  ["Zachariah Branch","WR","ATL"], // 221 · avg 234.00
  ["Devin Neal","RB","NO"], // 222 · avg 284.33 · adj -50
  ["David Njoku","TE","LAC"], // 223 · avg 235.33
  ["Andy Borregales","K","NE"], // 224 · avg 236.00
  ["Chase McLaughlin","K","TB"], // 225 · avg 236.33
  ["Kendre Miller","RB","NO"], // 226 · avg 290.33 · adj -50
  ["Antonio Williams","WR","WAS"], // 227 · avg 240.67
  ["Evan Engram","TE","DEN"], // 228 · avg 241.33
  ["Ja'Kobi Lane","WR","BAL"], // 229 · avg 242.00
  ["Justice Hill","RB","BAL"], // 230 · avg 242.00
  ["Keon Coleman","WR","BUF"], // 231 · avg 245.00
  ["Ollie Gordon II","RB","MIA"], // 232 · avg 246.67
  ["Malachi Fields","WR","NYG"], // 233 · avg 247.00
  ["Devaughn Vele","WR","NO"], // 234 · avg 247.67
  ["Colby Parkinson","TE","LAR"], // 235 · avg 248.67
  ["Fernando Mendoza","QB","LV"], // 236 · avg 249.00
  ["Jack Bech","WR","LV"], // 237 · avg 249.33
  ["Demond Claiborne","RB","MIN"], // 238 · avg 251.33
  ["Greg Dulcich","TE","MIA"], // 239 · avg 251.33
  ["Harrison Butker","K","KC"], // 240 · avg 252.33
  ["Chris Boswell","K","PIT"], // 241 · avg 254.33
  ["Ted Hurst III","WR","TB"], // 242 · avg 256.67
  ["Chimere Dike","WR","TEN"], // 243 · avg 257.00
  ["Elic Ayomanor","WR","TEN"], // 244 · avg 257.33
  ["Najee Harris","RB","NYG"], // 245 · avg 257.33
  ["Jordan James","RB","SF"], // 246 · avg 257.67
  ["Samaje Perine","RB","CIN"], // 247 · avg 259.67
  ["Tory Horton","WR","SEA"], // 248 · avg 260.33
  ["Tua Tagovailoa","QB","ATL"], // 249 · avg 260.33
  ["Chris Brooks","RB","GB"], // 250 · avg 261.00
  ["Tyquan Thornton","WR","KC"], // 251 · avg 262.67
  ["Ty Johnson","RB","BUF"], // 252 · avg 263.67
  ["Chris Bell","WR","MIA"], // 253 · avg 264.67
  ["Caleb Douglas","WR","MIA"], // 254 · avg 266.33
  ["Wil Lutz","K","DEN"], // 255 · avg 271.33
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 272.00
  ["Malik Davis","RB","DAL"], // 257 · avg 273.33
  ["Christian Kirk","WR","SF"], // 258 · avg 274.00
  ["Darius Slayton","WR","NYG"], // 259 · avg 274.00
  ["Elijah Sarratt","WR","BAL"], // 260 · avg 274.00
  ["Will Reichard","K","MIN"], // 261 · avg 274.33
  ["Mason Taylor","TE","NYJ"], // 262 · avg 277.67
  ["DJ Giddens","RB","IND"], // 263 · avg 278.00
  ["Michael Penix Jr.","QB","ATL"], // 264 · avg 278.00
  ["Theo Johnson","TE","NYG"], // 265 · avg 278.67
  ["Seth McGowan","RB","IND"], // 266 · avg 279.00
  ["Xavier Legette","WR","CAR"], // 267 · avg 279.33
  ["Cyrus Allen","WR","KC"], // 268 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 269 · avg 280.67
  ["Marvin Mims Jr.","WR","DEN"], // 270 · avg 282.00
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.33
  ["Eli Stowers","TE","PHI"], // 272 · avg 286.33
  ["Shedeur Sanders","QB","CLE"], // 273 · avg 289.67
  ["Adam Randall","RB","BAL"], // 274 · avg 291.67
  ["Emari Demercado","RB","KC"], // 275 · avg 292.33
  ["Brashard Smith","RB","KC"], // 276 · avg 294.00
  ["Devin Singletary","RB","NYG"], // 277 · avg 296.00
  ["Trey Benson","RB","ARI"], // 278 · avg 296.67
  ["Mike Gesicki","TE","CIN"], // 279 · avg 297.00
  ["Hollywood Brown","WR","PHI"], // 280 · avg 298.00
  ["Kyle Williams","WR","NE"], // 281 · avg 298.00
  ["Mack Hollins","WR","NE"], // 282 · avg 302.00
  ["Kaleb Johnson","RB","PIT"], // 283 · avg 302.67
  ["Trevor Etienne","RB","CAR"], // 284 · avg 303.00
  ["Isaiah Bond","WR","CLE"], // 285 · avg 304.67
  ["Skyler Bell","WR","BUF"], // 286 · avg 305.67
  ["Brandon Aiyuk","WR","SF"], // 287 · avg 308.33
  ["Jerome Ford","RB","WAS"], // 288 · avg 308.67
  ["Isaac Guerendo","RB","SF"], // 289 · avg 309.67
  ["Tahj Brooks","RB","CIN"], // 290 · avg 311.00
  ["Charlie Smyth","K","NO"], // 291 · avg 311.67
  ["Andrei Iosivas","WR","CIN"], // 292 · avg 313.00
  ["Jake Tonges","TE","SF"], // 293 · avg 313.33
  ["Jarquez Hunter","RB","LAR"], // 294 · avg 313.67
  ["Darren Waller","TE","CAR"], // 295 · avg 314.00
  ["Audric Estime","RB","NO"], // 296 · avg 316.00
  ["Tez Johnson","WR","TB"], // 297 · avg 344.00 · adj -28
  ["Jaleel McLaughlin","RB","DEN"], // 298 · avg 316.67
  ["Oscar Delp","TE","NO"], // 299 · avg 318.33
  ["Tyreek Hill","WR","FA"], // 300 · avg 318.33
  ["Darnell Washington","TE","PIT"], // 301 · avg 319.33
  ["Will Shipley","RB","PHI"], // 302 · avg 319.67
  ["Michael Mayer","TE","LV"], // 303 · avg 323.67
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.33
  ["DeMario Douglas","WR","NE"], // 305 · avg 325.00
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.00
  ["Jalen Tolbert","WR","MIA"], // 307 · avg 329.00
  ["Charlie Kolar","TE","LAC"], // 308 · avg 329.33
  ["Bryce Lance","WR","NO"], // 309 · avg 329.67
  ["Kareem Hunt","RB","FA"], // 310 · avg 330.67
  ["Carson Beck","QB","ARI"], // 311 · avg 331.33
  ["J.J. McCarthy","QB","MIN"], // 312 · avg 332.33
  ["Xavier Hutchinson","WR","HOU"], // 313 · avg 334.00
  ["Cole Kmet","TE","CHI"], // 314 · avg 335.33
  ["Erick All Jr.","TE","CIN"], // 315 · avg 335.67
  ["Konata Mumpfield","WR","LAR"], // 316 · avg 338.67
  ["Tyler Higbee","TE","LAR"], // 317 · avg 339.00
  ["Cedric Tillman","WR","CLE"], // 318 · avg 339.67
  ["Joe Mixon","RB","FA"], // 319 · avg 341.67
  ["Dawson Knox","TE","BUF"], // 320 · avg 343.00
  ["Eli Raridon","TE","NE"], // 321 · avg 343.33
  ["Jalen Royals","WR","KC"], // 322 · avg 345.33
  ["Luke McCaffrey","WR","WAS"], // 323 · avg 345.67
  ["Olamide Zaccheaus","WR","ATL"], // 324 · avg 346.33
  ["Calvin Austin III","WR","NYG"], // 325 · avg 347.00
  ["Max Klare","TE","LAR"], // 326 · avg 349.33
  ["Kendrick Bourne","WR","ARI"], // 327 · avg 350.00
  ["Brenen Thompson","WR","LAC"], // 328 · avg 350.33
  ["Mac Jones","QB","SF"], // 329 · avg 350.33
  ["Noah Gray","TE","KC"], // 330 · avg 350.67
  ["Bam Knight","RB","ARI"], // 331 · avg 352.00
  ["Joshua Palmer","WR","BUF"], // 332 · avg 354.67
  ["Jake Elliott","K","PHI"], // 333 · avg 355.33
  ["Ja'Tavion Sanders","TE","CAR"], // 334 · avg 358.67
  ["Treylon Burks","WR","WAS"], // 335 · avg 359.33
  ["Eli Heidenreich","RB","PIT"], // 336 · avg 360.33
  ["Justin Fields","QB","KC"], // 337 · avg 362.33
  ["Tyler Bass","K","BUF"], // 338 · avg 365.67
  ["Ty Simpson","QB","LAR"], // 339 · avg 366.67
  ["Justin Joly","TE","DEN"], // 340 · avg 367.33
  ["Malik Benson","WR","LV"], // 341 · avg 368.67
  ["Jawhar Jordan","RB","HOU"], // 342 · avg 369.00
  ["Michael Carter","RB","TEN"], // 343 · avg 369.33
  ["Trey Smack","K","GB"], // 344 · avg 372.33
  ["KaVontae Turpin","WR","DAL"], // 345 · avg 372.67
  ["Kevin Coleman Jr.","WR","MIA"], // 346 · avg 373.33
  ["Jordan Whittington","WR","LAR"], // 347 · avg 401.67 · adj -28
  ["Kalif Raymond","WR","CHI"], // 348 · avg 374.00
  ["Roman Wilson","WR","PIT"], // 349 · avg 375.33
  ["Savion Williams","WR","GB"], // 350 · avg 375.33
];

