import { RequestContext } from "@mikro-orm/core";
import {
  Body,
  Controller,
  Get,
  OnUndefined,
  Param,
  Post,
  UseBefore,
} from "routing-controllers";
import { CommentValidator } from "../contracts/validators/comment.validator";
import { Comment } from "../entities/comment.entity";
import validationMiddleware from "../middlewares/validation.middleware";

@Controller("/comments")
export class CommentController {
  @Get("/")
  public async getComments() {
    const em = RequestContext.getEntityManager();
    return await em.find(Comment, {});
  }

  @Post("/")
  @UseBefore(validationMiddleware(CommentValidator, "body"))
  public async createComment(@Body() body: CommentValidator) {
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
