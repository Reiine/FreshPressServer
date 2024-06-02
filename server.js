const express = require('express');
const cors = require('cors');
const quantity = require('./models/quantity');
const app = express();

app.use(express.json());
app.use(cors());
const port = 3000 || process.env.PORT;


app.post('/add', async (req,res)=>{
    const {normalQuantity,otherQuantity, otherType,date, month} = req.body; 
    try {
        const quantitySchema = await quantity({
            normalQuantity,otherQuantity, otherType,
            date:{
                day: date,
                month: month,
                year: new Date().getFullYear()
            }
        })
        const saveQuantity = await quantitySchema.save();
        res.json("success");
    } catch (error) {
        console.log("Error",error.response ? error.response.data : error.message);
    }
})

app.post('/get-data', async (req, res) => {
    const { value } = req.body;
    try {
        let getData;
        if (!value || value === 'all') { 
            getData = await quantity.find({});
        } else {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1; 
            getData = await quantity.find({'date.month': month});
        }
        res.json(getData);
    } catch (error) {
        console.log("error occurred", error);
        res.status(500).json({ error: 'An error occurred' }); 
    }
});

app.post('/get-ag-data', async (req, res) => {
    try {
        const aggregateData = await quantity.aggregate([
            {
                $group: {
                    _id: {
                        year: '$date.year',
                        month: '$date.month',
                    },
                    totalNormalQuantity: { $sum: '$normalQuantity' },
                    totalSaariQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ['$otherType', 2] }, // Saari
                                '$otherQuantity',
                                0
                            ]
                        }
                    },
                    totalDhotiQuantity: {
                        $sum: {
                            $cond: [
                                { $eq: ['$otherType', 3] }, // Dhoti
                                '$otherQuantity',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);
        res.status(200).json(aggregateData);
    } catch (error) {
        console.error('Error fetching aggregated data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})
