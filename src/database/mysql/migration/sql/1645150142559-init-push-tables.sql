create table if not exists push_audience
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    player_id varchar(255),
    language varchar(255),
    device_type int,

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint push_audience_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
    );



create table if not exists push_notification
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    player_ids JSON not null,
    is_success int default 0 not null,
    push_id varchar(255),
    push_message varchar(5000),
    one_signal_rsp varchar(5000),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
    );

create table if not exists push_template
(
    id int auto_increment
    primary key,
    name varchar(255),
    heading varchar(500),
    content varchar(1000),
    landing varchar(255),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
);
