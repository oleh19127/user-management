import { IsNumber, IsOptional } from 'class-validator';

export class GetAllUserProfilesDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page: number;
}
