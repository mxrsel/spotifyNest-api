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
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { ArtistDto } from './artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Role, Roles } from '../schemas/user.shema';
import { RolesPermitGuard } from '../roles-permit/roles-permit.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAll() {
    return this.artistModel.find({ isPublished: true });
  }
  @Get(':id')
  async getArtist(@Query('id') id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) throw new NotFoundException('Артист не найден');
    return artist;
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('artistImage', { dest: './public/uploads/artists' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistDto: ArtistDto,
  ) {
    const artist = new this.artistModel({
      name: artistDto.name,
      artistBio: artistDto.artistBio,
      artistImage:
        file && file.filename ? '/uploads/artists' + file.filename : null,
      isPublished: (artistDto.isPublished = true),
    });
    const newArtist = await artist.save();
    return newArtist;
  }
  @UseGuards(TokenAuthGuard, RolesPermitGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteGuide(@Param('id') id: string) {
    await this.artistModel.findByIdAndDelete(id);
    return { message: 'Artist deleted successfully.' };
  }
}
