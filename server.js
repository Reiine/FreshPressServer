const express = require('express');
const cors = require('cors');
const quantity = require('./models/quantity');
const app = express();

app.use(express.json());
app.use(cors());
const port = 3000 || process.env.PORT;

app.post('/add', async (req, res) => {
  const {normalQuantity, otherQuantity, otherType, date, month} = req.body;
  try {
    const quantitySchema = await quantity({
      normalQuantity,
      otherQuantity,
      otherType,
      date: {
        day: date,
        month: month,
        year: new Date().getFullYear(),
      },
    });
    const saveQuantity = await quantitySchema.save();
    res.json('success');
  } catch (error) {
    res.json('Error', error.response ? error.response.data : error.message);
  }
});

app.post('/get-data', async (req, res) => {
  const {value} = req.body;
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
    res.status(500).json({error: 'An error occurred'});
  }
});

app.post('/delete', async (req, res) => {
  const {day, month, year} = req.body;
  try {
    const deletedData = await quantity.deleteOne({
      'date.day': day,
      'date.month': month,
      'date.year': year,
    });
    res.json({message: 'Data deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'An error occurred'});
  }
});

app.post('/edit', async (req, res) => {
  const {
    day,
    month,
    year,
    newDay,
    newMonth,
    newYear,
    otherQuantity,
    changeDate,
  } = req.body;

  try {
    // Find a document based on the date fields
    const getData = await quantity.findOne({
      'date.day': day,
      'date.month': month,
      'date.year': year,
    });

    if (getData) {
      const id = getData._id;
      const updateFields = {};

      // Update date fields if changeDate is true
      if (changeDate) {
        updateFields['date.day'] = newDay;
        updateFields['date.month'] = newMonth;
        updateFields['date.year'] = newYear;
      }

      // Update otherQuantity if provided
      if (otherQuantity !== undefined) {
        updateFields.normalQuantity = otherQuantity;
      }

      // Only perform the update if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        await quantity.updateOne({_id: id}, {$set: updateFields});
      }

      console.log(getData);
      res.json({getData: getData, message: 'Successfully edited'});
    } else {
      res.status(404).json({error: 'No document found'});
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({error: 'Server error'});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
