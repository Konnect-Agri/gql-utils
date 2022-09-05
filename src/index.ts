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
  console.log("The current diff is - ");
  const created = d.filter(singleDiff => singleDiff.type === "CREATE");
  console.log("Created Nodes - ", created.length)

  return created.length === 0;
}