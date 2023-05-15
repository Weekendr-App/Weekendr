import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsUrl, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @MinLength(2)
  @IsUrl()
  taxReturnsPicture: string;
}
