INSERT INTO department (name) 
VALUES ("Sales"),
       ("Engineering"), 
       ("Legal"), 
       ("Finance");

INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead", 10000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 19000, 3),
       ("Accountant", 125000, 4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Kaidan", "Alenko", 1, null),
       ("Liara","Tsoni", 3, null),
       ("Tali", "Zorah", 4, 2),
       ("Urdnot", "Wrex", 6, null),
       ("Garrus", "Vakarian", 2, 1),
       ("Miranda", "Lawson", 2, 1);
       
