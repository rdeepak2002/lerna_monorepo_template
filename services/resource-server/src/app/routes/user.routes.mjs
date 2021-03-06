import {authJwt} from "@project_m/common";
import controller from "../controllers/user.controller.mjs";

const userRoutes = (app) => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/v1/test/all", controller.allAccess);

    app.get("/api/v1/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/v1/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/v1/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};

export default userRoutes;
