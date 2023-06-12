import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabasesModule } from './databases/databases.module';
import { ShowModule } from './show/show.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        playground:
          configService.get('APP_ENV') === 'development' ||
          configService.get('APP_ENV') === 'production',
        debug: false,
        uploads: false,
        autoSchemaFile: join(process.cwd(), 'graphql-schema/schema.gql'),
        buildSchemaOptions: {
          numberScalarMode: 'integer',
        },
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3001'],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: [
            'X-Requested-With',
            'Content-Type',
            'X-Token-Auth',
            'Authorization',
          ],
          credentials: true,
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    DatabasesModule,
    AuthModule,
    ShowModule,
    ItemModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
