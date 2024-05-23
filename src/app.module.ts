import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { VoteModule } from './vote/vote.module';
import { LoggerModule } from 'nestjs-pino';
import { User } from './auth/user.entity';
import { Profile } from './profile/profile.entity';
import { Vote } from './vote/vote.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PasswordToolService } from './utils/password-tool.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        database: configService.get('POSTGRES_DB'),
        port: parseInt(configService.get('POSTGRES_PORT'), 10),
        password: configService.get('POSTGRES_PASSWORD'),
        username: configService.get('POSTGRES_USER'),
        entities: [User, Profile, Vote],
        synchronize: true,
      }),
    }),
    AuthModule,
    ProfileModule,
    VoteModule,
  ],
  controllers: [],
  providers: [PasswordToolService],
})
export class AppModule {}
