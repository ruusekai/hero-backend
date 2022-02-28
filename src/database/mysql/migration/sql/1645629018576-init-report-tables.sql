
create table if not exists report
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    user_uuid varchar(255) not null,
    type varchar(255) not null,
    ref_id varchar(255) not null,
    description varchar(1000),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint report_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint report_uuid_uindex
    unique (uuid)
    );
