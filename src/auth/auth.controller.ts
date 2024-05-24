import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/sign-in.dto';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard())
  @Get('/get-all')
  async getAllUsers(@GetUser() user: User) {
    return this.authService.getAllUsers(user);
  }

  @UseGuards(AuthGuard())
  @Get('/get-one')
  async getOneUser(@Param('id') id: string) {
    return this.authService.getOneUser(id);
  }

  @UseGuards(AuthGuard())
  @Delete()
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @UseGuards(AuthGuard())
  @Patch()
  async patchUser(@Param('id') id: string, @Body() newUserPassword: string) {
    return this.authService.patchUser(id, newUserPassword);
  }

  @UseGuards(AuthGuard())
  @Post('/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.authService.uploadAvatar(id, avatar.filename as string);
  }
}
