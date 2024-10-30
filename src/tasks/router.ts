import { NextFunction, Request, Router } from "express"
import {  DbTask } from "./db/models"
import { StatusCodes } from "http-status-codes"

export const createTaskRoutes = () => {
  const taskRoutes = Router()
  taskRoutes.post(
    '/',
    async (req, res, next) => {
      try {
        const newStory = new DbTask(req.body);
        await newStory.save();
        res.sendStatus(StatusCodes.CREATED);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
  
  
  taskRoutes.put(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbTask.updateOne({ _id: req.params.id }, req.body);
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  taskRoutes.get(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbTask.findById(req.params.id);
        res.json(story);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  taskRoutes.get(
    '/',
    async (req, res, next) => {
      try {
        const stories = await DbTask.find().limit(20);
        res.json(stories);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  taskRoutes.delete(
    '/:id',
    async (req, res, next) => {
      try {
        await DbTask.deleteOne({ _id: req.params.id });
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  return taskRoutes
}