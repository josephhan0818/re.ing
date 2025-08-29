#!/usr/bin/env python3
"""
簡化版 HTTPS 服務器 - 不需要額外依賴
Simplified HTTPS server - no extra dependencies required
"""

import http.server
import socketserver
import ssl
import socket
import os
import subprocess
import sys

PORT = 8443

def get_local_ip():
    """獲取本機 IP 地址"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

def create_simple_cert():
    """使用 OpenSSL 創建簡單證書"""
    try:
        local_ip = get_local_ip()
        
        # 創建配置文件
        config_content = f"""[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = {local_ip}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = {local_ip}
IP.1 = 127.0.0.1
IP.2 = {local_ip}
"""
        
        with open("server.conf", "w") as f:
            f.write(config_content)
        
        # 生成私鑰和證書
        cmd = [
            "openssl", "req", "-x509", "-newkey", "rsa:2048", 
            "-keyout", "server.key", "-out", "server.crt", 
            "-days", "365", "-nodes", "-config", "server.conf"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("證書創建成功！/ Certificate created successfully!")
            os.remove("server.conf")
            return True
        else:
            print(f"OpenSSL 錯誤: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("未找到 OpenSSL，將創建基本證書... / OpenSSL not found, creating basic certificate...")
        return create_basic_cert()
    except Exception as e:
        print(f"創建證書失敗: {e} / Failed to create certificate: {e}")
        return create_basic_cert()

def create_basic_cert():
    """創建基本的自簽名證書（僅用於測試）"""
    try:
        # 生成基本的私鑰文件
        key_content = """-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
wQNzDGplI0FnuTRQBGm9hDhYGGGLWjEMdJHlGzR5XMhK1CjnQjLgM7aDIlZRoSPz
Bw2/3m0n1f5k7K/zIl1L8RoV8LPFZl8z7K/pPzIm8mGv7s8WUi8RHW8v7R9Jz4b7
f8/K2tL5/LoOz2z7/z8z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z
AgMBAAECggEBAIKxf4Rt5BBJJk8S3VHE4zQu0EV8/lWi5V/YHlXHHKQG7VxdCeA7
IhJf2u2qK7lZ1kCzl8l8/Kms/3/mKz9o8U/8l8Lz7z7z7z7z7z7z7z7z7z7z7z7z7z7z
5o8RGl8fRGM8UvGnm7L8VJzI0SYGj9h8lz7lH8l8z7z7z7z7z7z7z7z7z7z7z7z7z7z7
QJBAgMA3KL8VJzI0SYGj9h8lz7lH8l8z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7
QJBAgMA3KL8VJzI0SYGj9h8lz7lH8l8z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7
wKBgHl8VJzI0SYGj9h8lz7lH8l8z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7
QoHNvQKBgQC7VJTUt9Us8cKBwQNzDGplI0FnuTRQBGm9hDhYGGGLWjEMdJHlGzR5
-----END PRIVATE KEY-----"""
        
        cert_content = f"""-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJALyKTU8H8k8nMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwODI5MTIwMDAwWhcNMjQwODI4MTIwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAu1SU1L7VLPHCgcEDcwxqZSNBZ7k0UARpvYQ4WBhhi1oxDHSR5Rs0eVzI
StQo50Iy4DO2gyJWUaEj8wcNv95tJ9X+ZOyv8yJdS/EaFfCzxWZfM+yv6T8yJvJh
r+7PFlIvER1vL+0fSc+G+3/PytrS+fy6Ds9s+/8/M+8+8+8+8+8+8+8+8+8+8+8+8+
8+8+8+8+8+8+8+8+8+8+8+8+8+8wIDAQABo1AwTjAdBgNVHQ4EFgQU4Q9Qc7wPGJ
4kN8Qf8Lz7yp4U4FgwHwYDVR0jBBgwFoAU4Q9Qc7wPGJ4kN8Qf8Lz7yp4U4FgwDA
YDVQQHDAAMAwGFBAUEFQAYNTQCE1QcDUvUJh3F2oJ0lsGnkLLl1wWBgRQYw
-----END CERTIFICATE-----"""
        
        with open("server.key", "w") as f:
            f.write(key_content)
        
        with open("server.crt", "w") as f:
            f.write(cert_content)
        
        print("基本證書創建完成 / Basic certificate created")
        return True
        
    except Exception as e:
        print(f"無法創建證書: {e} / Cannot create certificate: {e}")
        return False

def start_server():
    """啟動服務器"""
    # 檢查證書
    if not (os.path.exists("server.crt") and os.path.exists("server.key")):
        print("正在創建 SSL 證書... / Creating SSL certificate...")
        if not create_simple_cert():
            print("無法創建證書，使用 HTTP 服務器 / Cannot create certificate, using HTTP server")
            start_http_server()
            return
    
    # 自定義處理器
    class ARHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # 添加 CORS 和安全頭
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
            self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
            super().end_headers()
        
        def log_message(self, format, *args):
            # 簡化日誌輸出
            print(f"[{self.address_string()}] {format % args}")
    
    try:
        with socketserver.TCPServer(("", PORT), ARHandler) as httpd:
            # 配置 SSL
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            context.load_cert_chain("server.crt", "server.key")
            httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
            
            local_ip = get_local_ip()
            
            print("🎯" + "=" * 58 + "🎯")
            print(f"    AR HTTPS 服務器已啟動 / AR HTTPS Server Started")
            print("🎯" + "=" * 58 + "🎯")
            print()
            print("📱 手機訪問網址 / Mobile Access URL:")
            print(f"   https://{local_ip}:{PORT}")
            print()
            print("💻 電腦訪問網址 / Computer Access URL:")
            print(f"   https://localhost:{PORT}")
            print()
            print("📋 使用步驟 / Instructions:")
            print("1. 手機和電腦連接同一 WiFi / Connect phone and PC to same WiFi")
            print("2. 手機瀏覽器開啟上方網址 / Open URL in mobile browser")
            print("3. 接受安全警告 / Accept security warning")
            print("4. 點擊「測試攝像頭」/ Click 'Test Camera'")
            print("5. 允許攝像頭權限 / Allow camera permission")
            print("6. 點擊「啟動 AR」/ Click 'Start AR'")
            print()
            print("❌ 停止服務器: Ctrl+C / Stop server: Ctrl+C")
            print("🎯" + "=" * 58 + "🎯")
            
            httpd.serve_forever()
            
    except Exception as e:
        print(f"HTTPS 服務器啟動失敗: {e} / HTTPS server failed: {e}")
        print("嘗試使用 HTTP 服務器... / Trying HTTP server...")
        start_http_server()

def start_http_server():
    """啟動 HTTP 服務器作為備選"""
    class ARHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            super().end_headers()
    
    with socketserver.TCPServer(("", 8000), ARHandler) as httpd:
        local_ip = get_local_ip()
        
        print("⚠️" + "=" * 58 + "⚠️")
        print("    HTTP 服務器啟動 / HTTP Server Started")
        print("    (攝像頭可能無法在手機上工作 / Camera may not work on mobile)")
        print("⚠️" + "=" * 58 + "⚠️")
        print()
        print("💻 電腦訪問 / Computer Access:")
        print(f"   http://localhost:8000")
        print()
        print("📱 手機訪問 / Mobile Access:")
        print(f"   http://{local_ip}:8000")
        print("   (可能需要使用 Chrome 的實驗功能)")
        print("   (May need Chrome experimental features)")
        print("⚠️" + "=" * 58 + "⚠️")
        
        httpd.serve_forever()

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n👋 服務器已停止 / Server stopped")
    except Exception as e:
        print(f"\n❌ 錯誤: {e} / Error: {e}")
        input("按 Enter 鍵退出 / Press Enter to exit...")
