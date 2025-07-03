# Production Setup Guide - Bagicha Checkout System

## 🚀 Firebase Configuration for Production

### 1. Firebase Project Setup

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** (or use existing):
   - Project name: `bagicha-production`
   - Enable Google Analytics (optional)

3. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Phone** authentication
   - Add your domain to authorized domains

4. **Configure Phone Authentication**:
   - In Authentication settings
   - Go to "Phone number sign-in"
   - Set up reCAPTCHA for web (automatic)

### 2. Firebase Billing & SMS Setup

⚠️ **CRITICAL**: Phone authentication requires a paid plan

1. **Upgrade to Blaze Plan**:
   - Go to Project Settings → Usage and billing
   - Upgrade to "Pay as you go" (Blaze plan)
   - Set up billing account

2. **SMS Pricing** (as of 2024):
   - India: ~$0.02 per SMS
   - First 10K verifications/month are free
   - Budget alerts recommended

### 3. Environment Variables

Create `.env.local` file with your Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Environment
NODE_ENV=production
```

### 4. Security Configuration

1. **Firebase Security Rules**:
   ```javascript
   // Firestore Rules (if using database)
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

2. **Domain Restrictions**:
   - In Firebase Console → Authentication → Settings
   - Add only your production domains:
     - `https://yourdomain.com`
     - `https://www.yourdomain.com`

### 5. Rate Limiting & Security

1. **reCAPTCHA Configuration**:
   - Automatically configured by Firebase
   - Invisible reCAPTCHA for better UX
   - Fallback to visible reCAPTCHA if needed

2. **Rate Limiting**:
   - Firebase automatically rate limits
   - Additional limits can be set in Firebase Functions

### 6. Deployment Checklist

#### Pre-deployment:
- [ ] Firebase project created and configured
- [ ] Billing enabled (Blaze plan)
- [ ] Phone authentication enabled
- [ ] Domain added to authorized domains
- [ ] Environment variables set
- [ ] Test with real phone numbers in staging

#### Production deployment:
- [ ] Deploy to production server
- [ ] Verify Firebase connection
- [ ] Test phone verification flow
- [ ] Monitor Firebase usage/billing
- [ ] Set up error monitoring

### 7. Monitoring & Maintenance

1. **Firebase Console Monitoring**:
   - Authentication → Users (track sign-ups)
   - Authentication → Usage (monitor SMS usage)
   - Project Settings → Usage and billing

2. **Error Monitoring**:
   ```typescript
   // Add to your error tracking
   const logPhoneAuthError = (error: any, phoneNumber: string) => {
     console.error('Phone auth error:', {
       code: error.code,
       message: error.message,
       phone: phoneNumber.replace(/\d(?=\d{4})/g, '*') // Mask number
     })
   }
   ```

3. **Cost Management**:
   - Set up billing alerts in Google Cloud Console
   - Monitor SMS usage patterns
   - Consider implementing daily/monthly limits

### 8. Testing in Production

1. **Use Real Phone Numbers**:
   - No test numbers in production
   - All SMS will be sent via real carriers
   - Verify international number support if needed

2. **Test Scenarios**:
   - Valid Indian mobile numbers
   - Invalid number formats
   - Rate limiting behavior
   - reCAPTCHA flow
   - Network timeout scenarios

### 9. Troubleshooting Common Issues

1. **"Billing not enabled" error**:
   - Verify Blaze plan is active
   - Check billing account status

2. **reCAPTCHA not loading**:
   - Verify domain is authorized
   - Check for ad blockers
   - Ensure container element exists

3. **SMS not received**:
   - Verify phone number format (+91xxxxxxxxxx)
   - Check Firebase quotas
   - Verify carrier compatibility

4. **Too many requests**:
   - Firebase rate limiting in effect
   - Wait before retrying
   - Consider user messaging about limits

### 10. Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use secure environment variable storage
   - Rotate keys periodically

2. **Phone Number Privacy**:
   - Hash/mask phone numbers in logs
   - Follow data protection regulations
   - Implement user consent flows

3. **Fraud Prevention**:
   - Monitor unusual patterns
   - Implement additional verification for high-value transactions
   - Consider device fingerprinting

## 🎯 Go-Live Checklist

- [ ] Firebase project configured with billing
- [ ] Phone authentication enabled
- [ ] Environment variables set correctly
- [ ] Domain authorized in Firebase
- [ ] Test verification flow works
- [ ] Error monitoring set up
- [ ] Billing alerts configured
- [ ] Documentation updated
- [ ] Team trained on monitoring

## 📞 Support Contacts

- **Firebase Support**: [Firebase Support](https://firebase.google.com/support)
- **Billing Issues**: Google Cloud Support
- **Technical Issues**: Check Firebase Status page

---

**Last Updated**: January 2024
**Next Review**: March 2024 