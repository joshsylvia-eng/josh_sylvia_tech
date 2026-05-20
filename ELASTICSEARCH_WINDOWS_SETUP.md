# Elastic Search Windows Setup Guide

## Option 1: Using Chocolatey (Recommended)

```powershell
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Elastic Search
choco install elasticsearch -y

# Start Elastic Search service
Start-Service elasticsearch

# Set to start automatically
Set-Service -Name elasticsearch -StartupType Automatic
```

## Option 2: Manual Installation

### Download and Install
1. Download Elastic Search from: https://www.elastic.co/downloads/elasticsearch
2. Extract the ZIP file to a location (e.g., `C:\elasticsearch-8.11.0`)
3. Open PowerShell as Administrator

### Configure Security (Development)
For local development, disable security:
1. Edit `config/elasticsearch.yml` in the extracted folder
2. Add or modify:
```yaml
cluster.name: josh-sylvia-app
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
```

### Start Elastic Search
```powershell
cd C:\elasticsearch-8.11.0\bin
.\elasticsearch.bat
```

### Run as Service (Optional)
```powershell
# Install as service
.\elasticsearch-service.bat install

# Start service
.\elasticsearch-service.bat start

# Set to automatic startup
.\elasticsearch-service.bat manager
```

## Verify Installation

```powershell
# Test if Elastic Search is running
curl http://localhost:9200

# Or in PowerShell:
Invoke-WebRequest -Uri http://localhost:9200 -UseBasicParsing
```

You should see JSON output with cluster information.

## Update .env for Local Development

```bash
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
ELASTICSEARCH_INDEX=josh-expertise
```

Note: For local development with security disabled, leave username and password empty.

## Troubleshooting

### Check if Elastic Search is running
```powershell
# Check if port 9200 is listening
netstat -ano | findstr :9200

# Check service status (if installed as service)
Get-Service elasticsearch

# View logs
Get-Content C:\elasticsearch-8.11.0\logs\elasticsearch.log -Tail 50
```

### Common Issues

**Java not found:**
- Elastic Search requires Java 17 or later
- Install Java from: https://adoptium.net/

**Port already in use:**
- Check what's using port 9200
- Change port in `config/elasticsearch.yml`

**Memory issues:**
- Edit `config/jvm.options`:
```
-Xms1g
-Xmx1g
```

## Firewall

If Windows Firewall blocks connections:
```powershell
# Allow port 9200
New-NetFirewallRule -DisplayName "Elastic Search" -Direction Inbound -LocalPort 9200 -Protocol TCP -Action Allow
```

## Testing

After Elastic Search is running:
1. Restart your Node.js server
2. Test the search in your browser
3. You should see search results from Elastic Search
