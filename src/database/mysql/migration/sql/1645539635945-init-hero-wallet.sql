
create table if not exists hero_wallet_history
(
    id int auto_increment
    primary key,
    ref_id varchar(255) not null,
    user_uuid varchar(255) not null,
    type varchar(255) not null,
    amount decimal(10,2) not null,


    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint hero_wallet_history_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
    );




create table if not exists hero_wallet_deposit
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,

    user_uuid varchar(255) not null,
    task_uuid varchar(255) not null,
    message_group_id varchar(255) not null,
    hero_reward_amt decimal(10,2) not null,

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint hero_wallet_deposit_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint hero_wallet_deposit_task_uuid_fk
    foreign key (task_uuid) references task (uuid),
    constraint hero_wallet_deposit_message_group_id_fk
    foreign key (message_group_id) references task_matching_attempt (message_group_id),
    constraint hero_wallet_deposit_uindex
    unique (uuid)
    );


create table if not exists hero_wallet_withdrawal_request
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,

    user_uuid varchar(255) not null,
    withdrawal_amt decimal(10,2) not null,
    withdrawal_status varchar(255) not null,
    decline_reason varchar(255),
    admin_remarks varchar(5000),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint hero_wallet_withdrawal_request_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint hero_wallet_withdrawal_request_uindex
    unique (uuid)
    );

