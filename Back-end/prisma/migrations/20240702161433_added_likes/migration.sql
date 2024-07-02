-- CreateTable
CREATE TABLE "Like" (
    "like_id" SERIAL NOT NULL,
    "Post_id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Text" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("like_id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_Post_id_fkey" FOREIGN KEY ("Post_id") REFERENCES "Posts"("Post_id") ON DELETE RESTRICT ON UPDATE CASCADE;
