/** Format dollars for auction display. */
export const money = (n) => (n < 0 ? `-$${Math.abs(Math.round(n))}` : `$${Math.round(n)}`);

/** Value delta with an explicit sign: "+$12" for gains, money() for zero/negative. */
export const signedMoney = (v) => (v > 0 ? `+$${v}` : money(v));
