"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRepository = void 0;
const promises_1 = require("fs/promises");
class MessagesRepository {
    async findOne(id) {
        const data = await (0, promises_1.readFile)('messages.json', 'utf-8');
        const messages = JSON.parse(data);
        return messages[id];
    }
    async findAll() {
        const data = await (0, promises_1.readFile)('messages.json', 'utf8');
        const messages = JSON.parse(data);
        return messages;
    }
    async create(content) {
        const data = await (0, promises_1.readFile)('messages.json', 'utf8');
        const messages = JSON.parse(data);
        const id = Math.floor((Math.random() * 999));
        messages[id] = { id, content };
        await (0, promises_1.writeFile)('messages.json', JSON.stringify(messages));
    }
}
exports.MessagesRepository = MessagesRepository;
//# sourceMappingURL=messages.repository.js.map