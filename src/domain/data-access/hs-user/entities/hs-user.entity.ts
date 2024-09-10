import { mongoSchemaTransform } from "@/shared/utils/mongo-schema-transform.util";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
  timestamps: true,
  toJSON: { transform: mongoSchemaTransform },
  collection: "users",
})
export class HsUser {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  orgName: string;

  @Prop({ required: true })
  roomKey: string;

  @Prop()
  admin?: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'Settings' })
  // settings?: SettingsDoc;

  // createdAt?: Date;
  // updatedAt?: Date;
}

export type HsUserDocument = HydratedDocument<HsUser>;
export const HsUserSchema = SchemaFactory.createForClass(HsUser);