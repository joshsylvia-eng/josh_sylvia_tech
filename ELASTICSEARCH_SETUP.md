# Elastic Search Server Setup Guide

## Installation on Linux Server

### Option 1: Using apt (Ubuntu/Debian)
```bash
# Import Elastic Search GPG key
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

# Add Elastic Search repository
sudo apt-get install apt-transport-https
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# Update and install
sudo apt-get update
sudo apt-get install elasticsearch

# Start and enable service
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

### Option 2: Using yum (RHEL/CentOS)
```bash
# Import GPG key
sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

# Add repository
sudo tee /etc/yum.repos.d/elasticsearch.repo <<EOF
[elasticsearch]
name=Elasticsearch repository
baseurl=https://artifacts.elastic.co/packages/8.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
EOF

# Install
sudo yum install elasticsearch

# Start and enable service
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

### Option 3: Using Docker on Server
```bash
# Pull and run Elastic Search
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0

# Or use Docker Compose (recommended)
```

## Configuration

### Basic Configuration
Edit `/etc/elasticsearch/elasticsearch.yml`:
```yaml
cluster.name: josh-sylvia-app
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
```

### Restart after configuration
```bash
sudo systemctl restart elasticsearch
```

## Verify Installation

```bash
# Check if Elastic Search is running
sudo systemctl status elasticsearch

# Test the API
curl -X GET 'localhost:9200'

# Should return JSON with cluster info
```

## Security (Production)

For production, enable security:
```yaml
# In /etc/elasticsearch/elasticsearch.yml
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

Then set passwords:
```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
```

## Firewall Configuration

```bash
# Allow Elastic Search port (if using firewall)
sudo ufw allow 9200/tcp
# or
sudo firewall-cmd --permanent --add-port=9200/tcp
sudo firewall-cmd --reload
```

## Update Application .env

On your server, update the `.env` file:
```bash
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=your_password
ELASTICSEARCH_INDEX=josh-expertise
```

If security is disabled (development):
```bash
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
ELASTICSEARCH_INDEX=josh-expertise
```

## Troubleshooting

### Check logs
```bash
sudo journalctl -u elasticsearch -f
```

### Check if port is listening
```bash
sudo netstat -tlnp | grep 9200
```

### Memory settings
If you have memory issues, edit `/etc/elasticsearch/jvm.options`:
```
-Xms1g
-Xmx1g
```

## Deployment Notes

- Ensure your server has at least 2GB RAM for Elastic Search
- For production, use a dedicated Elastic Search server or cluster
- Consider using managed services like AWS OpenSearch or Elastic Cloud for production deployments
