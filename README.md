# Password Manager

A web app to store and manage your account details of respective URL addresses.

# Steps to Use 
- Clone the repository.
- Ensure that node.js is installed on your system.
- Start the front-end by running the command
```
npm run dev
```
- Start the backend by running the below commands
```
 cd backend
 node --watch app.js 
```
- Ensure you have installed mongoDBCompass
- Connect to Database by running the below command
```
 mongod --dbpath="C:\data\db" 
```
- Database documents will be stored at location `C:\data\db`
- Open the respective localhosts of front-end & in browsers. 
- Now the web app displays existing records if any.
- You can look in the mongoDBCompass for quick verification on CRUD Operations.

# 📦 Technologies Used

    Frontend: React, TailwindCSS

    Backend: Node.js, Express

    Database: mongoDB(Mongoose for Schema enforcement)
