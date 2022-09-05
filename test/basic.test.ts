import { isSubset } from '../src';

describe('test simple queries', () => {
  it('queries', () => {
    const queryA = `query MyQuery {
      attendance(where: {industry: {id: {_eq: 10}}}) {
        date
        created_at
        industry {
          district
          created_at
        }
      }
      iti {
        id
      }
    }`

    const queryB = `query MyQuery {
      attendance(where: {industry: {id: {_eq: 10}}}) {
        date
        created_at
        industry {
          district
        }
      }
      iti {
        id
      }
    }`
    expect(isSubset(queryA, queryB)).toEqual(true);
  });
});
