require('../config/config.js');
require('../script/impignore.js');

let excludedFiles = readImpignore();

function createMakeFile(compiler, execName, filePath, callback, dest="/"){
	let cmd = "printf '";
		cmd += "#### MAKEFILE FOR " + execName.toUpperCase() + " ####\n"
		cmd += "# The name of the executable to be created\n"
		cmd += "### Thanks to https://github.com/mbcrawfo/GenericMakefile ###\n"
		cmd += "### Project Settings ###\n"
		cmd += "BIN_NAME := " + execName + "\n"
		cmd += "# Compiler used\n"
		
		if(compiler === "gcc"){
			cmd += "CC ?= " + compiler + "\n"
			cmd += "# Extension of source files used in the project\n"
			cmd += "SRC_EXT = c\n" 
		}

		else if(compiler === "g++"){
			cmd += "CCXX ?= " + compiler + "\n"
			cmd += "# Extension of source files used in the project\n"
			cmd += "SRC_EXT = cpp\n" 
		}
		
		cmd += "#Files not to compile\n"
		cmd += "EXCLUDED= "
		
		for(let i = 0, len = excludedFiles.length; i < len; i++){
			cmd += excludedFiles[i] + " ";
		}
		cmd += "\n";

		cmd += "# Path to the source directory, relative to the makefile\n"
		cmd += "SRC_PATH = " + filePath + "\n"
		cmd += "# Space-separated pkg-config libraries used by this project\n"
		cmd += "LIBS =\n"
		cmd += "# General compiler flags\n"
		cmd += "COMPILE_FLAGS = -Wall -Wextra -g -O3\n" //Make an array of it
		cmd += "# Additional release-specific flags\n"
		cmd += "RCOMPILE_FLAGS = -D NDEBUG\n"
		cmd += "# Additional debug-specific flags\n"
		cmd += "DCOMPILE_FLAGS = -D DEBUG\n"
		cmd += "# Add additional include paths\n"
		cmd += "INCLUDES = -I $(SRC_PATH)\n"
		cmd += "# General linker settings\n"
		cmd += "LINK_FLAGS =\n"
		cmd += "# Destination directory, like a jail or mounted system\n"
		cmd += "DESTDIR = " + dest + "\n";
		cmd += "# Install path (bin/ is appended automatically)\n"
		cmd += "INSTALL_PREFIX = usr/local\n"
		cmd += "### End Project Settings ###\n\n"
		cmd += "# Obtains the OS type, either \"Darwin\" (OS X) or \"Linux\"\n"
		cmd += "UNAME_S:=$(shell uname -s)\n\n"
		cmd += "# Useful for debugging and adding features\n"
		cmd += "print-%%: ; @echo $*=$($*)\n\n"
		cmd += "# Shell used in this makefile\n"
		cmd += "SHELL = /bin/bash\n\n"
		cmd += "# Clear built-in rules\n"
		cmd += ".SUFFIXES:\n"
		cmd += "# Programs for installation\n"
		cmd += "INSTALL = install\n"
		cmd += "INSTALL_PROGRAM = $(INSTALL)\n"
		cmd += "INSTALL_DATA = $(INSTALL) -m 644\n\n"
		cmd += "# Append pkg-config specific libraries if need be\n"
		cmd += "ifneq ($(LIBS),)\n"
		cmd += "\tCOMPILE_FLAGS += $(shell pkg-config --cflags $(LIBS))\n"
		cmd += "\tLINK_FLAGS += $(shell pkg-config --libs $(LIBS))\n"
		cmd += "endif\n\n"
		cmd += "# Verbose option, to output compile and link commands\n"
		cmd += "export V := false\n"
		cmd += "export CMD_PREFIX := @\n"
		cmd += "ifeq ($(V),true)\n"
		cmd += "\tCMD_PREFIX :=\n"
		cmd += "endif\n\n"
		cmd += "# Combine compiler and linker flags\n"

		if(compiler === "gcc"){
			cmd += "release: export CFLAGS := $(CFLAGS) $(COMPILE_FLAGS) $(RCOMPILE_FLAGS)\n"
			cmd += "debug: export CFLAGS := $(CFLAGS) $(COMPILE_FLAGS) $(DCOMPILE_FLAGS)\n"
		}
		
		else if(compiler === "g++"){
			cmd += "release: export CXXFLAGS := $(CXXFLAGS) $(COMPILE_FLAGS) $(RCOMPILE_FLAGS)\n"
			cmd += "debug: export CXXFLAGS := $(CXXFLAGS) $(COMPILE_FLAGS) $(DCOMPILE_FLAGS)\n"
		}

		cmd += "release: export LDFLAGS := $(LDFLAGS) $(LINK_FLAGS) $(RLINK_FLAGS)\n"
		cmd += "debug: export LDFLAGS := $(LDFLAGS) $(LINK_FLAGS) $(DLINK_FLAGS)\n\n"
		cmd += "# Build and output paths\n"
		cmd += "release: export BUILD_PATH := build/release\n"
		cmd += "release: export BIN_PATH := bin/release\n"
		cmd += "debug: export BUILD_PATH := build/debug\n"
		cmd += "debug: export BIN_PATH := bin/debug\n"
		cmd += "install: export BIN_PATH := bin/release\n\n"
		cmd += "# Find all source files in the source directory, sorted by most recently modified\n"
		cmd += "ifeq ($(UNAME_S),Darwin)\n"
		cmd += "\tSOURCES = $(shell find $(SRC_PATH) -name \"*.$(SRC_EXT)\" | sort -k 1nr | cut -f2-)\n"
		cmd += "else\n"
		cmd += "\tSOURCES = $(shell find $(SRC_PATH) -name \"*.$(SRC_EXT)\" -printf \"%%T@\\\\t%%p\\\\n\" | sort -k 1nr | cut -f2-)\n"
		cmd += "endif\n\n"
		cmd += "#Filtering files in .impignore\n"
		cmd += "SOURCES := $(filter-out $(EXCLUDED), $(SOURCES))\n\n";
		cmd += "# fallback in case the above fails\n"
		cmd += "rwildcard = $(foreach d, $(wildcard $1*), $(call rwildcard,$d/,$2) \\\n"
		cmd += "\t\t\t$(filter $(subst *,%%,$2), $d))\n\n"
		cmd += "ifeq ($(SOURCES),)\n"
		cmd += "\tSOURCES := $(call rwildcard, $(SRC_PATH), *.$(SRC_EXT))\n"
		cmd += "endif\n\n"
		cmd += "# Set the object file names, with the source directory stripped\n"
		cmd += "# from the path, and the build path prepended in its place\n"
		cmd += "OBJECTS = $(SOURCES:$(SRC_PATH)/%%.$(SRC_EXT)=$(BUILD_PATH)/%%.o)\n"
		cmd += "# Set the dependency files that will be used to add header dependencies\n"
		cmd += "DEPS = $(OBJECTS:.o=.d)\n"
		cmd += "# Macros for timing compilation\n\n"
		cmd += "ifeq ($(UNAME_S),Darwin)\n"
		cmd += "\tCUR_TIME = awk \"BEGIN{srand(); print srand()}\"\n"
		cmd += "\tTIME_FILE = $(dir $@).$(notdir $@)_time\n"
		cmd += "\tSTART_TIME = $(CUR_TIME) > $(TIME_FILE)\n"
		cmd += "\tEND_TIME = read st < $(TIME_FILE) ; \\\n"
		cmd += "\t$(RM) $(TIME_FILE) ; \\ \n"
		cmd += "\tst=$$((`$(CUR_TIME)` - $$st)) ; \\\n"
		cmd += "\techo $$st\n"
		cmd += "else\n"
		cmd += "\tTIME_FILE = $(dir $@).$(notdir $@)_time\n"
		cmd += "\tSTART_TIME = date \"+%%s\" > $(TIME_FILE)\n"
		cmd += "\tEND_TIME = read st < $(TIME_FILE) ; \\\n"
		cmd += "\t\t$(RM) $(TIME_FILE) ; \\\n"
		cmd += "\t\tst=$$((`date \"+%%s\"` - $$st - 86400)) ; \\\n"
		cmd += "\t\techo `date -u -d @$$st \"+%%H:%%M:%%S\"`\n"
		cmd += "endif\n\n"
		cmd += "# Version macros\n"
		cmd += "USE_VERSION := false\n"
		cmd += "# If this is not a git repo or the repo has no tags, git describe will return non-zero\n"
		cmd += "ifeq ($(shell git describe > /dev/null 2>&1 ; echo $$?), 0)\n"
		cmd += "\tUSE_VERSION := true\n"
		cmd += "\tVERSION := $(shell git describe --tags --long --dirty --always | \\ \n"
		cmd += "\t\tsed \"s/v\([0-9]*\)\.\([0-9]*\)\.\([0-9]*\)-\?.*-\([0-9]*\)-\(.*\)/\\1 \\2 \\3 \\4 \\5/g\")\n"
		cmd += "\tVERSION_MAJOR := $(word 1, $(VERSION))\n"
		cmd += "\tVERSION_MINOR := $(word 2, $(VERSION))\n"
		cmd += "\tVERSION_PATCH := $(word 3, $(VERSION))\n"
		cmd += "\tVERSION_REVISION := $(word 4, $(VERSION))\n"
		cmd += "\tVERSION_HASH := $(word 5, $(VERSION))\n"
		cmd += "\tVERSION_STRING := \\ \n"
		cmd += "\t\t\"$(VERSION_MAJOR).$(VERSION_MINOR).$(VERSION_PATCH).$(VERSION_REVISION)-$(VERSION_HASH)\"\n"
		
		if(compiler === "gcc"){
			cmd += "\toverride CFLAGS := $(CFLAGS) \\\n"
		}
		
		else if(compiler === "g++"){
			cmd += "\toverride CXXFLAGS := $(CXXFLAGS) \\\n"
		}

		cmd += "\t\t\-D VERSION_MAJOR=$(VERSION_MAJOR) \\\n"
		cmd += "\t\t\-D VERSION_MINOR=$(VERSION_MINOR) \\\n"
		cmd += "\t\t\-D VERSION_PATCH=$(VERSION_PATCH) \\\n"
		cmd += "\t\t\-D VERSION_REVISION=$(VERSION_REVISION) \\\n"
		cmd += "\t\t\-D VERSION_HASH=\\\"$(VERSION_HASH)\\\"\n"
		cmd += "endif\n"
		cmd += "# Standard, non-optimized release build\n"
		cmd += ".PHONY: release\n"
		cmd += "release: dirs\n"
		cmd += "ifeq ($(USE_VERSION), true)\n"
		cmd += "\t@echo \"Beginning release build v$(VERSION_STRING)\"\n"
		cmd += "else\n"
		cmd += "\t@echo \"Beginning release build\"\n"
		cmd += "endif\n"
		cmd += "\t@$(START_TIME)\n"
		cmd += "\t@$(MAKE) all --no-print-directory\n"
		cmd += "\t@echo -n \"Total build time: \"\n"
		cmd += "\t@$(END_TIME)\n\n"
		cmd += "# Debug build for gdb debugging\n"
		cmd += ".PHONY: debug\n"
		cmd += "debug: dirs\n"
		cmd += "ifeq ($(USE_VERSION), true)\n"
		cmd += "\t@echo \"Beginning debug build v$(VERSION_STRING)\"\n"
		cmd += "else\n"
		cmd += "\t@echo \"Beginning debug build\"\n"
		cmd += "endif\n"
		cmd += "\t@$(START_TIME)\n"
		cmd += "\t@$(MAKE) all --no-print-directory\n"
		cmd += "\t@echo -n \"Total build time: \"\n"
		cmd += "\t@$(END_TIME)\n\n"
		cmd += "# Create the directories used in the build\n"
		cmd += ".PHONY: dirs\n"
		cmd += "dirs:\n"
		cmd += "\t@echo \"Creating directories\"\n"
		cmd += "\t@mkdir -p $(dir $(OBJECTS))\n"
		cmd += "\t@mkdir -p $(BIN_PATH)\n\n"
		cmd += "# Installs to the set path\n"
		cmd += ".PHONY: install\n"
		cmd += "install:\n"
		cmd += "\t@echo \"Installing to $(DESTDIR)$(INSTALL_PREFIX)/bin\"\n"
		cmd += "\t@$(INSTALL_PROGRAM) $(BIN_PATH)/$(BIN_NAME) $(DESTDIR)$(INSTALL_PREFIX)/bin\n\n"
		cmd += "# Uninstalls the program\n"
		cmd += ".PHONY: uninstall\n"
		cmd += "uninstall:\n"
		cmd += "\t@echo \"Removing $(DESTDIR)$(INSTALL_PREFIX)/bin/$(BIN_NAME)\"\n"
		cmd += "\t@$(RM) $(DESTDIR)$(INSTALL_PREFIX)/bin/$(BIN_NAME)\n\n"
		cmd += "# Removes all build files\n"
		cmd += ".PHONY: clean\n"
		cmd += "clean:\n"
		cmd += "\t@echo \"Deleting $(BIN_NAME) symlink\"\n"
		cmd += "\t@$(RM) $(BIN_NAME)\n"
		cmd += "\t@echo \"Deleting directories\"\n"
		cmd += "\t@$(RM) -r build\n"
		cmd += "\t@$(RM) -r bin\n\n"
		cmd += "# Main rule, checks the executable and symlinks to the output\n"
		cmd += "all: $(BIN_PATH)/$(BIN_NAME)\n"
		cmd += "\t@echo \"Making symlink: $(BIN_NAME) -> $<\"\n"
		cmd += "\t@$(RM) $(BIN_NAME)\n"
		cmd += "\t@ln -s $(BIN_PATH)/$(BIN_NAME) $(BIN_NAME)\n\n"
		cmd += "# Link the executable\n"
		cmd += "$(BIN_PATH)/$(BIN_NAME): $(OBJECTS)\n"
		cmd += "\t@echo \"Linking: $@\"\n"
		cmd += "\t@$(START_TIME)\n"

		if(compiler === "gcc")
			cmd += "\t$(CMD_PREFIX)$(CC) $(OBJECTS) $(LDFLAGS) -o $@\n"
		else if(compiler === "g++")
			cmd += "\t$(CMD_PREFIX)$(CXX) $(OBJECTS) $(LDFLAGS) -o $@\n"

		cmd += "\t@echo -en \"\t Link time: \"\n"
		cmd += "\t@$(END_TIME)\n\n"
		cmd += "# Add dependency files, if they exist\n"
		cmd += "-include $(DEPS)\n\n"
		cmd += "# Source file rules\n"
		cmd += "# After the first compilation they will be joined with the rules from the\n"
		cmd += "# dependency files to provide header dependencies\n"
		cmd += "$(BUILD_PATH)/%%.o: $(SRC_PATH)/%%.$(SRC_EXT)\n"
		cmd += "\t@echo \"Compiling: $< -> $@\"\n"
		cmd += "\t@$(START_TIME)\n"
		
		if(compiler === "gcc"){
			cmd += "\t$(CMD_PREFIX)$(CC) $(CFLAGS) $(INCLUDES) -MP -MMD -c $< -o $@\n"
		}

		else if(compiler === "g++"){
			cmd += "\t$(CMD_PREFIX)$(CXX) $(CXXFLAGS) $(INCLUDES) -MP -MMD -c $< -o $@\n"
		}

		cmd += "\t@echo -en \"\t Compile time: \"\n"
		cmd += "\t@$(END_TIME)"
		cmd += "' > makefile"
	
	shell.exec(cmd);
	
	if(typeof callback === 'function'){
		callback();
	}
}
