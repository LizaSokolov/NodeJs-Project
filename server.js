import express from "express";
import router from "./router/router.js";
import chalk from "chalk";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import { fileLogger } from "./middlewares/fileLogger.js";
import { brokenServer } from "./middlewares/serverBroken.js";
import { PORT } from "./services/env.service.js";
import { createInitialData } from "./services/initialData.service.js";
import { connectDB } from "./services/db.service.js";

const app = express();

app.use(express.json({ limit: "5mb" }));

app.use(cors());

app.use(morgan("dev"));

app.use(express.static('public'));

app.use(express.static("public"));

app.use("/", router);

app.use((req, res, next) => {
    next();
});

app.use(fileLogger);

app.use(errorHandler);

app.use(brokenServer);

app.listen(PORT, () => {
    console.log(chalk.blue(`Server is running on port ${PORT}`));

    connectDB()
        .then(() => createInitialData())
        .catch((error) => {
            console.error(chalk.redBright(`Failed to connect to MongoDB: ${error.message}`));
            process.exit(1);
        });
});