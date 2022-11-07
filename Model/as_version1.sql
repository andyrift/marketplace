-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.0.0-beta
-- PostgreSQL version: 15.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: new_database | type: DATABASE --
-- DROP DATABASE IF EXISTS new_database;
CREATE DATABASE new_database;
-- ddl-end --


-- object: apple_sause | type: SCHEMA --
-- DROP SCHEMA IF EXISTS apple_sause CASCADE;
CREATE SCHEMA apple_sause;
-- ddl-end --
ALTER SCHEMA apple_sause OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,apple_sause;
-- ddl-end --

-- object: apple_sause.users | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.users CASCADE;
CREATE TABLE apple_sause.users (
	role_id integer NOT NULL,
	user_id integer NOT NULL,
	display_name text,
	username text,
	password_hash text,
	email text,
	avatar_link text,
	address text,
	deleted bit,
	CONSTRAINT users_pk PRIMARY KEY (user_id),
	CONSTRAINT username_uq UNIQUE (username)
);
-- ddl-end --
ALTER TABLE apple_sause.users OWNER TO postgres;
-- ddl-end --

-- object: apple_sause.posts | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.posts CASCADE;
CREATE TABLE apple_sause.posts (
	user_id integer NOT NULL,
	category_id integer NOT NULL,
	post_id integer NOT NULL,
	photo_links text,
	description text,
	address text,
	publication_timestamp timestamptz,
	favorite_count integer,
	view_count integer,
	closed bit,
	deleted bit,
	CONSTRAINT posts_pk PRIMARY KEY (post_id)
);
-- ddl-end --
ALTER TABLE apple_sause.posts OWNER TO postgres;
-- ddl-end --

-- object: apple_sause.messages | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.messages CASCADE;
CREATE TABLE apple_sause.messages (
	dialogue_id integer NOT NULL,
	sender_id integer NOT NULL,
	reciever_id integer NOT NULL,
	message_id integer NOT NULL,
	send_timestamp timestamptz,
	message_body text,
	CONSTRAINT messages_pk PRIMARY KEY (message_id)
);
-- ddl-end --
ALTER TABLE apple_sause.messages OWNER TO postgres;
-- ddl-end --

