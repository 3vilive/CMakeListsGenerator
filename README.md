CMakeListGenerator
==================

I write this for convert a CPP project into CLion project :D

Usage
-----

```
node gen.js /path/to/your/cpp/project/dir
```

that will generated CMakeLists.txt on specified folder like follow

```
cmake_minimum_required(VERSION 3.8) project(CPP)
set(CMAKE_CXX_STANDARD 11)
SET(SOURCE_FILES main.cpp lib/math.h lib/math.cpp ...)
add_executable(CPP ${SOURCE_FILES})
```

Thanks
------

[node-walk](https://git.daplie.com/Daplie/node-walk)
