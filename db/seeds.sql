INSERT INTO departments (dept_name) VALUES 
('Billing'), ('Technical Support'), ('IT Support');

INSERT INTO role (title, salary, dept_id) VALUES
('Billing Tier 1','28000',1),
('Tech Tier 1','28000',2),
('IT Specialist','42000',3),
('Billing Tier 2','32000',1),
('Tech Tier 2', '32000',2),
('Billing Supervisor','45000',1),
('Tech Supervisor','45000',2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Aiden','Russel', 2, 2),
('Theresa','Goldwin', 7, null),
('Liza','Hollingsworth', 1, 8),
('Hannah','Penman', 1, 8),
('Seamus','Gildroy', 3, null),
('Garret','Rhodes', 5, 2),
('Selena','Penman', 4, 8),
('Petra','Penman', 6, null);