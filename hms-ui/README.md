# Hotel Booking System - Angular Frontend

A comprehensive hotel booking system built with Angular 16, featuring customer and admin interfaces with complete booking management, payment processing, and complaint handling.

## Features

### Customer Features
- **User Registration & Login** - Secure authentication with form validation
- **Room Search & Booking** - Search available rooms with filters and sorting
- **Payment Processing** - Multiple payment methods with secure card processing
- **Booking Management** - View, modify, and cancel bookings
- **Complaint System** - Register and track complaints
- **Profile Management** - Update personal information

### Admin Features
- **Dashboard** - Overview of bookings, rooms, and revenue
- **Room Management** - Add, edit, and manage hotel rooms
- **Booking Management** - View and manage all customer bookings
- **User Management** - Manage customer accounts
- **Complaint Management** - Handle and resolve customer complaints

## Technology Stack

- **Frontend**: Angular 16
- **Styling**: Bootstrap 5
- **Forms**: Reactive Forms with validation
- **HTTP**: HttpClient with interceptors
- **Routing**: Lazy-loaded modules
- **Icons**: Font Awesome

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/           # Login & Registration
│   │   ├── customer/       # Customer features
│   │   ├── admin/          # Admin features
│   │   └── shared/         # Shared components
│   ├── services/           # API services
│   ├── models/             # TypeScript interfaces
│   ├── guards/             # Route guards
│   └── interceptors/       # HTTP interceptors
├── assets/                 # Static assets
└── styles.css             # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API endpoints**
   Update the `apiUrl` in service files to match your backend:
   ```typescript
   // In service files
   private apiUrl = 'http://localhost:8080/api';
   ```

4. **Run the application**
   ```bash
   ng serve
   ```

5. **Access the application**
   - Open browser to `http://localhost:4200`
   - Register a new account or login with existing credentials

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms/search` - Search rooms
- `POST /api/rooms` - Add room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/booking/:bookingId` - Get payment details

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/user/:userId` - Get user complaints
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint

### Users
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user
- `PUT /api/users/profile` - Update profile

## Form Validations

### Registration Form
- **Name**: Required, min 3 chars, letters only
- **Email**: Required, valid email format, unique
- **Phone**: Required, 8-10 digits with country code
- **Address**: Required, min 10 chars
- **Username**: Required, min 5 chars, no spaces, unique
- **Password**: Required, min 8 chars, mixed case + number + special char

### Search Rooms
- **Check-in**: Required, future date
- **Check-out**: Required, after check-in
- **Adults**: Required, 1-10
- **Children**: Optional, 0-5
- **Room Type**: Required selection

### Payment Form
- **Cardholder Name**: Required, 3-50 chars, letters only
- **Card Number**: Required, 16 digits
- **Expiry Date**: Required, MM/YY format, future date
- **CVV**: Required, 3-4 digits

## User Roles

### Customer (CUSTOMER)
- Access to booking and profile management
- Can search rooms, make bookings, and manage complaints

### Admin (ADMIN)
- Full system access
- Can manage rooms, bookings, users, and complaints
- Access to dashboard and analytics

## Security Features

- JWT token-based authentication
- Route guards for role-based access
- HTTP interceptor for automatic token attachment
- Form validation and sanitization
- Secure payment processing

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Running Tests
```bash
ng test
```

### Building for Production
```bash
ng build --prod
```

### Code Formatting
```bash
ng lint
```

## Deployment

1. Build the application:
   ```bash
   ng build --prod
   ```

2. Deploy the `dist/` folder to your web server

3. Configure your web server to serve `index.html` for all routes (for Angular routing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.