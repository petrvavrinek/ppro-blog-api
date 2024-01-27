import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostFavourite } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ListOptions } from 'src/utils/list.options';
import { PostService } from 'src/post/providers';
import { PostListOptions } from 'src/post/types';
import { User } from 'src/user/entities';
import { Post } from 'src/post/entities';

@Injectable()
export class PostFavouriteService {
  constructor(
    @InjectRepository(PostFavourite)
    private readonly PostFavouriteRepository: Repository<PostFavourite>,
    private readonly postService: PostService,
  ) {}

  findByUser(id: number, options?: ListOptions) {
    return this.PostFavouriteRepository.find({
      where: { user: { id } },
      relations: ['user', 'post', 'post.author'],
      order: {
        createdAt: 'DESC',
      },
      take: options?.take,
      skip: options?.skip,
    });
  }

  findFavouriteByUserId(userId: number, options?: PostListOptions) {
    return this.postService.findByQuery(
      (query) => {
        query
          .innerJoinAndSelect(
            PostFavourite,
            'favourite',
            'favourite.postId = post.id AND favourite.userId = :userId',
            { userId },
          )
          .orderBy('favourite.createdAt', 'DESC')
          .take(options?.list?.take)
          .skip(options?.list?.skip);
      },
      options?.finderId,
    );
  }

  findOne(userId: number, postId: number) {
    return this.PostFavouriteRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
      relations: ['post', 'user'],
    });
  }

  async addPostFavourite(user: User, post: Post) {
    const postFavourite = this.PostFavouriteRepository.create({ post, user });
    await this.PostFavouriteRepository.upsert(postFavourite, ['user', 'post']);
  }

  async deleteOne(favouritePost: PostFavourite) {
    await this.PostFavouriteRepository.delete(favouritePost);
  }
}
