import { db } from "../db";
import { goals } from "../db/schema";

interface CreateGoalRequest {
	title: string;
	desiredWeeklyFrequency: number;
}

export async function createGoal({
	title,
	desiredWeeklyFrequency,
}: CreateGoalRequest) {
	const result = await db
		.insert(goals)
		.values({ title, desiredWeeklyFrequency })
		.returning();
	const goal = result[0];
	//deixamos para retornar objeto por ser + facil caso precise + info
	return { goal };
}
