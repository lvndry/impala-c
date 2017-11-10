CC=gcc
CFLAGS= -O3 -Wall
LDFLAGS=
EXEC=ct

all: $(EXEC)

ct: user.o main.o hello.o 
	 $(CC) -o $@ $^ $(LDFLAGS)

user.o: user.c
	 $(CC) -o $@ -c $< $(CFLAGS)

main.o: main.c
	 $(CC) -o $@ -c $< $(CFLAGS)

hello.o: hello.c
	 $(CC) -o $@ -c $< $(CFLAGS)

clean:
	 rm -rf /home/lvndry/Github/impala/_tests/ct/*.o

mrproper: clean
	 rm -rf $(EXEC)
