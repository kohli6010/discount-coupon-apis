import { IsOptional, IsString } from "class-validator";
import { Service } from "typedi";

@Service()
export default class CreateCustomerRequestDto {
    @IsString()
    @IsOptional()
    fname?: string;

    @IsString()
    @IsOptional()
    lname?: string;
}