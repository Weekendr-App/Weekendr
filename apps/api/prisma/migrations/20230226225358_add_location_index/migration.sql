-- CreateIndex
CREATE INDEX "location_index" ON "Venue" USING GIST ("location");
