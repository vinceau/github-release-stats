import {Entity, model, property} from '@loopback/repository';

@model()
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
  })
  releaseId: string;

  @property({
    type: 'string',
    required: true,
  })
  assetId: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  downloadCount: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;


  constructor(data?: Partial<DownloadCount>) {
    super(data);
  }
}

export interface DownloadCountRelations {
  // describe navigational properties here
}

export type DownloadCountWithRelations = DownloadCount & DownloadCountRelations;
