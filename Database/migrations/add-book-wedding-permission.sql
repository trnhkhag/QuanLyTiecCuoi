-- Add BOOK_WEDDING permission for customers
INSERT INTO Quyen (ID_Quyen, Ten_Quyen, MoTa, GiaTri)
VALUES (9, 'book_wedding', 'Đặt tiệc cưới cho khách hàng', 256);

-- Assign BOOK_WEDDING permission to customer role (ID 7)  
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
VALUES (7, 9); 