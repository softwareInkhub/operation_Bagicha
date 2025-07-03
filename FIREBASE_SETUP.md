# Firebase Setup for Bagicha Checkout

This guide will help you set up Firebase Authentication for the phone number verification in the checkout process.

## Prerequisites

- A Google account
- Node.js and npm installed
- The Bagicha project running locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `bagicha-ecommerce` (or your preferred name)
4. Enable Google Analytics if desired
5. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase Console, navigate to **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Phone** authentication:
   - Click on "Phone"
   - Toggle the "Enable" switch
   - Add your domain to authorized domains (e.g., `localhost`, your production domain)
   - Save the changes

## Step 3: Get Firebase Configuration

1. In the Firebase Console, click the gear icon ⚙️ and select "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon `</>`
4. Register your app with nickname: `bagicha-web`
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

## Step 5: Set Up reCAPTCHA (for Production)

For production use, you'll need to configure reCAPTCHA:

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin/create)
2. Create a new site with reCAPTCHA v2 (Invisible)
3. Add your domain(s)
4. In Firebase Console > Authentication > Settings
5. Add your reCAPTCHA site key

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Add items to your cart
3. Go to checkout (`/checkout`)
4. Test phone number verification with a real phone number

## Important Notes

### Development Testing
- Firebase provides test phone numbers for development
- You can use `+91 9876543210` with OTP `123456` for testing
- Add test numbers in Firebase Console > Authentication > Settings > Phone numbers for testing

### Security Rules
For production, ensure you have proper security rules configured in Firestore (if using) and proper domain restrictions.

### Rate Limiting
Firebase has built-in rate limiting for SMS. For production apps with high volume, consider implementing additional verification methods.

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-app-credential)"**
   - Check that all environment variables are correctly set
   - Restart the development server

2. **"reCAPTCHA verification failed"**
   - Ensure reCAPTCHA is properly configured
   - Check that your domain is added to Firebase authorized domains

3. **"SMS not received"**
   - Check if the phone number format is correct (+91XXXXXXXXXX)
   - Verify that SMS services are enabled in your Firebase plan
   - Try with a test phone number first

4. **"auth/too-many-requests"**
   - Too many verification attempts
   - Wait a few minutes before trying again

## Production Deployment

When deploying to production:

1. Update authorized domains in Firebase Console
2. Configure proper reCAPTCHA settings
3. Set up proper environment variables in your hosting platform
4. Consider implementing additional security measures

## Support

For Firebase-specific issues, refer to the [Firebase Documentation](https://firebase.google.com/docs/auth/web/phone-auth).

For Bagicha-specific issues, contact the development team. 