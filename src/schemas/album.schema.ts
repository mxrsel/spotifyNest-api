import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
    default: null,
  })
  artist: string;
  @Prop({ required: true, default: null})
  released: string;
  @Prop({ default: null })
  albumImage: string;
  @Prop({ default: false })
  isPublished: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
