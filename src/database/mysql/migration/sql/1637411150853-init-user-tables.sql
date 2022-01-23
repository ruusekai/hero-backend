create table if not exists user
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    auth_type varchar(255) not null,
    mobile varchar(255) null,
    email varchar(1000) null,
    name varchar(1000) null,
    is_kyc int default 0 not null,
    is_boss int default 0 not null,
    is_hero int default 0 not null,
    lang varchar(255) default 'tc' not null,
    last_login_date timestamp,
    last_login_ip varchar(255),
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_uuid_uindex
    unique (uuid)
    );

create table if not exists user_basic_auth
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    username varchar(1000) null,
    password varchar(5000) null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_basic_auth_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    );


create table if not exists user_sms_token
(
    id int auto_increment
    primary key,
    mobile varchar(255) not null,
    type varchar(255) not null,
    token varchar(6) not null,
    expiry_date timestamp not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
);

create table if not exists user_kyc
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    user_uuid varchar(255) not null,
    kyc_id_file_uuid varchar(255) not null,
    selfie_file_uuid varchar(255) not null,
    full_name varchar(1000) not null,
    kyc_id_number varchar(255) not null,
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
    constraint user_kyc_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint user_kyc_uindex
    unique (uuid)
);


create table if not exists user_oauth_login_nonce
(
    id int auto_increment
    primary key,
    auth_type varchar(255) not null,
    nonce varchar(255) not null,
    expiry_date timestamp not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
);


create table if not exists user_oauth_facebook
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    facebook_id varchar(1000) not null,
    email varchar(1000) not null,
    name varchar(1000),
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_oauth_facebook_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
);



create table if not exists user_oauth_google
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    sub varchar(1000) not null,
    email varchar(1000) not null,
    email_verified int default 0 not null,
    name varchar(1000),
    picture varchar(1000),
    given_name varchar(255),
    family_name varchar(255),
    locale varchar(255),

    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_oauth_google_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
);


create table if not exists file
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    filename varchar(255) not null,
    full_path varchar(1000) not null,
    mimetype varchar(255) not null,
    original_filename varchar(1000) not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint file_uuid_uindex
    unique (uuid)
);



create table if not exists file_thumbnail
(
    id int auto_increment
    primary key,
    file_uuid varchar(255) not null,
    filename varchar(1000) not null,
    full_path varchar(1000) not null,

    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint file_thumbnail_file_uuid_fk
    foreign key (file_uuid) references file (uuid)
);

create table if not exists user_profile
(
    id int auto_increment
    primary key,
    user_uuid varchar(255) not null,
    icon varchar(1000) null,
    self_introduction varchar(5000) null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_profile_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
);

