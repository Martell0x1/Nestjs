import { MessagesRepository } from "./messages.repository";

export class MessagesService{
    messageRepo: MessagesRepository;
    constructor(){
        this.messageRepo = new MessagesRepository();
    }

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