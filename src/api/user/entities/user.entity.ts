import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { Expose } from "class-transformer";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
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

  // 회원가입 시 인증 토큰  
  @Prop({ required: false })
  verifyToken?: string;

  // 회원가입 시 인증 만료 시간
  @Prop({ required: false, expires: 0 })
  expiredAt?: Date;
  
  readonly isVerify: boolean;    
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;

  next();
})
 
UserSchema.virtual('isVerify').get(function () {
  return !this.verifyToken && !this.expiredAt;
});