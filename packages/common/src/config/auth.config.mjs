const authConfig = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_JWT_SECRET
};

export default authConfig;
