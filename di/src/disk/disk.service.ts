import { Injectable } from '@nestjs/common';

@Injectable()
export class DiskService {
    getData(){
        return "data";
    }
}
