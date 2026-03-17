import { account, databases, COLLECTIONS, getStorageUrl } from "./lib/firebase";

export const ID = {
  unique: () => {
    return crypto.randomUUID().replace(/-/g, "");
  }
};

export const Query = {
  equal: (field: string, value: any) => ({ type: "where", field, operator: "==", value }),
  notEqual: (field: string, value: any) => ({ type: "where", field, operator: "!=", value }),
  lessThan: (field: string, value: any) => ({ type: "where", field, operator: "<", value }),
  lessThanEqual: (field: string, value: any) => ({ type: "where", field, operator: "<=", value }),
  greaterThan: (field: string, value: any) => ({ type: "where", field, operator: ">", value }),
  greaterThanEqual: (field: string, value: any) => ({ type: "where", field, operator: ">=", value }),
  search: (field: string, value: any) => ({ type: "where", field, operator: "==", value }), 
  orderAsc: (field: string) => ({ type: "orderBy", field, direction: "asc" }),
  orderDesc: (field: string) => ({ type: "orderBy", field, direction: "desc" }),
  limit: (limit: number) => ({ type: "limit", value: limit }),
  offset: (offset: number) => ({ type: "offset", value: offset })
};

export { account, databases, COLLECTIONS, getStorageUrl };
