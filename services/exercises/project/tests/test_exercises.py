# services/users/project/tests/test_users.py


import json
import unittest

from project import db
from project.api.models import Exercise
from project.tests.base import BaseTestCase
from project.tests.utils import add_exercise


class TestExerciseService(BaseTestCase):
    """Tests for the Exercises Service."""

    def test_add_exercise(self):
        """Ensure a new exercise can be added to the database."""
        exercise = add_exercise(body='Define a function that returns the sum of two integers.', test_code='sum(2, 2)', test_code_solution='4')
        # update exercise
        user = Exercise.query.filter_by(body='Define a function that returns the sum of two integers.').first()
        exercise.body = 'Edited body'
        db.session.commit()
        with self.client:
            response = self.client.post(
                '/exercises',
                data=json.dumps({
                    'body': 'Define a function that returns the product of two integers.',
                    'test_code': 'product(2, 2)',
                    'test_code_solution': '4'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn('exercise was added!', data['message'])
            self.assertIn('success', data['status'])


if __name__ == '__main__':
    unittest.main()
