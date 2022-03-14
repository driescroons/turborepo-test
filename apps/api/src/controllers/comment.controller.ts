import { RequestContext } from "@mikro-orm/core";
import {
  Body,
  Controller,
  Get,
  OnUndefined,
  Param,
  Post,
  UseBefore,
  UseInterceptor,
} from "routing-controllers";
import { CommentBody } from "../contracts/body/comment.body";
import { CommentView } from "../contracts/views/comment.view";
import { Comment } from "../entities/comment.entity";
import validationMiddleware from "../middlewares/validation.middleware";
import { listRepresenter, representer } from "../utils/representer";

@Controller("/comments")
export class CommentController {
  @Get("/")
  @UseInterceptor(listRepresenter(CommentView))
  public async getComments() {
    const em = RequestContext.getEntityManager();
    return await em.findAndCount(
      Comment,
      {},
      { orderBy: { createdAt: "DESC" } }
    );
  }

  @Post("/")
  @UseBefore(validationMiddleware(CommentBody, "body"))
  @UseInterceptor(representer(CommentView))
  public async createComment(@Body() body: CommentBody) {
    const em = RequestContext.getEntityManager();
    const comment = em.create(
      Comment,
      {
        ...body,
        author: "John Doe",
      },
      { persist: true }
    );

    await em.flush();
    return comment;
  }

  // could be a "patch", because we're updating the upvotes count
  // but I see it more as a "creating an upvote"
  @Post("/:commentId/upvotes")
  @OnUndefined(204)
  public async upvoteComment(@Param("commentId") commentId: string) {
    const em = RequestContext.getEntityManager();
    const comment = await em.findOneOrFail(Comment, commentId);
    comment.upvotes++;
    await em.flush();
  }
}
