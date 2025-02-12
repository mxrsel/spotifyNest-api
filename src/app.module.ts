import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { CompositionsController } from './compositions/compositions.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ArtistsController,
    AlbumsController,
    CompositionsController,
  ],
  providers: [AppService],
})
export class AppModule {}
