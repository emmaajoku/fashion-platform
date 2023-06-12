import { ItemModel } from './../../item/entities/item.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderModel } from 'app/order/entities/order.entity';


@ObjectType()
export class ShowModel {
  @Field(() => Int)
  id: number;

  @Field(() => [ItemModel])
  showItems: ItemModel[];

  @Field(() => [OrderModel])
  orders: OrderModel[];
}
