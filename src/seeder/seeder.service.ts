import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Composition,
  CompositionDocument,
} from '../schemas/composition.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Artist, ArtistDocument } from '../schemas/artist.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Composition.name)
    private compositionModel: Model<CompositionDocument>,
  ) {}
  async seed() {
    console.log('Creating fixtures');
    await this.artistModel.deleteMany({});
    await this.albumModel.deleteMany({});
    await this.compositionModel.deleteMany({});

    console.log('Collections created!');

    const [Logic, TwentyOnePilots] = await this.artistModel.create(
      {
        name: 'Logic',
        artistImage: 'fixtures/logic.png',
        isPublished: true,
      },
      {
        name: 'TwentyOnePilots',
        artistImage: 'fixtures/Twentyonepilots.png',
        isPublished: true,
      },
    );
    const [UnderPressure, Everybody, Blurryface, Trench] =
      await this.albumModel.create(
        {
          artist: Logic._id,
          name: 'Under Pressure',
          released: 2014,
          albumImage: 'fixtures/LogicUnderPressure.png',
          isPublished: true,
        },
        {
          artist: Logic._id,
          name: 'Everybody',
          released: 2017,
          albumImage: 'fixtures/LogicEverybody.png',
          isPublished: true,
        },
        {
          artist: TwentyOnePilots._id,
          name: 'Blurryface',
          released: 2015,
          albumImage: 'fixtures/BlurryfaceTwentyOnePilots.png',
          isPublished: true,
        },
        {
          artist: TwentyOnePilots._id,
          name: 'Trench',
          released: 2018,
          albumImage: 'fixtures/TrenchTwentyOnePilots.png',
          isPublished: true,
        },
      );
    await this.compositionModel.create(
      {
        album: UnderPressure._id,
        name: 'Soul Food',
        timing: '4:53',
        isPublished: true,
      },
      {
        album: UnderPressure._id,
        name: 'Bounce',
        timing: '4:05',
        isPublished: true,
      },
      {
        album: Everybody._id,
        name: 'Everybody',
        timing: '2:42',
        isPublished: true,
      },
      {
        album: Everybody._id,
        name: 'Ink Blot',
        timing: '2:36',
        isPublished: true,
      },
      {
        album: Blurryface._id,
        name: 'Heavydirtysoul',
        timing: '3:55',
        isPublished: true,
      },
      {
        album: Blurryface._id,
        name: 'Ride',
        timing: '3:35',
        isPublished: true,
      },
      {
        album: Trench._id,
        name: 'Chlorine',
        timing: '5:25',
        isPublished: true,
      },
      {
        album: Trench._id,
        name: 'Levitate',
        timing: '2:26',
        isPublished: true,
      },
    );
  }
}
