import {DefaultCrudRepository} from '@loopback/repository';
import {DownloadCount, DownloadCountRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DownloadCountRepository extends DefaultCrudRepository<
  DownloadCount,
  typeof DownloadCount.prototype.id,
  DownloadCountRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DownloadCount, dataSource);
  }
}
