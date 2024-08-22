const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/indoor-nav', { useNewUrlParser: true, useUnifiedTopology: true });

const StopSchema = new mongoose.Schema({
    name: String,
    coordinates: { type: [Number], default: [0, 0] }  // Dummy coordinates for now
});

const Stop = mongoose.model('Stop', StopSchema);

// API to get stops
app.get('/stops', async (req, res) => {
    const stops = await Stop.find();
    res.json(stops);
});

// API to add a new stop
app.post('/addStop', async (req, res) => {
    const newStop = new Stop({
        name: req.body.name,
        coordinates: [0, 0]  // Should be dynamically set based on user's current position
    });
    await newStop.save();
    res.status(201).send('Stop added');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
