import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CompositionDocument = Composition & Document;

@Schema()
export class Composition {
  @Prop({ required: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true, default: null })
  album: string;
  @Prop()
  timing: string;
  @Prop()
  composition_number: number;
  @Prop({ default: false })
  isPublished: boolean;
}

export const CompositionSchema = SchemaFactory.createForClass(Composition);