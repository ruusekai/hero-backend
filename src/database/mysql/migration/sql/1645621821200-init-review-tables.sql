
create table if not exists review
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    message_group_id varchar(255) not null,
    from_user_uuid varchar(255) not null,
    from_user_role varchar(255) not null,
    from_user_name varchar(255) not null,
    target_user_uuid varchar(255) not null,
    target_user_role varchar(255) not null,
    target_user_name varchar(255) not null,
    score int not null,
    description varchar(1000) not null,

    admin_status varchar(255) not null default 'pending',
    decline_reason varchar(255),
    admin_remarks varchar(5000),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint review_from_user_uuid_fk
    foreign key (from_user_uuid) references user (uuid),
    constraint review_target_user_uuid_fk
    foreign key (target_user_uuid) references user (uuid),
    constraint review_uuid_uindex
    unique (uuid)
);
