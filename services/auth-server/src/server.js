import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {authConfig, db, dbConfig} from "@project_m/common";
import authRoutes from "./app/routes/auth.routes.mjs";

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
        initial();
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
authRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Auth server is listening at http://localhost:${PORT}`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}
