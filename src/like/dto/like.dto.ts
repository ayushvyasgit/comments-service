import { IsString, IsNotEmpty } from 'class-validator';

export class LikeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}