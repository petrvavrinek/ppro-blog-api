import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post, PostTag } from '../entities';
import { ListOptions } from 'src/utils/list.options';

@Injectable()
export class PostTagService {
  constructor(
    @InjectRepository(PostTag)
    private readonly PostTagRepository: Repository<PostTag>,
  ) {}

  /**
   * Define tags in database
   * @param tags Tag array
   * @returns Tag entities
   */
  async defineTags(tags: string[]) {
    const existingTags = await this.PostTagRepository.find({
      where: {
        name: In(tags),
      },
    });
    const nonExistingTags = tags.filter(
      (e) => !existingTags.find((t) => t.name == e),
    );

    let tagEntities = nonExistingTags.map((e) => {
      const tag = new PostTag();
      tag.name = e;
      return tag;
    });
    tagEntities = await this.PostTagRepository.save(tagEntities);
    return [...tagEntities, ...existingTags];
  }

  /**
   * Find most used tags by name
   * @param term Term to find
   * @param options List options
   * @returns Array of tags
   */
  async findMostPopularTagsByName(
    term: string,
    options?: ListOptions,
  ): Promise<PostTagWithPostCount[]> {
    const result = await this.PostTagRepository.createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.numPosts', 'tag.posts')
      .where('tag.name LIKE :term', { term: `${term}%` })
      .limit(options?.take)
      .offset(options?.skip)
      .getMany();
    return result as never as PostTagWithPostCount[];
  }
}
type PostTagWithPostCount = Pick<PostTag, 'id' | 'name'> & {
  numPosts: number;
};
