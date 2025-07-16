# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a legal case management system (CRM) for judicial proceedings, built as a single-page application using vanilla HTML/CSS/JavaScript. The system manages court cases from initial submission through final resolution, with Telegram-based authentication and real-time status tracking.

**Language**: Russian (UI, comments, and documentation)
**Technology**: Pure HTML/CSS/JavaScript (no framework/build system)
**Deployment**: Docker with Nginx serving static files

## Architecture

### Structure
- **Monolithic Frontend**: Single `index.html` file (1288 lines) containing all HTML, CSS, and JavaScript
- **API Integration**: RESTful communication with backend at `https://bot.primelegal.kz/api`
- **Authentication**: Telegram OAuth via @LawyerTorekhanBot
- **State Management**: Session-based with JWT tokens in sessionStorage

### Key Components (within index.html)
- **Authentication System**: Telegram widget integration and token management
- **Dashboard**: Statistics overview with case counts and deadline tracking
- **Case Management**: CRUD operations with status workflow
- **Filtering System**: Team-based filters with server persistence
- **Export Functions**: CSV generation and report creation

## Development Commands

### Docker Operations
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Rebuild after changes
docker-compose up -d --build

# Stop services
docker-compose down
```

### File Serving
Since this is a static application, changes to `index.html` require container restart:
```bash
docker-compose restart frontend
```

## API Endpoints

The application communicates with these backend endpoints:
- `POST /auth/telegram` - Telegram authentication
- `GET /auth/me` - Current user information
- `GET /cases` - Retrieve cases with filtering
- `POST /cases` - Create new case
- `PUT /cases/:id` - Update case
- `DELETE /cases/:id` - Delete case
- `GET /users` - Get users list for assignments
- `GET /team-filters` - Retrieve saved team filters
- `POST /team-filters` - Save team filter preferences

## Case Management Workflow

### Case Statuses
1. `submitted` - Подано в суд
2. `pending_check` - На проверке
3. `accepted` - Принято
4. `returned` - Возвращено
5. `closed` - Дело закрыто
6. `decision_made` - Решение принято
7. `appeal` - Обжалование

### Business Logic
- **End Date Calculation**: Automatically set to 23 business days from acceptance
- **User Roles**: `lawyer` and `assistant` with different permissions
- **Team Filters**: Persistent per-user filtering saved on server
- **Deadline Tracking**: Automatic highlighting of cases approaching deadlines

## Key Features

### Authentication
- Telegram bot integration for secure login
- JWT token management in sessionStorage
- Automatic token validation and refresh

### Case Tracking
- Full case lifecycle management
- Hearing date scheduling
- Responsible person assignment
- Status-based workflow with automatic transitions

### Data Management
- Real-time search and filtering
- CSV export functionality
- Team-based data organization
- Persistent user preferences

## Deployment Configuration

### Docker Setup
- **Frontend Container**: nginx:alpine serving static files on port 8081
- **Network**: Uses `legal-network` for service communication
- **Volume Mounting**: `index.html` mounted to nginx html directory

### Nginx Configuration
- Gzip compression enabled
- Security headers configured (XSS protection, frame options, etc.)
- SPA routing (all routes redirect to index.html)
- Static file caching (1 year for assets)

## Important Notes

### Code Organization
- All frontend code is in single `index.html` file
- No build process or package manager
- Inline CSS with modern responsive design
- Pure JavaScript with DOM manipulation

### Security Considerations
- JWT tokens stored in sessionStorage (not localStorage)
- CSRF protection via secure headers
- XSS protection enabled in nginx
- Frame options set to DENY

### Localization
- Entire interface in Russian language
- Date formats follow Russian conventions
- Legal terminology specific to Kazakhstan court system

### Development Workflow
1. Edit `index.html` directly
2. Test changes locally by opening file in browser
3. Deploy via Docker container restart
4. Monitor via docker-compose logs

Since there's no build system, changes are immediately visible after container restart.