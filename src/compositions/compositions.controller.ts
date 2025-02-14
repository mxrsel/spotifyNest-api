import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import {
  Composition,
  CompositionDocument,
} from '../schemas/composition.schema';
import { CompositionDto } from './composition.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Role, Roles } from '../schemas/user.shema';
import { RolesPermitGuard } from '../roles-permit/roles-permit.guard';

@Controller('compositions')
export class CompositionsController {
  constructor(
    @InjectModel(Composition.name)
    private compositionModel: Model<CompositionDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  getAll() {
    return this.compositionModel.find({ isPublished: true });
  }
  @Get(':id')
  async getAlbum(@Query('id') id: string) {
    const composition = await this.compositionModel.findById(id);
    if (!composition) throw new NotFoundException('Трек не найден');
    return composition;
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() compositionDto: CompositionDto) {
    const album = await this.albumModel.findById(compositionDto.album);
    if (!album) throw new NotFoundException('Альбом не найден');

    const lastComposition = await this.compositionModel
      .findOne({ album: compositionDto.album })
      .sort({ composition_number: -1 });

    const newCompositionNumber = lastComposition
      ? lastComposition.composition_number + 1
      : 1;

    if (isNaN(newCompositionNumber)) {
      throw new Error('composition_number is not a number');
    }

    const composition = new this.compositionModel({
      name: compositionDto.name,
      album: compositionDto.album,
      timing: compositionDto.timing,
      composition_number: newCompositionNumber,
      isPublished: (compositionDto.isPublished = true),
    });
    const newComposition = await composition.save();
    return newComposition;
  }
  @UseGuards(TokenAuthGuard, RolesPermitGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteGuide(@Param('id') id: string) {
    await this.compositionModel.findByIdAndDelete(id);
    return { message: 'Composition deleted successfully.' };
  }
}
