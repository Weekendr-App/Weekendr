import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { VenuesModule } from './venues/venues.module';
import { FirebaseMiddleware } from './common/firebase/firebase.middleware';
import { FirebaseGuard } from './common/firebase/firebase.guard';
import { FirebaseService } from './common/firebase/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    VenuesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
  providers: [FirebaseService, FirebaseGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseMiddleware).forRoutes('*');
  }
}
