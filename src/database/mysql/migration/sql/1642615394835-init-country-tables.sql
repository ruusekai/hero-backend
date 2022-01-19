


create table if not exists country
(
    id varchar(255) primary key,
    name varchar(500) not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null
    );

create table if not exists country_region
(
    id varchar(255) primary key,
    country_id varchar(255) not null,
    name varchar(500) not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint region_country_id_fk
    foreign key (country_id) references country (id)
    );


create table if not exists country_district
(
    id varchar(255) primary key,
    region_id varchar(255) not null,
    name varchar(500) not null,
    is_deleted int default 0 not null,
    version int default 1 not null,
    record_state int default 0 not null,
    created_date timestamp default CURRENT_TIMESTAMP not null,
    updated_date timestamp default CURRENT_TIMESTAMP not null,
    created_by int default 0 not null,
    updated_by int default 0 not null,
    constraint district_region_id_fk
    foreign key (region_id) references country_region (id)
    );


INSERT INTO country (id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HKG', '香港特別行政區', 0, 1, 0, '2022-01-19 23:29:28', '2022-01-19 23:29:28', 0, 0);

INSERT INTO country_region (id, country_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HK', 'HKG', '香港島', 0, 1, 0, '2022-01-19 23:32:34', '2022-01-19 23:32:34', 0, 0);
INSERT INTO country_region (id, country_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN', 'HKG', '九龍', 0, 1, 0, '2022-01-19 23:32:34', '2022-01-19 23:32:34', 0, 0);
INSERT INTO country_region (id, country_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT', 'HKG', '新界', 0, 1, 0, '2022-01-19 23:32:34', '2022-01-19 23:32:34', 0, 0);

INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HK-CNW', 'HK', '中西區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HK-E', 'HK', '東區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HK-S', 'HK', '南區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('HK-WC', 'HK', '灣仔區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN-KC', 'KLN', '九龍城區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN-KT', 'KLN', '觀塘區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN-SSP', 'KLN', '深水埗區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN-WTS', 'KLN', '黃大仙區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('KLN-YTM', 'KLN', '油尖旺區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-KNT', 'NT', '葵青區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-LS', 'NT', '離島區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-N', 'NT', '北區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-SK', 'NT', '西貢區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-ST', 'NT', '沙田區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-TM', 'NT', '屯門區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-TP', 'NT', '大埔區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-TW', 'NT', '荃灣區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
INSERT INTO country_district (id, region_id, name, is_deleted, version, record_state, created_date, updated_date, created_by, updated_by) VALUES ('NT-YL', 'NT', '元朗區', 0, 1, 0, '2022-01-19 23:38:23', '2022-01-19 23:38:23', 0, 0);
