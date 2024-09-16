import daysjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
export async function getWeekPendingGoals() {
	const firstDayOfWeek = daysjs().startOf("week").toDate();
	const lastDayOfWeek = daysjs().endOf("week").toDate();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);
	//essa variaveis são tabelas que criamos para no final retornarmos o sql em baixo q queremos q retorne
	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completetionCount: count(goalCompletions.id).as("completion_counts"),
			})
			.from(goalCompletions)
			.where(and(gte(goalCompletions.createdAt, firstDayOfWeek)))
			.groupBy(goalCompletions.goalId),
	);
	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
			completionCount: //mapwith muda o tipo da variavel
				sql`COALESCE(${goalCompletionCounts.completetionCount}, 0)`.mapWith(
					Number,
				),
		})
		.from(goalsCreatedUpToWeek)
		.leftJoin(
			goalCompletionCounts,
			eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id),
		)
		.toSQL();
	//.toSQL permite retornar o código sql para vermos o q ta retornando

	return { pendingGoals };
}
