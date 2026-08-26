// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-26T21:34:49.709Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["CeeDee Lamb","WR","DAL"], // 5 · avg 8.00
  ["Jonathan Taylor","RB","IND"], // 6 · avg 8.33
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.67
  ["Justin Jefferson","WR","MIN"], // 8 · avg 10.00
  ["James Cook III","RB","BUF"], // 9 · avg 11.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Drake London","WR","ATL"], // 11 · avg 13.00
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Nico Collins","WR","HOU"], // 13 · avg 14.67
  ["Chase Brown","RB","CIN"], // 14 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 15 · avg 3.67 · adj +12
  ["Brock Bowers","TE","LV"], // 16 · avg 17.00
  ["Saquon Barkley","RB","PHI"], // 17 · avg 18.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.00
  ["Davante Adams","WR","LAR"], // 19 · avg 47.00 · adj -28
  ["George Pickens","WR","DAL"], // 20 · avg 19.67
  ["Chris Olave","WR","NO"], // 21 · avg 21.33
  ["Trey McBride","TE","ARI"], // 22 · avg 22.00
  ["Derrick Henry","RB","BAL"], // 23 · avg 23.00
  ["Kenneth Walker III","RB","KC"], // 24 · avg 23.00
  ["Omarion Hampton","RB","LAC"], // 25 · avg 23.00
  ["Josh Allen","QB","BUF"], // 26 · avg 25.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.67
  ["Rashee Rice","WR","KC"], // 28 · avg 26.33
  ["DeVonta Smith","WR","PHI"], // 29 · avg 27.33
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.67
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Tetairoa McMillan","WR","CAR"], // 33 · avg 36.00
  ["Javonte Williams","RB","DAL"], // 34 · avg 37.00
  ["Ladd McConkey","WR","LAC"], // 35 · avg 37.33
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 37.67
  ["Garrett Wilson","WR","NYJ"], // 37 · avg 38.00
  ["Drake Maye","QB","NE"], // 38 · avg 38.67
  ["Colston Loveland","TE","CHI"], // 39 · avg 39.00
  ["Josh Jacobs","RB","GB"], // 40 · avg 40.33
  ["Zay Flowers","WR","BAL"], // 41 · avg 30.33 · adj +12
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["Travis Etienne Jr.","RB","NO"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.00
  ["Ashton Jeanty","RB","LV"], // 45 · avg 25.33 · adj +22
  ["Breece Hall","RB","NYJ"], // 46 · avg 37.67 · adj +12
  ["D'Andre Swift","RB","CHI"], // 47 · avg 50.00
  ["Jameson Williams","WR","DET"], // 48 · avg 51.00
  ["Emeka Egbuka","WR","TB"], // 49 · avg 39.67 · adj +12
  ["Luther Burden III","WR","CHI"], // 50 · avg 52.00
  ["Jayden Daniels","QB","WAS"], // 51 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 52 · avg 54.00
  ["Jeremiyah Love","RB","ARI"], // 53 · avg 42.67 · adj +12
  ["Christian Watson","WR","GB"], // 54 · avg 56.00
  ["DJ Moore","WR","BUF"], // 55 · avg 56.00
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.67
  ["Bucky Irving","RB","TB"], // 57 · avg 57.33
  ["Jalen Hurts","QB","PHI"], // 58 · avg 57.67
  ["David Montgomery","RB","HOU"], // 59 · avg 58.00
  ["Mike Evans","WR","SF"], // 60 · avg 58.33
  ["Rome Odunze","WR","CHI"], // 61 · avg 58.67
  ["Bhayshul Tuten","RB","JAC"], // 62 · avg 64.00
  ["Caleb Williams","QB","CHI"], // 63 · avg 66.00
  ["Parker Washington","WR","JAC"], // 64 · avg 66.00
  ["Jadarian Price","RB","SEA"], // 65 · avg 66.33
  ["TreVeyon Henderson","RB","NE"], // 66 · avg 66.67
  ["Tyler Warren","TE","IND"], // 67 · avg 55.33 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 69 · avg 69.33
  ["Carnell Tate","WR","TEN"], // 70 · avg 70.33
  ["Rhamondre Stevenson","RB","NE"], // 71 · avg 71.67
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 73.67
  ["Jaylen Warren","RB","PIT"], // 73 · avg 74.33
  ["Dak Prescott","QB","DAL"], // 74 · avg 75.67
  ["Brian Thomas Jr.","WR","JAC"], // 75 · avg 76.33
  ["DK Metcalf","WR","PIT"], // 76 · avg 77.00
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 78.67
  ["Tony Pollard","RB","TEN"], // 78 · avg 78.67
  ["Chris Godwin Jr.","WR","TB"], // 79 · avg 81.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 70.33 · adj +12
  ["Courtland Sutton","WR","DEN"], // 81 · avg 83.00
  ["Kyle Pitts Sr.","TE","ATL"], // 82 · avg 83.00
  ["Rico Dowdle","RB","PIT"], // 83 · avg 83.00
  ["Jonathon Brooks","RB","CAR"], // 84 · avg 85.33
  ["Quentin Johnston","WR","LAC"], // 85 · avg 87.33
  ["J.K. Dobbins","RB","DEN"], // 86 · avg 88.67
  ["Brock Purdy","QB","SF"], // 87 · avg 91.33
  ["Michael Wilson","WR","ARI"], // 88 · avg 91.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 81.00 · adj +12
  ["Chuba Hubbard","RB","CAR"], // 90 · avg 93.00
  ["Jaxson Dart","QB","NYG"], // 91 · avg 94.00
  ["Alec Pierce","WR","IND"], // 92 · avg 94.67
  ["Blake Corum","RB","LAR"], // 93 · avg 96.00
  ["Bo Nix","QB","DEN"], // 94 · avg 98.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 95 · avg 100.00
  ["RJ Harvey","RB","DEN"], // 96 · avg 100.00
  ["Travis Kelce","TE","KC"], // 97 · avg 100.33
  ["Patrick Mahomes II","QB","KC"], // 98 · avg 100.67
  ["Wan'Dale Robinson","WR","TEN"], // 99 · avg 102.00
  ["Tyler Allgeier","RB","ARI"], // 100 · avg 130.67 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 90.67 · adj +12
  ["Jordan Addison","WR","MIN"], // 102 · avg 102.67
  ["Matthew Stafford","QB","LAR"], // 103 · avg 104.67
  ["Jayden Reed","WR","GB"], // 104 · avg 105.00
  ["Jordan Mason","RB","MIN"], // 105 · avg 105.33
  ["Stefon Diggs","WR","WAS"], // 106 · avg 105.33
  ["George Kittle","TE","SF"], // 107 · avg 93.67 · adj +12
  ["Kenny Gainwell","RB","TB"], // 108 · avg 106.00
  ["Jared Goff","QB","DET"], // 109 · avg 107.33
  ["Josh Downs","WR","IND"], // 110 · avg 96.00 · adj +12
  ["Dalton Kincaid","TE","BUF"], // 111 · avg 108.67
  ["Jakobi Meyers","WR","JAC"], // 112 · avg 109.33
  ["Makai Lemon","WR","PHI"], // 113 · avg 109.67
  ["Rachaad White","RB","WAS"], // 114 · avg 111.00
  ["Dallas Goedert","TE","PHI"], // 115 · avg 113.67
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.00
  ["Aaron Jones Sr.","RB","MIN"], // 117 · avg 116.00
  ["Isaiah Likely","TE","NYG"], // 118 · avg 118.67
  ["Baker Mayfield","QB","TB"], // 119 · avg 119.67
  ["Jordan Love","QB","GB"], // 120 · avg 120.67
  ["KC Concepcion","WR","CLE"], // 121 · avg 122.00
  ["Mike Washington Jr.","RB","LV"], // 122 · avg 161.00 · adj -38
  ["Chris Rodriguez Jr.","RB","JAC"], // 123 · avg 123.67
  ["Mark Andrews","TE","BAL"], // 124 · avg 123.67
  ["Xavier Worthy","WR","KC"], // 125 · avg 124.33
  ["Romeo Doubs","WR","NE"], // 126 · avg 125.33
  ["Tyler Shough","QB","NO"], // 127 · avg 125.67
  ["Jake Ferguson","TE","DAL"], // 128 · avg 126.33
  ["Matthew Golden","WR","GB"], // 129 · avg 126.33
  ["Jalen Coker","WR","CAR"], // 130 · avg 127.67
  ["Kyle Monangai","RB","CHI"], // 131 · avg 108.33 · adj +22
  ["Woody Marks","RB","HOU"], // 132 · avg 130.67
  ["Braelon Allen","RB","NYJ"], // 133 · avg 158.67 · adj -28
  ["Khalil Shakir","WR","BUF"], // 134 · avg 131.33
  ["Malik Willis","QB","MIA"], // 135 · avg 132.00
  ["Juwan Johnson","TE","NO"], // 136 · avg 135.33
  ["Jalen McMillan","WR","TB"], // 137 · avg 164.67 · adj -28
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 138.33
  ["Sam Darnold","QB","SEA"], // 139 · avg 138.33
  ["De'Zhaun Stribling","WR","SF"], // 140 · avg 138.67
  ["Tyjae Spears","RB","TEN"], // 141 · avg 139.33
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 141.00
  ["Rashid Shaheed","WR","SEA"], // 143 · avg 141.67
  ["C.J. Stroud","QB","HOU"], // 144 · avg 142.67
  ["Jonah Coleman","RB","DEN"], // 145 · avg 144.67
  ["Tank Bigsby","RB","PHI"], // 146 · avg 145.67
  ["Daniel Jones","QB","IND"], // 147 · avg 147.33
  ["Hunter Henry","TE","NE"], // 148 · avg 147.67
  ["Brenton Strange","TE","JAC"], // 149 · avg 148.67
  ["Dylan Sampson","RB","CLE"], // 150 · avg 149.67
  ["Tyrone Tracy Jr.","RB","NYG"], // 151 · avg 150.67
  ["Isiah Pacheco","RB","DET"], // 152 · avg 151.00
  ["Cam Ward","QB","TEN"], // 153 · avg 151.33
  ["Denzel Boston","WR","CLE"], // 154 · avg 151.33
  ["Chig Okonkwo","TE","WAS"], // 155 · avg 152.00
  ["Brian Robinson Jr.","RB","ATL"], // 156 · avg 157.67
  ["Adonai Mitchell","WR","NYJ"], // 157 · avg 158.33
  ["Dalton Schultz","TE","HOU"], // 158 · avg 158.33
  ["Tre Tucker","WR","LV"], // 159 · avg 158.67
  ["Jauan Jennings","WR","MIN"], // 160 · avg 161.67
  ["MarShawn Lloyd","RB","GB"], // 161 · avg 162.00
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 162.67
  ["Bryce Young","QB","CAR"], // 163 · avg 167.67
  ["Tre' Harris","WR","LAC"], // 164 · avg 171.00
  ["Kayshon Boutte","WR","HOU"], // 165 · avg 171.67
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 174.00
  ["Emmett Johnson","RB","KC"], // 167 · avg 175.33
  ["Jalen Nailor","WR","LV"], // 168 · avg 178.33
  ["Omar Cooper Jr.","WR","NYJ"], // 169 · avg 178.33
  ["Zach Charbonnet","RB","SEA"], // 170 · avg 143.67 · adj +35
  ["AJ Barner","TE","SEA"], // 171 · avg 179.00
  ["Ray Davis","RB","BUF"], // 172 · avg 179.00
  ["Ryan Flournoy","WR","DAL"], // 173 · avg 181.67
  ["T.J. Hockenson","TE","MIN"], // 174 · avg 183.33
  ["Terrance Ferguson","TE","LAR"], // 175 · avg 183.33
  ["Oronde Gadsden II","TE","LAC"], // 176 · avg 184.33
  ["Pat Bryant","WR","DEN"], // 177 · avg 184.33
  ["Jacoby Brissett","QB","ARI"], // 178 · avg 184.67
  ["Kimani Vidal","RB","LAC"], // 179 · avg 186.00
  ["Calvin Ridley","WR","TEN"], // 180 · avg 186.33
  ["Malik Washington","WR","MIA"], // 181 · avg 186.67
  ["Travis Hunter","WR","JAC"], // 182 · avg 189.33
  ["Sean Tucker","RB","TB"], // 183 · avg 191.00
  ["Brandon Aubrey","K","DAL"], // 184 · avg 191.33
  ["Keenan Allen","WR","IND"], // 185 · avg 193.00
  ["Nicholas Singleton","RB","TEN"], // 186 · avg 194.67
  ["James Conner","RB","ARI"], // 187 · avg 213.67 · adj -16
  ["Cameron Dicker","K","LAC"], // 188 · avg 198.00
  ["Tank Dell","WR","HOU"], // 189 · avg 198.33
  ["Jaylin Noel","WR","HOU"], // 190 · avg 199.33
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 199.67
  ["Ka'imi Fairbairn","K","HOU"], // 192 · avg 200.67
  ["Alvin Kamara","RB","NO"], // 193 · avg 156.00 · adj +45
  ["Cam Little","K","JAC"], // 194 · avg 204.33
  ["Gunnar Helm","TE","TEN"], // 195 · avg 206.00
  ["Jason Myers","K","SEA"], // 196 · avg 208.00
  ["Jaydon Blue","RB","DAL"], // 197 · avg 209.00
  ["Rashod Bateman","WR","BAL"], // 198 · avg 209.33
  ["Geno Smith","QB","NYJ"], // 199 · avg 210.00
  ["Kaytron Allen","RB","WAS"], // 200 · avg 211.33
  ["Aaron Rodgers","QB","PIT"], // 201 · avg 212.33
  ["Isaac TeSlaa","WR","DET"], // 202 · avg 212.33
  ["Pat Freiermuth","TE","PIT"], // 203 · avg 213.33
  ["Tyler Loop","K","BAL"], // 204 · avg 214.67
  ["Emanuel Wilson","RB","SEA"], // 205 · avg 215.00
  ["Eddy Pineiro","K","SF"], // 206 · avg 215.33
  ["Darnell Mooney","WR","NYG"], // 207 · avg 218.33
  ["Troy Franklin","WR","DEN"], // 208 · avg 220.00
  ["Cade Otton","TE","TB"], // 209 · avg 221.67
  ["Jake Bates","K","DET"], // 210 · avg 221.67
  ["Cooper Kupp","WR","SEA"], // 211 · avg 222.67
  ["Cairo Santos","K","CHI"], // 212 · avg 224.67
  ["Jaylen Wright","RB","MIA"], // 213 · avg 227.00
  ["Isaiah Davis","RB","NYJ"], // 214 · avg 256.33 · adj -28
  ["George Holani","RB","SEA"], // 215 · avg 228.67
  ["Germie Bernard","WR","PIT"], // 216 · avg 230.33
  ["Evan McPherson","K","CIN"], // 217 · avg 232.00
  ["Jordyn Tyson","WR","NO"], // 218 · avg 132.67 · adj +100
  ["Kaelon Black","RB","SF"], // 219 · avg 232.67
  ["Harrison Mevis","K","LAR"], // 220 · avg 233.67
  ["Zachariah Branch","WR","ATL"], // 221 · avg 234.67
  ["Andy Borregales","K","NE"], // 222 · avg 235.00
  ["Devin Neal","RB","NO"], // 223 · avg 285.00 · adj -50
  ["Chase McLaughlin","K","TB"], // 224 · avg 236.00
  ["David Njoku","TE","LAC"], // 225 · avg 237.67
  ["Kendre Miller","RB","NO"], // 226 · avg 289.00 · adj -50
  ["Evan Engram","TE","DEN"], // 227 · avg 241.33
  ["Ja'Kobi Lane","WR","BAL"], // 228 · avg 242.00
  ["Justice Hill","RB","BAL"], // 229 · avg 244.00
  ["Antonio Williams","WR","WAS"], // 230 · avg 244.33
  ["Ollie Gordon II","RB","MIA"], // 231 · avg 247.33
  ["Devaughn Vele","WR","NO"], // 232 · avg 247.67
  ["Malachi Fields","WR","NYG"], // 233 · avg 247.67
  ["Fernando Mendoza","QB","LV"], // 234 · avg 249.00
  ["Jack Bech","WR","LV"], // 235 · avg 249.67
  ["Demond Claiborne","RB","MIN"], // 236 · avg 250.00
  ["Colby Parkinson","TE","LAR"], // 237 · avg 250.33
  ["Greg Dulcich","TE","MIA"], // 238 · avg 251.33
  ["Harrison Butker","K","KC"], // 239 · avg 252.33
  ["Chris Boswell","K","PIT"], // 240 · avg 254.33
  ["Ted Hurst III","WR","TB"], // 241 · avg 255.67
  ["Jordan James","RB","SF"], // 242 · avg 256.33
  ["Keon Coleman","WR","BUF"], // 243 · avg 244.33 · adj +12
  ["Elic Ayomanor","WR","TEN"], // 244 · avg 257.00
  ["Chimere Dike","WR","TEN"], // 245 · avg 257.33
  ["Najee Harris","RB","NYG"], // 246 · avg 257.33
  ["Samaje Perine","RB","CIN"], // 247 · avg 259.00
  ["Chris Brooks","RB","GB"], // 248 · avg 261.33
  ["Tory Horton","WR","SEA"], // 249 · avg 261.33
  ["Tua Tagovailoa","QB","ATL"], // 250 · avg 261.33
  ["Caleb Douglas","WR","MIA"], // 251 · avg 262.67
  ["Tyquan Thornton","WR","KC"], // 252 · avg 263.67
  ["Chris Bell","WR","MIA"], // 253 · avg 264.33
  ["Ty Johnson","RB","BUF"], // 254 · avg 264.33
  ["Wil Lutz","K","DEN"], // 255 · avg 271.67
  ["LeQuint Allen Jr.","RB","JAC"], // 256 · avg 272.33
  ["Malik Davis","RB","DAL"], // 257 · avg 272.67
  ["Christian Kirk","WR","SF"], // 258 · avg 273.67
  ["Will Reichard","K","MIN"], // 259 · avg 273.67
  ["Darius Slayton","WR","NYG"], // 260 · avg 274.00
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 275.33
  ["Mason Taylor","TE","NYJ"], // 262 · avg 278.33
  ["DJ Giddens","RB","IND"], // 263 · avg 278.67
  ["Theo Johnson","TE","NYG"], // 264 · avg 278.67
  ["Seth McGowan","RB","IND"], // 265 · avg 279.67
  ["Xavier Legette","WR","CAR"], // 266 · avg 279.67
  ["Cyrus Allen","WR","KC"], // 267 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 268 · avg 281.00
  ["Marvin Mims Jr.","WR","DEN"], // 269 · avg 282.67
  ["Eli Stowers","TE","PHI"], // 270 · avg 285.67
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.00
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 286.33
  ["Michael Penix Jr.","QB","ATL"], // 273 · avg 277.67 · adj +12
  ["Adam Randall","RB","BAL"], // 274 · avg 292.00
  ["Emari Demercado","RB","KC"], // 275 · avg 292.00
  ["Brashard Smith","RB","KC"], // 276 · avg 294.33
  ["Kyle Williams","WR","NE"], // 277 · avg 296.00
  ["Devin Singletary","RB","NYG"], // 278 · avg 297.00
  ["Hollywood Brown","WR","PHI"], // 279 · avg 297.67
  ["Mike Gesicki","TE","CIN"], // 280 · avg 297.67
  ["Mack Hollins","WR","NE"], // 281 · avg 301.67
  ["Trevor Etienne","RB","CAR"], // 282 · avg 302.33
  ["Kaleb Johnson","RB","PIT"], // 283 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 284 · avg 304.00
  ["Skyler Bell","WR","BUF"], // 285 · avg 306.33
  ["Jerome Ford","RB","WAS"], // 286 · avg 308.67
  ["Brandon Aiyuk","WR","SF"], // 287 · avg 309.00
  ["Isaac Guerendo","RB","SF"], // 288 · avg 310.67
  ["Charlie Smyth","K","NO"], // 289 · avg 311.00
  ["Tahj Brooks","RB","CIN"], // 290 · avg 311.33
  ["Andrei Iosivas","WR","CIN"], // 291 · avg 312.33
  ["Jake Tonges","TE","SF"], // 292 · avg 312.33
  ["Darren Waller","TE","CAR"], // 293 · avg 313.00
  ["Jarquez Hunter","RB","LAR"], // 294 · avg 314.33
  ["Tez Johnson","WR","TB"], // 295 · avg 343.00 · adj -28
  ["Audric Estime","RB","NO"], // 296 · avg 316.00
  ["Jaleel McLaughlin","RB","DEN"], // 297 · avg 316.00
  ["Tyreek Hill","WR","FA"], // 298 · avg 317.67
  ["Darnell Washington","TE","PIT"], // 299 · avg 319.33
  ["Oscar Delp","TE","NO"], // 300 · avg 319.33
  ["Will Shipley","RB","PHI"], // 301 · avg 320.00
  ["Michael Mayer","TE","LV"], // 302 · avg 322.67
  ["Jahan Dotson","WR","ATL"], // 303 · avg 324.33
  ["DeMario Douglas","WR","NE"], // 304 · avg 325.00
  ["Elijah Arroyo","TE","SEA"], // 305 · avg 327.00
  ["Charlie Kolar","TE","LAC"], // 306 · avg 329.33
  ["Jalen Tolbert","WR","MIA"], // 307 · avg 329.33
  ["Bryce Lance","WR","NO"], // 308 · avg 329.67
  ["Kareem Hunt","RB","FA"], // 309 · avg 331.33
  ["Xavier Hutchinson","WR","HOU"], // 310 · avg 331.33
  ["Carson Beck","QB","ARI"], // 311 · avg 332.00
  ["J.J. McCarthy","QB","MIN"], // 312 · avg 333.33
  ["Cole Kmet","TE","CHI"], // 313 · avg 335.33
  ["Erick All Jr.","TE","CIN"], // 314 · avg 336.33
  ["Konata Mumpfield","WR","LAR"], // 315 · avg 337.67
  ["Tyler Higbee","TE","LAR"], // 316 · avg 337.67
  ["Cedric Tillman","WR","CLE"], // 317 · avg 339.33
  ["Eli Raridon","TE","NE"], // 318 · avg 341.00
  ["Luke McCaffrey","WR","WAS"], // 319 · avg 343.00
  ["Joe Mixon","RB","FA"], // 320 · avg 343.33
  ["Jalen Royals","WR","KC"], // 321 · avg 344.00
  ["Dawson Knox","TE","BUF"], // 322 · avg 345.67
  ["Olamide Zaccheaus","WR","ATL"], // 323 · avg 345.67
  ["Brenen Thompson","WR","LAC"], // 324 · avg 349.00
  ["Max Klare","TE","LAR"], // 325 · avg 349.00
  ["Bam Knight","RB","ARI"], // 326 · avg 349.67
  ["Kendrick Bourne","WR","ARI"], // 327 · avg 349.67
  ["Noah Gray","TE","KC"], // 328 · avg 349.67
  ["Mac Jones","QB","SF"], // 329 · avg 351.33
  ["Joshua Palmer","WR","BUF"], // 330 · avg 352.33
  ["Jake Elliott","K","PHI"], // 331 · avg 355.00
  ["Ja'Tavion Sanders","TE","CAR"], // 332 · avg 357.33
  ["Eli Heidenreich","RB","PIT"], // 333 · avg 358.33
  ["Treylon Burks","WR","WAS"], // 334 · avg 358.67
  ["Justin Fields","QB","KC"], // 335 · avg 363.00
  ["Ty Simpson","QB","LAR"], // 336 · avg 365.33
  ["Tyler Bass","K","BUF"], // 337 · avg 365.33
  ["Justin Joly","TE","DEN"], // 338 · avg 366.00
  ["Michael Carter","RB","TEN"], // 339 · avg 366.67
  ["Jawhar Jordan","RB","HOU"], // 340 · avg 367.67
  ["Malik Benson","WR","LV"], // 341 · avg 368.00
  ["Savion Williams","WR","GB"], // 342 · avg 371.33
  ["Trey Smack","K","GB"], // 343 · avg 371.33
  ["Kevin Coleman Jr.","WR","MIA"], // 344 · avg 372.67
  ["Jordan Whittington","WR","LAR"], // 345 · avg 400.67 · adj -28
  ["KaVontae Turpin","WR","DAL"], // 346 · avg 373.67
  ["Dont'e Thornton Jr.","WR","LV"], // 347 · avg 374.00
  ["Kalif Raymond","WR","CHI"], // 348 · avg 374.67
  ["Roman Wilson","WR","PIT"], // 349 · avg 376.00
  ["Raheim Sanders","RB","CLE"], // 350 · avg 376.33
];

