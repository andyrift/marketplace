-- DROP DATABASE IF EXISTS apple_sause_db;
--CREATE DATABASE apple_sause_db
--	ENCODING = 'UTF8'
--	TABLESPACE = pg_default
--	OWNER = postgres;
-- ddl-end --


-- object: public.users | type: TABLE --
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	role_id integer NOT NULL,
	user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	displayname text,
	username text,
	password text,
	email text,
	picture_filename text,
	address text,
	deleted boolean DEFAULT false,
	joined_timestamp timestamp with time zone,
	rating real DEFAULT 0,
	CONSTRAINT users_pk PRIMARY KEY (user_id),
	CONSTRAINT username_uq UNIQUE (username)
);
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- -- object: public.users_user_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.users_user_id_seq CASCADE;
-- CREATE SEQUENCE public.users_user_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 0
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.posts | type: TABLE --
DROP TABLE IF EXISTS public.posts CASCADE;
CREATE TABLE public.posts (
	user_id integer NOT NULL,
	category_id integer NOT NULL,
	post_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	picture_filename text,
	price integer,
	title text,
	description text,
	address text,
	publication_timestamp timestamp with time zone,
	favorite_count integer DEFAULT 0,
	view_count integer DEFAULT 0,
	closed boolean DEFAULT false,
	deleted boolean DEFAULT false,
	CONSTRAINT posts_pk PRIMARY KEY (post_id)
);
-- ddl-end --
ALTER TABLE public.posts OWNER TO postgres;
-- ddl-end --

-- -- object: public.posts_post_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.posts_post_id_seq CASCADE;
-- CREATE SEQUENCE public.posts_post_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 1
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.posts_post_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.messages | type: TABLE --
DROP TABLE IF EXISTS public.messages CASCADE;
CREATE TABLE public.messages (
	dialogue_id integer NOT NULL,
	sender_id integer NOT NULL,
	message_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	send_timestamp timestamp with time zone,
	message_body text,
	CONSTRAINT messages_pk PRIMARY KEY (message_id)
);
-- ddl-end --
ALTER TABLE public.messages OWNER TO postgres;
-- ddl-end --

-- -- object: public.messages_message_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.messages_message_id_seq CASCADE;
-- CREATE SEQUENCE public.messages_message_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 0
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.messages_message_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.categories | type: TABLE --
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
	category_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	category_name text,
	CONSTRAINT categories_pk PRIMARY KEY (category_id)
);
-- ddl-end --
ALTER TABLE public.categories OWNER TO postgres;
-- ddl-end --

-- -- object: public.categories_category_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.categories_category_id_seq CASCADE;
-- CREATE SEQUENCE public.categories_category_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 1
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.ratings | type: TABLE --
DROP TABLE IF EXISTS public.ratings CASCADE;
CREATE TABLE public.ratings (
	reciever_id integer NOT NULL,
	sender_id integer NOT NULL,
	rating integer,
	CONSTRAINT five_star_rating_ck CHECK (((rating >= 0) AND (rating <= 5))),
	CONSTRAINT ratings_pk PRIMARY KEY (reciever_id,sender_id)
);
-- ddl-end --
ALTER TABLE public.ratings OWNER TO postgres;
-- ddl-end --

-- object: public.roles | type: TABLE --
DROP TABLE IF EXISTS public.roles CASCADE;
CREATE TABLE public.roles (
	role_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	role_name text,
	CONSTRAINT roles_pk PRIMARY KEY (role_id)
);
-- ddl-end --
ALTER TABLE public.roles OWNER TO postgres;
-- ddl-end --

-- -- object: public.roles_role_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.roles_role_id_seq CASCADE;
-- CREATE SEQUENCE public.roles_role_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 0
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.dialogues | type: TABLE --
DROP TABLE IF EXISTS public.dialogues CASCADE;
CREATE TABLE public.dialogues (
	post_id integer NOT NULL,
	customer_user_id integer NOT NULL,
	dialogue_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
	CONSTRAINT dialogues_pk PRIMARY KEY (dialogue_id),
	CONSTRAINT unique_dialogue UNIQUE (customer_user_id,post_id)
);
-- ddl-end --
ALTER TABLE public.dialogues OWNER TO postgres;
-- ddl-end --

