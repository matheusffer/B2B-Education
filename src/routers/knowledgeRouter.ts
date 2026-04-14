import { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { trailController } from '../controllers/trailController';
import { quizController } from '../controllers/quizController';
import { certificateController } from '../controllers/certificateController';

export const knowledgeRouter = Router();

// Courses (Content)
knowledgeRouter.get('/courses', courseController.list);
knowledgeRouter.post('/courses', courseController.create);

// Trails
knowledgeRouter.get('/trails', trailController.list);
knowledgeRouter.get('/trails/:id', trailController.getById);

// Quizzes
knowledgeRouter.get('/quizzes/:id', quizController.getById);
knowledgeRouter.post('/quizzes/:id/attempts', quizController.submitAttempt);

// Certificates
knowledgeRouter.post('/certificates/issue', certificateController.issue);
