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
    basic_cost_amt decimal(10,2),
    hero_reward_amt decimal(10,2) not null,
    service_charge_amt decimal(10,2) not null,
    total_charge_amt decimal(10,2) not null,
    currency varchar(255) default 'HKD' not null,

    admin_status varchar(255) not null default 'pending',
    decline_reason varchar(255),
    admin_remarks varchar(5000),

    payment_status varchar(255) default 'pending' not null,

    payment_intent_id varchar(255),
    post_status varchar(255) default 'available' not null,
    message_group_id varchar(255),
    hero_user_uuid varchar(255),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint task_user_uuid_fk
    foreign key (boss_user_uuid) references user (uuid),
    constraint task_uuid_uindex
    unique (uuid)
);


create table if not exists task_matching_attempt
(
    id int auto_increment
    primary key,
    message_group_id varchar(255) not null,
    hero_user_uuid varchar(255) not null,
    hero_name varchar(255) not null,
    boss_user_uuid varchar(255) not null,
    boss_name varchar(255) not null,
    task_uuid varchar(255) not null,
    is_matched int default 0 not null,
    status varchar(255) not null,
    is_message_group_active int default 0 not null,

    is_boss_reviewed int default 0 not null,
    is_hero_reviewed int default 0 not null,

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint task_matching_attempt_boss_uuid_fk
    foreign key (boss_user_uuid) references user (uuid),
    constraint task_matching_attempt_hero_uuid_fk
    foreign key (hero_user_uuid) references user (uuid),
    constraint task_matching_attempt_task_uuid_fk
    foreign key (task_uuid) references task (uuid),
    constraint tma_message_group_id_uindex
    unique (message_group_id)
    );



create table if not exists task_history
(
    id int auto_increment
    primary key,
    task_uuid varchar(255) not null,
    message_group_id varchar(255),
    user_uuid varchar(255),
    user_role varchar(255),
    action_type varchar(255),
    old_status varchar(255),
    new_status varchar(255),

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint task_history_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint task_history_message_group_id_fk
    foreign key (message_group_id) references task_matching_attempt (message_group_id),
    constraint task_history_task_uuid_fk
    foreign key (task_uuid) references task (uuid)
    );



create table if not exists payment_intent
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    stripe_customer_id varchar(255) not null,
    stripe_payment_intent_id varchar(255) not null,
    task_uuid varchar(255) not null,
    user_coupon_uuid varchar(255),
    coupon_discount_amt decimal(10,2),
    effective_coupon_discount_amt decimal(10,2),
    total_charge_amt decimal(10,2) not null,
    final_charge_amt decimal(10,2) not null,
    currency varchar(255) not null default 'hkd',
    stripe_payment_method_types varchar(1000),
    stripe_amount_capturable varchar(255),
    stripe_amount_received varchar(255),
    stripe_canceled_at timestamp,
    stripe_cancellation_reason varchar(255),
    stripe_status varchar(255) not null,

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint payment_intent_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint payment_intent_task_uuid_fk
    foreign key (task_uuid) references task (uuid)
);


create table if not exists stripe_webhook
(
    id int auto_increment
    primary key,
    stripe_payment_intent_id varchar(255) not null,
    webhook varchar(5000) not null,

    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
)


create table if not exists coupon
(
    id int auto_increment
    primary key,
    code varchar(255) not null unique,
    type varchar(255) not null,
    name varchar(1000) not null,
    description varchar(1000),
    discount_value decimal(10,2) not null,
    currency varchar(255) not null default 'HKD',
    is_deleted int default 0 not null,
    version int default 1 not null,
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



create table if not exists admin_pinned_task
(
    id int auto_increment
    primary key,
    task_uuid varchar(255) not null,
    seq int not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint admin_pinned_task_task_uuid_fk
    foreign key (task_uuid) references task (uuid)
);