-- -- object: public.dialogues_dialogue_id_seq | type: SEQUENCE --
-- -- DROP SEQUENCE IF EXISTS public.dialogues_dialogue_id_seq CASCADE;
-- CREATE SEQUENCE public.dialogues_dialogue_id_seq
-- 	INCREMENT BY 1
-- 	MINVALUE 1
-- 	MAXVALUE 2147483647
-- 	START WITH 1
-- 	CACHE 1
-- 	NO CYCLE
-- 	OWNED BY NONE;
-- 
-- -- ddl-end --
-- ALTER SEQUENCE public.dialogues_dialogue_id_seq OWNER TO postgres;
-- -- ddl-end --
-- 
-- object: public.favorites | type: TABLE --
DROP TABLE IF EXISTS public.favorites CASCADE;
CREATE TABLE public.favorites (
	user_id integer NOT NULL,
	post_id integer NOT NULL,
	CONSTRAINT favorites_pk PRIMARY KEY (user_id,post_id)
);
-- ddl-end --
ALTER TABLE public.favorites OWNER TO postgres;
-- ddl-end --

-- object: public.blacklist | type: TABLE --
DROP TABLE IF EXISTS public.blacklist CASCADE;
CREATE TABLE public.blacklist (
	blacklisting_user_id integer NOT NULL,
	blacklisted_user_id integer NOT NULL,
	CONSTRAINT blacklist_pk PRIMARY KEY (blacklisting_user_id,blacklisted_user_id)
);
-- ddl-end --
ALTER TABLE public.blacklist OWNER TO postgres;
-- ddl-end --

-- object: role_fk | type: CONSTRAINT --
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS role_fk CASCADE;
ALTER TABLE public.users ADD CONSTRAINT role_fk FOREIGN KEY (role_id)
REFERENCES public.roles (role_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE public.posts ADD CONSTRAINT user_fk FOREIGN KEY (user_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: category_fk | type: CONSTRAINT --
-- ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS category_fk CASCADE;
ALTER TABLE public.posts ADD CONSTRAINT category_fk FOREIGN KEY (category_id)
REFERENCES public.categories (category_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sender_fk | type: CONSTRAINT --
-- ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS sender_fk CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT sender_fk FOREIGN KEY (sender_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: dialogue_fk | type: CONSTRAINT --
-- ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS dialogue_fk CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT dialogue_fk FOREIGN KEY (dialogue_id)
REFERENCES public.dialogues (dialogue_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: reciever_fk | type: CONSTRAINT --
-- ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS reciever_fk CASCADE;
ALTER TABLE public.ratings ADD CONSTRAINT reciever_fk FOREIGN KEY (reciever_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sender_fk | type: CONSTRAINT --
-- ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS sender_fk CASCADE;
ALTER TABLE public.ratings ADD CONSTRAINT sender_fk FOREIGN KEY (sender_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: post_fk | type: CONSTRAINT --
-- ALTER TABLE public.dialogues DROP CONSTRAINT IF EXISTS post_fk CASCADE;
ALTER TABLE public.dialogues ADD CONSTRAINT post_fk FOREIGN KEY (post_id)
REFERENCES public.posts (post_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: customer_user_fk | type: CONSTRAINT --
-- ALTER TABLE public.dialogues DROP CONSTRAINT IF EXISTS customer_user_fk CASCADE;
ALTER TABLE public.dialogues ADD CONSTRAINT customer_user_fk FOREIGN KEY (customer_user_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE public.favorites ADD CONSTRAINT user_fk FOREIGN KEY (user_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: post_fk | type: CONSTRAINT --
-- ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS post_fk CASCADE;
ALTER TABLE public.favorites ADD CONSTRAINT post_fk FOREIGN KEY (post_id)
REFERENCES public.posts (post_id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: blacklisting_user_fk | type: CONSTRAINT --
-- ALTER TABLE public.blacklist DROP CONSTRAINT IF EXISTS blacklisting_user_fk CASCADE;
ALTER TABLE public.blacklist ADD CONSTRAINT blacklisting_user_fk FOREIGN KEY (blacklisting_user_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: blacklisted_user_fk | type: CONSTRAINT --
-- ALTER TABLE public.blacklist DROP CONSTRAINT IF EXISTS blacklisted_user_fk CASCADE;
ALTER TABLE public.blacklist ADD CONSTRAINT blacklisted_user_fk FOREIGN KEY (blacklisted_user_id)
REFERENCES public.users (user_id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
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


