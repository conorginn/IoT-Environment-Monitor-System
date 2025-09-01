# Security Implementation Documentation

## Overview
This document details the security measures implemented in the Smart Home Environmental Monitoring System to protect data at rest and in transit across all components of the IoT architecture.

## Security Architecture

### 1. Hardware Security (Raspberry Pi 400)

**Implemented Measures:**
- **Default Password Change**: The default `pi` user password has been changed to a strong, unique password
- **SSH Key Authentication**: Password-based SSH login is disabled; only key-based authentication is permitted
- **Limited User Privileges**: Services run under limited user accounts with minimal permissions
- **Physical Security**: Device placed in a secure location with restricted physical access
- **Automatic Security Updates**: Unattended-upgrades package configured for automatic security patches

**Configuration Details:**
- SSH configuration in `/etc/ssh/sshd_config`:
  - `PasswordAuthentication no`
  - `PermitRootLogin no`
  - `PubkeyAuthentication yes`

### 2. Data Transmission Security

**PubNub Communication:**
- **TLS/SSL Encryption**: All communications use PubNub's TLS-enabled endpoints
- **Message Encryption**: AES-256 payload encryption with custom cipher key (`mySuperSecretCipherKey123!`)
- **PubNub Access Manager (PAM)**: Implemented with granular channel permissions
- **Authentication Keys**: Unique auth keys for publisher (Pi) and subscriber (web server)
- **Channel Security**: Restricted publish/subscribe permissions per device

**PAM Configuration:**
- Raspberry Pi granted publish-only rights to `home-env-data` channel
- Web server granted subscribe-only rights to `home-env-data` channel
- No devices have grant permissions (manage: false)

### 3. AWS Infrastructure Security

**EC2 Instance (Web Server):**
- **Security Group Rules**:
  - SSH (port 22): Restricted to specific IP address only
  - HTTP (port 80): Allowed from anywhere (redirects to HTTPS)
  - HTTPS (port 443): Allowed from anywhere
  - All other ports: Default deny
- **System Hardening**:
  - Uncomplicated Firewall (UFW) enabled with minimal rules
  - Fail2ban installed for SSH brute force protection
  - Automatic security updates enabled
  - Non-root user for application execution

**RDS Database:**
- **Network Isolation**: No public accessibility enabled
- **Security Group Rules**: Only allows connections from EC2 instance security group
- **Encryption at Rest**: AES-256 encryption enabled for database storage
- **Encryption in Transit**: SSL connections enforced between EC2 and RDS
- **Credential Security**: Database credentials stored in environment variables, not code

**Route 53 & SSL:**
- **HTTPS Enforcement**: All HTTP traffic redirected to HTTPS
- **SSL Certificate**: Let's Encrypt certificate automatically renewed
- **Modern TLS Configuration**: Strong cipher suites only (TLS 1.2+)

### 4. Web Application Security

**Node.js Express Server:**
- **Helmet.js**: Implemented for setting various HTTP security headers
- **CORS Configuration**: Restricted to specific origins in production
- **Rate Limiting**: Implemented on API endpoints to prevent abuse
- **Input Validation**: All inputs sanitized and validated
- **Dependency Scanning**: Regular npm audit for vulnerable dependencies

**Frontend Security:**
- **Content Security Policy (CSP)**: Implemented to prevent XSS attacks
- **HTTP Security Headers**:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security: max-age=31536000; includeSubDomains

### 5. Data Security

**Data at Rest:**
- **Database Encryption**: PostgreSQL data encrypted at rest using AWS RDS encryption
- **Sensitive Data**: No sensitive personal information stored in database
- **Environment Variables**: All secrets stored in environment variables, not version control

**Data in Transit:**
- **End-to-End Encryption**:
  - Pi to PubNub: TLS 1.2+ with payload encryption
  - PubNub to Web Server: TLS 1.2+ with payload encryption
  - Web Server to Browser: HTTPS with modern TLS configuration
  - Web Server to Database: SSL-encrypted PostgreSQL connection

### 6. Authentication & Authorization

**PubNub Authentication:**
- Device-specific UUIDs: `raspberry_pi_environment_sensor` and `aws_webserver_1`
- Unique auth keys for each device type
- Channel-level permissions restricting publish/subscribe capabilities

**API Security:**
- No authenticated API endpoints (read-only public data)
- Rate limiting on all API endpoints to prevent abuse
- Input validation and parameter sanitization

### 7. Monitoring & Logging

**Implemented Monitoring:**
- **AWS CloudWatch**: EC2 and RDS monitoring with alert thresholds
- **Application Logging**: Structured logging for all critical operations
- **Error Tracking**: Uncaught exceptions logged and monitored
- **Access Logging**: All HTTP requests logged with timestamp and IP

**Alert Configuration:**
- CPU utilization alerts (>80% for 5 minutes)
- Memory usage alerts (>90% for 5 minutes)
- Database connection count alerts
- SSH login attempt monitoring

### 8. Backup & Recovery

**Backup Strategy:**
- **RDS Automated Backups**: Daily snapshots with 7-day retention
- **Point-in-Time Recovery**: Enabled for database
- **Application Configuration**: Version controlled in GitHub repository
- **Disaster Recovery Plan**: Documented recovery procedures for all components

## Security Compliance

This implementation follows these best practices:
- OWASP IoT Security Guidelines
- OWASP Top 10 Web Application Security Risks
- AWS Well-Architected Framework Security Pillar
- GDPR principles (data minimization, encryption)

## Incident Response

**Security Incident Procedures:**
1. Immediate revocation of compromised credentials
2. Rotation of all encryption keys and passwords
3. Security group review and tightening
4. Log analysis for suspicious activities
5. Notification procedures for data breaches

## Regular Security Activities

**Maintenance Tasks:**
- Monthly security dependency updates
- Quarterly security group reviews
- Biannual credential rotation
- Annual security architecture review