import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {

    constructor(private powerService:PowerService){}

    compute(x:number , y:number){
        return x+y;
    }
}
