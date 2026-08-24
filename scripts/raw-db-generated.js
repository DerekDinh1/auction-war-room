// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-24T03:31:42.188Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Ja'Marr Chase","WR","CIN"], // 2 · avg 2.00
  ["Bijan Robinson","RB","ATL"], // 3 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 4 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 5 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.00
  ["Jonathan Taylor","RB","IND"], // 7 · avg 8.33
  ["Christian McCaffrey","RB","SF"], // 8 · avg 9.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 9.67
  ["James Cook III","RB","BUF"], // 10 · avg 11.67
  ["Drake London","WR","ATL"], // 11 · avg 12.33
  ["A.J. Brown","WR","NE"], // 12 · avg 12.67
  ["Nico Collins","WR","HOU"], // 13 · avg 14.67
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 16.33
  ["Saquon Barkley","RB","PHI"], // 17 · avg 18.33
  ["Davante Adams","WR","LAR"], // 18 · avg 46.33 · adj -28
  ["George Pickens","WR","DAL"], // 19 · avg 19.33
  ["De'Von Achane","RB","MIA"], // 20 · avg 20.33
  ["Trey McBride","TE","ARI"], // 21 · avg 20.67
  ["Chris Olave","WR","NO"], // 22 · avg 21.00
  ["Omarion Hampton","RB","LAC"], // 23 · avg 22.33
  ["Derrick Henry","RB","BAL"], // 24 · avg 23.00
  ["Kenneth Walker III","RB","KC"], // 25 · avg 23.00
  ["Rashee Rice","WR","KC"], // 26 · avg 24.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.00
  ["Josh Allen","QB","BUF"], // 29 · avg 27.00
  ["Zay Flowers","WR","BAL"], // 30 · avg 28.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 31.00
  ["Tetairoa McMillan","WR","CAR"], // 32 · avg 32.67
  ["Kyren Williams","RB","LAR"], // 33 · avg 33.33
  ["Lamar Jackson","QB","BAL"], // 34 · avg 33.67
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.67
  ["Ladd McConkey","WR","LAC"], // 36 · avg 37.33
  ["Garrett Wilson","WR","NYJ"], // 37 · avg 37.67
  ["Jaylen Waddle","WR","DEN"], // 38 · avg 37.67
  ["Josh Jacobs","RB","GB"], // 39 · avg 38.33
  ["Colston Loveland","TE","CHI"], // 40 · avg 38.67
  ["Drake Maye","QB","NE"], // 41 · avg 39.33
  ["Terry McLaurin","WR","WAS"], // 42 · avg 45.00
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.00
  ["Joe Burrow","QB","CIN"], // 44 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 45 · avg 37.33 · adj +12
  ["Emeka Egbuka","WR","TB"], // 46 · avg 38.00 · adj +12
  ["Jameson Williams","WR","DET"], // 47 · avg 50.33
  ["D'Andre Swift","RB","CHI"], // 48 · avg 51.00
  ["Luther Burden III","WR","CHI"], // 49 · avg 51.33
  ["Jeremiyah Love","RB","ARI"], // 50 · avg 41.00 · adj +12
  ["Cam Skattebo","RB","NYG"], // 51 · avg 53.33
  ["Jayden Daniels","QB","WAS"], // 52 · avg 54.67
  ["Tyler Warren","TE","IND"], // 53 · avg 55.33
  ["Christian Watson","WR","GB"], // 54 · avg 55.67
  ["DJ Moore","WR","BUF"], // 55 · avg 55.67
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.33
  ["Mike Washington Jr.","RB","LV"], // 57 · avg 94.67 · adj -38
  ["Bucky Irving","RB","TB"], // 58 · avg 57.00
  ["Mike Evans","WR","SF"], // 59 · avg 57.00
  ["Rome Odunze","WR","CHI"], // 60 · avg 57.00
  ["David Montgomery","RB","HOU"], // 61 · avg 57.33
  ["Jalen Hurts","QB","PHI"], // 62 · avg 60.67
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.67
  ["TreVeyon Henderson","RB","NE"], // 64 · avg 65.33
  ["Parker Washington","WR","JAC"], // 65 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 66 · avg 66.33
  ["Ashton Jeanty","RB","LV"], // 67 · avg 44.67 · adj +22
  ["Caleb Williams","QB","CHI"], // 68 · avg 67.33
  ["Tucker Kraft","TE","GB"], // 69 · avg 68.33
  ["Marvin Harrison Jr.","WR","ARI"], // 70 · avg 69.00
  ["Carnell Tate","WR","TEN"], // 71 · avg 70.00
  ["Justin Herbert","QB","LAC"], // 72 · avg 71.67
  ["Brian Thomas Jr.","WR","JAC"], // 73 · avg 72.33
  ["Jaylen Warren","RB","PIT"], // 74 · avg 73.67
  ["Rhamondre Stevenson","RB","NE"], // 75 · avg 74.67
  ["Trevor Lawrence","QB","JAC"], // 76 · avg 76.00
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 76.67
  ["Tony Pollard","RB","TEN"], // 78 · avg 77.00
  ["DK Metcalf","WR","PIT"], // 79 · avg 77.33
  ["Dak Prescott","QB","DAL"], // 80 · avg 78.33
  ["Chris Godwin Jr.","WR","TB"], // 81 · avg 80.33
  ["Courtland Sutton","WR","DEN"], // 82 · avg 82.67
  ["Rico Dowdle","RB","PIT"], // 83 · avg 82.67
  ["Kyle Pitts Sr.","TE","ATL"], // 84 · avg 83.00
  ["Jonathon Brooks","RB","CAR"], // 85 · avg 86.00
  ["Quentin Johnston","WR","LAC"], // 86 · avg 89.33
  ["J.K. Dobbins","RB","DEN"], // 87 · avg 89.67
  ["Michael Wilson","WR","ARI"], // 88 · avg 90.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 79.67 · adj +12
  ["Alec Pierce","WR","IND"], // 90 · avg 92.67
  ["Blake Corum","RB","LAR"], // 91 · avg 95.00
  ["Brock Purdy","QB","SF"], // 92 · avg 95.00
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 95.67
  ["RJ Harvey","RB","DEN"], // 94 · avg 98.00
  ["Jaxson Dart","QB","NYG"], // 95 · avg 98.33
  ["Josh Downs","WR","IND"], // 96 · avg 98.33
  ["Travis Kelce","TE","KC"], // 97 · avg 100.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 98 · avg 102.00
  ["Wan'Dale Robinson","WR","TEN"], // 99 · avg 102.00
  ["Tyler Allgeier","RB","ARI"], // 100 · avg 130.00 · adj -28
  ["Jordan Addison","WR","MIN"], // 101 · avg 102.33
  ["Bo Nix","QB","DEN"], // 102 · avg 103.00
  ["Michael Pittman Jr.","WR","PIT"], // 103 · avg 91.33 · adj +12
  ["Stefon Diggs","WR","WAS"], // 104 · avg 104.00
  ["Patrick Mahomes II","QB","KC"], // 105 · avg 104.33
  ["Jordan Mason","RB","MIN"], // 106 · avg 105.00
  ["Jayden Reed","WR","GB"], // 107 · avg 105.33
  ["Kenny Gainwell","RB","TB"], // 108 · avg 105.67
  ["George Kittle","TE","SF"], // 109 · avg 94.00 · adj +12
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 107.67
  ["Matthew Stafford","QB","LAR"], // 111 · avg 107.67
  ["Rachaad White","RB","WAS"], // 112 · avg 109.33
  ["Jared Goff","QB","DET"], // 113 · avg 110.00
  ["Makai Lemon","WR","PHI"], // 114 · avg 110.33
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 111.33
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.67
  ["Dallas Goedert","TE","PHI"], // 117 · avg 115.33
  ["Aaron Jones Sr.","RB","MIN"], // 118 · avg 116.33
  ["Isaiah Likely","TE","NYG"], // 119 · avg 117.67
  ["Mark Andrews","TE","BAL"], // 120 · avg 121.67
  ["Baker Mayfield","QB","TB"], // 121 · avg 122.67
  ["Jake Ferguson","TE","DAL"], // 122 · avg 124.00
  ["KC Concepcion","WR","CLE"], // 123 · avg 124.00
  ["Xavier Worthy","WR","KC"], // 124 · avg 124.00
  ["Jordan Love","QB","GB"], // 125 · avg 125.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 126 · avg 125.67
  ["Matthew Golden","WR","GB"], // 127 · avg 126.33
  ["Jalen Coker","WR","CAR"], // 128 · avg 127.33
  ["Kyle Monangai","RB","CHI"], // 129 · avg 106.00 · adj +22
  ["Tyler Shough","QB","NO"], // 130 · avg 128.00
  ["Khalil Shakir","WR","BUF"], // 131 · avg 129.67
  ["Romeo Doubs","WR","NE"], // 132 · avg 131.67
  ["Braelon Allen","RB","NYJ"], // 133 · avg 161.00 · adj -28
  ["Woody Marks","RB","HOU"], // 134 · avg 133.33
  ["Jalen McMillan","WR","TB"], // 135 · avg 162.33 · adj -28
  ["Juwan Johnson","TE","NO"], // 136 · avg 134.67
  ["Malik Willis","QB","MIA"], // 137 · avg 134.67
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 137.00
  ["Tyjae Spears","RB","TEN"], // 139 · avg 140.33
  ["De'Zhaun Stribling","WR","SF"], // 140 · avg 141.33
  ["Keaton Mitchell","RB","LAC"], // 141 · avg 142.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 142 · avg 142.33
  ["Sam Darnold","QB","SEA"], // 143 · avg 143.00
  ["C.J. Stroud","QB","HOU"], // 144 · avg 143.33
  ["Rashid Shaheed","WR","SEA"], // 145 · avg 147.33
  ["Tank Bigsby","RB","PHI"], // 146 · avg 147.33
  ["Jonah Coleman","RB","DEN"], // 147 · avg 147.67
  ["Hunter Henry","TE","NE"], // 148 · avg 148.00
  ["Daniel Jones","QB","IND"], // 149 · avg 149.67
  ["Denzel Boston","WR","CLE"], // 150 · avg 149.67
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.00
  ["Dylan Sampson","RB","CLE"], // 152 · avg 150.33
  ["Chig Okonkwo","TE","WAS"], // 153 · avg 152.00
  ["Cam Ward","QB","TEN"], // 154 · avg 154.00
  ["Isiah Pacheco","RB","DET"], // 155 · avg 155.33
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 156.67
  ["Brian Robinson Jr.","RB","ATL"], // 157 · avg 157.00
  ["Jauan Jennings","WR","MIN"], // 158 · avg 160.67
  ["Tre Tucker","WR","LV"], // 159 · avg 161.67
  ["Dalton Schultz","TE","HOU"], // 160 · avg 162.00
  ["Jerry Jeudy","WR","CLE"], // 161 · avg 162.33
  ["Bryce Young","QB","CAR"], // 162 · avg 165.33
  ["MarShawn Lloyd","RB","GB"], // 163 · avg 168.33
  ["Tre' Harris","WR","LAC"], // 164 · avg 170.67
  ["Jalen Nailor","WR","LV"], // 165 · avg 173.67
  ["Omar Cooper Jr.","WR","NYJ"], // 166 · avg 175.00
  ["Oronde Gadsden II","TE","LAC"], // 167 · avg 175.33
  ["Emmett Johnson","RB","KC"], // 168 · avg 176.33
  ["Ray Davis","RB","BUF"], // 169 · avg 177.00
  ["Dontayvion Wicks","WR","PHI"], // 170 · avg 177.33
  ["AJ Barner","TE","SEA"], // 171 · avg 177.67
  ["James Conner","RB","ARI"], // 172 · avg 205.67 · adj -28
  ["Zach Charbonnet","RB","SEA"], // 173 · avg 144.33 · adj +35
  ["Ryan Flournoy","WR","DAL"], // 174 · avg 179.33
  ["Sean Tucker","RB","TB"], // 175 · avg 181.33
  ["T.J. Hockenson","TE","MIN"], // 176 · avg 181.67
  ["Jacoby Brissett","QB","ARI"], // 177 · avg 182.00
  ["Travis Hunter","WR","JAC"], // 178 · avg 183.33
  ["Pat Bryant","WR","DEN"], // 179 · avg 186.33
  ["Malik Washington","WR","MIA"], // 180 · avg 186.67
  ["Terrance Ferguson","TE","LAR"], // 181 · avg 186.67
  ["Jaylin Noel","WR","HOU"], // 182 · avg 188.33
  ["Kayshon Boutte","WR","NE"], // 183 · avg 188.33
  ["Calvin Ridley","WR","TEN"], // 184 · avg 190.33
  ["Kimani Vidal","RB","LAC"], // 185 · avg 191.67
  ["Nicholas Singleton","RB","TEN"], // 186 · avg 193.33
  ["Brandon Aubrey","K","DAL"], // 187 · avg 194.00
  ["Keenan Allen","WR","IND"], // 188 · avg 196.67
  ["Alvin Kamara","RB","NO"], // 189 · avg 152.33 · adj +45
  ["Kenyon Sadiq","TE","NYJ"], // 190 · avg 198.00
  ["Tank Dell","WR","HOU"], // 191 · avg 198.67
  ["Cameron Dicker","K","LAC"], // 192 · avg 200.67
  ["Ka'imi Fairbairn","K","HOU"], // 193 · avg 202.33
  ["Gunnar Helm","TE","TEN"], // 194 · avg 204.33
  ["Cam Little","K","JAC"], // 195 · avg 206.67
  ["Isaac TeSlaa","WR","DET"], // 196 · avg 209.00
  ["Emanuel Wilson","RB","SEA"], // 197 · avg 209.33
  ["Jason Myers","K","SEA"], // 198 · avg 210.33
  ["Kaytron Allen","RB","WAS"], // 199 · avg 210.33
  ["Rashod Bateman","WR","BAL"], // 200 · avg 211.00
  ["Geno Smith","QB","NYJ"], // 201 · avg 211.33
  ["Aaron Rodgers","QB","PIT"], // 202 · avg 211.67
  ["Jaydon Blue","RB","DAL"], // 203 · avg 212.67
  ["Pat Freiermuth","TE","PIT"], // 204 · avg 214.33
  ["Tyler Loop","K","BAL"], // 205 · avg 214.33
  ["Troy Franklin","WR","DEN"], // 206 · avg 216.33
  ["Darnell Mooney","WR","NYG"], // 207 · avg 216.67
  ["Eddy Pineiro","K","SF"], // 208 · avg 217.00
  ["Cade Otton","TE","TB"], // 209 · avg 220.00
  ["Jake Bates","K","DET"], // 210 · avg 224.33
  ["Cairo Santos","K","CHI"], // 211 · avg 225.00
  ["Isaiah Davis","RB","NYJ"], // 212 · avg 253.00 · adj -28
  ["Jaylen Wright","RB","MIA"], // 213 · avg 226.67
  ["Cooper Kupp","WR","SEA"], // 214 · avg 227.33
  ["Jordyn Tyson","WR","NO"], // 215 · avg 130.00 · adj +100
  ["Evan McPherson","K","CIN"], // 216 · avg 230.33
  ["Harrison Mevis","K","LAR"], // 217 · avg 230.67
  ["Zachariah Branch","WR","ATL"], // 218 · avg 233.33
  ["Devin Neal","RB","NO"], // 219 · avg 284.00 · adj -50
  ["Chase McLaughlin","K","TB"], // 220 · avg 234.33
  ["Andy Borregales","K","NE"], // 221 · avg 234.67
  ["Germie Bernard","WR","PIT"], // 222 · avg 234.67
  ["George Holani","RB","SEA"], // 223 · avg 236.33
  ["David Njoku","TE","LAC"], // 224 · avg 237.67
  ["Evan Engram","TE","DEN"], // 225 · avg 238.67
  ["Antonio Williams","WR","WAS"], // 226 · avg 239.00
  ["Ollie Gordon II","RB","MIA"], // 227 · avg 239.00
  ["Fernando Mendoza","QB","LV"], // 228 · avg 241.67
  ["Kendre Miller","RB","NO"], // 229 · avg 291.67 · adj -50
  ["Justice Hill","RB","BAL"], // 230 · avg 244.33
  ["Colby Parkinson","TE","LAR"], // 231 · avg 246.00
  ["Jack Bech","WR","LV"], // 232 · avg 247.67
  ["Harrison Butker","K","KC"], // 233 · avg 248.33
  ["Malachi Fields","WR","NYG"], // 234 · avg 248.33
  ["Demond Claiborne","RB","MIN"], // 235 · avg 249.33
  ["Chimere Dike","WR","TEN"], // 236 · avg 250.67
  ["Ja'Kobi Lane","WR","BAL"], // 237 · avg 250.67
  ["Keon Coleman","WR","BUF"], // 238 · avg 250.67
  ["Elic Ayomanor","WR","TEN"], // 239 · avg 251.67
  ["Ted Hurst III","WR","TB"], // 240 · avg 252.00
  ["Kaelon Black","RB","SF"], // 241 · avg 252.67
  ["Chris Boswell","K","PIT"], // 242 · avg 253.00
  ["Devaughn Vele","WR","NO"], // 243 · avg 253.33
  ["Greg Dulcich","TE","MIA"], // 244 · avg 255.67
  ["Tory Horton","WR","SEA"], // 245 · avg 256.33
  ["Tua Tagovailoa","QB","ATL"], // 246 · avg 257.00
  ["Chris Bell","WR","MIA"], // 247 · avg 259.33
  ["Chris Brooks","RB","GB"], // 248 · avg 261.00
  ["Jordan James","RB","SF"], // 249 · avg 261.67
  ["Samaje Perine","RB","CIN"], // 250 · avg 262.33
  ["Najee Harris","RB","NYG"], // 251 · avg 265.33
  ["Ty Johnson","RB","BUF"], // 252 · avg 268.67
  ["Caleb Douglas","WR","MIA"], // 253 · avg 269.67
  ["Elijah Sarratt","WR","BAL"], // 254 · avg 269.67
  ["Christian Kirk","WR","SF"], // 255 · avg 270.33
  ["Wil Lutz","K","DEN"], // 256 · avg 270.67
  ["Tyquan Thornton","WR","KC"], // 257 · avg 271.67
  ["Will Reichard","K","MIN"], // 258 · avg 272.00
  ["LeQuint Allen Jr.","RB","JAC"], // 259 · avg 274.33
  ["Mason Taylor","TE","NYJ"], // 260 · avg 275.33
  ["Darius Slayton","WR","NYG"], // 261 · avg 275.67
  ["Kirk Cousins","QB","LV"], // 262 · avg 277.67
  ["Michael Penix Jr.","QB","ATL"], // 263 · avg 278.00
  ["Theo Johnson","TE","NYG"], // 264 · avg 278.67
  ["Xavier Legette","WR","CAR"], // 265 · avg 279.67
  ["Malik Davis","RB","DAL"], // 266 · avg 280.00
  ["DJ Giddens","RB","IND"], // 267 · avg 281.33
  ["Trey Benson","RB","ARI"], // 268 · avg 281.33
  ["Marvin Mims Jr.","WR","DEN"], // 269 · avg 282.67
  ["Deshaun Watson","QB","CLE"], // 270 · avg 283.67
  ["Eli Stowers","TE","PHI"], // 271 · avg 284.00
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 284.33
  ["Seth McGowan","RB","IND"], // 273 · avg 287.67
  ["Cyrus Allen","WR","KC"], // 274 · avg 288.00
  ["Adam Randall","RB","BAL"], // 275 · avg 290.67
  ["Brashard Smith","RB","KC"], // 276 · avg 293.33
  ["Devin Singletary","RB","NYG"], // 277 · avg 296.00
  ["Emari Demercado","RB","KC"], // 278 · avg 296.33
  ["Kaleb Johnson","RB","PIT"], // 279 · avg 296.33
  ["Kyle Williams","WR","NE"], // 280 · avg 299.33
  ["Hollywood Brown","WR","PHI"], // 281 · avg 299.67
  ["Trevor Etienne","RB","CAR"], // 282 · avg 301.33
  ["Mike Gesicki","TE","CIN"], // 283 · avg 302.33
  ["Mack Hollins","WR","NE"], // 284 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 285 · avg 304.67
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 305.00
  ["Skyler Bell","WR","BUF"], // 287 · avg 307.33
  ["Charlie Smyth","K","NO"], // 288 · avg 307.67
  ["Isaac Guerendo","RB","SF"], // 289 · avg 307.67
  ["Jerome Ford","RB","WAS"], // 290 · avg 307.67
  ["Tahj Brooks","RB","CIN"], // 291 · avg 309.33
  ["Tyreek Hill","WR","FA"], // 292 · avg 313.00
  ["Andrei Iosivas","WR","CIN"], // 293 · avg 313.67
  ["Jake Tonges","TE","SF"], // 294 · avg 315.00
  ["Tez Johnson","WR","TB"], // 295 · avg 343.00 · adj -28
  ["Jaleel McLaughlin","RB","DEN"], // 296 · avg 315.33
  ["Jarquez Hunter","RB","LAR"], // 297 · avg 315.67
  ["Oscar Delp","TE","NO"], // 298 · avg 316.33
  ["Audric Estime","RB","NO"], // 299 · avg 316.67
  ["Darren Waller","TE","CAR"], // 300 · avg 319.00
  ["Will Shipley","RB","PHI"], // 301 · avg 319.00
  ["Darnell Washington","TE","PIT"], // 302 · avg 321.33
  ["Jahan Dotson","WR","ATL"], // 303 · avg 323.67
  ["Michael Mayer","TE","LV"], // 304 · avg 324.00
  ["Elijah Arroyo","TE","SEA"], // 305 · avg 327.33
  ["DeMario Douglas","WR","NE"], // 306 · avg 327.67
  ["Kareem Hunt","RB","FA"], // 307 · avg 328.00
  ["J.J. McCarthy","QB","MIN"], // 308 · avg 328.67
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 328.67
  ["Joe Mixon","RB","FA"], // 310 · avg 329.67
  ["Carson Beck","QB","ARI"], // 311 · avg 330.33
  ["Tyler Higbee","TE","LAR"], // 312 · avg 334.33
  ["Bryce Lance","WR","NO"], // 313 · avg 336.33
  ["Xavier Hutchinson","WR","HOU"], // 314 · avg 336.33
  ["Cedric Tillman","WR","CLE"], // 315 · avg 336.67
  ["Charlie Kolar","TE","LAC"], // 316 · avg 339.33
  ["Erick All Jr.","TE","CIN"], // 317 · avg 340.33
  ["Konata Mumpfield","WR","LAR"], // 318 · avg 341.00
  ["Cole Kmet","TE","CHI"], // 319 · avg 342.00
  ["Eli Raridon","TE","NE"], // 320 · avg 342.00
  ["Calvin Austin III","WR","NYG"], // 321 · avg 343.00
  ["Jalen Royals","WR","KC"], // 322 · avg 344.33
  ["Mac Jones","QB","SF"], // 323 · avg 344.33
  ["Noah Gray","TE","KC"], // 324 · avg 346.33
  ["Olamide Zaccheaus","WR","ATL"], // 325 · avg 347.33
  ["Luke McCaffrey","WR","WAS"], // 326 · avg 348.00
  ["Dawson Knox","TE","BUF"], // 327 · avg 348.67
  ["Max Klare","TE","LAR"], // 328 · avg 349.00
  ["Bam Knight","RB","ARI"], // 329 · avg 355.00
  ["Kendrick Bourne","WR","ARI"], // 330 · avg 355.00
  ["Jake Elliott","K","PHI"], // 331 · avg 355.67
  ["Brenen Thompson","WR","LAC"], // 332 · avg 357.33
  ["Justin Fields","QB","KC"], // 333 · avg 357.67
  ["Joshua Palmer","WR","BUF"], // 334 · avg 358.00
  ["Eli Heidenreich","RB","PIT"], // 335 · avg 358.33
  ["Ja'Tavion Sanders","TE","CAR"], // 336 · avg 358.33
  ["Justin Joly","TE","DEN"], // 337 · avg 363.33
  ["Ty Simpson","QB","LAR"], // 338 · avg 363.67
  ["Tyler Bass","K","BUF"], // 339 · avg 364.33
  ["Michael Carter","RB","TEN"], // 340 · avg 367.00
  ["Treylon Burks","WR","WAS"], // 341 · avg 368.33
  ["Kalif Raymond","WR","CHI"], // 342 · avg 371.00
  ["Malik Benson","WR","LV"], // 343 · avg 372.33
  ["Jawhar Jordan","RB","HOU"], // 344 · avg 372.67
  ["Jordan Whittington","WR","LAR"], // 345 · avg 401.33 · adj -28
  ["Anthony Richardson Sr.","QB","IND"], // 346 · avg 374.00
  ["Roman Wilson","WR","PIT"], // 347 · avg 374.33
  ["KaVontae Turpin","WR","DAL"], // 348 · avg 374.67
  ["Phil Mafah","RB","DAL"], // 349 · avg 376.67
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 377.67
];

