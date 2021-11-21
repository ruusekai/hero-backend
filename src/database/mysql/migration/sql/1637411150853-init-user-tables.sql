CREATE TABLE IF NOT EXISTS user
(
    id int auto_increment
        primary key,
    username varchar(500) not null,
    password varchar(1000) not null
);