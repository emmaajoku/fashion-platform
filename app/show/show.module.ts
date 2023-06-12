import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowResolver } from './show.resolver';
import { DatabasesModule } from 'app/databases/databases.module';
import { ItemModule } from 'app/item/item.module';
import { OrderModule } from 'app/order/order.module';
import { ItemService } from 'app/item/item.service';
import { OrderService } from 'app/order/order.service';
import { ShowController } from './show.controller';

@Module({
  imports: [DatabasesModule, OrderModule, ItemModule],
  providers: [ShowResolver, ShowService, ItemService, OrderService],
  controllers: [ShowController],
})
export class ShowModule {}
