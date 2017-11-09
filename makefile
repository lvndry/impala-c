CC=gcc
CFLAGS= -O3 -Wall
EXEC=test
LDFLAGS=

all: $(EXEC)

test: /home/lvndry/Github/impala/_tests/test.o
	 $(CC) -o $@ $^ $(LDFLAGS)

test.o: test.c
	 $(CC) -o $@ -c $< $(CFLAGS)

clean:
	 rm -rf *.o

mrproper: clean
	 rm -rf $(EXEC)
