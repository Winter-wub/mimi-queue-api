-- CreateEnum
CREATE TYPE "QueueUserStatus" AS ENUM ('CANCEL', 'ACTIVE');

-- CreateTable
CREATE TABLE "QueueUser" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "queue_id" INTEGER NOT NULL,
    "join_at" TIMESTAMP(3) NOT NULL,
    "cancel_at" TIMESTAMP(3) NOT NULL,
    "status" "QueueUserStatus" NOT NULL DEFAULT E'ACTIVE',

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueueUser" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueUser" ADD FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
