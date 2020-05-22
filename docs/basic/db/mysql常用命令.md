# mysql基础命令

* mysql win64 v5.7.19
* nodejs连接mysql库 -  [mysql](https://github.com/mysqljs/mysql)

### Mysql-Shell CRUD

#### 登陆
```
mysql -u root -p // -> mysql登陆
mysql -h 127.0.0.1 -u root -p // -> mysql远程登录

grant select,insert,update,delete on *.* to usernameDemo@localhost identified by "passwordDemo" // -> 添加用户 localhost->%远程登陆
```

#### CRUD
```
show databases;	 // -> 显示所有数据库

create database demo; // -> 建库
drop database demo; // -> 删库

use demo; // -> 切换库

create table TableName(FieldList); // -> 建表
create table <表名> ( <字段名1> <类型1> [,..<字段名n> <类型n>]);

describe TableName; // -> 查看表结构
rename table 原表名 to 新表名; 

delete from TableName; // -> 清除表中记录
drop table TableName; // -> 删表

/********** Retrieve ***********/
select * from TableName; // -> 查看表所有的记录
select <字段1，字段2，...> from < 表名 > where < 表达式 >;

/********** CREATE ***********/
insert into <表名> [( <字段名1>[,..<字段名n > ])] values ( 值1 )[, ( 值n )];

/********** DELETE ***********/
delete from 表名 where 表达式;

/********** UPDATE ***********/
UPDATE userinfo SET UserName = ?,UserPass = ? WHERE Id = ? // -> 更新数据
```

#### 函数
```
select COUNT(1) FROM userinfo; // -> 查看表中数据的条数
```


### nodejs连接mysql库

```

/**
 * Temp : mysql CRUD demo
 */

var mysql = require('mysql');

// db连接配置
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'mrzjd',
    password: 'qqzhang1995128',
    port: '3306',
    database: 'nodesample'
});

// db连接
connection.connect((err) => {
    if (err) {
        console.log('[query] - ' + err);
        return;
    }

    console.log('[connection connet] success!');
});

// db - insert query
function dbAddUser(conn, name, paswd) {
    var userAdd1 = 'INSERT INTO userinfo(id,Username, UserPass) VALUE(0,?,?)';
    var userAdd1Param = [name, paswd];
    conn.query(userAdd1, userAdd1Param, (err, rows, fields) => {
        if (err) {
            console.log('[query] - ' + err);
            return;
        }

        console.log('--------------INSERT---------------');
        console.log('INSERT ID: ', rows);
        console.log('-----------------------------------');
    });
}

// db - search query
function dbSelectUser(conn, name) {
    var userSelec = 'SELECT * FROM userinfo';
    conn.query(userSelec, (err, rows) => {
        if (err) {
            console.log('[query] - ' + err);
            return;
        }

        console.log('--------------SELECT----------------');
        console.log('Select Data: ', rows);
        console.log('------------------------------------');
    });
}

// db - delete query
function dbDeleteUser(conn, username) {
    var userDeleQuery = 'DELETE FROM userinfo WHERE Username = ?';

    conn.query(userDeleQuery, [username], (err, rows) => {
        if (err) {
            console.log('[query] - ' + err);
            return;
        }

        console.log('------------DELETE---------------');
        console.log('Delete Data: ', rows);
        console.log('---------------------------------');
    })
}

// db - update query
function dbUpdateUser(conn, username, newpaswd){
    var userUpdateQuery = 'UPDATE userinfo SET UserPass = ? WHERE Username = ?';

    conn.query(userUpdateQuery, [newpaswd, username], (err, rows) => {
        if (err) {
            console.log('[query] - ' + err);
            return;
        }

        console.log('------------UPDATE---------------');
        console.log('Update Data: ', rows);
        console.log('---------------------------------');
    })
}

// dbAddUser(connection, 'mrzjd', 'qq123');
// dbAddUser(connection, 'mrchou', 'qq456'); 
// dbDeleteUser(connection, 'Willson');
// dbUpdateUser(connection, 'mrchou', 'qq678');
dbSelectUser(connection);

// db断开连接
connection.end((err) => {
    if (err) {
        return;
    }

    console.log('[connection end] success!');
});

```


### More

* [sequelizejs](http://docs.sequelizejs.com/) - nodejs & mysql ORM
* 多表查询等进阶内容单独开文章，实战时深入学习