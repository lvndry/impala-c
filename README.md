# Impala
**Impala-c** is a tool to quickly compile small and medium projects made in C and C++

## Compiling a project
```
.
├── hello
│   ├── hello.c
│   └── hello.h
├── .impignore
├── main.c
└── user
    ├── user.c
    └── user.h
```
The main file has to be in the root directory so that impala can compile all the files c/c++ in the subdirectories

You also have the possibilty to not compile some files by passing their absolute paths in a .impignore file

Folder after compilation:
```
.
├── bin
│   └── release
│       └── impala_demo
├── build
│   └── release
│       ├── hello
│       │   ├── hello.d
│       │   └── hello.o
│       ├── main.d
│       ├── main.o
│       └── user
│           ├── user.d
│           └── user.o
├── hello
│   ├── hello.c
│   └── hello.h
├── impala_demo -> bin/release/impala_demo
├── .impignore
├── logs
│   ├── gcc_errors.log
│   └── make.log
├── main.c
├── makefile
└── user
    ├── user.c
    └── user.h
```

## Installation

```
git clone https://github.com/lvndry/impala-c
cd impala-c
npm install
npm start
```
## Imapala go
> [Imapala-go](https://github.com/lvndry/impala-go)

## Author
[Landry Monga](https://github.com/lvndry)
