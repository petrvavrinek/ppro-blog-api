import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Post, PostTag } from '../entities';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class PostTagService {
  private readonly _postTagsTableName: string;

  constructor(
    @InjectRepository(PostTag)
    private readonly PostTagRepository: EntityRepository<PostTag>,
    private readonly EntityManager: EntityManager,
  ) {
    const metadata = EntityManager.getMetadata();
    this._postTagsTableName = metadata.get(PostTag).tableName;

    this.findMostPopularTags('test');
  }

  /**
   * Define tags in database
   * @param tags Tag array
   * @returns Tag entities
   */
  defineTags(tags: string[]) {
    const tagEntities = tags.map((e) => {
      const tag = new PostTag();
      tag.name = e;
      return tag;
    });

    return this.PostTagRepository.upsertMany(tagEntities);
  }

  async findMostPopularTags(term: string) {
    console.log(this._postTagsTableName);
    // let knex = this.EntityManager.fork()
    //   .createQueryBuilder(PostTag, 'tag')
    //   .getKnex();
    // knex = knex
    //   .select(
    //     '*',
    //     `(SELECT COUNT(*) FROM ${this._postTagsTableName} p WHERE p.id = tag.id) as c`,
    //     'tag',
    //   )
    //   .from(this._postTagsTableName);

    // const res = await this.EntityManager.getConnection().execute(knex);
    // console.log(res);

    const tags = await this.EntityManager.fork();
    // , 'COUNT(posts.id) as post_count'

    // .orderBy({ post_count: QueryOrder.DESC })

    return tags;
  }
}
