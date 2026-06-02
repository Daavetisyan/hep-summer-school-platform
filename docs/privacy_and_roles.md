# Privacy and Role Policy

## Main rule

No student can see another student's grade, score, answers, or progress.

## Visibility matrix

| Data type | Student | Teacher | Mentor | Admin |
|---|---:|---:|---:|---:|
| Own simulation runs | yes | yes | yes | yes |
| Own quiz answers | yes | yes | yes | yes |
| Own score | yes | yes | yes | yes |
| Other students' scores | no | yes | yes | yes |
| Class dashboard | no | yes | yes | yes |
| Class CSV export | no | yes | yes | yes |
| Class ROOT export | no | yes | yes | yes |
| Manage questions | no | yes | yes | yes |
| Manage users/classes | no | limited | limited | yes |

## API enforcement

The current MVP uses role checks in:

- `app/core/security.py`
- `progress/student/{student_id}`
- `progress/class/{class_id}`
- `quizzes/student/{student_id}`
- `quizzes/class/{class_id}`
- `exports/student/{student_id}/csv`
- `exports/class/{class_id}/csv`
- `exports/class/{class_id}/root`

## Production requirements

Before real deployment:

1. Replace header-based MVP identity with real authentication.
2. Use secure password hashing or OAuth.
3. Use HTTPS.
4. Replace header-provided teacher-class assignments with persistent verified assignments.
5. Log access to grade/progress endpoints.
6. Add admin approval for mentor access.
7. Make sure exported files are temporary and not publicly accessible.
8. Add parental/guardian consent rules if needed.
