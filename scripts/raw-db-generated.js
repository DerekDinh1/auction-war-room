// Built-in player list — Top 300 overall (FantasyPros multi-format avg)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-07-26T21:33:20.764Z · 300 players · ordered by overall consensus rank
const RAW_DB = [
  ["Ja'Marr Chase","WR","CIN"], // 1 · avg 2.36
  ["Bijan Robinson","RB","ATL"], // 2 · avg 2.41
  ["Jahmyr Gibbs","RB","DET"], // 3 · avg 2.65
  ["Puka Nacua","WR","LAR"], // 4 · avg 3.83
  ["Jaxon Smith-Njigba","WR","SEA"], // 5 · avg 5.11
  ["Amon-Ra St. Brown","WR","DET"], // 6 · avg 6.85
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.35
  ["CeeDee Lamb","WR","DAL"], // 8 · avg 9.51
  ["Jonathan Taylor","RB","IND"], // 9 · avg 9.89
  ["Justin Jefferson","WR","MIN"], // 10 · avg 10.11
  ["James Cook III","RB","BUF"], // 11 · avg 13.76
  ["Drake London","WR","ATL"], // 12 · avg 14.48
  ["A.J. Brown","WR","NE"], // 13 · avg 15.99
  ["Nico Collins","WR","HOU"], // 14 · avg 16.21
  ["Ashton Jeanty","RB","LV"], // 15 · avg 16.28
  ["Brock Bowers","TE","LV"], // 16 · avg 18.49
  ["George Pickens","WR","DAL"], // 17 · avg 19.75
  ["Saquon Barkley","RB","PHI"], // 18 · avg 20.74
  ["De'Von Achane","RB","MIA"], // 19 · avg 20.89
  ["Chase Brown","RB","CIN"], // 20 · avg 21.36
  ["Trey McBride","TE","ARI"], // 21 · avg 22.14
  ["Omarion Hampton","RB","LAC"], // 22 · avg 22.66
  ["Rashee Rice","WR","KC"], // 23 · avg 25.03
  ["Chris Olave","WR","NO"], // 24 · avg 25.65
  ["Josh Allen","QB","BUF"], // 25 · avg 25.98
  ["Derrick Henry","RB","BAL"], // 26 · avg 26.20
  ["Kenneth Walker III","RB","KC"], // 27 · avg 27.44
  ["DeVonta Smith","WR","PHI"], // 28 · avg 29.55
  ["Tee Higgins","WR","CIN"], // 29 · avg 32.58
  ["Zay Flowers","WR","BAL"], // 30 · avg 32.78
  ["Tetairoa McMillan","WR","CAR"], // 31 · avg 33.16
  ["Lamar Jackson","QB","BAL"], // 32 · avg 33.49
  ["Drake Maye","QB","NE"], // 33 · avg 35.70
  ["Kyren Williams","RB","LAR"], // 34 · avg 37.13
  ["Jeremiyah Love","RB","ARI"], // 35 · avg 38.20
  ["Emeka Egbuka","WR","TB"], // 36 · avg 38.69
  ["Josh Jacobs","RB","GB"], // 37 · avg 38.88
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 39.60
  ["Colston Loveland","TE","CHI"], // 39 · avg 40.28
  ["Ladd McConkey","WR","LAC"], // 40 · avg 40.36
  ["Breece Hall","RB","NYJ"], // 41 · avg 40.47
  ["Malik Nabers","WR","NYG"], // 42 · avg 41.91
  ["Jaylen Waddle","WR","DEN"], // 43 · avg 42.48
  ["Javonte Williams","RB","DAL"], // 44 · avg 42.88
  ["Joe Burrow","QB","CIN"], // 45 · avg 43.40
  ["Terry McLaurin","WR","WAS"], // 46 · avg 44.06
  ["Davante Adams","WR","LAR"], // 47 · avg 46.96
  ["Travis Etienne Jr.","RB","NO"], // 48 · avg 47.55
  ["Luther Burden III","WR","CHI"], // 49 · avg 49.43
  ["Jameson Williams","WR","DET"], // 50 · avg 50.58
  ["Cam Skattebo","RB","NYG"], // 51 · avg 52.92
  ["Jayden Daniels","QB","WAS"], // 52 · avg 53.49
  ["Mike Evans","WR","SF"], // 53 · avg 53.63
  ["Christian Watson","WR","GB"], // 54 · avg 55.26
  ["Bucky Irving","RB","TB"], // 55 · avg 56.19
  ["Jalen Hurts","QB","PHI"], // 56 · avg 56.86
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.02
  ["DJ Moore","WR","BUF"], // 58 · avg 57.63
  ["Tyler Warren","TE","IND"], // 59 · avg 57.74
  ["D'Andre Swift","RB","CHI"], // 60 · avg 58.40
  ["TreVeyon Henderson","RB","NE"], // 61 · avg 58.48
  ["Rome Odunze","WR","CHI"], // 62 · avg 59.52
  ["David Montgomery","RB","HOU"], // 63 · avg 60.30
  ["Tucker Kraft","TE","GB"], // 64 · avg 66.69
  ["Bhayshul Tuten","RB","JAX"], // 65 · avg 67.45
  ["Caleb Williams","QB","CHI"], // 66 · avg 67.85
  ["Justin Herbert","QB","LAC"], // 67 · avg 70.06
  ["Jadarian Price","RB","SEA"], // 68 · avg 70.88
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 70.99
  ["Carnell Tate","WR","TEN"], // 70 · avg 72.07
  ["Jaylen Warren","RB","PIT"], // 71 · avg 74.29
  ["Trevor Lawrence","QB","JAX"], // 72 · avg 76.76
  ["Alec Pierce","WR","IND"], // 73 · avg 76.84
  ["DK Metcalf","WR","PIT"], // 74 · avg 77.60
  ["Brian Thomas Jr.","WR","JAX"], // 75 · avg 77.94
  ["Tony Pollard","RB","TEN"], // 76 · avg 78.40
  ["Dak Prescott","QB","DAL"], // 77 · avg 79.51
  ["Courtland Sutton","WR","DEN"], // 78 · avg 80.42
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.96
  ["Rhamondre Stevenson","RB","NE"], // 80 · avg 81.12
  ["Chuba Hubbard","RB","CAR"], // 81 · avg 81.68
  ["Kyle Pitts Sr.","TE","ATL"], // 82 · avg 82.99
  ["Sam LaPorta","TE","DET"], // 83 · avg 84.06
  ["Rico Dowdle","RB","PIT"], // 84 · avg 84.45
  ["Chris Godwin Jr.","WR","TB"], // 85 · avg 87.43
  ["Parker Washington","WR","JAX"], // 86 · avg 88.06
  ["Jordyn Tyson","WR","NO"], // 87 · avg 90.14
  ["Jaxson Dart","QB","NYG"], // 88 · avg 91.49
  ["RJ Harvey","RB","DEN"], // 89 · avg 92.41
  ["Brock Purdy","QB","SF"], // 90 · avg 94.29
  ["Kyle Monangai","RB","CHI"], // 91 · avg 94.85
  ["J.K. Dobbins","RB","DEN"], // 92 · avg 96.22
  ["Michael Wilson","WR","ARI"], // 93 · avg 96.49
  ["Quentin Johnston","WR","LAC"], // 94 · avg 97.14
  ["Michael Pittman Jr.","WR","PIT"], // 95 · avg 97.76
  ["Blake Corum","RB","LAR"], // 96 · avg 98.20
  ["Makai Lemon","WR","PHI"], // 97 · avg 99.56
  ["Patrick Mahomes II","QB","KC"], // 98 · avg 100.27
  ["Bo Nix","QB","DEN"], // 99 · avg 100.75
  ["George Kittle","TE","SF"], // 100 · avg 101.15
  ["Ricky Pearsall","WR","SF"], // 101 · avg 101.35
  ["Jakobi Meyers","WR","JAX"], // 102 · avg 102.73
  ["Jordan Addison","WR","MIN"], // 103 · avg 103.26
  ["Matthew Stafford","QB","LAR"], // 104 · avg 103.80
  ["Travis Kelce","TE","KC"], // 105 · avg 105.19
  ["Wan'Dale Robinson","WR","TEN"], // 106 · avg 106.13
  ["Kenny Gainwell","RB","TB"], // 107 · avg 106.59
  ["Rachaad White","RB","WAS"], // 108 · avg 108.55
  ["Josh Downs","WR","IND"], // 109 · avg 108.83
  ["Jared Goff","QB","DET"], // 110 · avg 109.74
  ["Aaron Jones Sr.","RB","MIN"], // 111 · avg 110.36
  ["Jayden Reed","WR","GB"], // 112 · avg 110.53
  ["Dalton Kincaid","TE","BUF"], // 113 · avg 111.60
  ["Kyler Murray","QB","MIN"], // 114 · avg 114.03
  ["Jacory Croskey-Merritt","RB","WAS"], // 115 · avg 114.80
  ["Jonathon Brooks","RB","CAR"], // 116 · avg 117.06
  ["Jake Ferguson","TE","DAL"], // 117 · avg 117.23
  ["Jordan Mason","RB","MIN"], // 118 · avg 118.03
  ["Isaiah Likely","TE","NYG"], // 119 · avg 118.39
  ["Xavier Worthy","WR","KC"], // 120 · avg 119.66
  ["Dallas Goedert","TE","PHI"], // 121 · avg 120.13
  ["Jordan Love","QB","GB"], // 122 · avg 120.53
  ["Baker Mayfield","QB","TB"], // 123 · avg 121.15
  ["Tyler Shough","QB","NO"], // 124 · avg 124.37
  ["Mark Andrews","TE","BAL"], // 125 · avg 125.48
  ["Jayden Higgins","WR","HOU"], // 126 · avg 125.49
  ["Khalil Shakir","WR","BUF"], // 127 · avg 129.62
  ["Tyrone Tracy Jr.","RB","NYG"], // 128 · avg 130.74
  ["Romeo Doubs","WR","NE"], // 129 · avg 132.11
  ["Chris Rodriguez Jr.","RB","JAX"], // 130 · avg 133.54
  ["Woody Marks","RB","HOU"], // 131 · avg 134.80
  ["Tyler Allgeier","RB","ARI"], // 132 · avg 136.69
  ["Jalen Coker","WR","CAR"], // 133 · avg 137.86
  ["KC Concepcion","WR","CLE"], // 134 · avg 138.11
  ["Matthew Golden","WR","GB"], // 135 · avg 138.51
  ["Malik Willis","QB","MIA"], // 136 · avg 138.53
  ["Zach Charbonnet","RB","SEA"], // 137 · avg 139.89
  ["C.J. Stroud","QB","HOU"], // 138 · avg 142.66
  ["Isiah Pacheco","RB","DET"], // 139 · avg 143.66
  ["Sam Darnold","QB","SEA"], // 140 · avg 146.15
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 148.06
  ["Tyjae Spears","RB","TEN"], // 142 · avg 148.23
  ["Dylan Sampson","RB","CLE"], // 143 · avg 149.91
  ["Brenton Strange","TE","JAX"], // 144 · avg 150.53
  ["Juwan Johnson","TE","NO"], // 145 · avg 151.26
  ["Alvin Kamara","RB","NO"], // 146 · avg 151.58
  ["Keaton Mitchell","RB","LAC"], // 147 · avg 154.74
  ["Jauan Jennings","WR","MIN"], // 148 · avg 156.63
  ["Hunter Henry","TE","NE"], // 149 · avg 156.79
  ["Cam Ward","QB","TEN"], // 150 · avg 158.16
  ["Oronde Gadsden II","TE","LAC"], // 151 · avg 158.35
  ["Chig Okonkwo","TE","WAS"], // 152 · avg 158.72
  ["Jonah Coleman","RB","DEN"], // 153 · avg 159.06
  ["Brian Robinson Jr.","RB","ATL"], // 154 · avg 160.25
  ["Tank Bigsby","RB","PHI"], // 155 · avg 161.23
  ["Jerry Jeudy","WR","CLE"], // 156 · avg 162.16
  ["Denzel Boston","WR","CLE"], // 157 · avg 162.84
  ["Stefon Diggs","WR","FA"], // 158 · avg 162.89
  ["Omar Cooper Jr.","WR","NYJ"], // 159 · avg 164.41
  ["Braelon Allen","RB","NYJ"], // 160 · avg 166.06
  ["Jalen McMillan","WR","TB"], // 161 · avg 168.46
  ["Daniel Jones","QB","IND"], // 162 · avg 169.20
  ["Bryce Young","QB","CAR"], // 163 · avg 169.62
  ["Adonai Mitchell","WR","NYJ"], // 164 · avg 171.29
  ["Travis Hunter","WR","JAX"], // 165 · avg 172.07
  ["Tre Tucker","WR","LV"], // 166 · avg 179.02
  ["Tre' Harris","WR","LAC"], // 167 · avg 183.89
  ["Brandon Aubrey","K","DAL"], // 168 · avg 186.50
  ["Dalton Schultz","TE","HOU"], // 169 · avg 189.14
  ["Emanuel Wilson","RB","SEA"], // 170 · avg 189.75
  ["Kayshon Boutte","WR","NE"], // 171 · avg 190.81
  ["James Conner","RB","ARI"], // 172 · avg 191.55
  ["Emmett Johnson","RB","KC"], // 173 · avg 191.71
  ["Ka'imi Fairbairn","K","HOU"], // 174 · avg 192.02
  ["Ryan Flournoy","WR","DAL"], // 175 · avg 192.15
  ["Antonio Williams","WR","WAS"], // 176 · avg 192.63
  ["Mike Washington Jr.","RB","LV"], // 177 · avg 192.90
  ["Deebo Samuel Sr.","WR","FA"], // 178 · avg 193.28
  ["Kimani Vidal","RB","LAC"], // 179 · avg 194.70
  ["Cameron Dicker","K","LAC"], // 180 · avg 195.03
  ["Ray Davis","RB","BUF"], // 181 · avg 197.10
  ["Troy Franklin","WR","DEN"], // 182 · avg 197.24
  ["Sean Tucker","RB","TB"], // 183 · avg 198.79
  ["Isaac TeSlaa","WR","DET"], // 184 · avg 198.80
  ["Cam Little","K","JAX"], // 185 · avg 199.10
  ["AJ Barner","TE","SEA"], // 186 · avg 200.13
  ["Calvin Ridley","WR","TEN"], // 187 · avg 200.66
  ["Jason Myers","K","SEA"], // 188 · avg 200.93
  ["Jaylin Noel","WR","HOU"], // 189 · avg 201.08
  ["T.J. Hockenson","TE","MIN"], // 190 · avg 201.95
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 202.01
  ["Jalen Nailor","WR","LV"], // 192 · avg 202.85
  ["Nicholas Singleton","RB","TEN"], // 193 · avg 204.18
  ["Kaytron Allen","RB","WAS"], // 194 · avg 207.73
  ["Darnell Mooney","WR","NYG"], // 195 · avg 208.22
  ["Jacoby Brissett","QB","ARI"], // 196 · avg 209.17
  ["Eddy Pineiro","K","SF"], // 197 · avg 210.21
  ["Tyler Loop","K","BAL"], // 198 · avg 210.24
  ["Greg Dulcich","TE","MIA"], // 199 · avg 210.94
  ["Evan McPherson","K","CIN"], // 200 · avg 215.31
  ["Brandon Aiyuk","WR","SF"], // 201 · avg 216.16
  ["Dontayvion Wicks","WR","PHI"], // 202 · avg 217.18
  ["Pat Bryant","WR","DEN"], // 203 · avg 217.45
  ["Cairo Santos","K","CHI"], // 204 · avg 217.78
  ["Andy Borregales","K","NE"], // 205 · avg 220.26
  ["Jaylen Wright","RB","MIA"], // 206 · avg 220.98
  ["Gunnar Helm","TE","TEN"], // 207 · avg 222.79
  ["Malik Washington","WR","MIA"], // 208 · avg 223.62
  ["Rashod Bateman","WR","BAL"], // 209 · avg 224.74
  ["Tank Dell","WR","HOU"], // 210 · avg 225.78
  ["Chimere Dike","WR","TEN"], // 211 · avg 225.89
  ["Chase McLaughlin","K","TB"], // 212 · avg 226.96
  ["MarShawn Lloyd","RB","GB"], // 213 · avg 227.96
  ["Jake Bates","K","DET"], // 214 · avg 228.73
  ["Tyreek Hill","WR","FA"], // 215 · avg 229.27
  ["Terrance Ferguson","TE","LAR"], // 216 · avg 231.35
  ["De'Zhaun Stribling","WR","SF"], // 217 · avg 232.26
  ["Germie Bernard","WR","PIT"], // 218 · avg 232.37
  ["Ollie Gordon II","RB","MIA"], // 219 · avg 232.93
  ["Nick Folk","K","ATL"], // 220 · avg 234.53
  ["Harrison Mevis","K","LAR"], // 221 · avg 234.66
  ["Cooper Kupp","WR","SEA"], // 222 · avg 235.48
  ["Aaron Rodgers","QB","PIT"], // 223 · avg 235.55
  ["Pat Freiermuth","TE","PIT"], // 224 · avg 237.52
  ["Elic Ayomanor","WR","TEN"], // 225 · avg 238.01
  ["Brandon McManus","K","FA"], // 226 · avg 238.59
  ["Zachariah Branch","WR","ATL"], // 227 · avg 238.63
  ["Blake Grupe","K","IND"], // 228 · avg 239.29
  ["Justice Hill","RB","BAL"], // 229 · avg 240.43
  ["Daniel Carlson","K","LV"], // 230 · avg 241.84
  ["Demond Claiborne","RB","MIN"], // 231 · avg 242.10
  ["Jaydon Blue","RB","DAL"], // 232 · avg 242.71
  ["David Njoku","TE","LAC"], // 233 · avg 242.88
  ["Ryan Fitzgerald","K","CAR"], // 234 · avg 244.13
  ["Geno Smith","QB","NYJ"], // 235 · avg 244.17
  ["Cade Otton","TE","TB"], // 236 · avg 244.57
  ["Harrison Butker","K","KC"], // 237 · avg 245.16
  ["Chris Bell","WR","MIA"], // 238 · avg 245.46
  ["Chris Boswell","K","PIT"], // 239 · avg 245.70
  ["Keon Coleman","WR","BUF"], // 240 · avg 247.43
  ["Jake Moody","K","WAS"], // 241 · avg 248.00
  ["Elijah Sarratt","WR","BAL"], // 242 · avg 249.88
  ["Trey Smack","K","GB"], // 243 · avg 249.93
  ["Devin Neal","RB","NO"], // 244 · avg 250.08
  ["Ben Sauls","K","NYG"], // 245 · avg 252.42
  ["Ty Johnson","RB","BUF"], // 246 · avg 252.74
  ["Colby Parkinson","TE","LAR"], // 247 · avg 252.84
  ["Jack Bech","WR","LV"], // 248 · avg 252.98
  ["Ted Hurst III","WR","TB"], // 249 · avg 254.00
  ["Kaleb Johnson","RB","PIT"], // 250 · avg 254.72
  ["Chris Brooks","RB","GB"], // 251 · avg 255.01
  ["Christian Kirk","WR","SF"], // 252 · avg 255.68
  ["Jordan James","RB","SF"], // 253 · avg 256.25
  ["Isaiah Davis","RB","NYJ"], // 254 · avg 257.04
  ["DJ Giddens","RB","IND"], // 255 · avg 257.50
  ["Malachi Fields","WR","NYG"], // 256 · avg 257.56
  ["Spencer Shrader","K","IND"], // 257 · avg 257.61
  ["Evan Engram","TE","DEN"], // 258 · avg 257.84
  ["Fernando Mendoza","QB","LV"], // 259 · avg 258.25
  ["Malik Davis","RB","DAL"], // 260 · avg 258.65
  ["Tory Horton","WR","SEA"], // 261 · avg 259.45
  ["Marvin Mims Jr.","WR","DEN"], // 262 · avg 259.72
  ["George Holani","RB","SEA"], // 263 · avg 259.84
  ["Tyler Bass","K","BUF"], // 264 · avg 260.14
  ["Will Reichard","K","MIN"], // 265 · avg 260.42
  ["Trey Benson","RB","ARI"], // 266 · avg 261.27
  ["Mike Gesicki","TE","CIN"], // 267 · avg 261.55
  ["Eli Stowers","TE","PHI"], // 268 · avg 262.69
  ["Chris Brazzell II","WR","CAR"], // 269 · avg 262.89
  ["Tyquan Thornton","WR","KC"], // 270 · avg 263.43
  ["Samaje Perine","RB","CIN"], // 271 · avg 264.05
  ["Darius Slayton","WR","NYG"], // 272 · avg 264.83
  ["Kaelon Black","RB","SF"], // 273 · avg 265.63
  ["Kyle Williams","WR","NE"], // 274 · avg 265.77
  ["Theo Johnson","TE","NYG"], // 275 · avg 266.26
  ["Andrei Iosivas","WR","CIN"], // 276 · avg 266.53
  ["Xavier Legette","WR","CAR"], // 277 · avg 267.90
  ["Kendre Miller","RB","NO"], // 278 · avg 268.12
  ["Najee Harris","RB","LAC"], // 279 · avg 269.20
  ["Wil Lutz","K","DEN"], // 280 · avg 269.79
  ["Mason Taylor","TE","NYJ"], // 281 · avg 270.38
  ["Keenan Allen","WR","LAC"], // 282 · avg 271.64
  ["Tua Tagovailoa","QB","ATL"], // 283 · avg 275.30
  ["Devaughn Vele","WR","NO"], // 284 · avg 275.33
  ["Mack Hollins","WR","NE"], // 285 · avg 275.53
  ["Seth McGowan","RB","IND"], // 286 · avg 275.78
  ["Joey Slye","K","TEN"], // 287 · avg 275.93
  ["LeQuint Allen Jr.","RB","JAX"], // 288 · avg 276.35
  ["Jerome Ford","RB","WAS"], // 289 · avg 279.05
  ["Brashard Smith","RB","KC"], // 290 · avg 280.17
  ["Ja'Kobi Lane","WR","BAL"], // 291 · avg 280.38
  ["Skyler Bell","WR","BUF"], // 292 · avg 280.82
  ["Adam Randall","RB","BAL"], // 293 · avg 281.15
  ["Charlie Smyth","K","NO"], // 294 · avg 281.43
  ["Jake Elliott","K","PHI"], // 295 · avg 281.84
  ["Emari Demercado","RB","KC"], // 296 · avg 282.81
  ["Michael Penix Jr.","QB","ATL"], // 297 · avg 283.18
  ["Devin Singletary","RB","NYG"], // 298 · avg 283.39
  ["Jake Tonges","TE","SF"], // 299 · avg 283.47
  ["Hollywood Brown","WR","PHI"], // 300 · avg 283.70
];
