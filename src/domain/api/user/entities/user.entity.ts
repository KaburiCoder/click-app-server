import { mongoSchemaTransform } from "@/shared/utils/mongo-schema-transform.util";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from 'bcrypt'
import { Expose } from "class-transformer";

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
})
export class User {
  @Prop({ required: true })
  @Expose()
  hsUserId: string;

  @Prop({ required: true })
  @Expose()
  csUserId: string;

  @Prop({ required: true })
  @Expose()
  name: string;

  @Prop({ required: true })
  @Expose()
  email: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;

  next();
})