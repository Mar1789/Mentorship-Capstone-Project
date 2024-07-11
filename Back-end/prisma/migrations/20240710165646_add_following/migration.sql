-- CreateTable
CREATE TABLE "Follow" (
    "follow_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("follow_id")
);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
