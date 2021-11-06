import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./app/routes/user.routes.mjs";
import {authConfig, db, dbConfig} from "@project_m/common";

const app = express();

let corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

const Role = db.role;

// check if necessary environment variables are defined
if (!dbConfig.URI) {
    console.error('DB_URI environment variable not found.');
    process.exit(1);
}

if (!authConfig.secret) {
    console.error('JWT_SECRET environment variable not found.');
    process.exit(1);
}

if (!authConfig.refreshSecret) {
    console.error('REFRESH_JWT_SECRET environment variable not found.');
    process.exit(1);
}

// connect to MongoDB
db.mongoose
    .connect(dbConfig.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("MongoDB connection error", err);
        process.exit(1);
    });

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to project m application."});
});

// routes
userRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Resource server is listening at http://localhost:${PORT}`);
});
