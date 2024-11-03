import { IsNumber, IsOptional, IsString } from "class-validator";

export default class CreateProductRequestDto {
    @IsString()
    public name?: string;

    @IsNumber()
    public amount?: number;

    @IsString()
    @IsOptional()
    public description?: string;
}