import { Injectable } from "@nestjs/common";

import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService{
    constructor(private messageRepo:MessagesRepository){}

    fincOne(id:string){
        return this.messageRepo.findOne(id);
    }

    findAll(){
        return this.messageRepo.findAll();
    }
    
    create(content:string){
        return this.messageRepo.create(content);
    }
}