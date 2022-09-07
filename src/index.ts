import { parse, Entity } from "./model" 
// import diff from 'microdiff';

// KONNECT: Gatekeeper
export const isSubset = (A: string, B: string): boolean => {
  const astA = parse(A);
  const astB = parse(B);
  let subset = true
  astB.forEach((entity, name) => {
    // console.log(name)
    if (!isEntitySubset(astA.get(name), entity)) {
      subset = false
    }
  })    
  return subset
};

function isEntitySubset(A: Entity | undefined, B: Entity | undefined): boolean {
  if (!A) {
    return false
  }
  if (!B) {
    return true
  }

  // console.log(A.fields, B.fields)

  for(let fB of B.fields) {
    let exists = false
    for (let fA of A.fields) {    
      if (fA == fB) {
        exists = true
        break
      }
    }
    if (!exists) {
      return false
    }
  }

  return true
}
