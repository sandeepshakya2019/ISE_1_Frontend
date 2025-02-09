# APP DOCUMENTATION

**[Backend FinSphere](https://github.com/sandeepshakya2019/ISE_1_Backend)**

**For Checking Purposes**

Since i am using free api so for free api mobile number should be in friend list of sender list in twillio so we created free account where any OTP will work

**mobile number given below can work with any OTP**

` mobileNo 9084043946 -> Already Register and KYC Done (You can directly view all the things)`

`mobileNo 8677963878 -> You can register with this mobile number`

`if already register ypu can use additional mobileNo 1234567890`

**APK file is also available in the root directory**

# 0. Gameplay Video Related to FinSphere App (On Local Host)

- **Login and Register (with validation)** :

https://github.com/user-attachments/assets/46c720c6-6832-4eb0-8087-cfaf6f39db70

https://github.com/user-attachments/assets/d639d6b6-674f-409a-807f-b3e61d30b369

- **KYC Submission (with validation)** :

https://github.com/user-attachments/assets/d6e6a811-46dd-4aa6-bcda-9c09efd6dd86

- **Borrow a Loan, Repay a Loan** :

https://github.com/user-attachments/assets/f8551918-a544-4ef7-bb84-de72d516948e

- **User Profiles (Contains KYC, Loans and User Info)** :

- **Govt Schemes Page & Docs Related to the App** :

# 1. Introduction

- App Name: **FinSphere**
- Version: **Beta**
- Author/Team: **Sandeep Kumar, Ashant Kumar, Abhishek Kumar**
- Submission Date: **30/01/2025**
- Purpose: **Objective To develop a mobile application that addresses financial inclusion by providing access to essential financial services like savings, loans, and insurance to underbanked and underserved populations. The app leverages mobile banking, microfinance, and fintech innovations to create an easy-to-use, accessible platform.**

# 2. Features

## 2.1 Proposed Features

### 2.1.1 User Authentication

Description: Provides secure access control for users through Register, Login, and Logout functionalities.
Proposed Implementation:

- Use JWT (JSON Web Token) for stateless authentication.
- Store tokens using AsyncStorage for session persistence.
- Integrate Redux (or similar state management) to track user sessions(future Implementation)

### 2.1.2 e-KYC

Description: Allows users to upload photos for identity verification or loan applications in real time.
Proposed Implementation:

Frontend:

- Real-time photo capture using device camera API.
- Option to upload existing images from the device gallery.
- Authentication of e-KYC Data such as Aadhar ID, Bank etc.

Backend:

- Use Multer middleware to handle file uploads.
- Store images in Cloudinary, ensuring optimized delivery and transformation.

### 2.1.3 User Profile Management

Description: Displays user-specific details, including personal information and loan history.

Proposed Implementation:

- Dedicated backend route to fetch and update user profiles.
- Display: Name, email, and demographic details.
- Active and past loans.

### 2.1.4 Loan Management

Take a Loan

Description:

Users can apply for loans by specifying the amount and reason.

Proposed Implementation:

- Input form to collect loan details (amount and purpose).
- API call to backend for loan application with user authentication (via JWT).
- Response includes loan status, approval, and repayment schedule.

Repay a Loan

Description:

Users can select from their active loans and repay them partially or in full.

Proposed Implementation:

- Fetch active loans via API.
- UI/UX feature to select a loan, specify repayment amount, and confirm the transaction.
- Maintain transaction logs for repayment history.

### 2.1.5 Notifications

Description:

Notify users about loan repayment deadlines, application status, or profile changes.

Proposed Implementation:

- Push notifications using Firebase Cloud Messaging (FCM).
- Customizable reminders for payment deadlines.

### 2.1.6 Financial Literacy Resources

Description:

Educate users about loans, savings, and financial planning.

Proposed Implementation:

- Interactive modules for financial literacy (e.g., videos, quizzes).
- Progress tracking to reward users for completed lessons.

### 2.1.7 Data Fetching with Axios

Description:

Establish reliable communication between frontend and backend.

Proposed Implementation:

- Standardized Axios instances with base URLs and JWT authorization headers.
- Graceful error handling for API calls, including retry mechanisms.
- Use interceptors to include JWT automatically in requests.

### 2.1.8 More Enhancements

Payment Gateway Integration:

For seamless repayment of loans via Stripe, Razorpay, or PayPal.

AI-Based Recommendations:

- Detect Below Poverty Level People's finance based on user behavior, history and some other data.

Offline Support:

- Enable basic functionalities like viewing profiles or logging past transactions offline.

Accessibility Features:

- Multilingual support, text-to-speech, and high-contrast UI for inclusivity.

## 2.2 Implemented Features

### 2.2.1 User Authentication (Register, Login, Logout)

Description: Secure user authentication system using JWT.

Implementation: Use JSON Web Token (JWT) for stateless user authentication.
AsyncStorage for storing JWT locally to maintain session states.
Integrate state management tools like Redux for advanced user session tracking.
Routes for:
User registration.
Login with JWT issuance upon successful authentication.
Logout functionality (invalidate token and clear AsyncStorage).
Add auto-login functionality on app restart if a valid JWT exists in AsyncStorage.

### 2.2.2 Uploading a Photo

Description: Allow users to upload real-time photos for verification or loan application.

Implementation:

Frontend:
Use the device camera for clicking photos in real-time.
Integrate file input components to allow manual uploads.
Backend:
Use Multer middleware to handle image uploads from the frontend.
Upload images to Cloudinary for efficient storage, delivery, and on-the-fly transformations.
Provide features like:
Viewing uploaded photos directly in the app via Cloudinary CDN URLs.
Photo optimization for fast upload and reduced data usage.

### 2.2.3 Profile Management

Description: Users can view a dedicated profile page showing their details and loan information.

Implementation:

Backend route to retrieve user-specific profile data, including:
Name, email, and personal details.
List of active loans, past loans, and repayment status.
Use Axios to fetch profile data from the backend.
Display loan-related information using dynamic lists.
Include an option for profile photo updates, utilizing the upload photo feature.

### 2.2.4 Take a Loan

Description: Enable users to apply for loans by entering the amount and purpose.

Implementation:

Backend endpoint to process loan requests:
Inputs: Loan amount, purpose/reason, user ID (from JWT).
Response: Loan approval status and repayment terms.
Use Axios to send loan applications to the backend.
UI/UX Features:
Form with validation for entering loan details.
Status page showing approval pending/completed loans.

### 2.2.5 Repay a Loan

Description: Allow users to repay selected loans with payment integration in future versions.

Implementation:

Fetch all active loans for a user via an API (using Axios).
Provide a user-friendly UI to:
Select a loan from the list.
Input the repayment amount.
Confirm the repayment with backend verification.
Maintain a transaction log for repayments for the user to track.
Future Scope:
Integrate payment gateways like Razorpay, Stripe, or PayPal for seamless repayments.

### 2.2.6 Data Fetching and Backend Communication with Axios

Description: Ensure seamless data communication between frontend and backend using Axios.

Implementation:

Standardize API calls:
Create reusable Axios instances to include base URLs and JWT headers.
Error handling:
Show toast notifications for network failures, authentication errors, or invalid responses.
Use Axios interceptors:
Automatically attach the JWT from AsyncStorage to every API call.

## 2.3 Future Implementation

- **2.3.1 Loan Recommendations**
- **2.3.2 Financial Planning Tools**
- **2.3.3 Push Notifications**
- **2.3.4 Payment Integration**
- **2.3.5 Real Time e-KYC Authentication**
- **2.3.6 Multilingual support**
- **2.3.7 AI based Recommendations System**

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# 3. Installation Guide

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 0: Fetch the Github Frontend Repository

- Fetch the github Repository by following command [**Frontend For FinSphere**](https://github.com/sandeepshakya2019/ISE_1_Frontend)

```bash
git clone https://github.com/sandeepshakya2019/ISE_1_Frontend
```

## Step 1: Install the dependencies

```bash
# change directory to the folder where you clone the Repository
cd .. (use command)

# using npm
npm install
```

- `Make sure you uncomment the below code (if not) already in the api.ts file`

```
const API_BASE_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:${LOCAL_API_PORT}/api/v1` // For Android Emulator
    : `http://localhost:${LOCAL_API_PORT}/api/v1`; // For iOS Simulator or other platforms
```

- `Comment below code (if not)`

```// const API_BASE_URL = 'https://ise-1-backend.vercel.app/api/v1';

const API_BASE_URL = 'http://10.23.86.204:3005/api/v1';
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

- Please make sure you run the [Backend server](https://github.com/sandeepshakya2019/ISE_1_Backend) successfully on PORT 3005 else you have to change to same port in react-native frontend in api.ts file
  `const LOCAL_API_PORT = YOUR_PORT_NUMBER; // Your Node.js server port`
- before that make sure that the Android emulator is running

### For Android

```bash
# using npm
npm run android

# if above command creates a problem
npx react-native start

```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

## Congratulations! :

You've successfully run the React Native App.

---

# 4. Project Details

## 4.1 Libraries used :

- Axios `axios` : is a popular JavaScript library used to make HTTP requests from Node.js or the browser. It provides a simple and intuitive API for interacting with RESTful APIs, handling errors, and working with promises or async/await.

- React `react` : it is used in react-native by default we have used `useState` and `useEffect` Hooks
- React Native Gesture handler `react-native-gesture-handler`: is a popular library in the React Native ecosystem used to handle touch gestures and interactions in a performant and customizable way
- React Native Image Picker `react-native-image-picker` : is a popular library for React Native that allows users to pick images and videos from their device's camera or gallery
- React Native Reanimated `react-native-reanimated` : is a library for handling animations in React Native. It provides a highly performant and declarative API to create complex animations that run directly on the native thread.
- React Native Toast Message `react-native-toast-message` : is a lightweight and customizable library for displaying toast notifications in React Native applications. It allows you to show short, informative messages like success, error, or info alerts visually appealingly.

# 7. Authors

- [Sandeep Kumar CS24M112](https://github.com/sandeepshakya2019)
- [Abhishek Kumar CS24M120](https://github.com/imabhishekmahli)
- [Ashant Kumar CS24M113](https://www.github.com/ashantfet)
