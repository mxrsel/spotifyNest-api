import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { AlbumsDto } from './albums.dto';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Role, Roles } from '../schemas/user.shema';
import { RolesPermitGuard } from '../roles-permit/roles-permit.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAll() {
    return this.albumModel.find({ isPublished: true });
  }
  @Get(':id')
  async getAlbum(@Query('id') id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) throw new NotFoundException('Альбом не найден');
    return album;
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('albumImage', { dest: './public/uploads/album' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: AlbumsDto,
  ) {
    const artist = await this.artistModel.findById(albumDto.artist);
    if (!artist) throw new NotFoundException('Артист не найден');
    const album = new this.albumModel({
      name: albumDto.name,
      artist: albumDto.artist,
      released: new Date().toDateString(),
      albumImage:
        file && file.filename ? '/uploads/album' + file.filename : null,
      isPublished: (albumDto.isPublished = true),
    });
    const newAlbum = await album.save();
    return newAlbum;
  }
  @UseGuards(TokenAuthGuard, RolesPermitGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteGuide(@Param('id') id: string) {
    await this.albumModel.findByIdAndDelete(id);
    return { message: 'Album deleted successfully.' };
  }
}
