-- CreateTable
CREATE TABLE "Verify" (
    "codeId" TEXT NOT NULL,
    "resetCode" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Verify_pkey" PRIMARY KEY ("codeId")
);

-- AddForeignKey
ALTER TABLE "Verify" ADD CONSTRAINT "Verify_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
