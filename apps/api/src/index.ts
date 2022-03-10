import { App } from "./app";
import { CommentController } from "./controllers/comment.controller";

(async () => {
  const app = new App([CommentController]);
  await app.initConnection();
  app.listen();
})();
