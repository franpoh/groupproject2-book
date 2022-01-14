// --- SQL for Databases ------------------------------------------------------------------------ // 

create table "users" (
user_id serial primary key,
username varchar (20) unique not null,
email varchar (50) unique not null,
password varchar not null,
points int,
wishlist int[], // array of integers
type varchar not null
);

create table "reviews" (
review_id serial primary key,
review varchar (300) not null,
user_id int not null,
index_id int not null
);

create table "index" (
index_id serial primary key,
title varchar (50) unique not null,
author varchar (50) not null,
genre_id int,
);

create table "genres" (
genre_id serial primary key,
genre varchar (20) not null
);

create table "swap" (
swap_id serial primary key,
price int not null,
comments varchar (150),
index_id int not null,
user_id int not null
);