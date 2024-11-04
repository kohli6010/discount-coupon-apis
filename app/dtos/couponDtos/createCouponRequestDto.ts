import { IsObject, IsString } from "class-validator";

export default class CreateCouponRequestDto {
    @IsString()
    type: String;

    @IsObject()
    details: any;
}