-- object: apple_sause.categories | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.categories CASCADE;
CREATE TABLE apple_sause.categories (
	category_id integer NOT NULL,
	category_name text,
	CONSTRAINT categories_pk PRIMARY KEY (category_id)
);
-- ddl-end --
ALTER TABLE apple_sause.categories OWNER TO postgres;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.posts DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE apple_sause.posts ADD CONSTRAINT user_fk FOREIGN KEY (user_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sender_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.messages DROP CONSTRAINT IF EXISTS sender_fk CASCADE;
ALTER TABLE apple_sause.messages ADD CONSTRAINT sender_fk FOREIGN KEY (sender_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: reciever_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.messages DROP CONSTRAINT IF EXISTS reciever_fk CASCADE;
ALTER TABLE apple_sause.messages ADD CONSTRAINT reciever_fk FOREIGN KEY (reciever_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: apple_sause.ratings | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.ratings CASCADE;
CREATE TABLE apple_sause.ratings (
	sender_id integer NOT NULL,
	reciever_id integer NOT NULL,
	rating integer,
	CONSTRAINT ratings_pk PRIMARY KEY (reciever_id,sender_id),
	CONSTRAINT five_star_rating_ck CHECK (rating >= 0 and rating <= 5)
);
-- ddl-end --
ALTER TABLE apple_sause.ratings OWNER TO postgres;
-- ddl-end --

-- object: reciever_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.ratings DROP CONSTRAINT IF EXISTS reciever_fk CASCADE;
ALTER TABLE apple_sause.ratings ADD CONSTRAINT reciever_fk FOREIGN KEY (reciever_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sender_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.ratings DROP CONSTRAINT IF EXISTS sender_fk CASCADE;
ALTER TABLE apple_sause.ratings ADD CONSTRAINT sender_fk FOREIGN KEY (sender_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: category_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.posts DROP CONSTRAINT IF EXISTS category_fk CASCADE;
ALTER TABLE apple_sause.posts ADD CONSTRAINT category_fk FOREIGN KEY (category_id)
REFERENCES apple_sause.categories (category_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: apple_sause.roles | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.roles CASCADE;
CREATE TABLE apple_sause.roles (
	role_id integer NOT NULL,
	role_name text,
	CONSTRAINT roles_pk PRIMARY KEY (role_id)
);
-- ddl-end --
ALTER TABLE apple_sause.roles OWNER TO postgres;
-- ddl-end --

-- object: role_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.users DROP CONSTRAINT IF EXISTS role_fk CASCADE;
ALTER TABLE apple_sause.users ADD CONSTRAINT role_fk FOREIGN KEY (role_id)
REFERENCES apple_sause.roles (role_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: apple_sause.dialogues | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.dialogues CASCADE;
CREATE TABLE apple_sause.dialogues (
	dialogue_id integer NOT NULL,
	post_id integer NOT NULL,
	customer_user_id integer NOT NULL,
	CONSTRAINT dialogues_pk PRIMARY KEY (dialogue_id)
);
-- ddl-end --
ALTER TABLE apple_sause.dialogues OWNER TO postgres;
-- ddl-end --

-- object: dialogue_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.messages DROP CONSTRAINT IF EXISTS dialogue_fk CASCADE;
ALTER TABLE apple_sause.messages ADD CONSTRAINT dialogue_fk FOREIGN KEY (dialogue_id)
REFERENCES apple_sause.dialogues (dialogue_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: post_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.dialogues DROP CONSTRAINT IF EXISTS post_fk CASCADE;
ALTER TABLE apple_sause.dialogues ADD CONSTRAINT post_fk FOREIGN KEY (post_id)
REFERENCES apple_sause.posts (post_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: customer_user_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.dialogues DROP CONSTRAINT IF EXISTS customer_user_fk CASCADE;
ALTER TABLE apple_sause.dialogues ADD CONSTRAINT customer_user_fk FOREIGN KEY (customer_user_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: apple_sause.favorites | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.favorites CASCADE;
CREATE TABLE apple_sause.favorites (
	user_id integer NOT NULL,
	post_id integer NOT NULL,
	CONSTRAINT favorites_pk PRIMARY KEY (user_id,post_id)
);
-- ddl-end --
ALTER TABLE apple_sause.favorites OWNER TO postgres;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.favorites DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE apple_sause.favorites ADD CONSTRAINT user_fk FOREIGN KEY (user_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: post_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.favorites DROP CONSTRAINT IF EXISTS post_fk CASCADE;
ALTER TABLE apple_sause.favorites ADD CONSTRAINT post_fk FOREIGN KEY (post_id)
REFERENCES apple_sause.posts (post_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: apple_sause.blacklist | type: TABLE --
-- DROP TABLE IF EXISTS apple_sause.blacklist CASCADE;
CREATE TABLE apple_sause.blacklist (
	blacklisting_user_id integer NOT NULL,
	blacklisted_user_id integer NOT NULL,
	CONSTRAINT blacklist_pk PRIMARY KEY (blacklisting_user_id,blacklisted_user_id)
);
-- ddl-end --
ALTER TABLE apple_sause.blacklist OWNER TO postgres;
-- ddl-end --

-- object: blacklisting_user_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.blacklist DROP CONSTRAINT IF EXISTS blacklisting_user_fk CASCADE;
ALTER TABLE apple_sause.blacklist ADD CONSTRAINT blacklisting_user_fk FOREIGN KEY (blacklisting_user_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: blacklistde_user_fk | type: CONSTRAINT --
-- ALTER TABLE apple_sause.blacklist DROP CONSTRAINT IF EXISTS blacklistde_user_fk CASCADE;
ALTER TABLE apple_sause.blacklist ADD CONSTRAINT blacklistde_user_fk FOREIGN KEY (blacklisted_user_id)
REFERENCES apple_sause.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: unique_dialogue | type: CONSTRAINT --
-- ALTER TABLE apple_sause.dialogues DROP CONSTRAINT IF EXISTS unique_dialogue CASCADE;
ALTER TABLE apple_sause.dialogues ADD CONSTRAINT unique_dialogue UNIQUE (customer_user_id,post_id);
-- ddl-end --


