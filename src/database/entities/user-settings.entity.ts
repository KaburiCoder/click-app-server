import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
export class UserSettings {
  @Prop({ required: true, ref: 'User', type: String })
  userId: string;

  @Prop({
    type: [{
      key: { type: String, required: true },
      order: { type: Number, required: true }
    }],
    default: [],
    _id: false,
  })
  vsWriteMenus: Array<{
    key: string;
    order: number;
  }>;
}

export type UserSettingsDocument = HydratedDocument<UserSettings>;
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);

UserSettingsSchema.index({ userId: 1 }, { unique: true });
