// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-26T21:10:28.542Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 5 · avg 8.33
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.67
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.00
  ["James Cook III","RB","BUF"], // 9 · avg 10.67
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Drake London","WR","ATL"], // 11 · avg 13.00
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Nico Collins","WR","HOU"], // 13 · avg 14.67
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 18.00
  ["Davante Adams","WR","LAR"], // 18 · avg 47.00 · adj -28
  ["De'Von Achane","RB","MIA"], // 19 · avg 19.33
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Chris Olave","WR","NO"], // 21 · avg 21.00
  ["Trey McBride","TE","ARI"], // 22 · avg 22.00
  ["Derrick Henry","RB","BAL"], // 23 · avg 23.00
  ["Kenneth Walker III","RB","KC"], // 24 · avg 23.00
  ["Omarion Hampton","RB","LAC"], // 25 · avg 23.00
  ["Josh Allen","QB","BUF"], // 26 · avg 25.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.67
  ["Rashee Rice","WR","KC"], // 28 · avg 26.33
  ["DeVonta Smith","WR","PHI"], // 29 · avg 27.33
  ["Zay Flowers","WR","BAL"], // 30 · avg 30.33
  ["Lamar Jackson","QB","BAL"], // 31 · avg 31.67
  ["Tee Higgins","WR","CIN"], // 32 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 33 · avg 34.33
  ["Tetairoa McMillan","WR","CAR"], // 34 · avg 36.00
  ["Javonte Williams","RB","DAL"], // 35 · avg 37.00
  ["Ladd McConkey","WR","LAC"], // 36 · avg 37.33
  ["Jaylen Waddle","WR","DEN"], // 37 · avg 37.67
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 38.00
  ["Colston Loveland","TE","CHI"], // 39 · avg 38.67
  ["Drake Maye","QB","NE"], // 40 · avg 38.67
  ["Josh Jacobs","RB","GB"], // 41 · avg 40.00
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.67
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 45 · avg 25.33 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.67 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 49 · avg 39.67 · adj +12
  ["Luther Burden III","WR","CHI"], // 50 · avg 52.00
  ["Jayden Daniels","QB","WAS"], // 51 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 52 · avg 54.33
  ["Jeremiyah Love","RB","ARI"], // 53 · avg 43.00 · adj +12
  ["Tyler Warren","TE","IND"], // 54 · avg 55.33
  ["Christian Watson","WR","GB"], // 55 · avg 56.00
  ["DJ Moore","WR","BUF"], // 56 · avg 56.00
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.67
  ["Bucky Irving","RB","TB"], // 58 · avg 57.33
  ["Jalen Hurts","QB","PHI"], // 59 · avg 57.33
  ["David Montgomery","RB","HOU"], // 60 · avg 58.00
  ["Mike Evans","WR","SF"], // 61 · avg 58.33
  ["Rome Odunze","WR","CHI"], // 62 · avg 58.67
  ["Bhayshul Tuten","RB","JAC"], // 63 · avg 63.33
  ["Parker Washington","WR","JAC"], // 64 · avg 66.00
  ["Caleb Williams","QB","CHI"], // 65 · avg 66.33
  ["Jadarian Price","RB","SEA"], // 66 · avg 66.33
  ["TreVeyon Henderson","RB","NE"], // 67 · avg 66.67
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Tucker Kraft","TE","GB"], // 70 · avg 69.67
  ["Carnell Tate","WR","TEN"], // 71 · avg 70.67
  ["Rhamondre Stevenson","RB","NE"], // 72 · avg 71.67
  ["Trevor Lawrence","QB","JAC"], // 73 · avg 73.67
  ["Jaylen Warren","RB","PIT"], // 74 · avg 74.00
  ["Dak Prescott","QB","DAL"], // 75 · avg 75.67
  ["Brian Thomas Jr.","WR","JAC"], // 76 · avg 76.33
  ["DK Metcalf","WR","PIT"], // 77 · avg 77.33
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 78.67
  ["Tony Pollard","RB","TEN"], // 79 · avg 78.67
  ["Chris Godwin Jr.","WR","TB"], // 80 · avg 81.33
  ["Courtland Sutton","WR","DEN"], // 81 · avg 83.00
  ["Rico Dowdle","RB","PIT"], // 82 · avg 83.00
  ["Kyle Pitts Sr.","TE","ATL"], // 83 · avg 83.67
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.00
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.33
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.33
  ["Brock Purdy","QB","SF"], // 87 · avg 91.33
  ["Michael Wilson","WR","ARI"], // 88 · avg 91.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 81.00 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 90 · avg 93.33
  ["Jaxson Dart","QB","NYG"], // 91 · avg 94.00
  ["Alec Pierce","WR","IND"], // 92 · avg 94.67
  ["Blake Corum","RB","LAR"], // 93 · avg 96.00
  ["Josh Downs","WR","IND"], // 94 · avg 96.00
  ["Bo Nix","QB","DEN"], // 95 · avg 98.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 100.00
  ["RJ Harvey","RB","DEN"], // 97 · avg 100.00
  ["Travis Kelce","TE","KC"], // 98 · avg 100.33
  ["Patrick Mahomes II","QB","KC"], // 99 · avg 100.67
  ["Wan'Dale Robinson","WR","TEN"], // 100 · avg 102.00
  ["Tyler Allgeier","RB","ARI"], // 101 · avg 130.33 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.67 · adj +12
  ["Jordan Addison","WR","MIN"], // 103 · avg 102.67
  ["Matthew Stafford","QB","LAR"], // 104 · avg 104.67
  ["Jayden Reed","WR","GB"], // 105 · avg 105.00
  ["Jordan Mason","RB","MIN"], // 106 · avg 105.00
  ["Stefon Diggs","WR","WAS"], // 107 · avg 105.33
  ["George Kittle","TE","SF"], // 108 · avg 93.67 · adj +12
  ["Kenny Gainwell","RB","TB"], // 109 · avg 106.33
  ["Jared Goff","QB","DET"], // 110 · avg 107.33
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 108.33
  ["Jakobi Meyers","WR","JAC"], // 112 · avg 109.33
  ["Makai Lemon","WR","PHI"], // 113 · avg 109.67
  ["Rachaad White","RB","WAS"], // 114 · avg 111.00
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.67
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.00
  ["Isaiah Likely","TE","NYG"], // 118 · avg 119.00
  ["Baker Mayfield","QB","TB"], // 119 · avg 119.33
  ["Jordan Love","QB","GB"], // 120 · avg 121.00
  ["KC Concepcion","WR","CLE"], // 121 · avg 122.00
  ["Mike Washington Jr.","RB","LV"], // 122 · avg 161.00 · adj -38
  ["Mark Andrews","TE","BAL"], // 123 · avg 123.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 123.67
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.00
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.33
  ["Tyler Shough","QB","NO"], // 127 · avg 125.67
  ["Jake Ferguson","TE","DAL"], // 128 · avg 126.33
  ["Matthew Golden","WR","GB"], // 129 · avg 126.67
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.67
  ["Kyle Monangai","RB","CHI"], // 131 · avg 108.33 · adj +22
  ["Woody Marks","RB","HOU"], // 132 · avg 130.67
  ["Braelon Allen","RB","NYJ"], // 133 · avg 158.67 · adj -28
  ["Khalil Shakir","WR","BUF"], // 134 · avg 131.00
  ["Malik Willis","QB","MIA"], // 135 · avg 132.00
  ["Juwan Johnson","TE","NO"], // 136 · avg 135.33
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.67 · adj -28
  ["Sam Darnold","QB","SEA"], // 138 · avg 138.33
  ["De'Zhaun Stribling","WR","SF"], // 139 · avg 138.67
  ["Deebo Samuel Sr.","WR","SF"], // 140 · avg 139.00
  ["Tyjae Spears","RB","TEN"], // 141 · avg 140.00
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 141.00
  ["Rashid Shaheed","WR","SEA"], // 143 · avg 141.33
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.67
  ["Jonah Coleman","RB","DEN"], // 145 · avg 144.67
  ["Tank Bigsby","RB","PHI"], // 146 · avg 145.67
  ["Daniel Jones","QB","IND"], // 147 · avg 147.00
  ["Hunter Henry","TE","NE"], // 148 · avg 148.00
  ["Brenton Strange","TE","JAC"], // 149 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 150 · avg 150.00
  ["Isiah Pacheco","RB","DET"], // 151 · avg 150.00
  ["Tyrone Tracy Jr.","RB","NYG"], // 152 · avg 151.00
  ["Cam Ward","QB","TEN"], // 153 · avg 151.33
  ["Denzel Boston","WR","CLE"], // 154 · avg 151.67
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 152.33
  ["Brian Robinson Jr.","RB","ATL"], // 156 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 158.00
  ["Dalton Schultz","TE","HOU"], // 158 · avg 158.67
  ["Tre Tucker","WR","LV"], // 159 · avg 158.67
  ["Jauan Jennings","WR","MIN"], // 160 · avg 161.67
  ["MarShawn Lloyd","RB","GB"], // 161 · avg 162.00
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 162.33
  ["Bryce Young","QB","CAR"], // 163 · avg 168.00
  ["Tre' Harris","WR","LAC"], // 164 · avg 171.00
  ["Kayshon Boutte","WR","HOU"], // 165 · avg 172.00
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 174.33
  ["Emmett Johnson","RB","KC"], // 167 · avg 175.33
  ["Omar Cooper Jr.","WR","NYJ"], // 168 · avg 178.00
  ["Zach Charbonnet","RB","SEA"], // 169 · avg 143.33 · adj +35
  ["Jalen Nailor","WR","LV"], // 170 · avg 178.67
  ["Ray Davis","RB","BUF"], // 171 · avg 179.00
  ["AJ Barner","TE","SEA"], // 172 · avg 179.67
  ["Ryan Flournoy","WR","DAL"], // 173 · avg 181.00
  ["T.J. Hockenson","TE","MIN"], // 174 · avg 183.00
  ["Terrance Ferguson","TE","LAR"], // 175 · avg 183.67
  ["Pat Bryant","WR","DEN"], // 176 · avg 184.33
  ["Jacoby Brissett","QB","ARI"], // 177 · avg 184.67
  ["Oronde Gadsden II","TE","LAC"], // 178 · avg 184.67
  ["James Conner","RB","ARI"], // 179 · avg 213.33 · adj -28
  ["Calvin Ridley","WR","TEN"], // 180 · avg 185.67
  ["Kimani Vidal","RB","LAC"], // 181 · avg 186.00
  ["Malik Washington","WR","MIA"], // 182 · avg 186.67
  ["Travis Hunter","WR","JAC"], // 183 · avg 189.33
  ["Brandon Aubrey","K","DAL"], // 184 · avg 191.00
  ["Sean Tucker","RB","TB"], // 185 · avg 191.00
  ["Keenan Allen","WR","IND"], // 186 · avg 193.33
  ["Nicholas Singleton","RB","TEN"], // 187 · avg 194.33
  ["Cameron Dicker","K","LAC"], // 188 · avg 197.67
  ["Tank Dell","WR","HOU"], // 189 · avg 198.33
  ["Jaylin Noel","WR","HOU"], // 190 · avg 199.00
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 199.67
  ["Alvin Kamara","RB","NO"], // 192 · avg 155.33 · adj +45
  ["Ka'imi Fairbairn","K","HOU"], // 193 · avg 200.67
  ["Cam Little","K","JAC"], // 194 · avg 204.33
  ["Gunnar Helm","TE","TEN"], // 195 · avg 206.00
  ["Jason Myers","K","SEA"], // 196 · avg 208.33
  ["Jaydon Blue","RB","DAL"], // 197 · avg 209.00
  ["Rashod Bateman","WR","BAL"], // 198 · avg 209.67
  ["Geno Smith","QB","NYJ"], // 199 · avg 210.00
  ["Isaac TeSlaa","WR","DET"], // 200 · avg 211.33
  ["Kaytron Allen","RB","WAS"], // 201 · avg 211.67
  ["Aaron Rodgers","QB","PIT"], // 202 · avg 212.33
  ["Pat Freiermuth","TE","PIT"], // 203 · avg 213.67
  ["Emanuel Wilson","RB","SEA"], // 204 · avg 214.33
  ["Tyler Loop","K","BAL"], // 205 · avg 214.67
  ["Eddy Pineiro","K","SF"], // 206 · avg 215.00
  ["Darnell Mooney","WR","NYG"], // 207 · avg 218.00
  ["Troy Franklin","WR","DEN"], // 208 · avg 220.00
  ["Cade Otton","TE","TB"], // 209 · avg 221.67
  ["Jake Bates","K","DET"], // 210 · avg 222.00
  ["Cooper Kupp","WR","SEA"], // 211 · avg 222.67
  ["Cairo Santos","K","CHI"], // 212 · avg 224.67
  ["Jaylen Wright","RB","MIA"], // 213 · avg 227.00
  ["Isaiah Davis","RB","NYJ"], // 214 · avg 256.67 · adj -28
  ["George Holani","RB","SEA"], // 215 · avg 229.00
  ["Germie Bernard","WR","PIT"], // 216 · avg 230.33
  ["Evan McPherson","K","CIN"], // 217 · avg 232.00
  ["Jordyn Tyson","WR","NO"], // 218 · avg 132.67 · adj +100
  ["Harrison Mevis","K","LAR"], // 219 · avg 232.67
  ["Kaelon Black","RB","SF"], // 220 · avg 233.33
  ["Devin Neal","RB","NO"], // 221 · avg 284.67 · adj -50
  ["Andy Borregales","K","NE"], // 222 · avg 235.33
  ["Zachariah Branch","WR","ATL"], // 223 · avg 235.33
  ["Chase McLaughlin","K","TB"], // 224 · avg 236.67
  ["David Njoku","TE","LAC"], // 225 · avg 237.33
  ["Kendre Miller","RB","NO"], // 226 · avg 288.67 · adj -50
  ["Evan Engram","TE","DEN"], // 227 · avg 241.00
  ["Ja'Kobi Lane","WR","BAL"], // 228 · avg 242.00
  ["Justice Hill","RB","BAL"], // 229 · avg 242.67
  ["Antonio Williams","WR","WAS"], // 230 · avg 244.33
  ["Keon Coleman","WR","BUF"], // 231 · avg 244.33
  ["Malachi Fields","WR","NYG"], // 232 · avg 246.67
  ["Ollie Gordon II","RB","MIA"], // 233 · avg 247.00
  ["Devaughn Vele","WR","NO"], // 234 · avg 247.67
  ["Fernando Mendoza","QB","LV"], // 235 · avg 248.67
  ["Jack Bech","WR","LV"], // 236 · avg 249.33
  ["Demond Claiborne","RB","MIN"], // 237 · avg 250.33
  ["Colby Parkinson","TE","LAR"], // 238 · avg 251.00
  ["Greg Dulcich","TE","MIA"], // 239 · avg 251.33
  ["Harrison Butker","K","KC"], // 240 · avg 252.67
  ["Chris Boswell","K","PIT"], // 241 · avg 254.00
  ["Ted Hurst III","WR","TB"], // 242 · avg 256.00
  ["Chimere Dike","WR","TEN"], // 243 · avg 256.33
  ["Najee Harris","RB","NYG"], // 244 · avg 257.00
  ["Jordan James","RB","SF"], // 245 · avg 257.33
  ["Elic Ayomanor","WR","TEN"], // 246 · avg 257.67
  ["Samaje Perine","RB","CIN"], // 247 · avg 259.00
  ["Tua Tagovailoa","QB","ATL"], // 248 · avg 260.67
  ["Chris Brooks","RB","GB"], // 249 · avg 261.33
  ["Tory Horton","WR","SEA"], // 250 · avg 261.67
  ["Tyquan Thornton","WR","KC"], // 251 · avg 263.00
  ["Ty Johnson","RB","BUF"], // 252 · avg 264.00
  ["Caleb Douglas","WR","MIA"], // 253 · avg 264.67
  ["Chris Bell","WR","MIA"], // 254 · avg 264.67
  ["Wil Lutz","K","DEN"], // 255 · avg 271.33
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 272.33
  ["Malik Davis","RB","DAL"], // 257 · avg 272.67
  ["Christian Kirk","WR","SF"], // 258 · avg 273.67
  ["Will Reichard","K","MIN"], // 259 · avg 273.67
  ["Darius Slayton","WR","NYG"], // 260 · avg 274.33
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 275.33
  ["Michael Penix Jr.","QB","ATL"], // 262 · avg 277.33
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.00
  ["DJ Giddens","RB","IND"], // 264 · avg 278.33
  ["Seth McGowan","RB","IND"], // 265 · avg 279.00
  ["Theo Johnson","TE","NYG"], // 266 · avg 279.00
  ["Xavier Legette","WR","CAR"], // 267 · avg 279.67
  ["Cyrus Allen","WR","KC"], // 268 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 269 · avg 280.67
  ["Marvin Mims Jr.","WR","DEN"], // 270 · avg 282.67
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.00
  ["Eli Stowers","TE","PHI"], // 272 · avg 286.33
  ["Shedeur Sanders","QB","CLE"], // 273 · avg 287.00
  ["Adam Randall","RB","BAL"], // 274 · avg 292.33
  ["Emari Demercado","RB","KC"], // 275 · avg 292.33
  ["Brashard Smith","RB","KC"], // 276 · avg 294.33
  ["Kyle Williams","WR","NE"], // 277 · avg 296.67
  ["Devin Singletary","RB","NYG"], // 278 · avg 297.00
  ["Mike Gesicki","TE","CIN"], // 279 · avg 297.00
  ["Trey Benson","RB","ARI"], // 280 · avg 297.67
  ["Hollywood Brown","WR","PHI"], // 281 · avg 298.00
  ["Mack Hollins","WR","NE"], // 282 · avg 302.00
  ["Kaleb Johnson","RB","PIT"], // 283 · avg 302.67
  ["Trevor Etienne","RB","CAR"], // 284 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 285 · avg 304.33
  ["Skyler Bell","WR","BUF"], // 286 · avg 306.33
  ["Jerome Ford","RB","WAS"], // 287 · avg 308.33
  ["Brandon Aiyuk","WR","SF"], // 288 · avg 308.67
  ["Isaac Guerendo","RB","SF"], // 289 · avg 310.33
  ["Charlie Smyth","K","NO"], // 290 · avg 310.67
  ["Darren Waller","TE","CAR"], // 291 · avg 312.00
  ["Tahj Brooks","RB","CIN"], // 292 · avg 312.00
  ["Andrei Iosivas","WR","CIN"], // 293 · avg 313.00
  ["Jake Tonges","TE","SF"], // 294 · avg 313.33
  ["Jarquez Hunter","RB","LAR"], // 295 · avg 314.33
  ["Tez Johnson","WR","TB"], // 296 · avg 344.00 · adj -28
  ["Audric Estime","RB","NO"], // 297 · avg 316.33
  ["Jaleel McLaughlin","RB","DEN"], // 298 · avg 316.33
  ["Tyreek Hill","WR","FA"], // 299 · avg 318.00
  ["Oscar Delp","TE","NO"], // 300 · avg 318.33
  ["Darnell Washington","TE","PIT"], // 301 · avg 318.67
  ["Will Shipley","RB","PHI"], // 302 · avg 320.00
  ["Michael Mayer","TE","LV"], // 303 · avg 322.33
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.67
  ["DeMario Douglas","WR","NE"], // 305 · avg 325.00
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.00
  ["Charlie Kolar","TE","LAC"], // 307 · avg 328.67
  ["Bryce Lance","WR","NO"], // 308 · avg 329.00
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 330.00
  ["Kareem Hunt","RB","FA"], // 310 · avg 331.33
  ["Xavier Hutchinson","WR","HOU"], // 311 · avg 331.67
  ["Carson Beck","QB","ARI"], // 312 · avg 332.67
  ["J.J. McCarthy","QB","MIN"], // 313 · avg 334.33
  ["Cole Kmet","TE","CHI"], // 314 · avg 334.67
  ["Erick All Jr.","TE","CIN"], // 315 · avg 335.67
  ["Tyler Higbee","TE","LAR"], // 316 · avg 337.33
  ["Konata Mumpfield","WR","LAR"], // 317 · avg 337.67
  ["Cedric Tillman","WR","CLE"], // 318 · avg 339.67
  ["Eli Raridon","TE","NE"], // 319 · avg 341.00
  ["Joe Mixon","RB","FA"], // 320 · avg 343.33
  ["Luke McCaffrey","WR","WAS"], // 321 · avg 344.00
  ["Dawson Knox","TE","BUF"], // 322 · avg 344.67
  ["Jalen Royals","WR","KC"], // 323 · avg 344.67
  ["Olamide Zaccheaus","WR","ATL"], // 324 · avg 346.33
  ["Max Klare","TE","LAR"], // 325 · avg 348.33
  ["Kendrick Bourne","WR","ARI"], // 326 · avg 349.00
  ["Brenen Thompson","WR","LAC"], // 327 · avg 349.67
  ["Noah Gray","TE","KC"], // 328 · avg 349.67
  ["Bam Knight","RB","ARI"], // 329 · avg 350.33
  ["Mac Jones","QB","SF"], // 330 · avg 351.67
  ["Joshua Palmer","WR","BUF"], // 331 · avg 353.33
  ["Jake Elliott","K","PHI"], // 332 · avg 354.67
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 357.33
  ["Eli Heidenreich","RB","PIT"], // 334 · avg 358.00
  ["Treylon Burks","WR","WAS"], // 335 · avg 358.67
  ["Justin Fields","QB","KC"], // 336 · avg 363.00
  ["Tyler Bass","K","BUF"], // 337 · avg 364.67
  ["Justin Joly","TE","DEN"], // 338 · avg 365.67
  ["Ty Simpson","QB","LAR"], // 339 · avg 365.67
  ["Malik Benson","WR","LV"], // 340 · avg 367.67
  ["Jawhar Jordan","RB","HOU"], // 341 · avg 368.33
  ["Michael Carter","RB","TEN"], // 342 · avg 368.33
  ["Trey Smack","K","GB"], // 343 · avg 371.00
  ["KaVontae Turpin","WR","DAL"], // 344 · avg 372.00
  ["Kevin Coleman Jr.","WR","MIA"], // 345 · avg 372.00
  ["Jordan Whittington","WR","LAR"], // 346 · avg 400.67 · adj -28
  ["Kalif Raymond","WR","CHI"], // 347 · avg 373.00
  ["Savion Williams","WR","GB"], // 348 · avg 373.33
  ["Roman Wilson","WR","PIT"], // 349 · avg 374.67
  ["Dont'e Thornton Jr.","WR","LV"], // 350 · avg 376.33
];

