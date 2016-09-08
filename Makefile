all: test

.PHONY: help
help:
	@echo "Please use \`make <target>' where <target> is one of"

	@echo "  copy_env    Copies the 'env.example.ini' file to 'env.ini'."
	@echo "  env         Interactively create env.ini from env.example.ini."
	@echo "  init_db     Migrate and seed the database."

.PHONY: copy_env
copy_env:
	@bin/copy_env

.PHONY: env
env:
	@bin/env

.PHONY: init_db
init_db:
	@bin/init_db
