const express = require('express')
const app = express()
const schoolRoutes = require('./routes/schoolRoutes')

require('dotenv').config()
app.use(express.json())

//school routes
app.use('/api', schoolRoutes)
app.get('/', (req, res) => {
    res.send('Project is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
