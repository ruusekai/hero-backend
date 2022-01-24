
create table if not exists task
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,

    boss_user_uuid varchar(255) not null,
    category varchar(255),
    banner varchar(1000) not null,
    title varchar(1000) not null,
    description varchar(1000) not null,

    region_id varchar(255),
    district_id varchar(255),
    address varchar(1000),
    latitude varchar(255),
    longitude varchar(255),

    expiry_date timestamp,
    basic_cost_amt decimal,
    hero_reward_amt decimal,
    total_charge_amt decimal not null,
    currency varchar(255) default 'HKD' not null,

    admin_status varchar(255) not null,
    decline_reason varchar(255),
    admin_remarks varchar(5000),

    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint task_user_uuid_fk
    foreign key (boss_user_uuid) references user (uuid),
    constraint task_uuid_uindex
    unique (uuid)
);


--
-- create table if not exists task_hero_offer
-- (
--     id int auto_increment
--     primary key,
--     uuid varchar(255) not null,
--     task_uuid varchar(255) not null,
--     message_group_id varchar(255) not null,
--
--     is_deleted int default 0 not null,
--     version int default 1 not null,
--     record_state int default 0 not null,
--     created_date timestamp default CURRENT_TIMESTAMP not null,
--     updated_date timestamp default CURRENT_TIMESTAMP not null,
--     created_by int default 0 not null,
--     updated_by int default 0 not null,
--     constraint task_user_uuid_fk
--     foreign key (boss_user_uuid) references user (uuid),
--     constraint task_uuid_uindex
--     unique (uuid)
--     );
--
-- create table if not exists payment
-- (
--     id int auto_increment
--     primary key,
--     bill_type varchar(255) not null,
--     status varchar(255) not null,
--     ref_id varchar(1000) not null,
--     coupon_id varchar(5000) ,
--     amt number not null,
--     coupon_discount_amt number not null,
--     final_amt number not null,
--     currency varchar(255) not null default 'HKD',
--
--     is_deleted int default 0 not null,
--     version int default 1 not null,
--     record_state int default 0 not null,
--     created_date timestamp default CURRENT_TIMESTAMP not null,
--     updated_date timestamp default CURRENT_TIMESTAMP not null,
--     created_by int default 0 not null,
--     updated_by int default 0 not null,
--     constraint user_profile_user_uuid_fk
--     foreign key (user_uuid) references user (uuid)
-- );




create table if not exists coupon
(
    id int auto_increment
    primary key,
    code varchar(255) not null unique,
    type varchar(255) not null,
    name varchar(1000) not null,
    description varchar(1000),
    discount_value decimal not null,
    currency varchar(255) not null default 'HKD',
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
    );



create table if not exists user_coupon
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null unique,
    user_uuid varchar(255) not null,
    coupon_code varchar(255) not null,
    status varchar(255) not null,
    expiry_date timestamp,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_coupon_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint user_coupon_coupon_code_fk
    foreign key (coupon_code) references coupon (code),
    constraint user_coupon_uuid_uindex
    unique (uuid)
);
