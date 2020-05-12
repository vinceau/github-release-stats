import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PsqldbDataSource} from '../datasources';
import {DownloadCount, DownloadCountRelations} from '../models';

export class DownloadCountRepository extends DefaultCrudRepository<
  DownloadCount,
  typeof DownloadCount.prototype.id,
  DownloadCountRelations
> {
  constructor(
    @inject('datasources.download_count') dataSource: PsqldbDataSource,
  ) {
    super(DownloadCount, dataSource);
  }
}
