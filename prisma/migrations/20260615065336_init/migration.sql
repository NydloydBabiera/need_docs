-- CreateTable
CREATE TABLE "user_information" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "folder_location" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_information_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "document_information" (
    "document_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_information_pkey" PRIMARY KEY ("document_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_information_email_key" ON "user_information"("email");

-- AddForeignKey
ALTER TABLE "document_information" ADD CONSTRAINT "document_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
