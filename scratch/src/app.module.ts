import { Module } from "@nestjs/common";
import { AppContoller } from "./app.contoller";

@Module({
    controllers:[AppContoller]
})

export class AppModule{}
