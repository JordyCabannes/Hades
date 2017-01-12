"use strict";
const express_1 = require("express");
const users = express_1.Router();
/* GET users listing. */
users.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = users;
//# sourceMappingURL=users.js.map