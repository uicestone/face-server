# Migration `20200225153303-resident--age--name--unit---level`

This migration has been generated by koishi at 2/25/2020, 3:33:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Resident" ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "age" DROP DEFAULT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;

ALTER TABLE "public"."Unit" ADD COLUMN "level" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200224200758-optional-resident-name..20200225153303-resident--age--name--unit---level
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("PRISMA_DB_URL")
 }
 generator client {
   provider = "prisma-client-js"
@@ -50,10 +50,10 @@
 model Resident {
   id          String       @id
   level       AwareLevels
-  name        String
-  age         String
+  name        String?
+  age         String?
   unit        Unit
   community   Community
   passRecords PassRecord[]
 }
@@ -71,6 +71,7 @@
   id        String     @default(cuid()) @id
   community Community
   building  String
   room      String
+  level     String?
   residents Resident[]
 }
```


