ZOOM CAR CLONE CARrental application
E-Commerce Application:

This is a simple car rental application that allows users to view carss, book cars, and checkout. The admin can manage products, users, and orders.

The application is built using the following technologies:

1. Frontend: React, Axios, React-Router-Dom V6, Bootstrap, Redux.

2. Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Nodemon, Dotenv, Cors.

3. Tools: Postman, VS Code, Git, GitHub, Netlify, Render, Vite.

Steps:

Backend:

1. Create an empty directory and open it in VS Code.
2. Open the terminal and run the following command to create a package.json file:

```
npm init
```

3. create an entry point file (index.js).
4. Configure the package.json file. Add the following code:

```
"scripts": {
    "start": "node index.js"
  }
```

5. Create a readme.md file and add the project description.
6. Create an empty repository in GitHub.Com. Copy the repository URL.
7. Initialize the git repository in the project directory:

```
git init
```

8. Add the remote repository URL:

```
git remote add origin <repository-url>
```

9. Create a .gitignore file and add the following code:

```
node_modules
package-lock.json
DS_Store
.env
```

10. Rename the default branch from master to main:

```
git branch -m main
```

11. Add the changes to the staging area:

```
git add .
```

12. Commit the changes:

```
git commit -m "basic backend application setup"
```

13. Push the changes to the remote repository:

```
git push -u origin main
```

Database Setup:

1. Visit MongoDB.Com and create an account.
2. Create a new project and cluster.
3. Create a new user and password.
4. Open database access if necessary to change the user credentials and privileges.
5. Open network access to allow connections from anywhere by adding the IP address 0.0.0.0/0.
6. Create a new database and a collection.
7. Copy the connecting string from the cluster.
8. Install mongodb compass and connect to the database using the connecting string.

From the backend, connect to the database:

1. Copy the connection string from the cluster.
2. Install mongoose:

```
npm install mongoose
```

3. In the index.js file, add the following code:

```
const mongoose = require('mongoose');

mongoose.connect(connection_string);
```

4. Install dotenv:

```
npm install dotenv
```

5. Create a .env file and add the connection string:

```
MONGODB_URI=connection_string
```

6. Require the dotenv package in the index.js file:

```
require('dotenv').config();
```

7. Change the connection string in index.js inside mongoose.connect() function to

```
process.env.MONGODB_URI
```

8. Add the .env file to the .gitignore file.
9. Create a config.js file under the utils folder and add the following code:

```
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
    MONGODB_URI
};
```

10. Require the config.js file in the index.js file:

```
const { MONGODB_URI } = require('./utils/config');
```

11. Update the variable process.env.MONGODB_URI to MONGODB_URI in the mongoose.connect() function.

Connect to the server using Express.js:

1. Install express:

```
npm install express
```

2. update the index.js file:

```
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
```

# This is a simple car rental  application that allows users to view cars, add book car , and checkout. The admin can manage cars, users, and orders.

User Stories:

1. As a user, I should be able to register and login to the application.
2. As a user, I should be able to view all cars.
3. As a user, I should be able to view a single car for bookings.
4. As a user, I should be able to add a product to the cart.
5. As a user, I should be able to remove a product from the cart.
6. As a user, I should be able to view the cart.
7. As a user, I should be able to checkout.
8. As an admin, I should be able to add a car.
9. As an admin, I should be able to view all carss.
10. As an admin, I should be able to view a single carr.
11. As an admin, I should be able to update a car.
12. As an admin, I should be able to delete a car.
13. As an admin, I should be able to add a product.
14. As an admin, I should be able to view all products.
15. As an admin, I should be able to view a single car .
16. As an admin, I should be able to update a car booking.
17. As an admin, I should be able to delete a car.
18. As an admin, I should be able to view all bookings.
19. As an admin, I should be able to view a single car.
20. As an admin, I should be able to update an car.
21. As an admin, I should be able to delete an car.

Tasks:

Backend:

1. Setup the project with Node.js and Express.js. (Done)
2. Setup the environment variables (Dotenv). (Done)
3. Connect to the MongoDB database. (Done)
4. Run the server and test the connection. (Done)
5. Setup the architecture of the project (Models, Routes, Controllers, Middlewares). (Done)
6. Basic housekeeping (Error handling, Logging, Parsing). (Done)
7. Setup the authentication system (Register, Login, Logout). (Done)
8. Setup the authorization system (Roles, Permissions). (Not Done)
9. Setup the product system (CRUD). (Done)
10. Setup the user system (CRUD). (Done)
11. Setup the order system (CRUD). (Done)
12. Setup the booking system (CRUD). (Not Done)
13. Setup the deployment system (Netlify, Render). (Not Done)

Frontend:

1. Setup the project with React. (Done)
2. Setup the architecture of the project (Components, Pages, Routes). (Done)
3. Setup the authentication system (Register, Login, Logout). (Done)
   a. Create the Register component.
   b. Create the Login component.
   c. Create the Logout component.
   d. Create the Auth component.
4. Setup the authorization system (Roles, Permissions). (Done)
5. Setup the product system (CRUD). 
6. Setup the user system (CRUD).
7. Setup the order system (CRUD). 
8. Setup the cart system (CRUD). 
11. Setup the deployment system (Netlify, Render). (Done)

Models:

1. User Model:

```
// user autentication  by implementings jwt  bcrypt 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' } // 'admin' for admin users
});


// Export the User model
module.exports = mongoose.model('User', UserSchema);


```

2. car Model:

```

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Schema } = mongoose;

// Define the review schema
const reviewSchema = new Schema({
  ratings: { type: Number},
  reviews: { type: String } 
});

// Define the car schema

const carSchema = new Schema({
  Carname: { type: String, required: true },
  Imageurl: { type: String, required: true },
  RentPerHour: { type: Number, required: true },
  Capacity: { type: Number, required: true },
  FuelType: { type: String, required: true },
  ratings: { type: [Number] },  // Array of numbers
  reviews: { type: [reviewSchema] },  // Array of reviewSchema objects
  bookedTimeSlots: [{
    from: { type: Date },
    to: { type: Date }
  }]
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;```

3. booking Model:

```
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    bookedTimeSlots: {
      from: { type: String },
      to: { type: String }
    },
    totalHours: { type: Number },
    totalAmount: { type: Number },
    transactionId: { type: String },
    driverRequired: { type: Boolean }

  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
```



Routes:

User Routes:

1. POST /register (Done)
2. POST /login (Done)
3. POST /logout (Done)
4. GET /admin/profile (Done)


car Routes:

1. POST /api/cars
2. GET /api/getallcars
3. GET /api/car/:id
4. PUT /api/cars/:id
5. DELETE /api/cars/:id

Booking Routes:

1. POST /api/bookings
2. GET /api/orders
3. GET /api/carss/:id
4. PUT /api/cars/:id
5. DELETE /api/cars/:id

