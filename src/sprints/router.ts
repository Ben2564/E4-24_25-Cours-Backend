import { NextFunction, Request, Router } from "express"
import {  DbSprint } from "./db/models"
import { StatusCodes } from "http-status-codes"

export const createSprintRoutes = () => {
  const sprintRoutes = Router()
  sprintRoutes.post(
    '/',
    async (req, res, next) => {
      try {
        const newStory = new DbSprint(req.body);
        await newStory.save();
        res.sendStatus(StatusCodes.CREATED);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
  
  
  sprintRoutes.put(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbSprint.updateOne({ _id: req.params.id }, req.body);
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  sprintRoutes.get(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbSprint.findById(req.params.id);
        res.json(story);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  sprintRoutes.get(
    '/',
    async (req, res, next) => {
      try {
        const stories = await DbSprint.find().limit(20);
        res.json(stories);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  sprintRoutes.delete(
    '/:id',
    async (req, res, next) => {
      try {
        await DbSprint.deleteOne({ _id: req.params.id });
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  return sprintRoutes
}