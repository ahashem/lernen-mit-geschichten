.PHONY: hooks
hooks:
	git config core.hooksPath .githooks
	@echo "core.hooksPath -> .githooks"
