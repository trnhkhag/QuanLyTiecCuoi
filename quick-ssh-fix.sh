#!/bin/bash

echo "🔑 QLTC SSH Key Quick Fix"
echo "========================"

echo ""
echo "📍 Step 1: SSH vào server hiện tại"
echo "Chạy lệnh:"
echo "ssh -i bizfly-key.pem root@103.153.72.156"

echo ""
echo "📍 Step 2: Trên server, chạy các lệnh sau:"
echo ""

cat << 'EOF'
# Tạo SSH key mới (ấn Enter cho tất cả prompt)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -N ""

# Add public key vào authorized_keys
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys

# Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/deploy_key
chmod 644 ~/.ssh/deploy_key.pub

echo ""
echo "🔑 NEW PRIVATE KEY (Copy toàn bộ):"
echo "=================================="
cat ~/.ssh/deploy_key
echo ""
echo "=================================="
EOF

echo ""
echo "📍 Step 3: Copy private key output vào GitHub Secret"
echo "- Vào GitHub → Settings → Secrets → Actions"
echo "- Edit secret PRIVATE_KEY"
echo "- Paste TOÀN BỘ nội dung (bao gồm -----BEGIN và -----END)"

echo ""
echo "📍 Step 4: Test deployment"
echo "git push origin auto-deploy --force-with-lease" 