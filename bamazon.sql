CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
   	department_name VARCHAR(30) NOT NULL,
   	price INTEGER NOT NULL,
    stock_quantity INTEGER(1000),
    PRIMARY KEY (item_id)
    );

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) values ('Jane', 'Austen'); 
