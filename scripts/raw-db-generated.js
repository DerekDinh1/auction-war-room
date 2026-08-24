// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-24T04:28:21.448Z · 350 players · ordered by adjusted consensus rank
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
  ["James Cook III","RB","BUF"], // 10 · avg 11.33
  ["Drake London","WR","ATL"], // 11 · avg 12.33
  ["A.J. Brown","WR","NE"], // 12 · avg 12.67
  ["Nico Collins","WR","HOU"], // 13 · avg 14.67
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Chase Brown","RB","CIN"], // 15 · avg 15.67
  ["Brock Bowers","TE","LV"], // 16 · avg 16.33
  ["Saquon Barkley","RB","PHI"], // 17 · avg 18.33
  ["Davante Adams","WR","LAR"], // 18 · avg 46.67 · adj -28
  ["George Pickens","WR","DAL"], // 19 · avg 19.33
  ["De'Von Achane","RB","MIA"], // 20 · avg 20.33
  ["Trey McBride","TE","ARI"], // 21 · avg 20.67
  ["Chris Olave","WR","NO"], // 22 · avg 21.67
  ["Omarion Hampton","RB","LAC"], // 23 · avg 22.00
  ["Kenneth Walker III","RB","KC"], // 24 · avg 22.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.67
  ["Rashee Rice","WR","KC"], // 26 · avg 24.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 26.67
  ["Josh Allen","QB","BUF"], // 29 · avg 26.67
  ["Zay Flowers","WR","BAL"], // 30 · avg 28.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 32.33
  ["Tetairoa McMillan","WR","CAR"], // 32 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 33 · avg 33.67
  ["Lamar Jackson","QB","BAL"], // 34 · avg 34.00
  ["Javonte Williams","RB","DAL"], // 35 · avg 37.00
  ["Garrett Wilson","WR","NYJ"], // 36 · avg 38.00
  ["Jaylen Waddle","WR","DEN"], // 37 · avg 38.33
  ["Ladd McConkey","WR","LAC"], // 38 · avg 38.33
  ["Josh Jacobs","RB","GB"], // 39 · avg 38.67
  ["Drake Maye","QB","NE"], // 40 · avg 39.33
  ["Colston Loveland","TE","CHI"], // 41 · avg 39.67
  ["Terry McLaurin","WR","WAS"], // 42 · avg 45.67
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.33
  ["Joe Burrow","QB","CIN"], // 44 · avg 49.00
  ["Breece Hall","RB","NYJ"], // 45 · avg 38.00 · adj +12
  ["Jameson Williams","WR","DET"], // 46 · avg 50.67
  ["D'Andre Swift","RB","CHI"], // 47 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 48 · avg 39.67 · adj +12
  ["Luther Burden III","WR","CHI"], // 49 · avg 51.67
  ["Cam Skattebo","RB","NYG"], // 50 · avg 53.33
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 41.67 · adj +12
  ["Ashton Jeanty","RB","LV"], // 52 · avg 33.00 · adj +22
  ["Jayden Daniels","QB","WAS"], // 53 · avg 55.00
  ["Tyler Warren","TE","IND"], // 54 · avg 55.33
  ["DJ Moore","WR","BUF"], // 55 · avg 55.67
  ["Christian Watson","WR","GB"], // 56 · avg 56.00
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.33
  ["Bucky Irving","RB","TB"], // 58 · avg 57.00
  ["Mike Evans","WR","SF"], // 59 · avg 57.00
  ["Rome Odunze","WR","CHI"], // 60 · avg 57.00
  ["David Montgomery","RB","HOU"], // 61 · avg 57.67
  ["Jalen Hurts","QB","PHI"], // 62 · avg 60.00
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.67
  ["TreVeyon Henderson","RB","NE"], // 64 · avg 65.00
  ["Parker Washington","WR","JAC"], // 65 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 66 · avg 66.00
  ["Mike Washington Jr.","RB","LV"], // 67 · avg 104.33 · adj -38
  ["Caleb Williams","QB","CHI"], // 68 · avg 68.00
  ["Tucker Kraft","TE","GB"], // 69 · avg 68.33
  ["Carnell Tate","WR","TEN"], // 70 · avg 69.00
  ["Marvin Harrison Jr.","WR","ARI"], // 71 · avg 69.00
  ["Justin Herbert","QB","LAC"], // 72 · avg 71.33
  ["Brian Thomas Jr.","WR","JAC"], // 73 · avg 72.33
  ["Jaylen Warren","RB","PIT"], // 74 · avg 73.00
  ["Rhamondre Stevenson","RB","NE"], // 75 · avg 75.33
  ["Trevor Lawrence","QB","JAC"], // 76 · avg 76.00
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 76.67
  ["DK Metcalf","WR","PIT"], // 78 · avg 77.33
  ["Tony Pollard","RB","TEN"], // 79 · avg 77.67
  ["Dak Prescott","QB","DAL"], // 80 · avg 78.33
  ["Chris Godwin Jr.","WR","TB"], // 81 · avg 80.33
  ["Courtland Sutton","WR","DEN"], // 82 · avg 82.33
  ["Rico Dowdle","RB","PIT"], // 83 · avg 82.67
  ["Kyle Pitts Sr.","TE","ATL"], // 84 · avg 83.00
  ["Jonathon Brooks","RB","CAR"], // 85 · avg 86.00
  ["Quentin Johnston","WR","LAC"], // 86 · avg 89.00
  ["J.K. Dobbins","RB","DEN"], // 87 · avg 89.67
  ["Michael Wilson","WR","ARI"], // 88 · avg 90.00
  ["Sam LaPorta","TE","DET"], // 89 · avg 80.33 · adj +12
  ["Alec Pierce","WR","IND"], // 90 · avg 92.67
  ["Blake Corum","RB","LAR"], // 91 · avg 94.67
  ["Brock Purdy","QB","SF"], // 92 · avg 94.67
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 94.67
  ["Jaxson Dart","QB","NYG"], // 94 · avg 97.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 97.67
  ["Josh Downs","WR","IND"], // 96 · avg 98.67
  ["Travis Kelce","TE","KC"], // 97 · avg 100.33
  ["Tyler Allgeier","RB","ARI"], // 98 · avg 129.33 · adj -28
  ["Jordan Addison","WR","MIN"], // 99 · avg 101.67
  ["Wan'Dale Robinson","WR","TEN"], // 100 · avg 101.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 101 · avg 102.00
  ["Bo Nix","QB","DEN"], // 102 · avg 102.33
  ["Patrick Mahomes II","QB","KC"], // 103 · avg 103.00
  ["Michael Pittman Jr.","WR","PIT"], // 104 · avg 91.33 · adj +12
  ["George Kittle","TE","SF"], // 105 · avg 92.67 · adj +12
  ["Jayden Reed","WR","GB"], // 106 · avg 104.67
  ["Stefon Diggs","WR","WAS"], // 107 · avg 104.67
  ["Jordan Mason","RB","MIN"], // 108 · avg 105.00
  ["Kenny Gainwell","RB","TB"], // 109 · avg 105.33
  ["Matthew Stafford","QB","LAR"], // 110 · avg 107.00
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 108.67
  ["Rachaad White","RB","WAS"], // 112 · avg 108.67
  ["Jared Goff","QB","DET"], // 113 · avg 109.33
  ["Jakobi Meyers","WR","JAC"], // 114 · avg 110.33
  ["Makai Lemon","WR","PHI"], // 115 · avg 110.33
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.00
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.33
  ["Dallas Goedert","TE","PHI"], // 118 · avg 117.00
  ["Isaiah Likely","TE","NYG"], // 119 · avg 117.33
  ["Mark Andrews","TE","BAL"], // 120 · avg 121.33
  ["Baker Mayfield","QB","TB"], // 121 · avg 123.00
  ["Jake Ferguson","TE","DAL"], // 122 · avg 123.67
  ["Jordan Love","QB","GB"], // 123 · avg 124.00
  ["KC Concepcion","WR","CLE"], // 124 · avg 124.00
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 126 · avg 126.00
  ["Matthew Golden","WR","GB"], // 127 · avg 126.00
  ["Jalen Coker","WR","CAR"], // 128 · avg 128.00
  ["Tyler Shough","QB","NO"], // 129 · avg 128.00
  ["Kyle Monangai","RB","CHI"], // 130 · avg 106.33 · adj +22
  ["Khalil Shakir","WR","BUF"], // 131 · avg 129.67
  ["Romeo Doubs","WR","NE"], // 132 · avg 131.67
  ["Woody Marks","RB","HOU"], // 133 · avg 133.00
  ["Braelon Allen","RB","NYJ"], // 134 · avg 161.00 · adj -28
  ["Malik Willis","QB","MIA"], // 135 · avg 134.00
  ["Jalen McMillan","WR","TB"], // 136 · avg 162.33 · adj -28
  ["Juwan Johnson","TE","NO"], // 137 · avg 134.67
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 137.33
  ["De'Zhaun Stribling","WR","SF"], // 139 · avg 140.33
  ["Tyjae Spears","RB","TEN"], // 140 · avg 140.33
  ["Keaton Mitchell","RB","LAC"], // 141 · avg 142.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 142 · avg 142.67
  ["Sam Darnold","QB","SEA"], // 143 · avg 143.00
  ["C.J. Stroud","QB","HOU"], // 144 · avg 143.33
  ["Jonah Coleman","RB","DEN"], // 145 · avg 147.33
  ["Rashid Shaheed","WR","SEA"], // 146 · avg 147.33
  ["Tank Bigsby","RB","PHI"], // 147 · avg 148.00
  ["Hunter Henry","TE","NE"], // 148 · avg 148.33
  ["Daniel Jones","QB","IND"], // 149 · avg 149.00
  ["Denzel Boston","WR","CLE"], // 150 · avg 149.67
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.00
  ["Dylan Sampson","RB","CLE"], // 152 · avg 150.33
  ["Chig Okonkwo","TE","WAS"], // 153 · avg 151.33
  ["Cam Ward","QB","TEN"], // 154 · avg 154.00
  ["Isiah Pacheco","RB","DET"], // 155 · avg 155.33
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 156.67
  ["Brian Robinson Jr.","RB","ATL"], // 157 · avg 157.33
  ["Tre Tucker","WR","LV"], // 158 · avg 161.00
  ["Jauan Jennings","WR","MIN"], // 159 · avg 161.33
  ["Dalton Schultz","TE","HOU"], // 160 · avg 161.67
  ["Jerry Jeudy","WR","CLE"], // 161 · avg 162.00
  ["Bryce Young","QB","CAR"], // 162 · avg 165.33
  ["MarShawn Lloyd","RB","GB"], // 163 · avg 168.67
  ["Tre' Harris","WR","LAC"], // 164 · avg 170.33
  ["Jalen Nailor","WR","LV"], // 165 · avg 173.67
  ["Omar Cooper Jr.","WR","NYJ"], // 166 · avg 174.67
  ["Oronde Gadsden II","TE","LAC"], // 167 · avg 176.33
  ["Dontayvion Wicks","WR","PHI"], // 168 · avg 176.67
  ["Emmett Johnson","RB","KC"], // 169 · avg 177.00
  ["Ray Davis","RB","BUF"], // 170 · avg 177.67
  ["James Conner","RB","ARI"], // 171 · avg 205.67 · adj -28
  ["AJ Barner","TE","SEA"], // 172 · avg 178.00
  ["Zach Charbonnet","RB","SEA"], // 173 · avg 144.33 · adj +35
  ["Ryan Flournoy","WR","DAL"], // 174 · avg 179.33
  ["Sean Tucker","RB","TB"], // 175 · avg 181.00
  ["T.J. Hockenson","TE","MIN"], // 176 · avg 181.33
  ["Jacoby Brissett","QB","ARI"], // 177 · avg 182.00
  ["Travis Hunter","WR","JAC"], // 178 · avg 185.67
  ["Pat Bryant","WR","DEN"], // 179 · avg 186.00
  ["Malik Washington","WR","MIA"], // 180 · avg 186.33
  ["Kayshon Boutte","WR","NE"], // 181 · avg 187.00
  ["Terrance Ferguson","TE","LAR"], // 182 · avg 187.00
  ["Jaylin Noel","WR","HOU"], // 183 · avg 188.33
  ["Kimani Vidal","RB","LAC"], // 184 · avg 189.33
  ["Calvin Ridley","WR","TEN"], // 185 · avg 191.67
  ["Nicholas Singleton","RB","TEN"], // 186 · avg 193.67
  ["Brandon Aubrey","K","DAL"], // 187 · avg 194.33
  ["Keenan Allen","WR","IND"], // 188 · avg 196.67
  ["Alvin Kamara","RB","NO"], // 189 · avg 152.67 · adj +45
  ["Kenyon Sadiq","TE","NYJ"], // 190 · avg 198.00
  ["Tank Dell","WR","HOU"], // 191 · avg 198.33
  ["Cameron Dicker","K","LAC"], // 192 · avg 201.00
  ["Ka'imi Fairbairn","K","HOU"], // 193 · avg 202.67
  ["Gunnar Helm","TE","TEN"], // 194 · avg 205.00
  ["Cam Little","K","JAC"], // 195 · avg 206.00
  ["Isaac TeSlaa","WR","DET"], // 196 · avg 209.33
  ["Jason Myers","K","SEA"], // 197 · avg 210.00
  ["Kaytron Allen","RB","WAS"], // 198 · avg 210.00
  ["Emanuel Wilson","RB","SEA"], // 199 · avg 210.33
  ["Aaron Rodgers","QB","PIT"], // 200 · avg 211.00
  ["Geno Smith","QB","NYJ"], // 201 · avg 212.00
  ["Rashod Bateman","WR","BAL"], // 202 · avg 212.00
  ["Jaydon Blue","RB","DAL"], // 203 · avg 212.33
  ["Pat Freiermuth","TE","PIT"], // 204 · avg 214.33
  ["Tyler Loop","K","BAL"], // 205 · avg 214.67
  ["Darnell Mooney","WR","NYG"], // 206 · avg 216.67
  ["Eddy Pineiro","K","SF"], // 207 · avg 217.00
  ["Troy Franklin","WR","DEN"], // 208 · avg 217.00
  ["Cade Otton","TE","TB"], // 209 · avg 220.67
  ["Jake Bates","K","DET"], // 210 · avg 224.00
  ["Cairo Santos","K","CHI"], // 211 · avg 224.67
  ["Isaiah Davis","RB","NYJ"], // 212 · avg 253.00 · adj -28
  ["Jaylen Wright","RB","MIA"], // 213 · avg 227.00
  ["Cooper Kupp","WR","SEA"], // 214 · avg 228.33
  ["Evan McPherson","K","CIN"], // 215 · avg 229.67
  ["Jordyn Tyson","WR","NO"], // 216 · avg 130.67 · adj +100
  ["Harrison Mevis","K","LAR"], // 217 · avg 230.67
  ["Zachariah Branch","WR","ATL"], // 218 · avg 232.33
  ["Devin Neal","RB","NO"], // 219 · avg 283.33 · adj -50
  ["Andy Borregales","K","NE"], // 220 · avg 233.67
  ["Chase McLaughlin","K","TB"], // 221 · avg 233.67
  ["Germie Bernard","WR","PIT"], // 222 · avg 234.67
  ["George Holani","RB","SEA"], // 223 · avg 236.00
  ["David Njoku","TE","LAC"], // 224 · avg 238.00
  ["Antonio Williams","WR","WAS"], // 225 · avg 238.67
  ["Ollie Gordon II","RB","MIA"], // 226 · avg 239.00
  ["Evan Engram","TE","DEN"], // 227 · avg 240.33
  ["Kendre Miller","RB","NO"], // 228 · avg 291.00 · adj -50
  ["Fernando Mendoza","QB","LV"], // 229 · avg 242.33
  ["Justice Hill","RB","BAL"], // 230 · avg 243.67
  ["Colby Parkinson","TE","LAR"], // 231 · avg 246.33
  ["Harrison Butker","K","KC"], // 232 · avg 247.00
  ["Jack Bech","WR","LV"], // 233 · avg 247.33
  ["Malachi Fields","WR","NYG"], // 234 · avg 248.00
  ["Demond Claiborne","RB","MIN"], // 235 · avg 249.33
  ["Ja'Kobi Lane","WR","BAL"], // 236 · avg 249.67
  ["Ted Hurst III","WR","TB"], // 237 · avg 251.00
  ["Chimere Dike","WR","TEN"], // 238 · avg 251.33
  ["Elic Ayomanor","WR","TEN"], // 239 · avg 251.67
  ["Keon Coleman","WR","BUF"], // 240 · avg 251.67
  ["Chris Boswell","K","PIT"], // 241 · avg 252.00
  ["Kaelon Black","RB","SF"], // 242 · avg 252.33
  ["Devaughn Vele","WR","NO"], // 243 · avg 254.67
  ["Tory Horton","WR","SEA"], // 244 · avg 257.00
  ["Chris Bell","WR","MIA"], // 245 · avg 257.67
  ["Greg Dulcich","TE","MIA"], // 246 · avg 258.00
  ["Tua Tagovailoa","QB","ATL"], // 247 · avg 258.00
  ["Chris Brooks","RB","GB"], // 248 · avg 261.67
  ["Samaje Perine","RB","CIN"], // 249 · avg 262.67
  ["Jordan James","RB","SF"], // 250 · avg 263.67
  ["Najee Harris","RB","NYG"], // 251 · avg 265.67
  ["Caleb Douglas","WR","MIA"], // 252 · avg 268.00
  ["Ty Johnson","RB","BUF"], // 253 · avg 268.33
  ["Elijah Sarratt","WR","BAL"], // 254 · avg 269.67
  ["Wil Lutz","K","DEN"], // 255 · avg 269.67
  ["Christian Kirk","WR","SF"], // 256 · avg 270.67
  ["Tyquan Thornton","WR","KC"], // 257 · avg 271.33
  ["Will Reichard","K","MIN"], // 258 · avg 272.33
  ["LeQuint Allen Jr.","RB","JAC"], // 259 · avg 273.00
  ["Mason Taylor","TE","NYJ"], // 260 · avg 275.00
  ["Darius Slayton","WR","NYG"], // 261 · avg 275.33
  ["Kirk Cousins","QB","LV"], // 262 · avg 278.00
  ["Michael Penix Jr.","QB","ATL"], // 263 · avg 278.67
  ["Theo Johnson","TE","NYG"], // 264 · avg 279.33
  ["Malik Davis","RB","DAL"], // 265 · avg 279.67
  ["DJ Giddens","RB","IND"], // 266 · avg 281.00
  ["Xavier Legette","WR","CAR"], // 267 · avg 281.00
  ["Trey Benson","RB","ARI"], // 268 · avg 282.00
  ["Eli Stowers","TE","PHI"], // 269 · avg 283.00
  ["Marvin Mims Jr.","WR","DEN"], // 270 · avg 283.00
  ["Shedeur Sanders","QB","CLE"], // 271 · avg 283.67
  ["Deshaun Watson","QB","CLE"], // 272 · avg 284.00
  ["Seth McGowan","RB","IND"], // 273 · avg 287.33
  ["Adam Randall","RB","BAL"], // 274 · avg 289.67
  ["Cyrus Allen","WR","KC"], // 275 · avg 289.67
  ["Brashard Smith","RB","KC"], // 276 · avg 293.33
  ["Devin Singletary","RB","NYG"], // 277 · avg 295.33
  ["Kaleb Johnson","RB","PIT"], // 278 · avg 296.00
  ["Emari Demercado","RB","KC"], // 279 · avg 296.33
  ["Hollywood Brown","WR","PHI"], // 280 · avg 299.33
  ["Kyle Williams","WR","NE"], // 281 · avg 300.67
  ["Trevor Etienne","RB","CAR"], // 282 · avg 301.00
  ["Mack Hollins","WR","NE"], // 283 · avg 302.00
  ["Mike Gesicki","TE","CIN"], // 284 · avg 303.67
  ["Brandon Aiyuk","WR","SF"], // 285 · avg 305.00
  ["Isaiah Bond","WR","CLE"], // 286 · avg 305.00
  ["Jerome Ford","RB","WAS"], // 287 · avg 307.00
  ["Isaac Guerendo","RB","SF"], // 288 · avg 307.33
  ["Skyler Bell","WR","BUF"], // 289 · avg 307.33
  ["Charlie Smyth","K","NO"], // 290 · avg 308.00
  ["Tahj Brooks","RB","CIN"], // 291 · avg 308.33
  ["Tyreek Hill","WR","FA"], // 292 · avg 312.33
  ["Tez Johnson","WR","TB"], // 293 · avg 340.67 · adj -28
  ["Jake Tonges","TE","SF"], // 294 · avg 314.67
  ["Jaleel McLaughlin","RB","DEN"], // 295 · avg 315.00
  ["Jarquez Hunter","RB","LAR"], // 296 · avg 315.00
  ["Andrei Iosivas","WR","CIN"], // 297 · avg 315.67
  ["Oscar Delp","TE","NO"], // 298 · avg 316.67
  ["Audric Estime","RB","NO"], // 299 · avg 317.67
  ["Darren Waller","TE","CAR"], // 300 · avg 319.00
  ["Will Shipley","RB","PHI"], // 301 · avg 319.00
  ["Darnell Washington","TE","PIT"], // 302 · avg 320.67
  ["Michael Mayer","TE","LV"], // 303 · avg 323.67
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.33
  ["Kareem Hunt","RB","FA"], // 305 · avg 327.33
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.67
  ["DeMario Douglas","WR","NE"], // 307 · avg 328.00
  ["J.J. McCarthy","QB","MIN"], // 308 · avg 328.33
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 329.33
  ["Joe Mixon","RB","FA"], // 310 · avg 329.33
  ["Carson Beck","QB","ARI"], // 311 · avg 331.33
  ["Bryce Lance","WR","NO"], // 312 · avg 332.00
  ["Tyler Higbee","TE","LAR"], // 313 · avg 335.33
  ["Xavier Hutchinson","WR","HOU"], // 314 · avg 337.00
  ["Cedric Tillman","WR","CLE"], // 315 · avg 338.33
  ["Charlie Kolar","TE","LAC"], // 316 · avg 338.33
  ["Konata Mumpfield","WR","LAR"], // 317 · avg 339.67
  ["Erick All Jr.","TE","CIN"], // 318 · avg 341.00
  ["Cole Kmet","TE","CHI"], // 319 · avg 343.00
  ["Eli Raridon","TE","NE"], // 320 · avg 343.00
  ["Calvin Austin III","WR","NYG"], // 321 · avg 344.00
  ["Mac Jones","QB","SF"], // 322 · avg 345.00
  ["Max Klare","TE","LAR"], // 323 · avg 346.00
  ["Jalen Royals","WR","KC"], // 324 · avg 346.33
  ["Noah Gray","TE","KC"], // 325 · avg 347.67
  ["Olamide Zaccheaus","WR","ATL"], // 326 · avg 347.67
  ["Dawson Knox","TE","BUF"], // 327 · avg 349.33
  ["Luke McCaffrey","WR","WAS"], // 328 · avg 349.67
  ["Brenen Thompson","WR","LAC"], // 329 · avg 355.00
  ["Jake Elliott","K","PHI"], // 330 · avg 355.33
  ["Eli Heidenreich","RB","PIT"], // 331 · avg 355.67
  ["Kendrick Bourne","WR","ARI"], // 332 · avg 355.67
  ["Bam Knight","RB","ARI"], // 333 · avg 356.00
  ["Joshua Palmer","WR","BUF"], // 334 · avg 358.67
  ["Justin Fields","QB","KC"], // 335 · avg 358.67
  ["Ja'Tavion Sanders","TE","CAR"], // 336 · avg 359.67
  ["Justin Joly","TE","DEN"], // 337 · avg 361.67
  ["Ty Simpson","QB","LAR"], // 338 · avg 364.33
  ["Tyler Bass","K","BUF"], // 339 · avg 365.67
  ["Treylon Burks","WR","WAS"], // 340 · avg 366.33
  ["Michael Carter","RB","TEN"], // 341 · avg 367.00
  ["Roman Wilson","WR","PIT"], // 342 · avg 370.67
  ["Kalif Raymond","WR","CHI"], // 343 · avg 371.67
  ["Malik Benson","WR","LV"], // 344 · avg 372.67
  ["Jawhar Jordan","RB","HOU"], // 345 · avg 373.00
  ["Jordan Whittington","WR","LAR"], // 346 · avg 401.67 · adj -28
  ["Anthony Richardson Sr.","QB","IND"], // 347 · avg 374.00
  ["KaVontae Turpin","WR","DAL"], // 348 · avg 375.00
  ["Phil Mafah","RB","DAL"], // 349 · avg 377.00
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 378.33
];

