import mongoose from "mongoose";
import User from "./user.model.mjs";
import Role from "./role.model.mjs";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.role = Role;

db.ROLES = ["user", "admin", "moderator"];

export default db;
