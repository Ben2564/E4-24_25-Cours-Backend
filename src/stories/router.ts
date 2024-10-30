import { NextFunction, Request, Router } from "express"
import {  DbStory } from "./db/models"
import { StatusCodes } from "http-status-codes"

export const createStoryRoutes = () => {
  const storyRoutes = Router()
  storyRoutes.post(
    '/',
    async (req, res, next) => {
      try {
        const newStory = new DbStory(req.body);
        await newStory.save();
        res.sendStatus(StatusCodes.CREATED);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
  
  
  storyRoutes.put(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbStory.updateOne({ _id: req.params.id }, req.body);
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  storyRoutes.get(
    '/:id',
    async (req, res, next) => {
      try {
        const story = await DbStory.findById(req.params.id);
        res.json(story);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  storyRoutes.get(
    '/',
    async (req, res, next) => {
      try {
        const stories = await DbStory.find().limit(20);
        res.json(stories);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  
  storyRoutes.delete(
    '/:id',
    async (req, res, next) => {
      try {
        await DbStory.deleteOne({ _id: req.params.id });
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
  return storyRoutes
}