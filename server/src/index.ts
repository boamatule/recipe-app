import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { mealdbRouter } from "./routes/mealdb.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5174;

app.use(
	helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }),
);
app.use(
	cors({
		origin: "*",
		methods: ["GET"],
	}),
);
app.use(compression());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", mealdbRouter);

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	},
);

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
