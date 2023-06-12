import { Module } from '@nestjs/common';
import { DatabasesModule } from 'app/databases/databases.module';
import { ItemModule } from 'app/item/item.module';
import { OrderService } from './order.service';

@Module({
  imports: [DatabasesModule, ItemModule],
  providers: [OrderService],
})
export class OrderModule {}
