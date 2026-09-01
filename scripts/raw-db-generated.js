// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-01T17:38:57.056Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Jonathan Taylor","RB","IND"], // 5 · avg 8.00
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.67
  ["Christian McCaffrey","RB","SF"], // 7 · avg 9.00
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Drake London","WR","ATL"], // 11 · avg 13.67
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 15.67
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.00
  ["Brock Bowers","TE","LV"], // 17 · avg 18.67
  ["Davante Adams","WR","LAR"], // 18 · avg 47.00 · adj -28
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.33
  ["George Pickens","WR","DAL"], // 20 · avg 19.33
  ["Omarion Hampton","RB","LAC"], // 21 · avg 20.67
  ["Kenneth Walker III","RB","KC"], // 22 · avg 21.00
  ["Chris Olave","WR","NO"], // 23 · avg 21.67
  ["Trey McBride","TE","ARI"], // 24 · avg 21.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 26.67
  ["Rashee Rice","WR","KC"], // 29 · avg 30.00
  ["Lamar Jackson","QB","BAL"], // 30 · avg 32.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.67
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Ladd McConkey","WR","LAC"], // 33 · avg 35.67
  ["Javonte Williams","RB","DAL"], // 34 · avg 36.00
  ["Tetairoa McMillan","WR","CAR"], // 35 · avg 36.00
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 36.67
  ["Colston Loveland","TE","CHI"], // 37 · avg 37.33
  ["Drake Maye","QB","NE"], // 38 · avg 38.67
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.67
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.33
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.00 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.33 · adj +12
  ["Luther Burden III","WR","CHI"], // 47 · avg 49.33
  ["Jameson Williams","WR","DET"], // 48 · avg 50.00
  ["Emeka Egbuka","WR","TB"], // 49 · avg 40.00 · adj +12
  ["Bucky Irving","RB","TB"], // 50 · avg 52.33
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 41.67 · adj +12
  ["Christian Watson","WR","GB"], // 52 · avg 54.00
  ["Cam Skattebo","RB","NYG"], // 53 · avg 54.33
  ["DJ Moore","WR","BUF"], // 54 · avg 54.67
  ["Jayden Daniels","QB","WAS"], // 55 · avg 54.67
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 55.33
  ["David Montgomery","RB","HOU"], // 57 · avg 57.33
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.00
  ["Jalen Hurts","QB","PHI"], // 59 · avg 58.33
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.67
  ["Mike Evans","WR","SF"], // 61 · avg 61.67
  ["Jadarian Price","RB","SEA"], // 62 · avg 63.00
  ["Caleb Williams","QB","CHI"], // 63 · avg 64.67
  ["Parker Washington","WR","JAC"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.67
  ["Tyler Warren","TE","IND"], // 66 · avg 55.67 · adj +12
  ["Justin Herbert","QB","LAC"], // 67 · avg 68.33
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.67
  ["Rhamondre Stevenson","RB","NE"], // 69 · avg 69.00
  ["Carnell Tate","WR","TEN"], // 70 · avg 70.00
  ["Dak Prescott","QB","DAL"], // 71 · avg 72.67
  ["Jaylen Warren","RB","PIT"], // 72 · avg 72.67
  ["Trevor Lawrence","QB","JAC"], // 73 · avg 74.00
  ["Brian Thomas Jr.","WR","JAC"], // 74 · avg 76.67
  ["DK Metcalf","WR","PIT"], // 75 · avg 77.33
  ["Tony Pollard","RB","TEN"], // 76 · avg 77.67
  ["Chris Godwin Jr.","WR","TB"], // 77 · avg 79.00
  ["Tucker Kraft","TE","GB"], // 78 · avg 68.67 · adj +12
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.67
  ["Rico Dowdle","RB","PIT"], // 80 · avg 81.00
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.67
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 82.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.67
  ["Quentin Johnston","WR","LAC"], // 84 · avg 86.00
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.67
  ["Michael Wilson","WR","ARI"], // 86 · avg 91.00
  ["Alec Pierce","WR","IND"], // 87 · avg 91.67
  ["Brock Purdy","QB","SF"], // 88 · avg 92.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 80.67 · adj +12
  ["MarShawn Lloyd","RB","GB"], // 90 · avg 93.33
  ["Blake Corum","RB","LAR"], // 91 · avg 93.67
  ["Bo Nix","QB","DEN"], // 92 · avg 94.00
  ["Jaxson Dart","QB","NYG"], // 93 · avg 95.00
  ["Chuba Hubbard","RB","CAR"], // 94 · avg 95.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.33
  ["Wan'Dale Robinson","WR","TEN"], // 96 · avg 100.67
  ["Travis Kelce","TE","KC"], // 97 · avg 101.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 98 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 99 · avg 101.33
  ["Michael Pittman Jr.","WR","PIT"], // 100 · avg 90.00 · adj +12
  ["Tyler Allgeier","RB","ARI"], // 101 · avg 130.00 · adj -28
  ["Jordan Mason","RB","MIN"], // 102 · avg 103.00
  ["Jayden Reed","WR","GB"], // 103 · avg 103.33
  ["Jordan Addison","WR","MIN"], // 104 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 105 · avg 104.33
  ["Stefon Diggs","WR","WAS"], // 106 · avg 104.33
  ["George Kittle","TE","SF"], // 107 · avg 93.00 · adj +12
  ["Jared Goff","QB","DET"], // 108 · avg 105.00
  ["Matthew Stafford","QB","LAR"], // 109 · avg 106.00
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 106.33
  ["Mike Washington Jr.","RB","LV"], // 111 · avg 146.00 · adj -38
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.00
  ["Josh Downs","WR","IND"], // 113 · avg 98.33 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 111.33
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 112.67
  ["Kyler Murray","QB","MIN"], // 116 · avg 113.33
  ["Dallas Goedert","TE","PHI"], // 117 · avg 115.00
  ["Isaiah Likely","TE","NYG"], // 118 · avg 117.67
  ["KC Concepcion","WR","CLE"], // 119 · avg 118.00
  ["Aaron Jones Sr.","RB","MIN"], // 120 · avg 118.33
  ["Jordan Love","QB","GB"], // 121 · avg 118.33
  ["Baker Mayfield","QB","TB"], // 122 · avg 119.67
  ["Jake Ferguson","TE","DAL"], // 123 · avg 123.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 125.00
  ["Romeo Doubs","WR","NE"], // 125 · avg 125.00
  ["Xavier Worthy","WR","KC"], // 126 · avg 125.33
  ["Matthew Golden","WR","GB"], // 127 · avg 126.00
  ["Mark Andrews","TE","BAL"], // 128 · avg 126.33
  ["Tyler Shough","QB","NO"], // 129 · avg 128.00
  ["Jalen Coker","WR","CAR"], // 130 · avg 128.33
  ["Braelon Allen","RB","NYJ"], // 131 · avg 158.00 · adj -28
  ["De'Zhaun Stribling","WR","SF"], // 132 · avg 131.00
  ["Malik Willis","QB","MIA"], // 133 · avg 131.00
  ["Woody Marks","RB","HOU"], // 134 · avg 131.00
  ["Kyle Monangai","RB","CHI"], // 135 · avg 111.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 136 · avg 133.00
  ["Juwan Johnson","TE","NO"], // 137 · avg 133.33
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 138.33
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 138.67
  ["Sam Darnold","QB","SEA"], // 140 · avg 139.33
  ["Jalen McMillan","WR","TB"], // 141 · avg 167.33 · adj -28
  ["Jonah Coleman","RB","DEN"], // 142 · avg 140.67
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.33
  ["Josh Jacobs","RB","GB"], // 144 · avg 141.67
  ["Keaton Mitchell","RB","LAC"], // 145 · avg 144.00
  ["C.J. Stroud","QB","HOU"], // 146 · avg 144.67
  ["Daniel Jones","QB","IND"], // 147 · avg 147.67
  ["Tank Bigsby","RB","PHI"], // 148 · avg 149.00
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.33
  ["Hunter Henry","TE","NE"], // 150 · avg 150.00
  ["Cam Ward","QB","TEN"], // 151 · avg 152.33
  ["Denzel Boston","WR","CLE"], // 152 · avg 152.33
  ["Brenton Strange","TE","JAC"], // 153 · avg 153.00
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 154.33
  ["Tre Tucker","WR","LV"], // 155 · avg 156.00
  ["Dalton Schultz","TE","HOU"], // 156 · avg 158.33
  ["Isiah Pacheco","RB","DET"], // 157 · avg 158.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 158 · avg 159.67
  ["Adonai Mitchell","WR","NYJ"], // 159 · avg 160.33
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 161.00
  ["Kayshon Boutte","WR","HOU"], // 161 · avg 162.33
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 166.67
  ["Bryce Young","QB","CAR"], // 163 · avg 168.00
  ["Emmett Johnson","RB","KC"], // 164 · avg 172.00
  ["Jauan Jennings","WR","MIN"], // 165 · avg 172.67
  ["Tre' Harris","WR","LAC"], // 166 · avg 172.67
  ["Dontayvion Wicks","WR","PHI"], // 167 · avg 173.00
  ["Ray Davis","RB","BUF"], // 168 · avg 174.33
  ["Zach Charbonnet","RB","SEA"], // 169 · avg 141.33 · adj +35
  ["Omar Cooper Jr.","WR","NYJ"], // 170 · avg 177.33
  ["Ryan Flournoy","WR","DAL"], // 171 · avg 178.00
  ["Terrance Ferguson","TE","LAR"], // 172 · avg 179.33
  ["Jalen Nailor","WR","LV"], // 173 · avg 182.00
  ["Pat Bryant","WR","DEN"], // 174 · avg 183.00
  ["AJ Barner","TE","SEA"], // 175 · avg 185.33
  ["Malik Washington","WR","MIA"], // 176 · avg 185.33
  ["Kimani Vidal","RB","LAC"], // 177 · avg 187.00
  ["Brandon Aubrey","K","DAL"], // 178 · avg 188.33
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 188.67
  ["Jacoby Brissett","QB","ARI"], // 180 · avg 190.00
  ["Oronde Gadsden II","TE","LAC"], // 181 · avg 190.00
  ["Calvin Ridley","WR","TEN"], // 182 · avg 190.67
  ["Keenan Allen","WR","IND"], // 183 · avg 194.00
  ["Cameron Dicker","K","LAC"], // 184 · avg 194.33
  ["Ka'imi Fairbairn","K","HOU"], // 185 · avg 197.33
  ["Kenyon Sadiq","TE","NYJ"], // 186 · avg 197.33
  ["Nicholas Singleton","RB","TEN"], // 187 · avg 198.00
  ["Cam Little","K","JAC"], // 188 · avg 201.67
  ["Jaylin Noel","WR","HOU"], // 189 · avg 202.00
  ["Travis Hunter","WR","JAC"], // 190 · avg 202.00
  ["Jason Myers","K","SEA"], // 191 · avg 203.67
  ["Sean Tucker","RB","TB"], // 192 · avg 204.67
  ["Rashod Bateman","WR","BAL"], // 193 · avg 206.00
  ["Alvin Kamara","RB","NO"], // 194 · avg 161.33 · adj +45
  ["Aaron Rodgers","QB","PIT"], // 195 · avg 209.00
  ["James Conner","RB","ARI"], // 196 · avg 225.00 · adj -16
  ["Gunnar Helm","TE","TEN"], // 197 · avg 209.33
  ["Eddy Pineiro","K","SF"], // 198 · avg 210.33
  ["Tyler Loop","K","BAL"], // 199 · avg 211.33
  ["Kaelon Black","RB","SF"], // 200 · avg 213.33
  ["Pat Freiermuth","TE","PIT"], // 201 · avg 214.67
  ["Jake Bates","K","DET"], // 202 · avg 216.00
  ["Isaac TeSlaa","WR","DET"], // 203 · avg 217.00
  ["Kaytron Allen","RB","WAS"], // 204 · avg 219.33
  ["Cooper Kupp","WR","SEA"], // 205 · avg 220.67
  ["Geno Smith","QB","NYJ"], // 206 · avg 220.67
  ["Darnell Mooney","WR","NYG"], // 207 · avg 223.00
  ["Jaylen Wright","RB","MIA"], // 208 · avg 223.00
  ["Cairo Santos","K","CHI"], // 209 · avg 223.67
  ["Kendre Miller","RB","NO"], // 210 · avg 275.33 · adj -50
  ["Evan McPherson","K","CIN"], // 211 · avg 225.67
  ["Cade Otton","TE","TB"], // 212 · avg 226.00
  ["Harrison Mevis","K","LAR"], // 213 · avg 226.33
  ["Emanuel Wilson","RB","SEA"], // 214 · avg 227.67
  ["George Holani","RB","SEA"], // 215 · avg 230.00
  ["Ja'Kobi Lane","WR","BAL"], // 216 · avg 231.00
  ["Zachariah Branch","WR","ATL"], // 217 · avg 231.00
  ["Malik Davis","RB","DAL"], // 218 · avg 232.00
  ["Chase McLaughlin","K","TB"], // 219 · avg 232.67
  ["Najee Harris","RB","NYG"], // 220 · avg 232.67
  ["Troy Franklin","WR","DEN"], // 221 · avg 233.00
  ["Isaiah Davis","RB","NYJ"], // 222 · avg 262.33 · adj -28
  ["Tank Dell","WR","HOU"], // 223 · avg 235.33
  ["Andy Borregales","K","NE"], // 224 · avg 237.33
  ["Chris Bell","WR","MIA"], // 225 · avg 237.33
  ["Malachi Fields","WR","NYG"], // 226 · avg 238.00
  ["Germie Bernard","WR","PIT"], // 227 · avg 238.33
  ["Jordyn Tyson","WR","NO"], // 228 · avg 139.33 · adj +100
  ["Justice Hill","RB","BAL"], // 229 · avg 241.67
  ["David Njoku","TE","LAC"], // 230 · avg 242.00
  ["Antonio Williams","WR","WAS"], // 231 · avg 243.67
  ["Devin Neal","RB","NO"], // 232 · avg 295.67 · adj -50
  ["Demond Claiborne","RB","MIN"], // 233 · avg 247.00
  ["Chris Brooks","RB","GB"], // 234 · avg 248.33
  ["Evan Engram","TE","DEN"], // 235 · avg 248.33
  ["Harrison Butker","K","KC"], // 236 · avg 250.00
  ["Greg Dulcich","TE","MIA"], // 237 · avg 250.67
  ["Caleb Douglas","WR","MIA"], // 238 · avg 251.33
  ["Samaje Perine","RB","CIN"], // 239 · avg 253.33
  ["Devaughn Vele","WR","NO"], // 240 · avg 254.00
  ["Jack Bech","WR","LV"], // 241 · avg 254.33
  ["Chris Boswell","K","PIT"], // 242 · avg 255.00
  ["Ted Hurst III","WR","TB"], // 243 · avg 255.67
  ["Fernando Mendoza","QB","LV"], // 244 · avg 256.67
  ["Ollie Gordon II","RB","MIA"], // 245 · avg 258.67
  ["Colby Parkinson","TE","LAR"], // 246 · avg 259.33
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 260.33
  ["Jordan James","RB","SF"], // 248 · avg 260.33
  ["Keon Coleman","WR","BUF"], // 249 · avg 248.33 · adj +12
  ["Kaleb Johnson","RB","GB"], // 250 · avg 261.33
  ["Chimere Dike","WR","TEN"], // 251 · avg 264.00
  ["Ty Johnson","RB","BUF"], // 252 · avg 266.00
  ["Tyquan Thornton","WR","KC"], // 253 · avg 266.33
  ["LeQuint Allen Jr.","RB","JAC"], // 254 · avg 269.67
  ["Wil Lutz","K","DEN"], // 255 · avg 270.00
  ["Tory Horton","WR","SEA"], // 256 · avg 270.67
  ["Will Reichard","K","MIN"], // 257 · avg 271.33
  ["Cyrus Allen","WR","KC"], // 258 · avg 272.00
  ["Seth McGowan","RB","IND"], // 259 · avg 273.00
  ["Tua Tagovailoa","QB","ATL"], // 260 · avg 273.67
  ["Darius Slayton","WR","NYG"], // 261 · avg 276.00
  ["Mason Taylor","TE","NYJ"], // 262 · avg 277.33
  ["Christian Kirk","WR","SF"], // 263 · avg 279.33
  ["Xavier Legette","WR","CAR"], // 264 · avg 281.00
  ["Kirk Cousins","QB","LV"], // 265 · avg 281.33
  ["Elijah Sarratt","WR","BAL"], // 266 · avg 281.67
  ["DJ Giddens","RB","IND"], // 267 · avg 283.33
  ["Marvin Mims Jr.","WR","DEN"], // 268 · avg 283.33
  ["Jaydon Blue","RB","PHI"], // 269 · avg 283.67
  ["Theo Johnson","TE","NYG"], // 270 · avg 284.33
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.67
  ["Eli Stowers","TE","PHI"], // 272 · avg 288.67
  ["Adam Randall","RB","BAL"], // 273 · avg 289.33
  ["Shedeur Sanders","QB","CLE"], // 274 · avg 290.67
  ["Michael Penix Jr.","QB","ATL"], // 275 · avg 279.00 · adj +12
  ["Kyle Williams","WR","NE"], // 276 · avg 291.33
  ["Emari Demercado","RB","FA"], // 277 · avg 292.33
  ["Brashard Smith","RB","KC"], // 278 · avg 294.00
  ["Devin Singletary","RB","NYG"], // 279 · avg 294.67
  ["Hollywood Brown","WR","PHI"], // 280 · avg 297.33
  ["Mike Gesicki","TE","CIN"], // 281 · avg 299.33
  ["Mack Hollins","WR","NE"], // 282 · avg 300.00
  ["Isaiah Bond","WR","CLE"], // 283 · avg 304.67
  ["Trevor Etienne","RB","CAR"], // 284 · avg 305.00
  ["Skyler Bell","WR","BUF"], // 285 · avg 305.33
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 308.33
  ["Jake Tonges","TE","SF"], // 287 · avg 308.33
  ["Jerome Ford","RB","WAS"], // 288 · avg 310.67
  ["Darren Waller","TE","CAR"], // 289 · avg 311.67
  ["Tez Johnson","WR","TB"], // 290 · avg 339.67 · adj -28
  ["Jarquez Hunter","RB","FA"], // 291 · avg 312.67
  ["Andrei Iosivas","WR","CIN"], // 292 · avg 313.67
  ["Isaac Guerendo","RB","SF"], // 293 · avg 313.67
  ["Tahj Brooks","RB","CIN"], // 294 · avg 314.67
  ["Darnell Washington","TE","PIT"], // 295 · avg 315.00
  ["Audric Estime","RB","NO"], // 296 · avg 315.67
  ["DeMario Douglas","WR","NE"], // 297 · avg 316.33
  ["Charlie Smyth","K","FA"], // 298 · avg 318.00
  ["Jaleel McLaughlin","RB","FA"], // 299 · avg 319.00
  ["Tyreek Hill","WR","FA"], // 300 · avg 319.00
  ["Michael Mayer","TE","LV"], // 301 · avg 321.67
  ["Oscar Delp","TE","NO"], // 302 · avg 322.33
  ["Will Shipley","RB","PHI"], // 303 · avg 322.67
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.00
  ["Charlie Kolar","TE","LAC"], // 305 · avg 325.67
  ["Xavier Hutchinson","WR","HOU"], // 306 · avg 327.33
  ["Elijah Arroyo","TE","SEA"], // 307 · avg 328.33
  ["Bryce Lance","WR","NO"], // 308 · avg 329.33
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 331.00
  ["Carson Beck","QB","ARI"], // 310 · avg 331.67
  ["Kareem Hunt","RB","FA"], // 311 · avg 333.67
  ["Cole Kmet","TE","CHI"], // 312 · avg 334.00
  ["Eli Raridon","TE","NE"], // 313 · avg 334.33
  ["Dawson Knox","TE","BUF"], // 314 · avg 336.00
  ["Tyler Higbee","TE","LAR"], // 315 · avg 336.33
  ["Erick All Jr.","TE","CIN"], // 316 · avg 339.67
  ["Joe Mixon","RB","FA"], // 317 · avg 339.67
  ["Kendrick Bourne","WR","ARI"], // 318 · avg 341.00
  ["Konata Mumpfield","WR","LAR"], // 319 · avg 342.33
  ["J.J. McCarthy","QB","MIN"], // 320 · avg 344.00
  ["Luke McCaffrey","WR","WAS"], // 321 · avg 344.33
  ["Max Klare","TE","LAR"], // 322 · avg 345.67
  ["Brenen Thompson","WR","LAC"], // 323 · avg 347.67
  ["Jalen Royals","WR","KC"], // 324 · avg 347.67
  ["Noah Gray","TE","KC"], // 325 · avg 348.00
  ["Jake Elliott","K","PHI"], // 326 · avg 349.67
  ["Bam Knight","RB","ARI"], // 327 · avg 350.33
  ["Cedric Tillman","WR","FA"], // 328 · avg 350.67
  ["Joshua Palmer","WR","BUF"], // 329 · avg 351.67
  ["Olamide Zaccheaus","WR","ATL"], // 330 · avg 351.67
  ["Treylon Burks","WR","WAS"], // 331 · avg 355.33
  ["Ja'Tavion Sanders","TE","CAR"], // 332 · avg 355.67
  ["Tyler Bass","K","BUF"], // 333 · avg 355.67
  ["Mac Jones","QB","SF"], // 334 · avg 357.67
  ["Eli Heidenreich","RB","PIT"], // 335 · avg 362.33
  ["Malik Benson","WR","LV"], // 336 · avg 362.67
  ["Ty Simpson","QB","LAR"], // 337 · avg 362.67
  ["Justin Fields","QB","KC"], // 338 · avg 363.00
  ["Roman Wilson","WR","PIT"], // 339 · avg 364.33
  ["Michael Carter","RB","TEN"], // 340 · avg 367.00
  ["Kalif Raymond","WR","CHI"], // 341 · avg 370.33
  ["KaVontae Turpin","WR","DAL"], // 342 · avg 370.33
  ["Kevin Coleman Jr.","WR","MIA"], // 343 · avg 371.00
  ["Raheim Sanders","RB","CLE"], // 344 · avg 372.33
  ["Trey Smack","K","GB"], // 345 · avg 372.67
  ["Savion Williams","WR","GB"], // 346 · avg 373.33
  ["Zavion Thomas","WR","CHI"], // 347 · avg 373.33
  ["Justin Joly","TE","FA"], // 348 · avg 374.00
  ["J'Mari Taylor","RB","FA"], // 349 · avg 374.33
  ["Jordan Whittington","WR","LAR"], // 350 · avg 403.00 · adj -28
];

