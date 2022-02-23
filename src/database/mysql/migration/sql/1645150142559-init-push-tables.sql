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

INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (1, 'hero-send-matching', '任務狀態更新', 'Hero要求接受任務', 'message', 0, 1, '2022-02-21 20:49:16', '2022-02-21 20:49:16', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (2, 'boss-reject-matching', '任務狀態更新', '你已被Boss拒絕', 'message', 0, 1, '2022-02-21 20:52:01', '2022-02-21 20:52:01', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (3, 'boss-accept-matching', '任務狀態更新', '你已成功接受任務', 'message', 0, 1, '2022-02-21 20:58:42', '2022-02-21 20:58:42', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (4, 'hero-abandon-matching', '任務狀態更新', 'Hero已放棄任務', 'message', 0, 1, '2022-02-21 20:58:42', '2022-02-21 20:58:42', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (5, 'hero-done-task', '任務狀態更新', 'Hero已完成任務，請確認', 'message', 0, 1, '2022-02-21 20:58:42', '2022-02-21 20:58:42', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (6, 'boss-confirm-done', '任務狀態更新', 'Boss確認已完成任務，恭喜你！', 'message', 0, 1, '2022-02-21 20:58:42', '2022-02-21 20:58:42', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (7, 'boss-reject-done', '任務狀態更新', 'Boss認為任務尚未完成，請在任務完成後重新申請', 'message', 0, 1, '2022-02-21 20:58:42', '2022-02-21 20:58:42', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (8, 'new-message-from-boss', '你收到boss的新訊息', null, 'message', 0, 1, '2022-02-23 19:40:03', '2022-02-23 19:40:03', 0, 0);
INSERT INTO hero.push_template (id, name, heading, content, landing, is_deleted, version, created_date, updated_date, created_by, updated_by) VALUES (9, 'new-message-from-hero', '你收到hero的新訊息', null, 'message', 0, 1, '2022-02-23 19:40:03', '2022-02-23 19:40:03', 0, 0);
