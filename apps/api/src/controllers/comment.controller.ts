import { RequestContext, wrap } from "@mikro-orm/core";
import { randUser, seed } from "@ngneat/falso";
import { Request } from "express";
import {
  Body,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Req,
  UseBefore,
  UseInterceptor,
} from "routing-controllers";
import { CommentBody } from "../contracts/body/comment.body";
import { CommentView } from "../contracts/views/comment.view";
import { Comment } from "../entities/comment.entity";
import validationMiddleware from "../middlewares/validation.middleware";
import { listRepresenter, representer } from "../utils/representer";
import { Server } from "socket.io";

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
  public async createComment(
    @Body() body: CommentBody,
    @Req() request: Request
  ) {
    const em = RequestContext.getEntityManager();
    seed(body.seed);
    const { firstName, lastName } = randUser();

    const comment = wrap(
      em.create(
        Comment,
        {
          ...body,
          author: `${firstName} ${lastName}`,
        },
        { persist: true }
      )
    );

    await em.flush();
    (request as Request & { io: Server }).io.emit("comment", comment);
    // wrapping for the toJSON method
    return comment;
  }

  // could be a "patch", because we're updating the upvotes count
  // but I see it more as a "creating an upvote"
  @Post("/:commentId/upvotes")
  @OnUndefined(204)
  public async upvoteComment(
    @Param("commentId") commentId: string,
    @Req() request: Request
  ) {
    const em = RequestContext.getEntityManager();
    const comment = await em.findOneOrFail(Comment, commentId);
    comment.upvotes++;
    await em.flush();
    (request as Request & { io: Server }).io.emit("upvote", comment);
  }
}
