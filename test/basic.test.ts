import { isSubset } from '../src';

const queryBase = `query MyQuery {
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
}`;

const queryWithFieldsRemoved = `query MyQuery {
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
}`;

const queryWithFieldsAdded = `query MyQuery {
  attendance(where: {industry: {id: {_eq: 10}}}) {
    date
    created_at
    industry {
      district
    }
  }
  iti {
    id
    test
  }
}`;

describe('test simple queries', () => {
  it('queries', () => {
    expect(isSubset(queryBase, queryWithFieldsRemoved)).toEqual(true);
    expect(isSubset(queryBase, queryWithFieldsAdded)).toEqual(false);
  });
});
