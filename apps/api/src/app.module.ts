import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { VenuesModule } from './venues/venues.module';
import { FirebaseMiddleware } from './common/firebase/firebase.middleware';
import { FirebaseGuard } from './common/firebase/firebase.guard';
import { FirebaseService } from './common/firebase/firebase.service';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { DateScalar } from './common/scalars/date.scalar';
import { UserService } from './user/user.service';
import { PrismaService } from './common/services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    VenuesModule,
    EventsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
  providers: [
    FirebaseService,
    FirebaseGuard,
    DateScalar,
    UserService,
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseMiddleware).forRoutes('*');
  }
}
