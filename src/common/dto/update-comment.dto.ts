import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(10000)
  content?: string;
}