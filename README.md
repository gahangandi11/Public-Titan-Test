<p align="center">
  <a href="https://www.missouri-titan.com/" rel="noopener" target="_blank"><img width="150" src="https://missouri-titan.com/static/media/favicon.e09871f0.png" alt="TITAN Logo"></a></p>
</p>
<h1 align="center">TITAN</h1>
<h3 align="center">Transportation data InTegration and ANalytics</h3>
<div align="center">

Welcome to TITAN! Titan is an interactive, web-based platform that 
assists decision makers at MoDOT in seamlessly integrating and analyzing 
transportation datasets, including freight.

Created with the Ionic framework and React.

[GitHub](https://github.com/MizzouRIDSI/TITAN)

[Firebase Console](https://console.firebase.google.com/u/1/project/titan-49df0/overview)

</div>

## Deployment 

In contrast to the [RIDSI](https://github.com/MizzouRIDSI/RIDSI-UI/) application, TITAN is not set up for automatic deployments. Deploying with Firebase is simple, however. To build and deploy the application, run the following commands in the base directory of the project:

```
npm run build
firebase deploy --only hosting
```

These commands will build all local changes to the project for production, then deploy them to the live site. You must be logged in to the firebase console and have proper permissions with that account to deploy to the live site.

## Installation

To install the project, you'll first need to clone the repository. Ensure that you have the latest version of node installed:
[NodeJS](https://nodejs.org/en/).

Once you've done so, navigate to the top-level
project folder and run the following:

```
npm i
npm run start
```

When this is finished, you will have installed the node modules required for the project and you should see the
React project open in a new browser window.

Other packages you may need when developing for RIDSI:

```
npm i -g firebase-tools @capacitor/cli
```

## Style

Our team uses a style based on React and TypeScript best practices. This style is maintained by the eslinter, which is configured in the eslintrc.js file. In order to remove files from being checked by the lint process, add the file path to the .eslintignore file. Occasionally, the linter will not refresh the cache automatically. To resolve this, delete the .eslintcache file and reload the app. To ensure clean code and an easy development experience, the linter can be integrated into most IDEs with intellisense. In order to run the linter and check new code for style issues manually, run the below command:

```
npm run clean
```

## Testing

Ionic React applications automatically include the Jest testing framework. To write tests, go to the page or component you wish to write a test for and create a [name].test.tsx file. After you have finished writing your tests, you can run the testing suite with the below command:

```
npm run test
```

Titan does not currently have any tests written.

## Pages

### [AppCenter](/src/pages/AppCenter)

The AppCenter Page contains a request to Firestore which returns a link to the OmniSci GPU page for either the Safety or Congestion page, depending on which one the user was directed to. This link is iframed into the page content. The OmniSci page visualizes data directly from the database using an AWS GPU. Adding another OmniSci page is as simple as adding another link to firestore. The AppCenter page and App.tsx automatically create pages for every link in firestore.

### [Dashboard](/src/pages/Dashboard)

The dashboard page displays various values from firestore in charts and graphs. After the page is initially rendered, a useEffect function pulls the data from firebase. This data is then displayed using the DataCards components, the graphs in the GraphContainer, and a list detailing crashes by county. The page also contains a Map component that displays the Mapbox traffic layer.

### [Data](/src/pages/DataDownload)

The data page is for data downloads. This page holds separate forms for each desired data type, and can be bound by a specific date range or other type-specific attributes. The data types available for download are: 
 - Detector
 - Incidents
 - Probe
 - Waze Incidents
 - Waze Jams
 
This page acts as a controller for all of the available forms. Data is sent to a form component for the user to interact with, then the user responses are sent back to the data page for processing.
The data is returned in a CSV file for the user to easily view the formatted data.

### [Login](/src/pages/Login)

The Login page is the gateway to Firebase Auth. It contains forms with various requirements for account authentication. The Login Page contains an input for email and passwords, as well as a password reset, which uses Firebase password reset. The Registration Page contains an input for name, agency, email, password, and confirmation. Upon registering for a new account, users are required to be verified by an admin before accessing the app. 

### [Profile](/src/pages/Profile)

The Profile Page displays all the included information about the user. On load, it looks up the user information from Firebase auth and Firestore. It also allows users to change email and password through interaction with firebase auth.

### [Home](/src/pages/Home)

The home page contains the buttons to navigate to other parts of the application like Live Data, Dashboard, Download and App Center.
### [Live Data](/src/pages/LiveData)

The Live Data page contains the application map, which allows for display of the traffic layer, weather, CCTV cameras, incidents, and jams. It is responsive across all devices.

### [Tutorials](/src/pages/Tutorials)

The Tutorials page contains tutorial cards for each page and the user can click on card corresponding to a page to follow the interactive tutorials related to that page.

## Components

### [Cards](src/components/Cards)

All card components are constructed with IonCards as the base. All of these componenets also nest the cards in an Ionic grid to make the pages responsive. The DataCards component also uses an Ionic grid inside the card to separate the icon container and titles. The top margin of the label containing the icon is set to a negative value and the overall card's overflow is set to visible to achieve the floating effect.

### [CCTV Player](src/components/CctvPlayer)

The CCTV Player component uses an IonCard as the wrapper for the video and related data. The toolbar of the card contains the camera's title/location as well as a button to close the player. In the main part of the card there is a div containing the ReactPlayer components. Since iOS devices require a different URL to the camera feed, there are two ReactPlayers with different URLs and only the one corresponding to the correct operating system is displayed.

### [Downloads](src/components/Downloads)

The File Download component is a fully custom container that displays all files that are sent to it through props. Based on the parent form that this component is instantiated in, the buttons will change to that form's color scheme. If no File model objects are passed in, the component will not appear. This component displays the file status and download link, the query response, and the query date from the file model.

### [Forms](src/components/Forms)

The data download forms are made up of four separate components: the DataAttributes component, the DateTime component, the SelectableFields component, and the FileName component.  
The DataAttributes component props contain the array of attributes, a function that updates the checks state in the parent component based on the checked boxes in the components, and the form name. Returned is an IonGrid containing a checkbox for each of the attributes in the passed array.  
The DateTime component accepts as props the start date, end date, functions to handle start and end date change, and the form name. The form name is used to determine the color scheme of the date time picker as well as to determine whether or not time should be included. The component then returns and IonItem containing the two date time pickers for start and end.  
The SelectableFields component props contain the starting unit, the starting number, a function for setting the unit and interval states in the parent component, and the form name. The component contains two selectors, one for selecting the unit, and one for selecting the aggregation interval.  
The FileName component takes in the default file name, a function that updates the file name in the parent component, and the form name. The component renders a single text imput field.

### [Graphs](src/components/Graph)

The Graph component is built with react-chartjs-2, a React wrapper for the Chart.js library. The component's props is a GraphData object which contains the series to be graphed, the X-axis labels, the type of graph, the title and subtitle, the background color, and the text content displayed underneath the chart.

The GraphContainer component contains the three charts on the dashboard. Its props are the fileds of the GraphContainerData interface, which contains the data to be charted as well as the labels and the graph background color. These elements are then used to create an array of GraphData items used to render the Graph component.

### [Guards](src/components/Guard)

Route guards are used on protected pages that should not be accessed by unauthenticated users or users without a verified email. To achieve this, the Guard component uses nested ternary operators. The first ternary operator evaluates whether or not a user is signed in. If not, they are redirected to the login page. If true, another ternary operator is used to evaluate whether the users email is verified or they used and outside provider to sign in. If both conditions are false, the user is redirected to the email verification page. If either one is true, the user is able to access all content.
The Route guard utilizes the React Context from [Auth Context](src/services/contexts/AuthContext/AuthContext.tsx).

### [Header](src/components/Header)

The Header component appears on every page and includes the searchbar (which can navigate to any page), the page title, the link to the notifications, user profile, and the menu button. Changes made to this component will appear on every page.

### [Maps](src/components/Map)

The map component utilizes ReactMapGL, a React wrapper for Mapbox GL JS, and is for every map in the application. The component has eight optional attributes:

- cctv: boolean – CCTV camera locations displayed when true. Used on the Live page.

- weather: boolean – Weather icons displayed when true. Used on the Visualization page.

- traffic: boolean – Mapbox Traffic v1 vector tile layer displayed when true. Used on all maps.

- stateOutline: boolean – State of Missouri highlighted when true. Uses GeoJSON data to construct a polygon around the state. Used on all maps.

- location: boolean – A pin at the user’s location is displayed when true. User must allow location tracking and have non null latitude and longitude values in firebase in order for the pin to appear. Used on all maps.

- cameras: Camera[] – Must be included when CCTV is true. Sends data for all CCTV cameras to the map component.

- setId: (id: number) => void – Function that takes a camera ID as its only parameter and adds it to the array of open cameras if not already open.

- setShowLoading: boolean – Shows the loading animation when the map is loading. Used on Live page.

The CCTV locations, weather events, and user’s location are displayed on the map using React Map GL’s marker element and an icon. The traffic and state outline features are layers within a source that contains relevant data about the layer.

On load, all maps start zoomed in on the user’s location, if allowed, or on the St. Louis area if not. Users can scroll and drag or use the navigation buttons to navigate the map. On every viewport change, the new latitude and longitude are evaluated to ensure that the viewport stays within a bounding box so that users cannot navigate too far from the state. The Recenter button moves the viewport back to its original location.

### [Menus](src/components/Menu)

The are two different menus within the Menus components, the login menu which directs to the login and registration, and the general app menu, which provides routing to all of the pages. The routes on this menu are protected by the auth guard. Adding items to the menu is as simple as adding a JSON object with the desired attributes to the desired segment array. 


## Firebase functions


The application uses firebase function to send weekly email reminders to admins. The adminReminder function is scheduled to run every monday at 10:35 am and checks for any users waiting for admin approval and sends emails to all admins with the list of users waiting for approval. The trigger extension on firebase is used to trigger emails, the trigger extension is configure to use sendgrid smtp relay to send emails. 

## Multi-Level user Authentication

The application supports multi level user authentication, where the admin can assign access levels to users when approving new users. The application currently has two roles which are LimitedAccess and FullAccess, each role only gives access to the pages assigned to the role. you can find the pages assigned to each role in the collection called Roles on the firestore database. The user with specific role only has access to the pages assigned to that role. The logic for this is written in RouteGaurd component, which checks if the user has permission to go to current route, if the user does not have permission to go to the current route the routegaurd component redirects the user to the homepage.

## Services

### [Big Query Service](src/services/bigQueryService.ts)

The Big Query Service connects to the RIDSI Python backend API in order to query Google BigQuery for the requested data. There are five available endpoints right now: Probe, Incidents, Detector, WazeIncident, and WazeJam. Each of the five endpoints requests different data, so these models are defined in this service. This file also includes the URL used to connect to the RIDSI API.

### [Firestore Service](src/services/firestoreService.ts)

The Firebase Service serves as the connection to the Firestore db and any future RealTime db connections. It hosts all collection requests, queries, and updates. Any Firebase CRUD operations that are not part of application setup and configuration (such as connection to firebase auth) should be added here.

### [Icon Service](src/services/iconService.ts)

The Icon Service is a simple mapper for icons throughout the application to be used in TypeScript responsively.

### [Tour Service](src/services/tourService.ts)

The Tour service supports the tutorials page , which helps the user to learn about features in the application in an interactive way.

### [Firebase Configuration](src/firebaseConfig.ts)

The Firebase Configuration Service sets up Firebase for the entire project and includes many functions that relate to enabling access to the app, such as user authentication. The Firebase Config requires an API key from the firebase console, which we store in a local environment file that should not be committed. 

## iOS

Not implemented - native application was created instead.

## Android

Commands to build the android app for the first time:

```
npm run build --prod
npx cap add android
npx cap sync
```

Commands to build the android app after a change:

```
npx cap sync
npx cap open android
```

// If the build fails due to package size, this will help: --max_old_space_size=4096
