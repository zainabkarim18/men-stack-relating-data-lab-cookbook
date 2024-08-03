const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe.js');
const Ingredient = require('../models/Ingredient.js');


router.get('/', async (req, res) => {
    try {
        const userId = req.session.user._id
        const allrecipes = await Recipe.find({ owner: userId }).populate('ingredients');
        res.render('recipes/index.ejs', { allrecipes });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.get('/new/:recipeId', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        console.log(ingredients);
        res.render('recipes/new.ejs', { ingredients });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.post('/new/:recipeId', async (req, res) => {
    console.log('12');
    try {
        console.log('22');
        const userId = req.session.user._id
        const newRecipe = new Recipe(req.body);
        console.log(newRecipe);
        newRecipe.owner = userId
        console.log(userId + 'user');

        await newRecipe.save();
        res.redirect(`/recipes`)
    } catch (err) {
        console.log(err);
        res.redirect('/')
    }
});

router.get('/show/:recipeId', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const recipeId = req.params.recipeId
        console.log(recipeId);

        const recipe = await Recipe.findById(recipeId).populate('ingredients');

        if (!recipe) {
            return res.send('Recipe not found');
        }
        if (recipe.owner.equals(userId)) {
            res.render('recipes/show.ejs', { recipe });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.delete('/delete/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.session.user._id;

        const delrecipe = await Recipe.findById(recipeId);

        if (!delrecipe) {
            return res.send('Recipe not found');
        }

        if (delrecipe.owner.equals(userId)) {
            await delrecipe.deleteOne({ _id: recipeId });
            res.redirect('/recipes');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.get('/edit/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.session.user._id;

        const recipe = await Recipe.findById(recipeId).populate('ingredients');
        const ingredients = await Ingredient.find({});

        if (!recipe) {
            return res.send('Recipe not found');
        }

        if (!recipe.owner.equals(userId)) {
            return res.status(403).send('Unauthorized access');
        }
        res.render('recipes/edit.ejs', { recipe, ingredients });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});



router.put('/update/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.session.user._id;

        const updateRecipe = await Recipe.findById(recipeId);

        if (!updateRecipe) {
            return res.send('Recipe not found');
        }

        if (!updateRecipe.owner.equals(userId)) {
            return res.send('Unauthorized access');
        }
        updateRecipe.set(req.body);
        await updateRecipe.save();


        res.redirect(`/recipes`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});


module.exports = router;