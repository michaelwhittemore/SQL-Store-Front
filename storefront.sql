DROP DATABASE IF EXISTS bamazon;
-- create new database
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(30),
  department_name VARCHAR(30),
  price FLOAT,
  stock_quantity INTEGER,
  product_sales FLOAT DEFAULT 0
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES 
("IPA","Booze",2,10),
("Imperial Russian Stout","Booze",3,8),
("Non-Alcoholic Pale Lager","Booze",1.5,4),
("Red Leicester","Cheese",5,3),
("Runny Camembert","Cheese",4.5,3),
("Limburger","Cheese",5,3),
("Norwegian Blue Parrot","Pet",25,1),
("Coffee Cake","Pastry",3,10),
("Cheese Danish","Pastry",3.5,7);

CREATE TABLE departments (
department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30),
over_head_costs FLOAT
);
-- SELECT * FROM products
-- SELECT * FROM departments