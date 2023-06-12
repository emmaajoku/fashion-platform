import { Module } from '@nestjs/common';
import { DatabasesModule } from 'app/databases/databases.module';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
  imports: [DatabasesModule],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
