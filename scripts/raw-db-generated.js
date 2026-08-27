// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-27T23:37:54.592Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 5 · avg 8.00
  ["Christian McCaffrey","RB","SF"], // 6 · avg 8.33
  ["Jonathan Taylor","RB","IND"], // 7 · avg 8.33
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.33
  ["James Cook III","RB","BUF"], // 9 · avg 11.00
  ["A.J. Brown","WR","NE"], // 10 · avg 13.00
  ["Drake London","WR","ATL"], // 11 · avg 13.00
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Nico Collins","WR","HOU"], // 13 · avg 15.00
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 17.33
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.00
  ["Davante Adams","WR","LAR"], // 19 · avg 47.33 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Chris Olave","WR","NO"], // 21 · avg 21.00
  ["Trey McBride","TE","ARI"], // 22 · avg 22.00
  ["Kenneth Walker III","RB","KC"], // 23 · avg 22.33
  ["Omarion Hampton","RB","LAC"], // 24 · avg 22.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.33
  ["Josh Allen","QB","BUF"], // 27 · avg 26.00
  ["Rashee Rice","WR","KC"], // 28 · avg 27.00
  ["DeVonta Smith","WR","PHI"], // 29 · avg 27.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.00
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.00
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.00
  ["Tetairoa McMillan","WR","CAR"], // 33 · avg 36.00
  ["Javonte Williams","RB","DAL"], // 34 · avg 36.67
  ["Jaylen Waddle","WR","DEN"], // 35 · avg 37.00
  ["Garrett Wilson","WR","NYJ"], // 36 · avg 37.33
  ["Colston Loveland","TE","CHI"], // 37 · avg 37.67
  ["Ladd McConkey","WR","LAC"], // 38 · avg 38.00
  ["Drake Maye","QB","NE"], // 39 · avg 38.67
  ["Josh Jacobs","RB","GB"], // 40 · avg 40.67
  ["Zay Flowers","WR","BAL"], // 41 · avg 30.33 · adj +12
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.00 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.67 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.33
  ["Luther Burden III","WR","CHI"], // 49 · avg 51.67
  ["Emeka Egbuka","WR","TB"], // 50 · avg 40.33 · adj +12
  ["Jayden Daniels","QB","WAS"], // 51 · avg 54.00
  ["Cam Skattebo","RB","NYG"], // 52 · avg 54.67
  ["Jeremiyah Love","RB","ARI"], // 53 · avg 43.00 · adj +12
  ["DJ Moore","WR","BUF"], // 54 · avg 55.67
  ["Christian Watson","WR","GB"], // 55 · avg 56.33
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.67
  ["Bucky Irving","RB","TB"], // 57 · avg 57.67
  ["Jalen Hurts","QB","PHI"], // 58 · avg 57.67
  ["David Montgomery","RB","HOU"], // 59 · avg 58.00
  ["Rome Odunze","WR","CHI"], // 60 · avg 58.33
  ["Mike Evans","WR","SF"], // 61 · avg 58.67
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 63.67
  ["Caleb Williams","QB","CHI"], // 63 · avg 65.67
  ["Jadarian Price","RB","SEA"], // 64 · avg 66.00
  ["Parker Washington","WR","JAC"], // 65 · avg 66.00
  ["Tyler Warren","TE","IND"], // 66 · avg 54.67 · adj +12
  ["TreVeyon Henderson","RB","NE"], // 67 · avg 66.67
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Carnell Tate","WR","TEN"], // 70 · avg 71.00
  ["Rhamondre Stevenson","RB","NE"], // 71 · avg 71.33
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 73.67
  ["Jaylen Warren","RB","PIT"], // 73 · avg 75.00
  ["Dak Prescott","QB","DAL"], // 74 · avg 75.67
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 76.33
  ["DK Metcalf","WR","PIT"], // 76 · avg 76.67
  ["Tony Pollard","RB","TEN"], // 77 · avg 78.67
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.00
  ["Chris Godwin Jr.","WR","TB"], // 79 · avg 81.33
  ["Kyle Pitts Sr.","TE","ATL"], // 80 · avg 82.67
  ["Tucker Kraft","TE","GB"], // 81 · avg 71.00 · adj +12
  ["Courtland Sutton","WR","DEN"], // 82 · avg 83.00
  ["Rico Dowdle","RB","PIT"], // 83 · avg 83.00
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.33
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.67
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.33
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.33
  ["Brock Purdy","QB","SF"], // 88 · avg 91.67
  ["Alec Pierce","WR","IND"], // 89 · avg 93.00
  ["Sam LaPorta","TE","DET"], // 90 · avg 81.67 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 91 · avg 93.67
  ["Jaxson Dart","QB","NYG"], // 92 · avg 94.00
  ["Blake Corum","RB","LAR"], // 93 · avg 95.00
  ["Bo Nix","QB","DEN"], // 94 · avg 97.33
  ["Jacory Croskey-Merritt","RB","WAS"], // 95 · avg 99.67
  ["Patrick Mahomes II","QB","KC"], // 96 · avg 100.67
  ["RJ Harvey","RB","DEN"], // 97 · avg 101.00
  ["Wan'Dale Robinson","WR","TEN"], // 98 · avg 101.00
  ["Tyler Allgeier","RB","ARI"], // 99 · avg 129.33 · adj -28
  ["Travis Kelce","TE","KC"], // 100 · avg 101.67
  ["Jordan Addison","WR","MIN"], // 101 · avg 102.33
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 91.00 · adj +12
  ["Jordan Mason","RB","MIN"], // 103 · avg 103.67
  ["Jayden Reed","WR","GB"], // 104 · avg 104.67
  ["Matthew Stafford","QB","LAR"], // 105 · avg 105.00
  ["George Kittle","TE","SF"], // 106 · avg 93.33 · adj +12
  ["Kenny Gainwell","RB","TB"], // 107 · avg 105.67
  ["Jared Goff","QB","DET"], // 108 · avg 106.67
  ["Dalton Kincaid","TE","BUF"], // 109 · avg 107.67
  ["Stefon Diggs","WR","WAS"], // 110 · avg 108.33
  ["Jakobi Meyers","WR","JAC"], // 111 · avg 109.33
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.33
  ["Josh Downs","WR","IND"], // 113 · avg 97.67 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 111.33
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["Kyler Murray","QB","MIN"], // 116 · avg 113.67
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 115.67
  ["Isaiah Likely","TE","NYG"], // 118 · avg 118.33
  ["Baker Mayfield","QB","TB"], // 119 · avg 118.67
  ["Jordan Love","QB","GB"], // 120 · avg 120.33
  ["Mark Andrews","TE","BAL"], // 121 · avg 123.00
  ["Mike Washington Jr.","RB","LV"], // 122 · avg 161.33 · adj -38
  ["Chris Rodriguez Jr.","RB","JAC"], // 123 · avg 124.00
  ["Tyler Shough","QB","NO"], // 124 · avg 124.33
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.33
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.00
  ["Jake Ferguson","TE","DAL"], // 127 · avg 126.33
  ["KC Concepcion","WR","CLE"], // 128 · avg 127.00
  ["Matthew Golden","WR","GB"], // 129 · avg 127.00
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.67
  ["Woody Marks","RB","HOU"], // 131 · avg 130.00
  ["Braelon Allen","RB","NYJ"], // 132 · avg 158.00 · adj -28
  ["Kyle Monangai","RB","CHI"], // 133 · avg 109.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 134 · avg 131.00
  ["Malik Willis","QB","MIA"], // 135 · avg 131.67
  ["Juwan Johnson","TE","NO"], // 136 · avg 134.67
  ["Jalen McMillan","WR","TB"], // 137 · avg 165.00 · adj -28
  ["De'Zhaun Stribling","WR","SF"], // 138 · avg 138.33
  ["Deebo Samuel Sr.","WR","SF"], // 139 · avg 138.33
  ["Sam Darnold","QB","SEA"], // 140 · avg 138.33
  ["Tyjae Spears","RB","TEN"], // 141 · avg 139.00
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 141.67
  ["Rashid Shaheed","WR","SEA"], // 143 · avg 142.00
  ["C.J. Stroud","QB","HOU"], // 144 · avg 143.00
  ["Tank Bigsby","RB","PHI"], // 145 · avg 144.33
  ["Jonah Coleman","RB","DEN"], // 146 · avg 144.67
  ["Daniel Jones","QB","IND"], // 147 · avg 147.33
  ["Hunter Henry","TE","NE"], // 148 · avg 147.33
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.67
  ["Isiah Pacheco","RB","DET"], // 150 · avg 150.00
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.67
  ["Cam Ward","QB","TEN"], // 152 · avg 151.00
  ["Denzel Boston","WR","CLE"], // 153 · avg 151.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 152.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 155 · avg 152.00
  ["Tre Tucker","WR","LV"], // 156 · avg 157.33
  ["Brian Robinson Jr.","RB","ATL"], // 157 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 158 · avg 158.33
  ["Dalton Schultz","TE","HOU"], // 159 · avg 159.00
  ["MarShawn Lloyd","RB","GB"], // 160 · avg 159.67
  ["Jauan Jennings","WR","MIN"], // 161 · avg 162.33
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 163.33
  ["Bryce Young","QB","CAR"], // 163 · avg 167.33
  ["Kayshon Boutte","WR","HOU"], // 164 · avg 169.67
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.67
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 173.67
  ["Emmett Johnson","RB","KC"], // 167 · avg 176.33
  ["Ray Davis","RB","BUF"], // 168 · avg 176.67
  ["Zach Charbonnet","RB","SEA"], // 169 · avg 143.67 · adj +35
  ["Omar Cooper Jr.","WR","NYJ"], // 170 · avg 178.67
  ["Jalen Nailor","WR","LV"], // 171 · avg 179.67
  ["AJ Barner","TE","SEA"], // 172 · avg 180.00
  ["Ryan Flournoy","WR","DAL"], // 173 · avg 180.67
  ["Terrance Ferguson","TE","LAR"], // 174 · avg 181.33
  ["Oronde Gadsden II","TE","LAC"], // 175 · avg 184.67
  ["Pat Bryant","WR","DEN"], // 176 · avg 184.67
  ["T.J. Hockenson","TE","MIN"], // 177 · avg 185.00
  ["Kimani Vidal","RB","LAC"], // 178 · avg 185.67
  ["Calvin Ridley","WR","TEN"], // 179 · avg 186.00
  ["Malik Washington","WR","MIA"], // 180 · avg 186.00
  ["Jacoby Brissett","QB","ARI"], // 181 · avg 187.33
  ["Travis Hunter","WR","JAC"], // 182 · avg 189.00
  ["Brandon Aubrey","K","DAL"], // 183 · avg 190.67
  ["Sean Tucker","RB","TB"], // 184 · avg 190.67
  ["Keenan Allen","WR","IND"], // 185 · avg 194.33
  ["Nicholas Singleton","RB","TEN"], // 186 · avg 196.67
  ["Cameron Dicker","K","LAC"], // 187 · avg 197.00
  ["Jaylin Noel","WR","HOU"], // 188 · avg 198.67
  ["James Conner","RB","ARI"], // 189 · avg 214.67 · adj -16
  ["Ka'imi Fairbairn","K","HOU"], // 190 · avg 199.67
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 200.00
  ["Alvin Kamara","RB","NO"], // 192 · avg 156.00 · adj +45
  ["Tank Dell","WR","HOU"], // 193 · avg 201.00
  ["Cam Little","K","JAC"], // 194 · avg 204.00
  ["Jason Myers","K","SEA"], // 195 · avg 207.67
  ["Gunnar Helm","TE","TEN"], // 196 · avg 208.00
  ["Jaydon Blue","RB","DAL"], // 197 · avg 208.67
  ["Rashod Bateman","WR","BAL"], // 198 · avg 209.67
  ["Aaron Rodgers","QB","PIT"], // 199 · avg 211.67
  ["Isaac TeSlaa","WR","DET"], // 200 · avg 212.33
  ["Kaytron Allen","RB","WAS"], // 201 · avg 212.67
  ["Pat Freiermuth","TE","PIT"], // 202 · avg 213.33
  ["Geno Smith","QB","NYJ"], // 203 · avg 214.00
  ["Tyler Loop","K","BAL"], // 204 · avg 214.00
  ["Eddy Pineiro","K","SF"], // 205 · avg 214.67
  ["Emanuel Wilson","RB","SEA"], // 206 · avg 215.67
  ["Darnell Mooney","WR","NYG"], // 207 · avg 218.00
  ["Jake Bates","K","DET"], // 208 · avg 220.00
  ["Cooper Kupp","WR","SEA"], // 209 · avg 222.67
  ["Troy Franklin","WR","DEN"], // 210 · avg 224.33
  ["Cairo Santos","K","CHI"], // 211 · avg 224.67
  ["Cade Otton","TE","TB"], // 212 · avg 225.33
  ["George Holani","RB","SEA"], // 213 · avg 227.33
  ["Jaylen Wright","RB","MIA"], // 214 · avg 227.33
  ["Evan McPherson","K","CIN"], // 215 · avg 228.67
  ["Isaiah Davis","RB","NYJ"], // 216 · avg 257.00 · adj -28
  ["Harrison Mevis","K","LAR"], // 217 · avg 231.00
  ["Kaelon Black","RB","SF"], // 218 · avg 231.00
  ["Germie Bernard","WR","PIT"], // 219 · avg 232.33
  ["Jordyn Tyson","WR","NO"], // 220 · avg 133.00 · adj +100
  ["Andy Borregales","K","NE"], // 221 · avg 233.67
  ["Devin Neal","RB","NO"], // 222 · avg 283.67 · adj -50
  ["Chase McLaughlin","K","TB"], // 223 · avg 235.00
  ["Zachariah Branch","WR","ATL"], // 224 · avg 236.00
  ["Kendre Miller","RB","NO"], // 225 · avg 287.67 · adj -50
  ["David Njoku","TE","LAC"], // 226 · avg 239.67
  ["Ja'Kobi Lane","WR","BAL"], // 227 · avg 239.67
  ["Antonio Williams","WR","WAS"], // 228 · avg 243.33
  ["Justice Hill","RB","BAL"], // 229 · avg 243.67
  ["Evan Engram","TE","DEN"], // 230 · avg 244.33
  ["Greg Dulcich","TE","MIA"], // 231 · avg 247.33
  ["Ollie Gordon II","RB","MIA"], // 232 · avg 247.33
  ["Malachi Fields","WR","NYG"], // 233 · avg 247.67
  ["Devaughn Vele","WR","NO"], // 234 · avg 249.00
  ["Jack Bech","WR","LV"], // 235 · avg 250.00
  ["Demond Claiborne","RB","MIN"], // 236 · avg 250.67
  ["Harrison Butker","K","KC"], // 237 · avg 251.00
  ["Fernando Mendoza","QB","LV"], // 238 · avg 251.33
  ["Najee Harris","RB","NYG"], // 239 · avg 254.00
  ["Chris Boswell","K","PIT"], // 240 · avg 254.67
  ["Ted Hurst III","WR","TB"], // 241 · avg 255.33
  ["Colby Parkinson","TE","LAR"], // 242 · avg 256.00
  ["Caleb Douglas","WR","MIA"], // 243 · avg 256.33
  ["Samaje Perine","RB","CIN"], // 244 · avg 256.67
  ["Elic Ayomanor","WR","TEN"], // 245 · avg 257.33
  ["Chimere Dike","WR","TEN"], // 246 · avg 258.00
  ["Keon Coleman","WR","BUF"], // 247 · avg 246.33 · adj +12
  ["Jordan James","RB","SF"], // 248 · avg 258.67
  ["Chris Bell","WR","MIA"], // 249 · avg 262.00
  ["Tory Horton","WR","SEA"], // 250 · avg 262.67
  ["Tua Tagovailoa","QB","ATL"], // 251 · avg 264.33
  ["Chris Brooks","RB","GB"], // 252 · avg 264.67
  ["Ty Johnson","RB","BUF"], // 253 · avg 265.67
  ["Tyquan Thornton","WR","KC"], // 254 · avg 267.67
  ["Wil Lutz","K","DEN"], // 255 · avg 268.67
  ["Malik Davis","RB","DAL"], // 256 · avg 271.33
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 272.33
  ["Will Reichard","K","MIN"], // 258 · avg 272.67
  ["Darius Slayton","WR","NYG"], // 259 · avg 274.00
  ["Christian Kirk","WR","SF"], // 260 · avg 275.00
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 275.67
  ["Cyrus Allen","WR","KC"], // 262 · avg 278.00
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.67
  ["Seth McGowan","RB","IND"], // 264 · avg 279.00
  ["Xavier Legette","WR","CAR"], // 265 · avg 280.00
  ["DJ Giddens","RB","IND"], // 266 · avg 280.33
  ["Theo Johnson","TE","NYG"], // 267 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 268 · avg 281.33
  ["Marvin Mims Jr.","WR","DEN"], // 269 · avg 282.67
  ["Deshaun Watson","QB","CLE"], // 270 · avg 285.67
  ["Eli Stowers","TE","PHI"], // 271 · avg 288.00
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 288.00
  ["Adam Randall","RB","BAL"], // 273 · avg 290.33
  ["Michael Penix Jr.","QB","ATL"], // 274 · avg 280.67 · adj +12
  ["Emari Demercado","RB","KC"], // 275 · avg 293.67
  ["Brashard Smith","RB","KC"], // 276 · avg 294.67
  ["Kyle Williams","WR","NE"], // 277 · avg 295.33
  ["Hollywood Brown","WR","PHI"], // 278 · avg 297.00
  ["Devin Singletary","RB","NYG"], // 279 · avg 297.33
  ["Mike Gesicki","TE","CIN"], // 280 · avg 299.33
  ["Kaleb Johnson","RB","PIT"], // 281 · avg 301.67
  ["Mack Hollins","WR","NE"], // 282 · avg 301.67
  ["Trevor Etienne","RB","CAR"], // 283 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 284 · avg 304.67
  ["Skyler Bell","WR","BUF"], // 285 · avg 306.67
  ["Jerome Ford","RB","WAS"], // 286 · avg 309.00
  ["Jake Tonges","TE","SF"], // 287 · avg 310.33
  ["Tahj Brooks","RB","CIN"], // 288 · avg 311.00
  ["Charlie Smyth","K","NO"], // 289 · avg 311.33
  ["Tez Johnson","WR","TB"], // 290 · avg 339.33 · adj -28
  ["Brandon Aiyuk","WR","SF"], // 291 · avg 311.67
  ["Darren Waller","TE","CAR"], // 292 · avg 312.33
  ["Isaac Guerendo","RB","SF"], // 293 · avg 312.33
  ["Andrei Iosivas","WR","CIN"], // 294 · avg 314.33
  ["Jarquez Hunter","RB","MIA"], // 295 · avg 314.33
  ["Audric Estime","RB","NO"], // 296 · avg 316.00
  ["Jaleel McLaughlin","RB","DEN"], // 297 · avg 316.33
  ["Tyreek Hill","WR","FA"], // 298 · avg 318.33
  ["Darnell Washington","TE","PIT"], // 299 · avg 318.67
  ["Oscar Delp","TE","NO"], // 300 · avg 319.67
  ["Will Shipley","RB","PHI"], // 301 · avg 320.00
  ["Michael Mayer","TE","LV"], // 302 · avg 322.00
  ["Jahan Dotson","WR","ATL"], // 303 · avg 322.33
  ["DeMario Douglas","WR","NE"], // 304 · avg 324.33
  ["Elijah Arroyo","TE","SEA"], // 305 · avg 326.00
  ["Charlie Kolar","TE","LAC"], // 306 · avg 328.00
  ["Jalen Tolbert","WR","MIA"], // 307 · avg 329.67
  ["Bryce Lance","WR","NO"], // 308 · avg 330.00
  ["Xavier Hutchinson","WR","HOU"], // 309 · avg 331.67
  ["Carson Beck","QB","ARI"], // 310 · avg 332.33
  ["Kareem Hunt","RB","FA"], // 311 · avg 332.33
  ["Cole Kmet","TE","CHI"], // 312 · avg 333.33
  ["Erick All Jr.","TE","CIN"], // 313 · avg 335.67
  ["J.J. McCarthy","QB","MIN"], // 314 · avg 337.33
  ["Tyler Higbee","TE","LAR"], // 315 · avg 337.67
  ["Konata Mumpfield","WR","LAR"], // 316 · avg 339.00
  ["Eli Raridon","TE","NE"], // 317 · avg 341.33
  ["Cedric Tillman","WR","FA"], // 318 · avg 341.67
  ["Joe Mixon","RB","FA"], // 319 · avg 342.00
  ["Dawson Knox","TE","BUF"], // 320 · avg 342.33
  ["Luke McCaffrey","WR","WAS"], // 321 · avg 343.33
  ["Jalen Royals","WR","KC"], // 322 · avg 346.33
  ["Olamide Zaccheaus","WR","ATL"], // 323 · avg 346.33
  ["Brenen Thompson","WR","LAC"], // 324 · avg 347.67
  ["Bam Knight","RB","ARI"], // 325 · avg 348.33
  ["Kendrick Bourne","WR","ARI"], // 326 · avg 348.33
  ["Max Klare","TE","LAR"], // 327 · avg 349.00
  ["Noah Gray","TE","KC"], // 328 · avg 350.00
  ["Mac Jones","QB","SF"], // 329 · avg 351.67
  ["Joshua Palmer","WR","BUF"], // 330 · avg 352.33
  ["Treylon Burks","WR","WAS"], // 331 · avg 356.67
  ["Eli Heidenreich","RB","PIT"], // 332 · avg 357.00
  ["Jake Elliott","K","PHI"], // 333 · avg 357.00
  ["Ja'Tavion Sanders","TE","CAR"], // 334 · avg 357.33
  ["Tyler Bass","K","BUF"], // 335 · avg 362.00
  ["Justin Fields","QB","KC"], // 336 · avg 364.00
  ["Michael Carter","RB","TEN"], // 337 · avg 366.00
  ["Malik Benson","WR","LV"], // 338 · avg 366.33
  ["Justin Joly","TE","DEN"], // 339 · avg 366.67
  ["Ty Simpson","QB","LAR"], // 340 · avg 366.67
  ["Jawhar Jordan","RB","HOU"], // 341 · avg 367.33
  ["Trey Smack","K","GB"], // 342 · avg 369.00
  ["Savion Williams","WR","GB"], // 343 · avg 371.33
  ["Jordan Whittington","WR","LAR"], // 344 · avg 399.33 · adj -28
  ["KaVontae Turpin","WR","DAL"], // 345 · avg 373.00
  ["Kalif Raymond","WR","CHI"], // 346 · avg 374.67
  ["Kevin Coleman Jr.","WR","MIA"], // 347 · avg 374.67
  ["Raheim Sanders","RB","CLE"], // 348 · avg 375.00
  ["Roman Wilson","WR","PIT"], // 349 · avg 375.00
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 376.67
];

