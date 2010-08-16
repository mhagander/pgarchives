all: pgarchives.xpi

.PHONY: pgarchives.xpi
pgarchives.xpi:
	rm -f pgarchives.xpi
	zip pgarchives.xpi -r . -x pgarchives.xpi Makefile *~ ".git/*" .*

clean:
	rm -f pgarchives.xpi
