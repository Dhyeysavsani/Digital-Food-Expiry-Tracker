USE dfet;

INSERT INTO users (name, email, password_hash) VALUES
('Demo User', 'demo@example.com', '$2a$10$8WJwH0a6s4eYf7k6Yw6rKOC2qDk6p9G8bq1xg7D1q3p5sQ1XfQ4bK');
-- password for the above bcrypt hash is: demopass

-- Seed items for the demo user (id=1). Adjust dates as needed.
INSERT INTO items (user_id, name, category, quantity, barcode, expiry_date, status) VALUES
(1, 'Milk 2%', 'Dairy', 1, '0123456789012', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'expiring'),
(1, 'Yogurt', 'Dairy', 4, '0987654321098', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'safe'),
(1, 'Chicken Breast', 'Meat', 2, NULL, DATE_ADD(CURDATE(), INTERVAL -1 DAY), 'expired'),
(1, 'Apples', 'Fruit', 6, NULL, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'safe'),
(1, 'Bread', 'Bakery', 1, NULL, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'expiring');