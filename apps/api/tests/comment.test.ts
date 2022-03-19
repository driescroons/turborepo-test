import { Connection, IDatabaseDriver } from "@mikro-orm/core";
import {
  EntityManager,
  PostgreSqlDriver,
  SqlEntityManager,
} from "@mikro-orm/postgresql";
import { expect } from "chai";
import empty from "fs-extra/lib/empty";
import supertest, { SuperTest, Test } from "supertest";
import { App } from "../src/app";
import { CommentBody } from "../src/contracts/body/comment.body";
import { CommentController } from "../src/controllers/comment.controller";
import { Comment } from "../src/entities/comment.entity";

const commentsAmount = 5;

describe("Api tests", () => {
  let app: App;
  let request: SuperTest<Test>;

  before(async () => {
    app = new App([CommentController]);
    await app.initConnection();
    app.listen();

    request = supertest(app.getServer());
  });

  beforeEach(async () => {
    // populate it with some random data
    const em = app.getORM().em.fork();

    await em
      .getConnection()
      .execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await app.getORM().getMigrator().up();

    const comments = [...Array(commentsAmount)].map((_, index) => {
      return em.create(Comment, {
        text: `comment ${index}`,
        author: `John Doe ${index}`,
        seed: `${index}`,
      });
    });

    await em.persistAndFlush(comments);
  });

  describe("Comment tests", () => {
    it("Should get comments", async () => {
      const {
        body: { items, count },
      } = await request.get("/comments").expect(200);

      expect(items).to.be.lengthOf(commentsAmount);
      expect(count).to.be.equal(commentsAmount);
      expect(items[0].text).to.not.be.undefined;
      expect(items[0].author).to.not.be.undefined;
      expect(items[0].children).to.be.an("array");
      expect(items[0].children).to.be.lengthOf(0);
    });

    it("Should create a comment", async () => {
      const data: CommentBody = {
        text: "new comment",
        seed: "123",
      };

      let { body } = await request.post("/comments").send(data).expect(200);

      expect(body.text).to.be.equal(data.text);
      expect(body.seed).to.be.equal(data.seed);
      expect(body.author).to.not.be.undefined;
      expect(body.uuid).to.not.be.undefined;
      expect(body.upvotes).to.be.equal(0);
      expect(body.children).to.be.an("array");
      expect(body.children).to.be.lengthOf(0);

      const {
        body: { items, count },
      } = await request.get("/comments").expect(200).expect(200);

      expect(items.some((comment) => comment.uuid === body.uuid)).to.be.true;
      expect(items).to.be.lengthOf(commentsAmount + 1);
      expect(count).to.be.equal(commentsAmount + 1);
    });

    it("Should create a nested comment", async () => {
      const em = app.getORM().em.fork();
      const parent = await em.findOne(Comment, { parent: null });

      const data: CommentBody = {
        text: "new comment",
        seed: "123",
        parent: parent.uuid,
      };

      let { body } = await request.post("/comments").send(data).expect(200);

      expect(body.text).to.be.equal(data.text);
      expect(body.seed).to.be.equal(data.seed);
      expect(body.author).to.not.be.undefined;
      expect(body.uuid).to.not.be.undefined;
      expect(body.upvotes).to.be.equal(0);
      expect(body.children).to.be.an("array");
      expect(body.children).to.be.lengthOf(0);

      const {
        body: { items, count },
      } = await request.get("/comments").expect(200).expect(200);

      expect(
        items.some(
          (comment) =>
            comment.uuid === parent.uuid &&
            comment.children.some((nComment) => nComment.uuid === body.uuid)
        )
      ).to.be.true;
      expect(items).to.be.lengthOf(commentsAmount);
      expect(count).to.be.equal(commentsAmount);
    });

    it("Should upvote a comment", async () => {
      const em = app.getORM().em.fork();
      let [comment] = await em.find(Comment, {});

      await request.post(`/comments/${comment.uuid}/upvotes`).expect(204);

      em.clear();

      comment = await em.findOne(Comment, { uuid: comment.uuid });
      expect(comment.upvotes).to.be.equal(1);
    });
  });
});
