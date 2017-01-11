"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const hydrate_mongodb_1 = require("hydrate-mongodb");
(function (UserClass) {
    UserClass[UserClass["Free"] = 0] = "Free";
    UserClass[UserClass["Premium"] = 1] = "Premium";
})(exports.UserClass || (exports.UserClass = {}));
var UserClass = exports.UserClass;
let Flavor = class Flavor {
    constructor(name, cpus, memory, disk, swap) {
        this.name = name;
        this.cpus = cpus;
        this.memory = memory;
        this.disk = disk;
        this.swap = swap;
    }
};
__decorate([
    hydrate_mongodb_1.Field()
], Flavor.prototype, "name", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], Flavor.prototype, "cpus", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], Flavor.prototype, "memory", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], Flavor.prototype, "disk", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], Flavor.prototype, "swap", void 0);
Flavor = __decorate([
    hydrate_mongodb_1.Entity()
], Flavor);
exports.Flavor = Flavor;
let User = class User {
    constructor(login, password, user_class) {
        this.login = login;
        this.password = password;
        this.user_class = user_class;
        this.date_joined = new Date();
        this.last_billed = new Date();
    }
};
__decorate([
    hydrate_mongodb_1.Field()
], User.prototype, "login", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], User.prototype, "password", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], User.prototype, "user_class", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], User.prototype, "date_joined", void 0);
__decorate([
    hydrate_mongodb_1.Field()
], User.prototype, "last_billed", void 0);
__decorate([
    hydrate_mongodb_1.ElementType(Number)
], User.prototype, "owned_vms", void 0);
User = __decorate([
    hydrate_mongodb_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=model.js.map