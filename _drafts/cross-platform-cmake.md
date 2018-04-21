---
layout: post
title: "Cross-platform CMake project setup"
categories: C++ CMake
---

I`m building a cross-platform C++ project with CMake. Here is a problem when building the project on Windows.




key setup for windows:
	
	set (CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
	set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
