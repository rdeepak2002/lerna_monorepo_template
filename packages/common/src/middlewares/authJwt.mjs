import jwt from "jsonwebtoken";
import db from "../models/index.mjs";
import authConfig from "../config/auth.config.mjs";

const User = db.user;
const Role = db.role;

let authJwt = {};

authJwt.verifyToken = (req, res, next) => {
    let token;

    try {
        const authHeaderString = req.headers["authorization"];
        token = authHeaderString.split(" ")[1];
    } catch (e) {
        return res.status(403).send({message: "Invalid access token!"});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
        req.userId = decoded.id;
        next();
    });
};

authJwt.isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({message: "Require Admin Role!"});

            }
        );
    });
};

authJwt.isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({message: "Require Moderator Role!"});

            }
        );
    });
};

export default authJwt;
