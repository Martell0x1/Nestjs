import { MessagesRepository } from "./messages.repository";
export declare class MessagesService {
    private messageRepo;
    constructor(messageRepo: MessagesRepository);
    fincOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    create(content: string): Promise<void>;
}
