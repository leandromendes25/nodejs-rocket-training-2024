import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../functions/getWeekPendingGoals";

export const pendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/pending-goals", async () => {
		const { pendingGoals } = await getWeekPendingGoals();
		return { pendingGoals };
	});
};
