# 🔑 SSH Key Fix Guide

## ❌ **Lỗi hiện tại:**
```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

## 🔍 **Kiểm tra Private Key format:**

### **✅ Format ĐÚNG:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAIEAyVkqH...
-----END OPENSSH PRIVATE KEY-----
```

### **✅ Hoặc RSA format:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAyVkqH0l7...
-----END RSA PRIVATE KEY-----
```

## 🔧 **CÁCH SỬA:**

### **1️⃣ Tạo SSH Key mới trên server:**
```bash
# SSH vào server
ssh -i bizfly-key.pem root@103.153.72.156

# Tạo SSH key pair mới
ssh-keygen -t rsa -b 4096 -C "qltc-deploy-key"

# Xem private key
cat ~/.ssh/id_rsa

# Xem public key  
cat ~/.ssh/id_rsa.pub
```

### **2️⃣ Add public key vào authorized_keys:**
```bash
# Thêm public key vào file authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### **3️⃣ Copy private key vào GitHub Secrets:**
- Copy TOÀN BỘ nội dung file `~/.ssh/id_rsa` (bao gồm header/footer)
- Paste vào GitHub Secret `PRIVATE_KEY`

### **4️⃣ Test SSH connection:**
```bash
# Từ máy local, test SSH
ssh -i private-key-file root@103.153.72.156
``` 