# services/exercises/project/tests/test_exercise_model.py


import unittest

from sqlalchemy.exc import IntegrityError

from project import db
from project.api.models import Exercise
from project.tests.base import BaseTestCase


class TestUserModel(BaseTestCase):

    def test_add_exercise(self):
        exercise = Exercise(body='Define a function that returns the sum of two integers.', test_code='sum(2, 2)', test_code_solution='4')
        db.session.add(exercise)
        db.session.commit()
        self.assertTrue(exercise.id)
        self.assertEqual(exercise.body, 'Define a function that returns the sum of two integers.')
        self.assertEqual(exercise.test_code, 'sum(2, 2)')
        self.assertEqual(exercise.test_code_solution, '4')


if __name__ == '__main__':
    unittest.main()
