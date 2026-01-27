import { IsOptional, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";

export class CreateVirusScanDto {
    @IsString()
    @IsNotEmpty()
    applicationId: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsOptional()
    file: Buffer;
}
