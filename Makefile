build:
	pandoc index.md -o index.html
	prettier --write index.html
