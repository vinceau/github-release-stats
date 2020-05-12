import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      table: 'download_count',
    },
  },
})
export class DownloadCount extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'release_id',
    },
  })
  releaseId: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'asset_id',
    },
  })
  assetId: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  downloads: number;

  @property({
    type: 'date',
    required: true,
  })
  tstz: Date;

  constructor(data?: Partial<DownloadCount>) {
    super(data);
  }
}

export interface DownloadCountRelations {
  // describe navigational properties here
}

export type DownloadCountWithRelations = DownloadCount & DownloadCountRelations;
