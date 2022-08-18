DROP DATABASE IF EXISTS computer_store;
CREATE DATABASE computer_store;
USE computer_store;

CREATE TABLE products (
	product_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    pName VARCHAR(255) NOT NULL,
	pType VARCHAR(255) NOT NULL,
    pAmount INTEGER NOT NULL 
);

CREATE TABLE orders (
	order_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_id INTEGER NOT NULL,
    forename VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    address VARCHAR(500),
    eircode VARCHAR(10) NOT NULL,
	city VARCHAR(100),
    county VARCHAR(100),
    order_date VARCHAR(10) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE tracking (
	tracking_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    courier VARCHAR(100) NOT NULL,
    shipping_date VARCHAR(100) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);
