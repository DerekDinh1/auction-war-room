// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-31T19:50:56.168Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Jonathan Taylor","RB","IND"], // 5 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.67
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.67
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Drake London","WR","ATL"], // 11 · avg 13.67
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 16.00
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.33
  ["Brock Bowers","TE","LV"], // 17 · avg 18.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["George Pickens","WR","DAL"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.00
  ["Chris Olave","WR","NO"], // 22 · avg 21.33
  ["Omarion Hampton","RB","LAC"], // 23 · avg 21.33
  ["Trey McBride","TE","ARI"], // 24 · avg 22.33
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Josh Allen","QB","BUF"], // 26 · avg 25.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.33
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.00
  ["Rashee Rice","WR","KC"], // 29 · avg 29.67
  ["Tee Higgins","WR","CIN"], // 30 · avg 33.00
  ["Lamar Jackson","QB","BAL"], // 31 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Ladd McConkey","WR","LAC"], // 33 · avg 35.33
  ["Colston Loveland","TE","CHI"], // 34 · avg 36.33
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.33
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 36.67
  ["Tetairoa McMillan","WR","CAR"], // 37 · avg 37.00
  ["Drake Maye","QB","NE"], // 38 · avg 38.67
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.67
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 44.00
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.67
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.00 · adj +22
  ["Luther Burden III","WR","CHI"], // 46 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.67 · adj +12
  ["Jameson Williams","WR","DET"], // 48 · avg 49.67
  ["Emeka Egbuka","WR","TB"], // 49 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 50 · avg 41.00 · adj +12
  ["Christian Watson","WR","GB"], // 51 · avg 53.00
  ["Bucky Irving","RB","TB"], // 52 · avg 53.33
  ["Cam Skattebo","RB","NYG"], // 53 · avg 54.67
  ["Jayden Daniels","QB","WAS"], // 54 · avg 54.67
  ["DJ Moore","WR","BUF"], // 55 · avg 55.00
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.00
  ["David Montgomery","RB","HOU"], // 57 · avg 57.67
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.00
  ["Jalen Hurts","QB","PHI"], // 59 · avg 58.67
  ["Mike Evans","WR","SF"], // 60 · avg 61.00
  ["Bhayshul Tuten","RB","JAC"], // 61 · avg 61.33
  ["Jadarian Price","RB","SEA"], // 62 · avg 63.33
  ["Parker Washington","WR","JAC"], // 63 · avg 64.00
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["Tyler Warren","TE","IND"], // 65 · avg 54.67 · adj +12
  ["TreVeyon Henderson","RB","NE"], // 66 · avg 66.67
  ["Justin Herbert","QB","LAC"], // 67 · avg 68.33
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.33
  ["Rhamondre Stevenson","RB","NE"], // 69 · avg 68.67
  ["Carnell Tate","WR","TEN"], // 70 · avg 70.33
  ["Jaylen Warren","RB","PIT"], // 71 · avg 73.00
  ["Dak Prescott","QB","DAL"], // 72 · avg 73.67
  ["Trevor Lawrence","QB","JAC"], // 73 · avg 74.00
  ["Brian Thomas Jr.","WR","JAC"], // 74 · avg 75.33
  ["Tony Pollard","RB","TEN"], // 75 · avg 77.00
  ["DK Metcalf","WR","PIT"], // 76 · avg 77.33
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 80.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 81.00
  ["Jonathon Brooks","RB","CAR"], // 79 · avg 81.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.33 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.67
  ["Rico Dowdle","RB","PIT"], // 82 · avg 82.67
  ["Courtland Sutton","WR","DEN"], // 83 · avg 84.00
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.33
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 90.33
  ["MarShawn Lloyd","RB","GB"], // 86 · avg 90.67
  ["Sam LaPorta","TE","DET"], // 87 · avg 79.33 · adj +12
  ["Michael Wilson","WR","ARI"], // 88 · avg 91.33
  ["Alec Pierce","WR","IND"], // 89 · avg 92.33
  ["Brock Purdy","QB","SF"], // 90 · avg 92.67
  ["Blake Corum","RB","LAR"], // 91 · avg 94.00
  ["Bo Nix","QB","DEN"], // 92 · avg 95.00
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 96.33
  ["Jaxson Dart","QB","NYG"], // 94 · avg 97.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 100.67
  ["Jordan Mason","RB","MIN"], // 97 · avg 101.33
  ["Stefon Diggs","WR","WAS"], // 98 · avg 101.33
  ["Travis Kelce","TE","KC"], // 99 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 101.67
  ["Wan'Dale Robinson","WR","TEN"], // 101 · avg 102.00
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.67 · adj +12
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.00 · adj -28
  ["Jayden Reed","WR","GB"], // 104 · avg 103.33
  ["George Kittle","TE","SF"], // 105 · avg 91.67 · adj +12
  ["Jordan Addison","WR","MIN"], // 106 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 107 · avg 104.33
  ["Matthew Stafford","QB","LAR"], // 108 · avg 105.33
  ["Jared Goff","QB","DET"], // 109 · avg 105.67
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 106.00
  ["Josh Downs","WR","IND"], // 111 · avg 96.33 · adj +12
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.00
  ["Mike Washington Jr.","RB","LV"], // 113 · avg 150.00 · adj -38
  ["Jakobi Meyers","WR","JAC"], // 114 · avg 112.33
  ["Rachaad White","RB","WAS"], // 115 · avg 113.33
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.67
  ["Dallas Goedert","TE","PHI"], // 117 · avg 115.00
  ["Jordan Love","QB","GB"], // 118 · avg 117.33
  ["Isaiah Likely","TE","NYG"], // 119 · avg 117.67
  ["Aaron Jones Sr.","RB","MIN"], // 120 · avg 119.00
  ["Baker Mayfield","QB","TB"], // 121 · avg 119.67
  ["KC Concepcion","WR","CLE"], // 122 · avg 121.00
  ["Jake Ferguson","TE","DAL"], // 123 · avg 123.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 124.33
  ["Romeo Doubs","WR","NE"], // 125 · avg 124.67
  ["Xavier Worthy","WR","KC"], // 126 · avg 125.00
  ["Matthew Golden","WR","GB"], // 127 · avg 126.00
  ["Braelon Allen","RB","NYJ"], // 128 · avg 154.33 · adj -28
  ["Mark Andrews","TE","BAL"], // 129 · avg 126.67
  ["Tyler Shough","QB","NO"], // 130 · avg 127.67
  ["Jalen Coker","WR","CAR"], // 131 · avg 128.67
  ["Woody Marks","RB","HOU"], // 132 · avg 130.67
  ["Kyle Monangai","RB","CHI"], // 133 · avg 110.33 · adj +22
  ["De'Zhaun Stribling","WR","SF"], // 134 · avg 132.33
  ["Juwan Johnson","TE","NO"], // 135 · avg 133.00
  ["Khalil Shakir","WR","BUF"], // 136 · avg 133.00
  ["Malik Willis","QB","MIA"], // 137 · avg 133.67
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 137.33
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 139.00
  ["Josh Jacobs","RB","GB"], // 140 · avg 139.67
  ["Jalen McMillan","WR","TB"], // 141 · avg 167.67 · adj -28
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 140.00
  ["Tyjae Spears","RB","TEN"], // 143 · avg 140.00
  ["Sam Darnold","QB","SEA"], // 144 · avg 141.00
  ["Jonah Coleman","RB","DEN"], // 145 · avg 142.67
  ["C.J. Stroud","QB","HOU"], // 146 · avg 145.67
  ["Tank Bigsby","RB","PHI"], // 147 · avg 146.00
  ["Daniel Jones","QB","IND"], // 148 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.33
  ["Hunter Henry","TE","NE"], // 150 · avg 149.33
  ["Cam Ward","QB","TEN"], // 151 · avg 152.67
  ["Isiah Pacheco","RB","DET"], // 152 · avg 154.00
  ["Brenton Strange","TE","JAC"], // 153 · avg 154.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 154.33
  ["Denzel Boston","WR","CLE"], // 155 · avg 154.33
  ["Tre Tucker","WR","LV"], // 156 · avg 155.67
  ["Dalton Schultz","TE","HOU"], // 157 · avg 157.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 158 · avg 159.67
  ["Adonai Mitchell","WR","NYJ"], // 159 · avg 160.67
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 161.67
  ["Kayshon Boutte","WR","HOU"], // 161 · avg 164.00
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 167.33
  ["Bryce Young","QB","CAR"], // 163 · avg 169.33
  ["Jauan Jennings","WR","MIN"], // 164 · avg 170.00
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.00
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 173.67
  ["Ray Davis","RB","BUF"], // 167 · avg 173.67
  ["Terrance Ferguson","TE","LAR"], // 168 · avg 174.67
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 175.67
  ["Zach Charbonnet","RB","SEA"], // 170 · avg 143.67 · adj +35
  ["Emmett Johnson","RB","KC"], // 171 · avg 180.00
  ["Pat Bryant","WR","DEN"], // 172 · avg 181.33
  ["Jalen Nailor","WR","LV"], // 173 · avg 181.67
  ["Omar Cooper Jr.","WR","NYJ"], // 174 · avg 183.33
  ["Malik Washington","WR","MIA"], // 175 · avg 185.67
  ["AJ Barner","TE","SEA"], // 176 · avg 186.00
  ["Kimani Vidal","RB","LAC"], // 177 · avg 186.33
  ["Brandon Aubrey","K","DAL"], // 178 · avg 186.67
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 188.33
  ["Calvin Ridley","WR","TEN"], // 180 · avg 189.67
  ["Oronde Gadsden II","TE","LAC"], // 181 · avg 191.00
  ["Jacoby Brissett","QB","ARI"], // 182 · avg 191.67
  ["Keenan Allen","WR","IND"], // 183 · avg 192.00
  ["Cameron Dicker","K","LAC"], // 184 · avg 194.67
  ["Ka'imi Fairbairn","K","HOU"], // 185 · avg 196.67
  ["Kenyon Sadiq","TE","NYJ"], // 186 · avg 199.00
  ["Sean Tucker","RB","TB"], // 187 · avg 199.00
  ["Travis Hunter","WR","JAC"], // 188 · avg 200.33
  ["Cam Little","K","JAC"], // 189 · avg 200.67
  ["Nicholas Singleton","RB","TEN"], // 190 · avg 201.00
  ["Jason Myers","K","SEA"], // 191 · avg 202.67
  ["Jaylin Noel","WR","HOU"], // 192 · avg 203.33
  ["Alvin Kamara","RB","NO"], // 193 · avg 160.00 · adj +45
  ["James Conner","RB","ARI"], // 194 · avg 221.67 · adj -16
  ["Rashod Bateman","WR","BAL"], // 195 · avg 206.67
  ["Tyler Loop","K","BAL"], // 196 · avg 209.33
  ["Eddy Pineiro","K","SF"], // 197 · avg 209.67
  ["Gunnar Helm","TE","TEN"], // 198 · avg 210.33
  ["Aaron Rodgers","QB","PIT"], // 199 · avg 214.00
  ["Jake Bates","K","DET"], // 200 · avg 214.67
  ["Pat Freiermuth","TE","PIT"], // 201 · avg 216.00
  ["Cooper Kupp","WR","SEA"], // 202 · avg 219.33
  ["Isaac TeSlaa","WR","DET"], // 203 · avg 219.33
  ["Kaelon Black","RB","SF"], // 204 · avg 219.33
  ["Darnell Mooney","WR","NYG"], // 205 · avg 221.00
  ["Geno Smith","QB","NYJ"], // 206 · avg 221.00
  ["Jaylen Wright","RB","MIA"], // 207 · avg 223.00
  ["Evan McPherson","K","CIN"], // 208 · avg 223.33
  ["Cairo Santos","K","CHI"], // 209 · avg 223.67
  ["Harrison Mevis","K","LAR"], // 210 · avg 225.00
  ["Kaytron Allen","RB","WAS"], // 211 · avg 225.00
  ["Emanuel Wilson","RB","SEA"], // 212 · avg 227.67
  ["Kendre Miller","RB","NO"], // 213 · avg 277.67 · adj -50
  ["Tank Dell","WR","HOU"], // 214 · avg 229.33
  ["Cade Otton","TE","TB"], // 215 · avg 229.67
  ["Chase McLaughlin","K","TB"], // 216 · avg 230.67
  ["Ja'Kobi Lane","WR","BAL"], // 217 · avg 231.00
  ["George Holani","RB","SEA"], // 218 · avg 232.33
  ["Isaiah Davis","RB","NYJ"], // 219 · avg 262.00 · adj -28
  ["Troy Franklin","WR","DEN"], // 220 · avg 234.67
  ["Andy Borregales","K","NE"], // 221 · avg 235.00
  ["Zachariah Branch","WR","ATL"], // 222 · avg 235.67
  ["Najee Harris","RB","NYG"], // 223 · avg 236.67
  ["Malik Davis","RB","DAL"], // 224 · avg 237.67
  ["Jordyn Tyson","WR","NO"], // 225 · avg 138.67 · adj +100
  ["Germie Bernard","WR","PIT"], // 226 · avg 240.00
  ["Chris Bell","WR","MIA"], // 227 · avg 240.33
  ["Greg Dulcich","TE","MIA"], // 228 · avg 240.67
  ["Devin Neal","RB","NO"], // 229 · avg 291.00 · adj -50
  ["Malachi Fields","WR","NYG"], // 230 · avg 242.00
  ["David Njoku","TE","LAC"], // 231 · avg 243.33
  ["Justice Hill","RB","BAL"], // 232 · avg 243.33
  ["Caleb Douglas","WR","MIA"], // 233 · avg 246.33
  ["Antonio Williams","WR","WAS"], // 234 · avg 246.67
  ["Evan Engram","TE","DEN"], // 235 · avg 248.33
  ["Harrison Butker","K","KC"], // 236 · avg 248.67
  ["Devaughn Vele","WR","NO"], // 237 · avg 250.00
  ["Demond Claiborne","RB","MIN"], // 238 · avg 250.33
  ["Samaje Perine","RB","CIN"], // 239 · avg 251.00
  ["Chris Brooks","RB","GB"], // 240 · avg 252.33
  ["Chris Boswell","K","PIT"], // 241 · avg 255.33
  ["Ted Hurst III","WR","TB"], // 242 · avg 256.67
  ["Keon Coleman","WR","BUF"], // 243 · avg 245.00 · adj +12
  ["Jack Bech","WR","LV"], // 244 · avg 257.67
  ["Ollie Gordon II","RB","MIA"], // 245 · avg 257.67
  ["Fernando Mendoza","QB","LV"], // 246 · avg 259.33
  ["Jordan James","RB","SF"], // 247 · avg 259.67
  ["Colby Parkinson","TE","LAR"], // 248 · avg 261.00
  ["Chimere Dike","WR","TEN"], // 249 · avg 262.67
  ["Elic Ayomanor","WR","TEN"], // 250 · avg 263.00
  ["Ty Johnson","RB","BUF"], // 251 · avg 263.33
  ["Tyquan Thornton","WR","KC"], // 252 · avg 264.67
  ["Tory Horton","WR","SEA"], // 253 · avg 269.67
  ["Wil Lutz","K","DEN"], // 254 · avg 269.67
  ["Kaleb Johnson","RB","GB"], // 255 · avg 270.33
  ["Cyrus Allen","WR","KC"], // 256 · avg 271.33
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 271.67
  ["Jaydon Blue","RB","FA"], // 258 · avg 272.00
  ["Will Reichard","K","MIN"], // 259 · avg 272.00
  ["Darius Slayton","WR","NYG"], // 260 · avg 274.33
  ["Tua Tagovailoa","QB","ATL"], // 261 · avg 275.00
  ["Seth McGowan","RB","IND"], // 262 · avg 277.00
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.33
  ["Xavier Legette","WR","CAR"], // 264 · avg 278.33
  ["Christian Kirk","WR","SF"], // 265 · avg 279.33
  ["Theo Johnson","TE","NYG"], // 266 · avg 284.00
  ["Elijah Sarratt","WR","BAL"], // 267 · avg 284.67
  ["Marvin Mims Jr.","WR","DEN"], // 268 · avg 284.67
  ["DJ Giddens","RB","IND"], // 269 · avg 285.33
  ["Kirk Cousins","QB","LV"], // 270 · avg 285.67
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.33
  ["Adam Randall","RB","BAL"], // 272 · avg 290.00
  ["Eli Stowers","TE","PHI"], // 273 · avg 290.67
  ["Kyle Williams","WR","NE"], // 274 · avg 291.00
  ["Michael Penix Jr.","QB","ATL"], // 275 · avg 279.67 · adj +12
  ["Emari Demercado","RB","FA"], // 276 · avg 292.67
  ["Shedeur Sanders","QB","CLE"], // 277 · avg 293.00
  ["Brashard Smith","RB","KC"], // 278 · avg 294.67
  ["Devin Singletary","RB","NYG"], // 279 · avg 297.00
  ["Mike Gesicki","TE","CIN"], // 280 · avg 297.00
  ["Hollywood Brown","WR","PHI"], // 281 · avg 298.00
  ["Mack Hollins","WR","NE"], // 282 · avg 301.33
  ["Trevor Etienne","RB","CAR"], // 283 · avg 304.33
  ["Isaiah Bond","WR","CLE"], // 284 · avg 306.00
  ["Skyler Bell","WR","BUF"], // 285 · avg 307.67
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 308.67
  ["Jake Tonges","TE","SF"], // 287 · avg 308.67
  ["Darren Waller","TE","CAR"], // 288 · avg 310.67
  ["Andrei Iosivas","WR","CIN"], // 289 · avg 312.00
  ["Jerome Ford","RB","WAS"], // 290 · avg 312.00
  ["Tahj Brooks","RB","CIN"], // 291 · avg 313.00
  ["Tez Johnson","WR","TB"], // 292 · avg 341.00 · adj -28
  ["Charlie Smyth","K","NO"], // 293 · avg 314.00
  ["Audric Estime","RB","NO"], // 294 · avg 314.33
  ["Jarquez Hunter","RB","FA"], // 295 · avg 314.33
  ["Darnell Washington","TE","PIT"], // 296 · avg 315.33
  ["DeMario Douglas","WR","NE"], // 297 · avg 315.67
  ["Isaac Guerendo","RB","SF"], // 298 · avg 316.33
  ["Jaleel McLaughlin","RB","FA"], // 299 · avg 319.67
  ["Michael Mayer","TE","LV"], // 300 · avg 319.67
  ["Tyreek Hill","WR","FA"], // 301 · avg 320.67
  ["Jahan Dotson","WR","ATL"], // 302 · avg 322.67
  ["Will Shipley","RB","PHI"], // 303 · avg 323.33
  ["Charlie Kolar","TE","LAC"], // 304 · avg 323.67
  ["Oscar Delp","TE","NO"], // 305 · avg 324.67
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.67
  ["Xavier Hutchinson","WR","HOU"], // 307 · avg 328.00
  ["Bryce Lance","WR","NO"], // 308 · avg 329.33
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 331.00
  ["Carson Beck","QB","ARI"], // 310 · avg 333.33
  ["Cole Kmet","TE","CHI"], // 311 · avg 333.33
  ["Eli Raridon","TE","NE"], // 312 · avg 334.67
  ["Dawson Knox","TE","BUF"], // 313 · avg 335.67
  ["Kareem Hunt","RB","FA"], // 314 · avg 336.33
  ["Tyler Higbee","TE","LAR"], // 315 · avg 336.67
  ["Erick All Jr.","TE","CIN"], // 316 · avg 337.00
  ["Kendrick Bourne","WR","ARI"], // 317 · avg 340.00
  ["Luke McCaffrey","WR","WAS"], // 318 · avg 340.33
  ["Joe Mixon","RB","FA"], // 319 · avg 342.67
  ["Bam Knight","RB","ARI"], // 320 · avg 343.00
  ["Konata Mumpfield","WR","LAR"], // 321 · avg 343.33
  ["J.J. McCarthy","QB","MIN"], // 322 · avg 344.67
  ["Noah Gray","TE","KC"], // 323 · avg 346.00
  ["Cedric Tillman","WR","FA"], // 324 · avg 346.33
  ["Olamide Zaccheaus","WR","ATL"], // 325 · avg 346.33
  ["Joshua Palmer","WR","BUF"], // 326 · avg 348.67
  ["Jalen Royals","WR","KC"], // 327 · avg 351.00
  ["Brenen Thompson","WR","LAC"], // 328 · avg 352.33
  ["Treylon Burks","WR","WAS"], // 329 · avg 352.33
  ["Mac Jones","QB","SF"], // 330 · avg 352.67
  ["Max Klare","TE","LAR"], // 331 · avg 352.67
  ["Ja'Tavion Sanders","TE","CAR"], // 332 · avg 355.00
  ["Tyler Bass","K","BUF"], // 333 · avg 355.00
  ["Jake Elliott","K","PHI"], // 334 · avg 355.33
  ["Michael Carter","RB","FA"], // 335 · avg 359.67
  ["Eli Heidenreich","RB","PIT"], // 336 · avg 361.00
  ["Roman Wilson","WR","PIT"], // 337 · avg 362.33
  ["Justin Fields","QB","KC"], // 338 · avg 364.00
  ["Malik Benson","WR","LV"], // 339 · avg 364.67
  ["Ty Simpson","QB","LAR"], // 340 · avg 365.67
  ["KaVontae Turpin","WR","DAL"], // 341 · avg 367.00
  ["Jawhar Jordan","RB","FA"], // 342 · avg 368.33
  ["Kalif Raymond","WR","CHI"], // 343 · avg 371.33
  ["Savion Williams","WR","GB"], // 344 · avg 372.00
  ["Trey Smack","K","GB"], // 345 · avg 372.33
  ["Jordan Whittington","WR","LAR"], // 346 · avg 401.00 · adj -28
  ["Raheim Sanders","RB","CLE"], // 347 · avg 374.33
  ["Dont'e Thornton Jr.","WR","LV"], // 348 · avg 375.67
  ["Kevin Coleman Jr.","WR","MIA"], // 349 · avg 375.67
  ["Anthony Richardson Sr.","QB","IND"], // 350 · avg 376.00
];

