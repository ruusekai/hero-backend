create table if not exists user
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    stripe_customer_id varchar(255),
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
    admin_status varchar(255) not null default 'pending',
    decline_reason varchar(255),
    admin_remarks varchar(5000),
    is_deleted int default 0 not null,
    version int default 1 not null,
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
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_profile_user_uuid_fk
    foreign key (user_uuid) references user (uuid)
);



create table if not exists bank
(
    code varchar(3) primary key,
    zh_name varchar(1000),
    en_name varchar(1000),
    is_virtual_bank int default 0 not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
);





create table if not exists user_bank
(
    id int auto_increment
    primary key,
    uuid varchar(255) not null,
    user_uuid varchar(255) not null,
    banking_card_file_uuid varchar(255) not null,
    full_name varchar(1000) not null,
    bank_code varchar(3) not null,
    bank_number varchar(255) not null,
    admin_status varchar(255) not null default 'pending',
    decline_reason varchar(255),
    admin_remarks varchar(5000),
    is_deleted int default 0 not null,
    version int default 1 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint user_bank_user_uuid_fk
    foreign key (user_uuid) references user (uuid),
    constraint user_bank_uindex
    unique (uuid)
);


INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('003', '????????????(??????)????????????', 'Standard Chartered Hong Kong', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('004', '????????????????????????????????????', 'Hongkong and Shanghai Banking Corporation', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('009', '??????????????????(??????)??????????????????', 'China Construction Bank (Asia)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('012', '????????????(??????)????????????', 'Bank of China (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:18', '2022-04-07 22:50:18', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('015', '????????????????????????', 'Bank of East Asia', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('016', '????????????(??????)????????????', 'DBS Bank (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('018', '??????????????????????????????', 'China CITIC Bank International', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('020', '??????????????????????????????', 'CMB Wing Lung Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('024', '????????????????????????', 'Hang Seng Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('025', '??????????????????????????????', 'Shanghai Commercial Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('027', '????????????(??????)????????????', 'Bank of Communications (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:18', '2022-04-07 22:50:18', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('028', '????????????(??????)????????????', 'Public Bank (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('035', '??????????????????????????????', 'OCBC Wing Hang Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('038', '????????????????????????', 'Tai Yau Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('039', '????????????????????????', 'Chiyu Banking Corporation', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('040', '????????????????????????', 'Dah Sing Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('041', '????????????????????????', 'Chong Hing Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('043', '??????????????????????????????', 'Nanyang Commercial Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('061', '????????????????????????', 'Tai Sang Bank', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('072', '??????????????????(??????)????????????', 'Industrial and Commercial Bank of China (Asia)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('128', '????????????(??????)????????????', 'Fubon Bank (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('250', '????????????(??????)????????????', 'Citibank (Hong Kong)', 0, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('387', '????????????????????????', 'ZA Bank Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('388', '????????????????????????', 'Livi Bank Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('389', 'Mox Bank', 'Mox Bank', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('390', '????????????????????????', 'WeLab Bank Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('391', '????????????????????????', 'Fusion Bank Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('392', '?????????????????????(??????)????????????', 'Ping An OneConnect Bank (Hong Kong) Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('393', '????????????(??????)????????????', 'Ant Bank (Hong Kong) Limited', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
INSERT INTO herouser.bank (code, zh_name, en_name, is_virtual_bank, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES ('395', '????????????????????????', 'Airstar Bank Limited ??', 1, 0, 1, '2022-04-07 22:50:19', '2022-04-07 22:50:19', 0, 0);
