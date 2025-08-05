import { Controller, Get } from "@nestjs/common";

@Controller('/app')
export class AppContoller{

    @Get('/asdf')
    getRootRoute(){
        return "hi there!";
    }

    @Get('/bye')
    getByeThere(){
        return 'bye there !';
    }
}