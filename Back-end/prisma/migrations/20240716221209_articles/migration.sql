-- CreateTable
CREATE TABLE "Aritcles" (
    "articleId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Aritcles_pkey" PRIMARY KEY ("articleId")
);

-- AddForeignKey
ALTER TABLE "Aritcles" ADD CONSTRAINT "Aritcles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
