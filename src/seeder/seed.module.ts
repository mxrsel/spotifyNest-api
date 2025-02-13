import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../schemas/artist.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { Composition, CompositionSchema } from '../schemas/composition.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/music'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Composition.name, schema: CompositionSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeedModule {}
