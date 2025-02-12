import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { CompositionsController } from './compositions/compositions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Composition, CompositionSchema } from './schemas/composition.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/music'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Composition.name, schema: CompositionSchema }
    ])
  ],
  controllers: [
    AppController,
    ArtistsController,
    AlbumsController,
    CompositionsController,
  ],
  providers: [AppService],
})
export class AppModule {}
