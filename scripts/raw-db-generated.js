// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-28T23:25:38.698Z · 350 players · ordered by adjusted consensus rank
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
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Drake London","WR","ATL"], // 11 · avg 13.00
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Nico Collins","WR","HOU"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.33
  ["Davante Adams","WR","LAR"], // 18 · avg 47.00 · adj -28
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.67
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Chris Olave","WR","NO"], // 21 · avg 21.67
  ["Trey McBride","TE","ARI"], // 22 · avg 21.67
  ["Kenneth Walker III","RB","KC"], // 23 · avg 22.00
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.67
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 26.33
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.67
  ["Rashee Rice","WR","KC"], // 29 · avg 28.00
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 33.67
  ["Tetairoa McMillan","WR","CAR"], // 33 · avg 35.67
  ["Javonte Williams","RB","DAL"], // 34 · avg 36.67
  ["Colston Loveland","TE","CHI"], // 35 · avg 37.00
  ["Ladd McConkey","WR","LAC"], // 36 · avg 37.33
  ["Garrett Wilson","WR","NYJ"], // 37 · avg 37.67
  ["Jaylen Waddle","WR","DEN"], // 38 · avg 37.67
  ["Drake Maye","QB","NE"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 30.33 · adj +12
  ["Josh Jacobs","RB","GB"], // 41 · avg 43.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 45.33
  ["Ashton Jeanty","RB","LV"], // 44 · avg 24.33 · adj +22
  ["Terry McLaurin","WR","WAS"], // 45 · avg 47.33
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.67 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.33
  ["Luther Burden III","WR","CHI"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 42.67 · adj +12
  ["Cam Skattebo","RB","NYG"], // 52 · avg 54.67
  ["Jayden Daniels","QB","WAS"], // 53 · avg 54.67
  ["DJ Moore","WR","BUF"], // 54 · avg 55.67
  ["Christian Watson","WR","GB"], // 55 · avg 56.33
  ["Bucky Irving","RB","TB"], // 56 · avg 57.00
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.33
  ["Rome Odunze","WR","CHI"], // 58 · avg 57.33
  ["Jalen Hurts","QB","PHI"], // 59 · avg 57.67
  ["David Montgomery","RB","HOU"], // 60 · avg 58.00
  ["Mike Evans","WR","SF"], // 61 · avg 59.00
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 63.67
  ["Caleb Williams","QB","CHI"], // 63 · avg 65.67
  ["Parker Washington","WR","JAC"], // 64 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 65 · avg 66.00
  ["Tyler Warren","TE","IND"], // 66 · avg 54.33 · adj +12
  ["TreVeyon Henderson","RB","NE"], // 67 · avg 67.33
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.00
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 69.00
  ["Rhamondre Stevenson","RB","NE"], // 70 · avg 71.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 71.33
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 73.33
  ["Dak Prescott","QB","DAL"], // 73 · avg 75.00
  ["Jaylen Warren","RB","PIT"], // 74 · avg 75.33
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 76.00
  ["DK Metcalf","WR","PIT"], // 76 · avg 77.33
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 79.00
  ["Tony Pollard","RB","TEN"], // 78 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 79 · avg 81.00
  ["Rico Dowdle","RB","PIT"], // 80 · avg 82.67
  ["Courtland Sutton","WR","DEN"], // 81 · avg 83.00
  ["Kyle Pitts Sr.","TE","ATL"], // 82 · avg 83.00
  ["Tucker Kraft","TE","GB"], // 83 · avg 71.33 · adj +12
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.00
  ["Quentin Johnston","WR","LAC"], // 85 · avg 88.00
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.67
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.33
  ["Alec Pierce","WR","IND"], // 88 · avg 92.00
  ["Brock Purdy","QB","SF"], // 89 · avg 92.33
  ["Sam LaPorta","TE","DET"], // 90 · avg 81.67 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 91 · avg 93.67
  ["Jaxson Dart","QB","NYG"], // 92 · avg 94.33
  ["Blake Corum","RB","LAR"], // 93 · avg 94.67
  ["Bo Nix","QB","DEN"], // 94 · avg 96.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 100.33
  ["Wan'Dale Robinson","WR","TEN"], // 97 · avg 100.33
  ["Patrick Mahomes II","QB","KC"], // 98 · avg 100.67
  ["Tyler Allgeier","RB","ARI"], // 99 · avg 129.33 · adj -28
  ["Travis Kelce","TE","KC"], // 100 · avg 102.33
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 90.67 · adj +12
  ["Jayden Reed","WR","GB"], // 102 · avg 102.67
  ["Jordan Addison","WR","MIN"], // 103 · avg 102.67
  ["Jordan Mason","RB","MIN"], // 104 · avg 103.33
  ["Matthew Stafford","QB","LAR"], // 105 · avg 105.33
  ["Kenny Gainwell","RB","TB"], // 106 · avg 105.67
  ["George Kittle","TE","SF"], // 107 · avg 94.00 · adj +12
  ["Jared Goff","QB","DET"], // 108 · avg 107.00
  ["Dalton Kincaid","TE","BUF"], // 109 · avg 108.00
  ["Stefon Diggs","WR","WAS"], // 110 · avg 109.00
  ["Josh Downs","WR","IND"], // 111 · avg 97.33 · adj +12
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.33
  ["Jakobi Meyers","WR","JAC"], // 113 · avg 109.67
  ["Rachaad White","RB","WAS"], // 114 · avg 112.00
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.00
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.00
  ["Isaiah Likely","TE","NYG"], // 118 · avg 118.00
  ["Baker Mayfield","QB","TB"], // 119 · avg 119.33
  ["Jordan Love","QB","GB"], // 120 · avg 119.67
  ["Mark Andrews","TE","BAL"], // 121 · avg 123.33
  ["Romeo Doubs","WR","NE"], // 122 · avg 124.00
  ["Mike Washington Jr.","RB","LV"], // 123 · avg 162.67 · adj -38
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 124.67
  ["Xavier Worthy","WR","KC"], // 125 · avg 125.00
  ["Tyler Shough","QB","NO"], // 126 · avg 125.33
  ["KC Concepcion","WR","CLE"], // 127 · avg 125.67
  ["Jake Ferguson","TE","DAL"], // 128 · avg 126.67
  ["Matthew Golden","WR","GB"], // 129 · avg 126.67
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.33
  ["Woody Marks","RB","HOU"], // 131 · avg 130.33
  ["Khalil Shakir","WR","BUF"], // 132 · avg 131.00
  ["Malik Willis","QB","MIA"], // 133 · avg 131.00
  ["Braelon Allen","RB","NYJ"], // 134 · avg 159.33 · adj -28
  ["Kyle Monangai","RB","CHI"], // 135 · avg 109.67 · adj +22
  ["Juwan Johnson","TE","NO"], // 136 · avg 134.67
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.00 · adj -28
  ["De'Zhaun Stribling","WR","SF"], // 138 · avg 137.67
  ["Tyjae Spears","RB","TEN"], // 139 · avg 138.67
  ["Deebo Samuel Sr.","WR","SF"], // 140 · avg 139.33
  ["Sam Darnold","QB","SEA"], // 141 · avg 139.33
  ["Rashid Shaheed","WR","SEA"], // 142 · avg 140.00
  ["Keaton Mitchell","RB","LAC"], // 143 · avg 141.67
  ["C.J. Stroud","QB","HOU"], // 144 · avg 143.33
  ["Jonah Coleman","RB","DEN"], // 145 · avg 144.00
  ["Tank Bigsby","RB","PHI"], // 146 · avg 144.67
  ["Daniel Jones","QB","IND"], // 147 · avg 147.33
  ["Hunter Henry","TE","NE"], // 148 · avg 148.00
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.33
  ["Isiah Pacheco","RB","DET"], // 150 · avg 150.33
  ["Brenton Strange","TE","JAC"], // 151 · avg 151.33
  ["Cam Ward","QB","TEN"], // 152 · avg 151.33
  ["Denzel Boston","WR","CLE"], // 153 · avg 151.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 152.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 155 · avg 154.67
  ["MarShawn Lloyd","RB","GB"], // 156 · avg 155.67
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 156.00
  ["Dalton Schultz","TE","HOU"], // 158 · avg 157.33
  ["Tre Tucker","WR","LV"], // 159 · avg 158.00
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 159.67
  ["Jerry Jeudy","WR","CLE"], // 161 · avg 163.33
  ["Jauan Jennings","WR","MIN"], // 162 · avg 163.67
  ["Kayshon Boutte","WR","HOU"], // 163 · avg 167.33
  ["Bryce Young","QB","CAR"], // 164 · avg 168.00
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.33
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 172.33
  ["Omar Cooper Jr.","WR","NYJ"], // 167 · avg 176.33
  ["Emmett Johnson","RB","KC"], // 168 · avg 177.00
  ["Terrance Ferguson","TE","LAR"], // 169 · avg 178.67
  ["Zach Charbonnet","RB","SEA"], // 170 · avg 144.00 · adj +35
  ["Ryan Flournoy","WR","DAL"], // 171 · avg 179.33
  ["Jalen Nailor","WR","LV"], // 172 · avg 180.67
  ["AJ Barner","TE","SEA"], // 173 · avg 181.00
  ["Ray Davis","RB","BUF"], // 174 · avg 181.67
  ["Pat Bryant","WR","DEN"], // 175 · avg 183.67
  ["Calvin Ridley","WR","TEN"], // 176 · avg 184.00
  ["T.J. Hockenson","TE","MIN"], // 177 · avg 185.67
  ["Kimani Vidal","RB","LAC"], // 178 · avg 186.00
  ["Jacoby Brissett","QB","ARI"], // 179 · avg 187.67
  ["Oronde Gadsden II","TE","LAC"], // 180 · avg 187.67
  ["Malik Washington","WR","MIA"], // 181 · avg 188.33
  ["Brandon Aubrey","K","DAL"], // 182 · avg 190.33
  ["Travis Hunter","WR","JAC"], // 183 · avg 191.00
  ["Keenan Allen","WR","IND"], // 184 · avg 191.67
  ["Nicholas Singleton","RB","TEN"], // 185 · avg 193.33
  ["Sean Tucker","RB","TB"], // 186 · avg 194.67
  ["Cameron Dicker","K","LAC"], // 187 · avg 197.00
  ["James Conner","RB","ARI"], // 188 · avg 213.67 · adj -16
  ["Kenyon Sadiq","TE","NYJ"], // 189 · avg 199.33
  ["Ka'imi Fairbairn","K","HOU"], // 190 · avg 199.67
  ["Jaylin Noel","WR","HOU"], // 191 · avg 200.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 156.33 · adj +45
  ["Cam Little","K","JAC"], // 193 · avg 203.00
  ["Rashod Bateman","WR","BAL"], // 194 · avg 206.00
  ["Jaydon Blue","RB","DAL"], // 195 · avg 206.67
  ["Gunnar Helm","TE","TEN"], // 196 · avg 207.00
  ["Jason Myers","K","SEA"], // 197 · avg 207.00
  ["Tank Dell","WR","HOU"], // 198 · avg 211.33
  ["Kaytron Allen","RB","WAS"], // 199 · avg 212.00
  ["Aaron Rodgers","QB","PIT"], // 200 · avg 213.00
  ["Tyler Loop","K","BAL"], // 201 · avg 213.33
  ["Geno Smith","QB","NYJ"], // 202 · avg 214.00
  ["Pat Freiermuth","TE","PIT"], // 203 · avg 214.00
  ["Eddy Pineiro","K","SF"], // 204 · avg 214.33
  ["Isaac TeSlaa","WR","DET"], // 205 · avg 216.00
  ["Darnell Mooney","WR","NYG"], // 206 · avg 217.67
  ["Cooper Kupp","WR","SEA"], // 207 · avg 218.67
  ["Jake Bates","K","DET"], // 208 · avg 220.33
  ["Emanuel Wilson","RB","SEA"], // 209 · avg 221.67
  ["Cade Otton","TE","TB"], // 210 · avg 224.33
  ["Cairo Santos","K","CHI"], // 211 · avg 224.67
  ["George Holani","RB","SEA"], // 212 · avg 225.67
  ["Troy Franklin","WR","DEN"], // 213 · avg 228.33
  ["Jaylen Wright","RB","MIA"], // 214 · avg 228.67
  ["Evan McPherson","K","CIN"], // 215 · avg 229.00
  ["Kaelon Black","RB","SF"], // 216 · avg 229.00
  ["Isaiah Davis","RB","NYJ"], // 217 · avg 257.00 · adj -28
  ["Harrison Mevis","K","LAR"], // 218 · avg 231.00
  ["Germie Bernard","WR","PIT"], // 219 · avg 232.00
  ["Jordyn Tyson","WR","NO"], // 220 · avg 132.67 · adj +100
  ["Ja'Kobi Lane","WR","BAL"], // 221 · avg 234.33
  ["Chase McLaughlin","K","TB"], // 222 · avg 235.00
  ["Zachariah Branch","WR","ATL"], // 223 · avg 235.00
  ["Andy Borregales","K","NE"], // 224 · avg 236.33
  ["Kendre Miller","RB","NO"], // 225 · avg 287.00 · adj -50
  ["Devin Neal","RB","NO"], // 226 · avg 287.33 · adj -50
  ["Justice Hill","RB","BAL"], // 227 · avg 241.33
  ["Antonio Williams","WR","WAS"], // 228 · avg 241.67
  ["David Njoku","TE","LAC"], // 229 · avg 241.67
  ["Malachi Fields","WR","NYG"], // 230 · avg 244.67
  ["Devaughn Vele","WR","NO"], // 231 · avg 246.33
  ["Evan Engram","TE","DEN"], // 232 · avg 246.33
  ["Greg Dulcich","TE","MIA"], // 233 · avg 247.67
  ["Najee Harris","RB","NYG"], // 234 · avg 249.00
  ["Demond Claiborne","RB","MIN"], // 235 · avg 251.67
  ["Harrison Butker","K","KC"], // 236 · avg 251.67
  ["Ollie Gordon II","RB","MIA"], // 237 · avg 252.00
  ["Jack Bech","WR","LV"], // 238 · avg 253.00
  ["Fernando Mendoza","QB","LV"], // 239 · avg 253.33
  ["Caleb Douglas","WR","MIA"], // 240 · avg 254.33
  ["Ted Hurst III","WR","TB"], // 241 · avg 255.00
  ["Chris Boswell","K","PIT"], // 242 · avg 256.00
  ["Jordan James","RB","SF"], // 243 · avg 256.00
  ["Chris Bell","WR","MIA"], // 244 · avg 256.33
  ["Keon Coleman","WR","BUF"], // 245 · avg 246.67 · adj +12
  ["Samaje Perine","RB","CIN"], // 246 · avg 258.67
  ["Colby Parkinson","TE","LAR"], // 247 · avg 259.00
  ["Elic Ayomanor","WR","TEN"], // 248 · avg 260.67
  ["Chimere Dike","WR","TEN"], // 249 · avg 261.00
  ["Malik Davis","RB","DAL"], // 250 · avg 261.00
  ["Chris Brooks","RB","GB"], // 251 · avg 263.00
  ["Tory Horton","WR","SEA"], // 252 · avg 264.67
  ["Ty Johnson","RB","BUF"], // 253 · avg 265.33
  ["Tyquan Thornton","WR","KC"], // 254 · avg 267.33
  ["Tua Tagovailoa","QB","ATL"], // 255 · avg 268.67
  ["Wil Lutz","K","DEN"], // 256 · avg 269.67
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 271.00
  ["Darius Slayton","WR","NYG"], // 258 · avg 273.33
  ["Will Reichard","K","MIN"], // 259 · avg 274.33
  ["Christian Kirk","WR","SF"], // 260 · avg 275.67
  ["Cyrus Allen","WR","KC"], // 261 · avg 277.00
  ["Elijah Sarratt","WR","BAL"], // 262 · avg 277.33
  ["Mason Taylor","TE","NYJ"], // 263 · avg 277.33
  ["DJ Giddens","RB","IND"], // 264 · avg 279.33
  ["Seth McGowan","RB","IND"], // 265 · avg 279.33
  ["Theo Johnson","TE","NYG"], // 266 · avg 280.33
  ["Xavier Legette","WR","CAR"], // 267 · avg 281.00
  ["Marvin Mims Jr.","WR","DEN"], // 268 · avg 281.67
  ["Kirk Cousins","QB","LV"], // 269 · avg 282.33
  ["Deshaun Watson","QB","CLE"], // 270 · avg 286.00
  ["Eli Stowers","TE","PHI"], // 271 · avg 288.00
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 288.33
  ["Michael Penix Jr.","QB","ATL"], // 273 · avg 278.67 · adj +12
  ["Adam Randall","RB","BAL"], // 274 · avg 291.00
  ["Emari Demercado","RB","KC"], // 275 · avg 291.00
  ["Kyle Williams","WR","NE"], // 276 · avg 294.00
  ["Brashard Smith","RB","KC"], // 277 · avg 295.67
  ["Devin Singletary","RB","NYG"], // 278 · avg 297.00
  ["Hollywood Brown","WR","PHI"], // 279 · avg 297.33
  ["Mike Gesicki","TE","CIN"], // 280 · avg 299.33
  ["Mack Hollins","WR","NE"], // 281 · avg 301.00
  ["Kaleb Johnson","RB","PIT"], // 282 · avg 302.00
  ["Trevor Etienne","RB","CAR"], // 283 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 284 · avg 304.33
  ["Skyler Bell","WR","BUF"], // 285 · avg 305.33
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 309.67
  ["Jerome Ford","RB","WAS"], // 287 · avg 310.00
  ["Tez Johnson","WR","TB"], // 288 · avg 338.67 · adj -28
  ["Charlie Smyth","K","NO"], // 289 · avg 311.67
  ["Jake Tonges","TE","SF"], // 290 · avg 311.67
  ["Tahj Brooks","RB","CIN"], // 291 · avg 311.67
  ["Darren Waller","TE","CAR"], // 292 · avg 312.00
  ["Isaac Guerendo","RB","SF"], // 293 · avg 312.33
  ["Jarquez Hunter","RB","MIA"], // 294 · avg 312.33
  ["Audric Estime","RB","NO"], // 295 · avg 314.33
  ["Andrei Iosivas","WR","CIN"], // 296 · avg 315.33
  ["Jaleel McLaughlin","RB","DEN"], // 297 · avg 318.00
  ["Darnell Washington","TE","PIT"], // 298 · avg 318.67
  ["Tyreek Hill","WR","FA"], // 299 · avg 319.00
  ["DeMario Douglas","WR","NE"], // 300 · avg 320.67
  ["Oscar Delp","TE","NO"], // 301 · avg 320.67
  ["Will Shipley","RB","PHI"], // 302 · avg 321.00
  ["Michael Mayer","TE","LV"], // 303 · avg 322.00
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.00
  ["Charlie Kolar","TE","LAC"], // 305 · avg 326.33
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 326.67
  ["Bryce Lance","WR","NO"], // 307 · avg 328.33
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.33
  ["Xavier Hutchinson","WR","HOU"], // 309 · avg 331.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.33
  ["Cole Kmet","TE","CHI"], // 311 · avg 333.00
  ["Erick All Jr.","TE","CIN"], // 312 · avg 335.00
  ["Kareem Hunt","RB","FA"], // 313 · avg 335.67
  ["Tyler Higbee","TE","LAR"], // 314 · avg 337.33
  ["Eli Raridon","TE","NE"], // 315 · avg 337.67
  ["J.J. McCarthy","QB","MIN"], // 316 · avg 339.00
  ["Konata Mumpfield","WR","LAR"], // 317 · avg 340.00
  ["Joe Mixon","RB","FA"], // 318 · avg 340.67
  ["Luke McCaffrey","WR","WAS"], // 319 · avg 341.33
  ["Dawson Knox","TE","BUF"], // 320 · avg 342.00
  ["Cedric Tillman","WR","FA"], // 321 · avg 343.67
  ["Olamide Zaccheaus","WR","ATL"], // 322 · avg 345.00
  ["Brenen Thompson","WR","LAC"], // 323 · avg 345.33
  ["Jalen Royals","WR","KC"], // 324 · avg 347.33
  ["Kendrick Bourne","WR","ARI"], // 325 · avg 347.67
  ["Max Klare","TE","LAR"], // 326 · avg 349.67
  ["Noah Gray","TE","KC"], // 327 · avg 350.00
  ["Bam Knight","RB","ARI"], // 328 · avg 350.33
  ["Joshua Palmer","WR","BUF"], // 329 · avg 352.00
  ["Mac Jones","QB","SF"], // 330 · avg 353.00
  ["Treylon Burks","WR","WAS"], // 331 · avg 354.33
  ["Jake Elliott","K","PHI"], // 332 · avg 355.67
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 356.67
  ["Eli Heidenreich","RB","PIT"], // 334 · avg 358.33
  ["Tyler Bass","K","BUF"], // 335 · avg 362.33
  ["Jawhar Jordan","RB","HOU"], // 336 · avg 364.00
  ["Justin Fields","QB","KC"], // 337 · avg 364.67
  ["Justin Joly","TE","DEN"], // 338 · avg 364.67
  ["Malik Benson","WR","LV"], // 339 · avg 367.33
  ["Ty Simpson","QB","LAR"], // 340 · avg 369.33
  ["Michael Carter","RB","TEN"], // 341 · avg 370.00
  ["Savion Williams","WR","GB"], // 342 · avg 370.00
  ["Trey Smack","K","GB"], // 343 · avg 370.33
  ["Roman Wilson","WR","PIT"], // 344 · avg 371.00
  ["KaVontae Turpin","WR","DAL"], // 345 · avg 371.33
  ["Kalif Raymond","WR","CHI"], // 346 · avg 372.33
  ["Jordan Whittington","WR","LAR"], // 347 · avg 401.00 · adj -28
  ["Kevin Coleman Jr.","WR","MIA"], // 348 · avg 374.00
  ["Raheim Sanders","RB","CLE"], // 349 · avg 374.67
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 376.00
];

