const express = require('express');
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const session = require("express-session");
const Instance = require("./utils/singleton");

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    setTimeout(next, 800);
})


app.use(session({
    secret: Instance.getInstanceHelper().getSecretKey(),
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: Instance.getInstanceHelper().getMaxAge() * 24 * 60 * 60 * 1000
    }
}));


app.get('/', (req, res, next) => {
    res.status(200).send('Wellcome Roy');
})


const apis = Instance.getInstanceHelper().getApis();

for (let api of apis) {
    app.use('/api/v1/' + api, require('./core/' + api + '/route'));
}


// Page not found
app.use((req, res, next) => {
    return Instance.getInstanceStatus().error(res, 'API not found', 404);
})

// Check cheating system
app.use((error, req, res, next) => {
    return Instance.getInstanceStatus().error(res, `System error: ${error.message}`);
})

// server listen
const PORT = Instance.getInstanceHelper().getPort();
app.listen(PORT, () => {
    console.log(`API is running at http://localhost:${PORT}`);
});