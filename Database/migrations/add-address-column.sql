-- Add DiaChi column to KhachHang table
ALTER TABLE KhachHang 
ADD COLUMN DiaChi VARCHAR(255) NULL AFTER Email; 