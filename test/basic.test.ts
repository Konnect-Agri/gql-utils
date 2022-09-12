import { isSubset } from '../src';

const queryBase = `query MyQuery {
  attendance(where: {industry: {id: {_eq: 10}}}) {
    date
    created_at
    industry {
      district {
        dis_name {
          dis_location
        }
      }
      created_at
    }
  }
  iti {
    id
  }
}`;

const queryRequestingEntity = `query MyQuery {
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

const queryWithFiltersAdded = `query MyQuery {
  attendance(where: {industry: {id: {_eq: 10}}}) {
    date
    created_at
    industry {
      district {
        dis_name {
          dis_location
        }
      }
      created_at
    }
  }
  iti(where: { id: { _eq: 1 }}) {
    id
  }
}`;

describe('test simple queries', () => {
  it('queries', () => {
    expect(isSubset(queryBase, queryRequestingEntity)).toEqual(false);
    expect(isSubset(queryBase, queryWithFieldsAdded)).toEqual(false);
    expect(isSubset(queryBase, queryWithFiltersAdded)).toEqual(true);
  });
});
