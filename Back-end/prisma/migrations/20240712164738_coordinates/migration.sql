-- CreateTable
CREATE TABLE "Coord" (
    "coordId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "Coord_pkey" PRIMARY KEY ("coordId")
);

-- AddForeignKey
ALTER TABLE "Coord" ADD CONSTRAINT "Coord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
