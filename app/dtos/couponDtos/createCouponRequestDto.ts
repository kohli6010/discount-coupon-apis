import { IsObject, IsString } from "class-validator";

export default class CreateCouponRequestDto {
    @IsString()
    type: string;

    @IsObject()
    details: any;
}