CC=gcc
CFLAGS= -O3 -Wall
EXEC=hello
LDFLAGS= 

all : $(EXEC)

hello: _tests/cTests/main.o _tests/cTests/hello.o
		$(CC) -o $@ $^ $(LDFLAGS)

hello.o: hello.c
	$(CC) -o $@ -c $< $(CFLAGS)

main.o: main.c hello.h user.h
	$(CC) -o $@ -c $< $(CFLAGS)

clean:
	rm -rf *.o

mrproper: clean
	rm -rf $(EXEC)