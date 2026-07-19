import type { Dimension } from "./types";
export const EPS=1e-6;
export const inchesToCm=(value:number)=>value*2.54;
export function inRange(value:number,d:Dimension):boolean {
  return (d.min===null||(d.minInclusive?value+EPS>=d.min:value>d.min+EPS)) && (d.max===null||(d.maxInclusive?value-EPS<=d.max:value<d.max-EPS));
}
