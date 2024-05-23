import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { AuthModule } from '../auth/auth.module';
import { PasswordToolService } from 'src/utils/password-tool.service';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), AuthModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileRepository,
    PasswordToolService,
    ProfileResolver,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
