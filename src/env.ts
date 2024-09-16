import z from "zod";
//verifica se o database url é uma string se é uma URL
const envSchema = z.object({
	DATABASE_URL: z.string().url(),
});
export const env = envSchema.parse(process.env);
