# Running tests

This repository uses Django's test runner to run all backend tests. To run the tests locally:

1. Activate your Python environment, e.g. using the provided venv:

```powershell
venv311\Scripts\Activate.ps1
```

2. Install the dependencies if needed:

```powershell
python -m pip install -r requirements.txt
```

3. Run the tests:

```powershell
python manage.py test
```

Notes:
- If you encounter missing packages like Pillow or SendGrid, install them via `pip` (they are already in `backend/requirements.txt`).
- To run linting and static checks locally (recommended):

```powershell
pip install -r requirements-dev.txt
ruff check .
black --check .
isort --check-only .
mypy backend --ignore-missing-imports
python manage.py check
```

- To use pre-commit hooks locally:

```powershell
# install the package (once per repo):
pip install pre-commit
pre-commit install
# to run hooks against all files (useful after adding hooks):
pre-commit run --all-files
```
- The tests create a temporary in-memory database and will not affect your production data.
