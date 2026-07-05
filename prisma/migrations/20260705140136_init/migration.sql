-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandConfig" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "commandName" TEXT NOT NULL,
    "mirrorEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoReply" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CommandConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "commandName" TEXT NOT NULL,
    "inputText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "responseText" TEXT,
    "mirrorStatus" TEXT NOT NULL DEFAULT 'pending',
    "mirrorRetries" INTEGER NOT NULL DEFAULT 0,
    "aiSummary" TEXT,
    "aiTag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_guildId_key" ON "Server"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "CommandConfig_serverId_commandName_key" ON "CommandConfig"("serverId", "commandName");

-- AddForeignKey
ALTER TABLE "CommandConfig" ADD CONSTRAINT "CommandConfig_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
