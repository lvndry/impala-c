CC=g++
CFLAGS= -O3 -Wall
LDFLAGS=
EXEC=ct

all: $(EXEC)

ct: user.o main.o hello.o 
	 $(CC) -o $@ $^ $(LDFLAGS)

user.o: user.cpp
	 $(CC) -o $@ -c $< $(CFLAGS)

main.o: main.cpp
	 $(CC) -o $@ -c $< $(CFLAGS)

hello.o: hello.cpp
	 $(CC) -o $@ -c $< $(CFLAGS)

clean:
	 rm -rf /home/lvndry/Github/impala/_tests/ct/user.c

mrproper: clean
	 rm -rf $(EXEC)
