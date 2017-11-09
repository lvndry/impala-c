CC=gcc
CFLAGS= -O3 -Wall
LDFLAGS=
EXEC=test

all: $(EXEC)

test: /home/lvndry/Github/impala/_tests/test.o
	 $(CC) -o $@ $^ $(LDFLAGS)

test.o: test.c
	 $(CC) -o $@ -c $< $(CFLAGS)

clean:
	rm -rf /home/lvndry/Github/impala/_tests/*.o

mrproper: clean
	 rm -rf $(EXEC)
