-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "telno" TEXT NOT NULL DEFAULT E'';

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "active" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
