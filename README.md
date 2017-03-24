1h : 24h * 365d = 8,760
30m : 2 * 24h * 365d = 17,520
1m : 60 * 24h * 365d = 525,600
1s : 60 * 60 * 24h * 365d = 31,536,000

# nodesysm
system monitoring by node.js 

Needs
 - MySQL Server
 - npm install node-gcm
 

Mysql-Database
 - ndsysm

Mysql-User
 - admin : manager
 - neyer(e2017) : select only (everyone)
 - nactor(a2017) : insert, update, select, delete (localhost only)

###########################################################################
# table

2. mem
CREATE TABLE proc_mem (
	ino       INT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
	itime     TIMESTAMP NOT NULL ,
	total     BIGINT    NOT NULL ,
	free      BIGINT    NOT NULL ,
	avail     BIGINT    NOT NULL ,
	swap      BIGINT    NOT NULL 
) ENGINE=InnoDB ;

3. tcp (udp)
CREATE TABLE proc_tcp (
	ino       INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
	itime     TIMESTAMP   NOT NULL ,
	ntype     VARCHAR(8)  NOT NULL ,
	lip       VARCHAR(64) NOT NULL ,
	lport     INT         NOT NULL ,
	rip       VARCHAR(64) NOT NULL ,
	rport     INT         NOT NULL ,
	st        VARCHAR(16) NOT NULL ,
	tx_queue  INT ,
	rx_queue  INT 
) ENGINE=InnoDB ;

4. ipcq
CREATE TABLE proc_ipcq (
	ino       INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
	itime     VARCHAR(16) NOT NULL,
	qkey      VARCHAR(16) NOT NULL,
	msqid     INT         ,
	perms     VARCHAR(8)  ,
	cbytes    BIGINT      ,
	qnum      INT         ,
	lspid     INT         ,
	lrpid     INT         ,
	owner     VARCHAR(32) ,
	stime     VARCHAR(16) ,
	rtime     VARCHAR(16) ,
	ctime     VARCHAR(16) 
) ENGINE=InnoDB ;

/*
1. CPU
CREATE TABLE proc_cpu (
	ino       INT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
	itime     TIMESTAMP NOT NULL  ,
	user      INT ,
	system    INT ,
	nice      INT ,
	idle      INT ,
	pid1      INT ,
	pid2      INT ,
	pid3      INT 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

5. disk
CREATE TABLE proc_disk (
	ino       INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
	itime     TIMESTAMP   NOT NULL,
	key       VARCHAR(16) NOT NULL,
	msqid     INT         ,
	perms     VARCHAR(8)  ,
	cbytes    BIGINT      ,
	qnum      INT         ,
	lspid     INT         ,
	lrpid     INT         ,
	owner     VARCHAR(32) ,
	stime     VARCHAR(16) ,
	rtime     VARCHAR(16) ,
	ctime     VARCHAR(16) 
) ENGINE=InnoDB ;
*/
