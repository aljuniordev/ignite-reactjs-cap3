import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  domain: "db.us.fauna.com", //para não precisar disso, tem que escolher o tipo "classic" no fauna
});
