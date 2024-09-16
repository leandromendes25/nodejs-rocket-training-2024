import dayjs from "dayjs";
import { client, db } from ".";
import { goalCompletetions, goals } from "./schema";
async function seed() {
	await db.delete(goalCompletetions);
	await db.delete(goals);

	const result = await db
		.insert(goals)
		.values([
			{ title: "Acordar cedo", desidredWeeklyFrequency: 4 },
			{ title: "Praticar Inglês", desidredWeeklyFrequency: 5 },
			{ title: "Beba Água", desidredWeeklyFrequency: 2 },
		])
		.returning();
	const starfOfWeek = dayjs().startOf("week");
	//returning vai permitir coletar os dados da tabela
	await db.insert(goalCompletetions).values([
		{ goalId: result[0].id, createdAt: starfOfWeek.toDate() },
		{ goalId: result[1].id, createdAt: starfOfWeek.add(1, "day").toDate() },
	]);
}
seed().finally(() => {
	client.end();
});
