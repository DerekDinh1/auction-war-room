/** Format dollars for auction display. */
export const money = (n) => (n < 0 ? `-$${Math.abs(Math.round(n))}` : `$${Math.round(n)}`);
