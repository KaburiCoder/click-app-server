export const mongoSchemaTransform = (_, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}