import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItemModel {
  @Field(() => Int)
  id: number;

  @Field()
  itemName: string;

  @Field(() => Int)
  quantity: number;
}
