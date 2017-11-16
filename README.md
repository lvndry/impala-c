# Impala
**Impala-c** is the best way to compile small and medium projects made in C and C++

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
The main file has to be in the root directory so that impala can compile all the files in the subdirectories

You also have the possibilty to not compile some file by passing their absolute paths in a .impignore file

Impala will then generate a makefile in the root directory with also a bin directory containing the executable, a build directory with all the dependencies and a log directory

Once you compiled once you can also choose not to generate a makefile

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
You only need git and npm to install impala:
```
git clone https://github.com/lvndry/impala-c
cd impala-c
npm install
npm start
```
## Author
[Landry Monga](https://github.com/lvndry)
