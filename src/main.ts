import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getQueueToken } from "@nestjs/bullmq";
import type { Queue } from "bullmq";
import { AppModule } from "./app.module";
import { CRM_SYNC_QUEUE } from "./modules/ticket/infrastructure/queue/queue.constants";
import { registerBullBoard } from "./common/utils/bull-board.util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const crmQueue = app.get<Queue>(getQueueToken(CRM_SYNC_QUEUE));
  app.use("/admin/queues", registerBullBoard([crmQueue]));

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  new Logger("Bootstrap").log(`Ticket service listening on ${port}`);
  new Logger("Bootstrap").log("Bull Board available at /admin/queues");
}

bootstrap();
