# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a frontend application for a legal case management system (CRM) specifically designed for legal professionals in Kazakhstan. The application provides a web interface for managing court cases, tracking deadlines, and coordinating legal team activities.

## Architecture

### Frontend Structure
- **Single-page application**: All functionality contained in `index.html` with embedded CSS and JavaScript
- **Vanilla JavaScript**: No frontend frameworks, uses modern ES6+ features
- **Responsive design**: Mobile-first approach with CSS Grid and Flexbox
- **Real-time features**: Dynamic updates and filtering without page refresh

### Authentication System
- **Telegram-based login**: Uses Telegram Bot API for user authentication
- **Session management**: JWT tokens stored in sessionStorage
- **Role-based access**: Supports "lawyer" and "assistant" roles

### API Integration
- **Backend API**: Communicates with NestJS backend at `/api` endpoints
- **RESTful design**: Standard HTTP methods (GET, POST, PATCH, DELETE)
- **Error handling**: Comprehensive error handling with user notifications

## Development Commands

### Local Development
```bash
# Serve static files locally (development)
python -m http.server 8080
# or
npx serve .

# View in browser
open http://localhost:8080
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build Docker image
docker build -t legal-system-frontend .

# Run container
docker run -p 8081:80 legal-system-frontend
```

## Key Application Features

### Case Management
- **Create cases**: Add new court cases with filing dates and assignments
- **Status tracking**: Track case progress through legal workflow states
- **Hearing scheduling**: Manage court hearing dates and deadlines
- **Team assignment**: Assign cases to specific lawyers or assistants

### Filtering and Search
- **Team filters**: Server-side filtering by status and responsible person
- **Local search**: Client-side search by case number, title, or assignee
- **Status-based filtering**: Filter cases by current legal status

### Notification System
- **Telegram integration**: Send notifications to team members
- **Deadline alerts**: Automatic alerts for upcoming court dates
- **Case ending warnings**: Alerts when cases are approaching deadlines

## Backend API Dependencies

The frontend expects these API endpoints to be available:

### Authentication
- `POST /api/auth/telegram` - Telegram authentication
- `GET /api/auth/me` - Get current user info

### Case Management
- `GET /api/cases` - List all cases (with team filtering)
- `POST /api/cases` - Create new case
- `PATCH /api/cases/:id/status` - Update case status
- `PATCH /api/cases/:id/hearing` - Update hearing date
- `PATCH /api/cases/:id/appeal-hearing` - Update appeal hearing date
- `DELETE /api/cases/:id` - Delete case

### User Management
- `GET /api/users` - List all users
- `GET /api/team-filters` - Get team filter settings
- `PATCH /api/team-filters` - Update team filter settings

### Notifications
- `POST /api/telegram/test` - Send test notification

## Configuration

### Environment Variables
- `NGINX_HOST`: Hostname for nginx configuration
- `NGINX_PORT`: Port for nginx service

### API Configuration
- Base URL: `/api` (relative path, proxied by nginx)
- Authentication: Bearer token in Authorization header

## Legal Workflow States

The application manages cases through these states:
- `submitted`: Case filed with court
- `pending_check`: Under review
- `accepted`: Case accepted, hearing scheduled
- `returned`: Case returned for corrections
- `decision_made`: Court decision rendered
- `appeal`: Appeal process initiated
- `closed`: Case closed

## Important Notes

### Security Considerations
- All API calls include CSRF protection headers
- Telegram authentication validates user identity
- Session tokens expire and require re-authentication
- Input validation prevents XSS attacks

### Performance Optimizations
- Gzip compression enabled in nginx
- Client-side caching for static assets
- Efficient DOM manipulation without frameworks
- Minimal API calls through smart caching

### Browser Compatibility
- Modern browsers supporting ES6+ features
- Responsive design works on mobile devices
- Fallback handling for older browsers where needed

### Deployment Notes
- Production deployment uses nginx for static file serving
- Docker containers for consistent deployment
- Log files mounted for monitoring
- Health checks and restart policies configured