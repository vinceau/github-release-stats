// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {get} from '@loopback/rest';

export class ReleaseHistoryController {
  constructor() {}
  @get('/releases')
  getall() {
   return {
     hello: "world",
   };
  }
}
