import {authConfig, db, redisConfig} from "@project_m/common";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import redis from "redis";

const User = db.user;
const Role = db.role;

const TEN_SECONDS = 10;
const ONE_MINUTE = 60;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;
const ONE_DAY = 86400;
const ONE_WEEK = 86400 * 7;

const accessTokenExpiryTime = FIFTEEN_MINUTES;
const refreshTokenExpiryTime = 2 * ONE_WEEK;

const tokenType = "Bearer";

// connect to redis
const redisPort = redisConfig.PORT || '6379';
const redisUri = redisConfig.URI || '127.0.0.1';

const redisClient = redis.createClient({
    url: `redis://${redisUri}:${redisPort}`,
    password: redisConfig.PASSWORD || ''
});

redisClient.on("connect", () => {
    console.log("Successfully connect to Redis.");
});

redisClient.on("error", (err) => {
    console.error("Error connecting to Redis", err);
});

process.on('SIGINT', () => {
    redisClient.quit();
    console.log('redis client quit');
});

// define controller
let controller = {};

controller.signup = (req, res) => {
    // get the current request time
    const requestTime = Math.floor(new Date().getTime() / 1000);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        if (req.body.roles) {
            // role specified by client
            Role.find(
                {
                    name: {$in: req.body.roles}
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        // user registered, so send tokens
                        // get user from db
                        User.findOne({
                            username: user.username
                        })
                            .populate("roles", "-__v")
                            .exec((err, user) => {
                                if (err) {
                                    res.status(500).send({message: err});
                                    return;
                                }

                                if (!user) {
                                    return res.status(404).send({message: "User Not found."});
                                }

                                // send token via response
                                sendTokens(res, user, requestTime);
                            });
                    });
                }
            );
        } else {
            // role not specified by client, default to user role
            Role.findOne({name: "user"}, (err, role) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    // user registered, so send tokens
                    // get user from db
                    User.findOne({
                        username: user.username
                    })
                        .populate("roles", "-__v")
                        .exec((err, user) => {
                            if (err) {
                                res.status(500).send({message: err});
                                return;
                            }

                            if (!user) {
                                return res.status(404).send({message: "User Not found."});
                            }

                            // send token via response
                            sendTokens(res, user, requestTime);
                        });
                });
            });
        }
    });
};

controller.signin = (req, res) => {
    // get the current request time
    const requestTime = Math.floor(new Date().getTime() / 1000);

    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            // send tokens via response
            sendTokens(res, user, requestTime);
        });
};

controller.refreshTokens = (req, res) => {
    // get the current request time
    const requestTime = Math.floor(new Date().getTime() / 1000);

    // get the refresh token string from the request
    const refreshTokenStrIn = req.body.refreshToken || "";

    // look up refresh token in redis cache to get user associated with it
    redisClient.get(refreshTokenStrIn, (err, userId) => {
        // throw error if no user associated with refresh token
        if (err || !userId) {
            res.status(500).send({message: err || 'Invalid refresh token'});
        } else {
            // throw error if refresh token is not valid or refresh token does not belong to this user id
            jwt.verify(refreshTokenStrIn, authConfig.refreshSecret, (err, decoded) => {
                if (err || decoded.id !== userId) {
                    return res.status(401).send({message: "Unauthorized!"});
                }
            });

            // delete the token used
            redisClient.del(refreshTokenStrIn, (err, reply) => {
                // get the user and return new tokens
                User.findOne({
                    id: userId
                })
                    .populate("roles", "-__v")
                    .exec((err, user) => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        if (!user) {
                            return res.status(404).send({message: "User Not found."});
                        }

                        // send token via response
                        sendTokens(res, user, requestTime);
                    });
            });
        }
    });
};

controller.signout = (req, res) => {
    // get the current request time
    const requestTime = Math.floor(new Date().getTime() / 1000);

    // get the refresh token string from the request
    const refreshTokenStrIn = req.body.refreshToken || "";

    // look up refresh token in redis cache to get user associated with it
    redisClient.get(refreshTokenStrIn, (err, userId) => {
        // throw error if no user associated with refresh token
        if (err || !userId) {
            res.status(500).send({message: err || 'Invalid refresh token'});
        } else {
            // throw error if refresh token is not valid or refresh token does not belong to this user id
            jwt.verify(refreshTokenStrIn, authConfig.refreshSecret, (err, decoded) => {
                if (err || decoded.id !== userId) {
                    return res.status(401).send({message: "Unauthorized!"});
                }
            });

            // delete the token used
            redisClient.del(refreshTokenStrIn, (err, reply) => {
                return res.status(200).send({message: "Signed out!"});
            });
        }
    });
};

const sendTokens = (res, user, requestTime) => {
    let accessTokenStr = jwt.sign({id: user.id}, authConfig.secret, {
        expiresIn: accessTokenExpiryTime // 24 hours
    });

    let refreshTokenStr = jwt.sign({id: user.id}, authConfig.refreshSecret, {
        expiresIn: refreshTokenExpiryTime // 2 weeks
    });

    let authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    const accessToken = {
        token: accessTokenStr,
        type: tokenType,
        expiresAt: requestTime + accessTokenExpiryTime
    };

    const refreshToken = {
        token: refreshTokenStr,
        type: tokenType,
        expiresAt: requestTime + refreshTokenExpiryTime
    };

    // save refresh token in redis
    try {
        redisClient.set(refreshTokenStr, user.id, () => {
            redisClient.expire(refreshTokenStr, refreshTokenExpiryTime, () => {
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            });
        });
    } catch (err) {
        res.status(500).send({message: err});
    }
}

export default controller;
