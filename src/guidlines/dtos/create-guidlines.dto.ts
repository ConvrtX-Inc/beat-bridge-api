import { ApiProperty } from "@nestjs/swagger";
import { GuidlinesTypesEnum } from "../guidlines.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateGuidlinesDto{

    @ApiProperty({ example : "termsCondition , privacyPolicy , faq"})
    @IsNotEmpty()
    type : GuidlinesTypesEnum;

    @ApiProperty({ example : "Questions for FAQ's" })
    @IsOptional()
    questions:string;

    @ApiProperty({ example : "Text Goes Here" })
    @IsNotEmpty()
    description : string;
}