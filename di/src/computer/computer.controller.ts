import { Controller , Get } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer')
export class ComputerController {
    constructor(private cpu:CpuService , private disk:DiskService){}

    @Get()
    run(){
        return [
            this.cpu.compute(1,2),
            this.disk.getData()
        ];
    }
}
