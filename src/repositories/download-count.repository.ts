import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DownloadCount, DownloadCountRelations} from '../models';

export class DownloadCountRepository extends DefaultCrudRepository<
  DownloadCount,
  typeof DownloadCount.prototype.id,
  DownloadCountRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(DownloadCount, dataSource);
  }
}
