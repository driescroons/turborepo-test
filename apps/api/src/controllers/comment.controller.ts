import { RequestContext, wrap } from "@mikro-orm/core";
import { randUser, seed } from "@ngneat/falso";
import {
  Body,
  Get,
  JsonController,
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

@JsonController("/comments")
export class CommentController {
  @Get("/")
  @UseInterceptor(listRepresenter(CommentView))
  public async getComments() {
    const em = RequestContext.getEntityManager();
    return await em.findAndCount(
      Comment,
      { parent: null },
      {
        orderBy: { createdAt: "DESC", children: { createdAt: "DESC" } },
        populate: ["children"],
      }
    );
  }

  @Post("/")
  @UseBefore(validationMiddleware(CommentBody, "body"))
  @UseInterceptor(representer(CommentView))
  public async createComment(@Body() body: CommentBody) {
    const em = RequestContext.getEntityManager();
    seed(body.seed);
    const { firstName, lastName } = randUser();

    const comment = em.create(
      Comment,
      {
        ...body,
        author: `${firstName} ${lastName}`,
      },
      { persist: true }
    );

    await em.flush();
    // wrapping for the toJSON method
    return wrap(comment);
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
