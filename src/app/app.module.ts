import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { ClaimsModule } from '../modules/claims/claims.module';
import { ConsultationsModule } from '../modules/consultations/consultations.module';
import { OutsourcingModule } from '../modules/outsourcing/outsourcing.module';
import { PaymentsModule } from '../modules/payments/payments.module';
import { QuotesModule } from '../modules/quotes/quotes.module';
import { DiasporaModule } from '../modules/diaspora/diaspora.module';
import { ResourcesModule } from '../modules/resources/resources.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    ClaimsModule,
    ConsultationsModule,
    OutsourcingModule,
    PaymentsModule,
    QuotesModule,
    DiasporaModule,
    ResourcesModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
