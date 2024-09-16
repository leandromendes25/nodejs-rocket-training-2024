import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import daysjs from "dayjs";

interface createGoalCompletionRequest {
	goalId: string;
}

export async function createGoalCompletion({
	goalId,
}: createGoalCompletionRequest) {
	const firstDayOfWeek = daysjs().startOf("week").toDate();
	const lastDayOfWeek = daysjs().endOf("week").toDate();
	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completetionCount: count(goalCompletions.id).as("completion_counts"),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
					eq(goalCompletions.goalId, goalId),
				),
			)
			.groupBy(goalCompletions.goalId),
	);
	const result = await db
		.with(goalCompletionCounts)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount: //mapwith muda o tipo da variavel
				sql`COALESCE(${goalCompletionCounts.completetionCount}, 0)`.mapWith(
					Number,
				),
		})
		.from(goals)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
		.where(eq(goals.id, goalId))
		.limit(1);

	const { completionCount, desiredWeeklyFrequency } = result[0];
	if (completionCount >= desiredWeeklyFrequency) {
		throw new Error("Goal already completed this week!");
	}
	const insertResult = await db
		.insert(goalCompletions)
		.values({ goalId })
		.returning();
	const goalCompletion = result[0];
	return { goalCompletion };
}
