const express = require('express');
const fs = require('fs'); // To read the JSON file
const path = require('path'); // To serve the HTML file
const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(express.json());

/*
- Create new html file named home.html 
- Add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); // Serve home.html
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
    fs.readFile('user.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: false, message: 'Error reading user data' });
        }
        res.json(JSON.parse(data)); // Send JSON data from user.json file
    });
});

/*
- Modify /login route to accept username and password as JSON body parameters
- Read data from user.json file
- If username and password are valid, send response as:
    { status: true, message: "User Is valid" }
- If username is invalid, send response as:
    { status: false, message: "User Name is invalid" }
- If password is invalid, send response as:
    { status: false, message: "Password is invalid" }
*/
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('user.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: false, message: 'Error reading user data' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.json({ status: false, message: 'User Name is invalid' });
        }
        if (user.password !== password) {
            return res.json({ status: false, message: 'Password is invalid' });
        }
        res.json({ status: true, message: 'User Is valid' });
    });
});

/*
- Modify /logout route to accept username as parameter and display message
  in HTML format like <b>${username} successfully logged out.</b>
*/
router.get('/logout', (req, res) => {
    const username = req.query.username;
    if (username) {
        res.send(`<b>${username} successfully logged out.</b>`);
    } else {
        res.send('<b>Username is required to log out.</b>');
    }
});

/*
Add error handling middleware to handle the below error:
- Return a 500 page with the message "Server Error"
*/
app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
});

// Use the router
app.use('/', router);

// Start the server
const port = process.env.port || 8085;
app.listen(port, () => {
    console.log(`Web Server is listening at port ${port}`);
});
