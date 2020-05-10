# services/exercises/project/api/exercises.py


from sqlalchemy import exc
from flask import Blueprint, request
from flask_restful import Resource, Api

from project import db
from project.api.models import Exercise
from project.api.utils import authenticate_restful


exercises_blueprint = Blueprint('exercises', __name__)
api = Api(exercises_blueprint)


class ExerciseList(Resource):

    def get(self):
        """Get all exercises"""
        response_object = {
            'status': 'success',
            'data': {
                'exercises': [
                    exercise.to_json() for exercise in Exercise.query.all()
                ]
            }
        }
        return response_object, 200


api.add_resource(ExerciseList, '/exercises')