const router = require('express').Router()
const Category = require('../models/category')
const Question = require('../models/questions')
const Result = require('../models/result')
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_CODE, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.userId = user.id; 
            next(); 
        });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


router.get('/categories',authMiddleware, async (req, res) => {
  const {userId}  = req
  try {
    const categories = await Category.find({}, 'name');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

router.get('/questions/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = await Question.find({ quizId: categoryId });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching questions' });
  }
});

router.post('/submit-quiz', authMiddleware, async (req, res) => {
  try {
    const {userId}  = req;
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'quizId and answers are required' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No matching questions found' });
    }

    let correctCount = 0;
    questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      if (userAnswer && userAnswer.selectedOption === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 60;

    const newResult = new Result({
      userId,
      quizId,
      score,
      passed,
      answers
    });
    await newResult.save();

    res.json({ success: true, score, passed,totalQuestions,correctCount,resultId: newResult._id  });

  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.get('/certificate/:resultId', authMiddleware, async (req, res) => {
  try {
    const { resultId } = req.params;
    const {userId} = req

    const result = await Result.findById(resultId).populate('quizId').exec();
    if (!result || result.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Certificate not found or unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="certificate_${resultId}.pdf"`);

    doc.pipe(res);

    doc.save();
    doc.rect(0, 0, pageWidth, pageHeight).fill('#4598e0ff');
    doc.restore();

    doc.fontSize(26)
      .fillColor('black')
      .text('Certificate of Completion', margin, margin + 20, { width: pageWidth - 2 * margin, align: 'center' });
    
    doc.fontSize(26)
      .fillColor('black')
      .text('Quizz Pro', margin, margin + 60, { width: pageWidth - 2 * margin, align: 'center' });

    doc.fontSize(18)
      .text('This is to certify that', margin, margin + 110, { width: pageWidth - 2 * margin, align: 'center' });

    doc.fontSize(22)
      .text(user.name || 'Student', margin, margin + 140, { width: pageWidth - 2 * margin, align: 'center', underline: true });

    doc.fontSize(18)
      .text('has successfully completed the quiz', margin, margin + 175, { width: pageWidth - 2 * margin, align: 'center' });

    doc.fontSize(20)
      .text(`"${result.quizId.name}"`, margin, margin + 205, { width: pageWidth - 2 * margin, align: 'center', italics: true });

    doc.fontSize(18)
      .text(`with a score of ${result.score}%.`, margin, margin + 240, { width: pageWidth - 2 * margin, align: 'center' });
    
      doc.fontSize(14)
      .text(`Date: ${result.date.toDateString()}`, margin, pageHeight - margin - 90, { width: pageWidth - 2 * margin, align: 'right' });

    doc.font('Times-Italic')
      .fontSize(12)
      .fillColor('#000000')
      .text('Quizz Pro', margin, pageHeight - margin - 60);

    doc.fontSize(14)
      .text('_____________________________', margin, pageHeight - margin - 40);

    doc.fontSize(12)
      .text('Authorized Signature', margin, pageHeight - margin - 25);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }

});

router.get('/my-results', authMiddleware, async (req, res) => {
  try {
    const {userId} = req;
    const results = await Result.find({ userId })
      .populate('quizId', 'name')
      .sort({ date: -1 });

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ success: false, message: 'Server error fetching results' });
  }
});


module.exports = router;