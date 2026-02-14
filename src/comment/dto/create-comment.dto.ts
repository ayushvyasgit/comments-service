import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  authorName: string;

  @IsEmail()
  @IsOptional()
  authorEmail?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content: string;
}