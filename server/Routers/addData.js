const router = require('express').Router();
const Category = require('../models/category')
const Question = require('../models/questions')


router.post('/add-categories', async (req,res)=>{
    console.log('q')
    const {categories} = req.body
    try{
        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ success: false, message: 'Categories array is required' });
        }
        const insertedCategories = await Category.insertMany(categories, { ordered: false });
        res.status(201).json({ success: true, insertedCategories });
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
});

// routers/quizRoutes.js (part of question insertion)

router.post('/add-questions', async (req, res) => {
  try {
    const questions = req.body.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions array is required' });
    }

    console.log(questions)

    const questionsWithQuizId = await Promise.all(
      questions.map(async (q) => {
        const category = await Category.findOne({ name: q.categoryName });
        if (!category) throw new Error(`Category '${q.categoryName}' not found`);

        return {
          quizId: category._id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer
        };
      })
    );

    const insertedQuestions = await Question.insertMany(questionsWithQuizId, { ordered: false });
    res.status(201).json({ success: true, insertedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error inserting questions' });
  }
});


module.exports=router;