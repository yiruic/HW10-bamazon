DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('01', 'apple', 'produce', 4, 100),
('02', 'milk', 'dairy', 6, 500),
('03', 'gelato', 'frozen food', 12, 2000),
('04', 'peanut butter', 'condiments', 7, 300),
('05', 'chicken', 'meat', 5, 100),
('06', 'chips', 'snacks', 3, 1000),
('07', 'pepper', 'spices', 2, 600);
