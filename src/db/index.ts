import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
//importanto todas as variaveis de dentro do schema, os bancos
import * as schema from "./schema";
import { env } from "../env";

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema, logger: true });
