import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AppState, VirusCheckStatus } from "generated/prisma/enums";

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsNotEmpty()
    fileData: Buffer;
    
    @IsOptional()
    icon?: Buffer;

    @IsNotEmpty()
    fileSize: string;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    comment?: string;
    
    @IsOptional()
    virusCheckStatus? : AppState
    
    @IsOptional()
    scanResult?: VirusCheckStatus;
    
    @IsString()
    @IsOptional()
    permaLink?: string;


    @IsDate()
    @IsOptional()
    lastChecked?: Date;


}
