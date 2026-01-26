import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    filePath: string;

    @IsNotEmpty()
    fileData: Buffer;

    @IsNotEmpty()
    fileSize: bigint;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    comment?: string;
    

}
