# Admin Contact Authentication System

## Overview
This system ensures that users must be logged in before they can contact admin via phone call or WhatsApp. When an unauthenticated user tries to contact admin, they are redirected to the login page and then returned to their original location after successful authentication.

## Components

### AdminContactButtons Component
- **Location**: `src/components/AdminContactButtons.jsx`
- **Purpose**: Reusable component that wraps admin contact buttons with authentication checks
- **Features**:
  - Authentication verification before allowing contact
  - Automatic redirect to login with return URL
  - Tooltip notification for unauthenticated users
  - Customizable phone number and WhatsApp message
  - Responsive design with icons

## Implementation Details

### Authentication Flow
1. User clicks "Call Admin" or "WhatsApp Admin" button
2. Component checks if user is authenticated using `useAuth()` hook
3. If not authenticated:
   - Shows tooltip: "Please log in to contact admin"
   - Redirects to login page with current page URL as redirect parameter
4. If authenticated:
   - Proceeds with the contact action (phone call or WhatsApp)

### Redirect Mechanism
- Uses query parameter: `/login?redirect=/current-page`
- Stores redirect URL in sessionStorage during login process
- After successful login, user is redirected back to original page

### Usage Examples

#### Basic Usage
```jsx
import AdminContactButtons from '../components/AdminContactButtons';

<AdminContactButtons />
```

#### Custom Message and Styling
```jsx
<AdminContactButtons
  whatsappMessage="Hello, I need help with booking"
  className="mt-4"
  buttonText={{ call: "Call Support", whatsapp: "Chat Support" }}
/>
```

#### Property-Specific Message
```jsx
<AdminContactButtons
  whatsappMessage={`Hello, I'm interested in the property "${property.title}"`}
  className="pt-4"
/>
```

## Files Modified

### New Files
- `src/components/AdminContactButtons.jsx` - New reusable component

### Modified Files
- `src/pages/AddProperty.jsx` - Replaced hardcoded buttons with component
- `src/pages/PropertyDetail.jsx` - Replaced hardcoded buttons with component
- `src/pages/Login.jsx` - Added redirect handling after login

## Security Features

1. **Authentication Required**: All admin contact actions require user authentication
2. **Session Management**: Uses secure session storage for redirect URLs
3. **Input Validation**: WhatsApp messages are properly encoded
4. **XSS Prevention**: No direct HTML injection in contact messages

## User Experience

1. **Clear Feedback**: Tooltip informs users they need to log in
2. **Seamless Redirect**: Users return to their original page after login
3. **Consistent Design**: Maintains existing button styling and layout
4. **Accessibility**: Includes proper icons and responsive design

## Testing

To test the authentication system:

1. **Unauthenticated User**:
   - Navigate to AddProperty or PropertyDetail page
   - Click "Call Admin" or "WhatsApp Admin"
   - Should see tooltip and redirect to login

2. **Authenticated User**:
   - Log in to the system
   - Navigate to any page with admin contact buttons
   - Click buttons should work normally

3. **Redirect After Login**:
   - Try to contact admin while unauthenticated
   - Complete login process
   - Should return to original page

## Future Enhancements

- Add rate limiting for contact attempts
- Implement contact history tracking
- Add admin availability status
- Support for different contact methods (email, SMS)
- Multi-language support for tooltips
