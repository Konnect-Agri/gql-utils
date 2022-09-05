var { parse } = require('graphql');
import diff from 'microdiff';

// const isEmpty = (obj: any): boolean => {
//   return Object.keys(obj).length === 0;
// }

// KONNECT: Gatekeeper
export const isSubset = (A: string, B: string): boolean => {
  const astA = parse(A);
  const astB = parse(B);

  const d = diff(astA, astB);
  const created = d.filter(singleDiff => singleDiff.type === "CREATE");

  return created.length === 0;
}