-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 0.9.4
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: votingapp | type: DATABASE --
-- DROP DATABASE IF EXISTS votingapp;
CREATE DATABASE votingapp
	ENCODING = 'UTF8'
	LC_COLLATE = 'English_India.1252'
	LC_CTYPE = 'English_India.1252'
	TABLESPACE = pg_default
	OWNER = postgres;
-- ddl-end --


-- object: "VotingApp" | type: SCHEMA --
-- DROP SCHEMA IF EXISTS "VotingApp" CASCADE;
CREATE SCHEMA "VotingApp";
-- ddl-end --
ALTER SCHEMA "VotingApp" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp" | type: SCHEMA --
-- DROP SCHEMA IF EXISTS "VotingApp_cp" CASCADE;
CREATE SCHEMA "VotingApp_cp";
-- ddl-end --
ALTER SCHEMA "VotingApp_cp" OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,"VotingApp","VotingApp_cp";
-- ddl-end --

-- object: "VotingApp_cp"."ElectionAdmin" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."ElectionAdmin" CASCADE;
CREATE TABLE "VotingApp_cp"."ElectionAdmin" (
	"userId" smallint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	username varchar NOT NULL,
	password varchar NOT NULL,
	email varchar NOT NULL,
	firstname varchar,
	lastname varchar,
	CONSTRAINT "ElectionAdmin_pk" PRIMARY KEY ("userId")
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."ElectionAdmin" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp".voters | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp".voters CASCADE;
CREATE TABLE "VotingApp_cp".voters (
	voterid smallint NOT NULL,
	password varchar,
	votername varchar NOT NULL,
	firstname varchar,
	lastname varchar NOT NULL,
	"electionId_Elections" smallint,
	CONSTRAINT voters_pk PRIMARY KEY (voterid)
);
-- ddl-end --
ALTER TABLE "VotingApp_cp".voters OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp"."Elections" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."Elections" CASCADE;
CREATE TABLE "VotingApp_cp"."Elections" (
	"electionId" smallint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	"adminId" smallint,
	"electionName" varchar,
	"customString" varchar,
	"userId_ElectionAdmin" smallint,
	"ballotId_Ballot" bigint,
	CONSTRAINT "Elections_pk" PRIMARY KEY ("electionId"),
	CONSTRAINT "customString" UNIQUE ("customString")
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."Elections" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp"."Ballot" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."Ballot" CASCADE;
CREATE TABLE "VotingApp_cp"."Ballot" (
	"ballotId" bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	"electionId" smallint,
	CONSTRAINT "Ballot_pk" PRIMARY KEY ("ballotId")
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."Ballot" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp"."Questions" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."Questions" CASCADE;
CREATE TABLE "VotingApp_cp"."Questions" (
	"questionId" bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	"ballotId" bigint,
	title text NOT NULL,
	"desc" text,
	"ballotId_Ballot" bigint,
	CONSTRAINT "Questions_pk" PRIMARY KEY ("questionId")
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."Questions" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp"."Options" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."Options" CASCADE;
CREATE TABLE "VotingApp_cp"."Options" (
	id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	choice text,
	"questionId" bigint,
	"questionId_Questions" bigint,
	CONSTRAINT "Options_pk" PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."Options" OWNER TO postgres;
-- ddl-end --

-- object: "VotingApp_cp"."Votes" | type: TABLE --
-- DROP TABLE IF EXISTS "VotingApp_cp"."Votes" CASCADE;
CREATE TABLE "VotingApp_cp"."Votes" (
	"voteId" bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	"questionId_Questions" bigint,
	"id_Options" bigint,
	voterid_voters smallint,
	CONSTRAINT "Votes_pk" PRIMARY KEY ("voteId")
);
-- ddl-end --
ALTER TABLE "VotingApp_cp"."Votes" OWNER TO postgres;
-- ddl-end --

-- object: "Elections_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp".voters DROP CONSTRAINT IF EXISTS "Elections_fk" CASCADE;
ALTER TABLE "VotingApp_cp".voters ADD CONSTRAINT "Elections_fk" FOREIGN KEY ("electionId_Elections")
REFERENCES "VotingApp_cp"."Elections" ("electionId") MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: "ElectionAdmin_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Elections" DROP CONSTRAINT IF EXISTS "ElectionAdmin_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Elections" ADD CONSTRAINT "ElectionAdmin_fk" FOREIGN KEY ("userId_ElectionAdmin")
REFERENCES "VotingApp_cp"."ElectionAdmin" ("userId") MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: "Ballot_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Questions" DROP CONSTRAINT IF EXISTS "Ballot_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Questions" ADD CONSTRAINT "Ballot_fk" FOREIGN KEY ("ballotId_Ballot")
REFERENCES "VotingApp_cp"."Ballot" ("ballotId") MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: "Questions_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Options" DROP CONSTRAINT IF EXISTS "Questions_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Options" ADD CONSTRAINT "Questions_fk" FOREIGN KEY ("questionId_Questions")
REFERENCES "VotingApp_cp"."Questions" ("questionId") MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: "Questions_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Votes" DROP CONSTRAINT IF EXISTS "Questions_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Votes" ADD CONSTRAINT "Questions_fk" FOREIGN KEY ("questionId_Questions")
REFERENCES "VotingApp_cp"."Questions" ("questionId") MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: "Options_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Votes" DROP CONSTRAINT IF EXISTS "Options_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Votes" ADD CONSTRAINT "Options_fk" FOREIGN KEY ("id_Options")
REFERENCES "VotingApp_cp"."Options" (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "Votes_uq" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Votes" DROP CONSTRAINT IF EXISTS "Votes_uq" CASCADE;
ALTER TABLE "VotingApp_cp"."Votes" ADD CONSTRAINT "Votes_uq" UNIQUE ("id_Options");
-- ddl-end --

-- object: voters_fk | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Votes" DROP CONSTRAINT IF EXISTS voters_fk CASCADE;
ALTER TABLE "VotingApp_cp"."Votes" ADD CONSTRAINT voters_fk FOREIGN KEY (voterid_voters)
REFERENCES "VotingApp_cp".voters (voterid) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "Ballot_fk" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Elections" DROP CONSTRAINT IF EXISTS "Ballot_fk" CASCADE;
ALTER TABLE "VotingApp_cp"."Elections" ADD CONSTRAINT "Ballot_fk" FOREIGN KEY ("ballotId_Ballot")
REFERENCES "VotingApp_cp"."Ballot" ("ballotId") MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "Elections_uq" | type: CONSTRAINT --
-- ALTER TABLE "VotingApp_cp"."Elections" DROP CONSTRAINT IF EXISTS "Elections_uq" CASCADE;
ALTER TABLE "VotingApp_cp"."Elections" ADD CONSTRAINT "Elections_uq" UNIQUE ("ballotId_Ballot");
-- ddl-end --

-- object: "grant_CU_eb94f049ac" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO postgres;
-- ddl-end --

-- object: "grant_CU_cd8e46e7b6" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO PUBLIC;
-- ddl-end --


