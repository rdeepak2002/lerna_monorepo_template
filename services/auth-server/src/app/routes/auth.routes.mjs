import verifySignUp from "../middlewares/verifySignUp.mjs";
import controller from "../controllers/auth.controller.mjs";

const authRoutes = (app) => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/v1/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/v1/auth/signin", controller.signin);

    app.post("/api/v1/auth/refresh_tokens", controller.refreshTokens);

    app.post("/api/v1/auth/signout", controller.signout);
};

export default authRoutes;
