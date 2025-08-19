import { Router } from 'express';
import axios from 'axios';
import { Op } from 'sequelize';
import { models } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const soon = await models.Item.findAll({
    where: {
      user_id: req.user.id,
      expiry_date: { [Op.lte]: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
    },
    order: [['expiry_date', 'ASC']]
  });
  const ingredients = soon.map((i) => i.name).slice(0, 5);

  if (!process.env.SPOONACULAR_API_KEY || ingredients.length === 0) {
    return res.json({ recipes: ingredients.map((n, idx) => ({ id: idx + 1, title: `Use ${n} Stir-fry`, ingredients: [n, 'Salt', 'Oil'], steps: ['Chop', 'Stir-fry', 'Serve'] })) });
  }

  try {
    const query = ingredients.join(',');
    const resp = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: { apiKey: process.env.SPOONACULAR_API_KEY, ingredients: query, number: 5 }
    });
    const recipes = resp.data.map((r) => ({ id: r.id, title: r.title, ingredients: r.usedIngredients?.map((x) => x.name) || [], steps: [] }));
    res.json({ recipes });
  } catch (err) {
    console.error(err);
    res.json({ recipes: ingredients.map((n, idx) => ({ id: idx + 1, title: `Use ${n} Salad`, ingredients: [n, 'Olive oil', 'Lemon'], steps: [] })) });
  }
});

export default router;