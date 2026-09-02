// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-09-02T17:38:47.316Z · 350 players · ordered by adjusted consensus rank
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
  ["A.J. Brown","WR","NE"], // 10 · avg 12.67
  ["Drake London","WR","ATL"], // 11 · avg 13.67
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Nico Collins","WR","HOU"], // 13 · avg 15.00
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Chase Brown","RB","CIN"], // 15 · avg 15.67
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.00
  ["De'Von Achane","RB","MIA"], // 17 · avg 18.67
  ["Brock Bowers","TE","LV"], // 18 · avg 19.00
  ["George Pickens","WR","DAL"], // 19 · avg 19.33
  ["Davante Adams","WR","LAR"], // 20 · avg 47.33 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 21.00
  ["Chris Olave","WR","NO"], // 22 · avg 21.33
  ["Omarion Hampton","RB","LAC"], // 23 · avg 21.67
  ["Trey McBride","TE","ARI"], // 24 · avg 21.67
  ["Derrick Henry","RB","BAL"], // 25 · avg 23.67
  ["Malik Nabers","WR","NYG"], // 26 · avg 25.00
  ["Josh Allen","QB","BUF"], // 27 · avg 25.67
  ["DeVonta Smith","WR","PHI"], // 28 · avg 26.67
  ["Rashee Rice","WR","KC"], // 29 · avg 30.00
  ["Lamar Jackson","QB","BAL"], // 30 · avg 31.33
  ["Tee Higgins","WR","CIN"], // 31 · avg 33.67
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.00
  ["Jaylen Waddle","WR","DEN"], // 33 · avg 35.67
  ["Javonte Williams","RB","DAL"], // 34 · avg 36.00
  ["Tetairoa McMillan","WR","CAR"], // 35 · avg 36.00
  ["Colston Loveland","TE","CHI"], // 36 · avg 37.33
  ["Ladd McConkey","WR","LAC"], // 37 · avg 37.33
  ["Drake Maye","QB","NE"], // 38 · avg 39.00
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 39.00
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.67 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 43.33
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.33
  ["D'Andre Swift","RB","CHI"], // 43 · avg 47.00
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.33
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.33 · adj +22
  ["Jameson Williams","WR","DET"], // 46 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.33 · adj +12
  ["Luther Burden III","WR","CHI"], // 48 · avg 49.67
  ["Emeka Egbuka","WR","TB"], // 49 · avg 40.00 · adj +12
  ["Bucky Irving","RB","TB"], // 50 · avg 53.00
  ["Jeremiyah Love","RB","ARI"], // 51 · avg 41.67 · adj +12
  ["Christian Watson","WR","GB"], // 52 · avg 53.67
  ["Cam Skattebo","RB","NYG"], // 53 · avg 55.00
  ["DJ Moore","WR","BUF"], // 54 · avg 55.00
  ["Jayden Daniels","QB","WAS"], // 55 · avg 55.00
  ["David Montgomery","RB","HOU"], // 56 · avg 56.33
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 56.33
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.00
  ["Jalen Hurts","QB","PHI"], // 59 · avg 59.00
  ["Bhayshul Tuten","RB","JAC"], // 60 · avg 61.67
  ["Jadarian Price","RB","SEA"], // 61 · avg 61.67
  ["Mike Evans","WR","SF"], // 62 · avg 61.67
  ["Parker Washington","WR","JAC"], // 63 · avg 63.67
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["TreVeyon Henderson","RB","NE"], // 65 · avg 66.33
  ["Tyler Warren","TE","IND"], // 66 · avg 55.67 · adj +12
  ["Marvin Harrison Jr.","WR","ARI"], // 67 · avg 68.67
  ["Justin Herbert","QB","LAC"], // 68 · avg 69.00
  ["Rhamondre Stevenson","RB","NE"], // 69 · avg 69.00
  ["Carnell Tate","WR","TEN"], // 70 · avg 70.00
  ["Jaylen Warren","RB","PIT"], // 71 · avg 72.33
  ["Trevor Lawrence","QB","JAC"], // 72 · avg 72.67
  ["Dak Prescott","QB","DAL"], // 73 · avg 73.67
  ["Brian Thomas Jr.","WR","JAC"], // 74 · avg 76.67
  ["DK Metcalf","WR","PIT"], // 75 · avg 77.33
  ["Tony Pollard","RB","TEN"], // 76 · avg 77.33
  ["Chris Godwin Jr.","WR","TB"], // 77 · avg 79.00
  ["Harold Fannin Jr.","TE","CLE"], // 78 · avg 79.67
  ["Tucker Kraft","TE","GB"], // 79 · avg 68.00 · adj +12
  ["Rico Dowdle","RB","PIT"], // 80 · avg 81.33
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 82.00
  ["Jonathon Brooks","RB","CAR"], // 82 · avg 83.00
  ["Courtland Sutton","WR","DEN"], // 83 · avg 83.67
  ["Quentin Johnston","WR","LAC"], // 84 · avg 86.33
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 89.00
  ["Alec Pierce","WR","IND"], // 86 · avg 91.00
  ["Michael Wilson","WR","ARI"], // 87 · avg 91.00
  ["Brock Purdy","QB","SF"], // 88 · avg 92.33
  ["Sam LaPorta","TE","DET"], // 89 · avg 81.00 · adj +12
  ["Blake Corum","RB","LAR"], // 90 · avg 93.67
  ["MarShawn Lloyd","RB","GB"], // 91 · avg 93.67
  ["Jaxson Dart","QB","NYG"], // 92 · avg 94.00
  ["Bo Nix","QB","DEN"], // 93 · avg 95.33
  ["Chuba Hubbard","RB","CAR"], // 94 · avg 96.33
  ["RJ Harvey","RB","DEN"], // 95 · avg 98.67
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 97 · avg 101.33
  ["Travis Kelce","TE","KC"], // 98 · avg 101.67
  ["Jordan Mason","RB","MIN"], // 99 · avg 102.33
  ["Tyler Allgeier","RB","ARI"], // 100 · avg 130.67 · adj -28
  ["Michael Pittman Jr.","WR","PIT"], // 101 · avg 90.67 · adj +12
  ["Jayden Reed","WR","GB"], // 102 · avg 102.67
  ["Stefon Diggs","WR","WAS"], // 103 · avg 102.67
  ["Wan'Dale Robinson","WR","TEN"], // 104 · avg 102.67
  ["Mike Washington Jr.","RB","LV"], // 105 · avg 142.33 · adj -38
  ["Jared Goff","QB","DET"], // 106 · avg 104.67
  ["Jordan Addison","WR","MIN"], // 107 · avg 104.67
  ["Kenny Gainwell","RB","TB"], // 108 · avg 105.00
  ["George Kittle","TE","SF"], // 109 · avg 93.33 · adj +12
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 105.67
  ["Matthew Stafford","QB","LAR"], // 111 · avg 106.00
  ["Makai Lemon","WR","PHI"], // 112 · avg 108.00
  ["Josh Downs","WR","IND"], // 113 · avg 98.67 · adj +12
  ["Rachaad White","RB","WAS"], // 114 · avg 111.67
  ["Jakobi Meyers","WR","JAC"], // 115 · avg 113.00
  ["Isaiah Likely","TE","NYG"], // 116 · avg 114.33
  ["Kyler Murray","QB","MIN"], // 117 · avg 114.67
  ["Dallas Goedert","TE","PHI"], // 118 · avg 116.33
  ["KC Concepcion","WR","CLE"], // 119 · avg 117.67
  ["Jordan Love","QB","GB"], // 120 · avg 118.00
  ["Aaron Jones Sr.","RB","MIN"], // 121 · avg 119.00
  ["Baker Mayfield","QB","TB"], // 122 · avg 120.33
  ["De'Zhaun Stribling","WR","SF"], // 123 · avg 122.67
  ["Jake Ferguson","TE","DAL"], // 124 · avg 124.33
  ["Chris Rodriguez Jr.","RB","JAC"], // 125 · avg 126.00
  ["Matthew Golden","WR","GB"], // 126 · avg 126.00
  ["Xavier Worthy","WR","KC"], // 127 · avg 126.00
  ["Mark Andrews","TE","BAL"], // 128 · avg 126.33
  ["Romeo Doubs","WR","NE"], // 129 · avg 128.00
  ["Jalen Coker","WR","CAR"], // 130 · avg 129.00
  ["Tyler Shough","QB","NO"], // 131 · avg 129.00
  ["Braelon Allen","RB","NYJ"], // 132 · avg 157.00 · adj -28
  ["Juwan Johnson","TE","NO"], // 133 · avg 131.00
  ["Malik Willis","QB","MIA"], // 134 · avg 131.67
  ["Woody Marks","RB","HOU"], // 135 · avg 132.00
  ["Kyle Monangai","RB","CHI"], // 136 · avg 112.00 · adj +22
  ["Khalil Shakir","WR","BUF"], // 137 · avg 134.00
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 137.00
  ["Jalen McMillan","WR","TB"], // 139 · avg 165.67 · adj -28
  ["Rashid Shaheed","WR","SEA"], // 140 · avg 139.00
  ["Jonah Coleman","RB","DEN"], // 141 · avg 140.33
  ["Sam Darnold","QB","SEA"], // 142 · avg 140.33
  ["Tyjae Spears","RB","TEN"], // 143 · avg 141.33
  ["Keaton Mitchell","RB","LAC"], // 144 · avg 144.00
  ["Josh Jacobs","RB","GB"], // 145 · avg 144.33
  ["C.J. Stroud","QB","HOU"], // 146 · avg 144.67
  ["Daniel Jones","QB","IND"], // 147 · avg 146.67
  ["Dylan Sampson","RB","CLE"], // 148 · avg 148.33
  ["Tank Bigsby","RB","PHI"], // 149 · avg 150.00
  ["Hunter Henry","TE","NE"], // 150 · avg 150.33
  ["Brenton Strange","TE","JAC"], // 151 · avg 150.67
  ["Denzel Boston","WR","CLE"], // 152 · avg 151.67
  ["Cam Ward","QB","TEN"], // 153 · avg 153.67
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 155.00
  ["Tre Tucker","WR","LV"], // 155 · avg 155.67
  ["Adonai Mitchell","WR","NYJ"], // 156 · avg 159.00
  ["Dalton Schultz","TE","HOU"], // 157 · avg 159.33
  ["Brian Robinson Jr.","RB","ATL"], // 158 · avg 160.33
  ["Kayshon Boutte","WR","HOU"], // 159 · avg 160.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 160 · avg 161.00
  ["Emmett Johnson","RB","KC"], // 161 · avg 165.67
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 166.67
  ["Bryce Young","QB","CAR"], // 163 · avg 167.67
  ["Isiah Pacheco","RB","DET"], // 164 · avg 169.67
  ["Jauan Jennings","WR","MIN"], // 165 · avg 171.33
  ["Tre' Harris","WR","LAC"], // 166 · avg 172.00
  ["Dontayvion Wicks","WR","PHI"], // 167 · avg 172.33
  ["Omar Cooper Jr.","WR","NYJ"], // 168 · avg 173.67
  ["Ray Davis","RB","BUF"], // 169 · avg 174.00
  ["Terrance Ferguson","TE","LAR"], // 170 · avg 176.33
  ["Ryan Flournoy","WR","DAL"], // 171 · avg 178.67
  ["Zach Charbonnet","RB","SEA"], // 172 · avg 144.67 · adj +35
  ["Pat Bryant","WR","DEN"], // 173 · avg 181.67
  ["Jalen Nailor","WR","LV"], // 174 · avg 184.00
  ["AJ Barner","TE","SEA"], // 175 · avg 185.00
  ["Kimani Vidal","RB","LAC"], // 176 · avg 185.33
  ["Brandon Aubrey","K","DAL"], // 177 · avg 187.67
  ["Malik Washington","WR","MIA"], // 178 · avg 187.67
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 188.33
  ["Jacoby Brissett","QB","ARI"], // 180 · avg 191.33
  ["Calvin Ridley","WR","TEN"], // 181 · avg 192.00
  ["Travis Hunter","WR","JAC"], // 182 · avg 192.00
  ["Keenan Allen","WR","IND"], // 183 · avg 194.00
  ["Oronde Gadsden II","TE","LAC"], // 184 · avg 194.00
  ["Cameron Dicker","K","LAC"], // 185 · avg 195.33
  ["Ka'imi Fairbairn","K","HOU"], // 186 · avg 195.33
  ["Kenyon Sadiq","TE","NYJ"], // 187 · avg 196.00
  ["Jaylin Noel","WR","HOU"], // 188 · avg 198.67
  ["Nicholas Singleton","RB","TEN"], // 189 · avg 199.00
  ["Sean Tucker","RB","TB"], // 190 · avg 201.00
  ["Cam Little","K","JAC"], // 191 · avg 203.33
  ["Jason Myers","K","SEA"], // 192 · avg 205.67
  ["James Conner","RB","ARI"], // 193 · avg 221.67 · adj -16
  ["Alvin Kamara","RB","NO"], // 194 · avg 161.00 · adj +45
  ["Gunnar Helm","TE","TEN"], // 195 · avg 208.67
  ["Rashod Bateman","WR","BAL"], // 196 · avg 210.33
  ["Aaron Rodgers","QB","PIT"], // 197 · avg 212.00
  ["Pat Freiermuth","TE","PIT"], // 198 · avg 212.00
  ["Kaelon Black","RB","SF"], // 199 · avg 213.33
  ["Kaytron Allen","RB","WAS"], // 200 · avg 213.33
  ["Eddy Pineiro","K","SF"], // 201 · avg 214.00
  ["Ja'Kobi Lane","WR","BAL"], // 202 · avg 214.33
  ["Isaac TeSlaa","WR","DET"], // 203 · avg 216.33
  ["Tyler Loop","K","BAL"], // 204 · avg 218.67
  ["Jake Bates","K","DET"], // 205 · avg 221.00
  ["Malik Davis","RB","DAL"], // 206 · avg 222.67
  ["Darnell Mooney","WR","NYG"], // 207 · avg 223.00
  ["Geno Smith","QB","NYJ"], // 208 · avg 223.33
  ["Jaylen Wright","RB","MIA"], // 209 · avg 223.33
  ["Kendre Miller","RB","NO"], // 210 · avg 274.33 · adj -50
  ["Emanuel Wilson","RB","SEA"], // 211 · avg 224.67
  ["Cooper Kupp","WR","SEA"], // 212 · avg 225.00
  ["Cairo Santos","K","CHI"], // 213 · avg 226.33
  ["Cade Otton","TE","TB"], // 214 · avg 227.00
  ["Malachi Fields","WR","NYG"], // 215 · avg 228.00
  ["Chris Bell","WR","MIA"], // 216 · avg 229.00
  ["Evan McPherson","K","CIN"], // 217 · avg 230.00
  ["Harrison Mevis","K","LAR"], // 218 · avg 230.00
  ["Najee Harris","RB","NYG"], // 219 · avg 230.33
  ["Zachariah Branch","WR","ATL"], // 220 · avg 231.00
  ["Troy Franklin","WR","DEN"], // 221 · avg 231.33
  ["George Holani","RB","SEA"], // 222 · avg 232.67
  ["Isaiah Davis","RB","NYJ"], // 223 · avg 262.00 · adj -28
  ["Tank Dell","WR","HOU"], // 224 · avg 236.00
  ["Chase McLaughlin","K","TB"], // 225 · avg 237.00
  ["Jordyn Tyson","WR","NO"], // 226 · avg 137.67 · adj +100
  ["Germie Bernard","WR","PIT"], // 227 · avg 238.67
  ["Andy Borregales","K","NE"], // 228 · avg 239.00
  ["David Njoku","TE","LAC"], // 229 · avg 241.67
  ["Justice Hill","RB","BAL"], // 230 · avg 244.67
  ["Devin Neal","RB","NO"], // 231 · avg 296.00 · adj -50
  ["Ted Hurst III","WR","TB"], // 232 · avg 246.33
  ["Caleb Douglas","WR","MIA"], // 233 · avg 247.00
  ["Evan Engram","TE","DEN"], // 234 · avg 247.00
  ["Demond Claiborne","RB","MIN"], // 235 · avg 247.33
  ["Kaleb Johnson","RB","GB"], // 236 · avg 247.33
  ["Greg Dulcich","TE","MIA"], // 237 · avg 248.00
  ["Chris Brooks","RB","GB"], // 238 · avg 248.67
  ["Harrison Butker","K","KC"], // 239 · avg 253.33
  ["Devaughn Vele","WR","NO"], // 240 · avg 254.00
  ["Jack Bech","WR","LV"], // 241 · avg 256.00
  ["Ollie Gordon II","RB","MIA"], // 242 · avg 256.00
  ["Fernando Mendoza","QB","LV"], // 243 · avg 256.67
  ["Samaje Perine","RB","CIN"], // 244 · avg 256.67
  ["Chris Boswell","K","PIT"], // 245 · avg 258.00
  ["Colby Parkinson","TE","LAR"], // 246 · avg 260.33
  ["Elic Ayomanor","WR","TEN"], // 247 · avg 260.33
  ["Jordan James","RB","SF"], // 248 · avg 262.33
  ["Keon Coleman","WR","BUF"], // 249 · avg 252.67 · adj +12
  ["Chimere Dike","WR","TEN"], // 250 · avg 264.67
  ["Tyquan Thornton","WR","KC"], // 251 · avg 266.33
  ["Ty Johnson","RB","BUF"], // 252 · avg 267.67
  ["Tory Horton","WR","SEA"], // 253 · avg 269.33
  ["Seth McGowan","RB","IND"], // 254 · avg 271.67
  ["LeQuint Allen Jr.","RB","JAC"], // 255 · avg 272.00
  ["Wil Lutz","K","DEN"], // 256 · avg 272.33
  ["Cyrus Allen","WR","KC"], // 257 · avg 273.00
  ["Will Reichard","K","MIN"], // 258 · avg 273.00
  ["Tua Tagovailoa","QB","ATL"], // 259 · avg 276.00
  ["Darius Slayton","WR","NYG"], // 260 · avg 277.00
  ["Elijah Sarratt","WR","BAL"], // 261 · avg 277.00
  ["Mason Taylor","TE","NYJ"], // 262 · avg 277.00
  ["Christian Kirk","WR","SF"], // 263 · avg 280.67
  ["DJ Giddens","RB","IND"], // 264 · avg 280.67
  ["Kirk Cousins","QB","LV"], // 265 · avg 281.00
  ["Xavier Legette","WR","CAR"], // 266 · avg 281.33
  ["Marvin Mims Jr.","WR","DEN"], // 267 · avg 283.67
  ["Theo Johnson","TE","NYG"], // 268 · avg 284.33
  ["Jaydon Blue","RB","PHI"], // 269 · avg 286.67
  ["Deshaun Watson","QB","CLE"], // 270 · avg 287.00
  ["Kyle Williams","WR","NE"], // 271 · avg 287.33
  ["Shedeur Sanders","QB","CLE"], // 272 · avg 289.00
  ["Eli Stowers","TE","PHI"], // 273 · avg 289.33
  ["Michael Penix Jr.","QB","ATL"], // 274 · avg 279.00 · adj +12
  ["Adam Randall","RB","BAL"], // 275 · avg 291.00
  ["Brashard Smith","RB","KC"], // 276 · avg 294.00
  ["Devin Singletary","RB","NYG"], // 277 · avg 295.00
  ["Emari Demercado","RB","DAL"], // 278 · avg 295.67
  ["Mike Gesicki","TE","CIN"], // 279 · avg 297.33
  ["Hollywood Brown","WR","PHI"], // 280 · avg 298.00
  ["Mack Hollins","WR","NE"], // 281 · avg 298.67
  ["Skyler Bell","WR","BUF"], // 282 · avg 302.67
  ["Isaiah Bond","WR","CLE"], // 283 · avg 303.00
  ["Trevor Etienne","RB","CAR"], // 284 · avg 306.33
  ["Brandon Aiyuk","WR","SF"], // 285 · avg 306.67
  ["Jake Tonges","TE","SF"], // 286 · avg 308.00
  ["Darren Waller","TE","CAR"], // 287 · avg 310.33
  ["Isaac Guerendo","RB","SF"], // 288 · avg 311.67
  ["Jerome Ford","RB","WAS"], // 289 · avg 311.67
  ["Tez Johnson","WR","TB"], // 290 · avg 340.67 · adj -28
  ["Andrei Iosivas","WR","CIN"], // 291 · avg 314.00
  ["Tahj Brooks","RB","CIN"], // 292 · avg 314.33
  ["Darnell Washington","TE","PIT"], // 293 · avg 315.33
  ["Audric Estime","RB","NO"], // 294 · avg 315.67
  ["DeMario Douglas","WR","NE"], // 295 · avg 316.33
  ["Tyreek Hill","WR","FA"], // 296 · avg 316.67
  ["Jarquez Hunter","RB","FA"], // 297 · avg 318.67
  ["Oscar Delp","TE","NO"], // 298 · avg 320.33
  ["Jaleel McLaughlin","RB","CLE"], // 299 · avg 320.67
  ["Michael Mayer","TE","LV"], // 300 · avg 321.33
  ["Charlie Smyth","K","NO"], // 301 · avg 321.67
  ["Will Shipley","RB","PHI"], // 302 · avg 322.67
  ["Charlie Kolar","TE","LAC"], // 303 · avg 324.00
  ["Jahan Dotson","WR","ATL"], // 304 · avg 324.67
  ["Xavier Hutchinson","WR","HOU"], // 305 · avg 327.00
  ["Bryce Lance","WR","NO"], // 306 · avg 328.33
  ["Elijah Arroyo","TE","SEA"], // 307 · avg 329.67
  ["Jalen Tolbert","WR","MIA"], // 308 · avg 330.00
  ["Carson Beck","QB","ARI"], // 309 · avg 331.67
  ["Kareem Hunt","RB","FA"], // 310 · avg 331.67
  ["Eli Raridon","TE","NE"], // 311 · avg 334.33
  ["Cole Kmet","TE","CHI"], // 312 · avg 335.33
  ["Dawson Knox","TE","BUF"], // 313 · avg 335.67
  ["Tyler Higbee","TE","LAR"], // 314 · avg 339.00
  ["Konata Mumpfield","WR","LAR"], // 315 · avg 340.00
  ["Erick All Jr.","TE","CIN"], // 316 · avg 340.33
  ["Joe Mixon","RB","FA"], // 317 · avg 340.33
  ["J.J. McCarthy","QB","MIN"], // 318 · avg 342.00
  ["Jalen Royals","WR","KC"], // 319 · avg 343.00
  ["Kendrick Bourne","WR","ARI"], // 320 · avg 343.33
  ["Luke McCaffrey","WR","WAS"], // 321 · avg 344.67
  ["Max Klare","TE","LAR"], // 322 · avg 345.00
  ["Brenen Thompson","WR","LAC"], // 323 · avg 346.00
  ["Bam Knight","RB","ARI"], // 324 · avg 349.67
  ["Olamide Zaccheaus","WR","ATL"], // 325 · avg 351.00
  ["Noah Gray","TE","KC"], // 326 · avg 351.67
  ["Tyler Bass","K","BUF"], // 327 · avg 352.33
  ["Joshua Palmer","WR","BUF"], // 328 · avg 353.67
  ["Mac Jones","QB","SF"], // 329 · avg 353.67
  ["Jake Elliott","K","PHI"], // 330 · avg 354.67
  ["Treylon Burks","WR","WAS"], // 331 · avg 355.67
  ["Cedric Tillman","WR","NO"], // 332 · avg 356.33
  ["Ja'Tavion Sanders","TE","CAR"], // 333 · avg 356.67
  ["Roman Wilson","WR","PIT"], // 334 · avg 360.67
  ["Eli Heidenreich","RB","PIT"], // 335 · avg 362.33
  ["Ty Simpson","QB","LAR"], // 336 · avg 363.00
  ["Justin Fields","QB","KC"], // 337 · avg 363.33
  ["Malik Benson","WR","LV"], // 338 · avg 363.67
  ["Zavion Thomas","WR","CHI"], // 339 · avg 367.67
  ["Michael Carter","RB","TEN"], // 340 · avg 369.00
  ["Kalif Raymond","WR","CHI"], // 341 · avg 369.67
  ["Trey Smack","K","GB"], // 342 · avg 370.00
  ["Kevin Coleman Jr.","WR","MIA"], // 343 · avg 371.67
  ["Dont'e Thornton Jr.","WR","LV"], // 344 · avg 372.67
  ["Anthony Richardson Sr.","QB","IND"], // 345 · avg 373.67
  ["Savion Williams","WR","GB"], // 346 · avg 374.67
  ["KaVontae Turpin","WR","DAL"], // 347 · avg 375.33
  ["Justin Joly","TE","FA"], // 348 · avg 377.00
  ["Roschon Johnson","RB","CHI"], // 349 · avg 377.33
  ["Jacob Saylors","RB","DET"], // 350 · avg 377.67
];

