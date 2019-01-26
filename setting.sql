create database vps_db;
use vps_db;
create table if not exists user(
    user_id char(4) not null,
    login_id varchar(255) not null primary key,
    password varchar(255) not null,
    unique (user_id)
);

create table if not exists machine(
    open_id varchar(255) not null primary key,
    user_id char(4),
    name varchar(255) not null,
    display_name varchar(255) not null,
    description varchar(255),
    type enum('router', 'switch', 'vm') not null,
    x int unsigned not null,
    y int unsigned not null,
    unique (name),
    foreign key (user_id) references user (user_id)
);

create table if not exists port(
    open_id varchar(255) not null primary key,
    user_id char(4),
    machine_id varchar(255),
    name char(15),
    open_number int unsigned not null,
    ip_address varchar(15),
    mac_address char(17),
    foreign key (machine_id) references machine (open_id),
    foreign key (user_id) references user (user_id),
    unique (name)
);

create table if not exists veth(
    open_id varchar(255) not null primary key,
    user_id char(4),
    port1 varchar(255),
    port2 varchar(255),
    foreign key (port1) references port (open_id),
    foreign key (port2) references port (open_id),
    foreign key (user_id) references user (user_id)
);