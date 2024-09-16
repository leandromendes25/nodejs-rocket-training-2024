import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoalsRoute } from "./routes/create-goals";
import { pendingGoalsRoute } from "./routes/pending-goals";
import { createCompletionRoute } from "./routes/create-completion";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, {
	origin: "*", //* qualquer
});
app.register(createGoalsRoute);
app.register(pendingGoalsRoute);
app.register(createCompletionRoute);
app.register(getWeekSummaryRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("http server runing");
	});
