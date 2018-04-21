---
---
 lcov --capture --directory . --output-file abc.info
 genhtml -o results abc.info
 
Reference 
https://github.com/bilke/cmake-modules/blob/master/CodeCoverage.cmake
https://gist.github.com/mrash/8383288c66f973a2bbb2
http://www.cnblogs.com/ChinaHook/p/5508660.html
