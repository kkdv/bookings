const express = require('express');
const router = express.Router();
const cors = require('cors');
//const apiService = require('../server/index');
const pg = require('pg');
const Client = pg.Client;
pg.types.setTypeParser(1082, 'text', function (val) {
  return val;
});

const config = require('./config.js')
const client = new Client({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

const connect = async () => {
  console.log('Connecting to database...##');
  try {
    await client.connect()
  } catch (e) {
    console.log('error', e);
  }
};

connect()

async function fetchData() {
  await client.query(`create table if not exists Users (
          id serial primary key,
          username varchar not null,
          password varchar not null,
          name varchar not null
);`)

  const res = await client.query('select * from Users');
  return res;
}

router.get('/deleteCal', async (req, res) => {
  await client.query('DROP TABLE if exists Calendar');
  res.end();
});

router.get('/deleteUsers', async (req, res) => {
  await client.query('DROP TABLE Users');
  res.end();
});

router.get('/create', async (req, res) => {
  console.log("Creating table");
  await client.query(`create table if not exists Users (
      id serial primary key,
      username varchar not null unique,
      password varchar not null,
      name varchar not null
);`)

  res.end();
});

router.get('/createuser', async (req, res) => {
  await client.query(`create table if not exists Users (
      id serial primary key,
      username varchar not null unique,
      password varchar not null,
      name varchar not null
);`)
  await client.query(`insert into Users(username, password, name) values ('Fluffy', 'brazil', 'Fluffy The Cat ')`);
  await client.query(`insert into Users(username, password, name) values ('Lady', 'sweden', 'Lady Cat')`);
  await client.query(`insert into Users(username, password, name) values ('Serious', 'england', 'Serious Cat')`);
  await client.query(`insert into Users(username, password, name) values ('Salt', 'sales', 'salt')`);
  res.end();
});


router.get('/insertCal', async (req, res) => {
  const resdb = await client.query(`create table if not exists Calendar (
    id serial primary key,
    date date not null,
    year integer,
    month integer,
    day integer,
    weekday integer,
    availability integer,
    customer integer
);`);
  await client.query(`insert into Calendar(date) values (generate_series('2019-01-01'::date,'2023-12-31'::date,'1 day'::interval))`);
  res.send(resdb);
});

router.get('/genData', async (req, res) => {

  console.log("Generating data");



  try {
    console.log("calling drop table");
    await client.query('DROP TABLE Users');
  } catch (error) {
    console.log(error);
  }


  const resdb = await client.query(`create table if not exists Calendar (
    id serial primary key,
    date date not null,
    year integer,
    month integer,
    day integer,
    weekday integer,
    availability integer,
    customer integer
);`);



  await client.query("update Calendar set weekday = extract(isodow from date)");
  await client.query("update Calendar set day = date_part('day', date)");
  await client.query("update Calendar set month = date_part('month', date)");
  await client.query("update Calendar set year = date_part('year', date)");
  await client.query("update Calendar set availability = 1");
  res.send(201);
});

router.get('/initCal', async (req, res) => {
  await client.query('DROP TABLE if exists Calendar');
  await client.query(`create table if not exists Calendar (
    id serial primary key,
    date date not null,
    year integer,
    month integer,
    day integer,
    weekday integer,
    availability integer,
    customer integer
);`);
  await client.query(`insert into Calendar(date) values (generate_series('2019-01-01'::date,'2023-12-31'::date,'1 day'::interval))`);
  await client.query("update Calendar set weekday = extract(isodow from date)");
  await client.query("update Calendar set day = date_part('day', date)");
  await client.query("update Calendar set month = date_part('month', date)");
  await client.query("update Calendar set year = date_part('year', date)");
  await client.query("update Calendar set availability = 1");
  const calendarData = await client.query('select * from Calendar');
  res.send(201, calendarData);
});

router.get('/getCal', async (req, res) => {
  const resa = await client.query('select * from Calendar');
  res.send(resa.rows);
});

router.get('/getList', async (req, res) => {
  var list = await fetchData();
  res.send(list.rows);
});

module.exports = router;