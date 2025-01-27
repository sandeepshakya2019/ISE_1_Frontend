This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

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

- `Make sure you uncomment below code (if not) already in api.ts file`

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
- before that make sure that Android emulator is runnning

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

You've successfully run React Native App.

---

---

# Project Details

### Features for Frontend Android App

- **Register, Login and Logout a user** : using JWT (Json web token) and AsyncStorage to handle the above implementing Features

  - **JSON Web Token (JWT)** is used for securely transmitting information between parties as a JSON object. It is commonly used in authentication and authorization systems due to its lightweight and stateless nature.
  - **AsyncStorage** is used to provides a simple key-value storage system for persisting data locally on the device. we canuse sevrel other state management things to keep track the login users as well such as redux etc.

- **Uploading a Photo** : using Multer and Cloudinary for backend users are able to click the photo at real time and we can upload it on our server

  - **Multer** is a middleware for handling multipart/form-data, which is primarily used for uploading files.
  - **Cloudinary** is a cloud-based service for managing media assets (images, videos, etc.) with features like image optimization, transformations, and delivery via a CDN.

- **Profile** : we have dedicated route which provides the profile for ervery user related to loans that user taken

- **Take a Loan** OR **Repay a Loan** : by entring the amount and reasons of loan user can take the loan and by selecting a loan from the list of loans user can reapy it (`Payment Integration Feature we can implemented at Future Stages if required`)

- **Axios** is a popular JavaScript library used to make HTTP requests from Node.js or the browser. It provides a simple and intuitive API for interacting with RESTful APIs, handling errors, and working with promises or async/await. `(used for fetching the data from backend or sending the data to backend)`

# Libraries used :

- Axios `axios` : is a popular JavaScript library used to make HTTP requests from Node.js or the browser. It provides a simple and intuitive API for interacting with RESTful APIs, handling errors, and working with promises or async/await.
- React `react` : it is used in react-native by default we have used `useState` and `useEffect` Hooks
- React Native Gesture handler `react-native-gesture-handler`: is a popular library in the React Native ecosystem used to handle touch gestures and interactions in a performant and customizable way
- React Native Image Picker `react-native-image-picker` : is a popular library for React Native that allows users to pick images and videos from their device's camera or gallery
- React Native Reanimated `react-native-reanimated` : is a library for handling animations in React Native. It provides a highly performant and declarative API to create complex animations that run directly on the native thread.
- React Native Toast Message `react-native-toast-message` : is a lightweight and customizable library for displaying toast notifications in React Native applications. It allows you to show short, informative messages like success, error, or info alerts in a visually appealing way.

# Gameplay Video Related to FinSphere App

- **Login and Register (with validation)** :

- **KYC Submission (with validation)** :

- **Profile View, Borrow a Loan, Repay a Loan** :

## Authors

- [Sandeep Kumar CS24M112](https://github.com/sandeepshakya2019)
- [Abhishek Kumar CS24M120](https://github.com/imabhishekmahli)
- [Ashant Kumar CS24M113](https://www.github.com/ashantfet)
