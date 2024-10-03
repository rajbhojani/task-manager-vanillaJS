CREATE DATABASE task_manager;

USE task_manager;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'In-Progress', 'Completed') NOT NULL DEFAULT 'Pending'
);
