const app = require('./app');
const { closeDBConnection } = require('./db');

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT}`);
});

// Close the database connection when the Node process ends
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed.');
        closeDBConnection();
        process.exit(0);
    });
});