import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemModel } from 'app/item/entities/item.entity';
import { ShowModel } from 'app/show/entities/show.entity';

@ObjectType()
export class OrderModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => ItemModel)
  item: ItemModel;

  @Field(() => ShowModel)
  show: ShowModel;
}
