# OldPhoneDeals
OldPhoneDeals is a second-hand mobile phone trading website that features shopping functionalities and a comprehensive user system, including registration, login, listing mobile phones that users want to trade, and managing comments under products. The website's front-end is developed using the React.js framework, while the back-end is built with MVC architechture and Node.js as the programming language, and it interacts with the MongoDB cloud-based database services using mongoose package.

### Main Page
Main Page lists all the enabled phones, so the users can see the details, make comments and add the phone to the cart. Users also can filter the phone lists based on the branch and name.

### Detail Pop up
When the user clicks on the "Detail" button in the main page, the user can see the all details of the phone and the reviews. The user can add a new comment to the phone.

### Sign In / Sign Up
If the user hasn't logged in, then the navigation bar will only show icon and Login button to restrict the users who haven't logged in.
If the user doesn't have the account, they can go to the sign up page and register the account. Once the user registered, there will be verification email sent to the user, and the user can use the account once they are verified.

### Checkout Page
When the users add the phone to the cart, all the items added to the cart is displayed in the Checkout page. The user can add, reduce the quantity of each items or delete. And user can buy the item.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Pre-requisites
- [Node.js]
- [npm]
- [Git]
- [MongoDB]

### Installing and Running
1. Git Clone a copy of the code:
```
$ cd path/to/your/folder
# git clone https://github.sydney.edu.au/COMP5347-COMP4347-2023.git
```

3. Install dependencies for each client and server folder
```
$ cd client
$ npm install

$ cd server
$ npm install
```

4. Run server side
```
$ cd server
$ npm run dev
```

or

```
$ cd server
$ nodemon server.js
```

5. Run client side
```
$ cd client
$ npm start
```

### Stopping
1. Stop the server with `Ctrl+C`. Ensure database is connected.
2. Stop the client with `Ctrl+C`.

## Developers
- Main page: [Rina Yoo](github.com/RinaYoo) (full stack)
- User Authentication system: [Ruoshui(Christin) Chen](https://github.com/ChristinChen233) (full stack)
- Checkout Page (shopping cart): Ruoshui(Christin) Chen (front end), Jingyu(Lucas) Lu (back end)
- User Profile page: Ruoshui(Christin) Chen & Lucas (front end), Jingyu(Lucas) Lu (back end)
