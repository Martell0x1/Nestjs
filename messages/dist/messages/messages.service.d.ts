import { MessagesRepository } from "./messages.repository";
export declare class MessagesService {
    messageRepo: MessagesRepository;
    constructor();
    fincOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    create(content: string): Promise<void>;
}
