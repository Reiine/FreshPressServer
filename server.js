const express = require('express');
const cors = require('cors');
const quantity = require('./models/quantity');
const app = express();

app.use(express.json());
app.use(cors());
const port = 3000 || process.env.PORT;


app.post('/add', async (req,res)=>{
    const {normalQuantity,otherQuantity} = req.body;
    try {
        const quantitySchema = await quantity({
            normalQuantity,otherQuantity
        })
        const saveQuantity = await quantitySchema.save();
        res.json("success");
    } catch (error) {
        console.log("Error",error);
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


app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
})
