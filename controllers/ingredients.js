const express = require('express');
const router = express.Router();

const Ingredient = require('../models/Ingredient')

router.get('/add', async (req, res) => {
    try {
        console.log('1');
        const ingredients = await Ingredient.find({});
        console.log(ingredients);
        res.render('ingredients/index.ejs', { ingredients });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.post('/add', async (req, res) => {
    const { name } = req.body;
    try {
        const newIngredient = new Ingredient({ name });
        await newIngredient.save();
        if (newIngredient) {
            return res.redirect('/ingredients/add');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});


module.exports = router;
