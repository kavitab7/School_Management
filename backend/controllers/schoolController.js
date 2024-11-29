const db = require('../config/dbConfig')
const haversine = require('haversine-distance')

//add new school
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Database error", error });
        console.log(error)
    }
}

//list schools sorted by proximity
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    try {
        const [schools] = await db.execute('SELECT * FROM schools');

        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }

        const sortedSchools = schools.map(school => {
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            return { ...school, distance: haversine(userLocation, schoolLocation) };
        }).sort((a, b) => a.distance - b.distance)

        res.status(200).json(sortedSchools)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Database error", error });
    }
}    
