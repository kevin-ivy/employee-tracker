INSERT INTO departments (dept_name) VALUES 
('Billing'), ('Technical Support'), ('IT Support');

INSERT INTO roles (title, salary, dept_id) VALUES
('Billing Tier 1','28000',1),
('Tech Tier 1','28000',2),
('IT Specialist','42000',3),
('Billing Tier 2','32000',1),
('Tech Tier 2', '32000',2),
('Billing Supervisor','45000',1),
('Tech Supervisor','45000',2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Aiden','Russel', 2, 8),
('Eri','Goldwin',2,8),
('Liza','Hollingsworth', 1, 9),
('Hannah','Penman', 1, 9),
('Seamus','Gildroy', 3, null),
('Garrett','Rhodes', 5, 8),
('Selena','Penman', 4, 9),
('Theresa','Goldwin', 7, null),
('Petra','Penman', 6, null);