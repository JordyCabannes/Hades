import {Entity, Field} from "hydrate-mongodb";
 
export enum UserClass {
    Free, 
    Premium
}
 
@Entity()
export class Flavor {
 
    @Field()
    name: string;
    
    @Field()
    cpus: number;

    @Field()
    memory: number;

    @Field()
    disk: number;

    @Field()
    swap: number;

    constructor(name: string, cpus: number, memory: number, disk: number, swap: number) {
        this.name = name;
        this.cpus = cpus;
        this.memory = memory;
        this.disk = disk;
        this.swap = swap;
    }
}


@Entity()
export class User {

    _id: ObjectID;

    @Field()
    login: string;
 
    @Field()
    password: string;

    @Field()
    user_class: UserClass;
 
    @Field()
    date_joined: Date;

    @Field()
    last_billed: Date;
 
    @ElementType(number)
    owned_vms: number[];

    constructor(login: string, password: string, status: UserClass) {
        this.login = login;
        this.password = password;
        this.status = user_class;
        this.date_joined = new Date();
        this.last_billed = new Date();
    }

}