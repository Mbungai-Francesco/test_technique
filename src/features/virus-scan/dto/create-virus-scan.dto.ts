import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVirusScanDto {
    @IsString()
    @IsNotEmpty()
    applicationId: string;

    @IsString()
    @IsNotEmpty()
    hash: string;
    
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsOptional()
    file: Buffer;
}
