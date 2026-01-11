-- Inserare date (se execută automat la pornirea Spring Boot)

-- Clinici
INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CLINICA', 'Brașov', 'Strada Aurel Marin nr.3', '0268-123-456', 'Luni-Vineri: 9:00-18:00', '../images/brasovclinica.jpeg');

INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CLINICA', 'București', 'Strada Doamna Ghica nr.133', '021-456-789', 'Luni-Vineri: 8:00-20:00', '../images/bucuresticlinica.jpg');

INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CLINICA', 'Sibiu', 'Strada Semaforului nr.10', '0269-789-123', 'Luni-Sâmbătă: 9:00-17:00', '../images/sibiuc.jpg');

-- Centre de adopție
INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CENTRU_ADOPTIE', 'Brașov', 'Strada Lalelelor nr.12', '0763-988-156', 'Luni-Duminică: 10:00-18:00', '../images/adapost1.jpg');

INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CENTRU_ADOPTIE', 'Constanța', 'Strada Răscoalei nr.1907', '0763-988-156', 'Luni-Duminică: 9:00-19:00', '../images/adoptie_constanta1.jpg');

INSERT IGNORE INTO locations (tip, oras, adresa, telefon, program, image_url) 
VALUES ('CENTRU_ADOPTIE', 'Sibiu', 'Strada Bâlea nr.15', '0763-988-156', 'Luni-Vineri: 10:00-17:00', '../images/adapost2.jpg');

-- Inserează produsele
INSERT IGNORE INTO products (nume, categorie, pret, stoc, image_url, descriere) VALUES
('Hrana uscata pisici Whiskas', 'uscata', 45.00, 25, '../images/w.jpeg', 'Hrană completă și echilibrată pentru pisici adulte'),
('Conserva umeda Royal Canin', 'umeda', 22.00, 40, '../images/conserva_royal.jpeg', 'Hrană umedă premium pentru pisici'),
('Jucarie soricel pentru pisici', 'accesorii', 15.00, 60, '../images/jucarie.jpeg', 'Jucărie interactivă pentru pisici'),
('Asternut igienic', 'asternut', 39.00, 30, '../images/nisip.jpeg', 'Așternut igienic absorbant pentru pisici'),
('Hrana uscata caini Pedigree', 'uscata', 110.00, 20, '../images/p.jpeg', 'Hrană completă pentru câini adulți'),
('Lesa reglabila', 'accesorii', 49.00, 15, '../images/ham.jpeg', 'Lesă reglabilă rezistentă pentru câini'),
('Conserva pisici', 'umeda', 30.00, 0, '../images/conserva_pisici.jpeg', 'Conservă cu pește pentru pisici'),
('Nisip parfumat pisici', 'asternut', 55.00, 35, '../images/nisip_parfumat.jpeg', 'Nisip parfumat pentru litieră pisici');
