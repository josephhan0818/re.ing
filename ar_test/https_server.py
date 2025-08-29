#!/usr/bin/env python3
"""
簡單的 HTTPS 服務器，用於在手機上測試 AR 應用
Simple HTTPS server for testing AR app on mobile devices
"""

import http.server
import socketserver
import ssl
import socket
import os
from pathlib import Path

# 配置
PORT = 8443
CERT_FILE = "server.crt"
KEY_FILE = "server.key"

def get_local_ip():
    """獲取本機 IP 地址"""
    try:
        # 連接到外部地址以獲取本機 IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

def create_self_signed_cert():
    """創建自簽名證書"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        import datetime
        
        print("正在創建自簽名證書... / Creating self-signed certificate...")
        
        # 生成私鑰
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # 創建證書
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "TW"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Taiwan"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "Taipei"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "AR Test"),
            x509.NameAttribute(NameOID.COMMON_NAME, get_local_ip()),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.DNSName(get_local_ip()),
                x509.IPAddress(socket.inet_aton(get_local_ip())),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # 保存證書和私鑰
        with open(CERT_FILE, "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        with open(KEY_FILE, "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        print("證書創建成功！/ Certificate created successfully!")
        return True
        
    except ImportError:
        print("需要安裝 cryptography 庫: pip install cryptography")
        print("Need to install cryptography library: pip install cryptography")
        return False
    except Exception as e:
        print(f"創建證書失敗: {e} / Failed to create certificate: {e}")
        return False

def start_https_server():
    """啟動 HTTPS 服務器"""
    
    # 檢查證書文件是否存在
    if not (os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE)):
        print("證書文件不存在，正在創建... / Certificate files not found, creating...")
        if not create_self_signed_cert():
            print("無法創建證書，退出 / Cannot create certificate, exiting")
            return
    
    # 創建 HTTP 服務器
    handler = http.server.SimpleHTTPRequestHandler
    
    # 添加 CORS 和安全頭
    class CustomHandler(handler):
        def end_headers(self):
            self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
            self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        # 配置 SSL
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(CERT_FILE, KEY_FILE)
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        local_ip = get_local_ip()
        
        print("=" * 60)
        print("🚀 HTTPS 服務器已啟動！/ HTTPS Server Started!")
        print("=" * 60)
        print(f"本機訪問 / Local access:")
        print(f"  https://localhost:{PORT}")
        print(f"  https://127.0.0.1:{PORT}")
        print()
        print(f"手機訪問 / Mobile access:")
        print(f"  https://{local_ip}:{PORT}")
        print()
        print("📱 手機使用步驟 / Mobile Instructions:")
        print("1. 確保手機和電腦在同一個 WiFi 網路")
        print("   Make sure phone and computer are on same WiFi")
        print("2. 在手機瀏覽器中輸入上方的手機訪問網址")
        print("   Enter the mobile access URL in phone browser")
        print("3. 接受安全警告（自簽名證書）")
        print("   Accept security warning (self-signed certificate)")
        print("4. 允許攝像頭權限")
        print("   Allow camera permission")
        print()
        print("⚠️  注意：首次訪問時瀏覽器會顯示安全警告，這是正常的")
        print("   Note: Browser will show security warning on first visit, this is normal")
        print()
        print("按 Ctrl+C 停止服務器 / Press Ctrl+C to stop server")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服務器已停止 / Server stopped")

if __name__ == "__main__":
    start_https_server()
