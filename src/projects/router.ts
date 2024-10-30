import { NextFunction, Request, Router } from "express"
import { DbProject } from "./db/models"
import { DbStory } from "../stories/db/models" 
import { StatusCodes } from "http-status-codes"
import createHttpError from "http-errors"

export const createProjectRoutes = () => {
    const projectRoutes = Router()
    projectRoutes.post(
      '/',
      ( req,
        res,
        next
      ) => {
        try {
            const newProject = new DbProject(req.body)
            newProject.save()
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.put(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
          console.log("body",req.body);
          
            let project = await DbProject.updateOne({_id:req.params.id},req.body)
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.get(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
            let project = await DbProject.findById(req.params.id)
            project?.populate('leader')
            res.json(project)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.get(
      '/',
      async ( req,
        res,
        next
      ) => {
        try {
            let projects = await DbProject.find().limit(20).populate('leader','_id name email')
            res.json(projects)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.delete(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
            await DbProject.deleteOne(req.body.id)
            res.sendStatus(StatusCodes.OK)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.post(
      '/:id/stories',
      async ( req,
        res,
        next
      ) => {
        let project = await DbProject.findById(req.params.id);
        let story = await DbStory.findById(req.body.story);
        if (!story) {
          next(createHttpError(StatusCodes.NOT_FOUND, 'Not found'))
          return
        }
        if (!project) {
          next(createHttpError(StatusCodes.NOT_FOUND, 'Not found'))
          return
        }
        try {    
          if (!project.stories.some(s => s.story.equals(story._id))) {
            project.stories.push({ story: story._id, assignees: [] })
            await project.save()
            res.sendStatus(StatusCodes.OK)
          } else {
            res.sendStatus(StatusCodes.CONFLICT)
          }
        } catch (error) {
          console.log(error);
          next(error);
        }
      }
    )

    return projectRoutes
}